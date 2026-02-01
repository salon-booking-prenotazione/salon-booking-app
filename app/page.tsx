import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      {/* SEZIONE HERO (sopra il video) */}
      <section className="h-screen flex items-center justify-center">
        <div className="lux-card p-10 max-w-4xl text-center">
          <div className="lux-badge mb-6">
            Stile luxury • Verde/Rosa più visibili • UI coerente
          </div>

          <h1 className="lux-title text-4xl md:text-6xl">
            Prenota in{" "}
            <span style={{ color: "var(--sage-btn)" }}>pochi secondi</span>, con
            un look{" "}
            <span style={{ color: "var(--plum)" }}>premium</span>.
          </h1>

          <p className="lux-subtitle mt-6">
            Una home chiara e una pagina prenotazione coerente: stessi bordi,
            stesso background, stessa esperienza.
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
