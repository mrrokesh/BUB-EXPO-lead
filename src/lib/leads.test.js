import { describe, it, expect } from "vitest";
import { FORMS } from "../data/forms.js";
import { TA, UI } from "../i18n.js";
import { normalizeMobile } from "./format.js";
import {
  toggleMulti, visibleFields, validateFields, findField, summarize, offersFor, mergeLeads, leadLabel, buildCsv, CSV_HEADERS, csvCell
} from "./leads.js";
import { penOwed, penGiven, trackerTally } from "./tracker.js";
import { idlePlan } from "./idle.js";
import { VISITOR_RESET_MS, TICKET_RESET_MS, STAFF_LOCK_MS } from "../config.js";

describe("mobile numbers", () => {
  it("cleans common ways of writing a number", () => {
    expect(normalizeMobile("+91 98765 43210")).toBe("9876543210");
    expect(normalizeMobile("09876543210")).toBe("9876543210");
    expect(normalizeMobile("919876543210")).toBe("9876543210");
    expect(normalizeMobile("5876543210")).toBe("5876543210");
  });
});

describe("tick answers", () => {
  const have = findField("website", "have").options;
  it("adds and removes a choice", () => {
    expect(toggleMulti([], "website", have)).toEqual(["website"]);
    expect(toggleMulti(["website"], "website", have)).toEqual([]);
  });
  it("treats 'nothing yet' as exclusive", () => {
    expect(toggleMulti(["website", "app"], "nothing", have)).toEqual(["nothing"]);
    expect(toggleMulti(["nothing"], "app", have)).toEqual(["app"]);
  });
  it("'No problem' clears other problems", () => {
    const problems = findField("software", "problems").options;
    expect(toggleMulti(["slow", "improve"], "noproblem", problems)).toEqual(["noproblem"]);
  });
});

describe("validation", () => {
  const step1 = () => visibleFields(FORMS.software, 0, {});
  it("requires the about-you questions", () => {
    const errors = validateFields(step1(), {});
    expect(errors.name && errors.mobile && errors.business).toBeTruthy();
  });
  it("rejects a bad mobile number and accepts a good one", () => {
    const base = { name: "Asha", business: "Sri Stores", businessType: "shop", city: "salem" };
    expect(validateFields(step1(), { ...base, mobile: "12345" }).mobile).toBeTruthy();
    expect(validateFields(step1(), { ...base, mobile: "+91 98765 43210" })).toEqual({});
  });
  it("asks for a detail when 'Other' is chosen", () => {
    const errors = validateFields([{ key: "software", type: "chips", required: true, options: [{ value: "other", label: "Other", detail: true }] }], { software: "other" });
    expect(errors.softwareDetail).toBeTruthy();
  });
  it("shows follow-up questions only when they apply", () => {
    const keys = (form, step, answers) => visibleFields(FORMS[form], step, answers).map((f) => f.key);
    expect(keys("software", 1, { currentMethod: "manual" })).not.toContain("software");
    expect(keys("software", 1, { currentMethod: "paid" })).toContain("software");
    expect(keys("website", 1, { have: ["nothing"] })).not.toContain("creator");
    expect(keys("website", 1, { have: ["website"] })).toContain("creator");
  });
});

describe("form definitions", () => {
  it("every form has 3 steps and unique, well-formed questions", () => {
    Object.values(FORMS).forEach((form) => {
      expect(form.steps).toHaveLength(3);
      const keys = [];
      form.steps.forEach((step) => step.fields.forEach((field) => {
        expect(field.key && field.label && field.type).toBeTruthy();
        expect(keys).not.toContain(field.key);
        keys.push(field.key);
        (field.options || []).forEach((option) => expect(option.value && option.label).toBeTruthy());
      }));
    });
  });
  it("has Tamil for every question, placeholder, error, offer and interface text", () => {
    const brands = ["tally", "busy", "zoho", "marg", "vyapar", "mybillbook"];
    Object.values(FORMS).forEach((form) => form.steps.forEach((step) => {
      expect(step.tamil).toBeTruthy();
      step.fields.forEach((field) => {
        expect(TA[field.label], `Tamil label: ${field.label}`).toBeTruthy();
        if (field.placeholder) expect(TA[field.placeholder], `Tamil placeholder: ${field.placeholder}`).toBeTruthy();
        if (field.error) expect(TA[field.error], `Tamil error: ${field.error}`).toBeTruthy();
        (field.options || []).forEach((option) => {
          if (option.tamil === undefined) expect(brands, `Tamil option: ${option.label}`).toContain(option.value);
        });
      });
    }));
    ["Please fill this", "Please choose one", "Please enter at least 2 letters", "Enter a valid 10-digit mobile number", "Please type a short detail", "Type the other detail"]
      .forEach((text) => expect(TA[text], text).toBeTruthy());
    offersFor("website", { needs: ["static", "ecommerce"], next: ["demo", "trial"] }).forEach((offer) => expect(TA[offer], offer).toBeTruthy());
    Object.keys(UI).forEach((key) => expect(UI[key][0] && UI[key][1], key).toBeTruthy());
  });
});

