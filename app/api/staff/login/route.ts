import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { key } = await req.json().catch(() => ({}));

  const expected = process.env.ADMIN_CREATE_KEY;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Missing ADMIN_CREATE_KEY" }, { status: 500 });
  }

  if (!key || key !== expected) {
    return NextResponse.json({ ok: false, error: "Password errata" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // cookie staff (solo server, più sicuro di localStorage)
  res.cookies.set("staff", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 giorni
  });

  return res;
}
