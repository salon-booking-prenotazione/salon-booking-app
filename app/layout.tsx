import "./globals.css";
import type { Metadata } from "next";

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
      <body>
        {/* Background luxury globale */}
        <div className="lux-bg">
          <div className="lux-noise" />
          <div className="lux-glow lux-glow-1" />
          <div className="lux-glow lux-glow-2" />

          {/* Contenuto */}
          <div className="min-h-screen">
            <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
              <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3 group">
                  <div className="h-9 w-9 rounded-xl border border-white/15 bg-white/5 grid place-items-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]">
                    <span className="text-lg">✦</span>
                  </div>
                  <div className="leading-tight">
                    <div className="font-semibold tracking-wide text-white/90 group-hover:text-white">
                      Salon Booking
                    </div>
                    <div className="text-xs text-white/55">Luxury scheduling</div>
                  </div>
                </a>

                <nav className="flex items-center gap-2">
                  <a className="lux-btn lux-btn-ghost" href="/s/demo">
                    Demo
                  </a>
                  <a className="lux-btn" href="/s/demo">
                    Prenota ora
                  </a>
                </nav>
              </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

            <footer className="mx-auto max-w-6xl px-4 pb-10 pt-8 text-sm text-white/50">
              <div className="lux-card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>© {new Date().getFullYear()} Salon Booking</div>
                <div className="text-white/45">
                  Verde & rosa — luxury UI • Next.js App Router
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