describe("summary and offers", () => {
  it("summarises a lead for the team", () => {
    const summary = summarize("software", {
      name: "Asha", mobile: "9876543210", business: "Sri Stores", businessType: "shop", city: "salem",
      currentMethod: "paid", software: "tally", problems: ["slow"], needs: ["billing", "erp"], next: ["demo", "trial"]
    });
    expect(summary).toContain("Sri Stores");
    expect(summary).toContain("Tally");
    expect(summary).toContain("Free demo");
  });
  it("lists the stall offers a lead qualifies for", () => {
    expect(offersFor("website", { needs: ["static", "ecommerce"], next: ["demo"] }).some((item) => item.includes("₹5,000"))).toBe(true);
  });
});

describe("gift tracker", () => {
  it("gives exactly one pen per visitor", () => {
    expect(penOwed()).toBe(1);
    expect(penOwed({ instagram: true, playstore: true, review: true })).toBe(1);
    expect(penGiven({ pensGiven: 99 })).toBe(1);
    expect(penGiven({ pensGiven: -2 })).toBe(0);
    expect(penGiven()).toBe(0);
  });
  it("totals across leads", () => {
    const t = trackerTally([{ tracker: { instagram: true, pensGiven: 1 } }, {}, { tracker: { form80: true, wheel: true, pensGiven: 1 } }]);
    expect(t).toMatchObject({ owed: 3, given: 2, instagram: 1, form80: 1, wheel: 1 });
  });
});

describe("lead numbers and merging", () => {
  it("labels leads with the tablet code", () => {
    expect(leadLabel({ tablet: "K7", no: 12 })).toBe("K7-012");
    expect(leadLabel({ tablet: "B", no: 1 })).not.toBe(leadLabel({ tablet: "A", no: 1 }));
  });
  const mineA = { id: "a1", tablet: "A", no: 3, formId: "software", createdAt: "2026-10-15T09:00:00Z", updatedAt: "2026-10-15T09:00:00Z" };
  const theirsB = { id: "b1", tablet: "B", no: 40, formId: "website", createdAt: "2026-10-15T09:05:00Z", updatedAt: "2026-10-15T09:05:00Z" };
  it("adds other tablets' leads, takes newer edits, ignores older ones", () => {
    const db = { seq: 3, rev: 0, leads: [mineA] };
    const merged = mergeLeads(db, [theirsB, { ...mineA, updatedAt: "2026-10-15T10:00:00Z", summary: "edited" }, { id: "x" }, null], "A");
    expect(merged).toMatchObject({ added: 1, updated: 1, skipped: 2 });
    expect(db.seq).toBe(3);
    expect(db.leads.find((l) => l.id === "a1").summary).toBe("edited");
    const older = mergeLeads(db, [{ ...mineA, updatedAt: "2026-10-15T08:00:00Z", summary: "stale" }], "A");
    expect(older.unchanged).toBe(1);
    expect(db.leads.find((l) => l.id === "a1").summary).toBe("edited");
  });
  it("own leads from a backup move the counter, so numbering resumes", () => {
    const db = { seq: 0, rev: 0, leads: [] };
    mergeLeads(db, [{ id: "a2", tablet: "A", no: 9, formId: "software", createdAt: "2026-10-15T11:00:00Z" }], "A");
    expect(db.seq).toBe(9);
  });
  it("a deleted lead does not come back", () => {
    const db = { seq: 0, rev: 0, deleted: ["a1"], leads: [] };
    const result = mergeLeads(db, [{ id: "a1", tablet: "A", no: 1, formId: "software", createdAt: "2026-10-15T09:00:00Z" }], "A");
    expect(db.leads).toHaveLength(0);
    expect(result.added).toBe(0);
  });
});

describe("Excel export", () => {
  it("escapes cells and has a column for every header", () => {
    expect(csvCell('say "hi", ok')).toBe('"say ""hi"", ok"');
    const lead = {
      id: "a1", tablet: "K7", no: 1, formId: "software", createdAt: "2026-10-15T09:00:00Z", mobile: "9876543210",
      answers: { name: "Asha", mobile: "9876543210", business: "Sri Stores" }, summary: "s", tracker: { pensGiven: 1, instagram: true, wheel: true, wheelPrize: "Logo" }
    };
    const lines = buildCsv([lead], "K7").replace("﻿", "").split("\r\n");
    expect(lines[0].split(",")).toEqual(CSV_HEADERS);
    const row = lines[1];
    expect(row.startsWith("K7-001,K7,")).toBe(true);
    expect(row).toContain("Logo");
  });
});

describe("idle timers", () => {
  it("never times out on the home screen, warns visitors, locks staff", () => {
    expect(idlePlan("home")).toBeNull();
    expect(idlePlan("form").reset).toBe(VISITOR_RESET_MS);
    expect(idlePlan("form").warn).toBeLessThan(idlePlan("form").reset);
    expect(idlePlan("success").reset).toBe(TICKET_RESET_MS);
    expect(idlePlan("leads")).toEqual({ warn: 0, reset: STAFF_LOCK_MS });
  });
});
