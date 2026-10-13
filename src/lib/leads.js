/* Lead rules: validation, summaries, offers, merging, messages and the Excel (CSV) export. */
import { EVENT_NAME, STALL, SITE, DEFAULT_PHONE, INSTAGRAM_URL, FACEBOOK_URL } from "../config.js";
import { FORMS } from "../data/forms.js";
import { normalizeMobile, prettyMobile, formatStamp } from "./format.js";
import { penGiven } from "./tracker.js";

export function leadLabel(lead, fallbackCode) {
  return `${lead.tablet || fallbackCode || "?"}-${String(lead.no).padStart(3, "0")}`;
}

export function toggleMulti(current, value, options) {
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

export function visibleFields(form, stepIndex, answers) {
  return form.steps[stepIndex].fields.filter((field) => !field.showIf || field.showIf(answers));
}

export function validateFields(fields, answers) {
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

export function findField(formId, key) {
  const form = FORMS[formId];
  if (!form) return null;
  for (const step of form.steps) {
    const field = step.fields.find((item) => item.key === key);
    if (field) return field;
  }
  return null;
}

export function isDirty(answers) {
  return Object.values(answers).some((value) => (Array.isArray(value) ? value.length > 0 : String(value ?? "").trim()));
}

function optionText(field, value, answers) {
  const option = (field.options || []).find((item) => item.value === value);
  if (!option) return value;
  if (option.detail) return String(answers[field.key + "Detail"] ?? "").trim() || option.label;
  return option.label;
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

export function answerRows(formId, answers) {
  const rows = [];
  FORMS[formId].steps.forEach((step) => {
    step.fields.forEach((field) => {
      if (field.showIf && !field.showIf(answers)) return;
      const value = displayValue(field, answers);
      if (!value) return;
      rows.push({ key: field.key, label: field.label, value });
    });
  });
  return rows;
}

export function summarize(formId, answers) {
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

export function offersFor(formId, answers) {
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

/* Merge leads from other tablets, the server or a backup into db. Same id: the newer edit wins.
   Only this tablet's own leads move its counter, and deleted leads stay deleted. */
export function mergeLeads(db, incoming, myCode) {
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

/* ---- Messages ---- */
export function visitorMessage(lead) {
  const first = String(lead.answers.name || "").trim().split(/\s+/)[0] || "there";
  return `Hello ${first}, thank you for visiting MR Rokesh Softwares at ${EVENT_NAME}, ${STALL}, Salem.\n\nWe noted your requirement. Our team will contact you for the next step.\n\n${SITE}\n+91 ${prettyMobile(DEFAULT_PHONE)}\nInstagram: ${INSTAGRAM_URL}\nFacebook: ${FACEBOOK_URL}`;
}

export function teamMessage(lead, code) {
  return [
    `${EVENT_NAME} · ${STALL}`,
    `Lead ${leadLabel(lead, code)} · ${FORMS[lead.formId].title}`,
    `Name: ${lead.answers.name}`,
    `Mobile: ${prettyMobile(lead.mobile)}`,
    `Business: ${lead.answers.business}`,
    "",
    lead.summary,
    "",
    SITE
  ].join("\n");
}

export function whatsappUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* ---- Excel (CSV) export ---- */
export function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export const CSV_HEADERS = ["Lead No", "Tablet", "Saved at", "Form", "Name", "Mobile", "Business", "Business type", "City", "How they work today", "Software / site / tool", "What they want", "Problems", "3D website", "Requirement", "Reference", "Next step", "Staff note", "Summary", "Pen given", "Sticker given", "Instagram follow", "Google Play install", "Google review", "Wheel spun", "Wheel prize", "80% form offer", "Vibeo bonus"];

export function buildCsv(allLeads, code) {
  const leads = allLeads.slice().sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const lines = [CSV_HEADERS.join(",")];
  leads.forEach((lead) => {
    const map = Object.fromEntries(answerRows(lead.formId, lead.answers).map((row) => [row.key, row.value]));
    const situation = map.currentMethod || map.have || map.workMode || "";
    const tool = [map.software, map.creator, map.presenceName, map.toolPlan, map.toolName].filter(Boolean).join(" | ");
    const t = lead.tracker || {};
    const yes = (flag) => (t[flag] ? "Yes" : "No");
    const row = [
      leadLabel(lead, code), lead.tablet || code, formatStamp(lead.createdAt), FORMS[lead.formId].title,
      map.name, lead.mobile, map.business, map.businessType, map.city, situation, tool, map.needs, map.problems,
      map.website3d, map.requirement, map.referred, map.next, map.staffNote, lead.summary,
      penGiven(t) ? "Yes" : "No", yes("sticker"), yes("instagram"), yes("playstore"), yes("review"), yes("wheel"), t.wheelPrize || "", yes("form80"), yes("vibeo")
    ];
    lines.push(row.map(csvCell).join(","));
  });
  return "﻿" + lines.join("\r\n");
}
