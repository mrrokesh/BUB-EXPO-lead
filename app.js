"use strict";

const DB_KEY = "mrrokesh-bub-expo-leads-v1";
const SETTINGS_KEY = "mrrokesh-bub-expo-settings-v1";
const EVENT_NAME = "BUB EXPO 2026";
const STALL = "Stall #02";
const SITE = "www.mrrokesh.com";
const DEFAULT_PHONE = "8248696883";
const DEFAULT_PIN = "9688";
const EMAIL = "contact@mrrokesh.com";
const INSTAGRAM_URL = "https://www.instagram.com/mr_rokesh_enterprise/";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61585302014689";
const ADDRESS_LINES = ["1st Floor (Cabin A-3), Sathyam Trade Centre", "Saradha College Rd, Fairlands", "Salem, Tamil Nadu 636016"];
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("MR Rokesh, Sathyam Trade Centre, Saradha College Rd, Fairlands, Salem 636016");
const LANG_KEY = "mrrokesh-bub-expo-lang-v1";

/* Privacy timers. A visitor who walks away should not leave their details on the screen. */
const VISITOR_WARN_MS = 100 * 1000;
const VISITOR_RESET_MS = 120 * 1000;
const TICKET_WARN_MS = 45 * 1000;
const TICKET_RESET_MS = 60 * 1000;
const STAFF_LOCK_MS = 5 * 60 * 1000;
const BACKUP_NUDGE = 5;
const PIN_MAX_TRIES = 5;
const PIN_LOCK_MS = 60 * 1000;

/* Language: "en" = English only, "ta" = Tamil only, "both" = English with Tamil under it. */
const LANGS = [
  { id: "en", label: "English" },
  { id: "ta", label: "தமிழ்" },
  { id: "both", label: "English + தமிழ்" }
];

/* Tamil for every question label, placeholder and error. Missing entries fall back to English. */
const TA = {
  "Your name": "உங்கள் பெயர்",
  "Mobile number": "கைபேசி எண்",
  "Business name": "கடை / நிறுவனத்தின் பெயர்",
  "Business type": "தொழில் வகை",
  "City": "ஊர்",
  "Any requirement?": "வேறு ஏதாவது தேவையா?",
  "Reference — who referred you?": "பரிந்துரை — யார் சொன்னார்கள்?",
  "Demo or free trial?": "டெமோ அல்லது இலவச ட்ரையல் வேண்டுமா?",
  "Staff note": "ஸ்டால் குறிப்பு",
  "How do you manage today?": "இப்போது எப்படி நிர்வகிக்கிறீர்கள்?",
  "Which software are you using?": "எந்த மென்பொருளை பயன்படுத்துகிறீர்கள்?",
  "Any problem with the current way?": "தற்போதைய முறையில் ஏதாவது சிக்கல் உள்ளதா?",
  "Which service do you want?": "எந்த சேவை வேண்டும்?",
  "What do you already have?": "ஏற்கனவே உங்களிடம் என்ன உள்ளது?",
  "Who created your website / app?": "உங்கள் வெப்சைட் / ஆப்பை யார் உருவாக்கினார்கள்?",
  "Website or app name": "வெப்சைட் அல்லது ஆப் பெயர்",
  "Any problem with it?": "அதில் ஏதாவது சிக்கல் உள்ளதா?",
  "What is the difficulty today?": "இன்று உங்களுக்கு என்ன சிரமம்?",
  "Do you want a 3D website?": "3D வெப்சைட் வேண்டுமா?",
  "What should we build?": "நாங்கள் என்ன உருவாக்க வேண்டும்?",
  "How does the work happen today?": "இப்போது வேலை எப்படி நடக்கிறது?",
  "Free or paid software you use now?": "இப்போது இலவச அல்லது கட்டண மென்பொருள் பயன்படுத்துகிறீர்களா?",
  "Software name, if any": "மென்பொருள் பெயர் (இருந்தால்)",
  "Are you facing any issues?": "ஏதாவது பிரச்சினைகள் உள்ளதா?",
  "What do you want to automate?": "எதை தானியங்கி ஆக்க வேண்டும்?",
  "10-digit mobile": "10 இலக்க கைபேசி எண்",
  "Example: Sri Lakshmi Stores": "எ.கா: ஸ்ரீ லட்சுமி ஸ்டோர்ஸ்",
  "Example: billing for 3 shops, with GST": "எ.கா: GST உடன் 3 கடைகளுக்கு பில்லிங்",
  "Friend name, or leave blank": "நண்பர் பெயர், அல்லது காலியாக விடவும்",
  "Example: wants price for 2 branches": "எ.கா: 2 கிளைகளுக்கு விலை வேண்டும்",
  "Example: myshop.com": "எ.கா: myshop.com",
  "Example: Tally, Excel, Zoho": "எ.கா: Tally, Excel, Zoho",
  "Type the other detail": "மற்ற விவரத்தை தட்டச்சு செய்யவும்",
  "Choose what we should do next": "அடுத்து என்ன செய்ய வேண்டும் என்பதை தேர்வு செய்யவும்",
  "Choose a problem, or tap No problem": "சிக்கலை தேர்வு செய்யவும், அல்லது “சிரமம் இல்லை” தொடவும்",
  "Choose at least one service": "குறைந்தது ஒரு சேவையை தேர்வு செய்யவும்",
  "Choose at least one": "குறைந்தது ஒன்றை தேர்வு செய்யவும்",
  "Choose one, or tap Just looking": "ஒன்றை தேர்வு செய்யவும், அல்லது “பார்க்க மட்டும்” தொடவும்",
  "Please fill this": "இதை நிரப்பவும்",
  "Please choose one": "ஒன்றை தேர்வு செய்யவும்",
  "Please enter at least 2 letters": "குறைந்தது 2 எழுத்துகள் உள்ளிடவும்",
  "Enter a valid 10-digit mobile number": "சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்",
  "Please type a short detail": "சிறிய விவரத்தை தட்டச்சு செய்யவும்",
  "Free pen when you show this lead number": "இந்த எண்ணை காட்டினால் இலவச பேனா",
  "Static website offer — ₹5,000": "சிறிய வெப்சைட் ஆஃபர் — ₹5,000",
  "15% off ecommerce services": "ஆன்லைன் கடை சேவைகளுக்கு 15% தள்ளுபடி",
  "Free live demo at this stall": "இந்த ஸ்டாலில் இலவச நேரடி டெமோ",
  "Free trial": "இலவச ட்ரையல்",
  "Form filled — ask the team about the expo form offer": "ஃபார்ம் நிரப்பியதற்கு — எக்ஸ்போ ஃபார்ம் ஆஃபர் பற்றி குழுவிடம் கேளுங்கள்"
};

/* Interface text: [English, Tamil]. */
const UI = {
  tapOne: ["Tap one card", "ஒரு கார்டை தொடுங்கள்"],
  homeLede: [
    "30 seconds. Mostly taps. Pick the card that matches the chat.",
    "30 வினாடிகள் போதும். பெரும்பாலும் தொடுதல் மட்டுமே. பேசிய தலைப்புக்கு பொருந்தும் கார்டை தேர்வு செய்யுங்கள்."
  ],
  tapStart: ["Tap to start", "தொடங்க தொடுங்கள்"],
  step: ["Step {n} of 3", "படி {n} / 3"],
  cont: ["Continue", "தொடரவும்"],
  save: ["Save lead", "சேமிக்கவும்"],
  back: ["Back", "பின்செல்"],
  home: ["Home", "முகப்பு"],
  resume: ["Continuing the last visitor.", "முந்தைய பார்வையாளரின் தகவல் தொடர்கிறது."],
  fresh: ["Start fresh", "புதிதாக தொடங்கு"],
  fixBanner: ["Please complete the highlighted questions.", "குறிக்கப்பட்ட கேள்விகளை பூர்த்தி செய்யவும்."],
  consent: [
    "We use this only to contact you about your requirement.",
    "உங்கள் தேவை குறித்து தொடர்பு கொள்ள மட்டுமே இதை பயன்படுத்துவோம்."
  ],
  idleTitle: ["Still there?", "இன்னும் இருக்கிறீர்களா?"],
  idleBody: [
    "Tap anywhere to keep going. Otherwise this screen will clear in a few seconds to protect your details.",
    "தொடர திரையை தொடுங்கள். இல்லையெனில் உங்கள் விவரங்களை பாதுகாக்க சில வினாடிகளில் இந்தத் திரை அழிக்கப்படும்."
  ],
  ticketFine: [
    "Show this number at the counter for the free pen. Our team will WhatsApp the next step.",
    "இலவச பேனாவுக்கு இந்த எண்ணை கவுண்டரில் காட்டுங்கள். அடுத்த படியை எங்கள் குழு வாட்ஸ்அப்பில் அனுப்பும்."
  ],
  offerStrip: [
    "Fill a form for a <strong>free pen</strong>, a <strong>free demo</strong>, and the stall offers: static website ₹5,000 · 15% off ecommerce · ask us about the form offer.",
    "ஃபார்ம் நிரப்பினால் <strong>இலவச பேனா</strong>, <strong>இலவச டெமோ</strong>, மேலும் ஸ்டால் ஆஃபர்கள்: சிறிய வெப்சைட் ₹5,000 · ஆன்லைன் கடைக்கு 15% தள்ளுபடி · ஃபார்ம் ஆஃபர் பற்றி எங்களிடம் கேளுங்கள்."
  ]
};

/* Gift and offer tracker (staff only, English). Every visitor gets exactly one free pen. The ticks are records of what they did. */
const TRACK_ITEMS = [
  { key: "instagram", label: "Followed us on Instagram / social" },
  { key: "playstore", label: "Installed our app from Google Play" },
  { key: "review", label: "Reviewed us on Google" },
  { key: "wheel", label: "Spun the wheel" },
  { key: "sticker", label: "Free sticker given" },
  { key: "form80", label: "80% OFF form offer approved" },
  { key: "vibeo", label: "Vibeo Connect ₹2,000 bonus noted" }
];
const MAX_PENS = 1;

function penOwed() {
  return MAX_PENS;
}

function penGiven(tracker) {
  return Math.max(0, Math.min(MAX_PENS, Number((tracker || {}).pensGiven) || 0));
}

function trackerTally(leads) {
  const tally = { leads: leads.length, owed: 0, given: 0 };
  TRACK_ITEMS.forEach((item) => { tally[item.key] = 0; });
  leads.forEach((lead) => {
    const t = lead.tracker || {};
    tally.owed += penOwed(t);
    tally.given += penGiven(t);
    TRACK_ITEMS.forEach((item) => { if (t[item.key]) tally[item.key] += 1; });
  });
  return tally;
}

function updateTracker(id, change) {
  const db = loadDB();
  const lead = db.leads.find((item) => item.id === id);
  if (!lead) return false;
  lead.tracker = { ...(lead.tracker || {}) };
  change(lead.tracker);
  lead.updatedAt = new Date().toISOString();
  try {
    saveDB(db);
    return true;
  } catch (error) {
    toast("This tablet could not save the change. Export a backup first.");
    return false;
  }
}

function trackerPanel(lead) {
  const t = lead.tracker || {};
  const given = penGiven(t);
  const chips = TRACK_ITEMS.map((item) => `<button class="chip${t[item.key] ? " on" : ""}" type="button" data-action="track" data-id="${lead.id}" data-key="${item.key}" aria-pressed="${t[item.key] ? "true" : "false"}">
      <span class="chip-en">${t[item.key] ? `<span class="tick" aria-hidden="true">✓</span>` : ""}${esc(item.label)}</span>
    </button>`).join("");
  const prize = t.wheel
    ? `<input class="field" style="margin-top:8px" data-field="trackPrize" data-id="${lead.id}" type="text" maxlength="60" placeholder="What did they win on the wheel?" value="${esc(t.wheelPrize || "")}">`
    : "";
  return `<section class="panel" aria-label="Gifts and offers">
    <p class="panel-tag">Staff · gifts &amp; offers</p>
    <button class="pen-toggle ${given ? "done" : "due"}" type="button" data-action="pens" data-id="${lead.id}" aria-pressed="${given ? "true" : "false"}">
      ${given ? "✓ Free pen given" : "Tap when the free pen is handed over"}
    </button>
    <p class="panel-note">One free pen per visitor. The ticks below are just a record of what they did.</p>
    <div class="chips">${chips}</div>
    ${prize}
  </section>`;
}

