import Link from "next/link";

export default function PaginaPrenotazione({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // Demo (poi colleghiamo Supabase)
  const nomeSalone = slug === "demo" ? "Lorena Salon" : `Salone ${slug}`;
  const mese = "Aprile 2026";
  const giorni = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  const calendario = [
    ["", "", "", "1", "2", "3", "4"],
    ["5", "6", "7", "8", "9", "10", "11"],
    ["12", "13", "14", "15", "16", "17", "18"],
    ["19", "20", "21", "22", "23", "24", "25"],
    ["26", "27", "28", "29", "30", "", ""],
  ];

  // Qui poi useremo gli slot reali dal DB
  const orari = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];

  // Qui poi useremo i servizi reali dal DB
  const serviziDemo = ["Taglio", "Piega", "Colore", "Trattamento", "Barba"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        {/* SINISTRA: scelta servizio */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-start justify-between">
            <h1 className="lux-title text-3xl md:text-4xl">Prenota appuntamento</h1>
            <Link href="/" className="lux-btn lux-btn-ghost" aria-label="Chiudi">
              ✕
            </Link>
          </div>

          <div className="mt-3 lux-subtitle">
            <b style={{ color: "var(--plum)" }}>{nomeSalone}</b> • Prenotazione demo (poi mettiamo i dati reali)
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-sm mb-2" style={{ color: "var(--muted)", fontWeight: 700 }}>
                Servizio *
              </div>

              {/* SOLO UN CAMPO SERVIZIO */}
              <select className="lux-input" defaultValue={serviziDemo[0]}>
                {serviziDemo.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className="mt-2" style={{ color: "var(--muted)", fontSize: 13 }}>
                Scegli il servizio. Poi selezioni data e orario.
              </div>
            </div>

            <div className="lux-sep" />

            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              <b>Come funziona:</b> 1) Servizio → 2) Data & Orario → 3) Conferma
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <a className="lux-btn lux-btn-primary w-full" href="#calendario">
              Avanti
            </a>
          </div>
        </section>

        {/* DESTRA: calendario + orari */}
        <section id="calendario" className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="lux-title text-2xl md:text-3xl">Scegli data e ora</h2>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>{mese}</div>
          </div>

          {/* intestazione giorni */}
          <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
            {giorni.map((g) => (
              <div key={g} className="text-center py-2" style={{ fontWeight: 700 }}>
                {g}
              </div>
            ))}
          </div>

          {/* calendario */}
          <div className="lux-grid">
            <div className="grid grid-cols-7">
              {calendario.flat().map((v, idx) => {
                const vuoto = v === "";
                const selezionato = v === "14"; // demo
                const oggi = v === "7"; // demo

                return (
                  <div
                    key={idx}
                    className={[
                      "lux-cell",
                      vuoto ? "lux-cell-muted" : "",
                      selezionato ? "lux-cell-active" : "",
                    ].join(" ")}
                    style={{
                      borderRight: idx % 7 === 6 ? "none" : undefined,
                      borderBottom: idx >= 28 ? "none" : undefined,
                      borderColor: "var(--line)",
                      background: oggi ? "rgba(127,143,134,0.22)" : undefined,
                      borderRadius: oggi ? 999 : undefined,
                      margin: oggi ? 6 : 0,
                      height: oggi ? 30 : 42,
                      width: oggi ? 30 : "auto",
                      justifySelf: oggi ? "center" : undefined,
                    }}
                  >
                    {v || " "}
                  </div>
                );
              })}
            </div>
          </div>

          {/* orari */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {orari.map((t) => (
              <div key={t} className={`lux-slot ${t === "13:30" ? "selected" : ""}`}>
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button className="lux-btn lux-btn-primary w-full" type="button">
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
