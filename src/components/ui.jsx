export const cx = (...parts) => parts.filter(Boolean).join(" ");

const BTN = "min-h-[54px] rounded-2xl px-4 py-3 text-base font-extrabold";
const VARIANTS = {
  primary: "w-full bg-(--accent) text-white shadow-[0_10px_20px_rgba(12,61,255,0.22)]",
  line: "w-full border-[1.5px] border-line bg-white text-navy",
  wa: "w-full bg-[#128c4a] text-white",
  danger: "w-full border-[1.5px] border-[#f3c1bd] bg-white text-danger",
  back: "w-24 shrink-0 border-[1.5px] border-line bg-white text-navy"
};

export function Btn({ variant = "primary", className, type = "button", ...props }) {
  return <button type={type} className={cx(BTN, VARIANTS[variant], className)} {...props} />;
}

export function Banner({ children, role = "alert" }) {
  return (
    <div role={role} className="my-2 mb-3 rounded-2xl bg-[#fff1f0] px-3 py-2.5 text-sm font-bold text-danger">
      {children}
    </div>
  );
}

export function LinkButton({ className, ...props }) {
  return <button type="button" className={cx("border-0 bg-transparent p-0 font-extrabold text-orange", className)} {...props} />;
}

/* A rounded answer button. `on` fills it with the accent colour. */
export function Chip({ on, emphasis, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={on ? "true" : "false"}
      className={cx(
        "flex min-h-[58px] flex-col justify-center gap-0.5 rounded-2xl border-[1.5px] px-3 py-2.5 text-left",
        on ? "border-(--accent) bg-(--accent) text-white" : "border-line bg-white text-ink",
        emphasis && "col-span-2 min-h-16"
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const inputClass =
  "w-full rounded-2xl border-[1.5px] border-line bg-white px-3.5 py-3.5 text-base text-ink focus:border-(--accent) focus:outline-none";

export function Tick() {
  return <span aria-hidden="true" className="font-black">✓</span>;
}
