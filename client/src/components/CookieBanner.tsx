import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { CONSENT_KEY, dispatchConsentChange, SHOW_SETTINGS_EVENT } from "@/hooks/useCookieConsent";

// ─── Cookie SVG ───────────────────────────────────────────────────────────────

function CookieSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="28" fill="#C8DF52" opacity="0.15" />
      <circle cx="32" cy="32" r="26" fill="#C8DF52" opacity="0.22" />
      <path
        d="M56 32C56 45.25 45.25 56 32 56C18.75 56 8 45.25 8 32C8 18.75 18.75 8 32 8C32 13.52 36.48 18 42 18C42 23.52 46.48 28 52 28C54.21 28 56 29.79 56 32Z"
        fill="#C8DF52"
      />
      <ellipse cx="24" cy="26" rx="3.5" ry="3"   fill="#3d2800" opacity="0.65" />
      <ellipse cx="36" cy="22" rx="3"   ry="2.5" fill="#3d2800" opacity="0.65" />
      <ellipse cx="20" cy="38" rx="3"   ry="2.5" fill="#3d2800" opacity="0.65" />
      <ellipse cx="34" cy="40" rx="3.5" ry="3"   fill="#3d2800" opacity="0.65" />
      <ellipse cx="28" cy="48" rx="2.5" ry="2"   fill="#3d2800" opacity="0.55" />
      <ellipse cx="44" cy="36" rx="2.5" ry="2"   fill="#3d2800" opacity="0.45" />
      <path
        d="M52 28C46.48 28 42 23.52 42 18C42 13 36.48 8 32 8"
        stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"
      />
    </svg>
  );
}

// ─── GA4 helpers ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGA4Script() {
  if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
    // Script already loaded (returning visitor) — just update consent
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
      window.gtag("event", "page_view");
    }
    return;
  }
  // First-time accept: inject the script dynamically — zero network calls to Google before this point
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-NFC69M5MYC";
  document.head.appendChild(s);
  s.onload = () => {
    if (typeof window.gtag === "function") {
      window.gtag("js", new Date());
      window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
      window.gtag("config", "G-NFC69M5MYC");
      window.gtag("event", "page_view");
    }
  };
}

function grantConsent() {
  try {
    localStorage.setItem(CONSENT_KEY, "accepted");
    dispatchConsentChange();
    loadGA4Script();
  } catch { /* silent */ }
}

function denyConsent() {
  try {
    localStorage.setItem(CONSENT_KEY, "rejected");
    dispatchConsentChange();
    // GA4 script was never loaded — nothing to stop. Zero data sent to Google.
  } catch { /* silent */ }
}

// ─── Banner ───────────────────────────────────────────────────────────────────

export function CookieBanner() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
    // Re-open when user clicks "Cookie Settings" anywhere on the site
    const handler = () => setVisible(true);
    window.addEventListener(SHOW_SETTINGS_EVENT, handler);
    return () => window.removeEventListener(SHOW_SETTINGS_EVENT, handler);
  }, []);

  const handleAccept = () => { grantConsent(); setVisible(false); };
  const handleReject = () => { denyConsent();  setVisible(false); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{   y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 md:px-8 md:pb-6"
        >
          <div className={cn(
            "max-w-2xl mx-auto rounded-[2rem] border shadow-2xl overflow-hidden",
            isLight
              ? "bg-white border-zinc-200 shadow-black/10"
              : "bg-zinc-900 border-white/8 shadow-black/50"
          )}>

            {/* Top accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

            {/* Content */}
            <div className="p-6 md:p-7">

              {/* Header row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CookieSvg className="w-7 h-7" />
                </div>
                <h3 className={cn(
                  "text-base font-bold tracking-tight",
                  isLight ? "text-zinc-900" : "text-white"
                )}>
                  {t("cookieBanner.title")}
                </h3>
              </div>

              {/* Body */}
              <p className={cn(
                "text-sm leading-relaxed mb-1",
                isLight ? "text-zinc-500" : "text-zinc-400"
              )}>
                {t("cookieBanner.body")}
              </p>

              {/* Policy links */}
              <div className="flex items-center gap-1 text-xs mb-6">
                <Link href="/privacy-policy" className="text-primary hover:underline font-medium">
                  {t("footer.privacyPolicy")}
                </Link>
                <span className={cn("mx-1", isLight ? "text-zinc-300" : "text-zinc-600")}>·</span>
                <Link href="/cookie-policy" className="text-primary hover:underline font-medium">
                  {t("footer.cookiePolicy")}
                </Link>
              </div>

              {/* Divider */}
              <div className={cn(
                "h-px w-full mb-5",
                isLight ? "bg-zinc-100" : "bg-white/5"
              )} />

              {/* Buttons — equal weight, full-width on mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleReject}
                  className={cn(
                    "flex-1 min-h-[48px] sm:min-h-[44px] px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide flex items-center justify-center",
                    "transition-all hover:scale-[1.02] active:scale-[0.98]",
                    isLight
                      ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  )}
                >
                  {t("cookieBanner.reject")}
                </button>
                <button
                  onClick={handleAccept}
                  className={cn(
                    "flex-1 min-h-[48px] sm:min-h-[44px] px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide flex items-center justify-center",
                    "bg-primary text-black transition-all hover:scale-[1.02] active:scale-[0.98]",
                    "shadow-[0_8px_24px_-8px_rgba(200,223,82,0.5)]"
                  )}
                >
                  {t("cookieBanner.accept")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
