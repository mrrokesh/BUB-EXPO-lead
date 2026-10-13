/* App state: which screen is showing, the form being filled, toasts, the idle timer and background sync. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PIN_LOCK_MS, PIN_MAX_TRIES } from "./config.js";
import { FORMS } from "./data/forms.js";
import { findField, isDirty, summarize, toggleMulti, validateFields, visibleFields } from "./lib/leads.js";
import { normalizeMobile, uid } from "./lib/format.js";
import { clearDraft, loadDB, loadDraft, loadSettings, saveDB, saveDraft, setStaffOpen, staffOpen, tabletCode } from "./lib/storage.js";
import { SYNC_EVERY_MS, syncNow } from "./lib/sync.js";
import { watchInstall } from "./lib/backup.js";
import { idlePlan } from "./lib/idle.js";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const EMPTY_FORM = { formId: null, step: 0, answers: {}, errors: {}, stepError: false, resumed: false, editing: null };
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "input", "scroll"];

function scrollTop() {
  if (typeof window !== "undefined") window.scrollTo(0, 0);
}

function dropErrors(errors, keys) {
  const next = { ...errors };
  keys.forEach((key) => delete next[key]);
  return next;
}

export function AppProvider({ children }) {
  const [view, setView] = useState("home"); // home | form | success | pin | leads | lead
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedLeadId, setSavedLeadId] = useState(null);
  const [openLeadId, setOpenLeadId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [idleWarn, setIdleWarn] = useState(false);
  const toastTimer = useRef(null);
  const pinGuard = useRef({ fails: 0, lockUntil: 0 });

  /* ---- Toast ---- */
  const toast = useCallback((message) => {
    if (!message) return;
    setToastMessage(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 3200);
  }, []);

  /* ---- Navigation ---- */
  const goHome = useCallback(() => {
    setView("home");
    setForm((f) => ({ ...f, errors: {}, stepError: false }));
    scrollTop();
  }, []);

  const openForm = useCallback((formId, useDraft = true) => {
    const draft = useDraft ? loadDraft(formId) : null;
    setForm({
      formId,
      step: draft && Number.isInteger(draft.step) ? draft.step : 0,
      answers: draft && draft.answers ? draft.answers : {},
      errors: {},
      stepError: false,
      resumed: !!(draft && isDirty(draft.answers || {})),
      editing: draft && draft.editingId ? { id: draft.editingId, no: draft.editingNo, created: draft.editingCreated } : null
    });
    setView("form");
    scrollTop();
  }, []);

  const startFresh = useCallback(() => {
    setForm((f) => {
      clearDraft(f.formId);
      return { ...f, answers: {}, step: 0, resumed: false, editing: null, errors: {}, stepError: false };
    });
  }, []);

  const editLead = useCallback((id) => {
    const lead = loadDB().leads.find((item) => item.id === id);
    if (!lead) return;
    setForm({
      formId: lead.formId,
      step: 0,
      answers: JSON.parse(JSON.stringify(lead.answers)),
      errors: {},
      stepError: false,
      resumed: false,
      editing: { id: lead.id, no: lead.no, created: lead.createdAt }
    });
    setView("form");
    scrollTop();
  }, []);

  const openLeads = useCallback(() => {
    setView(staffOpen() ? "leads" : "pin");
    scrollTop();
  }, []);

  const openLead = useCallback((id) => {
    setOpenLeadId(id);
    setView("lead");
    scrollTop();
  }, []);

  const backToLeads = useCallback(() => setView("leads"), []);

  /* Drop every visitor detail held in memory or in drafts, lock the leads area, and go home. */
  const resetForNextVisitor = useCallback(() => {
    Object.keys(FORMS).forEach(clearDraft);
    setStaffOpen(false);
    setForm(EMPTY_FORM);
    setSavedLeadId(null);
    setOpenLeadId(null);
    setIdleWarn(false);
    setView("home");
    scrollTop();
  }, []);

  /* Between visitors: clear the form and the ticket, but keep staff unlocked. */
  const nextVisitor = useCallback(() => {
    Object.keys(FORMS).forEach(clearDraft);
    setForm(EMPTY_FORM);
    setSavedLeadId(null);
    setView("home");
    scrollTop();
  }, []);

  /* ---- Staff PIN ---- */
  const unlock = useCallback((pin) => {
    const guard = pinGuard.current;
    const waitMs = guard.lockUntil - Date.now();
    if (waitMs > 0) return { ok: false, message: `Too many wrong tries. Wait ${Math.ceil(waitMs / 1000)} seconds.` };
    if (String(pin).trim() === loadSettings().pin) {
      guard.fails = 0;
      setStaffOpen(true);
      setView("leads");
      return { ok: true };
    }
    guard.fails += 1;
    if (guard.fails >= PIN_MAX_TRIES) {
      guard.fails = 0;
      guard.lockUntil = Date.now() + PIN_LOCK_MS;
      return { ok: false, message: "Too many wrong tries. Wait 1 minute." };
    }
    return { ok: false, message: "Wrong PIN. Try again." };
  }, []);

  /* ---- Filling a form ---- */
  const setAnswer = useCallback((key, value) => {
    setForm((f) => {
      const errors = dropErrors(f.errors, [key]);
      return { ...f, answers: { ...f.answers, [key]: value }, errors, stepError: Object.keys(errors).length > 0 && f.stepError };
    });
  }, []);

  const choose = useCallback((key, value) => {
    setForm((f) => {
      const field = findField(f.formId, key);
      if (!field) return f;
      const answers = { ...f.answers };
      answers[key] = field.type === "chips" ? (answers[key] === value ? "" : value) : toggleMulti(answers[key], value, field.options);
      const errors = dropErrors(f.errors, [key, key + "Detail"]);
      return { ...f, answers, errors, stepError: Object.keys(errors).length > 0 && f.stepError };
    });
  }, []);

  const goBack = useCallback(() => {
    if (view === "form" && form.step > 0) {
      setForm((f) => ({ ...f, step: f.step - 1, errors: {}, stepError: false }));
      scrollTop();
      return;
    }
    goHome();
  }, [view, form.step, goHome]);

  const saveLead = useCallback(() => {
    const answers = { ...form.answers, mobile: normalizeMobile(form.answers.mobile) };
    const db = loadDB();
    const previous = form.editing ? db.leads.find((item) => item.id === form.editing.id) : null;
    const now = new Date().toISOString();
    const lead = {
      tracker: previous && previous.tracker ? previous.tracker : {},
      tablet: previous && previous.tablet ? previous.tablet : tabletCode(),
      id: form.editing ? form.editing.id : uid(),
      no: form.editing ? form.editing.no : db.seq + 1,
      formId: form.formId,
      createdAt: form.editing ? form.editing.created : now,
      updatedAt: now,
      mobile: answers.mobile,
      answers,
      summary: summarize(form.formId, answers)
    };
    if (!form.editing) db.seq += 1;
    const index = db.leads.findIndex((item) => item.id === lead.id);
    if (index >= 0) db.leads[index] = lead;
    else db.leads.push(lead);
    try {
      saveDB(db);
    } catch (error) {
      setForm((f) => ({ ...f, stepError: true, errors: { next: "This tablet could not store the lead. Export a backup, then try again." } }));
      return;
    }
    clearDraft(form.formId);
    setSavedLeadId(lead.id);
    setForm((f) => ({ ...f, editing: null }));
    setView("success");
    scrollTop();
    setTimeout(() => syncNow(false), 300);
  }, [form]);

  const goNext = useCallback(() => {
    const def = FORMS[form.formId];
    const errors = validateFields(visibleFields(def, form.step, form.answers), form.answers);
    if (Object.keys(errors).length) {
      setForm((f) => ({ ...f, errors, stepError: true }));
      requestAnimationFrame(() => {
        const invalid = document.querySelector("[data-invalid='true']");
        if (invalid) invalid.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    if (form.step < def.steps.length - 1) {
      setForm((f) => ({ ...f, step: f.step + 1, errors: {}, stepError: false }));
      scrollTop();
      return;
    }
    saveLead();
  }, [form, saveLead]);

  /* Keep a draft of the form in progress, so an accidental Home tap does not lose it. */
  useEffect(() => {
    if (view !== "form" || !form.formId) return;
    saveDraft(form.formId, {
      step: form.step,
      answers: form.answers,
      editingId: form.editing ? form.editing.id : null,
      editingNo: form.editing ? form.editing.no : null,
      editingCreated: form.editing ? form.editing.created : null
    });
  }, [view, form.formId, form.step, form.answers, form.editing]);

  /* ---- Address bar: #software, #leads, #saved. Back and forward still work. ---- */
  const current = useRef({ view, formId: form.formId });
  current.current = { view, formId: form.formId };

  /* Reads the address first (so opening .../#software works), then the effect below keeps it in step. */
  useEffect(() => {
    const route = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "saved") return;
      if (hash === "leads") setView(staffOpen() ? "leads" : "pin");
      else if (FORMS[hash]) {
        if (!(current.current.view === "form" && current.current.formId === hash)) openForm(hash);
      } else setView("home");
    };
    route();
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, [openForm]);

  useEffect(() => {
    const hash = view === "form" ? form.formId : view === "success" ? "saved" : view === "pin" || view === "leads" || view === "lead" ? "leads" : "";
    const wanted = hash ? "#" + hash : "";
    const now = window.location.hash === "#" ? "" : window.location.hash;
    if (now !== wanted) history.replaceState(null, "", wanted || window.location.pathname + window.location.search);
  }, [view, form.formId]);

  /* ---- Idle: warn, then clear the screen and lock the staff area ---- */
  const warnRef = useRef(false);
  const timers = useRef({ warn: null, reset: null });
  const armIdle = useCallback(() => {
    clearTimeout(timers.current.warn);
    clearTimeout(timers.current.reset);
    warnRef.current = false;
    setIdleWarn(false);
    const plan = idlePlan(view);
    if (!plan) return;
    if (plan.warn) timers.current.warn = setTimeout(() => { warnRef.current = true; setIdleWarn(true); }, plan.warn);
    timers.current.reset = setTimeout(resetForNextVisitor, plan.reset);
  }, [view, resetForNextVisitor]);

  useEffect(() => {
    armIdle();
    return () => {
      clearTimeout(timers.current.warn);
      clearTimeout(timers.current.reset);
    };
  }, [armIdle]);

  useEffect(() => {
    const onActivity = () => { if (!warnRef.current) armIdle(); };
    ACTIVITY_EVENTS.forEach((name) => document.addEventListener(name, onActivity, true));
    return () => ACTIVITY_EVENTS.forEach((name) => document.removeEventListener(name, onActivity, true));
  }, [armIdle]);

  /* ---- Background: install prompt, and sync when online ---- */
  useEffect(() => {
    watchInstall();
    const onOnline = () => syncNow(false);
    window.addEventListener("online", onOnline);
    const interval = setInterval(() => syncNow(false), SYNC_EVERY_MS);
    const first = setTimeout(() => syncNow(false), 3000);
    return () => {
      window.removeEventListener("online", onOnline);
      clearInterval(interval);
      clearTimeout(first);
    };
  }, []);

  const value = useMemo(() => ({
    view, form, savedLeadId, openLeadId, toastMessage, idleWarn,
    toast, goHome, openForm, startFresh, editLead, openLeads, openLead, backToLeads, resetForNextVisitor, nextVisitor,
    unlock, setAnswer, choose, goBack, goNext, dismissIdle: armIdle
  }), [view, form, savedLeadId, openLeadId, toastMessage, idleWarn, toast, goHome, openForm, startFresh, editLead, openLeads, openLead, backToLeads, resetForNextVisitor, nextVisitor, unlock, setAnswer, choose, goBack, goNext, armIdle]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
