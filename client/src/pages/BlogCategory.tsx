// ─────────────────────────────────────────────────────────────
//  Tree'd — Blog Category Landing Page
//  Route: /blog/:slug  (e.g. /blog/pricing, /blog/ai-audio-guides)
//
//  Sections:
//    1. CategoryHero   — eyebrow pill, H1, intro, 3 highlight pills
//    2. FeaturedSection — 2–3 top articles as horizontal cards
//    3. CategoryNavPills — sticky nav: All + 6 categories as links
//    4. Article grid   — all category articles, sort: Latest
//    5. CategoryCTA    — dual-button CTA
//
//  i18n: all user-visible strings resolved via t().
//        Shared visual components imported from BlogShared.tsx.
//        SEO: dynamic via useEffect + t().
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";
import {
  articles,
  categories,
  getCategoryBySlug,
  getArticleCountForCategory,
  type Category,
  type TagId,
} from "@/data/blogData";
import {
  CategoryIcon,
  FeaturedArticleCard,
  BlogCard,
} from "@/components/blog/BlogShared";

const BASE_URL = "https://treed.co";

// ─────────────────────────────────────────────────────────────
//  CategoryHero
// ─────────────────────────────────────────────────────────────

function CategoryHero({
  category,
  isLight,
}: {
  category: Category;
  isLight: boolean;
}) {
  const { t } = useTranslation();
  const highlights = t(`blog.categoryContent.${category.id}.highlights`, {
    returnObjects: true,
  }) as string[];

  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[280px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "#C8DF52" }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/blog"
            className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-primary ${
              isLight ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            ←&nbsp;{t("blog.categoryPage.allResources")}
          </Link>
        </motion.div>

        {/* Icon + eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-6"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isLight
                ? "bg-white border-zinc-200 text-primary"
                : "bg-zinc-900 border-white/8 text-primary"
            }`}
          >
            <CategoryIcon id={category.id} className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary border border-primary/25 rounded-full px-4 py-1.5">
            {t(`blog.tags.${category.id}`)}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={`text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5 max-w-3xl ${
            isLight ? "text-zinc-900" : "text-white"
          }`}
        >
          {t(`blog.categoryContent.${category.id}.heroTitle`)}
        </motion.h1>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className={`text-lg leading-relaxed max-w-2xl mb-8 ${
            isLight ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {t(`blog.categoryContent.${category.id}.heroIntro`)}
        </motion.p>

        {/* Highlight pills — soft informational style */}
        {Array.isArray(highlights) && highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="flex flex-wrap gap-2"
          >
            {highlights.map((label, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${
                  isLight
                    ? "border-zinc-200 text-zinc-500 bg-zinc-50"
                    : "border-white/8 text-zinc-400 bg-white/[0.03]"
                }`}
              >
                <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                {label}
              </span>
            ))}
          </motion.div>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent max-w-sm"
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  FeaturedSection
// ─────────────────────────────────────────────────────────────

function FeaturedSection({
  category,
  isLight,
}: {
  category: Category;
  isLight: boolean;
}) {
  const { t } = useTranslation();

  const categoryArticles = articles.filter(
    (a) => a.primaryTag === category.id || a.secondaryTag === category.id
  );

  // Featured-first, then fill by readTime desc; take up to 3
  const featuredOnes   = categoryArticles.filter((a) => a.featured);
  const nonFeatured    = categoryArticles
    .filter((a) => !a.featured)
    .sort((a, b) => b.readTime - a.readTime);
  const topArticles    = [...featuredOnes, ...nonFeatured].slice(0, Math.min(3, categoryArticles.length));

  if (topArticles.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pb-4">
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
          {t("blog.categoryPage.featuredSection")}
        </h2>
      </motion.div>

      <div className="flex flex-col gap-6">
        {topArticles.map((article, i) => (
          <FeaturedArticleCard
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
//  CategoryNavPills  (sticky below navbar)
// ─────────────────────────────────────────────────────────────

function CategoryNavPills({
  activeId,
  isLight,
}: {
  activeId: TagId;
  isLight: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`sticky top-[72px] z-40 border-b transition-all duration-300 ${
        isLight
          ? "bg-white/90 border-zinc-200 backdrop-blur-md"
          : "glass border-white/5"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {/* All */}
          <Link href="/blog">
            <span
              className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isLight
                  ? "border-zinc-300 text-zinc-500 hover:border-primary/50 hover:text-primary"
                  : "border-white/10 text-zinc-400 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {t("blog.filters.all")}
            </span>
          </Link>

          {/* Each category */}
          {categories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <Link key={cat.id} href={`/blog/${cat.slug}`}>
                <span
                  className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-black border-primary"
                      : isLight
                      ? "border-zinc-300 text-zinc-500 hover:border-primary/50 hover:text-primary"
                      : "border-white/10 text-zinc-400 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {t(`blog.filters.${cat.id}`)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CategoryCTA  (dual-button)
// ─────────────────────────────────────────────────────────────

function CategoryCTA({ isLight }: { isLight: boolean }) {
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
            isLight
              ? "bg-white border-zinc-200"
              : "bg-zinc-900/50 border-white/8"
          }`}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-primary/8" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-primary/5" />

          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary border border-primary/25 rounded-full px-4 py-1.5 mb-8">
            {t("blog.cta.eyebrow")}
          </span>

          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 max-w-2xl mx-auto ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            {t("blog.categoryPage.ctaHeadline")}
          </h2>

          <p
            className={`text-lg mb-10 max-w-lg mx-auto ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            {t("blog.categoryPage.ctaSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-primary text-black font-bold uppercase tracking-tighter text-sm rounded-full px-8 py-4 cursor-pointer transition-all hover:bg-primary/90"
              >
                {t("blog.categoryPage.ctaPrimary")}
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
                {t("blog.categoryPage.ctaSecondary")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  BlogCategoryPage  (default export)
// ─────────────────────────────────────────────────────────────

export default function BlogCategoryPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isLight = theme === "light";

  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const category = getCategoryBySlug(slug);

  const categoryArticles = category
    ? articles
        .filter((a) => a.primaryTag === category.id || a.secondaryTag === category.id)
        .sort((a, b) => b.id - a.id) // Latest = highest id
    : [];

  const count = category ? getArticleCountForCategory(category.id) : 0;

  // ── Dynamic SEO ───────────────────────────────────────────
  useEffect(() => {
    if (!category) return;

    const categoryName = t(`blog.tags.${category.id}`);
    const descriptor   = t(`blog.categoryCards.descriptors.${category.id}`);
    const title        = t("blog.categoryPage.seoTitle",       { categoryName });
    const description  = t("blog.categoryPage.seoDescription", { descriptor });

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

    const canonicalUrl = `${BASE_URL}/blog/${slug}`;

    setMeta("description",    description);
    setMeta("robots",         "index,follow");
    setMeta("og:title",       title,        true);
    setMeta("og:description", description,  true);
    setMeta("og:url",         canonicalUrl, true);
    setMeta("og:type",        "website",    true);

    const canonical =
      document.querySelector('link[rel="canonical"]') ??
      (() => {
        const el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
        return el;
      })();
    canonical.setAttribute("href", canonicalUrl);
  }, [category, slug, t]);

  // ── 404 state ─────────────────────────────────────────────
  if (!category) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 pt-40 pb-24 text-center">
          <p className={`mb-6 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
            {t("blog.categoryPage.noArticles")}
          </p>
          <Link
            href="/blog"
            className="text-primary text-sm font-bold uppercase tracking-widest hover:underline"
          >
            ← {t("blog.categoryPage.browseAll")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StructuredData page="blog" />
      <Navbar />

      <main>
        {/* ── 1. Hero ──────────────────────────────────────── */}
        <CategoryHero category={category} isLight={isLight} />

        {/* ── 2. Featured articles ─────────────────────────── */}
        <FeaturedSection category={category} isLight={isLight} />

        {/* ── 3. Category nav pills (sticky) ───────────────── */}
        <CategoryNavPills activeId={category.id} isLight={isLight} />

        {/* ── 4. Article grid ──────────────────────────────── */}
        <section className="container mx-auto px-4 pt-10 pb-8">
          {/* Header row: section label + sort control */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-primary" />
              <h2
                className={`text-[11px] font-bold uppercase tracking-[0.2em] ${
                  isLight ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {t(`blog.tags.${category.id}`)}
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isLight
                    ? "border-zinc-200 text-zinc-400"
                    : "border-white/8 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </div>

            {/* Sort control — extensible */}
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                isLight
                  ? "border-primary/30 text-primary bg-primary/5"
                  : "border-primary/25 text-primary bg-primary/5"
              }`}
            >
              {t("blog.categoryPage.sortLatest")}
            </span>
          </motion.div>

          {categoryArticles.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {categoryArticles.map((article, i) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  isLight={isLight}
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-24 ${
                isLight ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              <p className="text-sm mb-6">{t("blog.categoryPage.noArticles")}</p>
              <Link
                href="/blog"
                className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
              >
                ← {t("blog.categoryPage.browseAll")}
              </Link>
            </motion.div>
          )}
        </section>

        {/* ── 5. CTA ───────────────────────────────────────── */}
        <CategoryCTA isLight={isLight} />
      </main>

      <Footer />
    </div>
  );
}
