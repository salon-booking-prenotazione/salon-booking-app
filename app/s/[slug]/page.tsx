"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function PaginaPrenotazione({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const nomeSalone = slug === "demo" ? "Lorena Salon" : `Salone ${slug}`;
  const mese = "Aprile 2026";
  const giorni = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  // Demo: lista servizi (poi la colleghiamo al DB)
  const servizi = useMemo(
    () => [
      { id: "demo-taglio-uomo", name: "Taglio Uomo" },
      { id: "demo-taglio", name: "Taglio" },
      { id: "demo-taglio-piega", name: "Taglio + Piega" },
      { id: "demo-piega", name: "Piega" },
      { id: "demo-colore-piega", name: "Colore + Piega" },
      { id: "demo-meches", name: "Meches" },
      { id: "demo-permanente", name: "Permanente" },
    ],
    []
  );

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

  const [serviceId, setServiceId] = useState<string>("");
  const [giornoSelezionato, setGiornoSelezionato] = useState<number | null>(null);
  const [oraSelezionata, setOraSelezionata] = useState<string | null>(null);

  // contatti
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  // risultato prenotazione
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<null | {
    whatsapp_url: string;
    manage_url: string;
    calendar_ics_url: string;
  }>(null);

  const oggiDemo = 7;

  // Aprile 2026 (mese 04)
  function selectedDateStr(): string | null {
    if (!giornoSelezionato) return null;
    const dd = String(giornoSelezionato).padStart(2, "0");
    return `2026-04-${dd}`;
  }

  async function conferma() {
    setErr(null);
    setDone(null);

    const dateStr = selectedDateStr();
    if (!serviceId || !dateStr || !oraSelezionata) {
      setErr("Seleziona servizio, data e orario.");
      return;
    }
    if (!phone.trim()) {
      setErr("Inserisci il numero di telefono.");
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
          date: dateStr,
          time: oraSelezionata,
          customer_name: customerName,
          contact_phone: phone,
          contact_email: email,
          note,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Errore creazione prenotazione");
      }

      setDone({
        whatsapp_url: json.whatsapp_url,
        manage_url: json.manage_url,
        calendar_ics_url: json.calendar_ics_url,
      });

      // apre WhatsApp (nuova tab)
      window.open(json.whatsapp_url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      setErr(e?.message || "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">

        {/* SINISTRA: servizio + contatti */}
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
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Servizio *
            </div>

            <div className="mt-3">
              <select
                className="lux-input"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                <option value="" disabled>Seleziona un servizio…</option>
                {servizi.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lux-sep my-6" />

          {/* CONTATTI */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            I tuoi dati
          </div>

          <div className="mt-3 grid gap-3">
            <input
              className="lux-input"
              placeholder="Nome (opzionale)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              className="lux-input"
              placeholder="Telefono *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="lux-input"
              placeholder="Email (opzionale)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="lux-input"
              placeholder="Note (opzionale)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {err && (
            <div className="mt-4" style={{ color: "crimson", fontWeight: 700 }}>
              ❌ {err}
            </div>
          )}

          {done && (
            <div className="mt-5 lux-card p-4" style={{ background: "rgba(255,255,255,0.70)" }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>✅ Prenotazione creata</div>
              <div className="flex gap-3 flex-wrap">
                <a className="lux-btn lux-btn-primary" href={done.whatsapp_url} target="_blank" rel="noreferrer">
                  Apri WhatsApp
                </a>
                <a className="lux-btn" href={done.calendar_ics_url} target="_blank" rel="noreferrer">
                  Scarica ICS
                </a>
                <a className="lux-btn" href={done.manage_url} target="_blank" rel="noreferrer">
                  Gestisci / Disdici
                </a>
              </div>
            </div>
          )}
        </section>

        {/* DESTRA: calendario + orari + conferma */}
        <section id="calendario" className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="lux-title text-2xl md:text-3xl">Scegli data e ora</h2>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 800 }}>{mese}</div>
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

              const isSelected = n !== null && giornoSelezionato === n;
              const isToday = n !== null && n === oggiDemo;

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
                      fontWeight: isSelected ? 900 : 500,
                    }}
                  >
                    {isToday && !isSelected && (
                      <span className="absolute h-8 w-8 rounded-full" style={{ background: "rgba(127,143,134,0.28)" }} />
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
              disabled={loading || !serviceId || !giornoSelezionato || !oraSelezionata}
              style={{ opacity: loading || !serviceId || !giornoSelezionato || !oraSelezionata ? 0.6 : 1 }}
            >
              {loading ? "Confermo..." : "Conferma"}
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
