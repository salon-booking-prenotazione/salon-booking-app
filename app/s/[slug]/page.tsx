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

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
};

export default function BookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // ---------------- STATE ----------------
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotIso, setSlotIso] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [waLink, setWaLink] = useState<string | null>(null);
  const [icsLink, setIcsLink] = useState<string | null>(null);

  // ---------------- LOAD SALON ----------------
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
    })();
  }, [slug]);

  // ---------------- SERVICE ----------------
  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || null,
    [services, serviceId]
  );

  // ---------------- LOAD SLOTS ----------------
  useEffect(() => {
    (async () => {
      if (!salon || !serviceId || !date) return;

      const res = await fetch(
        `/api/available-times?salon_id=${salon.id}&service_id=${serviceId}&date=${date}`
      );
      const json = await res.json();
      setSlots(json.slots || []);
    })();
  }, [salon, serviceId, date]);

  // ---------------- SUBMIT ----------------
  async function submit() {
    if (!salon || !serviceId || !date || !slotIso || !name || !phone) {
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
        note: note || null,
        confirmation_channel: "calendar",
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setMsg(json?.error || "Errore prenotazione.");
      setLoading(false);
      return;
    }

    const when = new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(start);

    const manageUrl = `${window.location.origin}/manage/${json.manage_token}`;
    const ics = `${window.location.origin}/api/calendar/appointment?id=${json.appointment_id}`;

    const text =
      `Prenotazione confermata ✨\n` +
      `${salon.name}\n` +
      `Quando: ${when}\n\n` +
      `Gestisci o disdici:\n${manageUrl}\n\n` +
      `Salva nel calendario:\n${ics}`;

    setWaLink(`https://wa.me/?text=${encodeURIComponent(text)}`);
    setIcsLink(ics);
    setConfirmOpen(true);
    setLoading(false);
  }

  // ---------------- LOADING ----------------
  if (!salon) {
    return <div style={{ padding: 24 }}>{msg || "Caricamento..."}</div>;
  }

  // ---------------- UI ----------------
  return (
    <div style={{ minHeight: "100vh", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontWeight: 500 }}>{salon.name}</h1>
        <p style={{ opacity: 0.7 }}>
          {[salon.address, salon.city].filter(Boolean).join(", ")}
        </p>

        <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          <option value="">Servizio</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
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
          disabled={{ dayOfWeek: [1] }}
        />

        <select value={slotIso} onChange={(e) => setSlotIso(e.target.value)}>
          <option value="">Orario</option>
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
        <input placeholder="Email (opzionale)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />

        <button onClick={submit} disabled={loading}>
          {loading ? "Invio..." : "Conferma prenotazione"}
        </button>
      </div>

      {confirmOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "grid", placeItems: "center" }}>
          <div style={{ background: "white", padding: 24, borderRadius: 16 }}>
            <h3>Prenotazione confermata</h3>

            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer">
                🟢 Invia su WhatsApp
              </a>
            )}

            {icsLink && (
              <a href={icsLink} target="_blank" rel="noreferrer">
                📅 Salva nel calendario
              </a>
            )}

            <button onClick={() => setConfirmOpen(false)}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}
