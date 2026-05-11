import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Briefcase, Send, Users, Globe, Code, Palette, Rocket, Target, Zap, Heart, Clock, Smile, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";

export default function Careers() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const process = t('careers.process.steps', { returnObjects: true }) as { step: string; title: string; desc: string; }[];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO page="careers" />
      <StructuredData page="careers" />
      <Navbar />
      
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="container mx-auto relative z-10 px-4 sm:px-0">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-primary text-xs sm:text-sm uppercase tracking-[0.3em] font-bold mb-6 block">{t('careers.hero.label')}</span>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-8 leading-[1.05] tracking-tighter break-words w-full" data-testid="text-careers-title">
                {t('careers.hero.title1')} <br/><span className="text-gradient-primary">{t('careers.hero.title2')}</span>
              </h1>
              <div className={`text-base sm:text-xl md:text-2xl font-light leading-relaxed mb-10 max-w-2xl ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                <p className="desc-neutral">{t('careers.hero.desc')}</p>
              </div>

              {/* Culture Pills - Moved to Hero */}
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 mb-12">
                {[
  { text: t('careers.hero.pills.impact'), icon: ShieldCheck },
  { text: t('careers.hero.pills.culture'), icon: Target },
  { text: t('careers.hero.pills.performance'), icon: Zap },
  { text: t('careers.hero.pills.flexibility'), icon: Clock },
  { text: t('careers.hero.pills.fun'), icon: Smile },
  { text: t('careers.hero.pills.growth'), icon: TrendingUp },
  { text: t('careers.hero.pills.peers'), icon: Users }
].map((pill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-2.5 md:gap-3 hover:border-primary/50 hover:bg-white/10 transition-all cursor-default group"
                  >
                    <pill.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs md:text-sm font-medium tracking-wide desc-neutral">{pill.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors duration-300"
                  onClick={() => {
                    const el = document.getElementById('openings');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  data-testid="button-scroll-openings"
                >
                  {t('careers.positions.title')}
                </Button>

                <a
                  href="https://www.notion.so/Life-at-Tree-d-Our-Little-Playbook-294092e4b14180b89100ccd6d5ca1268"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-careers-playbook"
                >
                  <Button
                    size="lg"
                    variant="outline"
                   className={`rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 ${
  isLight
    ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
    : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
}`}
                    data-testid="button-careers-playbook"
                  >
                    {t('careers.hero.playbook')}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`py-24 ${isLight ? "bg-zinc-50" : "bg-zinc-950/50"}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start relative">
            <div className="space-y-8 md:sticky md:top-32 h-fit">
              <h2 className="text-4xl font-bold mb-6" data-testid="text-careers-values-title">
  {t('careers.valuesTitle')}
</h2>
<p className={`text-lg leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
  <span className="desc-neutral">{t('careers.valuesDesc')}</span>
</p>

<div className="mt-6">
  <Link
  href="/about"
  className="inline-flex items-center text-primary font-bold hover:text-white transition-all cursor-pointer uppercase tracking-widest text-sm group/view"
>
  {t('careers.valuesCta')}
  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/view:translate-x-1" />
</Link>
</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: t('careers.values.curiosity.title'), desc: t('careers.values.curiosity.desc') },
                { icon: Rocket, title: t('careers.values.intent.title'), desc: t('careers.values.intent.desc') },
                { icon: Heart, title: t('careers.values.respect.title'), desc: t('careers.values.respect.desc') },
                { icon: Target, title: t('careers.values.simple.title'), desc: t('careers.values.simple.desc') }
              ].map((v, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`p-8 rounded-[2rem] border transition-all ${isLight ? "border-zinc-200 bg-white shadow-sm" : "border-white/5 bg-zinc-900/50"}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <v.icon className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed desc-neutral">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32" id="openings">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('careers.process.title')}
            </h2>
            <p className="text-zinc-500 text-lg">{t('careers.process.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, i) => (
              <div
                key={i}
                className={`relative p-10 rounded-[2.5rem] hover:ring-primary/20 hover:border-white/20 transition-all duration-300 ${
                  i === 3 
                    ? isLight
                      ? 'bg-white border-zinc-200 shadow-lg ring-1 ring-primary/30'
                      : 'bg-gradient-to-br from-primary/[0.08] via-zinc-900/60 to-zinc-900/50 border-primary/30 shadow-[0_0_60px_rgba(200,223,82,0.15)] ring-2 ring-primary/20'
                    : isLight
                      ? 'bg-white border-zinc-200 shadow-md ring-1 ring-zinc-100'
                      : 'bg-zinc-900/50 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/5'
                }`}
                data-testid={`card-careers-process-${i}`}
              >
                <div className={`text-5xl font-bold mb-6 ${isLight ? 'text-zinc-400' : 'text-primary/40'}`} data-testid={`text-careers-process-step-${i}`}>{step.step}</div>
                <h4 className="text-xl font-bold mb-4" data-testid={`text-careers-process-title-${i}`}>{step.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed desc-neutral" data-testid={`text-careers-process-desc-${i}`}>{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-zinc-400 mb-8">{t('careers.process.note')}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a data-testid="button-apply-now" href="mailto:talent@treed.co">
                <Button size="lg" className="bg-primary text-black hover:bg-primary/80 rounded-full px-12 h-14 font-bold uppercase tracking-widest transition-colors">
                  {t('careers.positions.apply')} <Send className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}