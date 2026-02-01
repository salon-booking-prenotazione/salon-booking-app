import Link from "next/link";

export default function SalonBookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // Demo data (poi colleghiamo Supabase)
  const salonName = slug === "demo" ? "Lorena Salon" : `Salon ${slug}`;
  const month = "April 2026";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const grid = [
    ["", "", "", "1", "2", "3", "4"],
    ["5", "6", "7", "8", "9", "10", "11"],
    ["12", "13", "14", "15", "16", "17", "18"],
    ["19", "20", "21", "22", "23", "24", "25"],
    ["26", "27", "28", "29", "30", "", ""],
  ];

  const slots = ["1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
        {/* LEFT: form */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-start justify-between">
            <h1 className="lux-title text-3xl md:text-4xl">Make an Appointment</h1>
            <Link href="/" className="lux-btn lux-btn-ghost" aria-label="Close">
              ✕
            </Link>
          </div>

          <div className="mt-3 lux-subtitle">
            <b style={{ color: "var(--plum)" }}>{salonName}</b> • Prenotazione demo “bella”
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-sm mb-2" style={{ color: "var(--muted)", fontWeight: 700 }}>
                Service Category
              </div>
              <select className="lux-input" defaultValue="Body Treatments">
                <option>Body Treatments</option>
                <option>Hair</option>
                <option>Nails</option>
              </select>
            </div>

            <div>
              <div className="text-sm mb-2" style={{ color: "var(--muted)", fontWeight: 700 }}>
                Service *
              </div>
              <select className="lux-input" defaultValue="2 Day Programs">
                <option>2 Day Programs</option>
                <option>Taglio & Piega</option>
                <option>Colore</option>
              </select>
            </div>

            <div>
              <div className="text-sm mb-2" style={{ color: "var(--muted)", fontWeight: 700 }}>
                Location
              </div>
              <select className="lux-input" defaultValue="Any">
                <option value="Any">— Any —</option>
                <option>Centro</option>
                <option>Fuori città</option>
              </select>
            </div>

            <div>
              <div className="text-sm mb-2" style={{ color: "var(--muted)", fontWeight: 700 }}>
                Employee
              </div>
              <select className="lux-input" defaultValue="Rachel Green">
                <option>Rachel Green</option>
                <option>Giulia</option>
                <option>Martina</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <a className="lux-btn lux-btn-primary w-full" href="#calendar">
              Next
            </a>
          </div>
        </section>

        {/* RIGHT: calendar + slots */}
        <section id="calendar" className="lux-card lux-frame p-8 md:p-10">
          <div className="flex items-center justify-between">
            <h2 className="lux-title text-2xl md:text-3xl">Make an Appointment</h2>
            <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 700 }}>{month}</div>
          </div>

          {/* Days */}
          <div className="mt-6 grid grid-cols-7 gap-0" style={{ color: "var(--muted)", fontSize: 12 }}>
            {days.map((d) => (
              <div key={d} className="text-center py-2" style={{ fontWeight: 700 }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="lux-grid">
            <div className="grid grid-cols-7">
              {grid.flat().map((v, idx) => {
                const isEmpty = v === "";
                const isSelected = v === "14"; // demo selection
                const isRound = v === "7"; // demo “today”

                return (
                  <div
                    key={idx}
                    className={[
                      "lux-cell",
                      isEmpty ? "lux-cell-muted" : "",
                      isSelected ? "lux-cell-active" : "",
                    ].join(" ")}
                    style={{
                      borderRight: idx % 7 === 6 ? "none" : undefined,
                      borderBottom: idx >= 28 ? "none" : undefined,
                      borderColor: "var(--line)",
                      background: isRound ? "rgba(127,143,134,0.22)" : undefined,
                      borderRadius: isRound ? 999 : undefined,
                      margin: isRound ? 6 : 0,
                      height: isRound ? 30 : 42,
                      width: isRound ? 30 : "auto",
                      justifySelf: isRound ? "center" : undefined,
                    }}
                  >
                    {v || " "}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slots */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {slots.map((t) => (
              <div key={t} className={`lux-slot ${t === "1:30 pm" ? "selected" : ""}`}>
                {t}
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button className="lux-btn lux-btn-primary w-full" type="button">
              Next
            </button>
            <Link className="lux-btn w-full" href="/">
              Back
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
