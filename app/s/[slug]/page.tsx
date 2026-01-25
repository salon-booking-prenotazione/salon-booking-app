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

  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [slots, setSlots] = useState<string[]>([]);
  const [slotIso, setSlotIso] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [channel, setChannel] = useState<"email" | "sms" | "both" | "calendar">(
    "email"
  );

  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [manageLink, setManageLink] = useState<string | null>(null);
  const [waLink, setWaLink] = useState<string | null>(null);
  const [icsLink, setIcsLink] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      setManageLink(null);
      setWaLink(null);
      setIcsLink(null);
      setConfirmOpen(false);

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

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || null,
    [services, serviceId]
  );

  // Load slots
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
    setManageLink(null);
    setWaLink(null);
    setIcsLink(null);
    setConfirmOpen(false);

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

      setMsg("✅ Prenotazione confermata!");

      const link = `${window.location.origin}/manage/${json.manage_token}`;
      setManageLink(link);

      const ics = json.appointment_id
        ? `${window.location.origin}/api/calendar/appointment?id=${json.appointment_id}`
        : null;

      setIcsLink(ics);

      const when = new Intl.DateTimeFormat("it-IT", {
        timeZone: "Europe/Rome",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(start);

      const salonLine = [
        salon.name ?? "Salon",
        [salon.address, salon.city].filter(Boolean).join(", "),
      ]
        .filter(Boolean)
        .join(" — ");

      const text =
        `Prenotazione confermata ✅\n` +
        `${salonLine}\n` +
        `Quando: ${when}\n\n` +
        `Gestisci o disdici:\n${link}\n` +
        (ics ? `\nSalva nel calendario:\n${ics}\n` : "");

      setWaLink(`https://wa.me/?text=${encodeURIComponent(text)}`);

      // ✅ apri modale subito
      setConfirmOpen(true);
    } finally {
      setLoading(false);
    }
  
  if (!salon) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        {msg || "Caricamento..."}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background:
          "radial-gradient(1200px 600px at 10% 0%, rgba(248,240,236,1) 0%, rgba(255,255,255,1) 60%), radial-gradient(900px 500px at 90% 10%, rgba(240,246,248,1) 0%, rgba(255,255,255,1) 55%)",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(6px)",
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
              lineHeight: 1.05,
              margin: "12px 0 8px",
              fontWeight: 700,
              letterSpacing: -0.4,
            }}
          >
            {salon.name}
          </h1>

          <div style={{ opacity: 0.8 }}>
            {[salon.address, salon.city].filter(Boolean).join(", ")}
          </div>

          <p style={{ marginTop: 10, opacity: 0.8 }}>
            Scegli il servizio, la data e il tuo orario. Un momento tutto per te.
          </p>
        </div>

        {/* Main card */}
        <div
          style={{
            background: "rgba(255,255,255,0.78)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 22,
            padding: 24,
            boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            {/* Service */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Servizio</div>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.9)",
                  boxSizing: "border-box",
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

            {/* Date */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Data</div>
              <div
                style={{
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 16,
                  padding: 12,
                  background: "rgba(255,255,255,0.9)",
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
                  disabled={{ dayOfWeek: [1] }} // ✅ lunedì non prenotabile
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Orario</div>
              <select
                value={slotIso}
                onChange={(e) => setSlotIso(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.9)",
                  boxSizing: "border-box",
                }}
                disabled={!date || !serviceId || slots.length === 0}
              >
                <option value="">
                  {slots.length ? "Seleziona un orario" : "Nessun orario disponibile"}
                </option>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {new Intl.DateTimeFormat("it-IT", {
                      timeZone: "Europe/Rome",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).format(new Date(s))}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Nome</div>
                <input
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.9)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Telefono</div>
                <input
                  placeholder="Telefono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.9)",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Conferma via</div>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.9)",
                  boxSizing: "border-box",
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
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.9)",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Note (opzionale)</div>
              <textarea
                placeholder="Richieste particolari, preferenze, allergie…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.9)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 16,
                border: "1px solid rgba(17,17,17,0.9)",
                background: loading ? "#f2f2f2" : "rgba(17,17,17,0.92)",
                color: loading ? "#777" : "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
                letterSpacing: 0.2,
                boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
              }}
            >
              {loading ? "Invio..." : "Conferma prenotazione"}
            </button>

            {msg && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.85)",
                }}
              >
                <div style={{ fontWeight: 600 }}>{msg}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 12, opacity: 0.65 }}>
          Prenotazione semplice • Conferma rapida • Un momento per te ✨
        </div>
      </div>

      {/* ✅ Modale conferma */}
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
              width: "min(720px, 100%)",
              background: "rgba(255,255,255,0.92)",
              borderRadius: 26,
              border: "1px solid rgba(0,0,0,0.10)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.20)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 22, textAlign: "center" }}>
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 999,
                  margin: "0 auto 12px",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(22,163,74,0.12)",
                  border: "1px solid rgba(22,163,74,0.22)",
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: "rgb(22,163,74)" }}>
                  ✓
                </div>
              </div>

              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.2 }}>
                Prenotazione confermata
              </div>

              <div style={{ marginTop: 6, fontSize: 14, opacity: 0.75 }}>
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
</div>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  style={{
                    padding: "12px 16px",
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
