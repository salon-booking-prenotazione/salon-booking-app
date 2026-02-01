import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import type { Metadata } from "next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Salon Booking",
  description: "Prenota il tuo appuntamento in pochi secondi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <div className="lux-bg">
          <div className="min-h-screen">
            <header className="sticky top-0 z-40 backdrop-blur bg-white/25 border-b"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 grid place-items-center"
                    style={{
                      border: "1px solid var(--line)",
                      background: "rgba(255,255,255,0.55)",
                    }}
                  >
                    <span className="text-lg">✦</span>
                  </div>
                  <div className="leading-tight">
                    <div
                      className="font-medium tracking-wide"
                      style={{ fontFamily: "var(--font-display), ui-serif, Georgia", color: "#5b2940" }}
                    >
                      Salon Booking
                    </div>
                    <div className="text-xs" style={{ color: "rgba(27,27,31,0.55)" }}>
                      Luxury scheduling
                    </div>
                  </div>
                </a>

                <nav className="flex items-center gap-2">
                  <a className="lux-btn lux-btn-ghost" href="/s/demo">
                    Demo
                  </a>
                  <a className="lux-btn lux-btn-sage" href="/s/demo">
                    Prenota ora
                  </a>
                </nav>
              </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

            <footer className="mx-auto max-w-6xl px-4 pb-10 pt-8 text-sm"
              style={{ color: "rgba(27,27,31,0.55)" }}
            >
              <div className="lux-card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>© {new Date().getFullYear()} Salon Booking</div>
                <div style={{ color: "rgba(27,27,31,0.45)" }}>
                  Sage & rose — luxury UI • Next.js App Router
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
