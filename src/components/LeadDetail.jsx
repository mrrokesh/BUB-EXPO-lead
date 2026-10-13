import { useState } from "react";
import { FORMS } from "../data/forms.js";
import { answerRows, leadLabel, teamMessage, visitorMessage, whatsappUrl } from "../lib/leads.js";
import { formatStamp } from "../lib/format.js";
import { loadDB, saveDB, teamNumber } from "../lib/storage.js";
import { useApp } from "../store.jsx";
import { useDb, useSettings } from "../hooks/useData.js";
import { Shell, TopBar } from "./Layout.jsx";
import { TrackerPanel } from "./TrackerPanel.jsx";
import { Btn, LinkButton } from "./ui.jsx";

export function LeadDetail() {
  const { openLeadId, backToLeads, editLead, toast } = useApp();
  const db = useDb();
  const settings = useSettings();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const lead = db.leads.find((item) => item.id === openLeadId);
  if (!lead) return null;
  const open = (url) => window.open(url, "_blank", "noopener");

  const remove = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    const fresh = loadDB();
    fresh.leads = fresh.leads.filter((item) => item.id !== lead.id);
    fresh.deleted = fresh.deleted.concat(lead.id);
    saveDB(fresh);
    toast("Lead deleted on this tablet. A copy already sent to the server stays there.");
    backToLeads();
  };

  return (
    <Shell>
      <TopBar showLang={false} />
      <main className="px-4 pt-1.5 pb-8">
        <LinkButton onClick={backToLeads}>← All leads</LinkButton>
        <h1 className="mt-3.5 mb-1 text-[34px] leading-[1.05] font-bold tracking-[-0.04em]">{leadLabel(lead, settings.tabletCode)}</h1>
        <p className="mb-3.5 text-[15px] leading-[1.45] text-muted">{FORMS[lead.formId].title} · {formatStamp(lead.createdAt)}</p>
        <div className="my-3 grid gap-2">
          {answerRows(lead.formId, lead.answers).map((row) => (
            <div key={row.key} className="rounded-2xl bg-white px-3 py-2.5">
              <small className="block text-xs font-bold text-muted">{row.label}</small>
              <b className="mt-0.5 block text-[15px]">{row.value}</b>
            </div>
          ))}
        </div>
        <p className="my-3 rounded-2xl bg-[#f6f8fd] p-3 text-sm leading-[1.45] whitespace-pre-wrap">{lead.summary}</p>
        <TrackerPanel lead={lead} />
        <div className="mt-2 grid gap-2">
          <Btn variant="wa" onClick={() => open(whatsappUrl("91" + lead.mobile, visitorMessage(lead)))}>WhatsApp the visitor</Btn>
          <Btn onClick={() => open(whatsappUrl(teamNumber(), teamMessage(lead, settings.tabletCode)))}>Send lead to our team</Btn>
          <Btn variant="line" onClick={() => editLead(lead.id)}>Edit</Btn>
          <Btn variant="danger" onClick={remove}>{confirmDelete ? "Tap again to delete" : "Delete lead"}</Btn>
        </div>
      </main>
    </Shell>
  );
}
