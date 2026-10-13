import { useState } from "react";
import { BACKUP_NUDGE, DEFAULT_PIN } from "../config.js";
import { FORMS } from "../data/forms.js";
import { exportCsv, exportJson, importBackups, installApp, shareBackup } from "../lib/backup.js";
import { formatStamp, normalizeMobile, prettyMobile } from "../lib/format.js";
import { leadLabel } from "../lib/leads.js";
import { loadDB, loadSettings, normalizeTabletCode, saveDB, saveSettings } from "../lib/storage.js";
import { saveSyncSettings, syncLine, syncNow } from "../lib/sync.js";
import { penGiven, penOwed } from "../lib/tracker.js";
import { useApp } from "../store.jsx";
import { useDb, useInstall, useSettings, useSyncError } from "../hooks/useData.js";
import { Shell, TopBar } from "./Layout.jsx";
import { TallyCard } from "./TrackerPanel.jsx";
import { Banner, Btn, LinkButton, cx, inputClass } from "./ui.jsx";

const BADGE = { software: "bg-brand", website: "bg-orange", automate: "bg-[#16306e]" };
const FILTERS = ["all", "software", "website", "automate"];

export function LeadsPage() {
  const { openLead, resetForNextVisitor, toast } = useApp();
  const db = useDb();
  const settings = useSettings();
  const syncError = useSyncError();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const pending = Math.max(0, db.rev - settings.backupRev);
  const q = query.trim().toLowerCase();
  const leads = db.leads
    .filter((lead) => {
      if (filter !== "all" && lead.formId !== filter) return false;
      if (!q) return true;
      const blob = `${leadLabel(lead, settings.tabletCode)} ${lead.answers.name} ${lead.answers.business} ${lead.mobile} ${lead.summary}`.toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const say = (message) => message && toast(message);
  const share = async () => say(await shareBackup());
  const sync = async () => say((await syncNow(true)).message);

  const clearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    const before = loadDB();
    saveDB({ seq: before.seq, rev: before.rev, leads: [], deleted: before.deleted.concat(before.leads.map((lead) => lead.id)) });
    setConfirmClear(false);
    toast("All leads deleted on this tablet. Copies already sent to the server stay there.");
  };

  return (
    <Shell wide>
      <TopBar showLang={false} />
      <main className="px-4 pt-1.5 pb-8">
        <h1 className="mt-3.5 mb-1 text-[34px] leading-[1.05] font-bold tracking-[-0.04em]">Leads</h1>
        {settings.pin === DEFAULT_PIN && <Banner>The default staff PIN is still in use. Open Tablet settings below and change it.</Banner>}
        {pending >= BACKUP_NUDGE && (
          <Banner>{pending} changes are not backed up yet. <LinkButton onClick={share}>Share a backup now</LinkButton></Banner>
        )}
        <p className="mb-3.5 text-[15px] leading-[1.45] text-muted">
          {db.leads.length} saved on this tablet (code {settings.tabletCode}).{" "}
          {settings.lastExportAt ? `Last Excel export ${formatStamp(settings.lastExportAt)}.` : "No Excel export yet."}
          <br />
          {settings.lastBackupAt
            ? `Last backup ${formatStamp(settings.lastBackupAt)}${pending ? ` · ${pending} change${pending === 1 ? "" : "s"} since` : " · up to date"}.`
            : "Never backed up. Share a backup to WhatsApp or Drive."}
        </p>
        <p className="mb-3.5 text-[15px] leading-[1.45] text-muted">{syncLine(db, settings, syncError)}</p>

        {db.leads.length > 0 && <TallyCard leads={db.leads} />}

        <input
          className={inputClass}
          type="search"
          placeholder="Search name, shop, mobile or lead number"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="mt-2.5 flex gap-1.5 overflow-auto pb-2">
          {FILTERS.map((id) => {
            const label = id === "all" ? `All ${db.leads.length}` : `${FORMS[id].short} ${db.leads.filter((lead) => lead.formId === id).length}`;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={cx("rounded-full border-[1.5px] px-3 py-2 text-[13px] font-extrabold whitespace-nowrap", filter === id ? "border-navy bg-navy text-white" : "border-line bg-white text-ink")}
              >
                {label}
              </button>
            );
          })}
        </div>

        {leads.length === 0 && <div className="rounded-[18px] bg-white px-4 py-[22px] text-center text-muted">No leads on this filter yet.</div>}
        {leads.map((lead) => (
          <button key={lead.id} type="button" onClick={() => openLead(lead.id)} className="mb-2 grid w-full gap-0.5 rounded-[18px] border-0 bg-white px-3.5 py-3 text-left shadow-card">
            <b className="text-base">{leadLabel(lead, settings.tabletCode)} {lead.answers.name}</b>
            <span className="text-[13px] text-muted">
              <span className={cx("mr-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white", BADGE[lead.formId])}>{FORMS[lead.formId].short}</span>
              {penGiven(lead.tracker) < penOwed(lead.tracker) && (
                <span className="mr-1.5 inline-block rounded-full bg-[#fde8e8] px-2 py-0.5 text-[11px] font-extrabold text-danger">Pen due</span>
              )}
              {lead.answers.business}
            </span>
            <span className="text-[13px] text-muted">{prettyMobile(lead.mobile)} · {formatStamp(lead.createdAt)}</span>
          </button>
        ))}

        <div className="my-3 grid grid-cols-2 gap-2">
          <Btn onClick={() => say(exportCsv())}>Export Excel</Btn>
          <Btn onClick={sync}>Sync now</Btn>
          <Btn onClick={share}>Share backup (WhatsApp / Drive)</Btn>
          <Btn variant="line" onClick={() => say(exportJson())}>Download backup file</Btn>
          <Btn variant="line" onClick={resetForNextVisitor}>Lock leads</Btn>
        </div>
        <Btn variant="danger" onClick={clearAll}>{confirmClear ? "Tap again to delete all" : "Delete all leads"}</Btn>

        <SettingsPanel settings={settings} toast={toast} />
      </main>
    </Shell>
  );
}

