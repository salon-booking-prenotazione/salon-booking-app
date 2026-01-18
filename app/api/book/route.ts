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
  if (!p) return "";
  return p.startsWith("+") ? p : `+${p}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const phone = normalizePhone(body.phone || "");
    const email = body.email?.trim() || null;

    if (
      !body.salon_id ||
      !body.service_id ||
      !body.start_time ||
      !body.end_time ||
      !body.name ||
      !phone
    ) {
      return NextResponse.json(
        { error: "Dati mancanti" },
        { status: 400 }
      );
    }

    if (body.confirmation_channel === "email" && !email) {
      return NextResponse.json(
        { error: "Email richiesta" },
        { status: 400 }
      );
    }

    const manage_token = crypto.randomUUID();

    const { data: appt, error } = await supabase
      .from("appointments")
      .insert({
        salon_id: body.salon_id,
        service_id: body.service_id,
        start_time: body.start_time,
        end_time: body.end_time,
        name: body.name,
        phone,
        email,
        confirmation_channel: body.confirmation_channel,
        status: "confirmed",
        manage_token,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        appointment_id: appt.id,
        manage_token: appt.manage_token,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Errore server" },
      { status: 500 }
    );
  }
}
