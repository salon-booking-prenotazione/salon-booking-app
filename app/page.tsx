import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="lux-card p-7 md:p-10">
        <div className="flex flex-col gap-6">
          <div className="lux-badge">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.7)]" />
            Stile luxury • Verde/Rosa più visibili • UI coerente
          </div>

          <h1 className="lux-title">
            Prenota in <span className="text-emerald-300">pochi secondi</span>, con un look{" "}
            <span className="text-rose-300">premium</span>.
          </h1>

          <p className="lux-subtitle max-w-2xl">
            Una home chiara e una pagina prenotazione coerente: stessi bordi, stesso background, stessa
            esperienza. Perfetta per saloni piccoli/medi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link className="lux-btn lux-btn-primary" href="/s/demo">
              Prenota (demo)
            </Link>
            <Link className="lux-btn lux-btn-ghost" href="/s/demo">
              Vedi pagina salone
            </Link>
          </div>

          <div className="lux-sep mt-2" />

          {/* highlights */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="lux-card p-5">
              <div className="text-white/85 font-semibold">Calendario facile</div>
              <div className="text-white/55 text-sm mt-1">
                UI pulita, pronto per ICS/Google Calendar.
              </div>
            </div>
            <div className="lux-card p-5">
              <div className="text-white/85 font-semibold">Conversione alta</div>
              <div className="text-white/55 text-sm mt-1">
                CTA verde/rosa visibile, pochi campi.
              </div>
            </div>
            <div className="lux-card p-5">
              <div className="text-white/85 font-semibold">Stesso stile ovunque</div>
              <div className="text-white/55 text-sm mt-1">
                Bordi + background identici su tutte le pagine.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="lux-card p-7">
          <h2 className="text-xl font-semibold text-white/90">Link condivisibile</h2>
          <p className="text-white/60 mt-2">
            Ogni salone ha una pagina tipo: <span className="text-white/80">/s/[slug]</span>
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
          <h2 className="text-xl font-semibold text-white/90">Pronto per collegarsi ai tuoi dati</h2>
          <p className="text-white/60 mt-2">
            La UI non rompe la build: puoi poi agganciare Supabase (server component) quando vuoi.
          </p>
          <div className="mt-4">
            <Link className="lux-btn lux-btn-primary" href="/s/demo">
              Vai alla prenotazione
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
