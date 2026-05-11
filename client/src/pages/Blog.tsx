// ─────────────────────────────────────────────────────────────
//  Tree'd — Blog Page
//  Premium content hub for museum decision-makers.
//
//  i18n:  all user-visible strings resolved via t().
//         Tag/filter logic uses stable TagId / FilterId values.
//         Article content lives in blog.articles.{id}.* keys.
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, SlidersHorizontal, ChevronDown, Check, ArrowUp, ArrowDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";
import {
  articles,
  categories,
  ALL_FILTER_IDS,
  filterArticles,
  getArticleCountForCategory,
  type FilterId,
  type Category,
  type TagId,
} from "@/data/blogData";
import {
  CategoryIcon,
  ArticlePlaceholder,
  TagPill,
  FeaturedArticleCard,
  BlogCard,
} from "@/components/blog/BlogShared";

// ─────────────────────────────────────────────────────────────
//  BlogHero
// ─────────────────────────────────────────────────────────────

function BlogHero({ isLight }: { isLight: boolean }) {
  const { t } = useTranslation();

  return (
    <section className="relative pt-40 pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "#C8DF52" }}
        />
      </div>

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/5"
          style={{
            width:  `${60 + i * 40}px`,
            height: `${60 + i * 40}px`,
            top:  `${10 + i * 15}%`,
            left: `${5  + i * 18}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.03, 0.07, 0.03] }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary border border-primary/25 rounded-full px-4 py-1.5 mb-8">
            {t("blog.hero.eyebrow")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto mb-6 ${
            isLight ? "text-zinc-900" : "text-white"
          }`}
        >
          {t("blog.hero.headlinePart1")}{" "}
          <span className="text-primary">{t("blog.hero.headlinePart2")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className={`text-lg leading-relaxed max-w-2xl mx-auto ${
            isLight ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          {t("blog.hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent max-w-xs mx-auto"
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  BlogFilterBar
// ─────────────────────────────────────────────────────────────

function BlogFilterBar({
  activeFilter,
  onFilterChange,
  isLight,
}: {
  activeFilter: FilterId;
  onFilterChange: (f: FilterId) => void;
  isLight: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`sticky top-0 z-30 border-b transition-all duration-300 ${
        isLight
          ? "bg-white/90 border-zinc-200 backdrop-blur-md"
          : "glass border-white/5"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {ALL_FILTER_IDS.map((id) => (
            <button
              key={id}
              onClick={() => onFilterChange(id)}
              className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeFilter === id
                  ? "bg-primary text-black border-primary"
                  : isLight
                  ? "border-zinc-300 text-zinc-500 hover:border-primary/50 hover:text-primary"
                  : "border-white/10 text-zinc-400 hover:border-primary/40 hover:text-primary"
              }`}
              style={activeFilter === id && isLight ? { color: "#000000" } : undefined}
            >
              {t(`blog.filters.${id}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  BlogCategoryCard
// ─────────────────────────────────────────────────────────────

function BlogCategoryCard({
  category,
  isLight,
  index,
}: {
  category: Category;
  isLight: boolean;
  index: number;
}) {
  const { t } = useTranslation();
  const count = getArticleCountForCategory(category.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
    >
      <Link href={`/blog/${category.slug}`}>
        <div
          className={`group h-full flex flex-col gap-3 p-5 rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
            isLight
              ? "bg-white border-zinc-200 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(200,223,82,0.10)]"
              : "bg-zinc-900/30 border-white/8 hover:border-primary/30 hover:shadow-[0_0_24px_rgba(200,223,82,0.07)]"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 ${
              isLight
                ? "border-zinc-200 text-zinc-500 group-hover:border-primary/40 group-hover:text-primary"
                : "border-white/8 text-zinc-400 group-hover:border-primary/30 group-hover:text-primary"
            }`}
          >
            <CategoryIcon id={category.id} className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <h3
              className={`text-sm font-bold mb-1 group-hover:text-primary transition-colors duration-200 ${
                isLight ? "text-zinc-800" : "text-white"
              }`}
            >
              {t(`blog.tags.${category.id}`)}
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
              {t(`blog.categoryCards.descriptors.${category.id}`)}
            </p>
          </div>

          <div
            className={`flex items-center justify-between pt-3 border-t ${
              isLight ? "border-zinc-100" : "border-white/5"
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isLight ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {t("blog.categoryCards.articleCount", { count })}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
              {t("blog.categoryCards.viewAll")} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  FAQCategoryCard
// ─────────────────────────────────────────────────────────────

function FAQCategoryCard({
  isLight,
  index,
}: {
  isLight: boolean;
  index: number;
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
    >
      <Link href="/faq">
        <div
          className={`group h-full flex flex-col gap-3 p-5 rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
            isLight
              ? "bg-primary/8 border-primary/30 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(200,223,82,0.15)]"
              : "bg-primary/5 border-primary/25 hover:border-primary/50 hover:shadow-[0_0_24px_rgba(200,223,82,0.12)]"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 ${
              isLight
                ? "border-primary/40 text-primary group-hover:border-primary/60"
                : "border-primary/30 text-primary group-hover:border-primary/50"
            }`}
          >
            <span className="text-lg font-bold">?</span>
          </div>

          <div className="flex-1">
            <h3
              className={`text-sm font-bold mb-1 transition-colors duration-200 text-primary`}
            >
              {t("blog.faqCard.title")}
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
              {t("blog.faqCard.description")}
            </p>
          </div>

          <div
            className={`flex items-center justify-end pt-3 border-t ${
              isLight ? "border-primary/15" : "border-primary/10"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
              {t("blog.categoryCards.viewAll")} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  BlogCTA
// ─────────────────────────────────────────────────────────────

function BlogCTA({ isLight }: { isLight: boolean }) {
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
            {t("blog.cta.headline")}
          </h2>

          <p
            className={`text-lg mb-10 max-w-lg mx-auto ${
              isLight ? "text-zinc-500" : "text-zinc-400"
            }`}
          >
            {t("blog.cta.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
  className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors duration-300 inline-flex items-center gap-2 cursor-pointer"
>
                <span className="hidden sm:inline">{t("blog.cta.button")}</span>
                <span className="sm:hidden">{t("blog.cta.buttonMobile")}</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </Link>
            <Link href="/request-pricing">
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className={`rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 inline-flex items-center gap-2 cursor-pointer ${
    isLight
      ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
      : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
  }`}
>
  {t("blog.cta.buttonSecondary")}
</motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  BlogPage  (default export)
// ─────────────────────────────────────────────────────────────

export default function BlogPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isLight = theme === "light";

  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [multiCategories, setMultiCategories] = useState<TagId[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "az">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close category dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const featuredArticles = articles.filter((a) => a.featured);

  // Build grid articles: top-bar filter → multi-category filter → sort
  let gridArticles = filterArticles(articles, activeFilter);
  if (multiCategories.length > 0) {
    gridArticles = gridArticles.filter(
      (a) =>
        multiCategories.includes(a.primaryTag) ||
        (a.secondaryTag !== undefined && multiCategories.includes(a.secondaryTag))
    );
  }
  if (sortBy === "az") {
    gridArticles = [...gridArticles].sort((a, b) => {
      const titleA = t(`blog.articles.${a.id}.title`);
      const titleB = t(`blog.articles.${b.id}.title`);
      const cmp = titleA.localeCompare(titleB);
      return sortDir === "asc" ? cmp : -cmp;
    });
  } else {
    gridArticles = [...gridArticles].sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return sortDir === "asc" ? dateA - dateB : dateB - dateA;
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="blog" />
      <StructuredData page="blog" />
      <Navbar />

      <main>
        <BlogHero isLight={isLight} />

        <BlogFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          isLight={isLight}
        />

        <div className="container mx-auto px-4 py-16 space-y-20">
  {activeFilter === "all" && (
    <section>
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
        {t("blog.sections.featured")}
      </h2>
    </motion.div>
    <div className="flex flex-col gap-6">
      {featuredArticles.map((article, i) => (
        <FeaturedArticleCard
          key={article.id}
          article={article}
          isLight={isLight}
          index={i}
        />
      ))}
    </div>
  </section>
)}

{activeFilter === "all" && (
  <section>
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
        {t("blog.sections.browseByCategory")}
      </h2>
    </motion.div>
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {categories.map((cat, i) => (
        <BlogCategoryCard
          key={cat.id}
          category={cat}
          isLight={isLight}
          index={i}
        />
      ))}
      <FAQCategoryCard
        isLight={isLight}
        index={categories.length}
      />
    </div>
  </section>
)}

          {/* ── Article grid ─────────────────────────────── */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8 flex-wrap"
            >
              {/* Section label + count */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-6 h-px bg-primary flex-shrink-0" />
                <h2
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap ${
                    isLight ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  {activeFilter === "all"
                    ? t("blog.sections.allArticles")
                    : t(`blog.tags.${activeFilter}`)}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    isLight
                      ? "border-zinc-200 text-zinc-400"
                      : "border-white/8 text-zinc-500"
                  }`}
                >
                  {gridArticles.length}
                </span>
              </div>

              {/* Filter + Sort controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Category filter dropdown */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setFilterOpen((o) => !o)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                      filterOpen || multiCategories.length > 0
                        ? "bg-primary border-primary"
                        : isLight
                        ? "border-zinc-300 text-zinc-500 hover:border-primary/50 hover:text-primary"
                        : "border-white/10 text-zinc-400 hover:border-primary/40 hover:text-primary"
                    }`}
                    style={
                      filterOpen || multiCategories.length > 0
                        ? { color: "#000000" }
                        : undefined
                    }
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    Filter
                    {multiCategories.length > 0 && (
                      <span
                        className="flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold"
                        style={{ background: "rgba(0,0,0,0.25)", color: "#000" }}
                      >
                        {multiCategories.length}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        filterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {filterOpen && (
                    <div
                      className={`absolute top-full right-0 mt-1.5 z-50 rounded-xl border p-1.5 min-w-[190px] shadow-xl ${
                        isLight
                          ? "bg-white border-zinc-200"
                          : "bg-zinc-900 border-white/10"
                      }`}
                    >
                      {categories.map((cat) => {
                        const active = multiCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            onClick={() =>
                              setMultiCategories((prev) =>
                                active
                                  ? prev.filter((c) => c !== cat.id)
                                  : [...prev, cat.id]
                              )
                            }
                            className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                              active
                                ? isLight
                                  ? "bg-primary/20"
                                  : "bg-primary/10 text-primary"
                                : isLight
                                ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                          style={active && isLight ? { color: "#09090b" } : undefined}
                          >
                            <span className="flex items-center gap-1.5">
                              <CategoryIcon id={cat.id} className="w-3 h-3" />
                              {t(`blog.tags.${cat.id}`)}
                            </span>
                            {active && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
                          </button>
                        );
                      })}
                      {multiCategories.length > 0 && (
                        <>
                          <div
                            className={`my-1 h-px ${
                              isLight ? "bg-zinc-100" : "bg-white/5"
                            }`}
                          />
                          <button
                            onClick={() => setMultiCategories([])}
                            className={`w-full text-center text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg cursor-pointer ${
                              isLight
                                ? "text-zinc-400 hover:text-zinc-700"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            Clear all
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Sort: Date */}
                <button
                  onClick={() => {
                    if (sortBy === "date") {
                      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
                    } else {
                      setSortBy("date");
                      setSortDir("desc");
                    }
                  }}
                  className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    sortBy === "date"
                      ? "bg-primary border-primary"
                      : isLight
                      ? "border-zinc-300 text-zinc-500 hover:border-primary/50 hover:text-primary"
                      : "border-white/10 text-zinc-400 hover:border-primary/40 hover:text-primary"
                  }`}
                  style={sortBy === "date" ? { color: "#000000" } : undefined}
                >
                  Date
                  {sortBy === "date" && (
                    sortDir === "desc"
                      ? <ArrowDown className="w-2.5 h-2.5" />
                      : <ArrowUp className="w-2.5 h-2.5" />
                  )}
                </button>

                {/* Sort: A–Z */}
                <button
                  onClick={() => {
                    if (sortBy === "az") {
                      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    } else {
                      setSortBy("az");
                      setSortDir("asc");
                    }
                  }}
                  className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    sortBy === "az"
                      ? "bg-primary border-primary"
                      : isLight
                      ? "border-zinc-300 text-zinc-500 hover:border-primary/50 hover:text-primary"
                      : "border-white/10 text-zinc-400 hover:border-primary/40 hover:text-primary"
                  }`}
                  style={sortBy === "az" ? { color: "#000000" } : undefined}
                >
                  {sortBy === "az" && sortDir === "desc" ? "Z–A" : "A–Z"}
                  {sortBy === "az" && (
                    sortDir === "asc"
                      ? <ArrowDown className="w-2.5 h-2.5" />
                      : <ArrowUp className="w-2.5 h-2.5" />
                  )}
                </button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFilter}-${multiCategories.join(",")}-${sortBy}-${sortDir}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {gridArticles.map((article, i) => (
                  <BlogCard
                    key={article.id}
                    article={article}
                    isLight={isLight}
                    index={i}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {gridArticles.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-20 ${
                  isLight ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                <p className="text-sm">{t("blog.grid.noArticles")}</p>
              </motion.div>
            )}
          </section>
{activeFilter !== "all" && (
  <section>
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
        {t("blog.sections.browseByCategory")}
      </h2>
    </motion.div>
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {categories.map((cat, i) => (
        <BlogCategoryCard
          key={cat.id}
          category={cat}
          isLight={isLight}
          index={i}
        />
      ))}
      <FAQCategoryCard
        isLight={isLight}
        index={categories.length}
      />
    </div>
  </section>
)}
        </div>

        <BlogCTA isLight={isLight} />
      </main>

      <Footer />
    </div>
  );
}
