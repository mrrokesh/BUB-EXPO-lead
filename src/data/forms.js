// The three lead forms: steps, questions and answer options.
export function hasPresence(answers) {
  return Array.isArray(answers.have) && answers.have.some((value) => value !== "nothing");
}

export const ABOUT_FIELDS = [
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

export const NEXT_FIELDS = [
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

export const FORMS = {
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

