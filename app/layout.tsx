import "./globals.css";

export const metadata = {
  title: "Salon Booking",
  description: "Prenotazioni semplici e veloci",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
