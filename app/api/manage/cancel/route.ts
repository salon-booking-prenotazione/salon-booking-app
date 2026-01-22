import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Quante ore prima blocchiamo la disdetta?
// Default: 6 ore. Puoi cambiarlo con ENV: CANCELLATION_MIN_HOURS
const MIN_HOURS = Number(process.env.CANCELLATION_MIN_HOURS || "6");

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));

  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // Prendiamo anche start_time per controllare la regola "X ore prima"
  const { data: appt, error: findErr } = await supabase
    .from("appointments")
    .select("id,start_time,cancelled_at")
    .eq("manage_token", token)
    .single();

  if (findErr || !appt) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
  }

  // Se già cancellato -> ok (idempotente)
  if (appt.cancelled_at) {
    return NextResponse.json({ ok: true, alreadyCancelled: true });
  }

  // ✅ BLOCCO DISDETTA SE TROPPO VICINO
  const startMs = new Date(appt.start_time).getTime();
  const nowMs = Date.now();
  const diffHours = (startMs - nowMs) / (1000 * 60 * 60);

  if (diffHours < MIN_HOURS) {
    return NextResponse.json(
      {
        ok: false,
        error: `Non puoi disdire nelle ultime ${MIN_HOURS} ore prima dell’appuntamento.`,
      },
      { status: 403 }
    );
  }

  // Aggiorno stato come cancellato
  const { error: updErr } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", appt.id);

  if (updErr) {
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
