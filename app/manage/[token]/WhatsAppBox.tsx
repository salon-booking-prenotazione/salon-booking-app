"use client";

import { useMemo } from "react";

export default function WhatsAppBox(props: {
  phone: string;
  startTime: string;
  manageUrl: string;
  calendarUrl: string;
}) {
  const whenText = useMemo(() => {
    try {
      return new Date(props.startTime).toLocaleString("it-IT", {
        timeZone: "Europe/Rome",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return props.startTime;
    }
  }, [props.startTime]);

  const message = useMemo(() => {
    return (
      `Prenotazione confermata ✅\n` +
      `Quando: ${whenText}\n` +
      `Gestisci/Disdici: ${props.manageUrl}\n` +
      `Aggiungi al calendario: ${props.calendarUrl}`
    );
  }, [whenText, props.manageUrl, props.calendarUrl]);

  const waLink = useMemo(() => {
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [message]);

  return (
    <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
      <textarea
        readOnly
        value={message}
        rows={6}
        style={{ width: "100%", padding: 10 }}
      />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(message);
            alert("Messaggio copiato ✅");
          }}
        >
          Copia messaggio
        </button>

        <a
          href={waLink}
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
          Invia su WhatsApp
        </a>
      </div>

      {props.phone ? (
        <p style={{ fontSize: 12, opacity: 0.8 }}>
          Telefono cliente: <strong>{props.phone}</strong>
        </p>
      ) : (
        <p style={{ fontSize: 12, opacity: 0.8 }}>
          (Telefono cliente non presente)
        </p>
      )}
    </div>
  );
}
