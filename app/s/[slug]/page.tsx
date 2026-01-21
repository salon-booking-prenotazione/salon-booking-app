"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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

  const [date, setDate] = useState<string>(""); // YYYY-MM-DD
  const [slots, setSlots] = useState<string[]>([]);
  const [slotIso, setSlotIso] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<"email" | "sms" | "both" | "calendar">("email");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  // Load salon + services
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

  // Load slots when date/service changes
  useEffect(() => {
    (async () => {
      setSlots([]);
      setSlotIso("");

      if (!salon || !serviceId || !date) return;

      const res = await fetch(
        `/api/available-times?salon_id=${salon.id}&service_id=${serviceId}&date=${date}`
      );
      const json = await res.json();
      if (!res.ok) {
        setMsg(json?.error || "Errore caricamento orari.");
        return;
      }
      setSlots(json.slots || []);
    })();
  }, [salon, serviceId, date]);

  async function submit() {
    if (!salon) return;
    setMsg("");

    if (!serviceId || !date || !name || !phone) {
      setMsg("Compila tutti i campi obbligatori.");
      return;
    }
    if (channel === "email" && !email) {
      setMsg("Se scegli Email, l’email è obbligatoria.");
      return;
    }
    if (!slotIso) {
      setMsg("Seleziona un orario disponibile.");
      return;
    }

    const start = new Date(slotIso);
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

      if (json.manage_token) {
        const manageLink = `${window.location.origin}/manage/${json.manage_token}`;
        setMsg(`✅ Prenotazione confermata!\nLink gestione/disdetta:\n${manageLink}`);
      } else {
        setMsg("✅ Prenotazione confermata!");
      }
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

      <div style={{ marginTop: 12 }}>
  <label>Data</label>

<DayPicker
  mode="single"
  selected={date ? new Date(`${date}T12:00:00`) : undefined}
  onSelect={(d) => {
    if (!d) return;
   const iso =
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
setDate(iso);
setSlotIso("");
setSlots([]);

  }}
  weekStartsOn={1}
  disabled={{ dayOfWeek: [1] }} // SOLO lunedì
  modifiersClassNames={{
    disabled: "rdp-day_disabled_custom",
  }}
/>

  {date && (
    <div style={{ marginTop: 8, fontSize: 14 }}>
      Selezionato: <b>{date}</b>
    </div>
  )}
</div>

      <div style={{ marginTop: 12 }}>
        <label>Orario disponibile</label>
        <select
          value={slotIso}
          onChange={(e) => setSlotIso(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          disabled={!date || slots.length === 0}
        >
          <option value="">
            {slots.length ? "Seleziona un orario" : "Nessun orario disponibile"}
          </option>

{slots.map((iso) => {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";

  return (
    <option key={iso} value={iso}>
      {hh}:{mm}
    </option>
  );
})}

        </select>
      </div>

      {date && serviceId && slots.length === 0 && (
        <p style={{ marginTop: 8 }}>Nessun orario disponibile per questa data.</p>
      )}

      <div style={{ marginTop: 12 }}>
        <label>Nome</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Telefono</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Conferma via</label>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value as any)}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="email">Email (consigliato)</option>
          <option value="sms">SMS</option>
          <option value="both">Email + SMS</option>
        </select>
      </div>

      {(channel === "email" || channel === "both") && (
        <div style={{ marginTop: 12 }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
      )}

      <button
        onClick={submit}
        disabled={loading || !slotIso}
        style={{ marginTop: 16, width: "100%", padding: 12, cursor: "pointer" }}
      >
        {loading ? "Invio..." : "Conferma prenotazione"}
      </button>

      {msg && <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{msg}</pre>}
    </div>
  );
}
