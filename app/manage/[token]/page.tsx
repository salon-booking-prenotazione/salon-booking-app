import { createClient } from "@supabase/supabase-js";
import CancelButton from "./CancelButton";

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

// Google vuole UTC in formato YYYYMMDDTHHMMSSZ (senza - :)
const toGoogleUTC = (d: Date) =>
  d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const googleUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent("Appuntamento Salon")}` +
  `&dates=${toGoogleUTC(startDate)}/${toGoogleUTC(endDate)}` +
  `&details=${encodeURIComponent(
    `Gestisci/disdici: ${process.env.APP_BASE_URL || ""}/manage/${token}`
  )}`;

  return (
    <div style={{ padding: 24 }}>
      <h1>Gestione prenotazione</h1>

      <p>
        <strong>Quando:</strong> {start}
      </p>

      <p>
        <strong>Telefono:</strong> {appt.contact_phone || "-"}
      </p>

      <p>
        <strong>Stato:</strong> {appt.cancelled_at ? "Cancellata" : appt.status}
      </p>

      {!appt.cancelled_at && <CancelButton token={token} />}

      <div style={{ marginTop: 16 }}>
  <a
    href={`/api/calendar/appointment?id=${appt.id}`}
    target="_blank"
    rel="noreferrer"
    style={{
      display: "inline-block",
      padding: "10px 14px",
      border: "1px solid #000",
      borderRadius: 6,
      textDecoration: "none",
    }}
  >
    📅 Salva nel calendario
  </a>
  <p style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
    Si scarica un file .ics: aprilo e premi “Aggiungi” nel tuo calendario.
  </p>
</div>
