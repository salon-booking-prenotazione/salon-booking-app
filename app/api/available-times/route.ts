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
  const date = url.searchParams.get("date") || "";

  if (!salon_id || !service_id || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const { data: service, error: svcErr } = await supabaseServer
    .from("services")
    .select("duration_minutes")
    .eq("id", service_id)
    .eq("salon_id", salon_id)
    .single();

  if (svcErr) return NextResponse.json({ error: svcErr.message }, { status: 400 });
  const duration = service.duration_minutes as number;

  const d = new Date(`${date}T12:00:00`);
  const weekday = d.getDay();

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

  const open_time = hours.open_time as string;
  const close_time = hours.close_time as string;

  if (!open_time || !close_time) {
    return NextResponse.json({ slots: [] }, { status: 200 });
  }

  const open = new Date(`${date}T${open_time.slice(0, 5)}:00.000Z`);
  const close = new Date(`${date}T${close_time.slice(0, 5)}:00.000Z`);
  const stepMinutes = 30;

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

  function overlaps(start: Date, end: Date) {
    return (appts || []).some((a: any) => {
      const s = new Date(a.start_time);
      const e = new Date(a.end_time);
      return start < e && end > s;
    });
  }

  const slots: string[] = [];
  for (
    let t = new Date(open);
    t.getTime() + duration * 60000 <= close.getTime();
    t = new Date(t.getTime() + stepMinutes * 60000)
  ) {
    const start = new Date(t);
    const end = new Date(t.getTime() + duration * 60000);
    if (!overlaps(start, end)) slots.push(start.toISOString());
  }

  return NextResponse.json({ slots }, { status: 200 });
}
