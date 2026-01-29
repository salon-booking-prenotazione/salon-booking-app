export default function HomePage() {
  // TODO: sostituisci con i dati reali da Supabase
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
    <div className="min-h-screen bg-[#FFF7F6]">
      {/* Background morbido */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#F6C6CF]/35 blur-3xl" />
        <div className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-[#BFD7C1]/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-10 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F1E6E6] bg-white/70 px-4 py-2 text-sm text-[#6F6464] shadow-sm">
            <span className="text-base">✨</span>
            <span className="tracking-wide">SALON BOOKING</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-[#6F6464]">
            <span className="rounded-full bg-white/70 px-3 py-1 border border-[#F1E6E6]">
              WhatsApp
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 border border-[#F1E6E6]">
              Semplice
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 border border-[#F1E6E6]">
              No app
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-10 md:mt-14 grid gap-6">
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] text-[#1F1B1B]">
            Il tuo momento <br className="hidden md:block" />
            di relax
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-[#6F6464]">
            Prenotare dev’essere semplice. E bello. Scegli il tuo salone e conferma su WhatsApp in pochi secondi.
          </p>
        </div>

        {/* Lista saloni */}
        <div className="mt-10 grid gap-4">
          {salons.map((s) => (
            <div
              key={s.slug}
              className="group flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border border-[#F1E6E6] bg-white/80 p-6 shadow-sm backdrop-blur"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#F6C6CF]/45 border border-[#F1E6E6]" />
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-[#1F1B1B]">
                      {s.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#6F6464]">{s.address}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#6F6464]">
                  <span className="rounded-full border border-[#F1E6E6] bg-white px-3 py-1">
                    Tel: {s.phone}
                  </span>
                  <span className="rounded-full border border-[#F1E6E6] bg-white px-3 py-1">
                    Prenota online
                  </span>
                </div>
              </div>

              <a
                href={`/s/${s.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-[#1F1B1B] px-6 py-3 text-white font-semibold shadow-md transition group-hover:translate-y-[-1px] group-hover:shadow-lg"
              >
                Prenota
              </a>
            </div>
          ))}
        </div>

        {/* Area staff (più discreta) */}
        <div className="mt-12 rounded-3xl border border-[#F1E6E6] bg-white/60 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-[#1F1B1B]">Area staff</h3>
          <p className="mt-1 text-sm text-[#6F6464]">
            Accesso rapido per gestione prenotazioni e inserimento manuale.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/staff/login"
              className="rounded-full border border-[#F1E6E6] bg-white px-5 py-2 font-semibold text-[#1F1B1B] shadow-sm hover:shadow"
            >
              Login staff
            </a>

            <a
              href="/admin/manual"
              className="rounded-full border border-[#F1E6E6] bg-white px-5 py-2 font-semibold text-[#1F1B1B] shadow-sm hover:shadow"
            >
              Prenotazioni manuali
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#6F6464]">
          © {new Date().getFullYear()} Salon Booking — semplice e veloce
        </p>
      </div>
    </div>
  );
}
