import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* HERO */}
      <section className="min-h-screen w-full flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ===== SINISTRA: TITOLO LIBERO (NO CARD) ===== */}
            <div className="relative z-10">
              <h1 className="lux-title text-5xl md:text-6xl leading-tight">
                Il tuo momento di bellezza,
                <br />
                prenotato con eleganza.
              </h1>

              <p className="lux-subtitle mt-5 text-base md:text-lg max-w-xl">
                Scegli servizio e orario. Conferma su WhatsApp.
                <br />
                Nessuna app, nessuna registrazione.
              </p>
            </div>

            {/* ===== DESTRA: CARD PRENOTAZIONE ===== */}
            <div className="flex justify-center lg:justify-end">
              <div className="lux-card p-8 md:p-10 w-full max-w-[420px] text-center">
                <div className="lux-title text-2xl mb-2">
                  Prenota ora
                </div>

                <p className="lux-subtitle text-sm md:text-base">
                  Prenotazione semplice e veloce.
                  <br />
                  Conferma immediata su WhatsApp.
                </p>

                <div className="mt-7 flex flex-col gap-4">
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
