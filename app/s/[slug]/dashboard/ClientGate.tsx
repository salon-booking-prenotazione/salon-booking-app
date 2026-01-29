"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function ClientGate() {
  const params = useParams<{ slug: string }>();
  const sp = useSearchParams();

  useEffect(() => {
    // se già c’è staff_key nell’URL non fare nulla
    if (sp.get("staff_key")) return;

    const saved = localStorage.getItem("staff_key");
    if (!saved) return;

    window.location.replace(
      `/s/${params.slug}/dashboard?staff_key=${encodeURIComponent(saved)}`
    );
  }, [params.slug, sp]);

  return null;
}
