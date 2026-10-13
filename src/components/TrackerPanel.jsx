import { useState } from "react";
import { TRACK_ITEMS, penGiven, trackerTally } from "../lib/tracker.js";
import { updateTracker } from "../lib/storage.js";
import { useApp } from "../store.jsx";
import { Chip, Tick, cx, inputClass } from "./ui.jsx";

/* Staff-only: what the visitor did at the stall, and whether the free pen was handed over. */
export function TrackerPanel({ lead }) {
  const { toast } = useApp();
  const t = lead.tracker || {};
  const given = penGiven(t);
  const [prize, setPrize] = useState(t.wheelPrize || "");

  const change = (fn) => {
    try {
      updateTracker(lead.id, fn);
    } catch (error) {
      toast("This tablet could not save the change. Export a backup first.");
    }
  };

  return (
    <section aria-label="Gifts and offers" className="my-4 rounded-[18px] border-[1.5px] border-dashed border-orange bg-[#fffaf3] p-3.5">
      <p className="mb-2.5 text-xs font-extrabold tracking-[0.06em] text-orange uppercase">Staff · gifts &amp; offers</p>
      <button
        type="button"
        aria-pressed={given ? "true" : "false"}
        onClick={() => change((tracker) => { tracker.pensGiven = penGiven(tracker) ? 0 : 1; })}
        className={cx(
          "min-h-14 w-full rounded-2xl border-2 text-[17px] font-extrabold",
          given ? "border-[#1a8f4a] bg-[#1a8f4a] text-white" : "border-[#c62828] bg-white text-danger"
        )}
      >
        {given ? "✓ Free pen given" : "Tap when the free pen is handed over"}
      </button>
      <p className="mt-2 mb-3 text-xs text-muted">One free pen per visitor. The ticks below are just a record of what they did.</p>
      <div className="grid grid-cols-2 gap-2">
        {TRACK_ITEMS.map((item) => (
          <Chip key={item.key} on={!!t[item.key]} onClick={() => change((tracker) => { tracker[item.key] = !tracker[item.key]; })}>
            <span className="flex gap-1.5 text-sm leading-tight font-extrabold">
              {t[item.key] && <Tick />}
              {item.label}
            </span>
          </Chip>
        ))}
      </div>
      {t.wheel && (
        <input
          className={cx(inputClass, "mt-2")}
          type="text"
          maxLength={60}
          placeholder="What did they win on the wheel?"
          value={prize}
          onChange={(event) => {
            setPrize(event.target.value);
            change((tracker) => { tracker.wheelPrize = event.target.value.slice(0, 60); });
          }}
        />
      )}
    </section>
  );
}

/* All leads: how many pens, follows, reviews, spins and offers so far. */
export function TallyCard({ leads }) {
  const t = trackerTally(leads);
  const tiles = [
    ["Pens still to give", Math.max(0, t.owed - t.given)],
    ["Pens given", t.given],
    ["Instagram follows", t.instagram],
    ["Play Store installs", t.playstore],
    ["Google reviews", t.review],
    ["Wheel spins", t.wheel],
    ["Stickers", t.sticker],
    ["80% form offers", t.form80],
    ["Vibeo bonuses", t.vibeo]
  ];
  return (
    <div className="my-3 mb-4 rounded-[18px] border-[1.5px] border-line bg-white p-3.5">
      <p className="mb-2.5 text-xs font-extrabold tracking-[0.06em] text-orange uppercase">Gifts &amp; offers · all leads</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {tiles.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[#f3f6ff] px-1.5 py-2.5 text-center">
            <b className="block text-[22px] text-navy">{value}</b>
            <span className="block text-[11px] leading-tight text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
