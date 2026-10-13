import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LANGS, TA, UI } from "./i18n.js";
import { loadLang, saveLang } from "./lib/storage.js";

const LangContext = createContext({ lang: "both", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(loadLang);
  const setLang = useCallback((next) => {
    const value = LANGS.some((item) => item.id === next) ? next : "both";
    saveLang(value);
    setLangState(value);
  }, []);
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/* Plain text (placeholders, titles): Tamil in Tamil mode, otherwise English. */
export function pick(lang, en, ta) {
  return lang === "ta" && ta ? ta : en;
}

function fill(text, vars) {
  return Object.keys(vars || {}).reduce((out, name) => out.replace(`{${name}}`, vars[name]), text);
}

export function uiPlain(lang, key, vars) {
  const [en, ta] = UI[key];
  return pick(lang, fill(en, vars), fill(ta, vars));
}

/* Turns "a <strong>b</strong> c" into React nodes without raw HTML. */
function withStrong(text) {
  return text.split(/(<strong>.*?<\/strong>)/g).filter(Boolean).map((part, index) => (
    part.startsWith("<strong>")
      ? <strong key={index} className="text-orange">{part.slice(8, -9)}</strong>
      : <span key={index}>{part}</span>
  ));
}

/* English, Tamil, or both (Tamil on its own smaller line), following the language switch. */
export function Bi({ en, ta, strong }) {
  const { lang } = useLang();
  const show = (text) => (strong ? withStrong(text) : text);
  if (!ta || lang === "en") return <>{show(en)}</>;
  if (lang === "ta") return <span lang="ta">{show(ta)}</span>;
  return (
    <>
      {show(en)}
      <span lang="ta" className="mt-px block text-[0.78em] leading-[1.3] font-semibold opacity-85">{show(ta)}</span>
    </>
  );
}

/* Interface text from the UI table, e.g. <Ui k="cont" />. */
export function Ui({ k, vars, strong }) {
  const [en, ta] = UI[k];
  return <Bi en={fill(en, vars)} ta={fill(ta, vars)} strong={strong} />;
}

/* A message that may have Tamil in the TA table (errors, offers, placeholders). */
export function Msg({ text }) {
  return <Bi en={text} ta={TA[text]} />;
}
