"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MonthCursor = { year: number; monthIndex: number }; // monthIndex: 0-11

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function firstDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay(); // 0=Sun ... 6=Sat
}

// LUN=1 ... DOM=0 (JS). Noi vogliamo griglia che parte da LUN.
function mondayBasedIndex(jsDay: number) {
  // jsDay: 0 (Sun) -> 6 (Sat)
  // return: 0 (Mon) -> 6 (Sun)
  return (jsDay + 6) % 7;
}

function formatMonthIT(year: number, monthIndex: number) {
  const d = new Date(year, monthIndex, 1);
  return d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function PaginaPrenotazione({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // --- DEMO: Nome salone (poi lo collegheremo al DB) ---
  const nomeSalone = slug === "lorena-salon" ? "Lorena Salon" : slug === "demo" ? "Lorena Salon" : `Salone ${slug}`;

  // --- SERVIZI DEMO (poi lo collegheremo al DB con id reali) ---
  const servizi = useMemo(
    () => [
      { id: "svc1", name: "Taglio Uomo", duration_minutes: 30 },
      { id: "svc2", name: "Taglio", duration_minutes: 30 },
      { id: "svc3", name: "Taglio + Piega", duration_minutes: 40 },
      { id: "svc4", name: "Piega", duration_minutes: 45 },
      { id: "svc5", name: "Colore + Piega", duration_minutes: 90 },
      { id: "svc6", name: "Meches", duration_minutes: 90 },
      { id: "svc7", name: "Balayage", duration_minutes: 120 },
    ],
    []
  );

  // --- ORARI (demo) ---
  const orari = useMemo(
    () => [
      "09:00","09:30","10:00","10:30","11:00","11:30",
      "12:00","12:30","13:00","13:30","14:00","14:30",
      "15:00","15:30","16:00","16:30","17:00","17:30",
      "18:00","18:30","19:00",
    ],
    []
  );

  // --- DATI CLIENTE ---
  const [customerName, setCustomerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");

  // --- SELEZIONI ---
  const [servizioId, setServizioId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // day number 1..31
  const [oraSelezionata, setOraSelezionata] = useState<string | null>(null);

  // --- MESE DINAMICO (oggi) ---
  const now = new Date();
  const [cursor, setCursor] = useState<MonthCursor>({
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
  });

  const monthLabel = useMemo(
    () => formatMonthIT(cursor.year, cursor.monthIndex),
    [cursor.year, cursor.monthIndex]
  );

  const giorniHeader = useMemo(() => ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"], []);

  // --- CALENDARIO GRIGLIA ---
  const calendarCells = useMemo(() => {
    const total = daysInMonth(cursor.year, cursor.monthIndex);
    const firstJs = firstDayOfMonth(cursor.year, cursor.monthIndex); // 0..6
    const offset = mondayBasedIndex(firstJs); // 0..6 where 0 is Mon

    const cells: Array<{ day: number | null }> = [];
    for (let i = 0; i < offset; i++) cells.push({ day: null });
    for (let d = 1; d <= total; d++) cells.push({ day: d });

    // completa a multiplo di 7
    while (cells.length % 7 !== 0) cells.push({ day: null });
    return cells;
  }, [cursor.year, cursor.monthIndex]);

  // Lunedì chiuso
  function isMondayClosed(day: number) {
    const d = new Date(cursor.year, cursor.monthIndex, day);
    const js = d.getDay(); // 0=Sun 1=Mon
    return js === 1;
  }

  // Cambia mese (prev/next)
  function addMonths(delta: number) {
    const base = new Date(cursor.year, cursor.monthIndex, 1);
    base.setMonth(base.getMonth() + delta);
    setCursor({ year: base.getFullYear(), monthIndex: base.getMonth() });
    // reset selezioni data/ora quando cambi mese (evita bug tipo “7 rimane selezionato”)
    setSelectedDay(null);
    setOraSelezionata(null);
  }

  // Data selezionata (stringa tipo YYYY-MM-DD)
  const selectedDateStr = useMemo(() => {
    if (!selectedDay) return "";
    return `${cursor.year}-${pad2(cursor.monthIndex + 1)}-${pad2(selectedDay)}`;
  }, [cursor.year, cursor.monthIndex, selectedDay]);

  const servizioSelected = useMemo(
    () => servizi.find((s) => s.id === servizioId) || null,
    [servizi, servizioId]
  );

  const canConfirm =
    !!servizioId &&
    !!selectedDay &&
    !!oraSelezionata &&
    contactPhone.trim().length >= 6; // minimo semplice, poi miglioriamo

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
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Servizio *
            </div>

            <div className="flex justify-center">
              <div className="relative" style={{ maxWidth: 420, width: "100%" }}>
                {/* Select con arrow custom più “a sinistra” */}
                <select
                  className="lux-input appearance-none pr-12"
                  value={servizioId}
                  onChange={(e) => setServizioId(e.target.value)}
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

                {/* Arrow custom */}
                <div
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                  style={{
                    right: 16,
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: "1px solid rgba(28,28,30,0.12)",
                    background: "rgba(255,255,255,0.55)",
                    display: "grid",
                    placeItems: "center",
                    color: "rgba(28,28,30,0.55)",
                    fontWeight: 900,
                  }}
                >
                  ▾
                </div>
              </div>
            </div>
          </div>

          {/* I TUOI DATI */}
          <div className="mt-8">
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

          <div className="mt-6 flex justify-center">
            <a className="lux-btn lux-btn-primary" style={{ minWidth: 240 }} href="#calendario">
              Avanti
            </a>
          </div>
        </section>

        {/* DESTRA */}
        <section id="calendario" className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="lux-title text-2xl md:text-3xl">Scegli data e ora</h2>

            {/* Header mese con prev/next */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="lux-btn"
                style={{ padding: "8px 12px", borderRadius: 12 }}
                onClick={() => addMonths(-1)}
                aria-label="Mese precedente"
              >
                ‹
              </button>

              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "capitalize",
                  padding: "6px 10px",
                }}
              >
                {monthLabel}
              </div>

              <button
                type="button"
                className="lux-btn"
                style={{ padding: "8px 12px", borderRadius: 12 }}
                onClick={() => addMonths(1)}
                aria-label="Mese successivo"
              >
                ›
              </button>
            </div>
          </div>

          {/* Giorni header */}
          <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
            {giorniHeader.map((g) => (
              <div key={g} className="text-center py-2" style={{ fontWeight: 800 }}>
                {g}
              </div>
            ))}
          </div>

          {/* Griglia calendario */}
          <div className="grid grid-cols-7" style={{ borderTop: "1px solid var(--line)" }}>
            {calendarCells.map((cell, idx) => {
              const d = cell.day;
              const isEmpty = d == null;
              const closed = d != null && isMondayClosed(d);
              const isSelected = d != null && selectedDay === d;

              return (
                <div
                  key={idx}
                  style={{
                    borderRight: idx % 7 === 6 ? "none" : "1px solid var(--line)",
                    borderBottom: "1px solid var(--line)",
                    minHeight: 46,
                  }}
                >
                  <button
                    type="button"
                    disabled={isEmpty || closed}
                    onClick={() => {
                      if (!d) return;
                      setSelectedDay(d);
                      setOraSelezionata(null); // reset ora quando cambi giorno
                    }}
                    className="w-full h-[46px] grid place-items-center relative"
                    style={{
                      cursor: isEmpty || closed ? "not-allowed" : "pointer",
                      background: isSelected ? "rgba(91,42,63,0.10)" : "transparent",
                      color: isEmpty
                        ? "rgba(35,35,38,0.20)"
                        : closed
                        ? "rgba(35,35,38,0.30)"
                        : "rgba(35,35,38,0.72)",
                      fontWeight: isSelected ? 900 : 600,
                      opacity: closed ? 0.55 : 1,
                    }}
                    title={closed ? "Chiuso (lunedì)" : undefined}
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

                    {/* Etichetta “CHIUSO” mini per lunedì */}
                    {closed && d && (
                      <span
                        className="absolute bottom-1"
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "rgba(35,35,38,0.35)",
                        }}
                      >
                        chiuso
                      </span>
                    )}

                    <span className="relative z-10">{d ?? " "}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Orari con “ascensore” */}
          <div className="mt-6">
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "var(--muted)",
                marginBottom: 10,
              }}
            >
              Orari disponibili {selectedDateStr ? `• ${selectedDateStr}` : ""}
            </div>

            <div
              style={{
                maxHeight: 320,
                overflowY: "auto",
                paddingRight: 6,
              }}
            >
              <div className="grid grid-cols-3 gap-3">
                {orari.map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={!selectedDay}
                    onClick={() => setOraSelezionata(t)}
                    className={`lux-slot ${oraSelezionata === t ? "selected" : ""}`}
                    style={{
                      opacity: selectedDay ? 1 : 0.55,
                      cursor: selectedDay ? "pointer" : "not-allowed",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottoni */}
          <div className="mt-8 flex gap-3">
            <button
              className="lux-btn lux-btn-primary w-full"
              type="button"
              disabled={!canConfirm}
              style={{
                opacity: canConfirm ? 1 : 0.55,
                filter: canConfirm ? "none" : "grayscale(0.25)",
                // quando è attivo: più scuro (si nota subito)
                background: canConfirm
                  ? "linear-gradient(180deg, rgba(111,128,119,1), rgba(92,110,101,1))"
                  : "linear-gradient(180deg, rgba(127,143,134,0.65), rgba(111,128,119,0.65))",
              }}
              onClick={() => {
                // Per ora solo demo: qui poi colleghiamo la chiamata API /api/appointments/create
                alert(
                  `Conferma (demo)\n\nSalone: ${nomeSalone}\nServizio: ${servizioSelected?.name}\nData: ${selectedDateStr}\nOra: ${oraSelezionata}\nTel: ${contactPhone}`
                );
              }}
            >
              Conferma
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
