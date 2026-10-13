import { describe, it, expect, beforeEach } from "vitest";
import {
  loadDB, saveDB, loadSettings, saveSettings, normalizeTabletCode, randomTabletCode, pendingChanges, markBackedUp,
  saveDraft, loadDraft, clearDraft, staffOpen, setStaffOpen, teamNumber
} from "./storage.js";
import { backupFileName } from "./backup.js";
import { syncLine } from "./sync.js";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("tablet code", () => {
  it("accepts 1 to 3 letters or digits, uppercased", () => {
    expect(normalizeTabletCode(" k7 ")).toBe("K7");
    expect(normalizeTabletCode("a-b")).toBe("AB");
    expect(normalizeTabletCode("")).toBe("");
    expect(normalizeTabletCode("ABCD")).toBe("");
  });
  it("makes a random code that avoids look-alike characters", () => {
    for (let i = 0; i < 50; i += 1) expect(randomTabletCode()).toMatch(/^[A-HJ-NP-Z][2-9]$/);
  });
  it("gives each tablet a code once and keeps it", () => {
    const first = loadSettings().tabletCode;
    expect(first).toMatch(/^[A-Z][2-9]$/);
    expect(loadSettings().tabletCode).toBe(first);
  });
});

describe("leads storage", () => {
  it("starts empty and counts every write", () => {
    expect(loadDB()).toMatchObject({ seq: 0, rev: 0, leads: [], deleted: [] });
    const db = loadDB();
    saveDB(db);
    saveDB(loadDB());
    expect(loadDB().rev).toBe(2);
  });
  it("counts changes since the last backup", () => {
    saveDB(loadDB());
    saveDB(loadDB());
    expect(pendingChanges()).toBe(2);
    markBackedUp();
    expect(pendingChanges()).toBe(0);
    saveDB(loadDB());
    expect(pendingChanges()).toBe(1);
  });
  it("survives corrupted data", () => {
    localStorage.setItem("mrrokesh-bub-expo-leads-v1", "{not json");
    expect(loadDB().leads).toEqual([]);
  });
});

describe("settings", () => {
  it("falls back to the default PIN and team number", () => {
    const settings = loadSettings();
    expect(settings.pin).toBe("9688");
    expect(teamNumber()).toBe("918248696883");
  });
  it("uses a saved team number", () => {
    const settings = loadSettings();
    settings.teamWhatsapp = "9876543210";
    saveSettings(settings);
    expect(teamNumber()).toBe("919876543210");
  });
});

describe("drafts and staff session", () => {
  it("keeps a draft until it is cleared", () => {
    saveDraft("software", { step: 1, answers: { name: "Asha" } });
    expect(loadDraft("software").answers.name).toBe("Asha");
    clearDraft("software");
    expect(loadDraft("software")).toBeNull();
  });
  it("remembers that staff unlocked the leads page", () => {
    expect(staffOpen()).toBe(false);
    setStaffOpen(true);
    expect(staffOpen()).toBe(true);
    setStaffOpen(false);
    expect(staffOpen()).toBe(false);
  });
});

describe("backup file name", () => {
  it("includes the date and time", () => {
    expect(backupFileName(new Date(2026, 9, 15, 14, 5))).toBe("MR-Rokesh-leads-backup-20261015-1405.json");
  });
});

describe("sync status line", () => {
  const db = { rev: 5 };
  it("explains each state", () => {
    expect(syncLine(db, { syncKey: "" }, "")).toContain("not set up");
    expect(syncLine(db, { syncKey: "k", syncedRev: 2 }, "")).toContain("3 changes waiting");
    expect(syncLine(db, { syncKey: "k", syncedRev: 5, lastSyncAt: "2026-10-15T09:00:00Z" }, "")).toContain("up to date");
    expect(syncLine(db, { syncKey: "k", syncedRev: 4 }, "Server not reachable.")).toContain("Cloud sync problem: Server not reachable. 1 change waiting.");
  });
});
