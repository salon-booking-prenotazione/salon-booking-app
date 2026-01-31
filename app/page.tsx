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
    <div className="min-h-screen bg-[#F2F5F1] text-[#1F1F1F]">
      {/* soft blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#E7B1BE]/35 blur-3xl" />
        <div className="absolute top-10 -right-24 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#D7E6DD]/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-14">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs tracking-[0.18em] uppercase ring-1 ring-black/5 backdrop-blur-md">
            <span className="text-[#8A6A75]">✦</span>
            <span>Salon Booking</span>
          </div>

          <div className="hidden text-sm text-[#1F1F1F]/65 md:block">
            WhatsApp • Semplice • Veloce
          </div>
        </div>

        {/* hero */}
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h1 className="font-[var(--font-serif)] text-5xl leading-[1.05] md:text-6xl">
              Il tuo momento
              <br />
              di bellezza.
            </h1>

            <p className="mt-5 max-w-prose text-base leading-relaxed text-[#1F1F1F]/70 md:text-lg">
              Prenotare dev’essere semplice e bello. Scegli il tuo salone e conferma
              su WhatsApp in pochi secondi.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#salons"
                className="inline-flex items-center justify-center rounded-full bg-[#E7B1BE] px-6 py-3 text-sm font-semibold text-[#1F1F1F] shadow-sm transition hover:translate-y-[-1px] hover:bg-[#DFA3B3]"
              >
                Scegli il salone
              </a>

              <a
                href="#staff"
                className="inline-flex items-center justify-center rounded-full bg-white/70 px-6 py-3 text-sm font-semibold text-[#1F1F1F] ring-1 ring-black/5 transition hover:bg-white"
              >
                Area staff
              </a>
            </div>

            <div className="mt-6 flex items-center gap-6 text-xs text-[#1F1F1F]/55">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E7B1BE]" />
                Conferma su WhatsApp
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                Nessuna app da installare
              </div>
            </div>
          </div>

          {/* right card */}
          <div className="rounded-3xl bg-white/65 p-6 ring-1 ring-black/5 backdrop-blur-md md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-[#1F1F1F]/55">
              Prenota online
            </div>

            <div className="mt-3 font-[var(--font-serif)] text-2xl leading-tight">
              Un’esperienza
              <br />
              morbida &amp; chic
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                <div className="text-sm font-semibold">1) Scegli servizio</div>
                <div className="mt-1 text-sm text-[#1F1F1F]/65">
                  Taglio, colore, piega…
                </div>
              </div>

              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                <div className="text-sm font-semibold">2) Seleziona orario</div>
                <div className="mt-1 text-sm text-[#1F1F1F]/65">
                  Solo slot disponibili
                </div>
              </div>

              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                <div className="text-sm font-semibold">3) Conferma su WhatsApp</div>
                <div className="mt-1 text-sm text-[#1F1F1F]/65">
                  Messaggio pronto, un click
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* salons */}
        <div id="salons" className="mt-16">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold">Scegli il tuo salone</h2>
            <div className="hidden text-sm text-[#1F1F1F]/55 md:block">
              Prenotazione in pochi secondi
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md transition hover:translate-y-[-2px] hover:bg-white"
              >
                <div className="text-xl font-semibold">{s.name}</div>

                <div className="mt-3 space-y-1 text-sm text-[#1F1F1F]/65">
                  <div>{s.address}</div>
                  <div>{s.phone}</div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-[#1F1F1F]/45">/{`s/${s.slug}`}</div>

                  <a
                    href={`/s/${s.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#E7B1BE] px-5 py-2.5 text-sm font-semibold text-[#1F1F1F] shadow-sm transition hover:bg-[#DFA3B3]"
                  >
                    Prenota
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* staff */}
        <div
          id="staff"
          className="mt-12 rounded-3xl bg-white/45 p-6 ring-1 ring-black/5 backdrop-blur-md"
        >
          <div className="text-sm font-semibold">Area staff</div>
          <div className="mt-1 text-sm text-[#1F1F1F]/65">
            Accesso rapido per gestione prenotazioni e inserimento manuale.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/staff/login"
              className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#1F1F1F] ring-1 ring-black/5 transition hover:bg-white"
            >
              Login staff
            </a>
            <a
              href="/admin/manual"
              className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#1F1F1F] ring-1 ring-black/5 transition hover:bg-white"
            >
              Prenotazioni manuali
            </a>
          </div>
        </div>

        {/* footer / copyright */}
        <footer className="mt-16 text-center text-xs text-[#1F1F1F]/50">
          © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
        </footer>
      </div>
    </div>
  );
}
