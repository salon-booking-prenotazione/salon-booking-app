import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // evita edge/runtime strani su Vercel
export const dynamic = "force-dynamic"; // evita tentativi di staticizzazione

function formatICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return new NextResponse("Missing id", { status: 400 });

  // ✅ usa questi nomi (vedi punto 2)
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

  const start = formatICSDate(new Date(data.start_time));
  const end = formatICSDate(new Date(data.end_time));

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salon Booking//IT
BEGIN:VEVENT
UID:${data.id}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${start}
DTEND:${end}
SUMMARY:Appuntamento Salon
DESCRIPTION:Telefono: ${data.contact_phone || ""}
END:VEVENT
END:VCALENDAR`;

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=appuntamento.ics",
    },
  });
}
