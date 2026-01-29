import { createClient } from "@supabase/supabase-js";

import ClientGate from "./ClientGate";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* ===========================
   TIMEZONE UTILS (ROME SAFE)
=========================== */
function romeOffsetMinutesForDate(y: number, m: number, d: number) {
  const probe = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    timeZoneName: "shortOffset",
  }).formatToParts(probe);

  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  const match = tz.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);

  const offsetH = match ? Number(match[1]) : 0;
  const offsetM = match && match[2] ? Number(match[2]) : 0;

  return offsetH * 60 + (offsetH >= 0 ? offsetM : -offsetM);
}

function romeLocalToUtcDate(dateStr: string, hhmm: string) {
  const [Y, M, D] = dateStr.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);

  const offsetMin = romeOffsetMinutesForDate(Y, M, D);
  const utcMs = Date.UTC(Y, M - 1, D, hh, mm, 0) - offsetMin * 60_000;

  return new Date(utcMs);
}

function romeTodayDateStr() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;

  return `${y}-${m}-${d}`;
}

function romeTomorrowDateStr() {
  const base = new Date(`${romeTodayDateStr()}T12:00:00`);
  base.setDate(base.getDate() + 1);

  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function romeDayRangeUtc(dateStr: string) {
  const start = romeLocalToUtcDate(dateStr, "00:00");
  const end = new Date(
    romeLocalToUtcDate(dateStr, "23:59").getTime() + 59_999
  );

  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
  };
}

/* ===========================
   PAGE
=========================== */
export default async function SalonDashboardPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { staff_key?: string; key?: string };
}) {
  const slug = params.slug;
  const raw = (searchParams as any).staff_key ?? (searchParams as any).key ?? "";
  const staffKey = (Array.isArray(raw) ? raw[0] : raw).trim();

  /* 1) Salone + staff_secret */
  const { data: salon, error: salonErr } = await supabase
    .from("salons")
    .select("id,name,slug,staff_secret")
    .eq("slug", slug)
    .single();

  if (salonErr || !salon) {
    return <div style={{ padding: 24 }}>Salone non trovato.</div>;
  }

/* 2) Check staff_secret */
const dbSecret = String(salon.staff_secret ?? "").trim();
const urlKey = String(staffKey ?? "").trim();

if (!dbSecret || urlKey !== dbSecret) {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
      <h1 style={{ margin: 0 }}>Accesso non autorizzato</h1>
      <p style={{ opacity: 0.8, marginTop: 10 }}>
        Apri la dashboard usando il link staff salvato nei preferiti.
      </p>
    </div>
  );
}

  /* 3) Date ranges */
  const today = romeTodayDateStr();
  const tomorrow = romeTomorrowDateStr();

  const todayRange = romeDayRangeUtc(today);
  const tomorrowRange = romeDayRangeUtc(tomorrow);

  /* 4) Appuntamenti */
  const baseSelect =
    "id,start_time,end_time,customer_name,contact_phone,note,status,cancelled_at";

  const { data: todayAppts } = await supabase
    .from("appointments")
    .select(baseSelect)
    .eq("salon_id", salon.id)
    .is("cancelled_at", null)
    .gte("start_time", todayRange.startISO)
    .lte("start_time", todayRange.endISO)
    .order("start_time", { ascending: true });

  const { data: tomorrowAppts } = await supabase
    .from("appointments")
    .select(baseSelect)
    .eq("salon_id", salon.id)
    .is("cancelled_at", null)
    .gte("start_time", tomorrowRange.startISO)
    .lte("start_time", tomorrowRange.endISO)
    .order("start_time", { ascending: true });

    /* 5) UI */
  function formatTimeRange(a: any) {
    const start = new Date(a.start_time);
    const end = new Date(a.end_time);

    const fmt = (d: Date) =>
      new Intl.DateTimeFormat("it-IT", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);

    return `${fmt(start)} → ${fmt(end)}`;
  }

  function DayBlock({ title, items }: { title: string; items: any[] }) {
    return (
      <div style={{ marginTop: 20 }}>
        <h2 style={{ marginBottom: 10 }}>{title}</h2>

        {!items || items.length === 0 ? (
          <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14 }}>
            Nessun appuntamento.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((a) => (
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
                  {formatTimeRange(a)} — {a.customer_name || "Cliente"}
                </div>

                <div style={{ fontSize: 14, marginTop: 6, opacity: 0.85 }}>
                  Tel: {a.contact_phone || "-"}
                </div>

                {a.note && (
                  <div style={{ marginTop: 8, fontSize: 14 }}>📝 {a.note}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <ClientGate />

      <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900 }}>
        <h1 style={{ marginBottom: 6 }}>Dashboard — {salon.name}</h1>
        <p style={{ opacity: 0.7 }}>Appuntamenti di oggi e domani</p>

        <DayBlock title="Oggi" items={todayAppts || []} />
        <DayBlock title="Domani" items={tomorrowAppts || []} />
      </div>
    </>
  );
}
