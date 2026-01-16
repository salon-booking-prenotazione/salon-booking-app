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
const CLOSED_WEEKDAY = 1; // 0=dom, 1=lun, 2=mar...

function toISODateInTZ(d: Date) {
  // YYYY-MM-DD in Europe/Rome
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });
  return fmt.format(d);
}

// Get timezone offset minutes for a UTC instant in TZ (local = UTC + offset)
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

// Convert local date+time in Europe/Rome to a UTC Date
function zonedTimeToUtc(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);

  // initial guess
  let guess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  // refine 2 passes
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

function eachDate(from: string, to: string) {
  const out: string[] = [];
  const start = new Date(from + "T00:00:00Z");
  const end = new Date(to + "T00:00:00Z");
  // iterate by UTC days (ok, we map back to TZ when needed)
  for (let d = new Date(start); d <= end; d = addMinutes(d, 24 * 60)) {
    out.push(toISODateInTZ(d));
  }
  // remove duplicates if TZ shift causes it (rare)
  return Array.from(new Set(out));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const salon_id = searchParams.get("salon_id");
  const service_id = searchParams.get("service_id");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!salon_id || !service_id || !from || !to) {
    return NextResponse.json(
      { error: "Parametri richiesti: salon_id, service_id, from, to" },
      { status: 400 }
    );
  }

  // service duration
  const { data: service, error: svcErr } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", service_id)
    .single();

  if (svcErr || !service) {
    return NextResponse.json({ error: "Servizio non trovato" }, { status: 400 });
  }

  const durationMin = Number(service.duration_minutes) || 30;

  // fetch appointments in range (wide window)
  const fromUtc = zonedTimeToUtc(from, "00:00").toISOString();
  const toUtc = zonedTimeToUtc(to, "23:59").toISOString();

  const { data: appts, error: apptErr } = await supabase
    .from("appointments")
    .select("start_time,end_time")
    .eq("salon_id", salon_id)
    .gte("start_time", fromUtc)
    .lte("start_time", toUtc);

  if (apptErr) {
    return NextResponse.json({ error: apptErr.message }, { status: 400 });
  }

  const apptIntervals = (appts ?? []).map((a: any) => ({
    start: new Date(a.start_time),
    end: new Date(a.end_time),
    day: toISODateInTZ(new Date(a.start_time)),
  }));

  const days = eachDate(from, to);
  const availableDays: string[] = [];

  for (const day of days) {
    // closed on Monday
    const weekday = new Date(day + "T12:00:00Z").getUTCDay(); // stable
    // NOTE: this is UTC weekday; we should compute in TZ:
    const localNoonUtc = zonedTimeToUtc(day, "12:00");
    const localWeekday = localNoonUtc.getUTCDay();
    if (localWeekday === CLOSED_WEEKDAY) continue;

    const openUtc = zonedTimeToUtc(day, OPEN_TIME);
    const closeUtc = zonedTimeToUtc(day, CLOSE_TIME);

    const lastStartUtc = addMinutes(closeUtc, -durationMin);

    const dayAppts = apptIntervals.filter((x) => x.day === day);

    let hasSlot = false;

    for (let slotStart = new Date(openUtc); slotStart <= lastStartUtc; slotStart = addMinutes(slotStart, SLOT_MINUTES)) {
      const slotEnd = addMinutes(slotStart, durationMin);

      const busy = dayAppts.some((a) => overlaps(slotStart, slotEnd, a.start, a.end));
      if (!busy) {
        hasSlot = true;
        break;
      }
    }

    if (hasSlot) availableDays.push(day);
  }

  return NextResponse.json({
    available_days: availableDays,
    rules: { open: OPEN_TIME, close: CLOSE_TIME, slot_minutes: SLOT_MINUTES, closed_weekday: "monday" },
  });
}
