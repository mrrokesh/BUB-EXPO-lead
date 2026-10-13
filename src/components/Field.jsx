import { TA } from "../i18n.js";
import { Msg, pick, useLang } from "../lang.jsx";
import { Chip, Tick, cx, inputClass } from "./ui.jsx";

/* One question: text, mobile number, note, one-answer chips or tick-all chips. */
export function Field({ field, form, onText, onChoose, label: labelOverride }) {
  const { lang } = useLang();
  const { answers, errors } = form;
  const value = answers[field.key];
  const error = errors[field.key];
  const detailError = errors[field.key + "Detail"];
  const label = labelOverride || field.label;
  const shownLabel = pick(lang, label, TA[label]);
  const tamilMode = lang === "ta";
  const placeholder = (text) => pick(lang, text || "", TA[text]);
  const invalid = !!(error || detailError);

  let control;
  if (field.type === "text" || field.type === "tel") {
    control = (
      <input
        className={inputClass}
        type={field.type === "tel" ? "tel" : "text"}
        inputMode={field.type === "tel" ? "numeric" : "text"}
        autoComplete={field.autocomplete || "off"}
        placeholder={placeholder(field.placeholder)}
        value={value || ""}
        onChange={(event) => onText(field.key, event.target.value)}
      />
    );
  } else if (field.type === "note") {
    control = (
      <textarea
        className={cx(inputClass, "min-h-[84px] resize-y")}
        maxLength={200}
        placeholder={placeholder(field.placeholder)}
        value={value || ""}
        onChange={(event) => onText(field.key, event.target.value)}
      />
    );
  } else {
    const selected = field.type === "chips" ? [value] : (Array.isArray(value) ? value : []);
    const showDetail = selected.some((item) => field.options.some((option) => option.value === item && option.detail));
    control = (
      <>
        <div role="group" aria-label={shownLabel} className="grid grid-cols-2 gap-2">
          {field.options.map((option) => {
            const on = selected.includes(option.value);
            const main = pick(lang, option.label, option.tamil);
            return (
              <Chip key={option.value} on={on} emphasis={option.emphasis} onClick={() => onChoose(field.key, option.value)}>
                <span lang={tamilMode && option.tamil ? "ta" : undefined} className="flex gap-1.5 text-sm leading-tight font-extrabold">
                  {on && <Tick />}
                  {main}
                </span>
                {lang === "both" && option.tamil && (
                  <span lang="ta" className={cx("text-xs leading-[1.3]", on ? "text-white/85" : "text-muted")}>{option.tamil}</span>
                )}
              </Chip>
            );
          })}
        </div>
        {showDetail && (
          <input
            className={cx(inputClass, "mt-2")}
            type="text"
            placeholder={placeholder("Type the other detail")}
            value={answers[field.key + "Detail"] || ""}
            onChange={(event) => onText(field.key + "Detail", event.target.value)}
          />
        )}
      </>
    );
  }

  const hintHidden = !field.hint || lang === "en" || (tamilMode && field.hint === shownLabel);
  return (
    <div
      data-invalid={invalid ? "true" : "false"}
      className={cx("mb-4", field.staff && "rounded-2xl border border-dashed border-[#b7c6e8] bg-[#eef3ff] p-3")}
    >
      <span lang={tamilMode && TA[label] ? "ta" : undefined} className={cx("mb-0.5 block text-[17px] font-extrabold tracking-tight", invalid && "text-danger")}>
        {shownLabel}
        {field.required && <span className="text-orange"> *</span>}
      </span>
      {!hintHidden && <span lang="ta" className="mb-2 block text-[13px] leading-[1.35] text-muted">{field.hint}</span>}
      {control}
      {error && <p className="mt-1.5 text-[13px] font-bold text-danger"><Msg text={error} /></p>}
      {detailError && <p className="mt-1.5 text-[13px] font-bold text-danger"><Msg text={detailError} /></p>}
    </div>
  );
}
