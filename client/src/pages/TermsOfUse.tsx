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
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-primary hover:underline font-medium"
    >
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
      isLight ? "bg-primary/5 border-primary/20" : "bg-primary/5 border-primary/20"
    )}>
      <span className={cn("shrink-0 font-semibold", isLight ? "text-zinc-700" : "text-zinc-300")}>
        {t("footer.legal")}:
      </span>
      <div className="flex flex-wrap gap-4">
        <PolicyLink href="/privacy-policy" label={t("footer.privacyPolicy")} />
        <PolicyLink href="/cookie-policy" label={t("footer.cookiePolicy")} />
      </div>
    </div>
  );
}

export default function TermsOfUse() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="termsOfUse" />
      <Navbar />

      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(200,223,82,0.06),transparent_60%)]" />
        <div className="container mx-auto relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary text-xs uppercase tracking-[0.4em] font-bold mb-4 block">
              {t("footer.legal")}
            </span>
            <h1 className={cn("text-4xl md:text-5xl font-bold mb-3 tracking-tighter", isLight ? "text-zinc-900" : "text-white")}>
              {t("termsOfUse.pageTitle")}
            </h1>
            <p className={cn("text-sm mb-8", isLight ? "text-zinc-500" : "text-zinc-500")}>
              {t("termsOfUse.lastUpdated")}
            </p>
            <p className={cn("text-base leading-relaxed mb-8", isLight ? "text-zinc-600" : "text-zinc-400")}>
              {t("termsOfUse.introPre")} (<PolicyLink href="/privacy-policy" label="treed.co/privacy-policy" />) {t("termsOfUse.introBetween")} (<PolicyLink href="/cookie-policy" label="treed.co/cookie-policy" />){t("termsOfUse.introPost")}
            </p>
            <CrossDocBanner />
          </motion.div>

          <div className="space-y-4 mt-8">
            <Section title={t("termsOfUse.s1Title")}>
              <p>{t("termsOfUse.s1Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s2Title")}>
              <p>{t("termsOfUse.s2Intro")}</p>
              <BulletList items={t("termsOfUse.s2Items", { returnObjects: true }) as string[]} />
            </Section>

            <Section title={t("termsOfUse.s3Title")}>
              <p>{t("termsOfUse.s3Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s4Title")}>
              <p>{t("termsOfUse.s4Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s5Title")}>
              <p className="uppercase font-bold text-xs tracking-wide leading-relaxed">
                {t("termsOfUse.s5Body")}
              </p>
            </Section>

            <Section title={t("termsOfUse.s6Title")}>
              <p>{t("termsOfUse.s6Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s7Title")}>
              <p>{t("termsOfUse.s7Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s8Title")}>
              <p>{t("termsOfUse.s8Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s9Title")}>
              <p>{t("termsOfUse.s9Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s9bTitle")}>
              <p>{t("termsOfUse.s9bBody")}</p>
            </Section>

            <Section title={t("termsOfUse.s11Title")}>
              <p>{t("termsOfUse.s11Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s12Title")}>
              <p>{t("termsOfUse.s12Body")}</p>
            </Section>

            <Section title={t("termsOfUse.s12bTitle")}>
              <p>{t("termsOfUse.s12bBody")}</p>
            </Section>

            <Section title={t("termsOfUse.s14Title")}>
              <p>{t("termsOfUse.s14Body")}</p>
            </Section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
