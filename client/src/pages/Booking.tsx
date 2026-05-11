import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SEO, StructuredData } from "@/components/SEO";
import { Link } from "wouter";
import { Phone, Building2, Tag } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const highlightIcons = [Phone, Building2, Tag];

export default function Booking() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    // Defer Calendly script to reduce initial main-thread work
    let script: HTMLScriptElement | null = null;

    const idleId: number = window.setTimeout(() => {
      const existing = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existing) return;

      script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }, 250);

    return () => {
      window.clearTimeout(idleId);
      // Keep the script in place once loaded to avoid re-downloads on SPA navigation
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-sans">
      <SEO page="booking" />
      <StructuredData page="booking" />
      <Navbar />
      
      <section className="pt-40 pb-16 md:pb-20 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="container mx-auto relative z-10 px-5 md:px-8">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left column */}
<div className="lg:col-span-4 self-start">
  <motion.div
    key={t('booking.title')}
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    className="text-left"
  >
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
      <span className={`${isLight ? 'text-[#4d6012]' : 'text-primary'} text-[10px] uppercase tracking-[0.3em] font-bold`}>
        {t('booking.subtitle')}
      </span>
    </div>

    <h1
      className="text-5xl md:text-6xl font-bold tracking-tightest mb-6 leading-[0.95]"
      data-testid="text-booking-title"
    >
      {t('booking.title')}
    </h1>

    <p className="text-lg md:text-xl text-zinc-300 leading-relaxed max-w-lg mb-8">
      {t('booking.description')}
    </p>

    <ul className="space-y-4 mb-8">

      {(t('booking.highlights', { returnObjects: true }) as string[]).map((item, i) => {
        const Icon = highlightIcons[i];
        return (
          <li key={i} className="flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm">
            <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${isLight ? 'bg-[#4d6012]/10' : 'bg-primary/10'}`}>
              {Icon && <Icon className={`w-4 h-4 ${isLight ? 'text-[#4d6012]' : 'text-primary'}`} />}
            </div>
            <span className="text-sm font-medium text-zinc-200 leading-snug tracking-wide">{item}</span>
          </li>
        );
      })}
    </ul>

    
  </motion.div>
</div>

            {/* Right column: Calendly */}
<div className="lg:col-span-8 w-full self-start">
  <motion.div
    initial={{ opacity: 0, scale: 0.98, x: 30 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ delay: 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
    className="relative w-full"
  >
    <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white shadow-2xl">
      <div
        className="calendly-inline-widget w-full"
        data-url="https://calendly.com/mo-treed/30min?hide_event_type_details=1"
        style={{ minWidth: '320px', height: '720px' }}
      ></div>
    </div>
  </motion.div>
</div>
          </div>
                </div>
      </section>

      <section className="pb-24">
  <div className="container mx-auto px-5 md:px-8">
    <div className="border-t border-white/10 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5 min-w-0">
  <h2 className="max-w-[12ch] text-4xl md:text-5xl font-bold text-white leading-tight">
    {t('booking.expectTitleStart')}{" "}
    <span className="text-primary">{t('booking.expectTitleHighlight')}</span>
    {t('booking.expectTitleEnd')}
  </h2>
</div>

        <div className="lg:col-span-7 min-w-0">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {(t('booking.expectItems', { returnObjects: true }) as Array<{
              text: string;
              inPersonOnly?: boolean;
              linkedWord?: string;
              linkedHref?: string;
            }>).map((item, i) => {
              const renderText = () => {
                if (!item.linkedWord || !item.linkedHref) {
                  return <span className="text-zinc-300 leading-relaxed">{item.text}</span>;
                }
                const idx = item.text.toLowerCase().indexOf(item.linkedWord.toLowerCase());
                if (idx === -1) {
                  return <span className="text-zinc-300 leading-relaxed">{item.text}</span>;
                }
                const before = item.text.slice(0, idx);
                const word = item.text.slice(idx, idx + item.linkedWord.length);
                const after = item.text.slice(idx + item.linkedWord.length);
                return (
                  <span className="text-zinc-300 leading-relaxed">
                    {before}
                    <Link href={item.linkedHref} className="text-white underline underline-offset-2 decoration-white/30 hover:decoration-white/80 transition-colors">
                      {word}
                    </Link>
                    {after}
                  </span>
                );
              };
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
                >
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="flex-1">
                    {renderText()}
                    {item.inPersonOnly && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400 whitespace-nowrap">
                        {t('bookingPage.inPersonOnlyLabel')}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
}
