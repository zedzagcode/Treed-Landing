import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className={cn(
      "rounded-2xl border p-6 md:p-8 space-y-4",
      isLight ? "bg-white border-zinc-100" : "bg-zinc-900/40 border-white/5"
    )}>
      <h2 className={cn("text-base font-bold uppercase tracking-widest", isLight ? "text-zinc-800" : "text-white")}>
        {title}
      </h2>
      <div className={cn("text-sm leading-relaxed space-y-3", isLight ? "text-zinc-600" : "text-zinc-400")}>
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-primary mt-0.5 shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PolicyLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-0.5 text-primary hover:underline font-medium">
      {label}
      <ArrowUpRight className="w-3 h-3" />
    </Link>
  );
}

function CrossDocBanner() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { t } = useTranslation();
  return (
    <div className={cn(
      "rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm",
      "bg-primary/5 border-primary/20"
    )}>
      <span className={cn("shrink-0 font-semibold", isLight ? "text-zinc-700" : "text-zinc-300")}>
        {t("footer.legal")}:
      </span>
      <div className="flex flex-wrap gap-4">
        <PolicyLink href="/privacy-policy" label={t("footer.privacyPolicy")} />
        <PolicyLink href="/terms-of-use" label={t("footer.termsOfUse")} />
      </div>
    </div>
  );
}

interface CookieRow {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  type: string;
}

interface CookieHeaders {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  type: string;
}

function CookieTable({ rows, headers }: { rows: CookieRow[]; headers: CookieHeaders }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const typeBadge = (type: string) => {
    const isAnalytics = type === "Analytics";
    return (
      <span className={cn(
        "inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
        isAnalytics
          ? "bg-primary/10 border border-primary/20 text-primary"
          : isLight
            ? "bg-zinc-100 border border-zinc-200 text-zinc-500"
            : "bg-white/5 border border-white/10 text-zinc-400"
      )}>
        {type}
      </span>
    );
  };
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-xs border-collapse min-w-[520px]">
        <thead>
          <tr className={cn(
            "border-b text-left",
            isLight ? "border-zinc-200" : "border-white/10"
          )}>
            {[headers.name, headers.provider, headers.purpose, headers.duration, headers.type].map((h) => (
              <th key={h} className={cn(
                "py-2 px-3 font-bold uppercase tracking-widest text-[10px]",
                isLight ? "text-zinc-500" : "text-zinc-500"
              )}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn(
              "border-b last:border-0",
              isLight ? "border-zinc-100" : "border-white/5"
            )}>
              <td className="py-3 px-3">
                <span className={cn(
                  "font-mono font-bold px-1.5 py-0.5 rounded text-[11px]",
                  isLight ? "bg-zinc-100 text-zinc-800" : "bg-white/5 text-zinc-200"
                )}>{row.name}</span>
              </td>
              <td className={cn("py-3 px-3", isLight ? "text-zinc-600" : "text-zinc-400")}>{row.provider}</td>
              <td className={cn("py-3 px-3 max-w-[220px]", isLight ? "text-zinc-600" : "text-zinc-400")}>{row.purpose}</td>
              <td className={cn("py-3 px-3 whitespace-nowrap", isLight ? "text-zinc-600" : "text-zinc-400")}>{row.duration}</td>
              <td className="py-3 px-3">{typeBadge(row.type)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicy() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const cookieRows = t("cookiePolicy.cookieTable", { returnObjects: true }) as CookieRow[];
  const cookieHeaders = t("cookiePolicy.cookieTableHeaders", { returnObjects: true }) as CookieHeaders;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="cookiePolicy" />
      <Navbar />

      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(200,223,82,0.06),transparent_60%)]" />
        <div className="container mx-auto relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary text-xs uppercase tracking-[0.4em] font-bold mb-4 block">
              {t("footer.legal")}
            </span>
            <h1 className={cn("text-4xl md:text-5xl font-bold mb-3 tracking-tighter", isLight ? "text-zinc-900" : "text-white")}>
              {t("cookiePolicy.pageTitle")}
            </h1>
            <p className={cn("text-sm mb-8", isLight ? "text-zinc-500" : "text-zinc-500")}>
              {t("cookiePolicy.lastUpdated")}
            </p>
            <p className={cn("text-base leading-relaxed mb-8", isLight ? "text-zinc-600" : "text-zinc-400")}>
              {t("cookiePolicy.intro")}
            </p>
            <CrossDocBanner />
          </motion.div>

          <div className="space-y-4 mt-8">

            {/* 1. What Are Cookies */}
            <Section title={t("cookiePolicy.s1Title")}>
              <p>{t("cookiePolicy.s1Body")}</p>
            </Section>

            {/* 2. Cookies We Use */}
            <Section title={t("cookiePolicy.s2Title")}>
              <p>{t("cookiePolicy.s2Intro")}</p>

              <div className="pt-2 space-y-5">
                {/* Strictly necessary */}
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">{t("cookiePolicy.s2Cat1Title")}</p>
                  <p>{t("cookiePolicy.s2Cat1Body")}</p>
                </div>

                {/* Analytics — with table */}
                <div className="space-y-3">
                  <p className="font-semibold text-foreground">{t("cookiePolicy.s2Cat2Title")}</p>
                  <p>{t("cookiePolicy.s2Cat2Body")}</p>
                  <CookieTable rows={cookieRows.slice(0, 2)} headers={cookieHeaders} />
                  <p className="text-xs italic">{t("cookiePolicy.s2Cat2Note")}</p>
                </div>

                {/* Third-party / Google Maps — with table */}
                <div className="space-y-3">
                  <p className="font-semibold text-foreground">{t("cookiePolicy.s2Cat3Title")}</p>
                  <p>{t("cookiePolicy.s2Cat3Body")}</p>
                  <CookieTable rows={cookieRows.slice(2)} headers={cookieHeaders} />
                </div>
              </div>
            </Section>

            {/* 3. Consent and Cookie Preferences */}
            <Section title={t("cookiePolicy.s2bTitle")}>
              <p>{t("cookiePolicy.s2bBody")}</p>
              <p className={cn(
                "border-l-2 border-primary pl-4 py-1",
                isLight ? "text-zinc-600" : "text-zinc-400"
              )}>
                {t("cookiePolicy.s2bRejectNote")}
              </p>
            </Section>

            {/* 4. How to Manage Cookies */}
            <Section title={t("cookiePolicy.s3Title")}>
              <p>{t("cookiePolicy.s3Intro")}</p>
              <p className="font-semibold text-foreground">{t("cookiePolicy.s3Sub1")}</p>
              <p>{t("cookiePolicy.s3Sub1Body")}</p>
              <BulletList items={t("cookiePolicy.s3BrowserItems", { returnObjects: true }) as string[]} />
              <p className="pt-1 italic">{t("cookiePolicy.s3Warning")}</p>
            </Section>

            {/* 5. Changes */}
            <Section title={t("cookiePolicy.s4Title")}>
              <p>{t("cookiePolicy.s4Body")}</p>
            </Section>

            {/* 6. Contact */}
            <Section title={t("cookiePolicy.s5Title")}>
              <p>{t("cookiePolicy.s5Body")}</p>
            </Section>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
