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
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  city: string | null;
};

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
  const [channel, setChannel] = useState<"email" | "sms" | "both" | "calendar">(
    "email"
  );
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [manageLink, setManageLink] = useState<string | null>(null);

  // Load salon + services
  useEffect(() => {
    (async () => {
      setMsg("");
      setManageLink(null);

      const { data: salonData, error: sErr } = await supabase
        .from("salons")
        .select("id,name,slug,phone,address,city")
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
      setServiceId(""); // parte vuoto
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
      setManageLink(null);

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
    setManageLink(null);

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
          note: note || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setMsg(json?.error || "Errore durante la prenotazione.");
        return;
      }

      setMsg("✅ Prenotazione confermata!");

      if (json.manage_token) {
        const link = `${window.location.origin}/manage/${json.manage_token}`;
        setManageLink(link);
      } else {
        setManageLink(null);
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #faf7f5 100%)",
        padding: 24,
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 14, letterSpacing: 2, opacity: 0.7 }}>
            SALON BOOKING
          </div>
          <h1 style={{ fontSize: 34, margin: "6px 0 8px", fontWeight: 800 }}>
            {salon.name}
          </h1>

          {(salon.address || salon.city) && (
            <div style={{ opacity: 0.8 }}>
              {[salon.address, salon.city].filter(Boolean).join(", ")}
            </div>
          )}
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #eee",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>1) Servizio</div>
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setSlotIso("");
                  setSlots([]);
                  setManageLink(null);
                }}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid #ddd",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color .15s ease, box-shadow .15s ease",
                }}
              >
                <option value="">Seleziona un servizio</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>2) Data</div>
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 16,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <DayPicker
                  mode="single"
                  selected={date ? new Date(`${date}T12:00:00`) : undefined}
                  onSelect={(d) => {
                    if (!d) return;
                    const iso = `${d.getFullYear()}-${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    setDate(iso);
                    setSlotIso("");
                    setSlots([]);
                    setManageLink(null);
                  }}
                  weekStartsOn={1}
                  disabled={{ dayOfWeek: [1] }} // SOLO lunedì (come avevi tu)
                />
              </div>

              {date && (
                <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
                  Selezionato: <b>{date}</b>
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                3) Orario disponibile
              </div>

              {!serviceId && (
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Seleziona prima un servizio.
                </div>
              )}

              {serviceId && date && slots.length === 0 && (
                <div style={{ opacity: 0.8, fontSize: 14 }}>
                  Nessun orario disponibile per questa data.
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {slots.map((iso) => {
                  const d = new Date(iso);
                  const parts = new Intl.DateTimeFormat("it-IT", {
                    timeZone: "Europe/Rome",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }).formatToParts(d);

                  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
                  const mm =
                    parts.find((p) => p.type === "minute")?.value ?? "00";
                  const label = `${hh}:${mm}`;

                  const active = slotIso === iso;

                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setSlotIso(iso)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 999,
                        border: active ? "1px solid #111" : "1px solid #e5e5e5",
                        background: active ? "#111" : "#fff",
                        color: active ? "#fff" : "#111",
                        cursor: "pointer",
                        fontWeight: 650,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>4) Nome</div>
               <input
  value={name}
  onChange={(e) => setName(e.target.value)}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = "#111";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = "#ddd";
    e.currentTarget.style.boxShadow = "none";
  }}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s ease, box-shadow .15s ease",
  }}
/>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                  5) Telefono
                </div>
               <input
  value={name}
  onChange={(e) => setName(e.target.value)}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = "#111";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = "#ddd";
    e.currentTarget.style.boxShadow = "none";
  }}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s ease, box-shadow .15s ease",
  }}
/>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                  Conferma via
                </div>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid #ddd",
                    outline: "none",
                  }}
                >
                  <option value="email">Email (consigliato)</option>
                  <option value="sms">SMS</option>
                  <option value="both">Email + SMS</option>
                  <option value="calendar">Calendario (senza SMS / Email)</option>
                </select>
              </div>

              {(channel === "email" || channel === "both") && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Email</div>
                 <input
  value={name}
  onChange={(e) => setName(e.target.value)}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = "#111";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = "#ddd";
    e.currentTarget.style.boxShadow = "none";
  }}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s ease, box-shadow .15s ease",
  }}
/>
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                Note (opzionale)
              <input
  value={name}
  onChange={(e) => setName(e.target.value)}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = "#111";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(17,17,17,0.08)";
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = "#ddd";
    e.currentTarget.style.boxShadow = "none";
  }}
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s ease, box-shadow .15s ease",
  }}
/>
            </div>

            <button
              onClick={submit}
              disabled={loading || !slotIso}
              style={{
                marginTop: 6,
                width: "100%",
                padding: 14,
                borderRadius: 16,
                border: "1px solid #111",
                background: loading || !slotIso ? "#f2f2f2" : "#111",
                color: loading || !slotIso ? "#888" : "#fff",
                cursor: loading || !slotIso ? "not-allowed" : "pointer",
                fontWeight: 800,
                letterSpacing: 0.2,
              }}
            >
              {loading ? "Invio..." : "Conferma prenotazione"}
            </button>

            {msg && (
              <div
                style={{
                  marginTop: 10,
                  padding: 12,
                  borderRadius: 14,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 700 }}>{msg}</div>

                {manageLink && (
                  <div style={{ marginTop: 8, fontSize: 14 }}>
                    Gestisci o disdici:{" "}
                    <a
                      href={manageLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#111",
                        textDecoration: "underline",
                        fontWeight: 650,
                      }}
                    >
                      Apri gestione prenotazione
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            opacity: 0.65,
            textAlign: "center",
          }}
        >
          Prenotazione semplice • Conferma rapida • Gestione con link
        </div>
      </div>
    </div>
  );
}
