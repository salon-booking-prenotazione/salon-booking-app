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
    <div className="min-h-screen text-[#1F1F1F] bg-gradient-to-br from-[#F4F8F6] via-[#E6EFEA] to-[#DDEAE3] relative overflow-hidden">

      {/* decorative luxury blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#E8B7C8]/40 blur-3xl" />
        <div className="absolute top-24 -right-32 h-96 w-96 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[#CFE2D9]/80 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2 text-xs tracking-widest uppercase ring-1 ring-black/5">
            ✦ Salon Booking
          </div>
          <div className="text-sm opacity-70">
            WhatsApp • Semplice • Veloce
          </div>
        </header>

        {/* HERO */}
        <section className="mt-16 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
              Il tuo momento <br /> di bellezza.
            </h1>

            <p className="mt-6 max-w-md text-lg opacity-75">
              Prenotare dev’essere semplice e bello. Scegli il tuo salone e
              conferma su WhatsApp in pochi secondi.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#salons"
                className="rounded-full bg-[#E8B7C8] px-7 py-3 text-sm font-semibold shadow hover:bg-[#DFA9BC]"
              >
                Scegli il salone
              </a>
              <a
                href="#staff"
                className="rounded-full bg-white/80 px-7 py-3 text-sm font-semibold ring-1 ring-black/5 hover:bg-white"
              >
                Area staff
              </a>
            </div>

            <div className="mt-6 flex gap-6 text-xs opacity-60">
              <span>✔ Conferma su WhatsApp</span>
              <span>✔ Nessuna app da installare</span>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-black/5 backdrop-blur">
            <div className="text-xs tracking-widest uppercase opacity-60">
              Prenota online
            </div>

            <h3 className="mt-3 text-2xl font-semibold">
              Un’esperienza <br /> morbida & chic
            </h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                <strong>1) Scegli servizio</strong>
                <div className="text-sm opacity-70">Taglio, colore, piega…</div>
              </div>
              <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                <strong>2) Seleziona orario</strong>
                <div className="text-sm opacity-70">Solo slot disponibili</div>
              </div>
              <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                <strong>3) Conferma su WhatsApp</strong>
                <div className="text-sm opacity-70">Messaggio pronto, un click</div>
              </div>
            </div>
          </div>
        </section>

        {/* SALONS */}
        <section id="salons" className="mt-24">
          <h2 className="text-3xl font-semibold mb-8">
            Scegli il tuo salone
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-black/5"
              >
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm opacity-70">{s.address}</p>
                <p className="text-sm">{s.phone}</p>

                <a
                  href={`/s/${s.slug}`}
                  className="mt-6 inline-block rounded-full bg-[#E8B7C8] px-6 py-2.5 text-sm font-semibold hover:bg-[#DFA9BC]"
                >
                  Prenota
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* STAFF */}
        <section
          id="staff"
          className="mt-24 rounded-3xl bg-white/70 p-8 ring-1 ring-black/5"
        >
          <h3 className="font-semibold">Area staff</h3>
          <p className="mt-2 text-sm opacity-70">
            Accesso rapido per gestione prenotazioni e inserimento manuale.
          </p>

          <div className="mt-4 flex gap-4">
            <a
              href="/staff/login"
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold ring-1 ring-black/5"
            >
              Login staff
            </a>
            <a
              href="/admin/manual"
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold ring-1 ring-black/5"
            >
              Prenotazioni manuali
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-24 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
        </footer>
      </div>
    </div>
  );
}
