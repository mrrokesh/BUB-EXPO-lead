import { Ui } from "../lang.jsx";
import { useApp } from "../store.jsx";

/* "Still there?" before a screen with someone's details clears itself. Tapping anywhere keeps it. */
export function IdleOverlay() {
  const { idleWarn, dismissIdle } = useApp();
  if (!idleWarn) return null;
  return (
    <div onClick={dismissIdle} className="fixed inset-0 z-50 grid place-items-center bg-[rgba(7,26,102,0.82)] p-6">
      <div role="alertdialog" aria-live="assertive" className="max-w-[420px] rounded-[20px] bg-white px-[22px] py-[26px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <h2 className="mb-2 text-[26px] font-bold text-navy"><Ui k="idleTitle" /></h2>
        <p className="m-0 text-base leading-[1.45] text-ink"><Ui k="idleBody" /></p>
      </div>
    </div>
  );
}

export function Toast() {
  const { toastMessage } = useApp();
  if (!toastMessage) return null;
  return (
    <div role="status" className="fixed inset-x-0 top-3 z-40 mx-auto w-[min(440px,calc(100%-24px))] rounded-2xl bg-navy px-3 py-2.5 text-center font-bold text-white shadow-card">
      {toastMessage}
    </div>
  );
}
