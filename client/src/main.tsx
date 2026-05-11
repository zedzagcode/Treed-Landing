import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n"; // Import i18n configuration

const container = document.getElementById("root")!;

/**
 * Always use createRoot (client render) rather than hydrateRoot.
 *
 * The server renders real HTML into <div id="root"> for SEO crawlers,
 * but image paths in the SSR bundle are empty strings (the SSR build
 * intentionally strips binary assets). Hydrating against that HTML would
 * cause a src-mismatch and leave all images broken.
 *
 * createRoot re-renders from scratch with the correct Vite-hashed asset
 * URLs, so images load correctly. Crawlers still get the full server-
 * rendered HTML — the SEO goal is fully preserved.
 */
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);