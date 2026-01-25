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

function fmtHHMM(iso: string) {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function fmtWhen(start: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(start);
}

export default function BookingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");

  const [date, setDate] = useState(""); // YYYY-MM-DD
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [waLink, setWaLink] = useState<string | null>(null);
  const [icsLink, setIcsLink] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || null,
    [services, serviceId]
  );

  // Load salon + services
  useEffect(() => {
    (async () => {
      setMsg("");
      setSalon(null);
      setServices([]);
      setServiceId("");
      setDate("");
      setSlots([]);
      setSlotIso("");
      setConfirmOpen(false);
      setWaLink(null);
      setIcsLink(null);

      const { data: salonData, error: salonErr } = await supabase
        .from("salons")
        .select("id,name,slug,phone,address,city")
        .eq("slug", slug)
        .single();

      if (salonErr || !salonData) {
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
      setServiceId(""); // ✅ parte vuoto
    })();
  }, [slug]);

  // Load slots when date/service changes
  useEffect(() => {
    (async () => {
      setSlots([]);
      setSlotIso("");
      setMsg("");

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
    setConfirmOpen(false);
    setWaLink(null);
    setIcsLink(null);

    if (!serviceId || !date || !name || !phone || !slotIso) {
      setMsg("Compila tutti i campi obbligatori.");
      return;
    }
    if (channel === "email" && !email) {
      setMsg("Se scegli Email, l’email è obbligatoria.");
      return;
    }

    const start = new Date(slotIso);
    const duration = selectedService?.duration_minutes ?? 30;
    const end = new Date(start.getTime() + duration * 60000);

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

      if (!res.ok || !json.manage_token) {
        setMsg(json?.error || "Errore prenotazione.");
        return;
      }

      const manageUrl = `${window.location.origin}/manage/${json.manage_token}`;

      const ics =
        json.appointment_id
          ? `${window.location.origin}/api/calendar/appointment?id=${json.appointment_id}`
          : null;

      setIcsLink(ics);

      const salonLine = [
        salon.name ?? "Salon",
        [salon.address, salon.city].filter(Boolean).join(", "),
      ]
        .filter(Boolean)
        .join(" — ");

      const text =
        `Prenotazione confermata ✅\n` +
        `${salonLine}\n` +
        `Quando: ${fmtWhen(start)}\n\n` +
        `Gestisci/Disdici:\n${manageUrl}\n` +
        (ics ? `\nSalva nel calendario:\n${ics}\n` : "");

      setWaLink(`https://wa.me/?text=${encodeURIComponent(text)}`);
      setConfirmOpen(true);
    } finally {
      setLoading(false);
    }
  }

  if (!salon) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        {msg || "Caricamento..."}
      </div>
    );
  }

  // ---------------- STILI ----------------
  const bg: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    fontFamily: "system-ui",
    background:
      "radial-gradient(1200px 600px at 10% 0%, rgba(248,240,236,1) 0%, rgba(255,255,255,1) 60%), radial-gradient(900px 500px at 90% 10%, rgba(240,246,248,1) 0%, rgba(255,255,255,1) 55%)",
  };

  const card: React.CSSProperties = {
    width: "min(540px, 100%)",
    margin: "0 auto",
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 26,
    padding: 22,
    boxShadow: "0 18px 55px rgba(0,0,0,0.08)",
    backdropFilter: "blur(10px)",
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: 8,
  };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    boxSizing: "border-box",
    outline: "none",
  };

  const selectStyle: React.CSSProperties = {
    ...input,
    appearance: "none",
  };

  const primaryBtn: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(17,17,17,0.9)",
    background: loading ? "#f1f1f1" : "rgba(17,17,17,0.92)",
    color: loading ? "#777" : "white",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: 600,
    letterSpacing: 0.2,
    boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
  };

  const chip: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 550,
  };

  const chipActive: React.CSSProperties = {
    ...chip,
    background: "rgba(17,17,17,0.92)",
    color: "white",
    border: "1px solid rgba(17,17,17,0.92)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
  };

  return (
    <div style={bg}>
      <div style={{ width: "min(820px, 100%)", margin: "0 auto" }}>
        {/* Header soft */}
        <div style={{ textAlign: "center", margin: "18px 0 18px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.70)",
              backdropFilter: "blur(8px)",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            ✨ Prenotazione
          </div>

          <h1
            style={{
              fontSize: 38,
              lineHeight: 1.06,
              margin: "12px 0 8px",
              fontWeight: 650,
              letterSpacing: -0.5,
            }}
          >
            {salon.name || "Salone"}
          </h1>

          <div style={{ opacity: 0.72 }}>
            {[salon.address, salon.city].filter(Boolean).join(", ")}
          </div>

          <p style={{ marginTop: 10, opacity: 0.74, fontWeight: 400 }}>
            Prenotare dev’essere semplice. E bello.
          </p>
        </div>

        {/* Card */}
        <div style={card}>
          <div style={{ display: "grid", gap: 16 }}>
            {/* Service */}
            <div>
              <div style={label}>Servizio</div>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={selectStyle}
              >
                <option value="">Seleziona un servizio</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <div style={label}>Data</div>
              <div
                style={{
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 18,
                  padding: 12,
                  background: "rgba(255,255,255,0.92)",
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
                  }}
                  weekStartsOn={1}
                  disabled={{ dayOfWeek: [1] }} // ✅ lunedì chiuso
                />
              </div>
            </div>

            {/* Time chips */}
            <div>
              <div style={label}>Orario</div>

              {!serviceId ? (
                <div style={{ opacity: 0.6, fontSize: 14 }}>
                  Seleziona prima un servizio.
                </div>
              ) : !date ? (
                <div style={{ opacity: 0.6, fontSize: 14 }}>
                  Scegli una data per vedere gli orari.
                </div>
              ) : slots.length === 0 ? (
                <div style={{ opacity: 0.6, fontSize: 14 }}>
                  Nessun orario disponibile.
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      maxHeight: 130,
                      overflowY: "auto",
                      paddingRight: 6,
                    }}
                  >
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlotIso(s)}
                        style={slotIso === s ? chipActive : chip}
                      >
                        {fmtHHMM(s)}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
                    {slots.length} orari disponibili
                  </div>
                </>
              )}
            </div>

            {/* Name + Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={label}>Nome</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Il tuo nome"
                  style={input}
                />
              </div>

              <div>
                <div style={label}>Telefono</div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Numero di telefono"
                  style={input}
                />
              </div>
            </div>

            <div>
              <div style={label}>Conferma via</div>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                style={selectStyle}
              >
                <option value="email">Email (consigliato)</option>
                <option value="sms">SMS</option>
                <option value="both">Email + SMS</option>
                <option value="calendar">Calendario (senza SMS / Email)</option>
              </select>
            </div>

            {(channel === "email" || channel === "both") && (
              <div>
                <div style={label}>Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  style={input}
                />
              </div>
            )}

            <div>
              <div style={label}>Note (opzionale)</div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Richieste particolari, preferenze..."
                rows={3}
                style={input}
              />
            </div>

            <button onClick={submit} disabled={loading} style={primaryBtn}>
              {loading ? "Invio..." : "Conferma prenotazione"}
            </button>

            {msg && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.88)",
                  opacity: 0.9,
                }}
              >
                {msg}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            fontSize: 12,
            opacity: 0.55,
          }}
        >
          Un momento per te ✨
        </div>
      </div>

      {/* Modale conferma */}
      {confirmOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            padding: 18,
            zIndex: 50,
          }}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(560px, 100%)",
              background: "rgba(255,255,255,0.94)",
              borderRadius: 26,
              border: "1px solid rgba(0,0,0,0.10)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 22, textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  margin: "0 auto 12px",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(22,163,74,0.12)",
                  border: "1px solid rgba(22,163,74,0.22)",
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 800, color: "rgb(22,163,74)" }}>
                  ✓
                </div>
              </div>

              <div style={{ fontSize: 18, fontWeight: 650, letterSpacing: -0.2 }}>
                Prenotazione confermata
              </div>

              <div style={{ marginTop: 6, fontSize: 14, opacity: 0.72 }}>
                Invia il riepilogo su WhatsApp o salva nel calendario.
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: 16,
                }}
              >
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "12px 18px",
                      borderRadius: 999,
                      border: "1px solid rgba(37,211,102,0.25)",
                      background: "#25D366",
                      color: "white",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                    }}
                  >
                    🟢 Invia su WhatsApp
                  </a>
                )}

                {icsLink && (
                  <a
                    href={icsLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "12px 18px",
                      borderRadius: 999,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "white",
                      color: "#111",
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    📅 Salva nel calendario
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
