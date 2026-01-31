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
    <div className="relative min-h-screen text-[#1F1F1F] overflow-hidden">
      {/* SFONDO IMMAGINE */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/home-hero.jpg"
          alt="Luxury salon"
          className="h-full w-full object-cover"
        />
        {/* velo chiaro sopra immagine */}
        <div className="absolute inset-0 bg-[#EEF4F0]/85" />
      </div>

      {/* BLOBS DECORATIVI */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#E8B7C8]/45 blur-3xl" />
        <div className="absolute top-10 -right-24 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#CFE2D9]/70 blur-3xl" />
      </div>

      {/* CONTENUTO */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 py-16">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/70 px-4 py-2 text-xs tracking-widest">
            ✦ SALON BOOKING
          </div>
          <div className="text-sm opacity-70">
            WhatsApp • Semplice • Veloce
          </div>
        </div>

        {/* HERO */}
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight">
              Il tuo momento
              <br />
              di bellezza.
            </h1>

            <p className="mt-6 text-lg opacity-80">
              Prenotare dev’essere semplice e bello.
              Conferma su WhatsApp in pochi secondi.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#salons"
                className="rounded-full bg-[#E8B7C8] px-6 py-3 text-sm font-semibold hover:bg-[#DFA9BC]"
              >
                Scegli il salone
              </a>
              <a
                href="#staff"
                className="rounded-full bg-white/80 px-6 py-3 text-sm font-semibold"
              >
                Area staff
              </a>
            </div>
          </div>

          {/* CARD PRENOTAZIONE */}
          <div className="rounded-3xl bg-white/80 p-8 shadow-sm">
            <div className="text-xs tracking-widest opacity-60">
              PRENOTA ONLINE
            </div>

            <h3 className="mt-3 text-2xl font-serif">
              Un’esperienza
              <br />
              morbida & chic
            </h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-white p-4">
                ✦ Scegli servizio
              </div>
              <div className="rounded-xl bg-white p-4">
                ✦ Seleziona orario
              </div>
              <div className="rounded-xl bg-white p-4">
                ✦ Conferma su WhatsApp
              </div>
            </div>
          </div>
        </div>

        {/* SALONI */}
        <div id="salons" className="mt-20">
          <h2 className="text-3xl font-semibold mb-6">
            Scegli il tuo salone
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="rounded-3xl bg-white/80 p-6 shadow-sm"
              >
                <div className="text-xl font-semibold">{s.name}</div>
                <div className="mt-2 text-sm opacity-70">{s.address}</div>
                <div className="mt-1 text-sm">{s.phone}</div>

                <a
                  href={`/s/${s.slug}`}
                  className="mt-4 inline-block rounded-full bg-[#E8B7C8] px-5 py-2 text-sm font-semibold"
                >
                  Prenota
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* STAFF */}
        <div
          id="staff"
          className="mt-16 rounded-3xl bg-white/70 p-6"
        >
          <div className="font-semibold">Area staff</div>
          <div className="mt-1 text-sm opacity-70">
            Gestione prenotazioni e inserimento manuale.
          </div>

          <div className="mt-4 flex gap-3">
            <a className="rounded-full bg-white px-4 py-2 text-sm">
              Login staff
            </a>
            <a className="rounded-full bg-white px-4 py-2 text-sm">
              Prenotazioni manuali
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
        </footer>
      </div>
    </div>
  );
}
