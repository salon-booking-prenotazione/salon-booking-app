import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Body = {
  slug?: string;
  salon_id?: string;
  service_id: string;
  date: string;
  tzOffsetMinutes: number;
};

const OPEN_MIN = 9 * 60;    // 09:00
const CLOSE_MIN = 19 * 60; // 19:00
const STEP_MIN = 30;       // 30 minuti
const dayStart = new Date(body.date + "T00:00:00");
// 0 = Domenica, 1 = Lunedì, 2 = Martedì...
const dayOfWeek = dayStart.getDay();

// Lunedì chiuso
if (dayOfWeek === 1) {
  return NextResponse.json({ times: [] });
}

function hhmm(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body.service_id || !body.date) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    let salon_id = body.salon_id;

    if (!salon_id && body.slug) {
      const { data: salon } = await supabase
        .from("salons")
        .select("id")
        .eq("slug", body.slug)
        .single();

      if (!salon) {
        return NextResponse.json({ error: "Salone non trovato" }, { status: 404 });
      }

      salon_id = salon.id;
    }

    const { data: service } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", body.service_id)
      .single();

    if (!service) {
      return NextResponse.json({ error: "Servizio non trovato" }, { status: 404 });
    }

    const duration = service.duration_minutes;

    const offset = body.tzOffsetMinutes;
    const dayStart = new Date(body.date + "T00:00:00");
    const utcDayStart = new Date(dayStart.getTime() + offset * 60000);
    const utcDayEnd = new Date(utcDayStart.getTime() + 24 * 60 * 60000);

    const { data: appts } = await supabase
      .from("appointments")
      .select("start_time,end_time")
      .eq("salon_id", salon_id)
      .lt("start_time", utcDayEnd.toISOString())
      .gt("end_time", utcDayStart.toISOString());

    const busy = (appts || []).map((a: any) => ({
      start: new Date(a.start_time).getTime(),
      end: new Date(a.end_time).getTime(),
    }));

    function overlaps(s: number, e: number) {
      return busy.some((b) => s < b.end && e > b.start);
    }

    const times: string[] = [];

    for (let t = OPEN_MIN; t + duration <= CLOSE_MIN; t += STEP_MIN) {
      const start = utcDayStart.getTime() + t * 60000;
      const end = start + duration * 60000;
      if (!overlaps(start, end)) times.push(hhmm(t));
    }

    return NextResponse.json({ times });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
