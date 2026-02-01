import Link from "next/link";

export default function SalonBookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const salonName = slug === "demo" ? "Let Your Body Rest Today" : `Prenota da ${slug}`;

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  // calendario finto (solo UI)
  const month = "April 2026";
  const grid = [
    ["", "", "", "1", "2", "3", "4"],
    ["5","6","7","8","9","10","11"],
    ["12","13","14","15","16","17","18"],
    ["19","20","21","22","23","24","25"],
    ["26","27","28","29","30","",""],
  ];

  const slots = ["1:00 pm","1:30 pm","2:00 pm","2:30 pm","3:00 pm","3:30 pm"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
        {/* LEFT: intro + form */}
        <section className="lux-card lux-frame p-8 md:p-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="lux-label">Make an appointment</div>
              <Link className="lux-label underline" href="/">Close</Link>
            </div>

            <h1 className="lux-h1">{salonName}</h1>
            <p className="lux-muted">
              Stile elegante, colori sage/rose e tabelle come nell’esempio. Foto rimossa: focus su prenotazione.
            </p>

            <div className="grid md:grid-cols-1 gap-4">
              <div>
                <div className="lux-label mb-2">Service category</div>
                <select className="lux-select" defaultValue="Body Treatments" name="category">
                  <option>Body Treatments</option>
                  <option>Hair</option>
                  <option>Nails</option>
                </select>
              </div>

              <div>
                <div className="lux-label mb-2">Service</div>
                <select className="lux-select" defaultValue="2 Day Programs" name="service">
                  <option>2 Day Programs</option>
                  <option>Massage 60 min</option>
                  <option>Facial 45 min</option>
                </select>
              </div>

              <div>
                <div className="lux-label mb-2">Location</div>
                <select className="lux-select" defaultValue="Any" name="location">
                  <option value="Any">— Any —</option>
                  <option>Centro</option>
                  <option>Fuori città</option>
                </select>
              </div>

              <div>
                <div className="lux-label mb-2">Employee</div>
                <select className="lux-select" defaultValue="Rachel Green" name="employee">
                  <option>Rachel Green</option>
                  <option>Giulia</option>
                  <option>Martina</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <a className="lux-btn lux-btn-sage" href="#calendar">Next</a>
              <Link className="lux-btn lux-btn-ghost" href="/">Back</Link>
            </div>
          </div>
        </section>

        {/* RIGHT: calendar + slots */}
        <section id="calendar" className="lux-card lux-frame p-8 md:p-10">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="lux-label">Make an appointment</div>
              <div className="lux-label">{month}</div>
            </div>

            {/* days header */}
            <div className="grid grid-cols-7 gap-0">
              {days.map((d) => (
                <div key={d} className="lux-label text-center py-2 border-b" style={{borderColor:"var(--line)"}}>
                  {d}
                </div>
              ))}
            </div>

            {/* calendar grid */}
            <div className="lux-grid">
              <div className="grid grid-cols-7">
                {grid.flat().map((v, idx) => {
                  const isEmpty = v === "";
                  const isSelected = v === "14"; // solo demo UI
                  return (
                    <div
                      key={idx}
                      className={[
                        "lux-cell",
                        isEmpty ? "lux-cell-muted" : "",
                        isSelected ? "lux-cell-active" : "",
                      ].join(" ")}
                      style={{
                        borderRight: (idx % 7 === 6) ? "none" : undefined,
                      }}
                    >
                      {v || " "}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* time slots */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {slots.map((t) => (
                <div key={t} className={`lux-slot ${t === "1:30 pm" ? "selected" : ""}`}>
                  {t}
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-3">
              <button className="lux-btn lux-btn-sage" type="button">Next</button>
              <button className="lux-btn lux-btn-ghost" type="button">Back</button>
            </div>

            <p className="lux-muted">
              Prossimo step: rendiamo calendario e slot “veri” leggendo disponibilità da Supabase.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
