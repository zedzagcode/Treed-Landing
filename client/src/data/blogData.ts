// ─────────────────────────────────────────────────────────────
//  Tree'd Blog — Data Layer
//
//  Design principles:
//  • Logic uses stable snake_case IDs (TagId, FilterId) — never
//    raw English display strings.
//  • All user-visible text lives in the locale files under the
//    "blog" key.  Components resolve labels via t().
//  • Article titles and excerpts are in locales/en.json under
//    blog.articles.{id}.title / blog.articles.{id}.excerpt.
//    Add the same keys to nl.json / fr.json when those locales
//    are ready.
// ─────────────────────────────────────────────────────────────

// ─── ID types ─────────────────────────────────────────────────

/** Stable IDs for every tag / category.  Never change these —
 *  they are used in routing slugs, filter state, and i18n key
 *  paths.  Display labels live in blog.tags.{id}. */
export type TagId =
  | "ai_audio_guides"
  | "museum_operations"
  | "visitor_experience"
  | "treed_perspective"
  | "pricing"
  | "comparisons"
  | "news";

/** "all" plus every TagId — the full set of valid filter states. */
export type FilterId = "all" | TagId;

// ─── Ordered filter list (drives the filter bar) ──────────────

export const ALL_FILTER_IDS: FilterId[] = [
  "all",
  "news",
  "ai_audio_guides",
  "museum_operations",
  "visitor_experience",
  "treed_perspective",
  "pricing",
  "comparisons",
];

// ─── Data interfaces ──────────────────────────────────────────

// ─── Article body content blocks ─────────────────────────────

/** Typed content blocks for article bodies.
 *  Bodies live in en.json under blog.articles.{id}.body
 *  and are translated per-locale using the same key path.
 *
 *  Read-time calculation: use calculateReadTime(blocks) — never
 *  guess.  Word count / 225 wpm, rounded up, minimum 1 minute.
 */
export type ContentBlock =
  | { type: "p";       text: string }
  | { type: "p_linked"; textBefore: string; linkText: string; href: string; textAfter: string }
  | { type: "h2";      text: string }
  | { type: "h3";      text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "quote";   text: string; attribution?: string; linkedInUrl?: string }
  | { type: "callout"; text: string }
  | { type: "callout_linked"; textBefore: string; linkText: string; href: string; textAfter: string }
  | { type: "cta_inline"; text: string; href: string; label: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "divider" }
  | { type: "image_caption"; src: string; alt?: string; caption?: string }
  | { type: "image_carousel"; images: Array<{ src: string; alt?: string; caption?: string }> }
  | { type: "p_rich"; segments: Array<{ text: string; href?: string; external?: boolean }> };

/** Count words across all text content in a block array.
 *  Use this to set readTime when publishing a new article. */
export function calculateReadTime(blocks: ContentBlock[]): number {
  let words = 0;
  for (const b of blocks) {
    if ("text"  in b) words += b.text.split(/\s+/).filter(Boolean).length;
    if ("items" in b) b.items.forEach(i => { words += i.split(/\s+/).filter(Boolean).length; });
  }
  return Math.max(1, Math.ceil(words / 225));
}

export interface Article {
  /** Numeric ID — used as the i18n key segment:
   *  blog.articles.{id}.title  /  blog.articles.{id}.excerpt
   *  blog.articles.{id}.body   (array of ContentBlock objects) */
  id: number;
  /** URL slug — stable, never translated. */
  slug: string;
  primaryTag: TagId;
  secondaryTag?: TagId;
  /** Minutes. Set via calculateReadTime(body) when publishing.
   *  Displayed via t('blog.grid.minRead', { count }). */
  readTime: number;
  featured: boolean;
  /** ISO 8601 publish date, e.g. "2025-03-10".
   *  Optional — shown in article meta and JSON-LD schema. */
  publishedAt?: string;
  /** Optional hero image path (relative to /public or full URL).
   *  Falls back to ArticlePlaceholder gradient when absent. */
  image?: string;
}

export interface Category {
  /** Stable ID — doubles as the tag ID and the i18n key segment.
   *  Display name: t('blog.tags.{id}')
   *  Descriptor:   t('blog.categoryCards.descriptors.{id}') */
  id: TagId;
  /** URL slug — derived from id, stable, never translated. */
  slug: string;
}

// ─── Articles ─────────────────────────────────────────────────

