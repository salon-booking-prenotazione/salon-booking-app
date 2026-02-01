"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function PaginaPrenotazione({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const nomeSalone = slug === "demo" ? "Lorena Salon" : `Salone ${slug}`;
  const mese = "Aprile 2026";
  const giorni = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const servizi = useMemo(
    () => ["Taglio Uomo", "Taglio", "Taglio + Piega", "Piega", "Colore + Piega", "Meches", "Permanente"],
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

  const [servizio, setServizio] = useState<string>("");
  const [giornoSelezionato, setGiornoSelezionato] = useState<number | null>(null);
  const [oraSelezionata, setOraSelezionata] = useState<string | null>(null);

  const oggiDemo = 7;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        {/* SINISTRA */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-start justify-between">
            <h1 className="lux-title text-3xl md:text-4xl">Prenota appuntamento</h1>
            <Link href="/" className="lux-btn lux-btn-ghost" aria-label="Chiudi">
              ✕
            </Link>
          </div>

          <div className="mt-3 lux-subtitle">
            <b style={{ color: "var(--plum)" }}>{nomeSalone}</b>
          </div>

          {/* BLOCCO SERVIZIO (pulito, centrato, non full width) */}
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

            <div className="flex justify-center">
              <select
                className="lux-input"
                style={{ maxWidth: 360, width: "100%" }}
                value={servizio}
                onChange={(e) => setServizio(e.target.value)}
              >
                <option value="" disabled>
                  Seleziona un servizio…
                </option>
                {servizi.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 text-center" style={{ fontSize: 13, color: "var(--muted)" }}>
              Seleziona il servizio, poi scegli data e orario.
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
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>{mese}</div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
            {giorni.map((g) => (
              <div key={g} className="text-center py-2" style={{ fontWeight: 700 }}>
                {g}
              </div>
            ))}
          </div>

          <div className="lux-grid">
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
                        fontWeight: isSelected ? 800 : 500,
                      }}
                    >
                      {isToday && !isSelected && (
                        <span
                          className="absolute h-8 w-8 rounded-full"
                          style={{ background: "rgba(127,143,134,0.28)" }}
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
                      <span className="relative z-10">{v || " "}</span>
                    </button>
                  </div>
                );
              })}
            </div>
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
              disabled={!servizio || !giornoSelezionato || !oraSelezionata}
              style={{ opacity: !servizio || !giornoSelezionato || !oraSelezionata ? 0.6 : 1 }}
            >
              Conferma
            </button>
            <Link className="lux-btn w-full" href="/">
              Indietro
            </Link>
          </div>

          <div className="mt-3" style={{ color: "var(--muted)", fontSize: 12, textAlign: "center" }}>
            Nessuna app • Nessuna registrazione • Solo prenotazione semplice
          </div>
        </section>
      </div>
    </div>
  );
}
