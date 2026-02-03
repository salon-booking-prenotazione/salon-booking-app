"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ServiceRow = {
  id: string;
  name: string;
  duration_minutes: number;
};

type SalonRow = {
  id: string;
  name: string;
  slug: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

// YYYY-MM-DD per Europe/Rome (sicuro)
function todayRomeYMD(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")?.value ?? "2026";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

// mese visibile (Roma)
function monthLabelRome(date: Date): string {
  return date.toLocaleDateString("it-IT", {
    timeZone: "Europe/Rome",
    month: "long",
    year: "numeric",
  });
}

export default function PaginaPrenotazione({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // UI calendario
  const giorni = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // Orari demo (poi li renderemo dinamici)
  const orari = useMemo(
    () => [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
    ],
    []
  );

  // Stato dati salone/servizi da DB
  const [salon, setSalon] = useState<SalonRow | null>(null);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [serviceId, setServiceId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");

  // Data/ora selezionate
  const [selectedDate, setSelectedDate] = useState<string>(todayRomeYMD()); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mese corrente (Roma) per calendario demo
  const [monthCursor] = useState<Date>(new Date());

  // Stato chiamata API
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // Carica salon + services dal backend (consigliato: route server)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const res = await fetch(`/api/public/salon?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || "Impossibile caricare il salone");
        }

        if (cancelled) return;

        setSalon(json.salon);
        setServices(json.services || []);
      } catch (e: any) {
        if (!cancelled) setErrorMsg(e?.message || "Errore caricamento");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Calendario demo: griglia finta del mese (per ora semplice)
  // (Va benissimo per UI, poi la renderemo reale e con giorni disabilitati)
  const calendario = useMemo(() => {
    // demo: 1..30 in griglia 7 col
    // NON è un calendario reale: è solo UI provvisoria
    const cells = Array.from({ length: 35 }, (_, i) => {
      const day = i - 3; // sposta di 3 per avere un po' di vuoti
      if (day < 1 || day > 30) return "";
      return String(day);
    });

    const rows: string[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, []);

  const meseLabel = useMemo(() => monthLabelRome(monthCursor), [monthCursor]);

  // giorno “selected” nel calendario demo: usiamo il giorno della selectedDate
  const selectedDayNum = useMemo(() => {
    const d = Number(selectedDate.split("-")[2] || 1);
    return Number.isFinite(d) ? d : 1;
  }, [selectedDate]);

  async function onConfirm() {
    setSubmitting(true);
    setErrorMsg(null);
    setOkMsg(null);

    try {
      if (!serviceId) throw new Error("Seleziona un servizio");
      if (!selectedDate) throw new Error("Seleziona una data");
      if (!selectedTime) throw new Error("Seleziona un orario");
      if (!contactPhone.trim()) throw new Error("Inserisci il telefono");

      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          service_id: serviceId,
          date: selectedDate, // YYYY-MM-DD (Rome)
          time: selectedTime, // HH:mm (Rome)
          customer_name: customerName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          note,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(json?.error || "Errore creazione prenotazione");
      }

      // Apri WhatsApp con messaggio pronto
      if (json.whatsapp_url) {
        window.open(json.whatsapp_url, "_blank", "noopener,noreferrer");
      }

      setOkMsg("Prenotazione creata ✅ (si è aperto WhatsApp)");
    } catch (e: any) {
      setErrorMsg(e?.message || "Errore interno");
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
            <Link href="/" className="lux-btn" aria-label="Chiudi">
              ✕
            </Link>
          </div>

          <div className="mt-3 lux-subtitle">
            <b style={{ color: "var(--plum)" }}>
              {loading ? "Caricamento..." : salon?.name || `Salone ${slug}`}
            </b>
          </div>

          <div className="mt-7">
            <div
              className="mb-3"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Servizio *
            </div>

            {/* ✅ tendina NON troppo lontana: niente justify-center */}
            <select
              className="lux-input"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              disabled={loading || services.length === 0}
            >
              <option value="" disabled>
                {loading ? "Carico servizi..." : "Seleziona un servizio…"}
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="mt-6">
              <div
                className="mb-3"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
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
              <div style={{ marginTop: 12, color: "crimson", fontWeight: 800 }}>
                ✕ {errorMsg}
              </div>
            )}
            {okMsg && (
              <div style={{ marginTop: 12, color: "rgb(22,163,74)", fontWeight: 800 }}>
                ✓ {okMsg}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                className="lux-btn lux-btn-primary w-full"
                type="button"
                onClick={onConfirm}
                disabled={submitting || !serviceId || !selectedTime || !contactPhone.trim()}
                style={{
                  opacity:
                    submitting || !serviceId || !selectedTime || !contactPhone.trim() ? 0.6 : 1,
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
          </div>
        </section>

        {/* DESTRA */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="lux-title text-2xl md:text-3xl">Scegli data e ora</h2>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 800 }}>
              {meseLabel}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
            {giorni.map((g) => (
              <div key={g} className="text-center py-2" style={{ fontWeight: 800 }}>
                {g}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendario.flat().map((v, idx) => {
              const vuoto = v === "";
              const n = vuoto ? null : Number(v);
              const isSelected = n !== null && n === selectedDayNum;

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
                    onClick={() => {
                      if (!n) return;
                      // aggiorna selectedDate mantenendo YYYY-MM-
                      const [Y, M] = selectedDate.split("-").slice(0, 2);
                      setSelectedDate(`${Y}-${M}-${pad2(n)}`);
                    }}
                    className="w-full h-[42px] grid place-items-center relative"
                    style={{
                      cursor: vuoto ? "default" : "pointer",
                      background: isSelected ? "rgba(91,42,63,0.10)" : "transparent",
                      color: vuoto ? "rgba(35,35,38,0.28)" : "rgba(35,35,38,0.72)",
                      fontWeight: isSelected ? 900 : 600,
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
                onClick={() => setSelectedTime(t)}
                className={`lux-slot ${selectedTime === t ? "selected" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
