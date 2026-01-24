import { createClient } from "@supabase/supabase-js";
import CancelButton from "./CancelButton";
import WhatsAppBox from "./WhatsAppBox";

export const dynamic = "force-dynamic";

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export default async function ManagePage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;

  const supabase = supabaseAdmin();

  const { data: appt, error } = await supabase
    .from("appointments")
    .select("id,start_time,end_time,contact_phone,status,cancelled_at")
    .eq("manage_token", token)
    .single();

  if (error || !appt) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Link non valido</h1>
        <p>Questo link di gestione non è stato trovato.</p>
      </div>
    );
  }

  const start = new Date(appt.start_time).toLocaleString("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const startDate = new Date(appt.start_time);
  const endDate = new Date(appt.end_time);

  const toGoogleUTC = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const baseUrl = process.env.APP_BASE_URL || "";

  const googleParams = new URLSearchParams({
    action: "TEMPLATE",
    text: "Appuntamento Salon",
    dates: `${toGoogleUTC(startDate)}/${toGoogleUTC(endDate)}`,
    details: baseUrl ? `Gestisci/disdici: ${baseUrl}/manage/${token}` : "",
  });

  const googleUrl =
    "https://calendar.google.com/calendar/render?" + googleParams.toString();

  const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 14px",
    border: "1px solid #000",
    borderRadius: 6,
    textDecoration: "none",
  };

    return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "system-ui",
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(248,240,236,1) 0%, rgba(255,255,255,1) 62%), radial-gradient(900px 500px at 85% 10%, rgba(235,246,242,1) 0%, rgba(255,255,255,1) 55%)",
      }}
    >
      <div
        style={{
          width: "min(920px, 100%)",
          background: "rgba(255,255,255,0.82)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 26,
          boxShadow: "0 18px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* TOP: check + titolo */}
        <div
          style={{
            padding: "26px 26px 18px",
            textAlign: "center",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              margin: "0 auto 12px",
              display: "grid",
              placeItems: "center",
              background: appt.cancelled_at
                ? "rgba(239,68,68,0.10)"
                : "rgba(22,163,74,0.12)",
              border: appt.cancelled_at
                ? "1px solid rgba(239,68,68,0.22)"
                : "1px solid rgba(22,163,74,0.22)",
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: appt.cancelled_at ? "rgb(239,68,68)" : "rgb(22,163,74)",
              }}
            >
              {appt.cancelled_at ? "!" : "✓"}
            </div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 900 }}>
            {appt.cancelled_at
              ? "Prenotazione cancellata"
              : "Perfetto, la tua prenotazione è confermata"}
          </div>
          <div style={{ marginTop: 6, fontSize: 14, opacity: 0.75 }}>
            {appt.cancelled_at
              ? "Se hai bisogno di riprenotare, contatta il salone."
              : "Qui trovi tutte le informazioni e i pulsanti utili."}
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr",
              gap: 18,
            }}
          >
            {/* Info + WhatsApp */}
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 20,
                padding: 18,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
                Dettagli appuntamento
              </div>

              <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
                <div>
                  <span style={{ fontWeight: 800 }}>Quando:</span>{" "}
                  <span style={{ opacity: 0.9 }}>{start}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 800 }}>Telefono:</span>{" "}
                  <span style={{ opacity: 0.9 }}>
                    {appt.contact_phone || "-"}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: 800 }}>Stato:</span>{" "}
                  <span style={{ opacity: 0.9 }}>
                    {appt.cancelled_at ? "Cancellata" : appt.status}
                  </span>
                </div>
              </div>

              {/* WhatsApp */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>
                  ✅ Conferma via WhatsApp
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 10 }}>
                  Copia e invia questo messaggio al cliente (zero costi).
                </div>

                <div
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 18,
                    padding: 14,
                    background: "rgba(250,250,250,1)",
                  }}
                >
                  <WhatsAppBox
                    startTime={appt.start_time}
                    manageUrl={`${process.env.APP_BASE_URL || ""}/manage/${token}`}
                    calendarIcsUrl={`${
                      process.env.APP_BASE_URL || ""
                    }/api/calendar/appointment?id=${
