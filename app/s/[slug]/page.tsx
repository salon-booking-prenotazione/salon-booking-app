"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ServiceRow = {
  id: string;
  name: string;
  duration_minutes: number;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatMonthIT(d: Date) {
  const mesi = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  return `${mesi[d.getMonth()]} ${d.getFullYear()}`;
}

function toYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function buildCalendarGrid(monthAnchor: Date) {
  // monthAnchor: una data qualsiasi dentro il mese che stai mostrando
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  // vogliamo grid che parte da Lun (1) e finisce Dom (7)
  // JS: getDay() => 0=Dom,1=Lun,...6=Sab
  const firstDayJs = first.getDay(); // 0..6
  const firstDayMonBased = firstDayJs === 0 ? 7 : firstDayJs; // 1..7 (Lun..Dom)
  const leadingEmpty = firstDayMonBased - 1; // quanti vuoti prima del 1

  const daysInMonth = last.getDate();
  const totalCells = Math.ceil((leadingEmpty + daysInMonth) / 7) * 7;

  const cells: Array<{ date: Date | null }> = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - leadingEmpty + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push({ date: null });
    } else {
      cells.push({ date: new Date(year, month, dayNum) });
    }
  }
  return cells;
}

export default function PaginaPrenotazione({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesErr, setServicesErr] = useState<string | null>(null);

  // demo nome salone (puoi poi sostituire con fetch vero se vuoi)
  const nomeSalone = slug === "lorena-salon" ? "Lorena Salon" : slug === "demo" ? "Lorena Salon" : `Salone ${slug}`;

  // mese “visibile”
  const [monthAnchor, setMonthAnchor] = useState(() => {
    // parti dal mese corrente (non “Aprile 2026” fisso)
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const giorni = useMemo(() => ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"], []);

  const orari = useMemo(
    () => [
      "09:00","09:30","10:00","10:30","11:00","11:30",
      "12:00","12:30","13:00","13:30","14:00","14:30",
      "15:00","15:30","16:00","16:30","17:00","17:30",
      "18:00","18:30","19:00",
    ],
    []
  );

  const calendarCells = useMemo(() => buildCalendarGrid(monthAnchor), [monthAnchor]);

  const [serviceId, setServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [customerName, setCustomerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const timesRowRef = useRef<HTMLDivElement | null>(null);

  // ✅ carica servizi REALI da Supabase con ANON KEY (browser)
  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setLoadingServices(true);
      setServicesErr(null);

      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !anon) {
          throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
        }

        // 1) trova salon_id dal slug
        const salonRes = await fetch(`${url}/rest/v1/salons?slug=eq.${encodeURIComponent(slug)}&select=id,name`, {
          headers: {
            apikey: anon,
            Authorization: `Bearer ${anon}`,
          },
          cache: "no-store",
        });

        const salonJson = await salonRes.json();
        if (!salonRes.ok || !Array.isArray(salonJson) || salonJson.length === 0) {
          throw new Error("Salone non trovato");
        }
        const salonId = salonJson[0].id as string;

        // 2) carica servizi del salone
        const svcRes = await fetch(
          `${url}/rest/v1/services?salon_id=eq.${encodeURIComponent(salonId)}&select=id,name,duration_minutes&order=name.asc`,
          {
            headers: {
              apikey: anon,
              Authorization: `Bearer ${anon}`,
            },
            cache: "no-store",
          }
        );

        const svcJson = await svcRes.json();
        if (!svcRes.ok || !Array.isArray(svcJson)) {
          throw new Error("Impossibile caricare i servizi");
        }

        if (!cancelled) {
          setServices(svcJson as ServiceRow[]);
        }
      } catch (e: any) {
        if (!cancelled) setServicesErr(e?.message || "Errore caricamento servizi");
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    }

    loadServices();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ✅ lunedì chiuso (JS: getDay 1 = Lun)
  function isClosedMonday(dateObj: Date) {
    return dateObj.getDay() === 1;
  }

  function scrollTimes(dir: "left" | "right") {
    const el = timesRowRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  const canConfirm =
    !!serviceId &&
    !!selectedDate &&
    !!selectedTime &&
    contactPhone.trim().length >= 6 &&
    !submitting;

  async function onConfirm() {
    if (!canConfirm) return;

    setSubmitting(true);
    setSubmitErr(null);

    try {
      const res = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          service_id: serviceId,
          date: selectedDate,
          time: selectedTime,
          customer_name: customerName.trim(),
          contact_phone: contactPhone.trim(),
          contact_email: contactEmail.trim(),
          note: note.trim(),
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Errore creazione prenotazione");
      }

      // ✅ apre WhatsApp con il messaggio pronto
      const wa = String(json.whatsapp_url || "");
      if (wa) {
        window.open(wa, "_blank", "noreferrer");
      } else {
        // fallback: se manca url
        alert("Prenotazione creata ✅ (ma manca whatsapp_url)");
      }
    } catch (e: any) {
      setSubmitErr(e?.message || "Errore");
    } finally {
      setSubmitting(false);
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
              <b style={{ color: "var(--plum)" }}>{nomeSalone}</b>
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

              {/* Select con freccia custom (più “a sinistra” e più elegante) */}
              <div className="flex justify-center">
                <div className="relative" style={{ maxWidth: 420, width: "100%" }}>
                  <select
                    className="lux-input"
                    style={{
                      width: "100%",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      paddingRight: 44, // spazio per freccia
                    }}
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    disabled={loadingServices}
                  >
                    <option value="" disabled>
                      {loadingServices ? "Carico servizi..." : "Seleziona un servizio…"}
                    </option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  {/* freccia custom */}
                  <div
                    style={{
                      position: "absolute",
                      right: 14, // un po’ più a sinistra rispetto al bordo
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 26,
                      height: 26,
                      borderRadius: 10,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid rgba(28,28,30,0.14)",
                      background: "rgba(255,255,255,0.55)",
                      pointerEvents: "none",
                      color: "rgba(28,28,30,0.60)",
                      fontWeight: 900,
                    }}
                  >
                    ▾
                  </div>
                </div>
              </div>

              {servicesErr && (
                <div className="mt-3 text-center" style={{ fontSize: 13, color: "crimson" }}>
                  ✖ {servicesErr}
                </div>
              )}
            </div>

            {/* DATI CLIENTE */}
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

              {/* mese + frecce eleganti */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="lux-btn"
                  style={{ padding: "8px 12px", borderRadius: 12, boxShadow: "none" }}
                  onClick={() => setMonthAnchor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                  aria-label="Mese precedente"
                >
                  ‹
                </button>

                <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 800, minWidth: 110, textAlign: "center" }}>
                  {formatMonthIT(monthAnchor)}
                </div>

                <button
                  type="button"
                  className="lux-btn"
                  style={{ padding: "8px 12px", borderRadius: 12, boxShadow: "none" }}
                  onClick={() => setMonthAnchor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                  aria-label="Mese successivo"
                >
                  ›
                </button>
              </div>
            </div>

            {/* header giorni */}
            <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
              {giorni.map((g) => (
                <div key={g} className="text-center py-2" style={{ fontWeight: 800 }}>
                  {g}
                </div>
              ))}
            </div>

            {/* calendario */}
            <div className="grid grid-cols-7">
              {calendarCells.map((cell, idx) => {
                if (!cell.date) {
                  return (
                    <div
                      key={idx}
                      style={{
                        borderRight: idx % 7 === 6 ? "none" : "1px solid var(--line)",
                        borderBottom: idx >= calendarCells.length - 7 ? "none" : "1px solid var(--line)",
                        height: 48,
                      }}
                    />
                  );
                }

                const d = cell.date;
                const dateStr = toYYYYMMDD(d);
                const isSelected = selectedDate === dateStr;

                const closed = isClosedMonday(d);

                return (
                  <div
                    key={idx}
                    style={{
                      borderRight: idx % 7 === 6 ? "none" : "1px solid var(--line)",
                      borderBottom: idx >= calendarCells.length - 7 ? "none" : "1px solid var(--line)",
                    }}
                  >
                    <button
                      type="button"
                      disabled={closed}
                      onClick={() => {
                        if (closed) return;
                        setSelectedDate(dateStr);
                        setSelectedTime("");
                      }}
                      className="w-full h-[48px] grid place-items-center relative"
                      style={{
                        cursor: closed ? "not-allowed" : "pointer",
                        background: isSelected ? "rgba(91,42,63,0.10)" : "transparent",
                        color: closed ? "rgba(35,35,38,0.28)" : "rgba(35,35,38,0.78)",
                        fontWeight: isSelected ? 900 : 600,
                      }}
                    >
                      {isSelected && (
                        <span
                          className="absolute h-9 w-9 rounded-full"
                          style={{
                            background: "rgba(91,42,63,0.14)",
                            border: "1px solid rgba(91,42,63,0.22)",
                          }}
                        />
                      )}
                      <span className="relative z-10">{d.getDate()}</span>

                      {closed && (
                        <span
                          className="absolute bottom-[6px] text-[10px]"
                          style={{ color: "rgba(35,35,38,0.32)", fontWeight: 800, letterSpacing: "0.06em" }}
                        >
                          CHIUSO
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* orari: frecce sx/dx + scroll orizzontale */}
            <div className="mt-6">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 800, color: "var(--muted)", fontSize: 12 }}>
                  Orari disponibili{selectedDate ? ` • ${selectedDate}` : ""}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="lux-btn"
                    style={{ padding: "8px 12px", borderRadius: 12, boxShadow: "none" }}
                    onClick={() => scrollTimes("left")}
                    aria-label="Scorri a sinistra"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="lux-btn"
                    style={{ padding: "8px 12px", borderRadius: 12, boxShadow: "none" }}
                    onClick={() => scrollTimes("right")}
                    aria-label="Scorri a destra"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div
                ref={timesRowRef}
                style={{
                  marginTop: 12,
                  overflowX: "auto",
                  overflowY: "hidden",
                  display: "flex",
                  gap: 10,
                  paddingBottom: 6,
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {orari.map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={!selectedDate}
                    onClick={() => setSelectedTime(t)}
                    className={`lux-slot ${selectedTime === t ? "selected" : ""}`}
                    style={{
                      minWidth: 110,
                      opacity: !selectedDate ? 0.5 : 1,
                      cursor: !selectedDate ? "not-allowed" : "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {submitErr && (
              <div className="mt-4" style={{ color: "crimson", fontWeight: 800 }}>
                ✖ {submitErr}
              </div>
            )}

            {/* bottoni */}
            <div className="mt-8 flex gap-3">
              <button
                className={`lux-btn w-full ${canConfirm ? "lux-btn-primary" : ""}`}
                type="button"
                onClick={onConfirm}
                disabled={!canConfirm}
                style={{
                  opacity: canConfirm ? 1 : 0.55,
                  filter: canConfirm ? "none" : "grayscale(0.15)",
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
    </div>
  );
}
