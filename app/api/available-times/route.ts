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
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

// GET /api/available-times?salon_id=...&service_id=...&date=YYYY-MM-DD
export async function GET(req: Request) {
  const url = new URL(req.url);
  const salon_id = url.searchParams.get("salon_id") || "";
  const service_id = url.searchParams.get("service_id") || "";
  const date = url.searchParams.get("date") || ""; // YYYY-MM-DD

  if (!salon_id || !service_id || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // 1) Leggi durata servizio
  const { data: service, error: svcErr } = await supabaseServer
    .from("services")
    .select("duration_minutes")
    .eq("id", service_id)
    .eq("salon_id", salon_id)
    .single();

  if (svcErr) return NextResponse.json({ error: svcErr.message }, { status: 400 });
  const duration = service.duration_minutes as number;

  // 2) Calcola weekday: 0=Dom ... 6=Sab
  // Attenzione: new Date("YYYY-MM-DD") in JS è UTC; per l’Italia va bene per weekday se usiamo T12:00.
  const d = new Date(`${date}T12:00:00`);
  const weekday = d.getDay(); // 0..6

  // 3) Leggi orari del salone
  const { data: hours, error: hErr } = await supabaseServer
    .from("salon_hours")
    .select("is_closed, open_time, close_time")
    .eq("salon_id", salon_id)
    .eq("weekday", weekday)
    .maybeSingle();

  if (hErr) return NextResponse.json({ error: hErr.message }, { status: 400 });

  if (!hours || hours.is_closed) {
    return NextResponse.json({ slots: [] }, { status: 200 });
  }

  const open_time = hours.open_time as string;   // "09:00:00" o "09:00"
  const close_time = hours.close_time as string; // "19:00:00" o "19:00"
  if (!open_time || !close_time) {
    return NextResponse.json({ slots: [] }, { status: 200 });
  }

  // 4) Costruisci finestre temporali della giornata (ISO)
  // NB: usiamo timezone locale del server? Su Vercel è UTC. Per MVP usiamo UTC coerente:
  // - start/end in ISO
  // - appointments sono timestamptz -> confronto corretto in DB
  //
  // Creiamo open/close come UTC della stessa data.
  const open = new Date(`${date}T${open_time.slice(0, 5)}:00.000Z`);
  const close = new Date(`${date}T${close_time.slice(0, 5)}:00.000Z`);

  // Intervallo slot ogni 15 minuti
  const stepMinutes = 15;

  // 5) Leggi appuntamenti del giorno per il salone (pending/confirmed)
  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const { data: appts, error: aErr } = await supabaseServer
    .from("appointments")
    .select("start_time,end_time,status")
    .eq("salon_id", salon_id)
    .in("status", ["pending", "confirmed"])
    .gte("start_time", dayStart.toISOString())
    .lte("start_time", dayEnd.toISOString());

  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 400 });

  // 6) Funzione overlap
  function overlaps(start: Date, end: Date) {
    return (appts || []).some((a: any) => {
      const s = new Date(a.start_time);
      const e = new Date(a.end_time);
      return start < e && end > s;
    });
  }

  // 7) Genera slot
  const slots: string[] = [];
  for (let t = new Date(open); t.getTime() + duration * 60000 <= close.getTime(); t = new Date(t.getTime() + stepMinutes * 60000)) {
    const start = new Date(t);
    const end = new Date(t.getTime() + duration * 60000);

    if (!overlaps(start, end)) {
      slots.push(start.toISOString());
    }
  }

  return NextResponse.json({ slots }, { status: 200 });
}
