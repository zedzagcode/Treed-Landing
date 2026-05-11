// ─────────────────────────────────────────────────────────────
//  Tree'd — Shared Blog Components
//
//  Exports:
//    CategoryIcon         — icon lookup by TagId (no English strings)
//    ArticlePlaceholder   — gradient + dot-grid visual for article cards
//    TagPill              — small tag badge (label via t())
//    FeaturedArticleCard  — horizontal card for featured sections
//    BlogCard             — vertical card for article grids
//
//  i18n: all user-visible strings resolved via t().
//        Badge shown only when article.featured === true.
// ─────────────────────────────────────────────────────────────

import { Link } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Clock,
  ArrowRight,
  Bot,
  Building2,
  Users,
  Brain,
  CircleDollarSign,
  GitCompare,
  Newspaper,
} from "lucide-react";
import type { Article, TagId } from "@/data/blogData";

// ─── CategoryIcon ─────────────────────────────────────────────

/** Map a stable TagId to its Lucide icon. No English strings used. */
export function CategoryIcon({ id, className }: { id: TagId; className?: string }) {
  const props = { className: className ?? "w-5 h-5", strokeWidth: 1.5 };
  switch (id) {
    case "ai_audio_guides":    return <Bot {...props} />;
    case "museum_operations":  return <Building2 {...props} />;
    case "visitor_experience": return <Users {...props} />;
    case "treed_perspective":  return <Brain {...props} />;
    case "pricing":            return <CircleDollarSign {...props} />;
    case "comparisons":        return <GitCompare {...props} />;
    case "news":               return <Newspaper {...props} />;
  }
}

// ─── ArticlePlaceholder ───────────────────────────────────────

/** Abstract gradient + dot-grid placeholder for article visuals. */
export function ArticlePlaceholder({
  tagId,
  size = "normal",
}: {
  tagId: TagId;
  size?: "normal" | "featured";
}) {
  const gradients: Record<TagId, string> = {
    ai_audio_guides:    "radial-gradient(ellipse at 30% 40%, rgba(200,223,82,0.12) 0%, transparent 65%)",
    museum_operations:  "radial-gradient(ellipse at 30% 40%, rgba(96,165,250,0.10) 0%, transparent 65%)",
    visitor_experience: "radial-gradient(ellipse at 30% 40%, rgba(251,191,36,0.10) 0%, transparent 65%)",
    treed_perspective:  "radial-gradient(ellipse at 30% 40%, rgba(52,211,153,0.10) 0%, transparent 65%)",
    pricing:            "radial-gradient(ellipse at 30% 40%, rgba(251,146,60,0.10) 0%, transparent 65%)",
    comparisons:        "radial-gradient(ellipse at 30% 40%, rgba(167,139,250,0.10) 0%, transparent 65%)",
    news:               "radial-gradient(ellipse at 30% 40%, rgba(244,63,94,0.10) 0%, transparent 65%)",
  };
  const iconSize = size === "featured" ? "w-12 h-12" : "w-8 h-8";

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      <div className="absolute inset-0" style={{ background: gradients[tagId] }} />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-primary/10" />
      <CategoryIcon id={tagId} className={`${iconSize} text-primary/20`} />
    </div>
  );
}

// ─── TagPill ──────────────────────────────────────────────────

