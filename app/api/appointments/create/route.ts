import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

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

function romeLocalToUtcISO(dateStr: string, hhmm: string) {
  const [Y, M, D] = dateStr.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);

  const offsetMin = romeOffsetMinutesForDate(Y, M, D);
  const utcMs = Date.UTC(Y, M - 1, D, hh, mm, 0) - offsetMin * 60_000;

  return new Date(utcMs).toISOString();
}

function addMinutesISO(iso: string, minutes: number) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

/* ===========================
   POST
=========================== */
export async function POST(req: Request) {
  try {
    const supabase = supabaseAdmin();
    const body = await req.json().catch(() => ({}));

    const slug = String(body.slug || "");
    const service_id = String(body.service_id || "");
    const date = String(body.date || ""); // YYYY-MM-DD (Rome)
    const time = String(body.time || ""); // HH:mm (Rome)

    const customer_name = String(body.customer_name || "").trim();
    const contact_phone = String(body.contact_phone || "").trim();
    const contact_email = String(body.contact_email || "").trim();
    const note = String(body.note || "").trim();

    if (!slug || !service_id || !date || !time || !contact_phone) {
      return NextResponse.json(
        { ok: false, error: "Parametri mancanti (slug, service_id, date, time, contact_phone)" },
        { status: 400 }
      );
    }

    // 1) Trova salone (id + telefono + nome)
    const { data: salon, error: salonErr } = await supabase
      .from("salons")
      .select("id,name,slug,phone")
      .eq("slug", slug)
      .single();

    if (salonErr || !salon) {
      return NextResponse.json({ ok: false, error: "Salone non trovato" }, { status: 404 });
    }

    // 2) Servizio + durata
    const { data: svc, error: svcErr } = await supabase
      .from("services")
      .select("id,name,duration_minutes")
      .eq("id", service_id)
      .eq("salon_id", salon.id)
      .single();

    if (svcErr || !svc) {
      return NextResponse.json({ ok: false, error: "Servizio non trovato" }, { status: 404 });
    }

    const duration = Number(svc.duration_minutes || 0);
    if (!duration || duration < 5) {
      return NextResponse.json({ ok: false, error: "Durata servizio non valida" }, { status: 400 });
    }

    // 3) Converti Roma -> UTC
    const start_time = romeLocalToUtcISO(date, time);
    const end_time = addMinutesISO(start_time, duration);

    // 4) Genera manage_token
    const manage_token =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    // 5) Insert appointment (allineato con la tua tabella)
    const { data: appt, error: apptErr } = await supabase
      .from("appointments")
      .insert({
        salon_id: salon.id,
        service_id: svc.id,
        start_time,
        end_time,

        customer_name: customer_name || null,
        contact_phone: contact_phone || null,
        contact_email: contact_email || null,
        note: note || null,

        status: "confirmed",
        source: "web",
        confirmation_channel: "whatsapp",
        cancelled_at: null,
        manage_token,
      })
      .select("id,manage_token")
      .single();

    if (apptErr || !appt) {
      // IMPORTANTISSIMO: così vedi l’errore vero invece di “errore interno”
      return NextResponse.json(
        { ok: false, error: apptErr?.message || "Impossibile creare appuntamento" },
        { status: 400 }
      );
    }

    // 6) Prepara WhatsApp message + link
    const baseUrl = process.env.APP_BASE_URL || "";
    const manageUrl = baseUrl ? `${baseUrl}/manage/${appt.manage_token}` : "";
    const calendarIcsUrl = baseUrl ? `${baseUrl}/api/calendar/appointment?id=${appt.id}` : "";

    const waPhone = String(salon.phone || "").replace(/\s+/g, "");
    const msg =
      `Ciao ${salon.name}!\n` +
      `Vorrei confermare una prenotazione:\n` +
      `• Servizio: ${svc.name}\n` +
      `• Data: ${date}\n` +
      `• Ora: ${time}\n` +
      (customer_name ? `Nome: ${customer_name}\n` : "") +
      `Tel: ${contact_phone}\n` +
      (note ? `Note: ${note}\n` : "") +
      (manageUrl ? `Gestisci: ${manageUrl}\n` : "") +
      (calendarIcsUrl ? `Calendario: ${calendarIcsUrl}\n` : "") +
      `ID: ${appt.id}`;

    const whatsapp_url =
      waPhone && waPhone.startsWith("+")
        ? `https://wa.me/${waPhone.replace("+", "")}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;

    return NextResponse.json({
      ok: true,
      appointment_id: appt.id,
      manage_token: appt.manage_token,
      whatsapp_url,
      manage_url: manageUrl,
      calendar_ics_url: calendarIcsUrl,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Errore interno" },
      { status: 500 }
    );
  }
}