function tallyCard(leads) {
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
  ].map(([label, value]) => `<div class="tile"><b>${value}</b><span>${esc(label)}</span></div>`).join("");
  return `<div class="tally"><p class="panel-tag">Gifts &amp; offers · all leads</p><div class="tiles">${tiles}</div></div>`;
}

function loadLang() {
  try {
    const value = localStorage.getItem(LANG_KEY);
    return LANGS.some((item) => item.id === value) ? value : "both";
  } catch (error) {
    return "both";
  }
}

function saveLang(value) {
  try { localStorage.setItem(LANG_KEY, value); } catch (error) { /* language is a convenience */ }
}

/* Plain text for placeholders and titles. Both mode keeps English. */
function pick(en, ta) {
  return state.lang === "ta" && ta ? ta : en;
}

/* HTML for visible text. Both mode puts the Tamil on its own smaller line. */
function bi(en, ta, html) {
  const show = (text) => (html ? text : esc(text));
  if (!ta || state.lang === "en") return show(en);
  if (state.lang === "ta") return `<span lang="ta">${show(ta)}</span>`;
  return `${show(en)}<span class="sub-ta" lang="ta">${show(ta)}</span>`;
}

function ui(key, vars, html) {
  const pair = UI[key];
  const fill = (text) => Object.keys(vars || {}).reduce((out, name) => out.replace(`{${name}}`, vars[name]), text);
  return bi(fill(pair[0]), fill(pair[1]), html);
}

function uiPlain(key, vars) {
  const pair = UI[key];
  const fill = (text) => Object.keys(vars || {}).reduce((out, name) => out.replace(`{${name}}`, vars[name]), text);
  return pick(fill(pair[0]), fill(pair[1]));
}

const ABOUT_FIELDS = [
  {
    key: "name",
    type: "text",
    label: "Your name",
    hint: "உங்கள் பெயர்",
    placeholder: "Your name",
    required: true,
    autocomplete: "name"
  },
  {
    key: "mobile",
    type: "tel",
    label: "Mobile number",
    hint: "கைபேசி எண்",
    placeholder: "10-digit mobile",
    required: true,
    autocomplete: "tel"
  },
  {
    key: "business",
    type: "text",
    label: "Business name",
    hint: "கடை / நிறுவனத்தின் பெயர்",
    placeholder: "Example: Sri Lakshmi Stores",
    required: true,
    autocomplete: "organization"
  },
  {
    key: "businessType",
    type: "chips",
    label: "Business type",
    hint: "தொழில் வகை",
    required: true,
    options: [
      { value: "shop", label: "Shop", tamil: "கடை" },
      { value: "office", label: "Office", tamil: "அலுவலகம்" },
      { value: "school", label: "School", tamil: "பள்ளி" },
      { value: "hospital", label: "Hospital", tamil: "மருத்துவமனை" },
      { value: "factory", label: "Factory", tamil: "தொழிற்சாலை" },
      { value: "hotel", label: "Hotel / restaurant", tamil: "ஹோட்டல்" },
      { value: "other", label: "Other", tamil: "மற்றவை", detail: true }
    ]
  },
  {
    key: "city",
    type: "chips",
    label: "City",
    hint: "ஊர்",
    required: true,
    options: [
      { value: "salem", label: "Salem", tamil: "சேலம்" },
      { value: "namakkal", label: "Namakkal", tamil: "நாமக்கல்" },
      { value: "erode", label: "Erode", tamil: "ஈரோடு" },
      { value: "other", label: "Other", tamil: "வேறு ஊர்", detail: true }
    ]
  }
];

const NEXT_FIELDS = [
  {
    key: "requirement",
    type: "note",
    label: "Any requirement?",
    hint: "வேறு ஏதாவது வேண்டுமா? ஒரு வரி போதும்.",
    placeholder: "Example: billing for 3 shops, with GST",
    required: false
  },
  {
    key: "referred",
    type: "text",
    label: "Reference — who referred you?",
    hint: "யார் சொல்லி வந்தீர்கள்? காலியாக விடலாம்.",
    placeholder: "Friend name, or leave blank",
    required: false
  },
  {
    key: "next",
    type: "ticks",
    label: "Demo or free trial?",
    hint: "டெமோ வேண்டுமா? இலவச ட்ரையல் வேண்டுமா?",
    required: true,
    error: "Choose what we should do next",
    options: [
      { value: "demo", label: "Free demo", tamil: "இலவச டெமோ", emphasis: true },
      { value: "trial", label: "Free trial", tamil: "இலவச ட்ரையல்", emphasis: true },
      { value: "call", label: "Call me", tamil: "என்னை அழைக்கவும்" },
      { value: "whatsapp", label: "WhatsApp me the details", tamil: "வாட்ஸ்அப்பில் அனுப்புங்கள்" }
    ]
  },
  {
    key: "staffNote",
    type: "note",
    staff: true,
    label: "Staff note",
    hint: "ஸ்டால் குறிப்பு. பார்வையாளர் விட்டுவிடலாம்.",
    placeholder: "Example: wants price for 2 branches",
    required: false
  }
];

const FORMS = {
  software: {
    id: "software",
    short: "Software",
    title: "Business Software",
    tamil: "வணிக மென்பொருள்",
    copy: "Paper, Excel, Tally, billing, stock, or ERP.",
    cardTamil: "பில்லிங், ஸ்டாக், இஆர்பி",
    accent: "#0c3dff",
    steps: [
      { title: "About you", tamil: "உங்களைப் பற்றி", fields: ABOUT_FIELDS },
      {
        title: "Your situation",
        tamil: "தற்போதைய நிலை",
        fields: [
          {
            key: "currentMethod",
            type: "chips",
            label: "How do you manage today?",
            hint: "கைமுறையா, டிஜிட்டலா? இலவசமா, கட்டணமா?",
            required: true,
            options: [
              { value: "manual", label: "Manual", tamil: "நோட்டு / காகிதம்" },
              { value: "excel", label: "Excel sheet", tamil: "எக்செல்" },
              { value: "free", label: "Free software", tamil: "இலவச மென்பொருள்" },
              { value: "paid", label: "Paid software", tamil: "கட்டண மென்பொருள்" }
            ]
          },
          {
            key: "software",
            type: "chips",
            label: "Which software are you using?",
            hint: "எந்த மென்பொருள்?",
            required: true,
            showIf: (a) => a.currentMethod === "free" || a.currentMethod === "paid",
            options: [
              { value: "tally", label: "Tally" },
              { value: "busy", label: "Busy" },
              { value: "zoho", label: "Zoho" },
              { value: "marg", label: "Marg" },
              { value: "vyapar", label: "Vyapar" },
              { value: "mybillbook", label: "MyBillBook" },
              { value: "other", label: "Other", tamil: "வேறு", detail: true }
            ]
          },
          {
            key: "problems",
            type: "ticks",
            label: "Any problem with the current way?",
            hint: "மெதுவா? குறைகள்? மேம்பாடு வேண்டுமா?",
            required: true,
            error: "Choose a problem, or tap No problem",
            options: [
              { value: "slow", label: "Too slow", tamil: "மிகவும் மெதுவு" },
              { value: "mistakes", label: "Too many mistakes", tamil: "தவறுகள் அதிகம்" },
              { value: "noreports", label: "No proper reports", tamil: "ரிப்போர்ட் இல்லை" },
              { value: "staff", label: "Staff finds it difficult", tamil: "பணியாளருக்கு கடினம்" },
              { value: "costly", label: "Renewal is costly", tamil: "கட்டணம் அதிகம்" },
              { value: "notenough", label: "Current software is not enough", tamil: "தற்போதைய மென்பொருள் போதாது" },
              { value: "improve", label: "Improvements needed", tamil: "மேம்பாடு வேண்டும்" },
              { value: "noproblem", label: "No problem", tamil: "சிரமம் இல்லை", exclusive: true }
            ]
          }
        ]
      },
      {
        title: "What you want",
        tamil: "உங்களுக்கு என்ன வேண்டும்",
        fields: [
          {
            key: "needs",
            type: "ticks",
            label: "Which service do you want?",
            hint: "எது வேண்டும்? ஒன்றுக்கு மேல் தேர்வு செய்யலாம்.",
            required: true,
            error: "Choose at least one service",
            options: [
              { value: "billing", label: "Billing & GST", tamil: "பில்லிங்" },
              { value: "stock", label: "Stock / inventory", tamil: "ஸ்டாக்" },
              { value: "erp", label: "ERP — full business software", tamil: "முழு இஆர்பி" },
              { value: "crm", label: "CRM — customers", tamil: "வாடிக்கையாளர்" },
              { value: "payroll", label: "Salary & attendance", tamil: "சம்பளம்" },
              { value: "school", label: "School software", tamil: "பள்ளி மென்பொருள்" },
              { value: "accounts", label: "Accounts", tamil: "கணக்கு" }
            ]
          },
          ...NEXT_FIELDS
        ]
      }
    ]
  },
  website: {
    id: "website",
    short: "Website",
    title: "Website & App",
    tamil: "வெப்சைட் & ஆப்",
    copy: "Website, 3D site, online store, or Android app.",
    cardTamil: "வெப்சைட், ஆப், ஆன்லைன் கடை",
    accent: "#e44500",
    steps: [
      { title: "About you", tamil: "உங்களைப் பற்றி", fields: ABOUT_FIELDS },
      {
        title: "Your situation",
        tamil: "தற்போதைய நிலை",
        fields: [
          {
            key: "have",
            type: "ticks",
            label: "What do you already have?",
            hint: "வெப்சைட், ஆப், ஆன்லைன் கடை — உள்ளதை தொடுங்கள்.",
            required: true,
            options: [
              { value: "website", label: "Website", tamil: "வெப்சைட்" },
              { value: "app", label: "Mobile app", tamil: "மொபைல் ஆப்" },
              { value: "store", label: "Online store", tamil: "ஆன்லைன் கடை" },
              { value: "nothing", label: "Nothing yet", tamil: "இன்னும் ஏதும் இல்லை", exclusive: true }
            ]
          },
          {
            key: "creator",
            type: "chips",
            label: "Who created your website / app?",
            hint: "யார் உருவாக்கினார்கள்?",
            required: true,
            showIf: hasPresence,
            options: [
              { value: "myself", label: "I made it", tamil: "நானே" },
              { value: "freelancer", label: "A freelancer", tamil: "ஃப்ரீலான்சர்" },
              { value: "company", label: "A company", tamil: "ஒரு நிறுவனம்" },
              { value: "unknown", label: "I don't know", tamil: "தெரியவில்லை" }
            ]
          },
          {
            key: "presenceName",
            type: "text",
            label: "Website or app name",
            hint: "பெயர் அல்லது லிங்க். காலியாக விடலாம்.",
            placeholder: "Example: myshop.com",
            required: false,
            showIf: hasPresence
          },
          {
            key: "problems",
            type: "ticks",
            label: "Any problem with it?",
            hint: "மெதுவா? பழைய மாதிரியா? விசாரணை வரவில்லையா?",
            required: true,
            error: "Choose a problem, or tap No problem",
            options: [
              { value: "slow", label: "Too slow", tamil: "மெதுவாக திறக்கிறது" },
              { value: "old", label: "Looks old — improvements needed", tamil: "பழைய மாதிரி" },
              { value: "mobile", label: "Not good on mobile", tamil: "மொபைலில் சரியில்லை" },
              { value: "noenquiries", label: "Not getting calls or orders", tamil: "விசாரணை வரவில்லை" },
              { value: "hard", label: "Hard to update", tamil: "மாற்ற கடினம்" },
              { value: "notenough", label: "Current site has drawbacks", tamil: "குறைகள் உள்ளன" },
              { value: "noproblem", label: "No problem", tamil: "சிக்கல் இல்லை", exclusive: true }
            ]
          }
        ]
      },
      {
        title: "What you want",
        tamil: "உங்களுக்கு என்ன வேண்டும்",
        fields: [
          {
            key: "website3d",
            type: "chips",
            label: "Do you want a 3D website?",
            hint: "3D வெப்சைட் வேண்டுமா?",
            required: true,
            options: [
              { value: "yes", label: "Yes, a 3D website", tamil: "ஆம், 3D வெப்சைட்" },
              { value: "normal", label: "A normal website is enough", tamil: "சாதாரண வெப்சைட் போதும்" },
              { value: "unsure", label: "Not sure — show me both", tamil: "இரண்டும் காட்டுங்கள்" }
            ]
          },
          {
            key: "needs",
            type: "ticks",
            label: "What should we build?",
            hint: "என்ன வேண்டும்? ஒன்றுக்கு மேல் தேர்வு செய்யலாம்.",
            required: true,
            error: "Choose at least one",
            options: [
              { value: "newwebsite", label: "New website", tamil: "புதிய வெப்சைட்" },
              { value: "static", label: "Static website offer — ₹5,000", tamil: "சிறிய வெப்சைட் ஆஃபர்" },
              { value: "ecommerce", label: "Ecommerce store — 15% off", tamil: "ஆன்லைன் கடை" },
              { value: "android", label: "Android app", tamil: "ஆண்ட்ராய்டு ஆப்" },
              { value: "redesign", label: "Redesign what I have", tamil: "பழையதை மாற்றம்" },
              { value: "hosting", label: "Hosting", tamil: "ஹோஸ்டிங்" }
            ]
          },
          ...NEXT_FIELDS
        ]
      }
    ]
  },
  automate: {
    id: "automate",
    short: "Automate",
    title: "Automate My Work",
    tamil: "வேலையை எளிமை ஆக்குங்கள்",
    copy: "WhatsApp, AI, marketing, slow work, or any other need.",
    cardTamil: "வாட்ஸ்அப், ஏஐ, மெதுவான வேலை",
    accent: "#16306e",
    steps: [
      { title: "About you", tamil: "உங்களைப் பற்றி", fields: ABOUT_FIELDS },
      {
        title: "Your situation",
        tamil: "தற்போதைய நிலை",
        fields: [
          {
            key: "workMode",
            type: "chips",
            label: "How does the work happen today?",
            hint: "கைமுறையா, டிஜிட்டலா?",
            required: true,
            options: [
              { value: "manual", label: "Fully manual", tamil: "முழுக்க கைமுறை" },
              { value: "half", label: "Half digital", tamil: "பாதி டிஜிட்டல்" },
              { value: "digital", label: "Fully digital", tamil: "முழுக்க டிஜிட்டல்" }
            ]
          },
          {
            key: "toolPlan",
            type: "chips",
            label: "Free or paid software you use now?",
            hint: "இலவசமா, கட்டணமா?",
            required: true,
            options: [
              { value: "free", label: "Free software", tamil: "இலவசம்" },
              { value: "paid", label: "Paid software", tamil: "கட்டணம்" },
              { value: "whatsapp", label: "WhatsApp only", tamil: "வாட்ஸ்அப் மட்டும்" },
              { value: "nothing", label: "Nothing yet", tamil: "ஏதும் இல்லை" }
            ]
          },
          {
            key: "toolName",
            type: "text",
            label: "Software name, if any",
            hint: "மென்பொருள் பெயர். காலியாக விடலாம்.",
            placeholder: "Example: Tally, Excel, Zoho",
            required: false
          },
          {
            key: "problems",
            type: "ticks",
            label: "Are you facing any issues?",
            hint: "மெதுவா? குறைகள்? மேம்பாடு வேண்டுமா?",
            required: true,
            error: "Choose one, or tap Just looking",
            options: [
              { value: "slow", label: "Work is too slow", tamil: "வேலை மெதுவாக உள்ளது" },
              { value: "issues", label: "We face regular problems", tamil: "அடிக்கடி சிக்கல்" },
              { value: "notenough", label: "Current software has drawbacks", tamil: "மென்பொருள் போதாது" },
              { value: "improve", label: "Improvements needed", tamil: "மேம்பாடு வேண்டும்" },
              { value: "followup", label: "Customers are not followed up", tamil: "பின்தொடர்வு இல்லை" },
              { value: "looking", label: "Just looking", tamil: "பார்க்க மட்டும் வந்தேன்", exclusive: true }
            ]
          }
        ]
      },
      {
        title: "What you want",
        tamil: "எதை தானியங்கி ஆக்க வேண்டும்",
        fields: [
          {
            key: "needs",
            type: "ticks",
            label: "What do you want to automate?",
            hint: "எது வேண்டும்? ஒன்றுக்கு மேல் தேர்வு செய்யலாம்.",
            required: true,
            error: "Choose at least one",
            options: [
              { value: "erp", label: "ERP", tamil: "முழு வணிக மென்பொருள்" },
              { value: "billing", label: "Billing", tamil: "பில்லிங்" },
              { value: "ecommerce", label: "Ecommerce orders", tamil: "ஆன்லைன் ஆர்டர்" },
              { value: "webapp", label: "Website / web app", tamil: "வெப்சைட் / வெப் ஆப்" },
              { value: "whatsapp", label: "WhatsApp replies", tamil: "வாட்ஸ்அப் பதில்" },
              { value: "marketing", label: "Digital marketing", tamil: "டிஜிட்டல் மார்க்கெட்டிங்" },
              { value: "video", label: "Video business", tamil: "வீடியோ பிசினஸ்" },
              { value: "attendance", label: "Attendance / HR", tamil: "அட்டெண்டன்ஸ்" },
              { value: "ai", label: "AI chatbot", tamil: "ஏஐ சாட்பாட்" },
              { value: "cctv", label: "CCTV / tracking", tamil: "சிசிடிவி / டிராக்கிங்" },
              { value: "training", label: "IT training", tamil: "ஐடி பயிற்சி" },
              { value: "other", label: "Any other", tamil: "வேறு", detail: true }
            ]
          },
          ...NEXT_FIELDS
        ]
      }
    ]
  }
};

