import "./globals.css";

export const metadata = {
  title: "Salon Booking",
  description: "Agenda semplice per saloni",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <div style={{ background: "yellow", padding: 12 }}>
          STO USANDO QUESTO PROGETTO
        </div>
        {children}
      </body>
    </html>
  );
}
