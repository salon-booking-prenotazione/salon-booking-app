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
            width: "min(720px, 100%)",
            background: "rgba(255,255,255,0.86)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 26,
            boxShadow: "0 18px 60px rgba(0,0,0,0.12)",
            padding: 24,
            backdropFilter: "blur(10px)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
            Link non valido
          </h1>
          <p style={{ marginTop: 10, opacity: 0.8 }}>
            Questo link di gestione non è stato trovato.
          </p>
        </div>
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

  const statusStr = appt.cancelled_at ? "Cancellata" : appt.status;
  const phoneStr = appt.contact_phone || "-";

  const pillBtn: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.95)",
    textDecoration: "none",
    color: "#111",
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    cursor: "pointer",
  };

  const primaryBtn: React.CSSProperties = {
    ...pillBtn,
    border: "1px solid rgba(17,17,17,0.9)",
    background: "rgba(17,17,17,0.92)",
    color: "#fff",
    boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
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
          width: "min(980px, 100%)",
          background: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 26,
          boxShadow: "0 18px 60px rgba(0,0,0,0.12)",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header confirmation */}
        <div
          style={{
            padding: "26px 26px 18px",
            textAlign: "center",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
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
                fontSize: 32,
                fontWeight: 900,
                color: appt.cancelled_at ? "rgb(239,68,68)" : "rgb(22,163,74)",
              }}
            >
              {appt.cancelled_at ? "!" : "✓"}
            </div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 900 }}>
            {appt.cancelled_at
              ? "Questa prenotazione è stata cancellata"
              : "Perfetto, la tua prenotazione è confermata"}
          </div>

          <div style={{ marginTop: 6, fontSize: 14, opacity: 0.75 }}>
            Qui trovi tutte le informazioni utili.
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr",
              gap: 18,
            }}
          >
            {/* Left: details + WhatsApp */}
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
                  <span style={{ fontWeight: 900 }}>Quando:</span>{" "}
                  <span style={{ opacity: 0.9 }}>{start}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 900 }}>Telefono:</span>{" "}
                  <span style={{ opacity: 0.9 }}>{phoneStr}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 900 }}>Stato:</span>{" "}
                  <span style={{ opacity: 0.9 }}>{statusStr}</span>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>
                  Conferma via WhatsApp
                </div>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 10 }}>
                  Copia e invia questo messaggio al cliente (zero costi).
                </div>

                <WhatsAppBox
                  startTime={appt.start_time}
                  manageUrl={`${process.env.APP_BASE_URL || ""}/manage/${token}`}
                  calendarIcsUrl={`${
                    process.env.APP_BASE_URL || ""
                  }/api/calendar/appointment?id=${appt.id}`}
                />
              </div>
            </div>

            {/* Right: actions */}
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 20,
                padding: 18,
                display: "grid",
                gap: 12,
                alignContent: "start",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16 }}>Azioni rapide</div>

              <a
                href={`/api/calendar/appointment?id=${appt.id}`}
                target="_blank"
                rel="noreferrer"
                style={pillBtn}
              >
                📅 Salva nel calendario (ICS)
              </a>

              <a
                href={googleUrl}
                target="_blank"
                rel="noreferrer"
                style={pillBtn}
              >
                ➕ Aggiungi a Google Calendar
              </a>

              {!appt.cancelled_at ? (
                <div style={{ marginTop: 4 }}>
                  {/* CancelButton resta com'è, solo lo incorniciamo */}
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 10 }}>
                      Modifica
                    </div>
                    <CancelButton token={token} />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 16,
                    border: "1px solid rgba(239,68,68,0.22)",
                    background: "rgba(239,68,68,0.06)",
                    fontSize: 13,
                    opacity: 0.9,
                  }}
                >
                  Questa prenotazione è già cancellata.
                </div>
              )}

              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.65 }}>
                Grazie ✨ Ti aspettiamo presto.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
            Se scarichi un file <strong>.ics</strong>, aprilo e premi “Aggiungi”
            nel tuo calendario.
          </div>
        </div>
      </div>
    </div>
  );
}
