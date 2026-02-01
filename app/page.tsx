import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* HERO sopra il video */}
      <section className="min-h-screen w-full flex items-center">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10">
            {/* TESTO (sinistra) */}
            <div className="w-full lg:w-[55%] text-center lg:text-left">
              <h1 className="lux-title text-5xl md:text-6xl leading-tight">
                Il tuo momento di bellezza,
                <br />
                prenotato con eleganza.
              </h1>

              <p className="lux-subtitle mt-5 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                Scegli servizio e orario. Conferma su WhatsApp.
                <br />
                Nessuna app, nessuna registrazione.
              </p>

              <div className="mt-7 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/s/demo" className="lux-btn lux-btn-primary">
                  Prenota (demo)
                </Link>
                <Link href="/s/demo" className="lux-btn">
                  Vedi pagina salone
                </Link>
              </div>
            </div>

            {/* CARD (destra) */}
            <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
              <div className="lux-card p-8 md:p-10 w-full max-w-[520px] text-center">
                <div
                  className="lux-title text-2xl md:text-3xl"
                  style={{ marginBottom: 10 }}
                >
                  Prenota ora
                </div>

                <p className="lux-subtitle">
                  Prenotazione semplice e veloce.
                  <br />
                  Conferma immediata su WhatsApp.
                </p>

                <div className="mt-7 flex justify-center gap-4 flex-wrap">
                  <Link href="/s/demo" className="lux-btn lux-btn-primary">
                    Prenota (demo)
                  </Link>
                  <Link href="/s/demo" className="lux-btn">
                    Vedi pagina salone
                  </Link>
                </div>
              </div>
            </div>
            {/* fine card */}
          </div>
        </div>
      </section>
    </div>
  );
}
