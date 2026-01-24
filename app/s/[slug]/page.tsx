"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Salon = {
  id: string;
  name: string | null;
  slug: string;
  phone: string | null;
  address?: string | null;
  city?: string | null;
};

type Service = { id: string; name: string; duration_minutes: number };

export default function BookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotIso, setSlotIso] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<
    "email" | "sms" | "both" | "calendar"
  >("email");

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [manageLink, setManageLink] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: salonData } = await supabase
        .from("salons")
        .select("id,name,slug,phone,address,city")
        .eq("slug", slug)
        .single();

      if (!salonData) {
        setMsg("Salone non trovato.");
        return;
      }

      setSalon(salonData);

      const { data: svc } = await supabase
        .from("services")
        .select("id,name,duration_minutes")
        .eq("salon_id", salonData.id)
        .order("name");

      setServices(svc || []);
      setServiceId("");
    })();
  }, [slug]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || null,
    [services, serviceId]
  );

  useEffect(() => {
    (async () => {
      setSlots([]);
      setSlotIso("");

      if (!salon || !serviceId || !date) return;

      const res = await fetch(
        `/api/available-times?salon_id=${salon.id}&service_id=${serviceId}&date=${date}`
      );

      const json = await res.json();
      if (res.ok) setSlots(json.slots || []);
    })();
  }, [salon, serviceId, date]);

  async function submit() {
    if (!salon || !serviceId || !date || !name || !phone || !slotIso) {
      setMsg("Compila tutti i campi obbligatori.");
      return;
    }

    setLoading(true);

    const start = new Date(slotIso);
    const end = new Date(
      start.getTime() + (selectedService?.duration_minutes ?? 30) * 60000
    );

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
        note: note || null,
      }),
    });

    const json = await res.json();
    if (res.ok && json.manage_token) {
      setMsg("✅ Prenotazione confermata!");
      setManageLink(`${window.location.origin}/manage/${json.manage_token}`);
    } else {
      setMsg(json?.error || "Errore prenotazione.");
    }

    setLoading(false);
  }

  if (!salon) {
    return <div style={{ padding: 24 }}>{msg || "Caricamento..."}</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1>{salon.name}</h1>
      <p>
        {[salon.address, salon.city].filter(Boolean).join(", ")}
      </p>

      <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
        <option value="">Seleziona un servizio</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.duration_minutes} min)
          </option>
        ))}
      </select>

      <DayPicker
        mode="single"
        selected={date ? new Date(`${date}T12:00:00`) : undefined}
        onSelect={(d) =>
          d &&
          setDate(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(d.getDate()).padStart(2, "0")}`
          )
        }
        weekStartsOn={1}
      />

      <select value={slotIso} onChange={(e) => setSlotIso(e.target.value)}>
        <option value="">Seleziona orario</option>
        {slots.map((s) => (
          <option key={s} value={s}>
            {new Date(s).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </option>
        ))}
      </select>

      <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Telefono" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />

      <button onClick={submit} disabled={loading}>
        Conferma prenotazione
      </button>

      {msg && <p>{msg}</p>}
      {manageLink && <a href={manageLink}>Gestisci prenotazione</a>}
    </div>
  );
}
