export function normalizeMobile(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return digits;
}

export function prettyMobile(value) {
  const digits = normalizeMobile(value);
  return digits.length === 10 ? digits.replace(/(\d{5})(\d{5})/, "$1 $2") : digits;
}

export function formatStamp(iso) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(iso));
}

export function uid() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
}
