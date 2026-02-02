import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* HERO sopra il video (il video sta nel layout) */}
      <section className="h-screen w-full px-4 md:px-10 lg:px-20">
        <div className="h-full flex items-center justify-end">
          {/* blocco testo + bottoni */}
          <div
            className="
              max-w-[620px]
              text-right
             translate-x-8 md:translate-x-16 lg:translate-x-72
              -translate-y-48 md:-translate-y-40
            "
          >
           <h1 className="lux-calligraphy text-4xl md:text-6xl leading-tight">
              Ogni bellezza ha il suo tempo.
              <br />
              Scegli il tuo.
            </h1>

            <div className="mt-8 flex gap-4 justify-end flex-wrap">
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
