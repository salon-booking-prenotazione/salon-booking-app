"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ServiceItem = { id: string; name: string; duration_minutes: number };

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function monthLabelIT(d: Date) {
  return d.toLocaleDateString("it-IT", { month: "long", year: "numeric" });
}
function addMonths(base: Date, delta: number) {
  const d = new Date(base);
  d.setMonth(d.getMonth() + delta, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function daysInMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}
// Monday=1 ... Sunday=7
function weekdayISO(d: Date) {
  const js = d.getDay(); // 0 Sun ... 6 Sat
  return js === 0 ? 7 : js;
}

export default function PaginaPrenotazione({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // ====== STATE ======
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceId, setServiceId] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [monthCursor, setMonthCursor] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>(""); // HH:mm

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const timesWrapRef = useRef<HTMLDivElement | null>(null);

  // ====== FETCH SERVICES ======
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setErr(""); // reset eventuali errori precedenti
      try {
        const r = await fetch(`/api/salon/services?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({}));

        if (!r.ok || !j?.ok || !Array.isArray(j.services)) {
          throw new Error(j?.error || "Servizi non disponibili");
        }

        if (!cancelled) setServices(j.services);
      } catch (e: any) {
        if (!cancelled) {
          setServices([]);
          setErr(e?.message || "Servizi non disponibili");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);

  // ✅ RESET selezioni quando cambi mese o servizio (fix giorno/orario vecchio)
  useEffect(() => {
    setSelectedDate("");
    setSelectedTime("");
    timesWrapRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [monthCursor]);

  useEffect(() => {
    setSelectedDate("");
    setSelectedTime("");
    timesWrapRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [serviceId]);

  // ====== CALENDAR GRID ======
  const grid = useMemo(() => {
    const year = monthCursor.getFullYear();
    const m0 = monthCursor.getMonth();
    const total = daysInMonth(year, m0);

    // offset (Lun=0 ... Dom=6)
    const first = new Date(year, m0, 1);
    const firstIso = weekdayISO(first); // 1..7
    const offset = firstIso - 1; // Lun=0

    const cells: Array<{ day: number | null; dateStr: string | null; isoWeekday: number | null }> = [];

    for (let i = 0; i < offset; i++) {
      cells.push({ day: null, dateStr: null, isoWeekday: null });
    }
    for (let d = 1; d <= total; d++) {
      const dt = new Date(year, m0, d);
      const ds = ymd(dt);
      cells.push({ day: d, dateStr: ds, isoWeekday: weekdayISO(dt) });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, dateStr: null, isoWeekday: null });
    }

    return cells;
  }, [monthCursor]);

  const weekDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // ====== TIMES (DEMO finché non colleghiamo disponibilità reali) ======
  const times = useMemo(() => {
    return [
      "09:00","09:30","10:00","10:30","11:00","11:30",
      "12:00","12:30","13:00","13:30","14:00","14:30",
      "15:00","15:30","16:00","16:30","17:00","17:30",
      "18:00","18:30","19:00",
    ];
  }, []);

  function scrollTimes(dir: "left" | "right") {
    const el = timesWrapRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.75);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  // blocca lunedì (ISO weekday 1)
  function isClosedDay(isoWeekday: number | null) {
    return isoWeekday === 1;
  }

  const canConfirm =
    !!serviceId &&
    !!selectedDate &&
    !!selectedTime &&
    phone.trim().length >= 6 &&
    !loading;

  // ====== SUBMIT ======
  async function onConfirm() {
    if (!canConfirm) return;

    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          service_id: serviceId,
          date: selectedDate,
          time: selectedTime,
          customer_name: name.trim(),
          contact_phone: phone.trim(),
          contact_email: email.trim(),
          note: note.trim(),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json?.error || "Errore creazione prenotazione");
      }

      if (json.whatsapp_url) {
        window.location.href = json.whatsapp_url;
      } else {
        throw new Error("Manca whatsapp_url nella risposta API");
      }
    } catch (e: any) {
      setErr(e?.message || "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lux-bg">
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
              <b style={{ color: "var(--plum)" }}>{slug === "lorena-salon" ? "Lorena Salon" : slug}</b>
            </div>

            <div className="mt-7">
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

              {/* ✅ tendina con freccia custom + padding corretto */}
              <div style={{ position: "relative" }}>
                <select
                  className="lux-input"
                  style={{
                    width: "100%",
                    paddingRight: 44,
                    appearance: "none" as any,
                    opacity: services.length ? 1 : 0.6,
                  }}
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  disabled={!services.length}
                >
                  <option value="" disabled>
                    {services.length ? "Seleziona un servizio..." : "Caricamento servizi..."}
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <span
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    opacity: 0.55,
                    fontWeight: 900,
                  }}
                >
                  ▾
                </span>
              </div>
            </div>

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
                <input className="lux-input" placeholder="Nome (opzionale)" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="lux-input" placeholder="Telefono *" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className="lux-input" placeholder="Email (opzionale)" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="lux-input" placeholder="Note (opzionale)" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>

              {err && (
                <div className="mt-3" style={{ color: "crimson", fontWeight: 800 }}>
                  ✖ {err}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <a className="lux-btn lux-btn-primary" style={{ minWidth: 240 }} href="#calendario">
                Avanti
              </a>
            </div>
          </section>

          {/* DESTRA */}
          <section id="calendario" className="lux-card lux-frame p-8 md:p-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="lux-title text-2xl md:text-3xl">Scegli data e ora</h2>

              {/* ✅ mese con frecce */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="lux-btn"
                  style={{ width: 44, height: 44, padding: 0, borderRadius: 999 }}
                  onClick={() => setMonthCursor((d) => addMonths(d, -1))}
                  aria-label="Mese precedente"
                >
                  ‹
                </button>

                <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 800, minWidth: 160, textAlign: "center" }}>
                  {monthLabelIT(monthCursor)}
                </div>

                <button
                  type="button"
                  className="lux-btn"
                  style={{ width: 44, height: 44, padding: 0, borderRadius: 999 }}
                  onClick={() => setMonthCursor((d) => addMonths(d, +1))}
                  aria-label="Mese successivo"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
              {weekDays.map((g) => (
                <div key={g} className="text-center py-2" style={{ fontWeight: 800 }}>
                  {g}
                </div>
              ))}
            </div>

            {/* calendario */}
            <div className="grid grid-cols-7" style={{ borderTop: "1px solid var(--line)" }}>
              {grid.map((cell, idx) => {
                const disabled = cell.day === null || isClosedDay(cell.isoWeekday);
                const isSelected = !!cell.dateStr && cell.dateStr === selectedDate;

                return (
                  <div
                    key={idx}
                    style={{
                      borderRight: idx % 7 === 6 ? "none" : "1px solid var(--line)",
                      borderBottom: "1px solid var(--line)",
                      minHeight: 54,
                      background: disabled ? "rgba(28,28,30,0.02)" : "transparent",
                    }}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (!cell.dateStr) return;
                        setSelectedDate(cell.dateStr);
                        setSelectedTime("");
                        timesWrapRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                      }}
                      className="w-full h-[54px] grid place-items-center"
                      style={{
                        cursor: disabled ? "not-allowed" : "pointer",
                        color: disabled ? "rgba(28,28,30,0.25)" : "rgba(28,28,30,0.72)",
                        fontWeight: isSelected ? 900 : 600,
                        background: isSelected ? "rgba(91,42,63,0.10)" : "transparent",
                      }}
                    >
                      {cell.day ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05 }}>
                          <span>{cell.day}</span>
                          {/* ✅ lunedì chiuso */}
                          {cell.isoWeekday === 1 && (
                            <span style={{ fontSize: 10, opacity: 0.55, marginTop: 4, letterSpacing: "0.06em" }}>
                              CHIUSO
                            </span>
                          )}
                        </div>
                      ) : (
                        <span />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* orari */}
            <div className="mt-6">
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--muted)", marginBottom: 10 }}>
                Orari disponibili{selectedDate ? ` • ${selectedDate}` : ""}
              </div>

              {/* ✅ scroll orizzontale con frecce sx/dx */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  className="lux-btn"
                  style={{ width: 44, height: 44, padding: 0, borderRadius: 999 }}
                  onClick={() => scrollTimes("left")}
                  aria-label="Scorri a sinistra"
                >
                  ‹
                </button>

                <div
                  ref={timesWrapRef}
                  className="no-scrollbar"
                  style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    display: "flex",
                    gap: 10,
                    paddingBottom: 6,
                    scrollBehavior: "smooth",
                    width: "100%",
                  }}
                >
                  {times.map((t) => {
                    const selected = t === selectedTime;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`lux-slot ${selected ? "selected" : ""}`}
                        style={{
                          minWidth: 110,
                          flex: "0 0 auto",
                          opacity: selectedDate ? 1 : 0.5,
                          pointerEvents: selectedDate ? "auto" : "none",
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="lux-btn"
                  style={{ width: 44, height: 44, padding: 0, borderRadius: 999 }}
                  onClick={() => scrollTimes("right")}
                  aria-label="Scorri a destra"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {/* ✅ Conferma: più scura quando attiva */}
              <button
                className="lux-btn lux-btn-primary w-full"
                type="button"
                onClick={onConfirm}
                disabled={!canConfirm}
                style={{
                  opacity: canConfirm ? 1 : 0.55,
                  filter: canConfirm ? "none" : "saturate(0.6)",
                }}
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

            {selectedService?.duration_minutes ? (
              <div className="mt-2" style={{ color: "var(--muted)", fontSize: 12, textAlign: "center" }}>
                Durata servizio: <b>{selectedService.duration_minutes} min</b>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
