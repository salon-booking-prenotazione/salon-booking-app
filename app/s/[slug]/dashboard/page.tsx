import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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

  // mezzogiorno DST-safe
  const probe = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

  const tzParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    timeZoneName: "shortOffset",
  }).formatToParts(probe);

  const tz = tzParts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  const match = tz.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);

  const offsetH = match ? Number(match[1]) : 0;
  const offsetM = match && match[2] ? Number(match[2]) : 0;
  const offsetTotalMin = offsetH * 60 + (offsetH >= 0 ? offsetM : -offsetM);

  const utcMs = Date.UTC(y, m - 1, d, 0, 0, 0) - offsetTotalMin * 60_000;
  return new Date(utcMs).toISOString();
}

export default async function SalonDashboardPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { staff_key?: string };
}) {
  const slug = params.slug;

  // ✅ staff_key dal link (trim per evitare spazi invisibili)
  const staffKey = (searchParams.staff_key ?? "").trim();

  // 1) Recupero salone + secret (dal DB)
  const { data: salon, error: salonErr } = await supabase
    .from("salons")
    .select("id,name,slug,staff_secret")
    .eq("slug", slug)
    .single();

  if (salonErr || !salon) {
    return <div style={{ padding: 24 }}>Salone non trovato.</div>;
  }

  // ✅ secret dal DB (trim per evitare spazi invisibili)
  const secret = (salon.staff_secret ?? "").trim();

  // 2) Check staff_key
  if (!secret || !staffKey || staffKey !== secret) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
        <h1 style={{ margin: 0 }}>Accesso non autorizzato</h1>
        <p style={{ opacity: 0.8, marginTop: 10 }}>
          Apri la dashboard usando il link staff salvato nei preferiti.
        </p>

        {/* DEBUG (opzionale) → se vuoi puoi cancellarlo dopo */}
        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
          staff_key: {staffKey.slice(0, 12)}… • secret: {secret.slice(0, 12)}…
        </p>
      </div>
    );
  }

  // 3) Appuntamenti da oggi in poi
  const fromISO = startOfTodayRomeISO();

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(
      "id,start_time,end_time,customer_name,contact_phone,note,status,cancelled_at"
    )
    .eq("salon_id", salon.id)
    .is("cancelled_at", null)
    .gte("start_time", fromISO)
    .order("start_time", { ascending: true });

  if (error) {
    return <div style={{ padding: 24 }}>Errore caricamento appuntamenti.</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 920 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: 22, margin: 0 }}>Dashboard — {salon.name}</h1>

        {/* link pratici (manteniamo staff_key sempre) */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            href={`/admin/manual?staff_key=${encodeURIComponent(
              staffKey
            )}&slug=${encodeURIComponent(slug)}`}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              textDecoration: "none",
              color: "#111",
              background: "white",
              fontWeight: 600,
            }}
          >
            + Prenotazione manuale
          </a>

          <a
            href={`/s/${slug}`}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              textDecoration: "none",
              color: "#111",
              background: "white",
              fontWeight: 600,
            }}
          >
            Apri pagina prenotazione
          </a>
        </div>
      </div>

      <div style={{ marginTop: 14, opacity: 0.7, fontSize: 13 }}>
        Mostra appuntamenti di oggi e futuri (ordine cronologico).
      </div>

      <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
        {!appointments || appointments.length === 0 ? (
          <div
            style={{
              padding: 14,
              border: "1px solid #eee",
              borderRadius: 14,
              background: "white",
            }}
          >
            Nessun appuntamento da oggi in poi.
          </div>
        ) : (
          appointments.map((a: any) => {
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
                  border: "1px solid #e9e9e9",
                  borderRadius: 16,
                  padding: 14,
                  background: "white",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {a.customer_name ?? "Cliente"} — {startStr} → {endStr}
                </div>

                <div style={{ fontSize: 14, marginTop: 6, opacity: 0.85 }}>
                  Tel: {a.contact_phone ?? "-"}
                </div>

                {a.note && (
                  <div style={{ marginTop: 8, fontSize: 14, opacity: 0.9 }}>
                    📝 {a.note}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
