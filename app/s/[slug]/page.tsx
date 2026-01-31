import Image from "next/image";

export default function BookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // Per ora: stile uguale per tutti. Più avanti potremo cambiare foto/testi per salone.
  const salonName =
    slug === "jolanda-salon"
      ? "Jolanda Salon"
      : slug === "lorena-salon"
      ? "Lorena Salon"
      : "Salon";

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-white">
      {/* HERO con foto reale */}
      <div className="relative">
        <div className="relative h-[78vh] min-h-[640px] w-full overflow-hidden">
          {/* Foto */}
          <Image
            src="/images/booking-bg.jpg"
            alt="Salon background"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Overlay luxury (scurisce + vignetta) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/80" />
          <div className="absolute inset-0 [background:radial-gradient(60%_60%_at_50%_40%,rgba(232,183,200,0.18),transparent_60%)]" />
          <div className="absolute inset-0 [background:radial-gradient(70%_70%_at_20%_20%,rgba(207,226,217,0.14),transparent_55%)]" />

          {/* Contenuto */}
          <div className="relative mx-auto max-w-6xl px-6 pt-10">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs tracking-[0.22em] uppercase ring-1 ring-white/15 backdrop-blur-md hover:bg-white/15"
              >
                <span className="text-[#E8B7C8]">✦</span>
                Salon Booking
              </a>

              <div className="hidden text-sm text-white/70 md:block">
                WhatsApp • Simple • Fast
              </div>
            </div>

            {/* Hero grid */}
            <div className="mt-14 grid gap-10 md:grid-cols-2 md:items-end">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] tracking-[0.22em] uppercase ring-1 ring-white/15 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#CFE2D9]" />
                  Booking experience
                </div>

                <h1 className="mt-5 text-4xl font-semibold leading-[1.05] md:text-6xl">
                  Prenota da{" "}
                  <span className="text-[#E8B7C8]">{salonName}</span>
                  <br />
                  in modo elegante.
                </h1>

                <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">
                  Seleziona servizio e orario. La conferma avviene su WhatsApp in
                  pochi secondi, senza app.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#form"
                    className="inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-black/30 hover:bg-[#DFA9BC]"
                  >
                    Inizia la prenotazione
                  </a>

                  <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                  >
                    Torna ai saloni
                  </a>
                </div>

                {/* micro dettagli */}
                <div className="mt-8 flex flex-wrap gap-6 text-xs text-white/65">
                  <div className="flex items-center gap-2">
                    <span className="text-[#CFE2D9]">✳</span>
                    Slot reali disponibili
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E8B7C8]">✦</span>
                    Messaggio WhatsApp pronto
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">⟡</span>
                    Nessuna app da installare
                  </div>
                </div>
              </div>

              {/* Card “Come funziona” (non basic + simboli) */}
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
                    <Step
                      symbol="✦"
                      title="Scegli servizio"
                      desc="Taglio, colore, piega…"
                    />
                    <Step
                      symbol="⟡"
                      title="Seleziona orario"
                      desc="Solo slot disponibili"
                    />
                    <Step
                      symbol="✳"
                      title="Conferma su WhatsApp"
                      desc="Un click, messaggio pronto"
                    />
                  </div>

                  <div className="mt-6 rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                    <div className="text-xs text-white/70">
                      Tip: puoi aggiungere una nota (es. “colore rame”).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fade per passare al contenuto */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0B0F0E]" />
        </div>
      </div>

      {/* SEZIONE FORM */}
      <div id="form" className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Form placeholder (ci colleghiamo al tuo form reale) */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:p-8">
            <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
              Prenotazione
            </div>
            <h2 className="mt-3 text-2xl font-semibold">
              Scegli servizio e orario
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Qui ci mettiamo il tuo componente di scelta servizio/orario.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Servizio</div>
                <div className="text-sm text-white/70">—</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Data & Orario</div>
                <div className="text-sm text-white/70">—</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">Nota (opzionale)</div>
                <div className="text-sm text-white/70">—</div>
              </div>

              <button className="mt-2 w-full rounded-full bg-[#E8B7C8] px-6 py-3 text-sm font-semibold text-black hover:bg-[#DFA9BC]">
                Continua su WhatsApp
              </button>
            </div>
          </div>

          {/* Side “trust + dettagli” */}
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur md:p-8">
            <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
              Dettagli
            </div>

            <h3 className="mt-3 text-2xl font-semibold">Perché è diverso</h3>
            <p className="mt-2 text-sm text-white/70">
              Design premium, ma flusso rapido. Ideale per saloni che vogliono
              WhatsApp + prenotazioni pulite.
            </p>

            <div className="mt-6 space-y-3 text-sm text-white/75">
              <div className="flex gap-3">
                <span className="text-[#CFE2D9]">✦</span>
                <div>
                  <div className="font-semibold text-white">Zero frizione</div>
                  <div className="text-white/70">
                    Il cliente completa in pochi click.
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#E8B7C8]">⟡</span>
                <div>
                  <div className="font-semibold text-white">Look luxury</div>
                  <div className="text-white/70">
                    Più fiducia, più conversione.
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-white/70">✳</span>
                <div>
                  <div className="font-semibold text-white">Sempre chiaro</div>
                  <div className="text-white/70">
                    Servizio, orario, conferma: tutto leggibile.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/55">
              © {new Date().getFullYear()} Salon Booking • Designed for modern
              salons ✦
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  symbol,
  title,
  desc,
}: {
  symbol: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 ring-1 ring-white/10">
          <span className="text-[#E8B7C8]">{symbol}</span>
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-sm text-white/70">{desc}</div>
        </div>
      </div>
    </div>
  );
}
