import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      {/* SEZIONE HERO */}
      <section className="h-screen flex items-center justify-end pr-10 md:pr-20">
        <div className="lux-card p-10 max-w-[720px] text-center -mt-16">
          
          <div className="lux-badge mb-6 mx-auto w-fit">
            Stile luxury • Verde/Rosa più visibili • UI coerente
          </div>

          <h1 className="lux-title text-4xl md:text-5xl">
            Il tuo momento di bellezza,
            <br />
            <span style={{ color: "var(--plum)" }}>prenotato con eleganza</span>.
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
