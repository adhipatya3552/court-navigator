"use client";

const KEY = "cn-onboarded-v1";

function store(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Has the user completed (or skipped) onboarding? */
export function onboardComplete(): boolean {
  return store()?.getItem(KEY) === "1";
}

/** Persist completion/skip. Never throws (private-mode safe). */
export function markOnboarded(): void {
  try {
    store()?.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
}

/** For tests / "show again" flows. */
export function resetOnboarded(): void {
  try {
    store()?.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export const ONBOARD_EVENT = "cn:open-onboarding";

export function openOnboarding(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ONBOARD_EVENT));
}
