import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ lascia passare login staff e api login
  if (pathname.startsWith("/staff/login")) return NextResponse.next();
  if (pathname.startsWith("/api/staff/login")) return NextResponse.next();

  // ✅ proteggi:
  // - tutto /staff/*
  // - e /s/*/dashboard
  const isStaffArea = pathname.startsWith("/staff");
  const isSalonDashboard = pathname.startsWith("/s/") && pathname.endsWith("/dashboard");

  if (isStaffArea || isSalonDashboard) {
    const staff = req.cookies.get("staff")?.value;

    if (staff === "1") return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/staff/login";

    // (opzionale) puoi mantenere dove voleva andare:
    // url.searchParams.set("next", pathname);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/s/:path*/dashboard"],
};
