type WhatsAppBookingPayload = {
  salonName: string;
  salonSlug: string;

  whatsappPhoneE164: string; // es: "+393331112233"
  serviceName?: string;
  startLocalText: string;    // es: "Mar 30 Gen 15:30"
  durationMin?: number;

  customerName?: string;
  customerPhone?: string;

  bookingCode?: string;      
  manageUrl?: string;        

  alternativeSlots?: string[];
};
export function buildWhatsAppBookingLink(p: WhatsAppBookingPayload) {
  const phoneDigits = p.whatsappPhoneE164.replace(/[^\d]/g, "");

  const lines: string[] = [];

  lines.push(`Ciao! Vorrei prenotare da *${p.salonName}*`);
  if (p.serviceName) {
    lines.push(`💇 Servizio: *${p.serviceName}*`);
  }

  lines.push(
    `📅 Quando: *${p.startLocalText}*${p.durationMin ? ` (${p.durationMin} min)` : ""}`
  );

  if (p.customerName || p.customerPhone) {
    const who = [p.customerName, p.customerPhone].filter(Boolean).join(" – ");
    lines.push(`👤 Cliente: ${who}`);
  }

  if (p.bookingCode) {
    lines.push(`🔖 Cod: *${p.bookingCode}*`);
  }

  if (p.alternativeSlots?.length) {
    lines.push(
      `Se questo orario non va bene, alternative: ${p.alternativeSlots.join(" / ")}`
    );
  }

  if (p.manageUrl) {
    lines.push(`🔁 Gestisci: ${p.manageUrl}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phoneDigits}?text=${text}`;
}
