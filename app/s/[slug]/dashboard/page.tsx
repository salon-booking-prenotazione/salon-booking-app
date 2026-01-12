import { supabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Dashboard({
  params,
}: {
  params: { slug: string };
}) {
  const { data: salon, error: salonErr } = await supabase
    .from("salons")
    .select("id,name,slug")
    .eq("slug", params.slug)
    .single();

  if (salonErr || !salon) {
    return <p>Salone non trovato (slug: {params.slug})</p>;
  }

  return <h3>Agenda — {salon.name}</h3>;
}
