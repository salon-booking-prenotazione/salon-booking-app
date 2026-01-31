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
    <div className="min-h-screen bg-[#E7F1EC] text-[#1F1F1F]">
      {/* BLOBS DECORATIVI */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#E8B7C8]/60 blur-3xl" />
        <div className="absolute top-10 -right-24 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#CFE2D9]/85 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-14">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs tracking-[0.22em] uppercase ring-1 ring-black/5 backdrop-blur-md">
              <span className="text-[#8A6A75]">✦</span>
              <span>Salon Booking</span>
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#2A2A2A]/55">
              Beauty bookings via WhatsApp
            </div>
          </div>

          <div className="hidden text-sm text-[#2A2A2A]/70 md:block">
            WhatsApp • Simple • Fast
          </div>
        </div>

        {/* HERO */}
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <h1 className="font-[var(--font-serif)] text-5xl leading-[1.05] md:text-6xl">
              Your moment
              <br />
              of beauty.
            </h1>

            <p className="mt-6 max-w-prose text-lg text-[#2A2A2A]/70">
              Booking should be simple and beautiful.
              Choose your salon and confirm on WhatsApp in seconds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#salons"
                className="rounded-full bg-[#E8B7C8] px-7 py-3 text-sm font-semibold text-[#1F1F1F] shadow-sm transition hover:bg-[#DFA9BC]"
              >
                Choose your salon
              </a>

              <a
                href="#staff"
                className="rounded-full bg-white/85 px-7 py-3 text-sm font-semibold text-[#1F1F1F] ring-1 ring-black/5 transition hover:bg-white"
              >
                Staff area
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-[#2A2A2A]/55">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E8B7C8]" />
                WhatsApp confirmation
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white" />
                No app required
              </div>
            </div>
          </div>

          {/* CARD DESTRA */}
          <div className="rounded-3xl bg-white/85 p-8 ring-1 ring-black/5 backdrop-blur-md">
            <div className="text-xs uppercase tracking-[0.22em] text-[#2A2A2A]/60">
              Online booking
            </div>

            <div className="mt-3 font-[var(--font-serif)] text-2xl leading-tight">
              A smooth
              <br />
              & chic experience
            </div>

            <div className="mt-7 space-y-3">
              <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-black/5">
                <div className="font-semibold">1) Choose a service</div>
                <div className="mt-1 text-sm text-[#2A2A2A]/65">
                  Cut, color, styling…
                </div>
              </div>
              <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-black/5">
                <div className="font-semibold">2) Pick a time</div>
                <div className="mt-1 text-sm text-[#2A2A2A]/65">
                  Only available slots
                </div>
              </div>
              <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-black/5">
                <div className="font-semibold">3) Confirm on WhatsApp</div>
                <div className="mt-1 text-sm text-[#2A2A2A]/65">
                  One click, message ready
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SALONS */}
        <div id="salons" className="mt-20">
          <h2 className="text-3xl font-semibold">Choose your salon</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {salons.map((s) => (
              <div
                key={s.slug}
                className="rounded-3xl bg-white/85 p-6 ring-1 ring-black/5 backdrop-blur-md transition hover:translate-y-[-2px]"
              >
                <div className="text-xl font-semibold">{s.name}</div>
                <div className="mt-2 text-sm text-[#2A2A2A]/70">
                  {s.address}
                </div>
                <div className="mt-1 text-sm">{s.phone}</div>

                <a
                  href={`/s/${s.slug}`}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[#E8B7C8] px-6 py-2.5 text-sm font-semibold text-[#1F1F1F] hover:bg-[#DFA9BC]"
                >
                  Book now
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* STAFF */}
        <div
          id="staff"
          className="mt-20 rounded-3xl bg-white/70 p-6 ring-1 ring-black/5 backdrop-blur-md"
        >
          <div className="font-semibold">Staff area</div>
          <div className="mt-1 text-sm text-[#2A2A2A]/70">
            Quick access for appointments management.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/staff/login"
              className="rounded-full bg-white/85 px-5 py-2.5 text-sm font-semibold ring-1 ring-black/5 hover:bg-white"
            >
              Staff login
            </a>
            <a
              href="/admin/manual"
              className="rounded-full bg-white/85 px-5 py-2.5 text-sm font-semibold ring-1 ring-black/5 hover:bg-white"
            >
              Manual bookings
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 text-center text-xs tracking-wide text-[#2A2A2A]/50">
          © {new Date().getFullYear()} Salon Booking • Designed for modern salons ✦
        </footer>
      </div>
    </div>
  );
}
