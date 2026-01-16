import { supabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function NewAppointment() {
  // Prendiamo i servizi del salone demo
  const { data: salon } = await supabase
    .from("salons")
    .select("id,slug")
    .eq("slug", "salon-demo")
    .single();

  if (!salon) return <p>Salone non trovato (slug: salon-demo)</p>;

  const { data: services, error } = await supabase
    .from("services")
    .select("id,name,duration_minutes")
    .eq("salon_id", salon.id)
    .order("name", { ascending: true });

  if (error) return <p>Errore servizi: {error.message}</p>;

  return (
    <div>
      <h3>Aggiungi appuntamento</h3>
      <p>(Per ora è una pagina di test. Poi mettiamo il form vero.)</p>

      <h4>Servizi disponibili</h4>
      <ul>
        {(services ?? []).map((s: any) => (
          <li key={s.id}>
            {s.name} — {s.duration_minutes} min
          </li>
        ))}
      </ul>
    </div>
  );
}
<a href="/s/salon-demo">Aggiungi appuntamento</a>
