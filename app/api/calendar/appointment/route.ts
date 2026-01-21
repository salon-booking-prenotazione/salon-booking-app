import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toICSLocalRome(d: Date) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}${get("month")}${get("day")}T${get("hour")}${get(
    "minute"
  )}${get("second")}`;
}

function toICSDTStampUTC(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new NextResponse("Missing id", { status: 400 });

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return new NextResponse("Server env missing (Supabase)", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabase
    .from("appointments")
    .select("id,start_time,end_time,contact_phone")
    .eq("id", id)
    .single();

  if (error || !data) return new NextResponse("Not found", { status: 404 });

  const startLocal = toICSLocalRome(new Date(data.start_time));
  const endLocal = toICSLocalRome(new Date(data.end_time));

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salon Booking//IT
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Europe/Rome
END:VTIMEZONE
BEGIN:VEVENT
UID:${data.id}
DTSTAMP:${toICSDTStampUTC(new Date())}
DTSTART;TZID=Europe/Rome:${startLocal}
DTEND;TZID=Europe/Rome:${endLocal}
SUMMARY:Appuntamento Salon
DESCRIPTION:Telefono: ${data.contact_phone || ""}
END:VEVENT
END:VCALENDAR`;

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=prenotazione.ics`,
      "Cache-Control": "no-store",
    },
  });
}
