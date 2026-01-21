"use client";

import { useState } from "react";

export default function CancelButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function cancel() {
    if (!confirm("Vuoi davvero disdire l’appuntamento?")) return;

    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/manage/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Errore");

      setDone(true);
    } catch (e: any) {
      setErr(e.message || "Errore");
    } finally {
      setLoading(false);
    }
  }

  if (done) return <p>✅ Appuntamento disdetto.</p>;

  return (
    <div style={{ marginTop: 16 }}>
      <button type="button" onClick={cancel} disabled={loading}>
        {loading ? "Disdico..." : "Disdici appuntamento"}
      </button>
      {err && <p style={{ color: "crimson" }}>❌ {err}</p>}
    </div>
  );
}