const state = {
  lang: loadLang(),
  view: "home",
  formId: null,
  step: 0,
  answers: {},
  errors: {},
  stepError: false,
  resumed: false,
  editingId: null,
  editingNo: null,
  editingCreated: null,
  savedLeadId: null,
  leadFilter: "all",
  leadQuery: "",
  confirmClear: false,
  confirmDeleteId: null,
  pinError: "",
  persisted: null,
  pinFails: 0,
  pinLockUntil: 0,
  toast: ""
};

function hasPresence(answers) {
  return Array.isArray(answers.have) && answers.have.some((value) => value !== "nothing");
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function normalizeMobile(value) {
  let digits = String(value ?? "").replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return digits;
}

function prettyMobile(value) {
  const digits = normalizeMobile(value);
  return digits.length === 10 ? digits.replace(/(\d{5})(\d{5})/, "$1 $2") : digits;
}

function toggleMulti(current, value, options) {
  const option = options.find((item) => item.value === value);
  let selected = Array.isArray(current) ? [...current] : [];
  const exclusive = options.filter((item) => item.exclusive).map((item) => item.value);
  if (option && option.exclusive) {
    return selected.length === 1 && selected[0] === value ? [] : [value];
  }
  selected = selected.filter((item) => !exclusive.includes(item));
  if (selected.includes(value)) return selected.filter((item) => item !== value);
  selected.push(value);
  return selected;
}

function visibleFields(form, stepIndex, answers) {
  return form.steps[stepIndex].fields.filter((field) => !field.showIf || field.showIf(answers));
}

function validateFields(fields, answers) {
  const errors = {};
  fields.forEach((field) => {
    const value = answers[field.key];
    if (field.required) {
      const empty = field.type === "ticks"
        ? !Array.isArray(value) || value.length === 0
        : !String(value ?? "").trim();
      if (empty) errors[field.key] = field.error || (field.type === "text" || field.type === "tel" || field.type === "note" ? "Please fill this" : "Please choose one");
    }
    if ((field.type === "text" || field.type === "note") && field.required && String(value ?? "").trim().length < 2) {
      errors[field.key] = "Please enter at least 2 letters";
    }
    if (field.type === "tel" && String(value ?? "").trim()) {
      if (!/^[6-9]\d{9}$/.test(normalizeMobile(value))) {
        errors[field.key] = "Enter a valid 10-digit mobile number";
      }
    }
    if ((field.type === "chips" || field.type === "ticks") && field.options) {
      const selected = field.type === "chips" ? [value] : (Array.isArray(value) ? value : []);
      const needsDetail = selected.some((item) => field.options.some((option) => option.value === item && option.detail));
      if (needsDetail && !String(answers[field.key + "Detail"] ?? "").trim()) {
        errors[field.key + "Detail"] = "Please type a short detail";
      }
    }
  });
  return errors;
}

function findField(formId, key) {
  const form = FORMS[formId];
  if (!form) return null;
  for (const step of form.steps) {
    const field = step.fields.find((item) => item.key === key);
    if (field) return field;
  }
  return null;
}

function displayValue(field, answers) {
  const value = answers[field.key];
  if (field.type === "ticks") {
    if (!Array.isArray(value) || !value.length) return "";
    return value.map((item) => optionText(field, item, answers)).join(", ");
  }
  if (field.type === "chips") {
    if (!value) return "";
    return optionText(field, value, answers);
  }
  if (field.type === "tel") return prettyMobile(value);
  return String(value ?? "").trim();
}

function optionText(field, value, answers) {
  const option = (field.options || []).find((item) => item.value === value);
  if (!option) return value;
  if (option.detail) return String(answers[field.key + "Detail"] ?? "").trim() || option.label;
  return option.label;
}

function answerRows(formId, answers) {
  const form = FORMS[formId];
  const rows = [];
  form.steps.forEach((step) => {
    step.fields.forEach((field) => {
      if (field.showIf && !field.showIf(answers)) return;
      const value = displayValue(field, answers);
      if (!value) return;
      rows.push({ key: field.key, label: field.label, value });
    });
  });
  return rows;
}

function summarize(formId, answers) {
  const map = Object.fromEntries(answerRows(formId, answers).map((row) => [row.key, row.value]));
  const place = [map.businessType, map.city].filter(Boolean).join(", ");
  const who = `${map.business || "Business"}${place ? ` (${place})` : ""}`;
  if (formId === "software") {
    const using = map.software ? `${map.currentMethod}: ${map.software}` : map.currentMethod;
    return [
      `${who} manages work with ${using || "an unknown method"}.`,
      map.problems ? `Problems: ${map.problems}.` : "",
      map.needs ? `Wants: ${map.needs}.` : "",
      map.requirement ? `Requirement: ${map.requirement}.` : "",
      map.referred ? `Reference: ${map.referred}.` : "",
      map.next ? `Next: ${map.next}.` : ""
    ].filter(Boolean).join(" ");
  }
  if (formId === "website") {
    return [
      `${who} has ${map.have || "not said what they have"}.`,
      map.creator ? `Created by: ${map.creator}.` : "",
      map.presenceName ? `Site/app: ${map.presenceName}.` : "",
      map.website3d ? `3D website: ${map.website3d}.` : "",
      map.problems ? `Problems: ${map.problems}.` : "",
      map.needs ? `Wants: ${map.needs}.` : "",
      map.requirement ? `Requirement: ${map.requirement}.` : "",
      map.referred ? `Reference: ${map.referred}.` : "",
      map.next ? `Next: ${map.next}.` : ""
    ].filter(Boolean).join(" ");
  }
  return [
    `${who} works ${map.workMode || "in an unknown way"}.`,
    map.toolPlan ? `Current tool: ${map.toolPlan}${map.toolName ? ` (${map.toolName})` : ""}.` : "",
    map.problems ? `Problems: ${map.problems}.` : "",
    map.needs ? `Wants to automate: ${map.needs}.` : "",
    map.requirement ? `Requirement: ${map.requirement}.` : "",
    map.referred ? `Reference: ${map.referred}.` : "",
    map.next ? `Next: ${map.next}.` : ""
  ].filter(Boolean).join(" ");
}

function offersFor(formId, answers) {
  const needs = Array.isArray(answers.needs) ? answers.needs : [];
  const next = Array.isArray(answers.next) ? answers.next : [];
  const offers = ["Free pen when you show this lead number"];
  if (needs.includes("static")) offers.unshift("Static website offer — ₹5,000");
  if (needs.includes("ecommerce")) offers.unshift("15% off ecommerce services");
  if (next.includes("demo")) offers.push("Free live demo at this stall");
  if (next.includes("trial")) offers.push("Free trial");
  offers.push("Form filled — ask the team about the expo form offer");
  return offers;
}

function formatStamp(iso) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(iso));
}

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !Array.isArray(parsed.leads)) return { seq: 0, rev: 0, leads: [], deleted: [] };
    return { seq: Number(parsed.seq) || 0, rev: Number(parsed.rev) || 0, leads: parsed.leads, deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [] };
  } catch (error) {
    return { seq: 0, rev: 0, leads: [], deleted: [] };
  }
}

