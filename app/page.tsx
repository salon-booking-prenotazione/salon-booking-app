import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Server-side: ok usare service role per evitare problemi di RLS in lettura
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
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Salon Booking</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Seleziona un salone per prenotare.
      </p>

      {error ? (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #f0c", borderRadius: 12 }}>
          Errore caricamento saloni.
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{error.message}</pre>
        </div>
      ) : !salons?.length ? (
        <div style={{ marginTop: 16, opacity: 0.8 }}>Nessun salone disponibile.</div>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {salons.map((s: Salon) => (
            <div
              key={s.id}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 16,
                padding: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  {s.name ?? s.slug}
                </div>

                {(s.address || s.city) && (
                  <div style={{ marginTop: 4, opacity: 0.8 }}>
                    {[s.address, s.city].filter(Boolean).join(", ")}
                  </div>
                )}

                {s.phone && (
                  <div style={{ marginTop: 6, fontSize: 14, opacity: 0.8 }}>
                    Tel: {s.phone}
                  </div>
                )}

                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.6 }}>
                  /s/{s.slug}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  href={`/s/${s.slug}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #111",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Prenota
                </Link>

                {/* Dashboard: meglio NON mostrarla qui pubblicamente.
                    La rendiamo accessibile solo dallo staff dopo login (middleware). */}
                <Link
                  href={`/s/${s.slug}/dashboard`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #e5e5e5",
                    textDecoration: "none",
                    opacity: 0.85,
                  }}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "28px 0" }} />

      <div>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Area staff</h2>
        <ul style={{ marginTop: 0 }}>
          <li>
            <Link href="/staff/login">Login staff</Link>
          </li>
          <li>
            <Link href="/admin/manual">Prenotazioni manuali</Link>
          </li>
        </ul>

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Consiglio: proteggiamo <code>/s/*/dashboard</code> con middleware (solo staff).
        </div>
      </div>
    </div>
  );
}
