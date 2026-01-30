import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Server-only: usa SERVICE_ROLE per scrivere senza problemi di RLS.
 * (NON mettere questa key nel browser)
 */
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
    const body = await req.json().catch(() => ({}));

    const slug = String(body.slug || "");
    const service_id = String(body.service_id || "");
    const date = String(body.date || ""); // YYYY-MM-DD (Rome)
    const time = String(body.time || ""); // HH:mm (Rome)
    const customer_name = String(body.customer_name || "").trim();
    const contact_phone = String(body.contact_phone || "").trim();
    const note = String(body.note || "").trim();

    if (!slug || !service_id || !date || !time) {
      return NextResponse.json({ ok: false, error: "Parametri mancanti" }, { status: 400 });
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

    // 2) Durata servizio
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

    // 3) Converti Roma -> UTC ISO
    const start_time = romeLocalToUtcISO(date, time);
    const end_time = addMinutesISO(start_time, duration);

    // 4) Inserisci appuntamento (se hai già funzioni anti-overlap a DB, qui sei coperta)
    const { data: appt, error: apptErr } = await supabase
      .from("appointments")
      .insert({
        salon_id: salon.id,
        service_id: svc.id,
        start_time,
        end_time,
        customer_name: customer_name || null,
        contact_phone: contact_phone || null,
        note: note || null,
        status: "booked",
      })
      .select("id")
      .single();

    if (apptErr || !appt) {
      // qui spesso l’errore è overlap o constraint
      return NextResponse.json(
        { ok: false, error: apptErr?.message || "Impossibile creare appuntamento" },
        { status: 400 }
      );
    }

    // 5) Genera link WhatsApp (messaggio pronto)
    const waPhone = String(salon.phone || "").replace(/\s+/g, "");
    const safeName = customer_name ? `Nome: ${customer_name}\n` : "";
    const safeTel = contact_phone ? `Tel: ${contact_phone}\n` : "";
    const msg =
      `Ciao ${salon.name}!\n` +
      `Vorrei confermare una prenotazione:\n` +
      `• Servizio: ${svc.name}\n` +
      `• Data: ${date}\n` +
      `• Ora: ${time}\n` +
      safeName +
      safeTel +
      (note ? `Note: ${note}\n` : "") +
      `ID: ${appt.id}`;

    const whatsapp_url =
      waPhone && waPhone.startsWith("+")
        ? `https://wa.me/${waPhone.replace("+", "")}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;

    return NextResponse.json({
      ok: true,
      appointment_id: appt.id,
      whatsapp_url,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Errore interno" },
      { status: 500 }
    );
  }
}
