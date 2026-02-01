import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* HERO sopra il video */}
     <section className="h-screen w-full flex items-center justify-end px-4 md:px-10 lg:px-20">
        {/* questa è la “spinta” a destra */}
         <div className="w-full max-w-[620px] translate-x-6 md:translate-x-12">
          <div className="lux-card p-8 md:p-10 text-center">
            <div className="lux-badge mb-6">
              Stile luxury • Verde/Rosa più visibili • UI coerente
            </div>

            <h1 className="lux-title text-4xl md:text-6xl">
              Il tuo momento di bellezza, <br />
              prenotato con eleganza.
            </h1>

            <p className="lux-subtitle mt-6">
              Scegli servizio e orario. Conferma su WhatsApp.
              <br />
              Nessuna app, nessuna registrazione.
            </p>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link href="/s/demo" className="lux-btn lux-btn-primary">
                Prenota (demo)
              </Link>
              <Link href="/s/demo" className="lux-btn">
                Vedi pagina salone
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
