import { FORMS } from "../data/forms.js";
import { UI } from "../i18n.js";
import { Ui, pick, uiPlain, useLang } from "../lang.jsx";
import { visibleFields } from "../lib/leads.js";
import { useApp } from "../store.jsx";
import { Field } from "./Field.jsx";
import { Shell, TopBar } from "./Layout.jsx";
import { Banner, Btn, LinkButton, cx } from "./ui.jsx";

export function FormView() {
  const { lang } = useLang();
  const { form, goBack, goNext, startFresh, setAnswer, choose } = useApp();
  const def = FORMS[form.formId];
  if (!def) return null;
  const step = def.steps[form.step];
  const last = form.step === def.steps.length - 1;
  const fields = visibleFields(def, form.step, form.answers);

  /* The website form asks something different when the visitor has nothing yet. */
  const nothingYet = form.formId === "website" && Array.isArray(form.answers.have) && form.answers.have.includes("nothing");

  return (
    <Shell accent={def.accent}>
      <TopBar />
      <form
        noValidate
        onSubmit={(event) => { event.preventDefault(); goNext(); }}
        className="px-4 pb-[130px]"
      >
        <p className="m-0 text-[28px] leading-[1.1] font-bold tracking-[-0.04em]">{pick(lang, def.title, def.tamil)}</p>
        {lang === "both" && <p lang="ta" className="mt-1 font-bold text-orange">{def.tamil}</p>}

        <div aria-hidden="true" className="mt-1 mb-2 flex gap-1.5">
          {def.steps.map((_, index) => (
            <span
              key={index}
              className={cx("h-1.5 flex-1 rounded-full", index === form.step ? "bg-(--accent)" : index < form.step ? "bg-[#b9c8ea]" : "bg-[#d7e0ef]")}
            />
          ))}
        </div>
        <p className="m-0 text-[13px] font-extrabold tracking-[0.04em] text-(--accent) uppercase">
          {uiPlain(lang, "step", { n: form.step + 1 })} · {pick(lang, step.title, step.tamil)}
        </p>
        {lang === "both" && (
          <p lang="ta" className="mt-0.5 mb-3 text-sm text-muted">{UI.step[1].replace("{n}", form.step + 1)} · {step.tamil}</p>
        )}

        {form.resumed && (
          <div className="my-3 flex items-center justify-between gap-2 rounded-2xl bg-[#fff6e8] px-3 py-2.5 text-sm">
            <span><Ui k="resume" /></span>
            <LinkButton onClick={startFresh}><Ui k="fresh" /></LinkButton>
          </div>
        )}
        {form.stepError && <Banner><Ui k="fixBanner" /></Banner>}
        {form.step === 0 && <p className="mb-3.5 text-[15px] leading-[1.45] text-muted"><Ui k="consent" /></p>}

        {fields.map((field) => (
          <Field
            key={field.key}
            field={field}
            form={form}
            onText={setAnswer}
            onChoose={choose}
            label={field.key === "problems" && nothingYet ? "What is the difficulty today?" : undefined}
          />
        ))}

        <div className="fixed inset-x-0 bottom-0 z-[5] mx-auto flex w-[min(480px,100%)] gap-2.5 bg-[linear-gradient(to_top,var(--color-surface)_72%,rgba(244,247,252,0))] px-4 pt-[18px] pb-[calc(12px+env(safe-area-inset-bottom))]">
          <Btn variant="back" onClick={goBack}><Ui k={form.step === 0 ? "home" : "back"} /></Btn>
          <Btn type="submit" className="w-auto flex-1"><Ui k={last ? "save" : "cont"} /></Btn>
        </div>
      </form>
    </Shell>
  );
}
