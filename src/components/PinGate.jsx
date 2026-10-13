import { useState } from "react";
import { useApp } from "../store.jsx";
import { Shell, TopBar } from "./Layout.jsx";
import { Banner, Btn, inputClass } from "./ui.jsx";

export function PinGate() {
  const { unlock } = useApp();
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const result = unlock(pin);
    if (!result.ok) {
      setMessage(result.message);
      setPin("");
    }
  };

  return (
    <Shell>
      <TopBar showLang={false} />
      <main className="px-4 pt-1.5 pb-8">
        <h1 className="mt-3.5 mb-1 text-[34px] leading-[1.05] font-bold tracking-[-0.04em]">Stall leads</h1>
        <p className="mb-3.5 text-[15px] leading-[1.45] text-muted">Leads stay on this tablet until you export them.</p>
        {message && <Banner>{message}</Banner>}
        <form onSubmit={submit}>
          <label className="mb-4 block">
            <span className="mb-0.5 block text-[17px] font-extrabold tracking-tight">Staff PIN</span>
            <span className="mb-2 block text-[13px] text-muted">Enter the staff PIN</span>
            <input
              className={inputClass}
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              placeholder="4 digits"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              autoFocus
            />
          </label>
          <Btn type="submit">Open leads</Btn>
        </form>
      </main>
    </Shell>
  );
}
