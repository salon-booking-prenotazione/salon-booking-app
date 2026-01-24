import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Salon = {
  id: string;
  name: string | null;
  slug: string;
  address: string | null;
  city: string | null;
  phone: string | null;
};

export default async function HomePage() {
  const { data: salons, error } = await supabase
    .from("salons")
    .select("id,name,slug,address,city,phone")
    .order("name", { ascending: true });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(248,240,236,1) 0%, rgba(255,255,255,1) 60%), radial-gradient(900px 500px at 90% 10%, rgba(240,246,248,1) 0%, rgba(255,255,255,1) 55%)",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(6px)",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            ✨ Salon Booking
          </div>

          <h1
            style={{
              fontSize: 44,
              lineHeight: 1.05,
              margin: "12px 0 10px",
              fontWeight: 900,
              letterSpacing: -0.8,
            }}
          >
            Il tuo momento di relax
          </h1>

          <p style={{ margin: 0, fontSize: 16, opacity: 0.8, maxWidth: 720 }}>
            Seleziona un salone e scegli con calma servizio, data e orario.
            Prenotare dev’essere semplice… e bello.
          </p>
        </div>

        {/* Body */}
        {error ? (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 18,
              background: "rgba(255,255,255,0.8)",
            }}
          >
            Errore caricamento saloni.
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
              {error.message}
            </div>
          </div>
        ) : !salons?.length ? (
          <div style={{ marginTop: 16, opacity: 0.8 }}>
            Nessun salone disponibile.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
            {salons.map((s: Salon) => (
              <div
                key={s.id}
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
                  padding: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>
                    {s.name ?? s.slug}
                  </div>

                  {(s.address || s.city) && (
                    <div style={{ marginTop: 6, opacity: 0.8 }}>
                      {[s.address, s.city].filter(Boolean).join(", ")}
                    </div>
                  )}

                  {s.phone && (
                    <div style={{ marginTop: 6, fontSize: 14, opacity: 0.8 }}>
                      Tel: {s.phone}
                    </div>
                  )}

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
                    /s/{s.slug}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link
                    href={`/s/${s.slug}`}
                    style={{
                      padding: "11px 16px",
                      borderRadius: 999,
                      border: "1px solid rgba(17,17,17,0.9)",
                      background: "rgba(17,17,17,0.92)",
                      color: "white",
                      textDecoration: "none",
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                    }}
                  >
                    Prenota
                  </Link>

                  {/* Dashboard: protetta dal middleware, ma la lasciamo visibile qui per te */}
                  <Link
                    href={`/s/${s.slug}/dashboard`}
                    style={{
                      padding: "11px 16px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "rgba(255,255,255,0.9)",
                      color: "#111",
                      textDecoration: "none",
                      fontWeight: 800,
                      opacity: 0.9,
                    }}
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staff area */}
        <div
          style={{
            marginTop: 26,
            paddingTop: 18,
            borderTop: "1px solid rgba(0,0,0,0.10)",
            opacity: 0.95,
          }}
        >
          <h2 style={{ fontSize: 18, margin: "0 0 10px", fontWeight: 900 }}>
            Area staff
          </h2>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link
              href="/staff/login"
              style={{
                padding: "10px 14px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.75)",
                textDecoration: "none",
                color: "#111",
                fontWeight: 750,
              }}
            >
              Login staff
            </Link>

            <Link
              href="/admin/manual"
              style={{
                padding: "10px 14px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.75)",
                textDecoration: "none",
                color: "#111",
                fontWeight: 750,
              }}
            >
              Prenotazioni manuali
            </Link>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            Suggerimento: /s/*/dashboard è protetta (solo staff).
          </div>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, opacity: 0.6 }}>
          © {new Date().getFullYear()} — Prenota con eleganza.
        </div>
      </div>
    </div>
  );
}
