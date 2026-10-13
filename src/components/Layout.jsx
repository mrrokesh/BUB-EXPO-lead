import { LANGS } from "../i18n.js";
import { BACKUP_NUDGE } from "../config.js";
import { useLang } from "../lang.jsx";
import { useApp } from "../store.jsx";
import { useDb, useSettings } from "../hooks/useData.js";
import { cx } from "./ui.jsx";

export function Shell({ wide, accent, children }) {
  return (
    <div
      className={cx("relative mx-auto min-h-screen bg-surface", wide ? "w-[min(980px,100%)]" : "w-[min(480px,100%)]")}
      style={accent ? { "--accent": accent } : undefined}
    >
      {children}
    </div>
  );
}

export function LangBar() {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Language / மொழி" className="flex flex-wrap items-center justify-between gap-2 px-4 pt-2.5">
      <span className="text-xs font-extrabold tracking-wide text-muted">Language · மொழி</span>
      <div className="inline-flex overflow-hidden rounded-full border-[1.5px] border-line bg-white">
        {LANGS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={lang === item.id}
            lang={item.id === "en" ? undefined : "ta"}
            onClick={() => setLang(item.id)}
            className={cx(
              "min-h-10 px-3.5 py-2 text-sm font-extrabold",
              index > 0 && "border-l-[1.5px] border-line",
              lang === item.id ? "bg-navy text-white" : "bg-transparent text-navy"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TopBar({ showLeads = false, showLang = true }) {
  const { goHome, openLeads } = useApp();
  const db = useDb();
  const settings = useSettings();
  const pending = Math.max(0, db.rev - settings.backupRev);
  const count = db.leads.length;
  return (
    <>
      {showLang && <LangBar />}
      <header className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
        <button type="button" onClick={goHome} className="flex items-center gap-2.5 border-0 bg-transparent p-0 text-left text-inherit">
          <img src="/logo.webp" alt="MR Rokesh" width="52" height="52" className="block size-[52px] object-contain" />
          <span>
            <span className="block text-base font-extrabold tracking-tight text-navy">MR ROKESH</span>
            <span className="block text-[11px] font-extrabold tracking-[0.14em] text-orange">SOFTWARES</span>
          </span>
        </button>
        {showLeads && (
          <button type="button" onClick={openLeads} className="rounded-full border-[1.5px] border-line bg-white px-3.5 py-2 text-sm font-bold text-navy">
            Leads
            {count > 0 && (
              <span className={cx("ml-1.5 inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-xs text-white", pending >= BACKUP_NUDGE * 2 ? "bg-[#c62828]" : "bg-hot")}>
                {count}
              </span>
            )}
          </button>
        )}
      </header>
    </>
  );
}
