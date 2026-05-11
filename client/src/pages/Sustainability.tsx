import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Leaf, Recycle, Zap, Database, Server, BrainCircuit, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";

export default function Sustainability() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <SEO page="sustainability" />
      <StructuredData page="sustainability" />
      <Navbar />
      {/* New Hero Section - Organic Tech Hybrid */}
      <section className="pt-40 pb-24 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-8 block">{t('sustainability.hero.label')}</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05] px-4 md:px-0" data-testid="text-sustainability-title">
              {t('sustainability.hero.title1')}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">{t('sustainability.hero.title2')}</span>
            </h1>
              <div className="text-lg md:text-xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
                <p>{t('sustainability.hero.desc')}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Organic Background Element */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/10 rounded-full blur-[150px] -z-10 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </section>
      {/* Main Stats Grid - Updated Design */}
      <section className="py-12 bg-zinc-950/30 relative border-y border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`p-6 md:p-8 rounded-2xl md:rounded-3xl border relative overflow-hidden group transition-colors
      ${isLight ? 'bg-white border-zinc-200 hover:bg-zinc-50' : 'bg-zinc-900/20 border-white/5 hover:bg-zinc-900/40'}`}
  >
    <div className="flex flex-col h-full">
      <div className="mb-3 md:mb-4 text-primary opacity-80">
        <Recycle className="w-6 h-6 md:w-8 md:h-8" />
      </div>
            <span className={`text-4xl md:text-5xl font-bold mb-2 tracking-tight ${isLight ? 'text-zinc-800' : 'text-white'}`}>
        {t('sustainability.stats.plastic.val')}
      </span>
      <h3 className={`text-xs md:text-sm uppercase tracking-wider font-bold mb-3 md:mb-4 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
        {t('sustainability.stats.plastic.title')}
      </h3>
      <p className="text-sm md:text-base leading-relaxed desc-neutral">
        {t('sustainability.stats.plastic.desc')}
      </p>

            <Link
  href="/handset"
  className="mt-auto pt-6 inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta"
>
  {t('sustainability.stats.plastic.cta')}
  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
</Link>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.1 }}
    className={`p-6 md:p-8 rounded-2xl md:rounded-3xl border relative overflow-hidden group transition-colors
      ${isLight ? 'bg-white border-zinc-200 hover:bg-zinc-50' : 'bg-zinc-900/20 border-white/5 hover:bg-zinc-900/40'}`}
  >
    <div className="flex flex-col h-full">
      <div className="mb-3 md:mb-4 text-primary opacity-80">
        <Server className="w-6 h-6 md:w-8 md:h-8" />
      </div>
      <span className={`text-4xl md:text-5xl font-bold mb-2 tracking-tight ${isLight ? 'text-zinc-800' : 'text-white'}`}>
        {t('sustainability.stats.local.val')}
      </span>
      <h3 className={`text-xs md:text-sm uppercase tracking-wider font-bold mb-3 md:mb-4 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
        {t('sustainability.stats.local.title')}
      </h3>
            <p className="text-xs md:text-sm leading-relaxed desc-neutral">
        {t('sustainability.stats.local.desc')}
      </p>

      <Link
        href="/tree"
        className="mt-auto pt-6 inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta"
      >
        {t('sustainability.stats.local.cta')}
        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
      </Link>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: 0.2 }}
    className={`p-6 md:p-8 rounded-2xl md:rounded-3xl border relative overflow-hidden group transition-colors
      ${isLight ? 'bg-white border-zinc-200 hover:bg-zinc-50' : 'bg-zinc-900/20 border-white/5 hover:bg-zinc-900/40'}`}
  >
    <div className="flex flex-col h-full">
      <div className="mb-3 md:mb-4 text-primary opacity-80">
        <BrainCircuit className="w-6 h-6 md:w-8 md:h-8" />
      </div>
      <span className={`text-4xl md:text-5xl font-bold mb-2 tracking-tight ${isLight ? 'text-zinc-800' : 'text-white'}`}>
        {t('sustainability.stats.ai.val')}
      </span>
      <h3 className={`text-xs md:text-sm uppercase tracking-wider font-bold mb-3 md:mb-4 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
        {t('sustainability.stats.ai.title')}
      </h3>
      <p className="text-xs md:text-sm leading-relaxed desc-neutral">
        {t('sustainability.stats.ai.desc')}
      </p>

            <Link
  href="/solution"
  className="mt-auto pt-6 inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta"
>
  {t('sustainability.stats.ai.cta')}
  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
</Link>
    </div>
  </motion.div>
</div>

             
        </div>
      </section>
      {/* Deep Dive Content */}
      <section className="py-32 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-sm uppercase tracking-widest font-medium mb-4 block">{t('sustainability.deepDive.label')}</span>
              <h2 className="text-4xl font-bold mb-8">{t('sustainability.deepDive.title')}</h2>
              <p className="leading-relaxed desc-neutral mb-8">{t('sustainability.deepDive.desc')}</p>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{t('sustainability.deepDive.localProcessing.title')}</h4>
                    <p className="leading-relaxed desc-neutral">{t('sustainability.deepDive.localProcessing.desc')}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-xl font-bold mb-2">{t('sustainability.deepDive.longevity.title')}</h4>
                      <p className="leading-relaxed desc-neutral">{t('sustainability.deepDive.longevity.desc')}</p>
                    </div>
                    <Link href="/use-cases">
                      <span className="inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta">
                        {t('buttons.discoverUseCases')}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative group">
              <div className="aspect-square rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 overflow-hidden relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,223,82,0.1),transparent_70%)]"></div>
                 <div className="absolute inset-0 flex items-center justify-center scale-75 md:scale-100">
                    <div className="w-64 h-64 border-2 border-primary/20 rounded-full animate-spin-slow flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-primary/40 rounded-full animate-reverse-spin flex items-center justify-center">
                        <div className="w-32 h-32 bg-primary/10 rounded-full backdrop-blur-md flex items-center justify-center">
                           <Leaf className="w-16 h-16 text-primary" />
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Responsible Technology Section */}
      <section className="pt-24 pb-8 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className={`text-4xl font-bold mb-8 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
  {t('sustainability.responsible.title')}
</h2>
<p className={`text-lg leading-relaxed desc-neutral`}>
  {t('sustainability.responsible.desc')}
</p>
          </motion.div>
        </div>
      </section>

      {/* Visitor Experience Link */}
      <section className="pb-8 relative">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
                        <Link
              href="/visitor-experience"
              className="inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta"
            >
              {t('sustainability.visitorExpLink')}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
<section className="py-24 relative">
  <div className="container mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`max-w-3xl mx-auto text-center rounded-3xl p-8 md:p-16 border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/30 border-white/5'}`}
    >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
        {t('sustainability.cta.title')}
      </h2>
      <p className="text-base md:text-lg mb-8 desc-neutral">
        {t('sustainability.cta.desc')}
      </p>
      <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-center gap-3">
                <Link
          href="/booking"
          className="inline-flex items-center justify-center gap-2 bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-sm md:text-base font-bold tracking-normal transition-colors duration-300 whitespace-nowrap"
        >
          {t('sustainability.cta.btn')}
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
        <Link
          href="/request-pricing"
          className={`inline-flex items-center justify-center gap-2 rounded-full h-12 px-8 text-sm md:text-base font-bold tracking-normal transition-colors border duration-300 whitespace-nowrap ${
            isLight
              ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
              : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
          }`}
        >
          {t('sustainability.cta.btnSecondary')}
        </Link>
      </div>
    </motion.div>
  </div>
</section>

      <div className="section-divider"></div>
      <Footer />
    </div>
  );
}
