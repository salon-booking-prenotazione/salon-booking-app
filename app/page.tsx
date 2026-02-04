"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  // evita che la home resti “scrollata” quando torni da altre pagine
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
  }, []);

  return (
    <div className="lux-bg">
      <section className="h-screen w-full flex items-center justify-end px-6 md:px-10 lg:px-20">
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
