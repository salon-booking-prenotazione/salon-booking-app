"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
};

export default function Page({ params }: { params: { slug: string } }) {
  const [servizi, setServizi] = useState<Service[]>([]);
  const [servizio, setServizio] = useState("");

  // ✅ QUERY RECUPERATA
  useEffect(() => {
    async function loadServices() {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, duration_minutes")
        .order("name");

      if (!error && data) {
        setServizi(data);
      }
    }

    loadServices();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">

        {/* CARD SINISTRA */}
        <div className="lux-card lux-frame p-8">
          <div className="flex justify-between items-start">
            <h1 className="lux-title text-3xl">Prenota appuntamento</h1>
            <Link href="/" className="lux-btn lux-btn-ghost">✕</Link>
          </div>

          <div className="mt-2 font-medium" style={{ color: "var(--plum)" }}>
            Lorena Salon
          </div>

          {/* ===== SERVIZIO (QUERY RIPRISTINATA) ===== */}
          <div className="mt-6">
            <div className="mb-3 text-xs uppercase font-semibold text-[var(--muted)]">
              Servizio *
            </div>

            <div className="flex justify-center">
              <select
                className="lux-input"
                style={{ maxWidth: 360, width: "100%" }}
                value={servizio}
                onChange={(e) => setServizio(e.target.value)}
              >
                <option value="" disabled>
                  Seleziona un servizio…
                </option>

                {servizi.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 text-center text-sm text-[var(--muted)]">
              Seleziona il servizio, poi scegli data e orario.
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              className="lux-btn lux-btn-primary"
              style={{ minWidth: 240 }}
              disabled={!servizio}
            >
              Avanti
            </button>
          </div>
        </div>

        {/* CARD DESTRA (placeholder per calendario) */}
        <div className="lux-card lux-frame p-8 flex items-center justify-center text-[var(--muted)]">
          Calendario (step successivo)
        </div>

      </div>
    </div>
  );
}
