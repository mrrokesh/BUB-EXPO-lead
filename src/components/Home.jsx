import { EVENT_NAME, STALL } from "../config.js";
import { FORMS } from "../data/forms.js";
import { UI } from "../i18n.js";
import { Bi, Ui, pick, uiPlain, useLang } from "../lang.jsx";
import { useApp } from "../store.jsx";
import { ContactBlock } from "./ContactBlock.jsx";
import { Shell, TopBar } from "./Layout.jsx";
import { cx } from "./ui.jsx";

const CARD_BG = {
  software: "bg-[linear-gradient(160deg,#1237c8,#071a66)]",
  website: "bg-[linear-gradient(160deg,#ff7a1a,#d63b00)]",
  automate: "bg-[linear-gradient(160deg,#16306e,#0a1844)]"
};

function FormIcon({ id }) {
  const paths = {
    software: (<><rect x="5" y="6" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M5 12h22M11 22v4M8 26h16" stroke="currentColor" strokeWidth="2" /></>),
    website: (<><rect x="6" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M6 12h20M12 25h8" stroke="currentColor" strokeWidth="2" /></>),
    automate: <path d="M18 4L8 18h7l-1 10 10-14h-7l1-10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  };
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="size-[34px]">{paths[id]}</svg>;
}

export function Home() {
  const { lang } = useLang();
  const { openForm } = useApp();
  return (
    <Shell wide>
      <TopBar showLeads />
      <main className="px-4 pt-1.5 pb-7">
        <img src="/logo.webp" alt="MR Rokesh - Absolute Control" width="150" height="150" className="mx-auto mt-1 block size-[150px] object-contain" />
        <div className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-[7px] text-xs font-bold tracking-[0.02em] text-white">
          {EVENT_NAME} · Salem · {STALL} · 15–17 Oct
        </div>
        <h1 className={cx("mt-3.5 mb-1 font-bold tracking-tight", lang === "ta" ? "text-[30px] leading-tight tracking-normal" : "text-[34px] leading-[1.05] tracking-[-0.04em]", "lg:text-[46px]")}>
          {uiPlain(lang, "tapOne")}
        </h1>
        {lang === "both" && <p lang="ta" className="mb-2 text-base font-bold text-orange">{UI.tapOne[1]}</p>}
        <p className="mb-3.5 text-[15px] leading-[1.45] text-muted"><Ui k="homeLede" /></p>
        <div className="mb-3.5 rounded-2xl bg-white px-3.5 py-3 text-[13px] leading-[1.45] shadow-card"><Ui k="offerStrip" strong /></div>

        <div className="grid gap-3 lg:grid-cols-3 lg:items-stretch">
          {Object.values(FORMS).map((form, index) => (
            <button
              key={form.id}
              type="button"
              onClick={() => openForm(form.id)}
              className={cx("flex flex-col rounded-[22px] border-0 p-4 text-left text-white shadow-card lg:min-h-[250px]", CARD_BG[form.id])}
            >
              <span className="flex w-full items-start justify-between">
                <span className="text-[13px] font-extrabold opacity-75">0{index + 1}</span>
                <FormIcon id={form.id} />
              </span>
              <span className="mt-1.5 text-[22px] font-extrabold tracking-tight">{pick(lang, form.title, form.tamil)}</span>
              {lang === "both" && <span lang="ta" className="text-sm opacity-90">{form.tamil}</span>}
              <span className="mt-1.5 text-sm leading-[1.35] opacity-90">
                {lang === "ta" ? <span lang="ta">{form.cardTamil}</span> : form.copy}
                {lang === "both" && (<><br /><span lang="ta">{form.cardTamil}</span></>)}
              </span>
              <span className="mt-auto pt-2.5 text-sm font-extrabold"><Ui k="tapStart" /> →</span>
            </button>
          ))}
        </div>

        <ContactBlock withAddress />
      </main>
    </Shell>
  );
}
