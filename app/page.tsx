"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Salon = {
  id: string;
  name: string | null;
  slug: string;
  phone: string | null;
  address?: string | null;
  city?: string | null;
};

function hasStaffCookie(): boolean {
  // cookie semplice: staff=1 (come nel middleware)
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim() === "staff=1");
}

export default function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    setIsStaff(hasStaffCookie());

    (async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("salons")
        .select("id,name,slug,phone,address,city")
        .order("name", { ascending: true });

      if (!error) setSalons(data || []);
      setLoading(false);
    })();
  }, []);

  const bgStyle: React.CSSProperties = useMemo(
    () => ({
      minHeight: "100vh",
      padding: 24,
      fontFamily: "system-ui",
      background:
        "radial-gradient(1200px 600px at 10% 0%, rgba(248,240,236,1) 0%, rgba(255,255,255,1) 60%), radial-gradient(900px 500px at 90% 10%, rgba(240,246,248,1) 0%, rgba(255,255,255,1) 55%)",
    }),
    []
  );

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.70)",
    backdropFilter: "blur(8px)",
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.85,
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 22,
    padding: 22,
    boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
    backdropFilter: "blur(10px)",
  };

  const btnPrimary: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: 999,
    border: "1px solid rgba(17,17,17,0.9)",
    background: "rgba(17,17,17,0.92)",
    color: "white",
    textDecoration: "none",
    fontWeight: 600, // ✅ più chic
    boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
    whiteSpace: "nowrap",
  };

  const btnGhost: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 18px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.85)",
    color: "#111",
    textDecoration: "none",
    fontWeight: 500, // ✅ più chic
    whiteSpace: "nowrap",
  };

  return (
    <div style={bgStyle}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={pillStyle}>✨ Salon Booking</div>

          <h1
            style={{
              fontSize: 56,
              lineHeight: 1.02,
              margin: "14px 0 10px",
              fontWeight: 800, // se vuoi ancora meno: 700
              letterSpacing: -1.2,
            }}
          >
            Il tuo momento di relax
          </h1>

          {/* ✅ testino corto e chic */}
          <p
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 400,
              opacity: 0.78,
              maxWidth: 720,
            }}
          >
            Prenotare dev’essere semplice. E bello.
          </p>
        </div>

        {/* Lista saloni */}
        <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
          {loading ? (
            <div style={cardStyle}>Caricamento…</div>
          ) : salons.length === 0 ? (
            <div style={cardStyle}>Nessun salone disponibile.</div>
          ) : (
            salons.map((s) => (
              <div key={s.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>
                      {s.name || "Salone"}
                    </div>

                    <div style={{ opacity: 0.75, marginTop: 6 }}>
                      {[s.address, s.city].filter(Boolean).join(", ")}
                    </div>

                    {s.phone && (
                      <div style={{ opacity: 0.75, marginTop: 6 }}>
                        Tel: {s.phone}
                      </div>
                    )}

                    <div style={{ opacity: 0.45, marginTop: 8 }}>
                      /s/{s.slug}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <a href={`/s/${s.slug}`} style={btnPrimary}>
                      Prenota
                    </a>

                    {/* ✅ Dashboard solo staff */}
                    {isStaff && (
                      <a href={`/s/${s.slug}/dashboard`} style={btnGhost}>
                        Dashboard
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Area staff (discreta) */}
        <div
          style={{
            marginTop: 34,
            paddingTop: 18,
            borderTop: "1px solid rgba(0,0,0,0.10)",
            opacity: 0.85,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
            Area staff
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/staff/login" style={btnGhost}>
              Login staff
            </a>
            <a href="/admin/manual" style={btnGhost}>
              Prenotazioni manuali
            </a>
          </div>
        </div>

        {/* Footer minimal */}
        <div
          style={{
            marginTop: 22,
            fontSize: 12,
            opacity: 0.55,
          }}
        >
          © 2026 — Prenota con eleganza.
        </div>
      </div>
    </div>
  );
}
