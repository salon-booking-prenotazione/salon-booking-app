import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  // Trova appuntamento dal token
  const { data: appt, error: findErr } = await supabase
    .from("appointments")
    .select("id,cancelled_at")
    .eq("manage_token", token)
    .single();

  if (findErr || !appt) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
  }

  // Se già cancellato, ok (idempotente)
  if (appt.cancelled_at) {
    return NextResponse.json({ ok: true, alreadyCancelled: true });
  }

  // IMPORTANTISSIMO: settiamo SIA cancelled_at SIA status='cancelled'
  // così qualsiasi logica esistente che filtra per uno dei due la prenderà.
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
