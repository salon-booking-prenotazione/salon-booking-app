export default function SalonBookingPage() {
  // ✅ per ora test fisso (poi lo colleghiamo allo slug + Supabase)
  const salon = {
    name: "Lorena Salon",
    address: "Via Belluzzo 29, Verona",
    phone: "+393397940573",
  };

  return (
    <div className="min-h-screen bg-[#EDF4F0] text-[#101413]">
      {/* HERO background con foto + overlay (come tuo screen) */}
      <section className="relative min-h-[92vh] overflow-hidden">
        {/* immagine sfondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/booking-hero.jpg')" }}
        />
        {/* overlay scuro per leggibilità */}
        <div className="absolute inset-0 bg-[#0E1A16]/55" />
        {/* overlay rosa/verde soft “lux” */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E8B7C8]/35 via-transparent to-[#2A6B57]/20" />

        {/* contenuto */}
        <div className="relative mx-auto max-w-6xl px-5 py-12 md:py-16">
          {/* top bar */}
          <div className="flex items-center justify-between gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs tracking-[0.18em] uppercase text-white/90 ring-1 ring-white/20 backdrop-blur"
            >
              <span className="text-[#FFD7E6]">✦</span>
              <span>Salon Booking</span>
            </a>

            <div className="hidden text-sm text-white/80 md:block">
              WhatsApp • Semplice • Veloce
            </div>
          </div>

          {/* layout 2 colonne */}
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {/* SINISTRA: titolo + info */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs ring-1 ring-white/15 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#E8B7C8]" />
                Prenotazione
              </div>

              <h1 className="mt-6 text-5xl font-semibold leading-[1.03] md:text-6xl">
                Prenota da
                <br />
                <span className="text-white">{salon.name}</span>
              </h1>

              <p className="mt-5 max-w-prose text-base leading-relaxed text-white/80 md:text-lg">
                Seleziona servizio e orario. Confermi su WhatsApp con un messaggio
                già pronto.
              </p>

              <div className="mt-7 space-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    ⌁
                  </span>
                  {salon.address}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    ☏
                  </span>
                  {salon.phone}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-6 py-3 text-sm font-semibold text-[#1A1A1A] shadow-sm transition hover:translate-y-[-1px] hover:bg-[#DFA9BC]"
                >
                  Inizia
                </a>

                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
                >
                  Torna ai saloni
                </a>
              </div>
            </div>

            {/* DESTRA: card glass prenotazione */}
            <div
              id="booking"
              className="rounded-3xl bg-white/12 p-7 ring-1 ring-white/20 backdrop-blur-md md:p-9"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-white/70">
                Prenota online
              </div>

              <div className="mt-3 text-2xl font-semibold leading-tight text-white">
                Un’esperienza
                <br />
                morbida &amp; chic
              </div>

              {/* Step cards con icone (non numeri) */}
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#E8B7C8]/25 ring-1 ring-[#E8B7C8]/35">
                      ✦
                    </span>
                    Scegli servizio
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    (qui poi mettiamo i servizi reali)
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#2A6B57]/25 ring-1 ring-[#2A6B57]/35">
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
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                      ✓
                    </span>
                    Conferma su WhatsApp
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    Messaggio pronto, un click
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center justify-center rounded-full bg-[#2A6B57] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245A49]">
                  Continua
                </button>

                <button className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20">
                  Annulla
                </button>
              </div>

              <div className="mt-5 text-xs text-white/60">
                © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
              </div>
            </div>
          </div>
        </div>

        {/* sfuma verso il fondo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#EDF4F0]" />
      </section>
    </div>
  );
}
