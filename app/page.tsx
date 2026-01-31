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
    <div className="min-h-screen bg-[#EEF4F0] text-[#1F1F1F]">
      {/* blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#E8B7C8]/40 blur-3xl" />
        <div className="absolute top-10 -right-24 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#CFE2D9]/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-14">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl ring-1 ring-black/5"
            ✦ SALON BOOKING
          </div>
          <div className="text-sm opacity-70">WhatsApp • Semplice • Veloce</div>
        </div>

        {/* hero */}
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl">
              Il tuo momento
              <br />
              di bellezza.
            </h1>

            <p className="mt-5 text-lg opacity-75">
              Prenotare dev’essere semplice e bello. Conferma su WhatsApp in pochi
              secondi.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#salons"
                className="rounded-full bg-[#E6B8C6] px-6 py-3 text-sm font-semibold text-[#1F1F1F] shadow-sm hover:bg-[#DDB0BF]"
              >
                Scegli il salone
              </a>
              <a
                href="#staff"
                className="rounded-full bg-white/70 px-6 py-3 font-semibold"
              >
                Area staff
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white/70 p-8 shadow-sm">
            <div className="text-sm tracking-widest opacity-60">
              PRENOTA ONLINE
            </div>
            <h3 className="mt-3 font-serif text-2xl">
              Un’esperienza
              <br />
              morbida & chic
            </h3>

            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-white p-4">1) Scegli servizio</div>
              <div className="rounded-xl bg-white p-4">2) Seleziona orario</div>
              <div className="rounded-xl bg-white p-4">
                3) Conferma su WhatsApp
              </div>
            </div>
          </div>
        </div>

        {/* salons */}
        <div id="salons" className="mt-16">
          <h2 className="text-3xl font-semibold">Scegli il tuo salone</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="rounded-3xl bg-white/70 p-6"
              >
                <div className="text-xl font-semibold">{s.name}</div>
                <div className="mt-2 text-sm opacity-70">{s.address}</div>
                <div className="mt-1 text-sm">{s.phone}</div>

                <a
                  href={`/s/${s.slug}`}
                  className="mt-4 inline-block rounded-full bg-[#E8B7C8] px-5 py-2 font-semibold"
                >
                  Prenota
                </a>
              </div>
            ))}
          </div>
        </div>

      <footer className="mt-16 text-center text-xs text-[#2A2A2A]/60">
  © {new Date().getFullYear()} Salon Booking — semplice, elegante, senza app.
</footer>

        {/* footer */}
        <div id="staff" className="mt-16 text-sm opacity-70">
          © {new Date().getFullYear()} Salon Booking — semplice & chic
        </div>
      </div>
    </div>
  );
}
