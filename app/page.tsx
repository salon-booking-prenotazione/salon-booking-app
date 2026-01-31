import Image from "next/image";

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
    <div className="min-h-screen bg-[#0B0F0E] text-white">
      {/* HERO: immagine luxury */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[640px] w-full overflow-hidden">
          {/* ✅ Metti questa foto: public/images/home-hero.jpg */}
          <Image
            src="/images/home-hero.jpg"
            alt="Luxury salon"
            fill
            priority
            className="object-cover object-center"
          />

          {/* overlay elegante */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/85" />
          <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_45%_35%,rgba(232,183,200,0.20),transparent_60%)]" />
          <div className="absolute inset-0 [background:radial-gradient(70%_70%_at_20%_20%,rgba(207,226,217,0.14),transparent_55%)]" />

          {/* contenuto */}
          <div className="relative mx-auto max-w-6xl px-6 pt-10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs tracking-[0.22em] uppercase ring-1 ring-white/15 backdrop-blur-md">
                <span className="text-[#E8B7C8]">✦</span>
                SALON BOOKING
              </div>

              <div className="hidden text-sm text-white/70 md:block">
                WhatsApp • Simple • Fast
              </div>
            </div>

            <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-end">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] tracking-[0.22em] uppercase ring-1 ring-white/15 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#CFE2D9]" />
                  Luxury booking experience
                </div>

                <h1 className="mt-5 text-4xl font-semibold leading-[1.05] md:text-6xl">
                  Il tuo momento
                  <br />
                  di bellezza.
                </h1>

                <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">
                  Prenotare dev’essere semplice e bello. Scegli il tuo salone e
                  conferma su WhatsApp in pochi secondi.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#salons"
                    className="inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-black/30 hover:bg-[#DFA9BC]"
                  >
                    Scegli il salone
                  </a>

                  <a
                    href="#staff"
                    className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                  >
                    Area staff
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-6 text-xs text-white/65">
                  <div className="flex items-center gap-2">
                    <span className="text-[#CFE2D9]">✳</span> Slot reali disponibili
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E8B7C8]">✦</span> Conferma su WhatsApp
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">⟡</span> Nessuna app
                  </div>
                </div>
              </div>

              {/* mini card elegante */}
              <div className="md:justify-self-end">
                <div className="w-full max-w-lg rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-xl shadow-2xl shadow-black/35 md:p-8">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
                    Come funziona
                  </div>

                  <div className="mt-3 text-2xl font-semibold leading-tight">
                    Un flusso semplice,
                    <br />
                    ma premium.
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/10">
                          <span className="text-[#E8B7C8]">✦</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            Scegli il salone
                          </div>
                          <div className="mt-1 text-sm text-white/70">
                            Seleziona quello vicino a te
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/10">
                          <span className="text-[#E8B7C8]">⟡</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            Seleziona servizio e orario
                          </div>
                          <div className="mt-1 text-sm text-white/70">
                            Solo slot disponibili
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/10">
                          <span className="text-[#E8B7C8]">✳</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            Conferma su WhatsApp
                          </div>
                          <div className="mt-1 text-sm text-white/70">
                            Un click, messaggio pronto
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                    <div className="text-xs text-white/70">
                      Pensato per saloni moderni: semplice, elegante, senza app.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0B0F0E]" />
        </div>
      </section>

      {/* LISTA SALONI */}
      <section id="salons" className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl font-semibold md:text-4xl">Scegli il tuo salone</h2>
          <div className="hidden text-sm text-white/60 md:block">
            Prenotazione in pochi secondi
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {salons.map((s) => (
            <div
              key={s.slug}
              className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur hover:bg-white/10 transition"
            >
              <div className="text-xl font-semibold">{s.name}</div>
              <div className="mt-2 text-sm text-white/70">{s.address}</div>
              <div className="mt-1 text-sm text-white/70">{s.phone}</div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-white/50">/s/{s.slug}</div>
                <a
                  href={`/s/${s.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#DFA9BC]"
                >
                  Prenota
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* STAFF */}
        <div
          id="staff"
          className="mt-12 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur"
        >
          <div className="text-sm font-semibold">Area staff</div>
          <div className="mt-1 text-sm text-white/70">
            Accesso rapido per gestione prenotazioni e inserimento manuale.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/staff/login"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
            >
              Login staff
            </a>
            <a
              href="/admin/manual"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/15"
            >
              Prenotazioni manuali
            </a>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-white/55">
          © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
        </footer>
      </section>
    </div>
  );
}
