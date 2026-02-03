"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Service = { id: string; name: string; duration_minutes: number };
type Salon = { id: string; name: string; slug: string; phone?: string | null };

export default function PaginaPrenotazione({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // UI (demo calendario statico, poi lo renderemo reale)
  const mese = "Aprile 2026";
  const giorni = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const calendario = useMemo(
    () => [
      ["", "", "", "1", "2", "3", "4"],
      ["5", "6", "7", "8", "9", "10", "11"],
      ["12", "13", "14", "15", "16", "17", "18"],
      ["19", "20", "21", "22", "23", "24", "25"],
      ["26", "27", "28", "29", "30", "", ""],
    ],
    []
  );

  const orari = useMemo(
    () => [
      "09:00","09:30","10:00","10:30","11:00","11:30",
      "12:00","12:30","13:00","13:30","14:00","14:30",
      "15:00","15:30","16:00","16:30","17:00","17:30",
      "18:00","18:30","19:00",
    ],
    []
  );

  // Stato data/services
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingSalon, setLoadingSalon] = useState(true);

  // Scelte utente
  const [serviceId, setServiceId] = useState<string>("");
  const [giornoSelezionato, setGiornoSelezionato] = useState<number | null>(null);
  const [oraSelezionata, setOraSelezionata] = useState<string | null>(null);

  // Dati cliente
  const [customerName, setCustomerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");

  // Messaggi
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Carica salone + servizi veri
  useEffect(() => {
    let alive = true;
    setLoadingSalon(true);
    setErrorMsg(null);

    fetch(`/api/public/salon?slug=${encodeURIComponent(slug)}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.ok) throw new Error(j.error || "Errore caricamento salone");
        return j as { ok: true; salon: Salon; services: Service[] };
      })
      .then((j) => {
        if (!alive) return;
        setSalon(j.salon);
        setServices(j.services || []);
      })
      .catch((e: any) => {
        if (!alive) return;
        setErrorMsg(e?.message || "Errore");
      })
      .finally(() => {
        if (!alive) return;
        setLoadingSalon(false);
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  function dateISOFromDay(day: number) {
    // demo: Aprile 2026
    const dd = String(day).padStart(2, "0");
    return `2026-04-${dd}`;
  }

  async function conferma() {
    setErrorMsg(null);

    if (!serviceId || !giornoSelezionato || !oraSelezionata) {
      setErrorMsg("Seleziona servizio, data e orario.");
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg("Telefono obbligatorio.");
      return;
    }

    const payload = {
      slug,
      service_id: serviceId,
      date: dateISOFromDay(giornoSelezionato),
      time: oraSelezionata,
      customer_name: customerName.trim(),
      contact_phone: contactPhone.trim(),
      contact_email: contactEmail.trim(),
      note: note.trim(),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Errore creazione prenotazione");
      }

      // Apri WhatsApp con messaggio pronto
      if (json.whatsapp_url) {
        window.open(json.whatsapp_url, "_blank", "noopener,noreferrer");
      } else {
        setErrorMsg("Prenotazione creata, ma WhatsApp non disponibile.");
      }
    } catch (e: any) {
      setErrorMsg(e?.message || "Errore");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        {/* SINISTRA */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-start justify-between">
            <h1 className="lux-title text-3xl md:text-4xl">Prenota</h1>
            <Link href="/" className="lux-btn lux-btn-ghost" aria-label="Chiudi">
              ✕
            </Link>
          </div>

          <div className="mt-3 lux-subtitle">
            {loadingSalon ? (
              <span>Caricamento…</span>
            ) : salon ? (
              <b style={{ color: "var(--plum)" }}>{salon.name}</b>
            ) : (
              <span style={{ color: "crimson" }}>Salone non trovato</span>
            )}
          </div>

          {/* SERVIZIO */}
          <div className="mt-6">
            <div
              className="mb-3"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Servizio *
            </div>

            <select
              className="lux-input"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              disabled={!salon || loadingSalon}
            >
              <option value="" disabled>
                Seleziona un servizio…
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes} min)
                </option>
              ))}
            </select>
          </div>

          {/* DATI */}
          <div className="mt-8">
            <div
              className="mb-3"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              I tuoi dati
            </div>

            <div className="grid gap-3">
              <input
                className="lux-input"
                placeholder="Nome (opzionale)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input
                className="lux-input"
                placeholder="Telefono *"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
              <input
                className="lux-input"
                placeholder="Email (opzionale)"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <input
                className="lux-input"
                placeholder="Note (opzionale)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4" style={{ color: "crimson", fontWeight: 800 }}>
              ✕ {errorMsg}
            </div>
          )}
        </section>

        {/* DESTRA */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="lux-title text-2xl md:text-3xl">Scegli data e ora</h2>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>{mese}</div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
            {giorni.map((g) => (
              <div key={g} className="text-center py-2" style={{ fontWeight: 700 }}>
                {g}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendario.flat().map((v, idx) => {
              const vuoto = v === "";
              const n = vuoto ? null : Number(v);
              const isSelected = n !== null && giornoSelezionato === n;

              return (
                <div
                  key={idx}
                  style={{
                    borderRight: idx % 7 === 6 ? "none" : "1px solid var(--line)",
                    borderBottom: idx >= 28 ? "none" : "1px solid var(--line)",
                  }}
                >
                  <button
                    type="button"
                    disabled={vuoto}
                    onClick={() => n !== null && setGiornoSelezionato(n)}
                    className="w-full h-[42px] grid place-items-center relative"
                    style={{
                      cursor: vuoto ? "default" : "pointer",
                      background: isSelected ? "rgba(91,42,63,0.10)" : "transparent",
                      color: vuoto ? "rgba(35,35,38,0.28)" : "rgba(35,35,38,0.72)",
                      fontWeight: isSelected ? 800 : 500,
                    }}
                  >
                    {isSelected && (
                      <span
                        className="absolute h-8 w-8 rounded-full"
                        style={{
                          background: "rgba(91,42,63,0.18)",
                          border: "1px solid rgba(91,42,63,0.25)",
                        }}
                      />
                    )}
                    <span className="relative z-10">{v || " "}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {orari.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOraSelezionata(t)}
                className={`lux-slot ${oraSelezionata === t ? "selected" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              className="lux-btn lux-btn-primary w-full"
              type="button"
              onClick={conferma}
              disabled={submitting || !serviceId || !giornoSelezionato || !oraSelezionata || !contactPhone.trim()}
              style={{
                opacity:
                  submitting || !serviceId || !giornoSelezionato || !oraSelezionata || !contactPhone.trim()
                    ? 0.6
                    : 1,
              }}
            >
              {submitting ? "Confermo..." : "Conferma"}
            </button>
            <Link className="lux-btn w-full" href="/">
              Indietro
            </Link>
          </div>

          <div className="mt-3" style={{ color: "var(--muted)", fontSize: 12, textAlign: "center" }}>
            Dopo la conferma si apre WhatsApp con il messaggio pronto ✨
          </div>
        </section>
      </div>
    </div>
  );
}
