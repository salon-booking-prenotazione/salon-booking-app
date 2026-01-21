const start = new Date("2026-02-10T14:00:00+01:00");
const end = new Date("2026-02-10T15:00:00+01:00");

await supabase.from("appointments").insert({
  salon_id,
  service_id,
  start_time: start,
  end_time: end,
  time_range: `[${start.toISOString()},${end.toISOString()})`,
  contact_phone: "+39333...",
  source: "manual",
  status: "confirmed",
});
