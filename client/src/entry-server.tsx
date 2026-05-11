import { renderToString } from "react-dom/server";
import { StrictMode } from "react";
import { Router } from "wouter";
import App from "./App";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import nl from "./locales/nl.json";
import fr from "./locales/fr.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      nl: { translation: nl },
      fr: { translation: fr },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export function render(url: string): string {
  const ssrPath = url.split("?")[0] || "/";

  // Static location hook — no browser APIs, no wouter subpath imports.
  // Returns a fixed path for the duration of the server render.
  const staticHook = () =>
    [ssrPath, (_to: string) => {}] as [string, (to: string) => void];

  return renderToString(
    <StrictMode>
      <Router hook={staticHook}>
        <App />
      </Router>
    </StrictMode>,
  );
}