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
  return (
    <pre style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(
        {
          slug: params.slug,
          salon: salon ?? null,
          error: salonErr ?? null,
        },
        null,
        2
      )}
    </pre>
  );
}