export const articles: Article[] = [
  {
    id: 16,
    slug: "treed-signs-first-museum-partnership-fayoum-art-center",
    primaryTag: "news",
    readTime: 4,
    featured: true,
    publishedAt: "2026-02-25",
    image: "/blog/treed-signs-first-museum-partnership-fayoum-art-center.jpg",
  },
  {
    id: 1,
    slug: "what-is-an-ai-museum-audio-guide",
    primaryTag: "ai_audio_guides",
    readTime: 6,
    featured: false,
    publishedAt: "2026-03-13",
    image: "/blog/what-is-an-ai-museum-audio-guide.png",
  },
  {
    id: 2,
    slug: "what-is-a-conversational-audio-guide",
    primaryTag: "ai_audio_guides",
    readTime: 8,
    featured: false,
    publishedAt: "2026-03-15",
    image: "/blog/what-is-a-conversational-audio-guide.png",
  },
  {
    id: 3,
    slug: "how-much-does-a-museum-audio-guide-cost",
    primaryTag: "museum_operations",
    secondaryTag: "pricing",
    readTime: 9,
    featured: true,
    publishedAt: "2026-04-11",
    image: "/blog/how-much-does-a-museum-audio-guide-cost.png",
  },
  {
    id: 4,
    slug: "ai-audio-guide-vs-traditional-audio-guide",
    primaryTag: "ai_audio_guides",
    secondaryTag: "comparisons",
    readTime: 7,
    featured: false,
    publishedAt: "2026-03-30",
    image: "/blog/ai-audio-guide-vs-traditional-audio-guide.png",
  },
  {
    id: 5,
    slug: "museum-audio-guide-vs-mobile-app",
    primaryTag: "museum_operations",
    secondaryTag: "comparisons",
    readTime: 7,
    featured: false,
    publishedAt: "2026-04-8",
    image: "/blog/museum-audio-guide-vs-mobile-app.png",
  },
  {
    id: 6,
    slug: "multilingual-museum-audio-guide-language-access",
    primaryTag: "visitor_experience",
    secondaryTag: "museum_operations",
    readTime: 8,
    featured: false,
    publishedAt: "2026-04-5",
    image: "/blog/multilingual-museum-audio-guide-language-access.png",
  },
  {
    id: 7,
    slug: "nfc-tags-vs-number-entry-museum-audio-guides",
    primaryTag: "museum_operations",
    secondaryTag: "comparisons",
    readTime: 7,
    featured: false,
    publishedAt: "2026-03-4",
    image: "/blog/nfc-tags-vs-number-entry-museum-audio-guides.png",
  },
  {
    id: 8,
    slug: "why-better-audio-guide-content-wont-fix-visitor-engagement",
    primaryTag: "treed_perspective",
    secondaryTag: "visitor_experience",
    readTime: 7,
    featured: false,
    publishedAt: "2026-03-29",
    image: "/blog/why-better-audio-guide-content-wont-fix-visitor-engagement.png",
  },
  {
    id: 9,
    slug: "why-museum-visitors-stop-using-audio-guides",
    primaryTag: "visitor_experience",
    secondaryTag: "museum_operations",
    readTime: 7,
    featured: true,
    publishedAt: "2026-03-31",
    image: "/blog/why-museum-visitors-stop-using-audio-guides.png",
  },
  {
    id: 10,
    slug: "screen-problem-museum-galleries-eyes-on-the-art",
    primaryTag: "treed_perspective",
    secondaryTag: "visitor_experience",
    readTime: 7,
    featured: false,
    publishedAt: "2026-04-19",
    image: "/blog/screen-problem-museum-galleries-eyes-on-the-art.png",
  },
  {
    id: 11,
    slug: "the-questions-visitors-never-get-to-ask",
    primaryTag: "treed_perspective",
    secondaryTag: "visitor_experience",
    readTime: 7,
    featured: false,
    publishedAt: "2026-03-22",
    image: "/blog/the-questions-visitors-never-get-to-ask.png",
  },
  {
    id: 12,
    slug: "90-day-museum-audio-guide-pilot",
    primaryTag: "museum_operations",
    secondaryTag: "visitor_experience",
    readTime: 7,
    featured: false,
    publishedAt: "2026-03-20",
    image: "/blog/90-day-museum-audio-guide-pilot.png",
  },
  {
    id: 13,
    slug: "how-museum-directors-should-evaluate-audio-guides-2026",
    primaryTag: "museum_operations",
    secondaryTag: "comparisons",
    readTime: 9,
    featured: false,
    publishedAt: "2026-03-12",
    image: "/blog/how-museum-directors-should-evaluate-audio-guides-2026.png",
  },
  {
    id: 14,
    slug: "museum-audio-guide-accessibility-beyond-language",
    primaryTag: "visitor_experience",
    secondaryTag: "museum_operations",
    readTime: 7,
    featured: false,
    publishedAt: "2026-03-15",
    image: "/blog/museum-audio-guide-accessibility-beyond-language.png",
  },
  {
    id: 15,
    slug: "museum-audio-guide-pricing-models",
    primaryTag: "pricing",
    secondaryTag: "museum_operations",
    readTime: 7,
    featured: false,
    publishedAt: "2026-04-10",
    image: "/blog/museum-audio-guide-pricing-models.png",
  },
];

// ─── Categories ───────────────────────────────────────────────

export const categories: Category[] = [
  { id: "ai_audio_guides",    slug: "ai-audio-guides" },
  { id: "museum_operations",  slug: "museum-operations" },
  { id: "visitor_experience", slug: "visitor-experience" },
  { id: "treed_perspective",  slug: "treed-perspective" },
  { id: "pricing",            slug: "pricing" },
  { id: "comparisons",        slug: "comparisons" },
  { id: "news",               slug: "news" },
];

// ─── Helpers ──────────────────────────────────────────────────

/** Return articles matching a filter.  "all" returns every article. */
export function filterArticles(list: Article[], filter: FilterId): Article[] {
  if (filter === "all") return list;
  return list.filter(
    (a) => a.primaryTag === filter || a.secondaryTag === filter
  );
}

/** Count articles belonging to a given tag (primary or secondary). */
export function getArticleCountForCategory(tagId: TagId): number {
  return articles.filter(
    (a) => a.primaryTag === tagId || a.secondaryTag === tagId
  ).length;
}

/** Resolve a URL slug to its Category, or undefined if not found. */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Resolve a URL slug to its Article, or undefined if not found. */
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** Set of all known category slugs — used for O(1) routing dispatch. */
export const CATEGORY_SLUGS = new Set(categories.map((c) => c.slug));
