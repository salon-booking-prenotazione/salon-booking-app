import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Protezione semplice: password admin in header
function requireAdmin(req: Request) {
  const expected = process.env.ADMIN_CREATE_KEY;
  if (!expected) return { ok: true }; // se non setti la key, non blocca (sconsigliato)
  const got = req.headers.get("x-admin-key");
  return { ok: got === expected };
}

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    salon_id,
    service_id,
    start_time,
    end_time,
    contact_phone,
    contact_email,
  } = body || {};

  if (!salon_id || !service_id || !start_time || !end_time || !contact_phone) {
    return NextResponse.json(
      { ok: false, error: "Campi mancanti (salon_id, service_id, start_time, end_time, contact_phone)" },
      { status: 400 }
    );
  }

  const start = new Date(start_time);
  const end = new Date(end_time);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ ok: false, error: "Date non valide" }, { status: 400 });
  }
  if (end <= start) {
    return NextResponse.json({ ok: false, error: "end_time deve essere dopo start_time" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // ✅ Overlap check: existing.start < newEnd AND existing.end > newStart
  const { data: overlaps, error: ovErr } = await supabase
    .from("appointments")
    .select("id,start_time,end_time")
    .eq("salon_id", salon_id)
    .is("cancelled_at", null)
    .lt("start_time", end.toISOString())
    .gt("end_time", start.toISOString());

  if (ovErr) {
    return NextResponse.json({ ok: false, error: "Errore controllo overlap" }, { status: 500 });
  }

  if (overlaps && overlaps.length > 0) {
    return NextResponse.json(
      { ok: false, error: "Orario già occupato (overlap)." },
      { status: 409 }
    );
  }

  const manage_token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const { data: inserted, error: insErr } = await supabase
    .from("appointments")
    .insert({
      salon_id,
      service_id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      contact_phone,
      contact_email: contact_email || null,
      confirmation_channel: "manual",
      status: "confirmed",
      cancelled_at: null,
      manage_token,
    })
    .select("id,manage_token,start_time,end_time")
    .single();

  if (insErr) {
    return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, appointment: inserted });
}
