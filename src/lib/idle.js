import { VISITOR_WARN_MS, VISITOR_RESET_MS, TICKET_WARN_MS, TICKET_RESET_MS, STAFF_LOCK_MS } from "../config.js";

/* How long each screen may sit untouched. The home screen holds nothing private, so it never times out. */
export function idlePlan(view) {
  if (view === "form") return { warn: VISITOR_WARN_MS, reset: VISITOR_RESET_MS };
  if (view === "success") return { warn: TICKET_WARN_MS, reset: TICKET_RESET_MS };
  if (view === "pin" || view === "leads" || view === "lead") return { warn: 0, reset: STAFF_LOCK_MS };
  return null;
}
