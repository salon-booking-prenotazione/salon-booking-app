import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* HERO */}
      <section className="min-h-screen w-full flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ===== SINISTRA: SPAZIO VISIVO (LOTO) ===== */}
            <div className="hidden lg:block" />

            {/* ===== DESTRA: TITOLO + CARD ===== */}
            <div className="relative z-10 flex flex-col items-end gap-8">

              {/* TITOLO LIBERO (NO CARD) */}
              <h1 className="lux-title text-5xl md:text-6xl leading-tight text-right max-w-xl">
                Il tuo momento di bellezza,
                <br />
                prenotato con eleganza.
              </h1>

              {/* CARD SOLO CON BOTTONI */}
              <div className="lux-card p-8 w-full max-w-[420px] text-center">
                <div className="flex flex-col gap-4">
                  <Link href="/s/demo" className="lux-btn lux-btn-primary">
                    Prenota (demo)
                  </Link>

                  <Link href="/s/demo" className="lux-btn">
                    Vedi pagina salone
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
