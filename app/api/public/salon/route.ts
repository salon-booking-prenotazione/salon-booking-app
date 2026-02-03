import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });

  const supabase = supabaseAdmin();

  const { data: salon, error: salonErr } = await supabase
    .from("salons")
    .select("id,name,slug")
    .eq("slug", slug)
    .single();

  if (salonErr || !salon) {
    return NextResponse.json({ ok: false, error: "Salone non trovato" }, { status: 404 });
  }

  const { data: services, error: svcErr } = await supabase
    .from("services")
    .select("id,name,duration_minutes")
    .eq("salon_id", salon.id)
    .order("name", { ascending: true });

  if (svcErr) {
    return NextResponse.json({ ok: false, error: "Errore caricamento servizi" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, salon, services: services || [] });
}
