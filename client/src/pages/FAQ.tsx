import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import React from "react";

function renderAnswer(text: string): React.ReactNode {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link key={match.index} href={match[2]} className="text-primary hover:underline transition-colors font-medium">
        {match[1]}
      </Link>
    );
    lastIndex = linkPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

export default function FAQ() {
  const { t } = useTranslation();

  const faqCategories = t('faq.categories', { returnObjects: true }) as { category: string; items: { q: string; a: string; }[]; }[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO page="faq" />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8" data-testid="text-faq-title">{t('faq.hero.title1')} <span className="text-primary">{t('faq.hero.title2')}</span></h1>
            <div className="text-xl text-zinc-400 font-light">
              <p>{t('faq.hero.desc')}</p>
            </div>
          </motion.div>

          <div className="space-y-16">
            {faqCategories.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold mb-6 text-primary">{section.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {section.items.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${idx}-${i}`} className="border-white/10 px-6 rounded-2xl bg-zinc-900/30">
                      <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors py-6">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-zinc-400 text-base leading-relaxed pb-6">{renderAnswer(faq.a)}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}