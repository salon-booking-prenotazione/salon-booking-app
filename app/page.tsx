import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* HERO sopra il video */}
      <section className="relative h-screen w-full flex items-center justify-end px-6 md:px-16 lg:px-24">

        {/* BLOCCO TESTO */}
        <div className="max-w-xl text-right translate-x-24 md:translate-x-40 -translate-y-16">
          <h1 className="lux-title text-5xl md:text-6xl leading-tight">
            Ogni bellezza ha il suo tempo.
            <br />
            Scegli il tuo.
          </h1>

          {/* BOTTONI */}
          <div className="mt-10 flex gap-4 justify-end">
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
