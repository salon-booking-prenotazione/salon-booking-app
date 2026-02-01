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
    <div className="min-h-screen bg-[#F3F7F4] text-[#1F1F1F] flex flex-col">

      {/* background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#E6A9BB]/40 blur-3xl" />
        <div className="absolute top-20 -right-32 h-96 w-96 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[#CFE2D9]/70 blur-3xl" />
      </div>

      {/* content */}
      <div className="relative mx-auto max-w-5xl px-5 py-14 flex-1">

        {/* header */}
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold tracking-widest shadow-sm">
            ✦ SALON BOOKING
          </div>
          <div className="text-sm text-[#6B6B6B]">
            WhatsApp • Semplice • Veloce
          </div>
        </div>

        {/* hero */}
        <div className="mt-14 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">
              Il tuo momento
              <br />
              di bellezza.
            </h1>

            <p className="mt-6 text-lg text-[#5F5F5F]">
              Prenotare dev’essere semplice e bello.
              Conferma su WhatsApp in pochi secondi.
            </p>

            <div className="mt-10 flex gap-4">
              <a
                href="#salons"
                className="rounded-full bg-[#E6A9BB] px-6 py-3 text-sm font-semibold text-[#1F1F1F] shadow-md hover:bg-[#DD9CAF] transition"
              >
                Scegli il salone
              </a>
              <a
                href="#staff"
                className="rounded-full bg-white/80 px-6 py-3 text-sm font-semibold shadow-sm"
              >
                Area staff
              </a>
            </div>
          </div>

          {/* booking card */}
          <div className="rounded-3xl bg-white/85 p-8 shadow-lg backdrop-blur-md">
            <div className="text-xs tracking-widest text-[#6B6B6B]">
              PRENOTA ONLINE
            </div>

            <h3 className="mt-3 font-serif text-2xl">
              Un’esperienza
              <br />
              morbida & chic
            </h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                ✦ Scegli servizio
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                ◇ Seleziona orario
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                ● Conferma su WhatsApp
              </div>
            </div>
          </div>
        </div>

        {/* salons */}
        <div id="salons" className="mt-24">
          <h2 className="text-3xl font-semibold">
            Scegli il tuo salone
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="rounded-3xl bg-white/85 p-6 shadow-md"
              >
                <div className="text-xl font-semibold">{s.name}</div>
                <div className="mt-2 text-sm text-[#6B6B6B]">
                  {s.address}
                </div>
                <div className="mt-1 text-sm">{s.phone}</div>

                <a
                  href={`/s/${s.slug}`}
                  className="mt-5 inline-block rounded-full bg-[#2F6F5E] px-6 py-2 text-sm font-semibold text-white hover:bg-[#285E50] transition"
                >
                  Prenota
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* staff */}
        <div id="staff" className="mt-20 rounded-3xl bg-white/80 p-8 shadow-sm">
          <h3 className="text-lg font-semibold">Area staff</h3>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Accesso rapido per gestione prenotazioni e inserimento manuale.
          </p>

          <div className="mt-5 flex gap-3">
            <a className="rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-sm">
              Login staff
            </a>
            <a className="rounded-full bg-white px-5 py-2 text-sm font-semibold shadow-sm">
              Prenotazioni manuali
            </a>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="py-6 text-center text-xs text-[#6B6B6B]">
        © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
      </footer>
    </div>
  );
}