/* rev counts every write, so the app can tell how many changes a backup does not cover yet. */
function saveDB(db) {
  db.rev = (Number(db.rev) || 0) + 1;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/* Every tablet gets its own short code, so lead numbers read K7-012 and never clash when tablets are combined. */
const TABLET_CODE_PATTERN = /^[A-Z0-9]{1,3}$/;
const CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_DIGITS = "23456789";

function randomTabletCode() {
  const pick = (chars) => chars[Math.floor(Math.random() * chars.length)];
  return pick(CODE_LETTERS) + pick(CODE_DIGITS);
}

function normalizeTabletCode(value) {
  const code = String(value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return TABLET_CODE_PATTERN.test(code) ? code : "";
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    const settings = {
      pin: parsed.pin || DEFAULT_PIN,
      teamWhatsapp: parsed.teamWhatsapp || DEFAULT_PHONE,
      lastExportAt: parsed.lastExportAt || "",
      lastBackupAt: parsed.lastBackupAt || "",
      backupRev: Number(parsed.backupRev) || 0,
      tabletCode: normalizeTabletCode(parsed.tabletCode),
      syncKey: String(parsed.syncKey || ""),
      serverUrl: String(parsed.serverUrl || ""),
      syncedRev: Number(parsed.syncedRev) || 0,
      lastSyncAt: parsed.lastSyncAt || ""
    };
    if (!settings.tabletCode) {
      settings.tabletCode = randomTabletCode();
      saveSettings(settings);
    }
    return settings;
  } catch (error) {
    return { pin: DEFAULT_PIN, teamWhatsapp: DEFAULT_PHONE, lastExportAt: "", lastBackupAt: "", backupRev: 0, tabletCode: "A1", syncKey: "", serverUrl: "", syncedRev: 0, lastSyncAt: "" };
  }
}

function tabletCode() {
  return loadSettings().tabletCode;
}

/* Legacy leads without a tablet code fall back to this tablet's code. */
function leadLabel(lead) {
  return `${lead.tablet || tabletCode()}-${String(lead.no).padStart(3, "0")}`;
}

function pendingChanges() {
  return Math.max(0, loadDB().rev - loadSettings().backupRev);
}

function markBackedUp() {
  const settings = loadSettings();
  settings.lastBackupAt = new Date().toISOString();
  settings.backupRev = loadDB().rev;
  saveSettings(settings);
}

function backupFileName() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `MR-Rokesh-leads-backup-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.json`;
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function teamNumber() {
  const digits = normalizeMobile(loadSettings().teamWhatsapp);
  return digits.length === 10 ? "91" + digits : "91" + DEFAULT_PHONE;
}

function uid() {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
}

function leadCount() {
  return loadDB().leads.length;
}

function isDirty(answers) {
  return Object.values(answers).some((value) => Array.isArray(value) ? value.length > 0 : String(value ?? "").trim());
}

function saveDraft() {
  if (typeof sessionStorage === "undefined" || !state.formId) return;
  try {
    sessionStorage.setItem("draft:" + state.formId, JSON.stringify({
      step: state.step,
      answers: state.answers,
      editingId: state.editingId,
      editingNo: state.editingNo,
      editingCreated: state.editingCreated
    }));
  } catch (error) {
    /* Draft is a convenience. The saved lead still matters. */
  }
}

function loadDraft(formId) {
  if (typeof sessionStorage === "undefined") return null;
  try {
    return JSON.parse(sessionStorage.getItem("draft:" + formId) || "null");
  } catch (error) {
    return null;
  }
}

function clearDraft(formId) {
  if (typeof sessionStorage === "undefined") return;
  try { sessionStorage.removeItem("draft:" + formId); } catch (error) { /* ignore */ }
}

function staffOpen() {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem("staffOk") === "1";
}

function setHash(hash) {
  if (typeof location === "undefined") return;
  const next = hash ? "#" + hash : location.pathname + location.search;
  if ((hash && location.hash === "#" + hash) || (!hash && (location.hash === "" || location.hash === "#"))) return;
  history.replaceState(null, "", next);
}

/* Tap-to-act contact buttons: call, WhatsApp, email, Instagram, Facebook, website, directions. */
function contactIcon(name) {
  const common = 'viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const paths = {
    call: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    whatsapp: '<path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.6L3 21z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-2-1-.9.7a4 4 0 0 1-1.7-1.7l.7-.9-1-2L9 9.5z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.8" fill="currentColor"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z"/>',
    website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    map: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
  };
  return `<svg ${common}>${paths[name]}</svg>`;
}

function contactBlock(withAddress) {
  const hello = encodeURIComponent("Hello MR Rokesh Softwares, I visited your stall at " + EVENT_NAME + ".");
  const items = [
    { id: "call", cls: "c-call", href: `tel:+91${DEFAULT_PHONE}`, en: "Call us", ta: "அழைக்க" },
    { id: "whatsapp", cls: "c-wa", href: `https://wa.me/91${DEFAULT_PHONE}?text=${hello}`, en: "WhatsApp", ta: "வாட்ஸ்அப்", ext: true },
    { id: "email", cls: "c-mail", href: `mailto:${EMAIL}`, en: "Email us", ta: "மின்னஞ்சல்" },
    { id: "instagram", cls: "c-ig", href: INSTAGRAM_URL, en: "Instagram", ta: "இன்ஸ்டாகிராம்", ext: true },
    { id: "facebook", cls: "c-fb", href: FACEBOOK_URL, en: "Facebook", ta: "பேஸ்புக்", ext: true },
    { id: "website", cls: "c-web", href: `https://${SITE}`, en: "Website", ta: "வெப்சைட்", ext: true },
    { id: "map", cls: "c-map", href: MAPS_URL, en: "Directions", ta: "வழி காட்டி", ext: true }
  ];
  const buttons = items.map((item) => `<a class="cta ${item.cls}" href="${esc(item.href)}"${item.ext ? ' target="_blank" rel="noopener"' : ""}>
      ${contactIcon(item.id)}<span class="cta-text">${bi(item.en, item.ta)}</span>
    </a>`).join("");
  const address = withAddress
    ? `<address class="contact-address">${ADDRESS_LINES.map(esc).join("<br>")}<br><a href="mailto:${EMAIL}">${EMAIL}</a> · <a href="tel:+91${DEFAULT_PHONE}">+91 ${prettyMobile(DEFAULT_PHONE)}</a></address>`
    : "";
  return `<section class="contact" aria-label="Contact MR Rokesh">
    <h2 class="contact-title">${bi("Talk to us · Follow us", "எங்களுடன் பேசுங்கள் · பின்தொடருங்கள்")}</h2>
    <div class="cta-grid">${buttons}</div>
    ${address}
  </section>`;
}

