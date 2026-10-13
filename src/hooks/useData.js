import { useMemo, useSyncExternalStore } from "react";
import { subscribeData, dataVersion, loadDB, loadSettings } from "../lib/storage.js";
import { subscribeSync, getSyncError } from "../lib/sync.js";
import { subscribeInstall, installState } from "../lib/backup.js";

/* Leads and settings live in localStorage. These hooks re-read them whenever they are saved. */
export function useDb() {
  const version = useSyncExternalStore(subscribeData, dataVersion);
  return useMemo(() => loadDB(), [version]);
}

export function useSettings() {
  const version = useSyncExternalStore(subscribeData, dataVersion);
  return useMemo(() => loadSettings(), [version]);
}

export function useSyncError() {
  return useSyncExternalStore(subscribeSync, getSyncError);
}

let cachedInstall = null;
function snapshotInstall() {
  const next = installState();
  if (!cachedInstall || cachedInstall.canPrompt !== next.canPrompt || cachedInstall.installed !== next.installed || cachedInstall.persisted !== next.persisted) cachedInstall = next;
  return cachedInstall;
}
export function useInstall() {
  return useSyncExternalStore(subscribeInstall, snapshotInstall);
}