function SettingsPanel({ settings, toast }) {
  const install = useInstall();
  const [code, setCode] = useState(settings.tabletCode);
  const [wa, setWa] = useState(settings.teamWhatsapp);
  const [pin, setPin] = useState("");
  const [syncKey, setSyncKey] = useState(settings.syncKey);
  const [serverUrl, setServerUrl] = useState(settings.serverUrl);

  const update = (change) => {
    const next = loadSettings();
    change(next);
    saveSettings(next);
  };

  const saveCode = () => {
    const normalized = normalizeTabletCode(code);
    if (!normalized) return toast("Use 1 to 3 letters or digits, like A or K7.");
    update((s) => { s.tabletCode = normalized; });
    setCode(normalized);
    toast(`Tablet code saved: ${normalized}. New leads will be ${normalized}-001 onwards.`);
  };
  const saveWa = () => {
    const digits = normalizeMobile(wa);
    if (!/^[6-9]\d{9}$/.test(digits)) return toast("Enter a 10-digit WhatsApp number.");
    update((s) => { s.teamWhatsapp = digits; });
    toast("WhatsApp number saved.");
  };
  const savePin = () => {
    if (!/^\d{4}$/.test(pin.trim())) return toast("PIN must be 4 digits.");
    update((s) => { s.pin = pin.trim(); });
    setPin("");
    toast("PIN changed.");
  };
  const saveSync = async () => toast((await saveSyncSettings(syncKey, serverUrl)).message);

  const labelClass = "mb-0.5 block text-[17px] font-extrabold tracking-tight";
  const hintClass = "mb-2 block text-[13px] leading-[1.35] text-muted";
  const helpClass = "text-sm leading-normal text-muted";

  return (
    <details className="mt-3 rounded-2xl bg-white px-3 pt-2 pb-3">
      <summary className="cursor-pointer py-2 font-extrabold">Tablet settings</summary>
      <p className={helpClass}>
        1. Pick the form that matches the chat.<br />2. The visitor taps. You can tap for them.<br />3. Save, note the lead number, and give the pen.<br />4. Share a backup every few hours, and Export Excel at day end.
      </p>

      <div className="my-3 rounded-2xl bg-[#f3f6ff] p-3">
        <p className={labelClass}>Home-screen app</p>
        {install.installed ? (
          <p className={helpClass}>✓ Installed on this tablet.</p>
        ) : install.canPrompt ? (
          <Btn onClick={installApp}>Install app on this tablet</Btn>
        ) : (
          <p className={helpClass}>Open the https address in Chrome, then menu ⋮ → Install app (or Add to Home screen). On iPad / iPhone: Safari Share → Add to Home Screen.</p>
        )}
        <p className={cx(helpClass, "mt-1.5")}>
          Data protection: {install.persisted === true ? "✓ on, the browser will not clear leads to free space." : install.persisted === false ? "off. The browser may clear leads if the tablet runs low on space. Installing the app usually turns it on. Back up often." : "checking…"}
        </p>
      </div>

      <div className="my-3 rounded-2xl bg-[#f3f6ff] p-3">
        <p className={labelClass}>Cloud sync</p>
        <p className={helpClass}>Sends every lead to your database so all tablets end up in one place. Ask the office for the sync key. Leave the server address empty when this page is opened from the sync server itself.</p>
        <label className="mt-2 mb-3 block">
          <span className={labelClass}>Sync key</span>
          <input className={inputClass} type="password" autoComplete="off" value={syncKey} onChange={(event) => setSyncKey(event.target.value)} />
        </label>
        <label className="mb-3 block">
          <span className={labelClass}>Server address (optional)</span>
          <input className={inputClass} type="url" placeholder="https://expo.mrrokesh.com" value={serverUrl} onChange={(event) => setServerUrl(event.target.value)} />
        </label>
        <Btn variant="line" onClick={saveSync}>Save and test connection</Btn>
      </div>

      <label className="mb-3 block">
        <span className={labelClass}>Tablet code</span>
        <span className={hintClass}>Lead numbers on this tablet look like {settings.tabletCode}-001. Give every tablet a different code (A, B, C…) so numbers never clash. Changing it only affects new leads.</span>
        <input className={inputClass} maxLength={3} autoCapitalize="characters" value={code} onChange={(event) => setCode(event.target.value)} />
      </label>
      <Btn variant="line" onClick={saveCode}>Save tablet code</Btn>

      <label className="mt-4 mb-3 block">
        <span className={labelClass}>Team WhatsApp</span>
        <input className={inputClass} inputMode="numeric" value={wa} onChange={(event) => setWa(event.target.value)} />
      </label>
      <Btn variant="line" onClick={saveWa}>Save WhatsApp number</Btn>

      <label className="mt-4 mb-3 block">
        <span className={labelClass}>New PIN</span>
        <input className={inputClass} inputMode="numeric" maxLength={4} placeholder="4 digits" value={pin} onChange={(event) => setPin(event.target.value)} />
      </label>
      <Btn variant="line" onClick={savePin}>Change PIN</Btn>

      <label className="mt-4 block">
        <span className={labelClass}>Restore or combine backups</span>
        <span className={hintClass}>Pick one or more backup files, for example from every tablet. Leads are merged, nothing is overwritten by an older copy.</span>
        <input
          type="file"
          accept="application/json,.json"
          multiple
          onChange={async (event) => {
            const files = [...event.target.files];
            event.target.value = "";
            if (files.length) toast(await importBackups(files));
          }}
        />
      </label>
    </details>
  );
}