/** Small tag pill — label resolved via t(). */
export function TagPill({ tagId, isLight }: { tagId: TagId; isLight: boolean }) {
  const { t } = useTranslation();
  return (
<span
  onClick={(e) => e.stopPropagation()}
  onMouseDown={(e) => e.stopPropagation()}
  className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border cursor-text select-text ${
    isLight ? "border-zinc-300 text-zinc-500" : "border-white/10 text-zinc-400"
  }`}
>
      {t(`blog.tags.${tagId}`)}
    </span>
  );
}

// ─── FeaturedArticleCard ──────────────────────────────────────

/** Horizontal card for featured article sections.
 *  Featured badge is shown only when article.featured === true. */
export function FeaturedArticleCard({
  article,
  isLight,
  index,
}: {
  article: Article;
  isLight: boolean;
  index: number;
}) {
  const { t } = useTranslation();

  return (
<motion.article
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
  onClick={() => window.location.href = `/blog/${article.slug}`}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = `/blog/${article.slug}`;
    }
  }}
  role="link"
  tabIndex={0}
  className={`group flex flex-col md:flex-row rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
    isLight
      ? "bg-white border-zinc-200 hover:border-primary/40 hover:shadow-[0_0_32px_rgba(200,223,82,0.12)]"
      : "bg-zinc-900/40 border-white/8 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(200,223,82,0.08)]"
  }`}
>
      {/* Visual — real image or gradient placeholder */}
      <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto flex-shrink-0 overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <ArticlePlaceholder tagId={article.primaryTag} size="featured" />
        )}
        {article.featured && (
          <span className="absolute bottom-4 left-4 bg-primary text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            {t("blog.featured.badge")}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 md:p-8 md:w-3/5">
<div
  onClick={(e) => e.stopPropagation()}
  onMouseDown={(e) => e.stopPropagation()}
  className="cursor-text select-text"
>
          <div className="flex items-center gap-2 mb-4">
            <TagPill tagId={article.primaryTag} isLight={isLight} />
            {article.secondaryTag && (
              <TagPill tagId={article.secondaryTag} isLight={isLight} />
            )}
          </div>

          <h2
            className={`text-xl md:text-2xl font-bold tracking-tight leading-snug mb-3 group-hover:text-primary transition-colors duration-200 ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            {t(`blog.articles.${article.id}.title`)}
          </h2>

          <p
            className={`text-sm leading-relaxed ${
              isLight ? "text-zinc-600" : "text-zinc-400"
            }`}
          >
            {t(`blog.articles.${article.id}.excerpt`)}
          </p>
        </div>

        <div
          className={`flex items-center justify-between mt-6 pt-5 border-t ${
            isLight ? "border-zinc-100" : "border-white/5"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${
              isLight ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {t("blog.grid.minRead", { count: article.readTime })}
          </div>

          <Link
  href={`/blog/${article.slug}`}
  onClick={(e) => e.stopPropagation()}
  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:gap-2.5 transition-all duration-200"
>
            {t("blog.featured.readArticle")}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ─── BlogCard (article grid) ──────────────────────────────────

/** Vertical card for the main article grid. */
export function BlogCard({
  article,
  isLight,
  index,
}: {
  article: Article;
  isLight: boolean;
  index: number;
}) {
  const { t } = useTranslation();

  return (
    <motion.article
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.07 }}
  onClick={() => window.location.href = `/blog/${article.slug}`}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = `/blog/${article.slug}`;
    }
  }}
  role="link"
  tabIndex={0}
  className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
    isLight
      ? "bg-white border-zinc-200 hover:border-primary/40 hover:shadow-[0_4px_32px_rgba(200,223,82,0.12)]"
      : "bg-zinc-900/30 border-white/8 hover:border-primary/30 hover:shadow-[0_4px_40px_rgba(200,223,82,0.09)]"
  }`}
>
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {article.image ? (
          <img
            src={article.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <ArticlePlaceholder tagId={article.primaryTag} size="normal" />
        )}
        {article.featured && (
          <span className="absolute top-3 right-3 bg-primary text-black text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
            {t("blog.featured.badge")}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <TagPill tagId={article.primaryTag} isLight={isLight} />
          {article.secondaryTag && (
            <TagPill tagId={article.secondaryTag} isLight={isLight} />
          )}
        </div>

<div
  onClick={(e) => e.stopPropagation()}
  onMouseDown={(e) => e.stopPropagation()}
  className="cursor-text select-text"
>
  <h3
    className={`text-sm font-bold leading-snug mb-2.5 line-clamp-2 group-hover:text-primary transition-colors duration-200 ${
      isLight ? "text-zinc-900" : "text-white"
    }`}
  >
    {t(`blog.articles.${article.id}.title`)}
  </h3>

  <p
    className={`text-xs leading-relaxed line-clamp-3 flex-1 ${
      isLight ? "text-zinc-500" : "text-zinc-400"
    }`}
  >
    {t(`blog.articles.${article.id}.excerpt`)}
  </p>
</div>

        <div
          className={`flex items-center justify-between mt-4 pt-4 border-t ${
            isLight ? "border-zinc-100" : "border-white/5"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
              isLight ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            <Clock className="w-3 h-3" />
            {t("blog.grid.minShort", { count: article.readTime })}
          </div>
          <Link
  href={`/blog/${article.slug}`}
  onClick={(e) => e.stopPropagation()}
  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:gap-1.5 transition-all duration-200"
>
            {t("blog.grid.read")} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
