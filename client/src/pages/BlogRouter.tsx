// ─────────────────────────────────────────────────────────────
//  Tree'd — Blog Router
//  Route: /blog/:slug
//
//  Dispatches to the correct page based on what the slug is:
//    • Known category slug (e.g. "pricing")   → BlogCategoryPage
//    • Known article slug  (e.g. "what-is-…") → BlogArticlePage
//    • Anything else                           → NotFound
//
//  Both child pages use useParams() internally — they work
//  correctly because they are rendered at the same route level.
// ─────────────────────────────────────────────────────────────

import { useParams } from "wouter";
import { CATEGORY_SLUGS, getArticleBySlug } from "@/data/blogData";
import BlogCategoryPage from "./BlogCategory";
import BlogArticlePage from "./BlogArticle";
import NotFound from "./not-found";

export default function BlogRouter() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  // Category match — fast Set lookup
  if (CATEGORY_SLUGS.has(slug)) {
    return <BlogCategoryPage />;
  }

  // Article match
  const article = getArticleBySlug(slug);
  if (article) {
    return <BlogArticlePage />;
  }

  // Neither — show 404
  return <NotFound />;
}
