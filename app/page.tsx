import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      {/* HERO full screen */}
      <section className="h-screen w-full flex items-center justify-end px-6 md:px-10 lg:px-20">
        {/* blocco testo + bottoni */}
        <div
          className="
            text-right
            translate-x-8 md:translate-x-16 lg:translate-x-72
            -translate-y-48 md:-translate-y-40
          "
        >
          {/* titolo “calligraphy” */}
          <h1 className="lux-calligraphy text-4xl md:text-5xl lg:text-6xl leading-tight">
            Ogni bellezza ha il suo tempo.
            <br />
            Scegli il tuo.
          </h1>

          {/* bottoni */}
          <div className="mt-8 flex justify-end gap-3 flex-wrap">
            <Link href="/s/lorena-salon">Prenota</Link>
              Prenota (demo)
            </Link>
          <Link href="/s/lorena-salon">Vedi pagina salone</Link>
              Vedi pagina salone
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
