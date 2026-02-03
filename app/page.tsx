"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative lux-bg">
      {/* HERO full screen */}
      <section className="h-screen w-full flex items-center justify-end px-6 md:px-10 lg:px-20">
        {/* blocco testo + bottoni */}
        <div className="max-w-3xl text-right">
          <h1 className="lux-calligraphy text-4xl md:text-6xl">
            Ogni bellezza ha il suo tempo.
            <br />
            Scegli il tuo.
          </h1>

          <div className="mt-8 flex justify-end gap-3 flex-wrap">
            <Link href="/s/lorena-salon" className="lux-btn lux-btn-primary">
              Prenota
            </Link>

            <Link href="/s/lorena-salon" className="lux-btn">
              Vedi pagina salone
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