function icon(name) {
  const common = 'viewBox="0 0 32 32" fill="none" aria-hidden="true"';
  if (name === "software") {
    return `<svg ${common}><rect x="5" y="6" width="22" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 12h22M11 22v4M8 26h16" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  if (name === "website") {
    return `<svg ${common}><rect x="6" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M6 12h20M12 25h8" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  return `<svg ${common}><path d="M18 4L8 18h7l-1 10 10-14h-7l1-10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

function render() {
  const app = document.getElementById("app");
  const active = document.activeElement;
  const focusKey = active && active.dataset ? active.dataset.field : "";
  const caret = active && typeof active.selectionStart === "number" ? active.selectionStart : null;
  app.dataset.lang = state.lang;
  app.innerHTML = renderView();
  document.title = documentTitle();
  if (!idleWarnShown) armIdle();
  if (!focusKey) return;
    const safeKey = window.CSS && CSS.escape ? CSS.escape(focusKey) : focusKey.replace(/[^a-zA-Z0-9_-]/g, "");
    const field = app.querySelector(`[data-field="${safeKey}"]`);
  if (!field) return;
  field.focus();
  if (caret == null || !field.setSelectionRange) return;
  try { field.setSelectionRange(caret, caret); } catch (error) { /* number inputs */ }
}

function documentTitle() {
  if (state.view === "form" && FORMS[state.formId]) return FORMS[state.formId].title + " | MR Rokesh";
  if (state.view === "leads" || state.view === "lead" || state.view === "pin") return "Stall leads | MR Rokesh";
  return "MR Rokesh | BUB Expo Lead Form";
}

function renderView() {
  if (state.view === "form") return renderForm();
  if (state.view === "success") return renderSuccess();
  if (state.view === "pin") return renderPin();
  if (state.view === "leads") return renderLeads();
  if (state.view === "lead") return renderLead();
  return renderHome();
}

function renderHome() {
  const count = leadCount();
  const cards = Object.values(FORMS).map((form, index) => `
    <button class="choice ${form.id}" type="button" data-action="open" data-form="${form.id}">
      <span class="choice-no">0${index + 1}</span>
      <span class="choice-icon">${icon(form.id)}</span>
      <span class="choice-title">${esc(pick(form.title, form.tamil))}</span>
      ${state.lang === "both" ? `<span class="choice-ta" lang="ta">${esc(form.tamil)}</span>` : ""}
      <span class="choice-copy">${state.lang === "ta" ? `<span lang="ta">${esc(form.cardTamil)}</span>` : esc(form.copy) + (state.lang === "both" ? `<br><span lang="ta">${esc(form.cardTamil)}</span>` : "")}</span>
      <span class="choice-go">${ui("tapStart")}</span>
    </button>
  `).join("");
  return `<div class="shell wide">
    ${topbar(true)}
    <main class="home">
      <img class="hero-logo" src="logo.webp" alt="MR Rokesh - Absolute Control" width="150" height="150">
      <div class="event">${EVENT_NAME} · Salem · ${STALL} · 15–17 Oct</div>
      <h1>${esc(uiPlain("tapOne"))}</h1>
      ${state.lang === "both" ? `<p class="ta-line" lang="ta">${esc(UI.tapOne[1])}</p>` : ""}
      <p class="lede">${ui("homeLede")}</p>
      <div class="offer-strip">${ui("offerStrip", null, true)}</div>
      <div class="cards">${cards}</div>
      ${contactBlock(true)}
    </main>
  </div>`;
}

function langSwitch() {
  const buttons = LANGS.map((item) => `<button class="lang-btn${state.lang === item.id ? " on" : ""}" type="button" data-action="lang" data-value="${item.id}" aria-pressed="${state.lang === item.id ? "true" : "false"}"${item.id === "en" ? "" : ' lang="ta"'}>${item.label}</button>`).join("");
  return `<div class="langbar" role="group" aria-label="Language / மொழி"><span class="lang-title">Language · மொழி</span><div class="lang-seg">${buttons}</div></div>`;
}

function topbar(showLeads, showLang) {
  const count = leadCount();
  return `${langBarFor(showLang)}<header class="topbar">
    <button class="brand" type="button" data-action="home">
      <img class="mark-img" src="logo.webp" alt="MR Rokesh" width="52" height="52">
      <span>
        <span class="brand-name">MR ROKESH</span>
        <span class="brand-sub">SOFTWARES</span>
      </span>
    </button>
    ${showLeads ? `<button class="ghost" type="button" data-action="leads">Leads${count ? `<span class="count-pill${pendingChanges() >= BACKUP_NUDGE * 2 ? " warn" : ""}">${count}</span>` : ""}</button>` : ""}
  </header>`;
}

/* The language bar sits above the header on visitor screens; staff screens skip it. */
function langBarFor(showLang) {
  return showLang === false ? "" : langSwitch();
}

function renderForm() {
  const form = FORMS[state.formId];
  const step = form.steps[state.step];
  const fields = visibleFields(form, state.step, state.answers).map(renderField).join("");
  const last = state.step === form.steps.length - 1;
  return `<div class="shell" style="--accent:${form.accent}" data-accent="${form.id}">
    ${topbar(false)}
    <form class="form-wrap" data-submit="next" novalidate>
      <p class="form-title">${esc(pick(form.title, form.tamil))}</p>
      ${state.lang === "both" ? `<p class="form-ta" lang="ta">${esc(form.tamil)}</p>` : ""}
      <div class="progress" aria-hidden="true">
        ${form.steps.map((_, index) => `<span class="${index < state.step ? "on" : ""} ${index === state.step ? "now" : ""}"></span>`).join("")}
      </div>
      <p class="step-label">${esc(uiPlain("step", { n: state.step + 1 }))} · ${esc(pick(step.title, step.tamil))}</p>
      ${state.lang === "both" ? `<p class="step-ta" lang="ta">${esc(UI.step[1].replace("{n}", state.step + 1))} · ${esc(step.tamil)}</p>` : ""}
      ${state.resumed ? `<div class="resume"><span>${ui("resume")}</span><button class="linkish" type="button" data-action="fresh">${ui("fresh")}</button></div>` : ""}
      ${state.stepError ? `<div class="banner" role="alert">${ui("fixBanner")}</div>` : ""}
      ${state.step === 0 ? `<p class="lede">${ui("consent")}</p>` : ""}
      ${fields}
      <div class="dock">
        <button class="btn btn-back" type="button" data-action="back">${state.step === 0 ? ui("home") : ui("back")}</button>
        <button class="btn btn-primary" type="submit">${last ? ui("save") : ui("cont")}</button>
      </div>
    </form>
  </div>`;
}

function renderField(field) {
  const error = state.errors[field.key];
  const detailError = state.errors[field.key + "Detail"];
  const value = state.answers[field.key];
  const label = field.key === "problems" && state.formId === "website" && Array.isArray(state.answers.have) && state.answers.have.includes("nothing")
    ? "What is the difficulty today?"
    : field.label;
  const tamilMode = state.lang === "ta";
  const shownLabel = pick(label, TA[label]);
  const placeholder = (text) => esc(pick(text || "", TA[text]));
  let control = "";
  if (field.type === "text" || field.type === "tel") {
    control = `<input class="field" data-field="${field.key}" type="${field.type === "tel" ? "tel" : "text"}" inputmode="${field.type === "tel" ? "numeric" : "text"}" autocomplete="${esc(field.autocomplete || "off")}" placeholder="${placeholder(field.placeholder)}" value="${esc(value || "")}">`;
  } else if (field.type === "note") {
    control = `<textarea class="area" data-field="${field.key}" maxlength="200" placeholder="${placeholder(field.placeholder)}">${esc(value || "")}</textarea>`;
  } else {
    const selected = field.type === "chips" ? [value] : (Array.isArray(value) ? value : []);
    const chips = field.options.map((option) => {
      const on = selected.includes(option.value);
      const main = pick(option.label, option.tamil);
      const mainLang = tamilMode && option.tamil ? ' lang="ta"' : "";
      return `<button class="chip${on ? " on" : ""}${option.emphasis ? " emphasis" : ""}" type="button" data-action="chip" data-key="${field.key}" data-value="${esc(option.value)}" aria-pressed="${on ? "true" : "false"}">
        <span class="chip-en"${mainLang}>${on ? `<span class="tick" aria-hidden="true">✓</span>` : ""}${esc(main)}</span>
        ${state.lang === "both" && option.tamil ? `<span class="chip-ta" lang="ta">${esc(option.tamil)}</span>` : ""}
      </button>`;
    }).join("");
    const showDetail = selected.some((item) => field.options.some((option) => option.value === item && option.detail));
    const detail = showDetail
      ? `<input class="field" style="margin-top:8px" data-field="${field.key}Detail" type="text" placeholder="${placeholder("Type the other detail")}" value="${esc(state.answers[field.key + "Detail"] || "")}">`
      : "";
    control = `<div class="chips" role="group" aria-label="${esc(shownLabel)}">${chips}</div>${detail}`;
  }
  return `<div class="q${field.staff ? " staff" : ""}${error || detailError ? " invalid" : ""}">
    <span class="q-label"${tamilMode && TA[label] ? ' lang="ta"' : ""}>${esc(shownLabel)}${field.required ? ` <span class="req">*</span>` : ""}</span>
    ${field.hint && state.lang !== "en" && !(tamilMode && field.hint === shownLabel) ?`<span class="q-hint" lang="ta">${esc(field.hint)}</span>` : ""}
    ${control}
    ${error ? `<p class="err">${bi(error, TA[error])}</p>` : ""}
    ${detailError ? `<p class="err">${bi(detailError, TA[detailError])}</p>` : ""}
  </div>`;
}

function renderSuccess() {
  const db = loadDB();
  const lead = db.leads.find((item) => item.id === state.savedLeadId);
  if (!lead) return renderHome();
  const form = FORMS[lead.formId];
  const offers = offersFor(lead.formId, lead.answers).map((offer) => `<li>${bi(offer, TA[offer])}</li>`).join("");
  return `<div class="shell" style="--accent:${form.accent}">
    ${topbar(true)}
    <main class="success">
      <article class="ticket">
        <div class="ticket-head">
          <p class="ticket-kicker">MR ROKESH · ${EVENT_NAME} · ${STALL}</p>
          <p class="ticket-no">${esc(leadLabel(lead))}</p>
        </div>
        <div class="ticket-body">
          <h2>${esc(lead.answers.name || "")}</h2>
          <p class="muted">${esc(lead.answers.business || "")} · ${esc(prettyMobile(lead.mobile))}</p>
          <p class="summary">${esc(lead.summary)}</p>
          <ul class="offers">${offers}</ul>
          <p class="fine">${ui("ticketFine")}</p>
        </div>
      </article>
      ${trackerPanel(lead)}
      ${contactBlock(false)}
      <div class="stack">
        <button class="btn btn-wa" type="button" data-action="whatsapp-visitor" data-id="${lead.id}">WhatsApp the visitor</button>
        <button class="btn btn-primary" type="button" data-action="whatsapp-team" data-id="${lead.id}">Send lead to our team</button>
        <button class="btn btn-line" type="button" data-action="edit" data-id="${lead.id}">Edit this lead</button>
        <button class="btn btn-primary" type="button" data-action="nextvisitor">Next visitor</button>
      </div>
    </main>
  </div>`;
}

function renderPin() {
  const hint = "Enter the staff PIN";
  return `<div class="shell">
    ${topbar(false, false)}
    <main class="pin">
      <h1>Stall leads</h1>
      <p class="lede">Leads stay on this tablet until you export them.</p>
      ${state.pinError ? `<div class="banner" role="alert">${esc(state.pinError)}</div>` : ""}
      <form data-submit="unlock">
        <label class="q">
          <span class="q-label">Staff PIN</span>
          <span class="q-hint">${esc(hint)}</span>
          <input class="field" data-field="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="4 digits">
        </label>
        <button class="btn btn-primary" type="submit">Open leads</button>
      </form>
    </main>
  </div>`;
}

function renderLeads() {
  const db = loadDB();
  const settings = loadSettings();
  const pending = Math.max(0, db.rev - settings.backupRev);
  const query = state.leadQuery.trim().toLowerCase();
  const leads = db.leads.filter((lead) => {
    if (state.leadFilter !== "all" && lead.formId !== state.leadFilter) return false;
    if (!query) return true;
    const blob = `${leadLabel(lead)} ${lead.answers.name} ${lead.answers.business} ${lead.mobile} ${lead.summary}`.toLowerCase();
    return blob.includes(query);
  }).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const filters = ["all", "software", "website", "automate"].map((id) => {
    const label = id === "all" ? `All ${db.leads.length}` : `${FORMS[id].short} ${db.leads.filter((lead) => lead.formId === id).length}`;
    return `<button class="filter${state.leadFilter === id ? " on" : ""}" type="button" data-action="filter" data-value="${id}">${label}</button>`;
  }).join("");
  const list = leads.length
    ? leads.map((lead) => `<button class="lead" type="button" data-action="openlead" data-id="${lead.id}">
        <b>${esc(leadLabel(lead))} ${esc(lead.answers.name || "")}</b>
        <span><span class="badge ${lead.formId}">${esc(FORMS[lead.formId].short)}</span>${penGiven(lead.tracker) < penOwed(lead.tracker) ? `<span class="badge due">Pen due</span>` : ""}${esc(lead.answers.business || "")}</span>
        <span>${esc(prettyMobile(lead.mobile))} · ${esc(formatStamp(lead.createdAt))}</span>
      </button>`).join("")
    : `<div class="empty">No leads on this filter yet.</div>`;
  return `<div class="shell wide">
    ${topbar(false, false)}
    <main class="leads">
      ${state.toast ? `<div class="toast" role="status">${esc(state.toast)}</div>` : ""}
      <h1>Leads</h1>
      ${settings.pin === DEFAULT_PIN ? `<div class="banner" role="alert">The default staff PIN is still in use. Open Tablet settings below and change it.</div>` : ""}
      ${pending >= BACKUP_NUDGE ? `<div class="banner" role="alert">${pending} changes are not backed up yet. <button class="linkish" type="button" data-action="share-backup">Share a backup now</button></div>` : ""}
      <p class="lede">${db.leads.length} saved on this tablet (code ${esc(settings.tabletCode)}).${settings.lastExportAt ? ` Last Excel export ${esc(formatStamp(settings.lastExportAt))}.` : " No Excel export yet."}<br>${settings.lastBackupAt ? `Last backup ${esc(formatStamp(settings.lastBackupAt))}${pending ? ` · ${pending} change${pending === 1 ? "" : "s"} since` : " · up to date"}.` : "Never backed up. Share a backup to WhatsApp or Drive."}</p>
      <p class="lede">${esc(syncLine(db, settings))}</p>
      ${db.leads.length ? tallyCard(db.leads) : ""}
      <input class="field" data-field="leadQuery" type="search" placeholder="Search name, shop, or mobile" value="${esc(state.leadQuery)}">
      <div class="filters" style="margin-top:10px">${filters}</div>
      ${list}
      <div class="tools">
        <button class="btn btn-primary" type="button" data-action="export">Export Excel</button>
        <button class="btn btn-primary" type="button" data-action="syncnow">Sync now</button>
        <button class="btn btn-primary" type="button" data-action="share-backup">Share backup (WhatsApp / Drive)</button>
        <button class="btn btn-line" type="button" data-action="backup">Download backup file</button>
        <button class="btn btn-line" type="button" data-action="lock">Lock leads</button>
      </div>
      <button class="btn btn-danger" type="button" data-action="clear">${state.confirmClear ? "Tap again to delete all" : "Delete all leads"}</button>
      <details class="settings">
        <summary>Tablet settings</summary>
        <p class="help">1. Pick the form that matches the chat.<br>2. The visitor taps. You can tap for them.<br>3. Save, note the lead number, and give the pen.<br>4. Share a backup every few hours, and Export Excel at day end.</p>
        <div class="install">
          <p class="q-label">Home-screen app</p>
          ${isInstalled()
            ? `<p class="help">✓ Installed on this tablet.</p>`
            : installPrompt
              ? `<button class="btn btn-primary" type="button" data-action="install">Install app on this tablet</button>`
              : `<p class="help">Open the https address in Chrome, then menu ⋮ → Install app (or Add to Home screen). On iPad / iPhone: Safari Share → Add to Home Screen.</p>`}
          <p class="help">Data protection: ${state.persisted === true ? "✓ on, the browser will not clear leads to free space." : state.persisted === false ? "off. The browser may clear leads if the tablet runs low on space. Installing the app usually turns it on. Back up often." : "checking…"}</p>
        </div>
        <div class="install">
          <p class="q-label">Cloud sync</p>
          <p class="help">Sends every lead to your database so all tablets end up in one place. Ask the office for the sync key. Leave the server address empty when this page is opened from the sync server itself.</p>
          <label class="q"><span class="q-label">Sync key</span><input class="field" data-field="syncKey" type="password" autocomplete="off" value="${esc(settings.syncKey)}"></label>
          <label class="q"><span class="q-label">Server address (optional)</span><input class="field" data-field="serverUrl" type="url" placeholder="https://expo.mrrokesh.com" value="${esc(settings.serverUrl)}"></label>
          <button class="btn btn-line" type="button" data-action="savesync">Save and test connection</button>
        </div>
        <label class="q"><span class="q-label">Tablet code</span><span class="q-hint">Lead numbers on this tablet look like ${esc(settings.tabletCode)}-001. Give every tablet a different code (A, B, C…) so numbers never clash. Changing it only affects new leads.</span><input class="field" data-field="tabletCode" maxlength="3" autocapitalize="characters" value="${esc(settings.tabletCode)}"></label>
        <button class="btn btn-line" type="button" data-action="savetablet">Save tablet code</button>
        <label class="q"><span class="q-label">Team WhatsApp</span><input class="field" data-field="teamWhatsapp" inputmode="numeric" value="${esc(settings.teamWhatsapp)}"></label>
        <button class="btn btn-line" type="button" data-action="savewa">Save WhatsApp number</button>
        <label class="q"><span class="q-label">New PIN</span><input class="field" data-field="newPin" inputmode="numeric" maxlength="4" placeholder="4 digits"></label>
        <button class="btn btn-line" type="button" data-action="savepin">Change PIN</button>
        <label class="q"><span class="q-label">Restore or combine backups</span><span class="q-hint">Pick one or more backup files, for example from every tablet. Leads are merged, nothing is overwritten by an older copy.</span><input id="importFile" type="file" accept="application/json,.json" multiple></label>
      </details>
    </main>
  </div>`;
}

function renderLead() {
  const lead = loadDB().leads.find((item) => item.id === state.openLeadId);
  if (!lead) return renderLeads();
  const rows = answerRows(lead.formId, lead.answers).map((row) => `<div class="row"><small>${esc(row.label)}</small><b>${esc(row.value)}</b></div>`).join("");
  return `<div class="shell">
    ${topbar(false, false)}
    <main class="leads">
      <button class="linkish" type="button" data-action="backleads">← All leads</button>
      <h1>${esc(leadLabel(lead))}</h1>
      <p class="lede">${esc(FORMS[lead.formId].title)} · ${esc(formatStamp(lead.createdAt))}</p>
      <div class="rows">${rows}</div>
      <p class="summary">${esc(lead.summary)}</p>
      ${trackerPanel(lead)}
      <div class="stack">
        <button class="btn btn-wa" type="button" data-action="whatsapp-visitor" data-id="${lead.id}">WhatsApp the visitor</button>
        <button class="btn btn-primary" type="button" data-action="whatsapp-team" data-id="${lead.id}">Send lead to our team</button>
        <button class="btn btn-line" type="button" data-action="edit" data-id="${lead.id}">Edit</button>
        <button class="btn btn-danger" type="button" data-action="delete" data-id="${lead.id}">${state.confirmDeleteId === lead.id ? "Tap again to delete" : "Delete lead"}</button>
      </div>
    </main>
  </div>`;
}

function openForm(formId, useDraft) {
  const draft = useDraft === false ? null : loadDraft(formId);
  state.view = "form";
  state.formId = formId;
  state.step = draft && Number.isInteger(draft.step) ? draft.step : 0;
  state.answers = draft && draft.answers ? draft.answers : {};
  state.errors = {};
  state.stepError = false;
  state.resumed = !!(draft && isDirty(draft.answers || {}));
  state.editingId = draft ? draft.editingId || null : null;
  state.editingNo = draft ? draft.editingNo || null : null;
  state.editingCreated = draft ? draft.editingCreated || null : null;
  setHash(formId);
  render();
  window.scrollTo(0, 0);
}

function goHome() {
  state.view = "home";
  state.stepError = false;
  state.errors = {};
  setHash("");
  render();
  window.scrollTo(0, 0);
}

function goBack() {
  if (state.view === "form" && state.step > 0) {
    state.step -= 1;
    state.errors = {};
    state.stepError = false;
    saveDraft();
    render();
    window.scrollTo(0, 0);
    return;
  }
  goHome();
}

function goNext() {
  const form = FORMS[state.formId];
  const fields = visibleFields(form, state.step, state.answers);
  const errors = validateFields(fields, state.answers);
  state.errors = errors;
  state.stepError = Object.keys(errors).length > 0;
  if (state.stepError) {
    render();
    requestAnimationFrame(() => {
      const invalid = document.querySelector(".invalid");
      if (invalid) invalid.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }
  if (state.step < form.steps.length - 1) {
    state.step += 1;
    saveDraft();
    render();
    window.scrollTo(0, 0);
    return;
  }
  saveLead();
}

function saveLead() {
  const answers = { ...state.answers, mobile: normalizeMobile(state.answers.mobile) };
  let db;
  try {
    db = loadDB();
  } catch (error) {
    db = { seq: 0, leads: [] };
  }
  const previous = state.editingId ? db.leads.find((item) => item.id === state.editingId) : null;
  const lead = {
    tracker: previous && previous.tracker ? previous.tracker : {},
    tablet: previous && previous.tablet ? previous.tablet : tabletCode(),
    id: state.editingId || uid(),
    no: state.editingId ? state.editingNo : db.seq + 1,
    formId: state.formId,
    createdAt: state.editingId ? state.editingCreated : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mobile: answers.mobile,
    answers,
    summary: summarize(state.formId, answers)
  };
  if (!state.editingId) db.seq += 1;
  const index = db.leads.findIndex((item) => item.id === lead.id);
  if (index >= 0) db.leads[index] = lead;
  else db.leads.push(lead);
  try {
    saveDB(db);
  } catch (error) {
    state.stepError = true;
    state.errors = { next: "This tablet could not store the lead. Export a backup, then try again." };
    render();
    return;
  }
  clearDraft(state.formId);
  state.savedLeadId = lead.id;
  state.editingId = null;
  state.view = "success";
  setHash("saved");
  render();
  window.scrollTo(0, 0);
  setTimeout(() => syncNow(false), 300);
}

function visitorMessage(lead) {
  const first = String(lead.answers.name || "").trim().split(/\s+/)[0] || "there";
  return `Hello ${first}, thank you for visiting MR Rokesh Softwares at ${EVENT_NAME}, ${STALL}, Salem.\n\nWe noted your requirement. Our team will contact you for the next step.\n\n${SITE}\n+91 ${prettyMobile(DEFAULT_PHONE)}\nInstagram: ${INSTAGRAM_URL}\nFacebook: ${FACEBOOK_URL}`;
}

function teamMessage(lead) {
  return [
    `${EVENT_NAME} · ${STALL}`,
    `Lead ${leadLabel(lead)} · ${FORMS[lead.formId].title}`,
    `Name: ${lead.answers.name}`,
    `Mobile: ${prettyMobile(lead.mobile)}`,
    `Business: ${lead.answers.business}`,
    "",
    lead.summary,
    "",
    SITE
  ].join("\n");
}

function openWhatsApp(number, message) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function exportCsv() {
  const leads = loadDB().leads.slice().sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const headers = ["Lead No", "Tablet", "Saved at", "Form", "Name", "Mobile", "Business", "Business type", "City", "How they work today", "Software / site / tool", "What they want", "Problems", "3D website", "Requirement", "Reference", "Next step", "Staff note", "Summary", "Pen given", "Sticker given", "Instagram follow", "Google Play install", "Google review", "Wheel spun", "Wheel prize", "80% form offer", "Vibeo bonus"];
  const lines = [headers.join(",")];
  leads.forEach((lead) => {
    const map = Object.fromEntries(answerRows(lead.formId, lead.answers).map((row) => [row.key, row.value]));
    const situation = map.currentMethod || map.have || map.workMode || "";
    const tool = [map.software, map.creator, map.presenceName, map.toolPlan, map.toolName].filter(Boolean).join(" | ");
    const row = [leadLabel(lead), lead.tablet || tabletCode(), formatStamp(lead.createdAt), FORMS[lead.formId].title, map.name, lead.mobile, map.business, map.businessType, map.city, situation, tool, map.needs, map.problems, map.website3d, map.requirement, map.referred, map.next, map.staffNote, lead.summary];
    const t = lead.tracker || {};
    const yes = (flag) => (t[flag] ? "Yes" : "No");
    row.push(penGiven(t) ? "Yes" : "No", yes("sticker"), yes("instagram"), yes("playstore"), yes("review"), yes("wheel"), t.wheelPrize || "", yes("form80"), yes("vibeo"));
    lines.push(row.map(csvCell).join(","));
  });
  downloadFile(`MR-Rokesh-${EVENT_NAME.replace(/\s+/g, "-")}-Leads.csv`, "\uFEFF" + lines.join("\r\n"), "text/csv;charset=utf-8");
  const settings = loadSettings();
  settings.lastExportAt = new Date().toISOString();
  saveSettings(settings);
  toast("Excel file downloaded.");
}

function exportJson() {
  downloadFile(backupFileName(), JSON.stringify(loadDB(), null, 2), "application/json");
  markBackedUp();
  toast("Backup downloaded.");
}

/* Hands the backup file to WhatsApp, Drive, email, etc. Falls back to a download where sharing files is not supported. */
async function shareBackup() {
  const file = new File([JSON.stringify(loadDB(), null, 2)], backupFileName(), { type: "application/json" });
  if (!(navigator.canShare && navigator.canShare({ files: [file] }))) {
    exportJson();
    return;
  }
  try {
    await navigator.share({ files: [file], title: "MR Rokesh leads backup" });
    markBackedUp();
    toast("Backup shared.");
  } catch (error) {
    if (error && error.name !== "AbortError") toast("Could not share. Use Backup JSON instead.");
  }
}

/* Cloud sync. Tablets always save locally first, then push to the server whenever it is reachable. */
const SYNC_BATCH = 100;
const SYNC_EVERY_MS = 60 * 1000;
const PULL_EVERY_MS = 10 * 60 * 1000;
let syncing = false;
let lastPullAt = 0;
const syncState = { error: "" };

async function syncRequest(settings, path, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(settings.serverUrl.replace(/\/+$/, "") + path, {
      ...init,
      headers: { "Content-Type": "application/json", "x-sync-key": settings.syncKey },
      signal: controller.signal,
      cache: "no-store"
    });
    if (response.status === 401) throw new Error("Wrong sync key.");
    if (response.status === 429) throw new Error("Too many wrong keys. Wait a minute.");
    if (!response.ok) throw new Error(`Server problem (${response.status}).`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError" || error instanceof TypeError) throw new Error("Server not reachable.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/* Pushes this tablet's leads when anything changed, and now and then pulls the other tablets' leads. */
async function syncNow(manual) {
  const settings = loadSettings();
  if (!settings.syncKey) {
    if (manual) toast("Add the sync key in Tablet settings first.");
    return false;
  }
  if (syncing) return false;
  if (navigator.onLine === false) {
    if (manual) toast("No internet. Leads are safe on this tablet and will sync later.");
    return false;
  }
  syncing = true;
  try {
    const db = loadDB();
    const revAtStart = db.rev;
    if (manual || revAtStart > settings.syncedRev) {
      for (let i = 0; i < db.leads.length; i += SYNC_BATCH) {
        await syncRequest(settings, "/api/leads/sync", { method: "POST", body: JSON.stringify({ leads: db.leads.slice(i, i + SYNC_BATCH) }) });
      }
    }
    let pulled = null;
    if (manual || Date.now() - lastPullAt > PULL_EVERY_MS) {
      const data = await syncRequest(settings, "/api/leads", { method: "GET" });
      lastPullAt = Date.now();
      const fresh = loadDB();
      pulled = mergeLeads(fresh, Array.isArray(data.leads) ? data.leads : [], settings.tabletCode);
      if (pulled.added || pulled.updated) saveDB(fresh);
    }
    const after = loadSettings();
    after.syncedRev = Math.max(after.syncedRev, revAtStart);
    after.lastSyncAt = new Date().toISOString();
    saveSettings(after);
    syncState.error = "";
    if (manual) toast(pulled && (pulled.added || pulled.updated) ? `Synced. Got ${pulled.added} new and ${pulled.updated} updated from other tablets.` : "Synced. Everything is up to date.");
    else if (state.view === "leads") render();
    return true;
  } catch (error) {
    syncState.error = error.message;
    if (manual) toast(`Sync failed: ${error.message} Leads are safe on this tablet.`);
    else if (state.view === "leads") render();
    return false;
  } finally {
    syncing = false;
  }
}

function syncLine(db, settings) {
  if (!settings.syncKey) return "Cloud sync: not set up. Leads stay on this tablet only.";
  const waiting = Math.max(0, db.rev - settings.syncedRev);
  const plural = `${waiting} change${waiting === 1 ? "" : "s"}`;
  if (syncState.error) return `Cloud sync problem: ${syncState.error} ${plural} waiting.`;
  if (waiting) return `Cloud sync: ${plural} waiting to send.`;
  return settings.lastSyncAt ? `Cloud sync: ✓ up to date (${formatStamp(settings.lastSyncAt)}).` : "Cloud sync: set up. Waiting for the first sync.";
}

async function saveSyncSettings() {
  const keyInput = document.querySelector('[data-field="syncKey"]');
  const urlInput = document.querySelector('[data-field="serverUrl"]');
  const syncKey = keyInput ? keyInput.value.trim() : "";
  const serverUrl = urlInput ? urlInput.value.trim().replace(/\/+$/, "") : "";
  if (serverUrl && !/^https?:\/\/[^\s]+$/i.test(serverUrl)) {
    toast("Server address must start with https:// (or leave it empty).");
    return;
  }
  const settings = loadSettings();
  settings.syncKey = syncKey;
  settings.serverUrl = serverUrl;
  settings.syncedRev = 0;
  saveSettings(settings);
  syncState.error = "";
  if (!syncKey) {
    toast("Cloud sync turned off on this tablet.");
    return;
  }
  try {
    const info = await syncRequest(loadSettings(), "/api/ping", { method: "GET" });
    toast(`Connected. ${info.leads} lead${info.leads === 1 ? "" : "s"} on the server. Syncing now…`);
    await syncNow(true);
  } catch (error) {
    syncState.error = error.message;
    toast(`Saved, but could not connect: ${error.message}`);
  }
}

/* Install to the home screen and ask the browser not to clear this site's data. */
let installPrompt = null;

function isInstalled() {
  return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
}

async function installApp() {
  if (!installPrompt) return;
  installPrompt.prompt();
  try { await installPrompt.userChoice; } catch (error) { /* dismissed */ }
  installPrompt = null;
  render();
}

function protectStorage() {
  if (!(navigator.storage && navigator.storage.persist)) return;
  navigator.storage.persisted()
    .then((already) => already || navigator.storage.persist())
    .then((granted) => { state.persisted = !!granted; })
    .catch(() => { state.persisted = false; });
}

function downloadFile(name, contents, type) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* Merge leads from other tablets or backups into db. Same id: the newer edit wins. Only this tablet's own leads move its counter. */
function mergeLeads(db, incoming, myCode) {
  const result = { added: 0, updated: 0, unchanged: 0, skipped: 0 };
  const gone = new Set(db.deleted || []);
  incoming.forEach((lead) => {
    if (!lead || !lead.id || !FORMS[lead.formId]) { result.skipped += 1; return; }
    if (gone.has(lead.id)) { result.unchanged += 1; return; }
    const index = db.leads.findIndex((item) => item.id === lead.id);
    if (index < 0) {
      db.leads.push(lead);
      result.added += 1;
    } else if (String(lead.updatedAt || lead.createdAt || "") > String(db.leads[index].updatedAt || db.leads[index].createdAt || "")) {
      db.leads[index] = lead;
      result.updated += 1;
    } else {
      result.unchanged += 1;
    }
    if ((lead.tablet || myCode) === myCode) db.seq = Math.max(db.seq, Number(lead.no) || 0);
  });
  return result;
}

function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        const incoming = Array.isArray(parsed) ? parsed : parsed.leads;
        if (!Array.isArray(incoming)) throw new Error("bad");
        resolve(incoming);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function importBackups(files) {
  const db = loadDB();
  const code = tabletCode();
  const total = { added: 0, updated: 0, unchanged: 0, skipped: 0 };
  let bad = 0;
  for (const file of files) {
    try {
      const result = mergeLeads(db, await readBackupFile(file), code);
      Object.keys(total).forEach((key) => { total[key] += result[key]; });
    } catch (error) {
      bad += 1;
    }
  }
  if (bad === files.length) {
    toast(files.length === 1 ? "That file is not a lead backup." : "None of those files are lead backups.");
    return;
  }
  try {
    saveDB(db);
  } catch (error) {
    toast("This tablet could not store the leads. Export what you have first.");
    return;
  }
  toast(`Added ${total.added}, updated ${total.updated}, already up to date ${total.unchanged}${bad ? `, ${bad} file${bad === 1 ? "" : "s"} not readable` : ""}.`);
}

function toast(message) {
  state.toast = message;
  render();
  setTimeout(() => {
    if (state.toast !== message) return;
    state.toast = "";
    if (state.view === "leads") render();
  }, 2400);
}

function onChip(key, value) {
  const field = findField(state.formId, key);
  if (!field) return;
  if (field.type === "chips") {
    state.answers[key] = state.answers[key] === value ? "" : value;
  } else {
    state.answers[key] = toggleMulti(state.answers[key], value, field.options);
  }
  delete state.errors[key];
  delete state.errors[key + "Detail"];
  if (!Object.keys(state.errors).length) state.stepError = false;
  saveDraft();
  render();
}

function onClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || button.type === "submit") return;
  const action = button.dataset.action;
  if (action === "home") goHome();
  if (action === "lang") {
    state.lang = LANGS.some((item) => item.id === button.dataset.value) ? button.dataset.value : "both";
    saveLang(state.lang);
    render();
    return;
  }
  if (action === "open") openForm(button.dataset.form);
  if (action === "chip") onChip(button.dataset.key, button.dataset.value);
  if (action === "back") goBack();
  if (action === "fresh") {
    clearDraft(state.formId);
    state.answers = {};
    state.step = 0;
    state.resumed = false;
    state.editingId = null;
    state.editingNo = null;
    state.editingCreated = null;
    state.errors = {};
    render();
  }
  if (action === "leads") {
    state.pinError = "";
    if (staffOpen()) {
      state.view = "leads";
      setHash("leads");
      render();
    } else {
      state.view = "pin";
      setHash("leads");
      render();
    }
  }
  if (action === "nextvisitor") {
    state.answers = {};
    state.step = 0;
    state.formId = null;
    state.editingId = null;
    goHome();
  }
  if (action === "edit") editLead(button.dataset.id);
  if (action === "whatsapp-visitor") {
    const lead = loadDB().leads.find((item) => item.id === button.dataset.id);
    if (lead) openWhatsApp("91" + lead.mobile, visitorMessage(lead));
  }
  if (action === "whatsapp-team") {
    const lead = loadDB().leads.find((item) => item.id === button.dataset.id);
    if (lead) openWhatsApp(teamNumber(), teamMessage(lead));
  }
  if (action === "filter") {
    state.leadFilter = button.dataset.value;
    render();
  }
  if (action === "openlead") {
    state.openLeadId = button.dataset.id;
    state.confirmDeleteId = null;
    state.view = "lead";
    render();
  }
  if (action === "backleads") {
    state.view = "leads";
    render();
  }
  if (action === "syncnow") {
    syncNow(true);
    return;
  }
  if (action === "savesync") {
    saveSyncSettings();
    return;
  }
  if (action === "share-backup") {
    shareBackup();
    return;
  }
  if (action === "install") {
    installApp();
    return;
  }
  if (action === "track") {
    const key = button.dataset.key;
    if (TRACK_ITEMS.some((item) => item.key === key) && updateTracker(button.dataset.id, (t) => { t[key] = !t[key]; })) render();
    return;
  }
  if (action === "pens") {
    if (updateTracker(button.dataset.id, (t) => { t.pensGiven = penGiven(t) ? 0 : 1; })) render();
    return;
  }
  if (action === "lock") {
    resetForNextVisitor();
    return;
  }
  if (action === "export") exportCsv();
  if (action === "backup") exportJson();
  if (action === "clear") {
    if (!state.confirmClear) {
      state.confirmClear = true;
      render();
      setTimeout(() => {
        state.confirmClear = false;
        if (state.view === "leads") render();
      }, 4000);
      return;
    }
    const before = loadDB();
    saveDB({ seq: before.seq, rev: before.rev, leads: [], deleted: before.deleted.concat(before.leads.map((lead) => lead.id)) });
    state.confirmClear = false;
    toast("All leads deleted on this tablet. Copies already sent to the server stay there.");
  }
  if (action === "delete") {
    if (state.confirmDeleteId !== button.dataset.id) {
      state.confirmDeleteId = button.dataset.id;
      render();
      return;
    }
    const db = loadDB();
    db.leads = db.leads.filter((lead) => lead.id !== button.dataset.id);
    db.deleted = db.deleted.concat(button.dataset.id);
    saveDB(db);
    state.view = "leads";
    toast("Lead deleted on this tablet. A copy already sent to the server stays there.");
  }
  if (action === "savetablet") {
    const input = document.querySelector('[data-field="tabletCode"]');
    const code = normalizeTabletCode(input ? input.value : "");
    if (!code) {
      toast("Use 1 to 3 letters or digits, like A or K7.");
      return;
    }
    const settings = loadSettings();
    settings.tabletCode = code;
    saveSettings(settings);
    toast(`Tablet code saved: ${code}. New leads will be ${code}-001 onwards.`);
    return;
  }
  if (action === "savewa") {
    const input = document.querySelector('[data-field="teamWhatsapp"]');
    const digits = normalizeMobile(input ? input.value : "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      toast("Enter a 10-digit WhatsApp number.");
      return;
    }
    const settings = loadSettings();
    settings.teamWhatsapp = digits;
    saveSettings(settings);
    toast("WhatsApp number saved.");
  }
  if (action === "savepin") {
    const input = document.querySelector('[data-field="newPin"]');
    const pin = input ? input.value.trim() : "";
    if (!/^\d{4}$/.test(pin)) {
      toast("PIN must be 4 digits.");
      return;
    }
    const settings = loadSettings();
    settings.pin = pin;
    saveSettings(settings);
    toast("PIN changed.");
  }
}

function onInput(event) {
  const key = event.target.dataset.field;
  if (!key) return;
  if (key === "leadQuery") {
    state.leadQuery = event.target.value;
    render();
    return;
  }
  if (key === "trackPrize") {
    updateTracker(event.target.dataset.id, (t) => { t.wheelPrize = event.target.value.slice(0, 60); });
    return;
  }
  if (key === "pin" || key === "teamWhatsapp" || key === "newPin" || key === "tabletCode" || key === "syncKey" || key === "serverUrl") return;
  state.answers[key] = event.target.value;
  saveDraft();
  delete state.errors[key];
  const box = event.target.closest(".q");
  if (box) {
    box.classList.remove("invalid");
    const messages = box.querySelectorAll(".err");
    messages.forEach((message, index) => {
      if (index === 0) message.remove();
    });
  }
}

function onSubmit(event) {
  event.preventDefault();
  const action = event.target.dataset.submit;
  if (action === "next") goNext();
  if (action === "unlock") {
    const input = event.target.querySelector("[data-field=pin]");
    const pin = input ? input.value.trim() : "";
    const waitMs = state.pinLockUntil - Date.now();
    if (waitMs > 0) {
      state.pinError = `Too many wrong tries. Wait ${Math.ceil(waitMs / 1000)} seconds.`;
      render();
    } else if (pin === loadSettings().pin) {
      sessionStorage.setItem("staffOk", "1");
      state.pinError = "";
      state.pinFails = 0;
      state.view = "leads";
      render();
    } else {
      state.pinFails += 1;
      if (state.pinFails >= PIN_MAX_TRIES) {
        state.pinFails = 0;
        state.pinLockUntil = Date.now() + PIN_LOCK_MS;
        state.pinError = "Too many wrong tries. Wait 1 minute.";
      } else {
        state.pinError = "Wrong PIN. Try again.";
      }
      render();
    }
  }
}

function onChange(event) {
  if (event.target.id === "importFile" && event.target.files && event.target.files.length) {
    importBackups([...event.target.files]);
  }
}

function editLead(id) {
  const lead = loadDB().leads.find((item) => item.id === id);
  if (!lead) return;
  state.view = "form";
  state.formId = lead.formId;
  state.step = 0;
  state.answers = JSON.parse(JSON.stringify(lead.answers));
  state.editingId = lead.id;
  state.editingNo = lead.no;
  state.editingCreated = lead.createdAt;
  state.resumed = false;
  state.errors = {};
  state.stepError = false;
  setHash(lead.formId);
  render();
  window.scrollTo(0, 0);
}

/* Idle handling: warn, then clear the screen and lock the staff area. */
let idleWarnTimer = null;
let idleResetTimer = null;
let idleWarnShown = false;

function idlePlan() {
  if (state.view === "form") return { warn: VISITOR_WARN_MS, reset: VISITOR_RESET_MS };
  if (state.view === "success") return { warn: TICKET_WARN_MS, reset: TICKET_RESET_MS };
  if (state.view === "pin" || state.view === "leads" || state.view === "lead") return { warn: 0, reset: STAFF_LOCK_MS };
  return null;
}

function armIdle() {
  clearTimeout(idleWarnTimer);
  clearTimeout(idleResetTimer);
  hideIdleWarning();
  const plan = idlePlan();
  if (!plan) return;
  if (plan.warn) idleWarnTimer = setTimeout(showIdleWarning, plan.warn);
  idleResetTimer = setTimeout(resetForNextVisitor, plan.reset);
}

function showIdleWarning() {
  let box = document.getElementById("idle");
  if (!box) {
    box = document.createElement("div");
    box.id = "idle";
    box.className = "idle";
    box.addEventListener("click", armIdle);
    document.body.appendChild(box);
  }
  box.innerHTML = `<div class="idle-card" role="alertdialog" aria-live="assertive"><h2>${ui("idleTitle")}</h2><p>${ui("idleBody")}</p></div>`;
  box.hidden = false;
  idleWarnShown = true;
}

function hideIdleWarning() {
  const box = document.getElementById("idle");
  if (box) box.hidden = true;
  idleWarnShown = false;
}

/* Drop every visitor detail held in memory or in drafts, lock the leads area, and go home. */
function resetForNextVisitor() {
  Object.keys(FORMS).forEach(clearDraft);
  try { sessionStorage.removeItem("staffOk"); } catch (error) { /* ignore */ }
  Object.assign(state, {
    formId: null, step: 0, answers: {}, errors: {}, stepError: false, resumed: false,
    editingId: null, editingNo: null, editingCreated: null, savedLeadId: null, openLeadId: null,
    leadQuery: "", confirmClear: false, confirmDeleteId: null, pinError: ""
  });
  hideIdleWarning();
  goHome();
}

function init() {
  const app = document.getElementById("app");
  ["pointerdown", "keydown", "input", "scroll"].forEach((name) => {
    document.addEventListener(name, () => { if (!idleWarnShown) armIdle(); }, true);
  });
  app.addEventListener("click", onClick);
  app.addEventListener("input", onInput);
  app.addEventListener("submit", onSubmit);
  app.addEventListener("change", onChange);
  routeFromHash();
  window.addEventListener("hashchange", routeFromHash);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    if (state.view === "leads") render();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    if (state.view === "leads") render();
  });
  protectStorage();
  window.addEventListener("online", () => syncNow(false));
  setInterval(() => syncNow(false), SYNC_EVERY_MS);
  setTimeout(() => syncNow(false), 3000);
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function routeFromHash() {
  const hash = (location.hash || "").replace("#", "");
  if (hash === "saved" && state.view === "success") return;
  if (hash === "leads") {
    state.pinError = "";
    state.view = staffOpen() ? "leads" : "pin";
    render();
    return;
  }
  if (FORMS[hash]) {
    if (state.view !== "form" || state.formId !== hash) openForm(hash);
    return;
  }
  state.view = "home";
  state.stepError = false;
  state.errors = {};
  render();
}

function runTests() {
  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }
  assert(normalizeMobile("+91 98765 43210") === "9876543210", "plus 91");
  assert(normalizeMobile("09876543210") === "9876543210", "leading zero");
  assert(normalizeMobile("919876543210") === "9876543210", "91 prefix");
  assert(normalizeMobile("5876543210") === "5876543210", "short stays");

  const have = findField("website", "have").options;
  assert(toggleMulti([], "website", have).join() === "website", "add website");
  assert(toggleMulti(["website", "app"], "nothing", have).join() === "nothing", "exclusive nothing");
  assert(toggleMulti(["nothing"], "app", have).join() === "app", "leave exclusive");
  assert(toggleMulti(["website"], "website", have).length === 0, "deselect");

  const problems = findField("software", "problems").options;
  assert(toggleMulti(["slow", "improve"], "noproblem", problems).join() === "noproblem", "no problem clears");

  const empty = validateFields(visibleFields(FORMS.software, 0, {}), {});
  assert(empty.name && empty.mobile && empty.business, "step 1 required");
  const badMobile = validateFields(visibleFields(FORMS.software, 0, {}), {
    name: "Asha", mobile: "12345", business: "Shop", businessType: "shop", city: "salem"
  });
  assert(badMobile.mobile, "bad mobile");
  const good = validateFields(visibleFields(FORMS.software, 0, {}), {
    name: "Asha", mobile: "+91 98765 43210", business: "Sri Stores", businessType: "shop", city: "salem"
  });
  assert(Object.keys(good).length === 0, "valid step 1");

  const manualFields = visibleFields(FORMS.software, 1, { currentMethod: "manual" }).map((field) => field.key);
  assert(!manualFields.includes("software"), "hide software when manual");
  const paidFields = visibleFields(FORMS.software, 1, { currentMethod: "paid" }).map((field) => field.key);
  assert(paidFields.includes("software"), "show software when paid");

  const noSite = visibleFields(FORMS.website, 1, { have: ["nothing"] }).map((field) => field.key);
  assert(!noSite.includes("creator"), "hide creator when nothing");
  const hasSite = visibleFields(FORMS.website, 1, { have: ["website"] }).map((field) => field.key);
  assert(hasSite.includes("creator"), "show creator");

  const detailErrors = validateFields([{
    key: "software",
    type: "chips",
    required: true,
    options: [{ value: "other", label: "Other", detail: true }]
  }], { software: "other" });
  assert(detailErrors.softwareDetail, "other needs detail");

  Object.values(FORMS).forEach((form) => {
    assert(form.steps.length === 3, form.id + " steps");
    const keys = [];
    form.steps.forEach((step) => {
      step.fields.forEach((field) => {
        assert(field.key && field.label && field.type, "field shape");
        assert(!keys.includes(field.key), "duplicate " + field.key);
        keys.push(field.key);
        if (field.options) field.options.forEach((option) => assert(option.value && option.label, "option"));
      });
    });
  });

  /* Every visitor-facing question, placeholder and error needs Tamil, except staff-only text. */
  Object.values(FORMS).forEach((form) => {
    form.steps.forEach((step) => {
      assert(step.tamil, form.id + " step Tamil");
      step.fields.forEach((field) => {
        assert(TA[field.label], "Tamil label: " + field.label);
        if (field.placeholder) assert(TA[field.placeholder], "Tamil placeholder: " + field.placeholder);
        if (field.error) assert(TA[field.error], "Tamil error: " + field.error);
        if (field.options) field.options.forEach((option) => {
          if (option.tamil === undefined) assert(["tally", "busy", "zoho", "marg", "vyapar", "mybillbook"].includes(option.value), "Tamil option: " + option.label);
        });
      });
    });
  });
  ["Please fill this", "Please choose one", "Please enter at least 2 letters", "Enter a valid 10-digit mobile number", "Please type a short detail", "Type the other detail"]
    .forEach((text) => assert(TA[text], "Tamil message: " + text));
  offersFor("website", { needs: ["static", "ecommerce"], next: ["demo", "trial"] })
    .forEach((offer) => assert(TA[offer], "Tamil offer: " + offer));
  Object.keys(UI).forEach((key) => assert(UI[key][0] && UI[key][1], "UI pair " + key));

  assert(penOwed() === 1 && penOwed({ instagram: true, playstore: true, review: true }) === 1, "one pen per visitor, whatever they ticked");
  assert(penGiven({ pensGiven: 99 }) === 1 && penGiven({ pensGiven: -2 }) === 0 && penGiven() === 0, "pen given is 0 or 1");
  const tally = trackerTally([{ tracker: { instagram: true, pensGiven: 1 } }, {}, { tracker: { form80: true, wheel: true, pensGiven: 1 } }]);
  assert(tally.owed === 3 && tally.given === 2 && tally.instagram === 1 && tally.form80 === 1 && tally.wheel === 1, "tally totals");

  assert(normalizeTabletCode(" k7 ") === "K7" && normalizeTabletCode("a-b") === "AB" && normalizeTabletCode("") === "" && normalizeTabletCode("ABCD") === "", "tablet code rules");
  assert(/^[A-HJ-NP-Z][2-9]$/.test(randomTabletCode()), "random tablet code shape");
  assert(leadLabel({ tablet: "K7", no: 12 }) === "K7-012", "lead label");
  assert(leadLabel({ tablet: "B", no: 1 }) !== leadLabel({ tablet: "A", no: 1 }), "same number on two tablets stays unique");

  const mineA = { id: "a1", tablet: "A", no: 3, formId: "software", createdAt: "2026-10-15T09:00:00Z", updatedAt: "2026-10-15T09:00:00Z" };
  const theirsB = { id: "b1", tablet: "B", no: 40, formId: "website", createdAt: "2026-10-15T09:05:00Z", updatedAt: "2026-10-15T09:05:00Z" };
  const db = { seq: 3, rev: 0, leads: [mineA] };
  const merged = mergeLeads(db, [theirsB, { ...mineA, updatedAt: "2026-10-15T10:00:00Z", summary: "edited" }, { id: "x" }, null], "A");
  assert(merged.added === 1 && merged.updated === 1 && merged.skipped === 2, "merge counts");
  assert(db.seq === 3, "another tablet's numbers do not move this counter");
  assert(db.leads.find((l) => l.id === "a1").summary === "edited", "newer copy wins");
  const older = mergeLeads(db, [{ ...mineA, updatedAt: "2026-10-15T08:00:00Z", summary: "stale" }], "A");
  assert(older.unchanged === 1 && db.leads.find((l) => l.id === "a1").summary === "edited", "older copy never overwrites");
  mergeLeads(db, [{ id: "a2", tablet: "A", no: 9, formId: "software", createdAt: "2026-10-15T11:00:00Z" }], "A");
  assert(db.seq === 9, "own leads from a backup move the counter");

  const withGone = { seq: 0, rev: 0, deleted: ["a1"], leads: [] };
  const goneResult = mergeLeads(withGone, [{ id: "a1", tablet: "A", no: 1, formId: "software", createdAt: "2026-10-15T09:00:00Z" }], "A");
  assert(withGone.leads.length === 0 && goneResult.added === 0, "a deleted lead does not come back from the server");

  const savedView = state.view;
  state.view = "home";
  assert(idlePlan() === null, "no idle timer on home");
  state.view = "form";
  assert(idlePlan().reset === VISITOR_RESET_MS && idlePlan().warn < idlePlan().reset, "form idle plan");
  state.view = "success";
  assert(idlePlan().reset === TICKET_RESET_MS, "ticket idle plan");
  state.view = "leads";
  assert(idlePlan().reset === STAFF_LOCK_MS && idlePlan().warn === 0, "staff lock plan");
  state.view = savedView;

  const summary = summarize("software", {
    name: "Asha",
    mobile: "9876543210",
    business: "Sri Stores",
    businessType: "shop",
    city: "salem",
    currentMethod: "paid",
    software: "tally",
    problems: ["slow"],
    needs: ["billing", "erp"],
    next: ["demo", "trial"]
  });
  assert(summary.includes("Sri Stores"), "summary business");
  assert(summary.includes("Tally"), "summary software");
  assert(summary.includes("Free demo"), "summary demo");
  assert(offersFor("website", { needs: ["static", "ecommerce"], next: ["demo"] }).some((item) => item.includes("₹5,000")), "static offer");

  console.log("All lead form tests passed.");
}

const isBrowser = typeof document !== "undefined" && typeof document.getElementById === "function";
if (isBrowser) init();
else if (typeof process !== "undefined" && process.argv && process.argv.includes("--test")) runTests();
