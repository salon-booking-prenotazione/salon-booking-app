import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // evita ottimizzazioni strane in build

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!key) {
    throw new Error(
      "Missing env: SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const body = await req.json();

    // TODO: qui dentro la tua logica reale (insert appointment ecc.)
    // Esempio placeholder:
    // const { data, error } = await supabase.from("appointments").insert({...}).select().single();
    // if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { ok: true, received: body },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // utile per test veloce in browser: /api/book
  try {
    getSupabase();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Missing env" },
      { status: 500 }
    );
  }
}
