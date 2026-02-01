import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* ========================= */}
      {/* SEZIONE 1 – VIDEO INTRO */}
      {/* ========================= */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/images/videos/lotus.mp4" type="video/mp4" />
        </video>

        {/* overlay soft per leggibilità */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(248,245,240,0.25), rgba(248,245,240,0.90))",
          }}
        />

        {/* titolo opzionale sopra video */}
        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <h1
            className="lux-title text-4xl md:text-6xl text-center"
            style={{ color: "var(--plum)" }}
          >
            Il tuo momento di bellezza
          </h1>
        </div>
      </section>

      {/* ========================= */}
      {/* SEZIONE 2 – HOME CONTENUTI */}
      {/* ========================= */}
      <section className="space-y-10 px-4 pb-20">
        <div className="space-y-10">
          {/* HERO */}
          <section className="lux-card p-8 md:p-10">
            <div className="space-y-6">
              <div className="lux-badge">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--sage-btn)" }}
                />
                <span>Stile luxury • Verde/Rosa più visibili • UI coerente</span>
              </div>

              <h1 className="lux-title text-3xl md:text-5xl">
                Prenota in{" "}
                <span style={{ color: "var(--sage-btn)" }}>pochi secondi</span>, con un
                look{" "}
                <span style={{ color: "var(--plum)" }}>premium</span>.
              </h1>

              <p className="lux-subtitle max-w-2xl">
                Una home chiara e una pagina prenotazione coerente: stessi bordi,
                stesso background, stessa esperienza. Perfetta per saloni
                piccoli/medi.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link className="lux-btn lux-btn-primary" href="/s/demo">
                  Prenota (demo)
                </Link>
                <Link className="lux-btn" href="/s/demo">
                  Vedi pagina salone
                </Link>
              </div>

              <div className="lux-sep" />

              {/* highlights */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="lux-card p-5" style={{ boxShadow: "none" }}>
                  <div style={{ color: "rgba(35,35,38,0.85)", fontWeight: 700 }}>
                    Calendario facile
                  </div>
                  <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>
                    UI pulita, pronto per ICS/Google Calendar.
                  </div>
                </div>

                <div className="lux-card p-5" style={{ boxShadow: "none" }}>
                  <div style={{ color: "rgba(35,35,38,0.85)", fontWeight: 700 }}>
                    Conversione alta
                  </div>
                  <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>
                    CTA verde/rosa visibile, pochi campi.
                  </div>
                </div>

                <div className="lux-card p-5" style={{ boxShadow: "none" }}>
                  <div style={{ color: "rgba(35,35,38,0.85)", fontWeight: 700 }}>
                    Stesso stile ovunque
                  </div>
                  <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>
                    Bordi + background identici su tutte le pagine.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECONDARY */}
          <section className="grid lg:grid-cols-2 gap-6">
            <div className="lux-card p-7">
              <h2 className="lux-title text-2xl">Link condivisibile</h2>
              <p className="lux-subtitle mt-2">
                Ogni salone ha una pagina tipo: <b>/s/[slug]</b>
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link className="lux-btn" href="/s/demo">
                  /s/demo
                </Link>
                <Link className="lux-btn" href="/s/abc-salon">
                  /s/abc-salon
                </Link>
              </div>
            </div>

            <div className="lux-card p-7">
              <h2 className="lux-title text-2xl">Pronto per collegarsi ai tuoi dati</h2>
              <p className="lux-subtitle mt-2">
                La UI non rompe la build: poi agganciamo Supabase e gli slot reali.
              </p>
              <div className="mt-4">
                <Link className="lux-btn lux-btn-primary" href="/s/demo">
                  Vai alla prenotazione
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
