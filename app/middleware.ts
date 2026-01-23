import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteggi tutto ciò che inizia con /staff
  if (pathname.startsWith("/staff")) {
    // lascia passare la pagina login e l’api login
    if (pathname.startsWith("/staff/login")) return NextResponse.next();
    if (pathname.startsWith("/api/staff/login")) return NextResponse.next();

    const staff = req.cookies.get("staff")?.value;
    if (staff === "1") return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/staff/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*"],
};