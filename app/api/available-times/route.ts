import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TZ = "Europe/Rome";
const OPEN_TIME = "09:00";
const CLOSE_TIME = "19:00";
const SLOT_MINUTES = 30;
const CLOSED_WEEKDAY = 1; // lun

function toISODateInTZ(d: Date) {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });
  return fmt.format(d);
}

function getTzOffsetMinutes(utcInstant: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(utcInstant);
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;

  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  return (asUTC - utcInstant.getTime()) / 60000;
}

function zonedTimeToUtc(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  let guess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  for (let i = 0; i < 2; i++) {
    const off = getTzOffsetMinutes(guess, TZ);
    guess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0) - off * 60000);
  }
  return guess;
}

function addMinutes(d: Date, minutes: number) {
  return new Date(d.getTime() + minutes * 60000);
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const salon_id = searchParams.get("salon_id");
  const service_id = searchParams.get("service_id");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!salon_id || !service_id || !date) {
    return NextResponse.json(
      { error: "Parametri richiesti: salon_id, service_id, date" },
      { status: 400 }
    );
  }

  // closed monday
  const localNoonUtc = zonedTimeToUtc(date, "12:00");
  if (localNoonUtc.getUTCDay() === CLOSED_WEEKDAY) {
    return NextResponse.json({ available_times: [] });
  }

  const { data: service, error: svcErr } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", service_id)
    .single();

  if (svcErr || !service) {
    return NextResponse.json({ error: "Servizio non trovato" }, { status: 400 });
  }

  const durationMin = Number(service.duration_minutes) || 30;

  const openUtc = zonedTimeToUtc(date, OPEN_TIME);
  const closeUtc = zonedTimeToUtc(date, CLOSE_TIME);
  const lastStartUtc = addMinutes(closeUtc, -durationMin);

  const dayStartUtc = zonedTimeToUtc(date, "00:00").toISOString();
  const dayEndUtc = zonedTimeToUtc(date, "23:59").toISOString();

  const { data: appts, error: apptErr } = await supabase
    .from("appointments")
    .select("start_time,end_time")
    .eq("salon_id", salon_id)
    .gte("start_time", dayStartUtc)
    .lte("start_time", dayEndUtc);

  if (apptErr) return NextResponse.json({ error: apptErr.message }, { status: 400 });

  const intervals = (appts ?? []).map((a: any) => ({
    start: new Date(a.start_time),
    end: new Date(a.end_time),
  }));

  const times: string[] = [];

  for (let slotStart = new Date(openUtc); slotStart <= lastStartUtc; slotStart = addMinutes(slotStart, SLOT_MINUTES)) {
    const slotEnd = addMinutes(slotStart, durationMin);
    const busy = intervals.some((a) => overlaps(slotStart, slotEnd, a.start, a.end));
    if (busy) continue;

    // format HH:MM in Europe/Rome
    const parts = new Intl.DateTimeFormat("it-IT", {
      timeZone: TZ,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(slotStart);

    const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
    const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
    times.push(`${pad(Number(hh))}:${pad(Number(mm))}`);
  }

  return NextResponse.json({ available_times: times });
}
