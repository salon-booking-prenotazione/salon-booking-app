export const metadata = {
  title: "Salon Booking",
  description: "Agenda semplice per saloni"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body style={{ fontFamily: "system-ui, Arial", margin: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
          <h2 style={{ margin: "8px 0 16px" }}>Salon Booking</h2>
          {children}
        </div>
      </body>
    </html>
  );
}
