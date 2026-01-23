"use client";

import { useState } from "react";

export default function StaffLogin() {
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    setMsg("");
    const res = await fetch("/api/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) {
      setMsg(json?.error || "Errore");
      return;
    }

    // vai alla pagina staff manuale (o quella che vuoi)
    window.location.href = "/admin/manual"; // oppure "/staff/manual" se preferisci
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 420 }}>
      <h1>Login Staff</h1>
      <label>Password</label>
      <input
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />
      <button onClick={submit} style={{ marginTop: 12, width: "100%", padding: 12 }}>
        Entra
      </button>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}