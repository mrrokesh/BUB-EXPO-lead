/* Everything saved on the tablet: leads, settings, drafts and the staff session. */
import { DB_KEY, SETTINGS_KEY, LANG_KEY, DEFAULT_PIN, DEFAULT_PHONE } from "../config.js";
import { LANGS } from "../i18n.js";
import { normalizeMobile } from "./format.js";

/* Screens re-read storage when this number changes. */
let version = 0;
const listeners = new Set();
export function subscribeData(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function dataVersion() {
  return version;
}
function notify() {
  version += 1;
  listeners.forEach((listener) => listener());
}

/* ---- Leads ---- */
export function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !Array.isArray(parsed.leads)) return { seq: 0, rev: 0, leads: [], deleted: [] };
    return {
      seq: Number(parsed.seq) || 0,
      rev: Number(parsed.rev) || 0,
      leads: parsed.leads,
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : []
    };
  } catch (error) {
    return { seq: 0, rev: 0, leads: [], deleted: [] };
  }
}

/* rev counts every write, so the app can tell how many changes a backup or the server does not have yet. */
export function saveDB(db) {
  db.rev = (Number(db.rev) || 0) + 1;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  notify();
}

/* ---- Tablet code: lead numbers read K7-012 and never clash when tablets are combined ---- */
const TABLET_CODE_PATTERN = /^[A-Z0-9]{1,3}$/;
const CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_DIGITS = "23456789";

export function randomTabletCode() {
  const pick = (chars) => chars[Math.floor(Math.random() * chars.length)];
  return pick(CODE_LETTERS) + pick(CODE_DIGITS);
}

export function normalizeTabletCode(value) {
  const code = String(value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return TABLET_CODE_PATTERN.test(code) ? code : "";
}

/* ---- Settings ---- */
export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  notify();
}

export function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    const settings = {
      pin: parsed.pin || DEFAULT_PIN,
      teamWhatsapp: parsed.teamWhatsapp || DEFAULT_PHONE,
      lastExportAt: parsed.lastExportAt || "",
      lastBackupAt: parsed.lastBackupAt || "",
      backupRev: Number(parsed.backupRev) || 0,
      tabletCode: normalizeTabletCode(parsed.tabletCode),
      syncKey: String(parsed.syncKey || ""),
      serverUrl: String(parsed.serverUrl || ""),
      syncedRev: Number(parsed.syncedRev) || 0,
      lastSyncAt: parsed.lastSyncAt || ""
    };
    if (!settings.tabletCode) {
      settings.tabletCode = randomTabletCode();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
    return settings;
  } catch (error) {
    return { pin: DEFAULT_PIN, teamWhatsapp: DEFAULT_PHONE, lastExportAt: "", lastBackupAt: "", backupRev: 0, tabletCode: "A1", syncKey: "", serverUrl: "", syncedRev: 0, lastSyncAt: "" };
  }
}

export function tabletCode() {
  return loadSettings().tabletCode;
}

export function pendingChanges() {
  return Math.max(0, loadDB().rev - loadSettings().backupRev);
}

export function markBackedUp() {
  const settings = loadSettings();
  settings.lastBackupAt = new Date().toISOString();
  settings.backupRev = loadDB().rev;
  saveSettings(settings);
}

export function teamNumber() {
  const digits = normalizeMobile(loadSettings().teamWhatsapp);
  return digits.length === 10 ? "91" + digits : "91" + DEFAULT_PHONE;
}

/* ---- Language ---- */
export function loadLang() {
  try {
    const value = localStorage.getItem(LANG_KEY);
    return LANGS.some((item) => item.id === value) ? value : "both";
  } catch (error) {
    return "both";
  }
}

export function saveLang(value) {
  try { localStorage.setItem(LANG_KEY, value); } catch (error) { /* language is a convenience */ }
}

/* ---- Drafts and the staff session live only for the browser session ---- */
export function saveDraft(formId, draft) {
  if (typeof sessionStorage === "undefined" || !formId) return;
  try { sessionStorage.setItem("draft:" + formId, JSON.stringify(draft)); } catch (error) { /* a draft is a convenience */ }
}

export function loadDraft(formId) {
  if (typeof sessionStorage === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem("draft:" + formId) || "null"); } catch (error) { return null; }
}

export function clearDraft(formId) {
  if (typeof sessionStorage === "undefined") return;
  try { sessionStorage.removeItem("draft:" + formId); } catch (error) { /* ignore */ }
}

export function staffOpen() {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem("staffOk") === "1";
}

export function setStaffOpen(open) {
  try {
    if (open) sessionStorage.setItem("staffOk", "1");
    else sessionStorage.removeItem("staffOk");
  } catch (error) { /* ignore */ }
}

/* ---- Change one lead's gift tracker (staff only) ---- */
export function updateTracker(id, change) {
  const db = loadDB();
  const lead = db.leads.find((item) => item.id === id);
  if (!lead) return false;
  lead.tracker = { ...(lead.tracker || {}) };
  change(lead.tracker);
  lead.updatedAt = new Date().toISOString();
  saveDB(db);
  return true;
}
