import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* HERO sopra il video */}
      <section className="relative h-screen w-full flex items-center justify-end px-6 md:px-12 lg:px-24">
        
        {/* BLOCCO TESTO FUORI DALLA CARD */}
        <div className="absolute right-24 top-24 max-w-xl">
          {/* SOTTOTITOLO CORSIVO */}
          <div
            className="mb-4 text-lg italic tracking-wide"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(60,40,50,0.75)",
            }}
          >
            Un rituale di bellezza
          </div>

          {/* TITOLO PRINCIPALE */}
          <h1 className="lux-title text-5xl md:text-6xl leading-tight">
            Il tuo momento di bellezza,
            <br />
            prenotato con eleganza.
          </h1>
        </div>

        {/* CARD (spostata a destra e più in alto) */}
        <div className="lux-card p-10 max-w-[520px] text-center
                        translate-x-14 md:translate-x-40 lg:translate-x-60
                        -translate-y-20 md:-translate-y-28">
          
          {/* TESTO DESCRITTIVO */}
          <p className="lux-subtitle mb-8">
            Scegli servizio e orario. Conferma su WhatsApp.
            <br />
            Nessuna app, nessuna registrazione.
          </p>

          {/* BOTTONI */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/s/demo" className="lux-btn lux-btn-primary">
              Prenota (demo)
            </Link>
            <Link href="/s/demo" className="lux-btn">
              Vedi pagina salone
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
