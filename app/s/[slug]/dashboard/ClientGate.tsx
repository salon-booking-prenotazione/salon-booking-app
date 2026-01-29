"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function ClientGate() {
  const params = useParams<{ slug: string }>();
  const sp = useSearchParams();

  useEffect(() => {
    if (sp.get("staff_key")) return;

    const key = localStorage.getItem("staff_key");
    if (!key) return;

    window.location.replace(
      `/s/${params.slug}/dashboard?staff_key=${encodeURIComponent(key)}`
    );
  }, [params.slug, sp]);

  return null;
}
