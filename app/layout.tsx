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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${playfair.variable} ${inter.variable}`}>
        {/* Wrapper globale */}
        <div className="lux-bg">
          {/* Video background globale (colori originali) */}
          <video autoPlay muted loop playsInline className="lux-video">
            <source src="/images/videos/lotus.mp4" type="video/mp4" />
          </video>

          {/* Contenuto sopra al video */}
          <div className="relative z-10 min-h-screen">
            <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
              <a href="/" className="lux-badge">
                <span style={{ color: "var(--plum)", fontWeight: 700 }}>✦</span>
                <span style={{ letterSpacing: "0.12em", fontWeight: 700 }}>
                  SALON BOOKING
                </span>
              </a>

              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                WhatsApp • Semplice • Veloce
              </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 pb-14">{children}</main>

            <footer
              className="mx-auto max-w-6xl px-4 pb-10 text-sm"
              style={{ color: "var(--muted)" }}
            >
              © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
