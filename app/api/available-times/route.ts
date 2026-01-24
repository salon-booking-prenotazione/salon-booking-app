import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const salon_id = url.searchParams.get("salon_id") || "";
  const service_id = url.searchParams.get("service_id") || "";
  const date = url.searchParams.get("date") || ""; // YYYY-MM-DD

  if (!salon_id || !service_id || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  /* ---------------------------------------------------
     1) Durata servizio
  --------------------------------------------------- */
  const { data: service, error: svcErr } = await supabaseServer
    .from("services")
    .select("duration_minutes")
    .eq("id", service_id)
    .eq("salon_id", salon_id)
    .single();

  if (svcErr) {
    return NextResponse.json({ error: svcErr.message }, { status: 400 });
  }

  const duration = Number(service?.duration_minutes || 30);

  /* ---------------------------------------------------
     2) Giorno settimana
     JS: 0=dom .. 6=sab
     DB: 1=lun .. 7=dom
  --------------------------------------------------- */
  const d = new Date(`${date}T12:00:00`);
  const jsDay = d.getDay(); // 0..6
  const weekday = jsDay === 0 ? 7 : jsDay; // 1..7

  /* ---------------------------------------------------
     3) Orari del salone
  --------------------------------------------------- */
  const { data: hours, error: hErr } = await supabaseServer
    .from("salon_hours")
    .select("is_closed, open_time, close_time")
    .eq("salon_id", salon_id)
    .eq("weekday", weekday)
    .maybeSingle();

  if (hErr) {
    return NextResponse.json({ error: hErr.message }, { status: 400 });
  }

  if (!hours || hours.is_closed) {
    return NextResponse.json({ slots: [] }, { status: 200 });
  }

  if (!hours.open_time || !hours.close_time) {
    return NextResponse.json({ slots: [] }, { status: 200 });
  }

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

/* ---------------------------------------------------
   4) Finestre orarie del giorno
--------------------------------------------------- */
const open = romeLocalToUtcDate(date, hours.open_time.slice(0, 5));
const close = romeLocalToUtcDate(date, hours.close_time.slice(0, 5));

const stepMinutes = 30;

const dayStart = romeLocalToUtcDate(date, "00:00");
const dayEnd = new Date(romeLocalToUtcDate(date, "23:59").getTime() + 59_999);


  /* ---------------------------------------------------
     5) Appuntamenti esistenti (incl. blocchi)
  --------------------------------------------------- */
  const { data: appts, error: aErr } = await supabaseServer
    .from("appointments")
    .select("start_time, end_time")
    .eq("salon_id", salon_id)
    .in("status", ["pending", "confirmed", "blocked"])
    .gte("start_time", dayStart.toISOString())
    .lte("start_time", dayEnd.toISOString());

  if (aErr) {
    return NextResponse.json({ error: aErr.message }, { status: 400 });
  }

  const overlaps = (start: Date, end: Date) =>
    (appts || []).some((a: any) => {
      const s = new Date(a.start_time);
      const e = new Date(a.end_time);
      return start < e && end > s;
    });

  /* ---------------------------------------------------
     6) Generazione slot disponibili
  --------------------------------------------------- */
  const slots: string[] = [];

  for (
    let t = new Date(open);
    t.getTime() + duration * 60000 <= close.getTime();
    t = new Date(t.getTime() + stepMinutes * 60000)
  ) {
    const start = new Date(t);
    const end = new Date(t.getTime() + duration * 60000);

    if (!overlaps(start, end)) {
      slots.push(start.toISOString());
    }
  }

  return NextResponse.json({ slots }, { status: 200 });
}
