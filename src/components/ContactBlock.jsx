import { ADDRESS_LINES, DEFAULT_PHONE, EMAIL, EVENT_NAME, FACEBOOK_URL, INSTAGRAM_URL, MAPS_URL, SITE } from "../config.js";
import { prettyMobile } from "../lib/format.js";
import { Bi } from "../lang.jsx";
import { cx } from "./ui.jsx";

const ICONS = {
  call: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  whatsapp: (<><path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.6L3 21z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-2-1-.9.7a4 4 0 0 1-1.7-1.7l.7-.9-1-2L9 9.5z" /></>),
  email: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>),
  instagram: (<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.8" fill="currentColor" /></>),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z" />,
  website: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>),
  map: (<><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>)
};

function ContactIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
      {ICONS[name]}
    </svg>
  );
}

/* Tap-to-act buttons: call, WhatsApp, email, Instagram, Facebook, website, directions. */
export function ContactBlock({ withAddress }) {
  const hello = encodeURIComponent(`Hello MR Rokesh Softwares, I visited your stall at ${EVENT_NAME}.`);
  const items = [
    { id: "call", bg: "bg-brand", href: `tel:+91${DEFAULT_PHONE}`, en: "Call us", ta: "அழைக்க" },
    { id: "whatsapp", bg: "bg-[#1faa59]", href: `https://wa.me/91${DEFAULT_PHONE}?text=${hello}`, en: "WhatsApp", ta: "வாட்ஸ்அப்", ext: true },
    { id: "email", bg: "bg-[#16306e]", href: `mailto:${EMAIL}`, en: "Email us", ta: "மின்னஞ்சல்" },
    { id: "instagram", bg: "bg-[linear-gradient(45deg,#f9a03f,#e1306c_55%,#833ab4)]", href: INSTAGRAM_URL, en: "Instagram", ta: "இன்ஸ்டாகிராம்", ext: true },
    { id: "facebook", bg: "bg-[#1877f2]", href: FACEBOOK_URL, en: "Facebook", ta: "பேஸ்புக்", ext: true },
    { id: "website", bg: "bg-hot", href: `https://${SITE}`, en: "Website", ta: "வெப்சைட்", ext: true },
    { id: "map", bg: "bg-[#5b6b8a]", href: MAPS_URL, en: "Directions", ta: "வழி காட்டி", ext: true, wide: true }
  ];
  return (
    <section aria-label="Contact MR Rokesh" className="mt-5 mb-2 rounded-[20px] border-[1.5px] border-line bg-white p-4">
      <h2 className="mb-3 text-center text-[15px] font-bold tracking-[0.02em] text-navy">
        <Bi en="Talk to us · Follow us" ta="எங்களுடன் பேசுங்கள் · பின்தொடருங்கள்" />
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            {...(item.ext ? { target: "_blank", rel: "noopener" } : {})}
            className={cx("flex min-h-[54px] items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[15px] leading-[1.15] font-extrabold text-white no-underline active:scale-[0.98]", item.bg, item.wide && "col-span-2 sm:col-span-1")}
          >
            <ContactIcon name={item.id} />
            <span><Bi en={item.en} ta={item.ta} /></span>
          </a>
        ))}
      </div>
      {withAddress && (
        <address className="mt-3.5 text-center text-[13px] leading-normal text-muted not-italic">
          {ADDRESS_LINES.map((line) => (<span key={line}>{line}<br /></span>))}
          <a href={`mailto:${EMAIL}`} className="font-bold text-navy no-underline">{EMAIL}</a>
          {" · "}
          <a href={`tel:+91${DEFAULT_PHONE}`} className="font-bold text-navy no-underline">+91 {prettyMobile(DEFAULT_PHONE)}</a>
        </address>
      )}
    </section>
  );
}
