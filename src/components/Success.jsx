import { EVENT_NAME, STALL } from "../config.js";
import { FORMS } from "../data/forms.js";
import { Bi, Ui } from "../lang.jsx";
import { TA } from "../i18n.js";
import { offersFor, leadLabel, teamMessage, visitorMessage, whatsappUrl } from "../lib/leads.js";
import { prettyMobile } from "../lib/format.js";
import { teamNumber } from "../lib/storage.js";
import { useApp } from "../store.jsx";
import { useDb, useSettings } from "../hooks/useData.js";
import { ContactBlock } from "./ContactBlock.jsx";
import { Shell, TopBar } from "./Layout.jsx";
import { TrackerPanel } from "./TrackerPanel.jsx";
import { Btn } from "./ui.jsx";

export function Success() {
  const { savedLeadId, editLead, nextVisitor } = useApp();
  const db = useDb();
  const settings = useSettings();
  const lead = db.leads.find((item) => item.id === savedLeadId);
  if (!lead) return null;
  const form = FORMS[lead.formId];
  const offers = offersFor(lead.formId, lead.answers);
  const open = (url) => window.open(url, "_blank", "noopener");

  return (
    <Shell accent={form.accent}>
      <TopBar showLeads />
      <main className="px-4 pt-2 pb-7">
        <article className="overflow-hidden rounded-3xl bg-white shadow-card">
          <div className="bg-[linear-gradient(110deg,#071a66_0%,#0c3dff_58%,#ff5c1c_100%)] px-[18px] pt-[18px] pb-4 text-white">
            <p className="m-0 text-xs font-extrabold tracking-[0.08em] opacity-85">MR ROKESH · {EVENT_NAME} · {STALL}</p>
            <p className="mt-1 text-[64px] leading-[0.9] font-extrabold tracking-[-0.04em]">{leadLabel(lead, settings.tabletCode)}</p>
          </div>
          <div className="px-[18px] pt-4 pb-[18px]">
            <h2 className="mb-1 text-[26px] font-bold tracking-[-0.03em]">{lead.answers.name}</h2>
            <p className="m-0 text-muted">{lead.answers.business} · {prettyMobile(lead.mobile)}</p>
            <p className="my-3 rounded-2xl bg-[#f6f8fd] p-3 text-sm leading-[1.45] whitespace-pre-wrap">{lead.summary}</p>
            <ul className="m-0 mb-3 flex list-none flex-wrap gap-1.5 p-0">
              {offers.map((offer) => (
                <li key={offer} className="rounded-full bg-[#fff3ec] px-2.5 py-1.5 text-xs font-extrabold text-[#9a3412]">
                  <Bi en={offer} ta={TA[offer]} />
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-xs text-muted"><Ui k="ticketFine" /></p>
          </div>
        </article>

        <TrackerPanel lead={lead} />
        <ContactBlock />

        <div className="mt-2 grid gap-2">
          <Btn variant="wa" onClick={() => open(whatsappUrl("91" + lead.mobile, visitorMessage(lead)))}>WhatsApp the visitor</Btn>
          <Btn onClick={() => open(whatsappUrl(teamNumber(), teamMessage(lead, settings.tabletCode)))}>Send lead to our team</Btn>
          <Btn variant="line" onClick={() => editLead(lead.id)}>Edit this lead</Btn>
          <Btn onClick={nextVisitor}>Next visitor</Btn>
        </div>
      </main>
    </Shell>
  );
}
