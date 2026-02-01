import Link from "next/link";

export default function SalonBookingPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // Placeholder: qui poi agganci i dati reali (Supabase) in server component
  const salonName = slug === "demo" ? "Demo Luxury Salon" : `Salon: ${slug}`;

  const services = [
    { name: "Taglio & Piega", duration: "60 min", price: "45€" },
    { name: "Colore", duration: "90 min", price: "70€" },
    { name: "Trattamento", duration: "45 min", price: "35€" },
  ];

  return (
    <div className="space-y-10">
      {/* HERO SALON */}
      <section className="lux-card p-7 md:p-10">
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div className="space-y-3">
            <div className="lux-badge">
              <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.65)]" />
              Pagina prenotazione • /s/{slug}
            </div>

            <h1 className="lux-title">{salonName}</h1>
            <p className="lux-subtitle max-w-2xl">
              Scegli un servizio, inserisci i dati e conferma. (UI pronta: puoi collegare la logica reale subito dopo)
            </p>

            <div className="flex gap-3 flex-wrap pt-2">
              <a className="lux-btn lux-btn-primary" href="#prenota">
                Prenota ora
              </a>
              <Link className="lux-btn lux-btn-ghost" href="/">
                Torna alla Home
              </Link>
            </div>
          </div>

          <div className="lux-card p-5 w-full md:w-[360px]">
            <div className="text-white/85 font-semibold">Info rapide</div>
            <div className="text-white/55 text-sm mt-2 space-y-1">
              <div>📍 Centro città</div>
              <div>🕒 Lun–Sab 09:00–19:00</div>
              <div>💬 WhatsApp disponibile</div>
            </div>
            <div className="lux-sep my-4" />
            <a className="lux-btn w-full" href="https://wa.me/" target="_blank" rel="noreferrer">
              Contatta su WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="grid lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.name} className="lux-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-white/90 font-semibold">{s.name}</div>
              <div className="text-emerald-300 font-semibold">{s.price}</div>
            </div>
            <div className="text-white/55 text-sm mt-2">Durata: {s.duration}</div>

            <div className="lux-sep my-4" />

            <a href="#prenota" className="lux-btn lux-btn-primary w-full">
              Seleziona
            </a>
          </div>
        ))}
      </section>

      {/* BOOKING FORM */}
      <section id="prenota" className="lux-card p-7 md:p-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold">Prenotazione</h2>
            <p className="text-white/60">
              Questa è una versione “safe” per Vercel build: niente client hooks obbligatori.
              Quando vuoi, agganci la submit a Supabase / API route.
            </p>

            <div className="lux-card p-5 mt-4">
              <div className="text-white/85 font-semibold">Suggerimento luxury</div>
              <p className="text-white/55 text-sm mt-1">
                Mantieni massimo 4 campi e CTA chiara (verde/rosa): conversione molto più alta.
              </p>
            </div>
          </div>

          <form
            className="lux-card p-6 space-y-4"
            action="#"
            method="post"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Nome</label>
                <input className="lux-input mt-2" name="name" placeholder="Es. Martina" />
              </div>
              <div>
                <label className="text-sm text-white/70">Telefono</label>
                <input className="lux-input mt-2" name="phone" placeholder="Es. +39 ..." />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70">Servizio</label>
              <select className="lux-input mt-2" name="service" defaultValue={services[0]?.name}>
                {services.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} • {s.price} • {s.duration}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/70">Data</label>
                <input className="lux-input mt-2" type="date" name="date" />
              </div>
              <div>
                <label className="text-sm text-white/70">Orario</label>
                <input className="lux-input mt-2" type="time" name="time" />
              </div>
            </div>

            <button type="submit" className="lux-btn lux-btn-primary w-full py-3">
              Conferma prenotazione
            </button>

            <p className="text-xs text-white/45">
              Dopo l’aggancio a Supabase, qui puoi mostrare conferma + link gestione + ICS.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
