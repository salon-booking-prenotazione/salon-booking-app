export default function BookingPage({
  params,
}: {
  params: { slug: string };
}) {
  // ✅ per ora usiamo dati finti (poi colleghiamo Supabase)
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

  const salon = salons.find((s) => s.slug === params.slug);

  if (!salon) {
    return (
      <div className="min-h-screen bg-[#F3F7F4] text-[#1F1F1F] flex items-center justify-center p-6">
        <div className="max-w-md rounded-3xl bg-white/85 p-8 shadow-lg">
          <div className="text-xs tracking-widest text-[#6B6B6B]">NOT FOUND</div>
          <h1 className="mt-2 font-serif text-3xl">Salone non trovato</h1>
          <p className="mt-3 text-sm text-[#6B6B6B]">
            Controlla il link oppure torna alla home.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-full bg-[#2F6F5E] px-6 py-2 text-sm font-semibold text-white hover:bg-[#285E50] transition"
          >
            Torna alla home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F7F4] text-[#1F1F1F]">
      {/* BACKGROUND (più “spa”, più visibile) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-36 -left-36 h-[32rem] w-[32rem] rounded-full bg-[#E6A9BB]/35 blur-3xl" />
        <div className="absolute top-24 -right-40 h-[34rem] w-[34rem] rounded-full bg-[#CFE2D9]/65 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-white/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-12">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold tracking-widest shadow-sm"
          >
            ✦ SALON BOOKING
          </a>

          <div className="text-sm text-[#6B6B6B]">
            WhatsApp • Semplice • Veloce
          </div>
        </div>

        {/* HERO GLASS */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2 items-start">
          {/* Left: salon info */}
          <div className="rounded-3xl bg-white/70 p-8 shadow-lg backdrop-blur-md">
            <div className="text-xs tracking-widest text-[#6B6B6B]">
              PRENOTAZIONE
            </div>

            <h1 className="mt-3 font-serif text-4xl md:text-5xl leading-tight">
              {salon.name}
            </h1>

            <p className="mt-4 text-sm text-[#6B6B6B]">
              {salon.address}
              <br />
              Tel: {salon.phone}
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <div className="text-sm font-semibold">✦ 1) Scegli servizio</div>
                <div className="mt-1 text-sm text-[#6B6B6B]">
                  Taglio, colore, piega…
                </div>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <div className="text-sm font-semibold">◇ 2) Seleziona orario</div>
                <div className="mt-1 text-sm text-[#6B6B6B]">
                  Solo slot disponibili
                </div>
              </div>

              <div className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <div className="text-sm font-semibold">● 3) Conferma su WhatsApp</div>
                <div className="mt-1 text-sm text-[#6B6B6B]">
                  Messaggio pronto, un click
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${salon.phone.replace("+", "")}?text=${encodeURIComponent(
                  `Ciao! Vorrei prenotare un appuntamento da ${salon.name}.`
                )}`}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-[#2F6F5E] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#285E50] transition"
              >
                Conferma su WhatsApp
              </a>

              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-white/80 px-6 py-3 text-sm font-semibold shadow-sm hover:bg-white transition"
              >
                Torna alla home
              </a>
            </div>
          </div>

          {/* Right: “booking card” mock premium */}
          <div className="rounded-3xl bg-white/75 p-8 shadow-xl backdrop-blur-md">
            <div className="text-xs tracking-widest text-[#6B6B6B]">
              SELEZIONA
            </div>

            <h2 className="mt-3 font-serif text-3xl">
              Scegli data & ora
            </h2>

            <p className="mt-3 text-sm text-[#6B6B6B]">
              (Per ora è una demo “bella”. Poi colleghiamo calendario e slot reali.)
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/90 p-5 shadow-sm">
                <div className="text-sm font-semibold">Servizio</div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {["Taglio", "Colore", "Piega", "Trattamento"].map((x) => (
                    <span
                      key={x}
                      className="rounded-full bg-[#E6A9BB]/35 px-4 py-2 text-sm"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/90 p-5 shadow-sm">
                <div className="text-sm font-semibold">Orari disponibili</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map(
                    (t) => (
                      <button
                        key={t}
                        className="rounded-xl bg-white px-3 py-3 text-sm shadow-sm ring-1 ring-black/5 hover:ring-[#2F6F5E]/40 transition"
                        type="button"
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white/90 p-5 shadow-sm">
                <div className="text-sm font-semibold">Nota (opzionale)</div>
                <input
                  className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-[#2F6F5E]/40"
                  placeholder="Es. Ho i capelli lunghi…"
                />
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${salon.phone.replace("+", "")}?text=${encodeURIComponent(
                    `Ciao! Vorrei prenotare da ${salon.name}.`
                  )}`}
                  target="_blank"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[#E6A9BB] px-6 py-4 text-sm font-semibold text-[#1F1F1F] shadow-md hover:bg-[#DD9CAF] transition"
                >
                  Invia richiesta su WhatsApp
                </a>

                <div className="mt-3 text-center text-xs text-[#6B6B6B]">
                  Nessuna app • Nessuna registrazione • Solo WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <footer className="mt-14 text-center text-xs text-[#6B6B6B]">
          © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
        </footer>
      </div>
    </div>
  );
}
