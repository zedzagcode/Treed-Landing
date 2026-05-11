import { useState, useEffect } from "react";

export const CONSENT_KEY = "treed_cookie_consent";
export const CONSENT_EVENT = "treed_consent_change";
export const SHOW_SETTINGS_EVENT = "treed_show_cookie_settings";

export type ConsentState = "accepted" | "rejected" | null;

function readConsent(): ConsentState {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === "accepted" || v === "rejected") return v;
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the current cookie consent state and re-renders whenever it changes.
 * Other components can call dispatchConsentChange() after writing to localStorage
 * to notify all subscribers instantly.
 */
export function useCookieConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>(readConsent);

  useEffect(() => {
    const handler = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  return consent;
}

export function dispatchConsentChange() {
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Call this to re-open the cookie banner from anywhere (e.g. footer "Cookie Settings" link). */
export function openCookieSettings() {
  try { localStorage.removeItem(CONSENT_KEY); } catch { /* silent */ }
  window.dispatchEvent(new Event(SHOW_SETTINGS_EVENT));
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
