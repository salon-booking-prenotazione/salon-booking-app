export default function Home() {
  const salons = [
    {
      name: "Jolanda Salon",
      address: "Via Aldo Fedeli, Verona",
      phone: "+393476221824",
      slug: "jolanda-salon",
    },
    {
      name: "Lorena Salon",
      address: "Via Belluzzo 29, Verona",
      phone: "+393397940573",
      slug: "lorena-salon",
    },
  ];

  return (
    <div className="min-h-screen text-[#1D1D1D]">
      {/* HERO con immagine reale + overlay */}
      <section className="relative overflow-hidden">
        {/* immagine di sfondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/home-hero.jpg)" }}
        />

        {/* overlay elegante (verde/rosa) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2A22]/70 via-[#17352C]/55 to-[#8C5A68]/40" />

        {/* grana/soft */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.20),transparent_50%),radial-gradient(circle_at_40%_90%,rgba(255,255,255,0.18),transparent_55%)]" />
        </div>

        {/* contenuto */}
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-20">
          {/* top bar */}
          <div className="flex items-center justify-between gap-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs tracking-[0.22em] uppercase text-white/90 ring-1 ring-white/15 backdrop-blur">
              <span className="text-[#F2C4D3]">✦</span>
              <span>Salon Booking</span>
            </div>

            <div className="hidden text-sm text-white/80 md:block">
              WhatsApp • Semplice • Veloce
            </div>
          </div>

          {/* hero grid */}
          <div className="mt-12 grid items-start gap-10 md:grid-cols-2 md:gap-14">
            {/* left */}
            <div>
              <h1 className="text-4xl font-semibold leading-[1.05] text-white md:text-6xl">
                Il tuo momento
                <br />
                di bellezza.
              </h1>

              <p className="mt-5 max-w-prose text-base leading-relaxed text-white/85 md:text-lg">
                Prenotare dev’essere semplice e bello. Scegli il tuo salone e
                conferma su WhatsApp in pochi secondi.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#salons"
                  className="inline-flex items-center justify-center rounded-full bg-[#F2C4D3] px-6 py-3 text-sm font-semibold text-[#1D1D1D] shadow-sm transition hover:translate-y-[-1px] hover:bg-[#EFB2C7]"
                >
                  Scegli il salone
                </a>

                <a
                  href="#staff"
                  className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
                >
                  Area staff
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/75">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F2C4D3]" />
                  Conferma su WhatsApp
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#BFE6D6]" />
                  Nessuna app da installare
                </div>
              </div>
            </div>

            {/* right card */}
            <div className="rounded-3xl bg-white/12 p-6 ring-1 ring-white/20 backdrop-blur-md md:p-8">
              <div className="text-xs uppercase tracking-[0.18em] text-white/70">
                Prenota online
              </div>

              <div className="mt-3 text-2xl font-semibold leading-tight text-white md:text-3xl">
                Un’esperienza
                <br />
                morbida &amp; chic
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="text-[#BFE6D6]">✦</span> Scegli servizio
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    Taglio, colore, piega…
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="text-[#F2C4D3]">✿</span> Seleziona orario
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    Solo slot disponibili
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="text-white/90">❖</span> Conferma su WhatsApp
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    Messaggio pronto, un click
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* separatore soft */}
          <div className="mt-14 h-px w-full bg-white/15" />
        </div>
      </section>

      {/* SEZIONE LISTA SALONI (sfondo chiaro elegante) */}
      <section className="bg-gradient-to-b from-[#F3F7F5] to-[#EEF4F0]">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div id="salons" className="flex items-end justify-between gap-6">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Scegli il tuo salone
            </h2>
            <div className="hidden text-sm text-black/55 md:block">
              Prenotazione in pochi secondi
            </div>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 shadow-sm backdrop-blur-md transition hover:translate-y-[-2px] hover:bg-white"
              >
                <div className="text-xl font-semibold">{s.name}</div>

                <div className="mt-3 space-y-1 text-sm text-black/65">
                  <div>{s.address}</div>
                  <div>Tel: {s.phone}</div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-black/45">/{`s/${s.slug}`}</div>

                  <a
                    href={`/s/${s.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#1E6A57] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#175345]"
                  >
                    Prenota
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* STAFF */}
          <div
            id="staff"
            className="mt-12 rounded-3xl bg-white/55 p-6 ring-1 ring-black/5 shadow-sm backdrop-blur-md"
          >
            <div className="text-sm font-semibold">Area staff</div>
            <div className="mt-1 text-sm text-black/65">
              Accesso rapido per gestione prenotazioni e inserimento manuale.
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/staff/login"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black ring-1 ring-black/5 transition hover:bg-[#F7FBF9]"
              >
                Login staff
              </a>
              <a
                href="/admin/manual"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black ring-1 ring-black/5 transition hover:bg-[#F7FBF9]"
              >
                Prenotazioni manuali
              </a>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="mt-12 text-center text-xs text-black/50">
            © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
          </footer>
        </div>
      </section>
    </div>
  );
}
