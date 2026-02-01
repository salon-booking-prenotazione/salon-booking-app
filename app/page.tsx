import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* HERO sopra il video */}
      <section className="h-screen w-full flex items-center justify-end px-4 md:px-10 lg:px-20">
        {/* CARD: più a destra + più in alto */}
        <div className="
  lux-card p-10 max-w-[520px] text-center
  translate-x-[6rem] md:translate-x-[10rem] lg:translate-x-[14rem]
  -translate-y-[3rem] md:-translate-y-[5rem]
">
          <div className="lux-badge mb-6">
            Stile luxury • Verde/Rosa più visibili • UI coerente
          </div>

          <h1 className="lux-title text-4xl md:text-5xl">
            Il tuo momento di bellezza,
            <br />
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
      </section>
    </div>
  );
}
