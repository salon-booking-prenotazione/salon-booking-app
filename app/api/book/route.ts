import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Body = {
  salon_id: string;
  service_id: string;
  start_time: string; // ISO
  end_time: string;   // ISO
  name: string;
  phone: string;
  email?: string;
  confirmation_channel: "email" | "sms" | "both";
};

function normalizePhone(phone: string) {
  const p = phone.trim();
  return p.startsWith("+") ? p : `+${p}`;
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const phone = normalizePhone(body.phone || "");
  const email = (body.email || "").trim() || null;

  if (!body.salon_id || !body.service_id || !body.start_time || !body.end_time || !body.name || !phone) {
    return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
  }
  if (body.confirmation_channel === "email" && !email) {
    return NextResponse.json({ error: "Email richiesta" }, { status: 400 });
  }

  // 1) customer: find or create
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("salon_id", body.salon_id)
    .eq("phone", phone)
    .maybeSingle();

  let customer_id = existingCustomer?.id;

  if (!customer_id) {
    const { data: created, error: custErr } = await supabase
      .from("customers")
      .insert({ salon_id: body.salon_id, name: body.name, phone })
      .select("id")
      .single();

    if (custErr) return NextResponse.json({ error: custErr.message }, { status: 400 });
    customer_id = created.id;
  }

  // 2) appointment
  const manage_token = crypto.randomBytes(24).toString("hex");

  const { data: appt, error: apptErr } = await supabase
    .from("appointments")
    .insert({
      salon_id: body.salon_id,
      service_id: body.service_id,
      customer_id,
      start_time: body.start_time,
      end_time: body.end_time,
      status: "confirmed",
      source: "web",
      contact_phone: phone,
      contact_email: email,
      confirmation_channel: body.confirmation_channel,
      manage_token,
    })
    .select("id, manage_token")
    .single();

  if (apptErr) {
    // Se slot occupato: violazione no_overlap
    return NextResponse.json({ error: apptErr.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      appointment_id: appt.id,
      manage_token: appt.manage_token,
    },
    { status: 200 }
  );
}
