"use client";

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
    <div className="min-h-screen bg-[#EEF4F0] text-[#1F1F1F] flex flex-col">
      {/* blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#E8B7C8]/40 blur-3xl" />
        <div className="absolute top-10 -right-24 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#CFE2D9]/70 blur-3xl" />
      </div>

      {/* CONTENUTO (spinge il footer in fondo) */}
      <div className="flex-1">
        <div className="relative mx-auto max-w-5xl px-5 py-14">
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2 text-xs tracking-[0.18em] uppercase ring-1 ring-black/5 backdrop-blur-md">
              <span className="text-[#8A6A75]">✦</span>
              <span>Salon Booking</span>
            </div>

            <div className="text-sm opacity-70">WhatsApp • Semplice • Veloce</div>
          </div>

          {/* hero */}
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl leading-[1.05]">
                Il tuo momento
                <br />
                di bellezza.
              </h1>

              <p className="mt-5 text-lg opacity-75">
                Prenotare dev’essere semplice e bello. Conferma su WhatsApp in pochi
                secondi.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#salons"
                  className="rounded-full bg-[#E6B8C6] px-6 py-3 text-sm font-semibold text-[#1F1F1F] shadow-sm hover:bg-[#DDB0BF]"
                >
                  Scegli il salone
                </a>
                <a
                  href="#staff"
                  className="rounded-full bg-white/70 px-6 py-3 text-sm font-semibold ring-1 ring-black/5 backdrop-blur-md hover:bg-white"
                >
                  Area staff
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5 backdrop-blur-md">
              <div className="text-sm tracking-widest opacity-60">PRENOTA ONLINE</div>
              <h3 className="mt-3 font-serif text-2xl">
                Un’esperienza
                <br />
                morbida &amp; chic
              </h3>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                  <div className="font-semibold">1) Scegli servizio</div>
                  <div className="mt-1 text-sm opacity-70">Taglio, colore, piega…</div>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                  <div className="font-semibold">2) Seleziona orario</div>
                  <div className="mt-1 text-sm opacity-70">Solo slot disponibili</div>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-black/5">
                  <div className="font-semibold">3) Conferma su WhatsApp</div>
                  <div className="mt-1 text-sm opacity-70">Messaggio pronto, un click</div>
                </div>
              </div>
            </div>
          </div>

          {/* salons */}
          <div id="salons" className="mt-16">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-3xl font-semibold">Scegli il tuo salone</h2>
              <div className="hidden text-sm opacity-60 md:block">
                Prenotazione in pochi secondi
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {salons.map((s) => (
                <div key={s.slug} className="rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md">
                  <div className="text-xl font-semibold">{s.name}</div>
                  <div className="mt-2 text-sm opacity-70">{s.address}</div>
                  <div className="mt-1 text-sm">{s.phone}</div>

                  <a
                    href={`/s/${s.slug}`}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-5 py-2.5 text-sm font-semibold hover:bg-[#DFA9BC]"
                  >
                    Prenota
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* staff */}
          <div
            id="staff"
            className="mt-16 rounded-3xl bg-white/45 p-6 ring-1 ring-black/5 backdrop-blur-md"
          >
            <div className="text-sm font-semibold">Area staff</div>
            <div className="mt-1 text-sm opacity-70">
              Accesso rapido per gestione prenotazioni e inserimento manuale.
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/staff/login"
                className="rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold ring-1 ring-black/5 hover:bg-white"
              >
                Login staff
              </a>
              <a
                href="/admin/manual"
                className="rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold ring-1 ring-black/5 hover:bg-white"
              >
                Prenotazioni manuali
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER sticky elegante */}
      <footer className="sticky bottom-0 border-t border-black/5 bg-white/35 backdrop-blur-md px-5 py-4 text-center text-xs text-[#2A2A2A]/60">
        © {new Date().getFullYear()} Salon Booking <span className="mx-2">•</span>
        Designed for modern salons ✦
      </footer>
    </div>
  );
}
