"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayRomeYMD() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value ?? "2026";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

function monthLabelIT(year: number, month1to12: number) {
  const d = new Date(Date.UTC(year, month1to12 - 1, 1, 12, 0, 0));
  return d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

function buildMonthGrid(year: number, month1to12: number) {
  // grid 6x7
  const first = new Date(Date.UTC(year, month1to12 - 1, 1, 12, 0, 0));
  // dayOfWeek: 0=Sun..6=Sat => vogliamo Lun..Dom
  const dowSun0 = first.getUTCDay();
  const dowMon0 = (dowSun0 + 6) % 7; // Lun=0 .. Dom=6

  const daysInMonth = new Date(Date.UTC(year, month1to12, 0, 12, 0, 0)).getUTCDate();
  const cells: Array<number | null> = Array(42).fill(null);

  let day = 1;
  for (let i = dowMon0; i < 42 && day <= daysInMonth; i++) {
    cells[i] = day++;
  }
  return cells;
}

export default function PaginaPrenotazione({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // TODO: poi lo prenderemo dal DB
  const nomeSalone = slug === "demo" ? "Lorena Salon" : `Salone ${slug}`;

  const giorni = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const servizi = useMemo(
    () => [
      { id: "svc1", name: "Taglio Uomo" },
      { id: "svc2", name: "Taglio" },
      { id: "svc3", name: "Taglio + Piega" },
      { id: "svc4", name: "Piega" },
      { id: "svc5", name: "Colore + Piega" },
      { id: "svc6", name: "Meches" },
      { id: "svc7", name: "Permanente" },
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

  const today = todayRomeYMD();
  const [Y, M, D] = today.split("-").map(Number);

  const [viewYear] = useState<number>(Y);
  const [viewMonth] = useState<number>(M);

  const mese = monthLabelIT(viewYear, viewMonth);
  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const [serviceId, setServiceId] = useState<string>("");
  const [giornoSelezionato, setGiornoSelezionato] = useState<number | null>(null);
  const [oraSelezionata, setOraSelezionata] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const selectedYMD = useMemo(() => {
    if (!giornoSelezionato) return "";
    return `${viewYear}-${pad2(viewMonth)}-${pad2(giornoSelezionato)}`;
  }, [giornoSelezionato, viewYear, viewMonth]);

  const todayDay = D;

  async function conferma() {
    setErr(null);

    if (!serviceId || !giornoSelezionato || !oraSelezionata) {
      setErr("Seleziona servizio, data e orario.");
      return;
    }
    if (!contactPhone.trim()) {
      setErr("Telefono obbligatorio.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          service_id: serviceId,
          date: selectedYMD,
          time: oraSelezionata,
          customer_name: customerName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          note,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Errore creazione prenotazione");
      }

      // apre WhatsApp (messaggio pronto)
      if (json.whatsapp_url) {
        window.open(json.whatsapp_url, "_blank");
      }
    } catch (e: any) {
      setErr(e?.message || "Errore");
    } finally {
      setLoading(false);
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
            <b style={{ color: "var(--plum)" }}>{nomeSalone}</b>
          </div>

          {/* SERVIZIO */}
          <div className="mt-6">
            <div
              className="mb-3"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Servizio *
            </div>

            <select
              className="lux-input"
              style={{ maxWidth: 420, width: "100%", margin: "0 auto", display: "block" }}
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              <option value="" disabled>
                Seleziona un servizio…
              </option>
              {servizi.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATI */}
          <div className="mt-6">
            <div
              className="mb-3"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              I tuoi dati
            </div>

            <div style={{ display: "grid", gap: 10 }}>
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

          {err && (
            <div className="mt-4" style={{ color: "crimson", fontWeight: 700 }}>
              ✕ {err}
            </div>
          )}
        </section>

        {/* DESTRA */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="lux-title text-2xl md:text-3xl">Scegli data e ora</h2>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 800 }}>
              {mese}
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
            {grid.map((v, idx) => {
              const vuoto = v === null;
              const n = v;

              const isSelected = n !== null && giornoSelezionato === n;
              const isToday = n !== null && n === todayDay;

              return (
                <div
                  key={idx}
                  style={{
                    borderRight: idx % 7 === 6 ? "none" : "1px solid var(--line)",
                    borderBottom: idx >= 35 ? "none" : "1px solid var(--line)",
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
                      fontWeight: isSelected ? 900 : 600,
                    }}
                  >
                    {isToday && !isSelected && (
                      <span
                        className="absolute h-8 w-8 rounded-full"
                        style={{ background: "rgba(127,143,134,0.22)" }}
                      />
                    )}
                    {isSelected && (
                      <span
                        className="absolute h-8 w-8 rounded-full"
                        style={{
                          background: "rgba(91,42,63,0.18)",
                          border: "1px solid rgba(91,42,63,0.25)",
                        }}
                      />
                    )}
                    <span className="relative z-10">{n ?? " "}</span>
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
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Invio..." : "Conferma"}
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
