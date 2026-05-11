import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Phone, Copy, Check, ArrowUpRight, Instagram, Linkedin, Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { SEO, StructuredData } from "@/components/SEO";
import GlobeSection from "@/components/contact/GlobeSection";

export default function Contact() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  function copy(text: string, field: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("firstName"),
          lastName: fd.get("lastName"),
          museum: fd.get("museum"),
          email: fd.get("email"),
          message: fd.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(t("contact.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO page="contact" />
      <StructuredData page="contact" />
      <Navbar />
      
      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(200,223,82,0.1),transparent_60%)]"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-primary text-xs uppercase tracking-[0.4em] font-bold mb-6 block">{t('contact.hero.label')}</span>
              <h1 className="text-7xl md:text-8xl font-bold mb-10 leading-[0.8] tracking-tighter" data-testid="text-contact-title">
                {t('contact.hero.title1')} <br/>
                <span className="text-gradient-primary">{t('contact.hero.title2')}</span>
              </h1>
              <div className="text-base md:text-lg text-zinc-400 font-light max-w-lg mb-12">
                <p>{t('contact.hero.desc')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">

                {/* ── Write to us ─────────────────────────────────────────── */}
                <div className="flex gap-4 p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 group hover:border-primary/30 transition-all duration-500 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${isLight ? "bg-primary/15 text-[#4d6012] border-primary/25" : "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-black"}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-0.5">{t('contact.info.write')}</h3>
                    <div className="flex items-center gap-3">
                      <a href="mailto:hello@treed.co" className="text-zinc-500 text-sm hover:text-primary transition-colors truncate">
                        hello@treed.co
                      </a>
                      <button
                        onClick={() => copy('hello@treed.co', 'email')}
                        className="text-zinc-600 hover:text-primary transition-colors shrink-0"
                        aria-label={t('contact.info.copy')}
                      >
                        {copiedField === 'email'
                          ? <Check className="w-3.5 h-3.5" />
                          : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <a
                    href="mailto:hello@treed.co"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shrink-0"
                    aria-label={t('contact.info.write')}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* ── Call us ─────────────────────────────────────────────── */}
                <div className="flex gap-4 p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 group hover:border-primary/30 transition-all duration-500 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${isLight ? "bg-primary/15 text-[#4d6012] border-primary/25" : "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-black"}`}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-0.5">{t('contact.info.call')}</h3>
                    <div className="flex items-center gap-3">
                      <a href="tel:+31202101985" className="text-zinc-500 text-sm hover:text-primary transition-colors">
                        +31 20 210 1985
                      </a>
                      <button
                        onClick={() => copy('+31 20 210 1985', 'phone')}
                        className="text-zinc-600 hover:text-primary transition-colors shrink-0"
                        aria-label={t('contact.info.copy')}
                      >
                        {copiedField === 'phone'
                          ? <Check className="w-3.5 h-3.5" />
                          : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <a
                    href="tel:+31202101985"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shrink-0"
                    aria-label={t('contact.info.call')}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* ── WhatsApp ─────────────────────────────────────────────── */}
                <div className="flex gap-4 p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 group hover:border-primary/30 transition-all duration-500 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${isLight ? "bg-primary/15 text-[#4d6012] border-primary/25" : "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-black"}`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-0.5">{t('contact.info.whatsapp')}</h3>
                    <div className="flex items-center gap-3">
                      <a href="https://wa.me/+33781515277" target="_blank" rel="noopener noreferrer" className="text-zinc-500 text-sm hover:text-primary transition-colors">
                        +33 7 81 51 52 77
                      </a>
                      <button
                        onClick={() => copy('+33 7 81 51 52 77', 'whatsapp')}
                        className="text-zinc-600 hover:text-primary transition-colors shrink-0"
                        aria-label={t('contact.info.copy')}
                      >
                        {copiedField === 'whatsapp'
                          ? <Check className="w-3.5 h-3.5" />
                          : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/+33781515277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shrink-0"
                    aria-label={t('contact.info.whatsapp')}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-8 md:p-12 lg:p-14 rounded-[3rem] glass border-primary/20 shadow-[0_0_80px_-20px_rgba(200,223,82,0.1)] relative max-w-[540px] mx-auto lg:mr-0 lg:ml-auto"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-10"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">{t('contact.form.success')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{t('contact.form.firstName')}</label>
                      <input name="firstName" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-primary outline-none transition-all focus:bg-white/10 text-sm" placeholder={t('contact.form.placeholders.firstName')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{t('contact.form.lastName')}</label>
                      <input name="lastName" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-primary outline-none transition-all focus:bg-white/10 text-sm" placeholder={t('contact.form.placeholders.lastName')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{t('contact.form.museum')}</label>
                    <input name="museum" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-primary outline-none transition-all focus:bg-white/10 text-sm" placeholder={t('contact.form.placeholders.museum')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{t('contact.form.email')}</label>
                    <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-primary outline-none transition-all focus:bg-white/10 text-sm" placeholder={t('contact.form.placeholders.email')} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{t('contact.form.message')}</label>
                    <textarea name="message" required className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-primary outline-none transition-all focus:bg-white/10 h-32 resize-none text-sm" placeholder={t('contact.form.placeholders.message')} />
                  </div>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-black h-14 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_15px_30px_-10px_rgba(200,223,82,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {submitting ? "..." : t('contact.form.submit')}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <GlobeSection />

      {/* Social Media */}
      <section className="py-32 relative bg-zinc-950/30">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-primary text-xs uppercase tracking-[0.4em] font-bold mb-6 block">{t('contact.newsletter.title')}</span>
            <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter">{t('contact.newsletter.desc')}</h2>
            <div className="flex justify-center gap-6">
              {[
                { icon: <Instagram className="w-6 h-6" />, link: "https://www.instagram.com/treed.guide/", label: "Instagram" },
                { icon: <Linkedin className="w-6 h-6" />, link: "https://www.linkedin.com/company/treedhistoryguide", label: "LinkedIn" },
                { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, link: "https://x.com/treedguide", label: "X (Twitter)" },
                { icon: <Facebook className="w-6 h-6" />, link: "https://www.facebook.com/treedguide", label: "Facebook" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-300
                    ${isLight
                      ? "bg-zinc-100 border-zinc-200 text-zinc-500 hover:text-[#4d6012] hover:border-[#4d6012] hover:bg-white"
                      : "bg-zinc-900 border-white/5 text-zinc-500 hover:text-primary hover:border-primary/50 hover:bg-zinc-800"
                    }`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
