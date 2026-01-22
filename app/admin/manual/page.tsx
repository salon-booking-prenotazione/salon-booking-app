"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Salon = { id: string; name: string; slug: string };
type Service = { id: string; name: string; duration_minutes: number; salon_id: string };

export default function ManualAdminPage() {
  const [adminKey, setAdminKey] = useState("");

  const [salonSlug, setSalonSlug] = useState("");
  const [salon, setSalon] = useState<Salon | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");

  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState(""); // HH:MM

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const [createdLinks, setCreatedLinks] = useState<null | {
    manageUrl: string;
    icsUrl: string;
    googleUrl: string;
  }>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || null,
    [services, serviceId]
  );

  // carica salone + servizi in base allo slug
  useEffect(() => {
    (async () => {
      setMsg("");
      setCreatedLinks(null);
      setSalon(null);
      setServices([]);
      setServiceId("");

      if (!salonSlug.trim()) return;

      const { data: salonData, error } = await supabase
        .from("salons")
        .select("id,name,slug")
        .eq("slug", salonSlug.trim())
        .single();

      if (error || !salonData) {
        setMsg("Salone non trovato (controlla lo slug).");
        return;
      }

      setSalon(salonData);

      const { data: svc, error: svcErr } = await supabase
        .from("services")
        .select("id,name,duration_minutes,salon_id")
        .eq("salon_id", salonData.id)
        .order("name", { ascending: true });

      if (svcErr) {
        setMsg("Errore caricamento servizi.");
        return;
      }

      const list = (svc || []) as any as Service[];
      setServices(list);
      if (list?.[0]?.id) setServiceId(list[0].id);
    })();
  }, [salonSlug]);

  async function createManual() {
    setMsg("");
    setCreatedLinks(null);

    if (!adminKey.trim()) return setMsg("Inserisci Admin Key.");
    if (!salon) return setMsg("Inserisci uno slug salone valido.");
    if (!date || !time) return setMsg("Seleziona data e ora.");
    if (!name.trim() || !phone.trim()) return setMsg("Nome e telefono sono obbligatori.");

    const duration = selectedService?.duration_minutes ?? 30;

    // start/end: ora locale (Italia)
    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + duration * 60 * 1000);

    setLoading(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          salon_id: salon.id,
          service_id: serviceId,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          customer_name: name.trim(),
          contact_phone: phone.trim(),
          contact_email: email.trim() || null,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setMsg(`❌ ${json?.error || "Errore"}`);
        return;
      }

      const appt = json.appointment;

      const manageUrl = `${window.location.origin}/manage/${appt.manage_token}`;
      const icsUrl = `${window.location.origin}/api/calendar/appointment?id=${appt.id}`;

      const toGoogleUTC = (d: Date) =>
        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      const googleParams = new URLSearchParams({
        action: "TEMPLATE",
        text: "Appuntamento Salon",
        dates: `${toGoogleUTC(new Date(appt.start_time))}/${toGoogleUTC(new Date(appt.end_time))}`,
        details: `Gestisci/disdici: ${manageUrl}`,
      });

      const googleUrl =
        "https://calendar.google.com/calendar/render?" + googleParams.toString();

      setCreatedLinks({ manageUrl, icsUrl, googleUrl });
      localStorage.setItem("isAdmin", "true");
      setMsg("✅ Appuntamento manuale creato!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 560 }}>
      <h1>Admin — Appuntamento manuale</h1>

      <div style={{ marginTop: 12 }}>
        <label>Admin Key</label>
        <input
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        <p style={{ fontSize: 12, opacity: 0.8 }}>
          Password che metterai su Vercel come <b>ADMIN_CREATE_KEY</b>.
        </p>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Salon slug</label>
        <input
          value={salonSlug}
          onChange={(e) => setSalonSlug(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          placeholder="es: salon-booking-app-n29f"
        />
      </div>

      {salon && (
        <p style={{ marginTop: 8 }}>
          Salone: <b>{salon.name}</b>
        </p>
      )}

      <div style={{ marginTop: 12 }}>
        <label>Servizio</label>
        <select
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          disabled={!salon || services.length === 0}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.duration_minutes} min)
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label>Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Ora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Nome cliente</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Telefono</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Email (opzionale)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Note (opzionale)</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} style={{ width: "100%", padding: 8 }} rows={3} />
      </div>

      <button
        onClick={createManual}
        disabled={loading}
        style={{ marginTop: 16, width: "100%", padding: 12, cursor: "pointer" }}
      >
        {loading ? "Creo..." : "Crea appuntamento manuale"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      {createdLinks && (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          <a href={createdLinks.manageUrl} target="_blank" rel="noreferrer">
            🔧 Apri gestione prenotazione
          </a>
          <a href={createdLinks.icsUrl} target="_blank" rel="noreferrer">
            📅 Scarica calendario (ICS)
          </a>
          <a href={createdLinks.googleUrl} target="_blank" rel="noreferrer">
            🟦 Apri Google Calendar
          </a>
        </div>
      )}
    </div>
  );
}
