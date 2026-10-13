/* Backups: download, share, combine tablets, Excel export, home-screen install. */
import { EVENT_NAME } from "../config.js";
import { loadDB, saveDB, loadSettings, saveSettings, markBackedUp, tabletCode } from "./storage.js";
import { buildCsv, mergeLeads } from "./leads.js";

export function backupFileName(now = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `MR-Rokesh-leads-backup-${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}.json`;
}

export function downloadFile(name, contents, type) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportCsv() {
  downloadFile(`MR-Rokesh-${EVENT_NAME.replace(/\s+/g, "-")}-Leads.csv`, buildCsv(loadDB().leads, tabletCode()), "text/csv;charset=utf-8");
  const settings = loadSettings();
  settings.lastExportAt = new Date().toISOString();
  saveSettings(settings);
  return "Excel file downloaded.";
}

export function exportJson() {
  downloadFile(backupFileName(), JSON.stringify(loadDB(), null, 2), "application/json");
  markBackedUp();
  return "Backup downloaded.";
}

/* Hands the backup file to WhatsApp, Drive, email, etc. Falls back to a download where sharing files is not supported. */
export async function shareBackup() {
  const file = new File([JSON.stringify(loadDB(), null, 2)], backupFileName(), { type: "application/json" });
  if (!(navigator.canShare && navigator.canShare({ files: [file] }))) return exportJson();
  try {
    await navigator.share({ files: [file], title: "MR Rokesh leads backup" });
    markBackedUp();
    return "Backup shared.";
  } catch (error) {
    return error && error.name === "AbortError" ? "" : "Could not share. Use Download backup file instead.";
  }
}

function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        const incoming = Array.isArray(parsed) ? parsed : parsed.leads;
        if (!Array.isArray(incoming)) throw new Error("bad");
        resolve(incoming);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/* Merges one or more backup files, for example one from every tablet. */
export async function importBackups(files) {
  const db = loadDB();
  const code = tabletCode();
  const total = { added: 0, updated: 0, unchanged: 0, skipped: 0 };
  let bad = 0;
  for (const file of files) {
    try {
      const result = mergeLeads(db, await readBackupFile(file), code);
      Object.keys(total).forEach((key) => { total[key] += result[key]; });
    } catch (error) {
      bad += 1;
    }
  }
  if (bad === files.length) return files.length === 1 ? "That file is not a lead backup." : "None of those files are lead backups.";
  try {
    saveDB(db);
  } catch (error) {
    return "This tablet could not store the leads. Export what you have first.";
  }
  return `Added ${total.added}, updated ${total.updated}, already up to date ${total.unchanged}${bad ? `, ${bad} file${bad === 1 ? "" : "s"} not readable` : ""}.`;
}

/* ---- Install to the home screen, and ask the browser not to clear this site's data ---- */
let installPrompt = null;
let persisted = null;
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());

export function subscribeInstall(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function installState() {
  return { canPrompt: !!installPrompt, installed: isInstalled(), persisted };
}

export function isInstalled() {
  return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
}

export async function installApp() {
  if (!installPrompt) return;
  installPrompt.prompt();
  try { await installPrompt.userChoice; } catch (error) { /* dismissed */ }
  installPrompt = null;
  emit();
}

export function watchInstall() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    emit();
  });
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persisted()
      .then((already) => already || navigator.storage.persist())
      .then((granted) => { persisted = !!granted; emit(); })
      .catch(() => { persisted = false; emit(); });
  }
}
