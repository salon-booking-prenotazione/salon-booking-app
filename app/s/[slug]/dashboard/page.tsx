import { createClient } from "@supabase/supabase-js";

// ❗ Server-side: niente "use client"
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Calcola inizio giornata di OGGI in Europe/Rome → UTC ISO
function startOfTodayRomeISO(): string {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);

  // Usato mezzogiorno per calcolare correttamente l'offset (DST safe)
  const probe = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

  const tzParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    timeZoneName: "shortOffset",
  }).formatToParts(probe);

  const tz = tzParts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  const match = tz.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);

  const offsetH = match ? Number(match[1]) : 0;
  const offsetM = match && match[2] ? Number(match[2]) : 0;
  const offsetTotalMin =
    offsetH * 60 + (offsetH >= 0 ? offsetM : -offsetM);

  const utcMs =
    Date.UTC(y, m - 1, d, 0, 0, 0) - offsetTotalMin * 60_000;

  return new Date(utcMs).toISOString();
}

export default async function SalonDashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // 1️⃣ recupero salone
  const { data: salon, error: salonErr } = await supabase
    .from("salons")
    .select("id,name,slug")
    .eq("slug", slug)
    .single();

  if (salonErr || !salon) {
    return <div style={{ padding: 24 }}>Salone non trovato.</div>;
  }

  // 2️⃣ query appuntamenti (OGGI + FUTURI)
  const fromISO = startOfTodayRomeISO();

  const { data: appointments, error } = await supabase
  .from("appointments")
  .select("id,start_time,end_time,customer_name,contact_phone,note") // ✅ SOLO colonne sicure
  .eq("salon_id", salon.id)
  .is("cancelled_at", null)
  .gte("start_time", fromISO)
  .order("start_time", { ascending: true });

if (error) {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <div>Errore caricamento appuntamenti.</div>
      <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
        {error.message}
      </pre>
    </div>
  );
}

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>
        Dashboard — {salon.name}
      </h1>

      {!appointments || appointments.length === 0 ? (
        <p>Nessun appuntamento da oggi in poi.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {appointments.map((a) => {
            const start = new Date(a.start_time);
            const end = new Date(a.end_time);

            const startStr = new Intl.DateTimeFormat("it-IT", {
              timeZone: "Europe/Rome",
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).format(start);

            const endStr = new Intl.DateTimeFormat("it-IT", {
              timeZone: "Europe/Rome",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).format(end);

            return (
              <div
                key={a.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 16,
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {a.customer_name ?? "Cliente"} — {startStr} → {endStr}
                </div>

                <div style={{ fontSize: 14, marginTop: 4 }}>
                  Tel: {a.contact_phone ?? "-"}
                </div>

                {a.note && (
                  <div style={{ marginTop: 8, fontSize: 14 }}>
                    📝 {a.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
