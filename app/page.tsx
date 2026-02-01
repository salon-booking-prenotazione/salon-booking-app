export default function Home() {
  // ✅ TEST: dati finti (poi li colleghiamo a Supabase)
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
    <div className="min-h-screen text-[#101413] bg-[#EDF4F0]">
      {/* HERO con immagine + overlay (lux) */}
      <section className="relative overflow-hidden">
        {/* immagine di sfondo */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/home-hero.jpg')" }}
        />
        {/* overlay scuro/verde per rendere testo leggibile */}
        <div className="absolute inset-0 bg-[#0E1A16]/55" />
        {/* overlay “rosa” soft per luxury */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E8B7C8]/35 via-transparent to-[#CFE2D9]/25" />

        {/* piccoli dettagli decorativi */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#E8B7C8]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[32rem] w-[32rem] rounded-full bg-[#2A6B57]/25 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-14 md:py-20">
          {/* header */}
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs tracking-[0.18em] uppercase text-white/90 ring-1 ring-white/20 backdrop-blur">
              <span className="text-[#FFD7E6]">✦</span>
              <span>Salon Booking</span>
            </div>

            <div className="hidden text-sm text-white/80 md:block">
              WhatsApp • Semplice • Veloce
            </div>
          </div>

          {/* hero layout */}
          <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
            {/* left */}
            <div>
              <h1 className="text-5xl font-semibold leading-[1.03] text-white md:text-6xl">
                Il tuo momento
                <br />
                di bellezza.
              </h1>

              <p className="mt-5 max-w-prose text-base leading-relaxed text-white/80 md:text-lg">
                Prenotare dev’essere semplice e bello. Scegli il tuo salone e
                conferma su WhatsApp in pochi secondi.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#salons"
                  className="inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-6 py-3 text-sm font-semibold text-[#1A1A1A] shadow-sm transition hover:translate-y-[-1px] hover:bg-[#DFA9BC]"
                >
                  Scegli il salone
                </a>

                <a
                  href="#staff"
                  className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
                >
                  Area staff
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-6 text-xs text-white/75">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#E8B7C8]" />
                  Conferma su WhatsApp
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#2A6B57]" />
                  Nessuna app da installare
                </div>
              </div>
            </div>

            {/* right glass card */}
            <div className="rounded-3xl bg-white/12 p-7 ring-1 ring-white/20 backdrop-blur-md md:p-9">
              <div className="text-xs uppercase tracking-[0.22em] text-white/70">
                Prenota online
              </div>

              <div className="mt-3 text-2xl font-semibold leading-tight text-white">
                Un’esperienza
                <br />
                morbida &amp; chic
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#E8B7C8]/25 ring-1 ring-[#E8B7C8]/35">
                      ✦
                    </span>
                    Scegli servizio
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    Taglio, colore, piega…
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2A6B57]/25 ring-1 ring-[#2A6B57]/35">
                      ❖
                    </span>
                    Seleziona orario
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    Solo slot disponibili
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                      ✓
                    </span>
                    Conferma su WhatsApp
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    Messaggio pronto, un click
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* “stacco” sfumato verso la parte sotto */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#EDF4F0]" />
        </div>
      </section>

      {/* Sezione sotto (più visibile: verde + rosa) */}
      <main className="relative mx-auto max-w-6xl px-5 py-12">
        {/* leggero pattern/gradient per non essere “basic” */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(232,183,200,0.25),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(42,107,87,0.18),transparent_55%)]" />

        {/* SALONS */}
        <section id="salons" className="mt-4">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold md:text-4xl">Scegli il tuo salone</h2>
            <div className="hidden text-sm text-[#101413]/60 md:block">
              Prenotazione in pochi secondi
            </div>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="group rounded-3xl bg-white/75 p-7 ring-1 ring-black/5 backdrop-blur-md shadow-[0_12px_50px_rgba(16,20,19,0.08)] transition hover:translate-y-[-2px] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-semibold">{s.name}</div>
                    <div className="mt-2 space-y-1 text-sm text-[#101413]/70">
                      <div>{s.address}</div>
                      <div>Tel: {s.phone}</div>
                    </div>
                  </div>

                  <div className="hidden h-10 w-10 rounded-2xl bg-[#CFE2D9]/55 ring-1 ring-black/5 md:block" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-[#101413]/45">/{`s/${s.slug}`}</div>

                  <a
                    href={`/s/${s.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#2A6B57] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:bg-[#245A49]"
                  >
                    Prenota
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STAFF */}
        <section
          id="staff"
          className="mt-10 rounded-3xl bg-white/55 p-7 ring-1 ring-black/5 backdrop-blur-md"
        >
          <div className="text-sm font-semibold">Area staff</div>
          <div className="mt-1 text-sm text-[#101413]/70">
            Accesso rapido per gestione prenotazioni e inserimento manuale.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/staff/login"
              className="inline-flex items-center justify-center rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#101413] ring-1 ring-black/5 transition hover:bg-white"
            >
              Login staff
            </a>
            <a
              href="/admin/manual"
              className="inline-flex items-center justify-center rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#101413] ring-1 ring-black/5 transition hover:bg-white"
            >
              Prenotazioni manuali
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-[#101413]/55">
          © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
        </footer>
      </main>
    </div>
  );
}
