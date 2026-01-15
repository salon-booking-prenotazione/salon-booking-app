"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Salon = { id: string; name: string; slug: string; phone: string | null };
type Service = { id: string; name: string; duration_minutes: number };

export default function BookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");

  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<"email" | "sms" | "both">("email");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      setMsg("");

      const { data: salonData, error: sErr } = await supabase
        .from("salons")
        .select("id,name,slug,phone")
        .eq("slug", slug)
        .single();

      if (sErr) {
        setMsg("Salone non trovato.");
        return;
      }
      setSalon(salonData);

      const { data: svc, error: svcErr } = await supabase
        .from("services")
        .select("id,name,duration_minutes")
        .eq("salon_id", salonData.id)
        .order("name", { ascending: true });

      if (svcErr) {
        setMsg("Errore caricamento servizi.");
        return;
      }

      setServices(svc || []);
      if (svc?.[0]?.id) setServiceId(svc[0].id);
    })();
  }, [slug]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || null,
    [services, serviceId]
  );

  async function submit() {
    if (!salon) return;
    setMsg("");

    if (!serviceId || !date || !time || !name || !phone) {
      setMsg("Compila tutti i campi obbligatori.");
      return;
    }
    if (channel === "email" && !email) {
      setMsg("Se scegli Email, l’email è obbligatoria.");
      return;
    }

    // start/end in ISO
    const start = new Date(`${date}T${time}:00`);
    const duration = selectedService?.duration_minutes ?? 30;
    const end = new Date(start.getTime() + duration * 60 * 1000);

    setLoading(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salon_id: salon.id,
          service_id: serviceId,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          name,
          phone,
          email: email || undefined,
          confirmation_channel: channel,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setMsg(json?.error || "Errore durante la prenotazione.");
        return;
      }

      const manageLink = `${window.location.origin}/manage/${json.manage_token}`;
      setMsg(`✅ Prenotazione confermata!\nLink gestione/disdetta:\n${manageLink}`);
    } finally {
      setLoading(false);
    }
  }

  if (!salon) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Prenotazione</h1>
        <p>{msg || "Caricamento..."}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 520 }}>
      <h1>{salon.name}</h1>
      <p>Prenota in pochi secondi.</p>

      <label>Servizio</label>
      <select
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      >
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.duration_minutes} min)
          </option>
        ))}
      </select>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div>
          <label>Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div>
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
        <label>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Telefono</label>
        <input valu
