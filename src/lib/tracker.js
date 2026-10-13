/* Gift and offer tracker (staff only). Every visitor gets exactly one free pen.
   The other ticks are records of what the visitor did at the stall. */
export const TRACK_ITEMS = [
  { key: "instagram", label: "Followed us on Instagram / social" },
  { key: "playstore", label: "Installed our app from Google Play" },
  { key: "review", label: "Reviewed us on Google" },
  { key: "wheel", label: "Spun the wheel" },
  { key: "sticker", label: "Free sticker given" },
  { key: "form80", label: "80% OFF form offer approved" },
  { key: "vibeo", label: "Vibeo Connect ₹2,000 bonus noted" }
];

export const MAX_PENS = 1;

export function penOwed() {
  return MAX_PENS;
}

export function penGiven(tracker) {
  return Math.max(0, Math.min(MAX_PENS, Number((tracker || {}).pensGiven) || 0));
}

export function trackerTally(leads) {
  const tally = { leads: leads.length, owed: 0, given: 0 };
  TRACK_ITEMS.forEach((item) => { tally[item.key] = 0; });
  leads.forEach((lead) => {
    const t = lead.tracker || {};
    tally.owed += penOwed(t);
    tally.given += penGiven(t);
    TRACK_ITEMS.forEach((item) => { if (t[item.key]) tally[item.key] += 1; });
  });
  return tally;
}
