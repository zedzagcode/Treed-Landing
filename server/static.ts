import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectSEOMetadata } from "./seo-metadata";

// ─── Template cache ────────────────────────────────────────────────────────
// The raw index.html is read once and reused on every request.
let templateCache: string | null = null;

// ─── SSR module cache ──────────────────────────────────────────────────────
// undefined  = not yet attempted to load
// null       = attempted but not available (CSR fallback will be used)
// function   = loaded successfully
type RenderFn = (url: string) => string;
let ssrRenderFn: RenderFn | null | undefined = undefined;

/**
 * Load the SSR render module built by the Vite SSR step.
 * Located at dist/ssr/entry-server.js (relative to dist/public).
 *
 * Fails gracefully: if the file doesn't exist or throws on import,
 * we set ssrRenderFn = null so we never retry and always fall back to CSR.
 */
async function loadSSRModule(distPath: string): Promise<RenderFn | null> {
  // Already resolved (either loaded or confirmed missing) — return cached.
  if (ssrRenderFn !== undefined) return ssrRenderFn;

  const ssrBundlePath = path.resolve(distPath, "../ssr/entry-server.cjs");

  if (!fs.existsSync(ssrBundlePath)) {
    console.warn(
      `[static] SSR bundle not found at ${ssrBundlePath} — serving CSR fallback. ` +
        "Run `npm run build` to generate the SSR bundle.",
    );
    ssrRenderFn = null;
    return null;
  }

  try {
    // Dynamic import works from CJS (esbuild-compiled server) in Node 12+.
    // For a CJS module, named exports are available directly on the result.
    const mod = (await import(ssrBundlePath)) as
      | { render: RenderFn }
      | { default: { render: RenderFn } };

    const fn =
      "render" in mod
        ? mod.render
        : "default" in mod
          ? (mod as { default: { render: RenderFn } }).default?.render
          : null;

    if (typeof fn !== "function") {
      throw new Error("SSR module does not export a `render` function");
    }

    ssrRenderFn = fn;
    console.log("[static] SSR bundle loaded ✓  — pages will be server-rendered");
  } catch (err) {
    console.error(
      "[static] Failed to load SSR bundle — serving CSR fallback:",
      err,
    );
    ssrRenderFn = null;
  }

  return ssrRenderFn;
}

// ─── Cache pre-warm ────────────────────────────────────────────────────────

export async function preWarmCache(distPath: string): Promise<void> {
  try {
    const indexPath = path.resolve(distPath, "index.html");
    templateCache = await fs.promises.readFile(indexPath, "utf-8");
    // Load SSR module eagerly so the first real request is instant.
    await loadSSRModule(distPath);
  } catch (e) {
    console.error("[static] Failed to pre-warm template cache:", e);
  }
}

// ─── Static serving + catch-all renderer ──────────────────────────────────

export function serveStatic(app: Express): string {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `[static] Build directory not found: ${distPath}. Static serving disabled.`,
    );
    return distPath;
  }

  // Serve JS/CSS/image assets directly; never let Express auto-serve index.html.
  app.use(express.static(distPath, { index: false }));

  // Catch-all: every HTML request goes through here.
  app.use("*", async (req, res) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");

      // Read template on first request if pre-warm didn't run.
      if (!templateCache) {
        templateCache = await fs.promises.readFile(indexPath, "utf-8");
      }

      // 1. Inject page-specific SEO metadata into <head> (existing logic).
      let html = injectSEOMetadata(templateCache, req.originalUrl);

      // 2. Try SSR: render the React component tree to an HTML string and
      //    inject it into <div id="root"> so crawlers see real content.
      const renderFn = await loadSSRModule(distPath);
      if (renderFn) {
        try {
          const appHtml = renderFn(req.originalUrl);
          // Replace the empty root div with the server-rendered content.
          // The client will call hydrateRoot() instead of createRoot(),
          // attaching event listeners without re-rendering the DOM.
          html = html.replace(
            '<div id="root"></div>',
            `<div id="root">${appHtml}</div>`,
          );
        } catch (ssrError) {
          // One page might fail SSR (e.g. a component using a browser API
          // at render time). Log it but serve the page anyway — React will
          // re-render client-side as a graceful fallback.
          console.error(
            `[static] SSR render failed for ${req.originalUrl} — serving CSR fallback:`,
            ssrError,
          );
        }
      }

      res.set("Content-Type", "text/html").send(html);
    } catch (e) {
      console.error("[static] Failed to serve index.html:", e);
      res.status(500).send("Internal Server Error");
    }
  });

  return distPath;
}