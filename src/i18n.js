// Tamil text. The language switch picks English, Tamil, or both.
/* Language: "en" = English only, "ta" = Tamil only, "both" = English with Tamil under it. */
export const LANGS = [
  { id: "en", label: "English" },
  { id: "ta", label: "தமிழ்" },
  { id: "both", label: "English + தமிழ்" }
];

/* Tamil for every question label, placeholder and error. Missing entries fall back to English. */
export const TA = {
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
export const UI = {
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
