import { supabase } from "../../../lib/supabase";


export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // prendiamo il salone demo
  const { data: salon, error: salonErr } = await supabase
    .from("salons")
    .select("id,name,slug")
    .eq("slug", "salon-demo")
    .single();

  if (salonErr || !salon) {
    return <p>Salone non trovato (slug: salon-demo)</p>;
  }

  const { data: rows, error } = await supabase
    .from("appointments")
    .select("id,start_time,end_time,services(name),customers(name,phone)")
    .eq("salon_id", salon.id)
    .order("start_time", { ascending: true });

  if (error) return <p>Errore: {error.message}</p>;

  return (
    <div>
      <h3>Agenda — {salon.name}</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Inizio</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Fine</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Servizio</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Cliente</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Telefono</th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map((a: any) => (
            <tr key={a.id}>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{a.start_time}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{a.end_time}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{a.services?.name}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{a.customers?.name}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{a.customers?.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 12 }}>
        Nota: per ora mostra date in formato tecnico. Dopo le rendiamo “normali”.
      </p>
    </div>
  );
}
