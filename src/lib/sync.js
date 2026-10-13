/* Cloud sync. Tablets always save locally first, then push to the server whenever it is reachable. */
import { loadDB, saveDB, loadSettings, saveSettings } from "./storage.js";
import { mergeLeads } from "./leads.js";
import { formatStamp } from "./format.js";

export const SYNC_BATCH = 100;
export const SYNC_EVERY_MS = 60 * 1000;
export const PULL_EVERY_MS = 10 * 60 * 1000;

let syncing = false;
let lastPullAt = 0;
let syncError = "";
const listeners = new Set();

export function getSyncError() {
  return syncError;
}
export function subscribeSync(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function setSyncError(message) {
  syncError = message;
  listeners.forEach((listener) => listener());
}

export async function syncRequest(settings, path, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(settings.serverUrl.replace(/\/+$/, "") + path, {
      ...init,
      headers: { "Content-Type": "application/json", "x-sync-key": settings.syncKey },
      signal: controller.signal,
      cache: "no-store"
    });
    if (response.status === 401) throw new Error("Wrong sync key.");
    if (response.status === 429) throw new Error("Too many wrong keys. Wait a minute.");
    if (!response.ok) throw new Error(`Server problem (${response.status}).`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError" || error instanceof TypeError) throw new Error("Server not reachable.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/* Pushes this tablet's leads when anything changed, and now and then pulls the other tablets' leads.
   Returns { ok, message } where message is only worth showing when the staff member tapped Sync. */
export async function syncNow(manual) {
  const settings = loadSettings();
  if (!settings.syncKey) return { ok: false, message: "Add the sync key in Tablet settings first." };
  if (syncing) return { ok: false, skipped: true, message: "A sync is already running." };
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { ok: false, message: "No internet. Leads are safe on this tablet and will sync later." };
  }
  syncing = true;
  try {
    const db = loadDB();
    const revAtStart = db.rev;
    if (manual || revAtStart > settings.syncedRev) {
      for (let i = 0; i < db.leads.length; i += SYNC_BATCH) {
        await syncRequest(settings, "/api/leads/sync", { method: "POST", body: JSON.stringify({ leads: db.leads.slice(i, i + SYNC_BATCH) }) });
      }
    }
    let pulled = null;
    if (manual || Date.now() - lastPullAt > PULL_EVERY_MS) {
      const data = await syncRequest(settings, "/api/leads", { method: "GET" });
      lastPullAt = Date.now();
      const fresh = loadDB();
      pulled = mergeLeads(fresh, Array.isArray(data.leads) ? data.leads : [], settings.tabletCode);
      if (pulled.added || pulled.updated) saveDB(fresh);
    }
    const after = loadSettings();
    after.syncedRev = Math.max(after.syncedRev, revAtStart);
    after.lastSyncAt = new Date().toISOString();
    saveSettings(after);
    setSyncError("");
    const got = pulled && (pulled.added || pulled.updated);
    return { ok: true, message: got ? `Synced. Got ${pulled.added} new and ${pulled.updated} updated from other tablets.` : "Synced. Everything is up to date." };
  } catch (error) {
    setSyncError(error.message);
    return { ok: false, message: `Sync failed: ${error.message} Leads are safe on this tablet.` };
  } finally {
    syncing = false;
  }
}

export function syncLine(db, settings, error) {
  if (!settings.syncKey) return "Cloud sync: not set up. Leads stay on this tablet only.";
  const waiting = Math.max(0, db.rev - settings.syncedRev);
  const plural = `${waiting} change${waiting === 1 ? "" : "s"}`;
  if (error) return `Cloud sync problem: ${error} ${plural} waiting.`;
  if (waiting) return `Cloud sync: ${plural} waiting to send.`;
  return settings.lastSyncAt ? `Cloud sync: ✓ up to date (${formatStamp(settings.lastSyncAt)}).` : "Cloud sync: set up. Waiting for the first sync.";
}

/* Saves the key and address, checks the connection, then does a full sync. */
export async function saveSyncSettings(syncKey, serverUrl) {
  const url = String(serverUrl || "").trim().replace(/\/+$/, "");
  if (url && !/^https?:\/\/[^\s]+$/i.test(url)) return { ok: false, message: "Server address must start with https:// (or leave it empty)." };
  const settings = loadSettings();
  settings.syncKey = String(syncKey || "").trim();
  settings.serverUrl = url;
  settings.syncedRev = 0;
  saveSettings(settings);
  setSyncError("");
  if (!settings.syncKey) return { ok: true, message: "Cloud sync turned off on this tablet." };
  try {
    const info = await syncRequest(loadSettings(), "/api/ping", { method: "GET" });
    const result = await syncNow(true);
    return { ok: result.ok, message: result.ok ? `Connected. ${info.leads} lead${info.leads === 1 ? "" : "s"} were on the server. ${result.message}` : result.message };
  } catch (error) {
    setSyncError(error.message);
    return { ok: false, message: `Saved, but could not connect: ${error.message}` };
  }
}
