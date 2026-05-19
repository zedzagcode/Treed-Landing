// ─────────────────────────────────────────────────────────────
//  Tree'd — Blog Article Page
//  Route: /blog/:slug  (dispatched from BlogRouter)
//
//  Sections:
//    1. Reading progress bar (fixed, top)
//    2. Article Hero — breadcrumb, category pill, H1, meta row
//    3. Hero image (real photo or ArticlePlaceholder gradient)
//    4. Article body — typed ContentBlock renderer
//    5. Article CTA (inline, bottom of body)
//    6. Related articles (3 cards, same primary category)
//    7. Page CTA — dual button
//
//  SEO:
//    • Dynamic <title>, <meta>, <og>, <canonical> via useEffect
//    • JSON-LD Article + FAQPage schemas
//
//  Analytics (GA4 — measurement ID already in index.html):
//    • Scroll depth events at 25 / 50 / 75 / 100 %
//    • article_cta_click event on in-article CTA
//
//  i18n:
//    • All chrome via t('blog.articlePage.*')
//    • Article content via t('blog.articles.{id}.*', {returnObjects})
//    • Bodies localized per locale — en.json is source of truth
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { ArrowRight, List } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTheme } from "@/contexts/ThemeContext";
import {
  articles,
  getArticleBySlug,
  type Article,
  type ContentBlock,
} from "@/data/blogData";
import {
  CategoryIcon,
  ArticlePlaceholder,
  TagPill,
  BlogCard,
} from "@/components/blog/BlogShared";

const BASE_URL = "https://treed.co";

// ─────────────────────────────────────────────────────────────
//  TOC helpers
// ─────────────────────────────────────────────────────────────

