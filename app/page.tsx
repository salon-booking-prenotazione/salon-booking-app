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
    <div className="min-h-screen bg-[#E6EFEA] text-[#1f1f1f]">
      {/* soft background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-[28rem] w-[28rem] rounded-full bg-[#E8B7C8]/40 blur-3xl" />
        <div className="absolute top-16 -right-28 h-[26rem] w-[26rem] rounded-full bg-white/55 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#CFE2D9]/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-10 md:py-16">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs tracking-[0.18em] uppercase ring-1 ring-black/5 backdrop-blur">
            <span className="text-[#8A6A75]">✦</span>
            <span>Salon Booking</span>
          </div>

          <div className="hidden text-sm text-black/60 md:block">
            WhatsApp • Semplice • Veloce
          </div>
        </div>

        {/* HERO */}
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] md:text-6xl">
              Il tuo momento
              <br />
              di bellezza.
            </h1>

            <p className="mt-5 max-w-prose text-base leading-relaxed text-black/70 md:text-lg">
              Prenotare dev’essere semplice e bello. Scegli il tuo salone e
              conferma su WhatsApp in pochi secondi.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#salons"
                className="inline-flex items-center justify-center rounded-full bg-[#E7B6C7] px-6 py-3 text-sm font-semibold text-[#1f1f1f] shadow-sm transition hover:translate-y-[-1px] hover:bg-[#DDA9BD] active:translate-y-0"
              >
                Scegli il salone
              </a>

              <a
                href="#staff"
                className="inline-flex items-center justify-center rounded-full bg-white/70 px-6 py-3 text-sm font-semibold text-[#1f1f1f] ring-1 ring-black/5 transition hover:bg-white"
              >
                Area staff
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-black/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E8B7C8]" />
                Conferma su WhatsApp
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white ring-1 ring-black/10" />
                Nessuna app da installare
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#CFE2D9]" />
                Slot reali disponibili
              </div>
            </div>
          </div>

          {/* right card */}
          <div className="rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-black/55">
              Prenotazione in 3 step
            </div>

            <div className="mt-3 text-2xl font-semibold leading-tight">
              Morbida,
              <br />
              chic,
              <br />
              immediata.
            </div>

            <div className="mt-6 space-y-3">
              <Step title="1) Scegli servizio" desc="Taglio, colore, piega…" />
              <Step title="2) Seleziona orario" desc="Solo slot disponibili" />
              <Step title="3) Conferma su WhatsApp" desc="Messaggio pronto, un click" />
            </div>
          </div>
        </div>

        {/* SALONS */}
        <div id="salons" className="mt-14">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Scegli il tuo salone
            </h2>
            <div className="hidden text-sm text-black/60 md:block">
              Prenotazione in pochi secondi
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="group rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-[2px] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-semibold">{s.name}</div>
                    <div className="mt-2 space-y-1 text-sm text-black/70">
                      <div>{s.address}</div>
                      <div>Tel: {s.phone}</div>
                    </div>
                  </div>

                  <div className="hidden h-12 w-12 rounded-2xl bg-[#CFE2D9]/60 ring-1 ring-black/5 md:block" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-black/50">/s/{s.slug}</div>

                  <a
                    href={`/s/${s.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-5 py-2.5 text-sm font-semibold text-[#1f1f1f] shadow-sm ring-1 ring-black/5 transition group-hover:bg-[#DFA9BC]"
                  >
                    Prenota
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STAFF */}
        <div
          id="staff"
          className="mt-12 rounded-3xl bg-white/55 p-6 ring-1 ring-black/5 backdrop-blur"
        >
          <div className="text-sm font-semibold">Area staff</div>
          <div className="mt-1 text-sm text-black/70">
            Accesso rapido per gestione prenotazioni e inserimento manuale.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/staff/login"
              className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#1f1f1f] ring-1 ring-black/5 transition hover:bg-white"
            >
              Login staff
            </a>
            <a
              href="/admin/manual"
              className="inline-flex items-center justify-center rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#1f1f1f] ring-1 ring-black/5 transition hover:bg-white"
            >
              Prenotazioni manuali
            </a>
          </div>
        </div>

        <div className="mt-10 text-xs text-black/55">
          © {new Date().getFullYear()} Salon Booking — semplice e chic
        </div>
      </div>
    </div>
  );
}

function Step({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-black/70">{desc}</div>
    </div>
  );
}