/** Convert a heading string to a stable, URL-safe anchor ID. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface TocItem {
  id: string;
  text: string;
  level: "h2" | "h3";
}

function extractToc(blocks: ContentBlock[]): TocItem[] {
  return blocks
    .filter((b): b is Extract<ContentBlock, { type: "h2" | "h3" }> =>
      b.type === "h2" || b.type === "h3"
    )
    .map((b) => ({ id: slugify(b.text), text: b.text, level: b.type }));
}

// ─────────────────────────────────────────────────────────────
//  TOC — shared state hook + split Desktop / Mobile components
// ─────────────────────────────────────────────────────────────

interface TocState {
  items: TocItem[];
  activeId: string;
  scrollTo: (id: string) => void;
}

function useTocState(blocks: ContentBlock[]): TocState {
  const items = extractToc(blocks);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const observers: IntersectionObserver[] = [];
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [items.length]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return { items, activeId, scrollTo };
}

/** Desktop sticky sidebar — only renders at xl+. */
function DesktopTOC({
  items,
  activeId,
  scrollTo,
  isLight,
}: TocState & { isLight: boolean }) {
  if (items.length < 2) return null;

  return (
    <nav
      className={`sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 ${
        isLight ? "border-l border-zinc-100 pl-6" : "border-l border-white/5 pl-6"
      }`}
    >
      <div className="flex items-center gap-2">
        <List className={`w-3 h-3 flex-shrink-0 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} />
        <span className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>
          Contents
        </span>
      </div>
      <ul className="space-y-0.5 mt-3">
        {items.map(({ id, text, level }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`w-full text-left leading-snug py-1.5 transition-colors duration-150 cursor-pointer ${
                  level === "h3" ? "pl-3 text-[11px]" : "text-[12px]"
                } ${
                  isActive
                    ? "text-primary font-semibold"
                    : isLight
                    ? "text-zinc-500 hover:text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {isActive && (
                  <span className="inline-block w-1 h-1 rounded-full bg-primary mr-1.5 mb-0.5 align-middle" />
                )}
                {text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Mobile collapsible block — only renders below xl. */
function MobileTOC({
  items,
  activeId,
  scrollTo,
  isLight,
}: TocState & { isLight: boolean }) {
  const [open, setOpen] = useState(false);

  if (items.length < 2) return null;

  return (
    <div
      className={`mb-10 rounded-xl border overflow-hidden ${
        isLight ? "border-zinc-200 bg-zinc-50" : "border-white/8 bg-white/[0.03]"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 ${
          isLight ? "text-zinc-700" : "text-zinc-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <List className="w-3.5 h-3.5 text-primary" />
          <span className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>
            Contents
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-400"
        >
          ▾
        </motion.span>
      </button>
      {open && (
        <div className={`px-5 pb-4 border-t ${isLight ? "border-zinc-200" : "border-white/8"}`}>
          <ul className="space-y-0.5 mt-3">
            {items.map(({ id, text, level }) => {
              const isActive = activeId === id;
              return (
                <li key={id}>
                  <button
                    onClick={() => { scrollTo(id); setOpen(false); }}
                    className={`w-full text-left leading-snug py-1.5 transition-colors duration-150 cursor-pointer ${
                      level === "h3" ? "pl-3 text-[11px]" : "text-[12px]"
                    } ${
                      isActive
                        ? "text-primary font-semibold"
                        : isLight
                        ? "text-zinc-500 hover:text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {isActive && (
                      <span className="inline-block w-1 h-1 rounded-full bg-primary mr-1.5 mb-0.5 align-middle" />
                    )}
                    {text}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  GA4 scroll-depth tracking
// ─────────────────────────────────────────────────────────────

function useScrollTracking(articleId: number, articleTitle: string) {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    fired.current.clear();

    const onScroll = () => {
      const el = document.documentElement;
      const pct = Math.round(
        ((el.scrollTop + el.clientHeight) / el.scrollHeight) * 100
      );
      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          if (typeof window.gtag === "function") {
            window.gtag("event", "scroll_depth", {
              article_id:       articleId,
              article_title:    articleTitle,
              depth_percentage: threshold,
            });
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [articleId, articleTitle]);
}

// ─────────────────────────────────────────────────────────────
//  Reading progress bar (fixed, top of viewport)
// ─────────────────────────────────────────────────────────────

function ReadingProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      if (barRef.current) barRef.current.style.width = `${Math.min(pct, 100)}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-primary transition-none"
        style={{ width: "0%" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ImageCarousel — inline photo slider for article bodies
// ─────────────────────────────────────────────────────────────

function ImageCarousel({
  images,
  isLight,
}: {
  images: Array<{ src: string; alt?: string; caption?: string }>;
  isLight: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const currentImg = images[current];

  return (
    <figure className="my-10">
      {/* ── Viewport ─────────────────────────────────────── */}
      <div
        className={`relative rounded-xl overflow-hidden border ${
          isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-900 border-white/8"
        }`}
        style={{ aspectRatio: "1 / 1" }}
      >
        {/* Sliding track — all images laid out side-by-side */}
        <div
          className="flex h-full will-change-transform"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${(current * 100) / total}%)`,
            transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {images.map((slide) => (
            <div
              key={slide.src}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / total}%` }}
            >
              <img
                src={slide.src}
                alt={slide.alt ?? ""}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const imgEl = e.currentTarget;
                  imgEl.style.display = "none";
                  const ph = imgEl.nextElementSibling as HTMLElement | null;
                  if (ph) ph.style.display = "flex";
                }}
              />
              {/* Per-slide placeholder (hidden until onError) */}
              <div
                style={{ display: "none" }}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 text-center ${
                  isLight ? "bg-zinc-100 text-zinc-400" : "bg-zinc-900 text-zinc-500"
                }`}
              >
                <span className={`text-sm font-medium ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                  Image coming soon
                </span>
                <span className="text-[11px] opacity-50 font-mono">{slide.src}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Edge fade for button legibility */}
        {total > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 w-16 pointer-events-none"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.22), transparent)" }} />
            <div className="absolute inset-y-0 right-0 w-16 pointer-events-none"
              style={{ background: "linear-gradient(to left, rgba(0,0,0,0.22), transparent)" }} />
          </>
        )}

        {/* Prev / Next — glassmorphism + SVG chevrons */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.30)",
                color: "#ffffff",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7l4-4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-200 hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.30)",
                color: "#ffffff",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Counter badge */}
        {total > 1 && (
          <div
            className="absolute bottom-3 right-3 text-[11px] font-semibold rounded-full px-2.5 py-0.5"
            style={{
              background: "rgba(0,0,0,0.58)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              color: "#ffffff",
              letterSpacing: "0.04em",
            }}
          >
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              className="rounded-full cursor-pointer"
              style={{
                height: "5px",
                width: i === current ? "18px" : "5px",
                background: i === current
                  ? "#C8DF52"
                  : isLight ? "#d4d4d8" : "#52525b",
                transition: "width 0.3s cubic-bezier(0.25, 1, 0.5, 1), background 0.2s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Per-slide caption */}
      {currentImg.caption && (
        <figcaption
          className={`mt-3 text-[12px] leading-relaxed text-left italic ${
            isLight ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {currentImg.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────
//  ContentBlock renderer
// ─────────────────────────────────────────────────────────────

function ArticleBody({
  blocks,
  isLight,
  onCtaClick,
}: {
  blocks: ContentBlock[];
  isLight: boolean;
  onCtaClick?: () => void;
}) {
  const headingClass = `font-bold tracking-tight ${isLight ? "text-zinc-900" : "text-white"}`;
  const bodyClass    = `leading-[1.85] ${isLight ? "text-zinc-600" : "text-zinc-300"}`;

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        // Blocks with "_hidden": true are kept in the JSON for future use
        // but suppressed from rendering. Remove the flag to restore them.
        if ((block as any)._hidden) return null;

        switch (block.type) {
          case "p":
            return (
              <p key={i} className={`text-[17px] ${bodyClass}`}>
                {block.text}
              </p>
            );

case "p_linked":
  return (
    <p key={i} className={`text-[17px] ${bodyClass}`}>
      {block.textBefore}
      <Link href={block.href}>
        <span className="text-primary font-medium hover:opacity-80 transition-opacity duration-200 cursor-pointer">
          {block.linkText}
        </span>
      </Link>
      {block.textAfter}
    </p>
  );

case "p_rich":
  return (
    <p key={i} className={`text-[17px] ${bodyClass}`}>
      {block.segments.map((seg, j) =>
        seg.href ? (
          seg.external ? (
            <a
              key={j}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:opacity-80 transition-opacity duration-200"
            >
              {seg.text}
            </a>
          ) : (
            <Link key={j} href={seg.href}>
              <span className="text-primary font-medium hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                {seg.text}
              </span>
            </Link>
          )
        ) : (
          <span key={j}>{seg.text}</span>
        )
      )}
    </p>
  );
          case "h2":
            return (
              <h2
                key={i}
                id={slugify(block.text)}
                className={`text-2xl md:text-3xl mt-12 mb-2 scroll-mt-28 ${headingClass}`}
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3 key={i} id={slugify(block.text)} className={`text-xl mt-8 mb-1 scroll-mt-28 ${headingClass}`}>
                {block.text}
              </h3>
            );

          case "bullets":
            return (
              <ul key={i} className="space-y-3 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className={`flex gap-3 text-[17px] ${bodyClass}`}>
                    <span className="mt-[9px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "numbered":
            return (
              <ol key={i} className="space-y-3 pl-1 list-none">
                {block.items.map((item, j) => (
                  <li key={j} className={`flex gap-3 text-[17px] ${bodyClass}`}>
                    <span className="flex-shrink-0 text-[12px] font-bold text-primary mt-1.5 w-5 text-right">
                      {j + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className={`border-l-[3px] border-primary pl-5 py-1 my-8 ${
                  isLight ? "bg-zinc-50" : "bg-white/[0.025]"
                } rounded-r-lg pr-5`}
              >
                <p className={`text-[17px] italic ${isLight ? "text-zinc-600" : "text-zinc-300"}`}>
                  "{block.text}"
                </p>
                {block.attribution && (
                  <div
                    style={{ background: "transparent" }}
                    className={`mt-2 text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 ${
                      isLight ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    <span>— {block.attribution}</span>
                    {block.linkedInUrl && (
                      <a
                        href={block.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
                        style={{ background: "#0A66C2" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="12" height="12" viewBox="2 3 20 20" fill="white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </blockquote>
            );

          case "callout":
            return (
              <div
                key={i}
                className={`rounded-xl border border-primary/25 px-6 py-5 my-8 ${
                  isLight
                    ? "bg-primary/[0.05] text-zinc-700"
                    : "bg-primary/[0.06] text-zinc-200"
                }`}
              >
                <p className="text-[16px] leading-relaxed font-medium">
                  {block.text}
                </p>
              </div>
            );

          case "callout_linked":
            return (
              <div
                key={i}
                className={`rounded-xl border border-primary/25 px-6 py-5 my-8 ${
                  isLight
                    ? "bg-primary/[0.05] text-zinc-700"
                    : "bg-primary/[0.06] text-zinc-200"
                }`}
              >
                <p className="text-[16px] leading-relaxed font-medium">
                  {block.textBefore}
                  <Link href={block.href}>
                    <span className="text-primary hover:opacity-80 transition-opacity duration-200 cursor-pointer">
                      {block.linkText}
                    </span>
                  </Link>
                  {block.textAfter}
                </p>
              </div>
            );

          case "cta_inline":
            return (
              <div key={i} className="my-10 flex justify-center">
                <Link href={block.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCtaClick}
                    className="inline-flex items-center gap-2 bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors duration-300 cursor-pointer"
                  >
                    {block.label}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            );

          case "table":
            return (
              <div key={i} className="my-8 overflow-x-auto -mx-2 px-2">
                <table className="w-full min-w-[560px] border-collapse text-[14px]">
                  <thead>
                    <tr>
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className={`py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                            j === 0
                              ? `w-[30%] ${isLight ? "text-zinc-400" : "text-zinc-500"}`
                              : j === 1
                              ? `w-[35%] ${isLight ? "text-zinc-500" : "text-zinc-400"}`
                              : `w-[35%] text-primary`
                          } border-b-2 ${isLight ? "border-zinc-200" : "border-white/10"}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr
                        key={j}
                        className={
                          isLight
                            ? j % 2 === 0 ? "bg-zinc-50/70" : "bg-white"
                            : j % 2 === 0 ? "bg-white/[0.025]" : ""
                        }
                      >
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className={`py-3 px-4 align-top leading-snug ${
                              isLight
                                ? "border-b border-zinc-100"
                                : "border-b border-white/[0.05]"
                            } ${
                              k === 0
                                ? `text-[11px] font-bold uppercase tracking-wide ${
                                    isLight ? "text-zinc-500" : "text-zinc-400"
                                  }`
                                : k === 1
                                ? isLight ? "text-zinc-500" : "text-zinc-400"
                                : isLight ? "text-zinc-700 font-medium" : "text-zinc-200 font-medium"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "divider":
            return (
              <hr
                key={i}
                className={`my-14 border-t ${
                  isLight ? "border-zinc-200" : "border-white/10"
                }`}
              />
            );

          case "image_caption":
            return (
              <figure key={i} className="my-10">
                <div
                  className={`rounded-xl overflow-hidden border ${
                    isLight
                      ? "bg-zinc-100 border-zinc-200"
                      : "bg-zinc-900 border-white/8"
                  }`}
                  style={{ minHeight: "200px" }}
                >
                  <img
                    src={block.src}
                    alt={block.alt ?? ""}
                    className="w-full h-auto object-cover block"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.style.display = "none";
                      const ph = img.nextElementSibling as HTMLElement | null;
                      if (ph) ph.style.display = "flex";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className={`w-full min-h-[200px] flex flex-col items-center justify-center gap-2 p-8 text-center ${
                      isLight ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    <span className={`text-sm font-medium ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                      Image coming soon
                    </span>
                    <span className="text-[11px] opacity-60 font-mono">{block.src}</span>
                  </div>
                </div>
                {block.caption && (
                  <figcaption
                    className={`mt-3 text-[12px] leading-relaxed text-left italic ${
                      isLight ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "image_carousel":
            return (
              <ImageCarousel
                key={i}
                images={block.images}
                isLight={isLight}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ArticleHero — full-width image-background hero
// ─────────────────────────────────────────────────────────────

function ArticleHero({
  article,
  articleTitle,
  formattedDate,
}: {
  article: Article;
  articleTitle: string;
  formattedDate: string | null;
}) {
  const { t } = useTranslation();

  // Mobile: aspect-[16/9] forces the hero to be landscape so cover images are
  // not portrait-cropped. min-h-[320px] ensures back-button + title + bottom
  // padding always have room. CSS gives max(aspect-ratio-height, min-height),
  // so on a 390px wide phone: max(219px, 320px) = 320px → 1.22:1 landscape. ✓
  // Desktop (md+): aspect-auto + min-h-[80vh] restores the original design.
  return (
    <section
  className="relative w-full aspect-[16/9] min-h-[320px] md:aspect-auto md:min-h-[80vh] flex flex-col overflow-hidden bg-black text-white"
  style={{ colorScheme: "dark" }}
>
      <div className="absolute inset-0">
        {article.image ? (
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover"
            width={1200}
            height={630}
          />
        ) : (
          <ArticlePlaceholder tagId={article.primaryTag} size="featured" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

      <div className="relative z-10 pt-28 px-6 md:px-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200"
style={{ color: "rgba(255,255,255,0.7)" }}
        >
          ←&nbsp;{t("blog.articlePage.backToBlog")}
        </Link>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 px-6 md:px-16 pb-12 md:pb-16 max-w-[700px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-2.5 mb-5"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1"
style={{
  color: "#ffffff",
  backgroundColor: "rgba(0,0,0,0.5)",
  border: "1px solid rgba(255,255,255,0.2)"
}}>
            <CategoryIcon id={article.primaryTag} className="w-3 h-3" />
            {t(`blog.tags.${article.primaryTag}`)}
          </span>

          {article.secondaryTag && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1"
style={{
  color: "rgba(255,255,255,0.7)",
  backgroundColor: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.1)"
}}>
              {t(`blog.tags.${article.secondaryTag}`)}
            </span>
          )}

          <span
  className="text-[10px] font-bold uppercase tracking-widest"
  style={{ color: "rgba(255,255,255,0.7)" }}
>
            {t("blog.articlePage.minRead", { count: article.readTime })}
          </span>
        </motion.div>

<motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight"
  style={{
    color: "#ffffff",
    WebkitTextFillColor: "#ffffff",
    opacity: 1,
    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
  }}
>
  {articleTitle}
</motion.h1>
        {formattedDate && (
<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="mt-4 text-[13px]"
  style={{
    color: "rgba(255,255,255,0.68)",
    WebkitTextFillColor: "rgba(255,255,255,0.68)",
    opacity: 1
  }}
>
  {formattedDate}
</motion.p>
        )}
      </div>
    </section>
  );
}
// ─────────────────────────────────────────────────────────────
//  RelatedArticles
// ─────────────────────────────────────────────────────────────

function RelatedArticles({
  currentArticle,
  isLight,
}: {
  currentArticle: Article;
  isLight: boolean;
}) {
  const { t } = useTranslation();

  const related = articles
    .filter(
      (a) =>
        a.id !== currentArticle.id &&
        (a.primaryTag === currentArticle.primaryTag ||
          a.secondaryTag === currentArticle.primaryTag)
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-white/8">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-6 h-px bg-primary" />
        <h2
          className={`text-[11px] font-bold uppercase tracking-[0.2em] ${
            isLight ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {t("blog.articlePage.relatedArticles")}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((article, i) => (
          <BlogCard
            key={article.id}
            article={article}
            isLight={isLight}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  ArticleCTA (bottom of page, dual button)
// ─────────────────────────────────────────────────────────────

function ArticleCTA({ isLight }: { isLight: boolean }) {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-3xl opacity-[0.06]"
          style={{ background: "#C8DF52" }}
        />
      </div>

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`relative rounded-3xl border px-8 md:px-16 py-16 md:py-20 text-center overflow-hidden ${
            isLight ? "bg-white border-zinc-200" : "bg-zinc-900/50 border-white/8"
          }`}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-primary/8" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-primary/5" />

          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary border border-primary/25 rounded-full px-4 py-1.5 mb-8">
            {t("blog.articlePage.ctaEyebrow")}
          </span>

          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 max-w-2xl mx-auto ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            {t("blog.articlePage.ctaHeadline")}
          </h2>

          <p
            className={`text-lg mb-10 max-w-lg mx-auto ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            {t("blog.articlePage.ctaSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors duration-300 cursor-pointer"
              >
                <span className="hidden sm:inline">{t("blog.articlePage.ctaPrimary")}</span>
                <span className="sm:hidden">{t("blog.articlePage.ctaPrimaryMobile")}</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </Link>

            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-2 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 cursor-pointer ${
                  isLight
                    ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
                    : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {t("blog.articlePage.ctaSecondary")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  BlogArticlePage  (default export)
// ─────────────────────────────────────────────────────────────

export default function BlogArticlePage() {
  const { theme } = useTheme();
  const { t }     = useTranslation();
  const isLight   = theme === "light";

  const params = useParams<{ slug: string }>();
  const slug   = params?.slug ?? "";
  const article = getArticleBySlug(slug);

  // Article body — loaded on demand from locales/blog/{lang}/{id}.json
  const [body, setBody] = useState<ContentBlock[]>([]);

  useEffect(() => {
    if (!article) { setBody([]); return; }

    const lang = i18n.language?.split("-")[0] ?? "en"; // normalise e.g. "en-US" → "en"
    const id   = article.id;

    const load = async () => {
      try {
        // Try the current locale first; fall back to English
        let mod: { default: { body: ContentBlock[] } };
        try {
          mod = await import(`../locales/blog/${lang}/${id}.json`);
        } catch {
          mod = await import(`../locales/blog/en/${id}.json`);
        }
        setBody(mod.default.body ?? []);
      } catch (err) {
        console.error(`[BlogArticle] Failed to load body for article ${id}`, err);
        setBody([]);
      }
    };

    load();
  }, [article?.id, i18n.language]);

  const articleTitle = article ? t(`blog.articles.${article.id}.title`) : "";

  // GA4 scroll tracking
  useScrollTracking(article?.id ?? 0, articleTitle);

  // ── Dynamic SEO + JSON-LD ──────────────────────────────────
  useEffect(() => {
    if (!article) return;

    const title       = `${articleTitle} | Tree'd`;
    const description = t(`blog.articles.${article.id}.excerpt`);
    const canonicalUrl = `${BASE_URL}/blog/${article.slug}`;

    document.title = title;

    const setMeta = (name: string, content: string, isProp = false) => {
      const attr = isProp ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description",         description);
    setMeta("robots",              "index,follow");
    setMeta("og:title",            title,            true);
    setMeta("og:description",      description,      true);
    setMeta("og:url",              canonicalUrl,     true);
    setMeta("og:type",             "article",        true);
    setMeta("article:section",     t(`blog.tags.${article.primaryTag}`), true);
    if (article.publishedAt) {
      setMeta("article:published_time", article.publishedAt, true);
    }

    // Canonical
    const canonical =
      document.querySelector('link[rel="canonical"]') ??
      (() => {
        const el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
        return el;
      })();
    canonical.setAttribute("href", canonicalUrl);

    // JSON-LD Article schema
    const existingLd = document.getElementById("article-jsonld");
    if (existingLd) existingLd.remove();

    const ld = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleTitle,
      "description": description,
      "url": canonicalUrl,
      "author": {
        "@type": "Organization",
        "name": "Tree'd History Guide",
        "url": BASE_URL,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Tree'd History Guide",
        "url": BASE_URL,
      },
      ...(article.publishedAt && { "datePublished": article.publishedAt }),
      "articleSection": t(`blog.tags.${article.primaryTag}`),
    };

    const script = document.createElement("script");
    script.id   = "article-jsonld";
    script.type = "application/ld+json";
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);

    return () => {
      document.getElementById("article-jsonld")?.remove();
    };
  }, [article, articleTitle, t]);

  // ── 404 state ──────────────────────────────────────────────
  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 pt-40 pb-24 text-center">
          <p className={`mb-6 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
            {t("blog.articlePage.notFound")}
          </p>
          <Link href="/blog" className="text-primary text-sm font-bold uppercase tracking-widest hover:underline">
            ← {t("blog.articlePage.browseAll")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Format publish date for display.
  // Hidden for specific articles where the date should not appear under the title.
  const HIDE_DATE_SLUGS = new Set([
    "treed-signs-first-museum-partnership-fayoum-art-center",
  ]);
  const formattedDate =
    article.publishedAt && !HIDE_DATE_SLUGS.has(article.slug)
      ? new Date(article.publishedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  // Shared TOC state — called once, passed to both DesktopTOC and MobileTOC
  const tocState = useTocState(Array.isArray(body) ? body : []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgressBar />

<Navbar />

<main>
  {/* ── 1. Full-width image hero ──────────────────────── */}
 <div
  className="bg-black text-white isolate pt-10 md:pt-24"
  style={{
    color: "#ffffff",
    backgroundColor: "#000000"
  }}
>
  <ArticleHero
    article={article}
    articleTitle={articleTitle}
    formattedDate={formattedDate}
  />
</div>

        {/* ── 2. Article body + TOC sidebar ────────────────── */}
        <div className="container mx-auto px-4 py-12 pb-8">
          <div className="flex gap-0 xl:gap-16 max-w-[1100px] mx-auto">

            {/* Reading column */}
            <div className="min-w-0 w-full max-w-[720px]">
              {/* Mobile TOC — collapsible, hidden at xl+ */}
              {tocState.items.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="xl:hidden"
                >
                  <MobileTOC {...tocState} isLight={isLight} />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                {Array.isArray(body) && body.length > 0 ? (
                  <ArticleBody
                    blocks={body}
                    isLight={isLight}
                    onCtaClick={() => {
                      if (typeof window.gtag === "function") {
                        window.gtag("event", "article_cta_click", {
                          article_id:    article.id,
                          article_title: articleTitle,
                        });
                      }
                    }}
                  />
                ) : (
                  <p className={`text-[17px] leading-relaxed ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                    {t(`blog.articles.${article.id}.excerpt`)}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Desktop TOC sidebar — sticky, xl+ only */}
            {tocState.items.length >= 2 && (
              <aside className="hidden xl:block w-[200px] flex-shrink-0 self-start">
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                >
                  <DesktopTOC {...tocState} isLight={isLight} />
                </motion.div>
              </aside>
            )}
          </div>
        </div>

        {/* ── 3. Related articles ──────────────────────────── */}
        <div className="container mx-auto px-4 pb-8">
          <RelatedArticles currentArticle={article} isLight={isLight} />
        </div>

        {/* ── 4. Page CTA ────────────────────────────────── */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-3xl opacity-[0.06]"
              style={{ background: "#C8DF52" }}
            />
          </div>

          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-3xl border px-8 md:px-16 py-16 md:py-20 text-center overflow-hidden ${
                isLight
                  ? "bg-white border-zinc-200"
                  : "bg-zinc-900/50 border-white/8"
              }`}
            >
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-primary/8" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-primary/5" />

              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary border border-primary/25 rounded-full px-4 py-1.5 mb-8">
                {t("blog.articlePage.ctaEyebrow")}
              </span>

              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 max-w-2xl mx-auto ${
                  isLight ? "text-zinc-900" : "text-white"
                }`}
              >
                {t("blog.articlePage.ctaHeadline")}
              </h2>

              <p
                className={`text-lg mb-10 max-w-lg mx-auto ${
                  isLight ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {t("blog.articlePage.ctaSubtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/booking">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-primary text-black font-bold uppercase tracking-tighter text-sm rounded-full px-8 py-4 cursor-pointer transition-all hover:bg-primary/90"
                  >
                    <span className="hidden sm:inline">{t("blog.articlePage.ctaPrimary")}</span>
                    <span className="sm:hidden">{t("blog.articlePage.ctaPrimaryMobile")}</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </motion.button>
                </Link>

                <Link href="/blog">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 font-bold uppercase tracking-tighter text-sm rounded-full px-8 py-4 cursor-pointer border transition-all ${
                      isLight
                        ? "border-zinc-300 text-zinc-600 hover:border-primary/50 hover:text-primary"
                        : "border-white/10 text-zinc-300 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {t("blog.articlePage.ctaSecondary")}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
