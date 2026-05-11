import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, BadgeEuro, Unplug, Languages, MousePointerClick, Clock, Headphones, LibraryBig, Sparkles, Check, X, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useRef } from "react";
import { SEO, StructuredData } from "@/components/SEO";
import VisitorJourney from "@/components/VisitorJourney";
import { useTheme } from "@/contexts/ThemeContext";

import visitorHero from "@assets/Interactive_Audio_Guide_Zoomed_In_1768504480869.png";
import nfcPanel from "@assets/NFC_Language_Panel_1768514462979.png";
import nfcScan from "@assets/NFC_Scan_1768514547672.png";
import statueTalking from "@assets/Statue_AI_Talking_1768514552464.png";

export default function VisitorExperience() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

const curiosityRef = useRef<HTMLSpanElement>(null);
const curiosityX = useMotionValue(0);
const curiosityY = useMotionValue(0);
const curiosityOpacity = useSpring(0, { stiffness: 300, damping: 30 });

const handleCuriosityMouseMove = (e: React.MouseEvent) => {
  if (!curiosityRef.current) return;
  const rect = curiosityRef.current.getBoundingClientRect();
  curiosityX.set(e.clientX - rect.left);
  curiosityY.set(e.clientY - rect.top);
  curiosityOpacity.set(1);
};

const handleCuriosityMouseLeave = () => {
  curiosityOpacity.set(0);
};

const gapRef = useRef<HTMLSpanElement>(null);
const gapX = useMotionValue(0);
const gapY = useMotionValue(0);
const gapOpacity = useSpring(0, { stiffness: 300, damping: 30 });

const handleGapMouseMove = (e: React.MouseEvent) => {
  if (!gapRef.current) return;
  const rect = gapRef.current.getBoundingClientRect();
  gapX.set(e.clientX - rect.left);
  gapY.set(e.clientY - rect.top);
  gapOpacity.set(1);
};

const handleGapMouseLeave = () => {
  gapOpacity.set(0);
};

  const benefits = [
    { name: t('visitorExperience.benefits.items.affordable'), icon: <BadgeEuro className="w-6 h-6" /> },
    { name: t('visitorExperience.benefits.items.noSetup'), icon: <Unplug className="w-6 h-6" /> },
    { name: t('visitorExperience.benefits.items.multilingual'), icon: <Languages className="w-6 h-6" /> },
    { name: t('visitorExperience.benefits.items.intuitive'), icon: <MousePointerClick className="w-6 h-6" /> },
    { name: t('visitorExperience.benefits.items.selfPaced'), icon: <Clock className="w-6 h-6" /> },
    { name: t('visitorExperience.benefits.items.immersive'), icon: <Headphones className="w-6 h-6" /> },
    { name: t('visitorExperience.benefits.items.deeperLearning'), icon: <LibraryBig className="w-6 h-6" /> },
    { name: t('visitorExperience.benefits.items.instantAnswers'), icon: <Sparkles className="w-6 h-6" />, special: true }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO page="visitorExperience" />
      <StructuredData page="visitorExperience" />
      <Navbar />
      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-32 -mt-16">
        {/* Creative Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(200,223,82,0.05),transparent_50%)]"></div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div>

        <div className="container mx-auto relative z-10 text-center px-4 sm:px-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-10 max-w-4xl mx-auto"
            data-testid="text-visitor-experience-title"
          >
            {t('visitorExperience.hero.title1')} <span className="text-gradient-primary">{t('visitorExperience.hero.title2')}</span> {t('visitorExperience.hero.title3')}
          </motion.h1>
          <div className="text-base md:text-xl text-zinc-500 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            <p>{t('visitorExperience.hero.desc')}</p>
          </div>
                    <Button 
            size="lg" 
            className="bg-primary !text-black hover:bg-primary/90 rounded-full h-14 px-10 text-lg font-bold tracking-normal transition-colors duration-300"
            onClick={() => document.getElementById('visitor-journey')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('visitorExperience.hero.exploreBtn')} <ChevronDown className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
      <VisitorJourney />
      {/* Why Visitors Love It */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">
  <span className={isLight ? 'text-zinc-900' : 'text-white'}>
    {t('visitorExperience.benefits.title').split(' ').slice(0, -1).join(' ')}{' '}
  </span>
  <span
  ref={curiosityRef}
  onMouseMove={handleCuriosityMouseMove}
  onMouseLeave={handleCuriosityMouseLeave}
  className="text-zinc-500 relative cursor-default inline-block"
>
  {t('visitorExperience.benefits.title').split(' ').slice(-1)}

  <motion.span
    className="absolute inset-0 text-white pointer-events-none overflow-hidden select-none"
    style={{
      clipPath: useTransform(
        [curiosityX, curiosityY, curiosityOpacity],
        ([x, y, opacity]: any) => `circle(${opacity * 80}px at ${x}px ${y}px)`
      )
    }}
  >
    {t('visitorExperience.benefits.title').split(' ').slice(-1)}
  </motion.span>
</span>
</h2>
            <p className="text-zinc-400 text-xl font-light leading-relaxed">{t('visitorExperience.benefits.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.name}
                className={`p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border transition-all group relative overflow-hidden
                  ${benefit.special
                    ? 'border-transparent bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]'
                    : isLight
                      ? 'bg-white border-zinc-200 hover:border-primary/40 hover:bg-zinc-50'
                      : 'bg-zinc-900/40 border-white/5 hover:border-primary/40 hover:bg-zinc-900/60'
                  }`}
              >
                {benefit.special && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                )}
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-all duration-300 relative z-10
                  ${benefit.special
                    ? 'bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 text-white group-hover:scale-110'
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black'
                  }`}
                >
                  {benefit.icon}
                </div>
                <span className={`font-bold text-sm md:text-xl relative z-10 transition-colors leading-tight
                  ${benefit.special
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-white'
                    : isLight ? 'text-zinc-800 group-hover:text-primary' : 'text-white group-hover:text-primary'}
                `}>
                  {benefit.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="comparison" className="py-32 relative overflow-hidden bg-zinc-950/20 border-y border-white/5">
        {/* Static Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(200,223,82,0.03),transparent_70%)] pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-24">
  <span className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-6 block">
    {t('visitorExperience.comparison.label')}
  </span>
  <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
    {t('visitorExperience.comparison.heading')}
  </h2>
  <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
    {t('visitorExperience.comparison.intro')}
  </p>
</div>

          <div className="overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0">
            <div className="min-w-[900px] md:min-w-[1100px] grid grid-cols-6 gap-4 md:gap-6 mb-10 text-center text-[10px] md:text-[14px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-10">
              <div className="text-left pl-4 md:pl-10 col-span-2">{t('solution.comparison.headers.feature')}</div>
              <div className="text-primary bg-primary/5 py-4 rounded-t-2xl md:rounded-t-3xl border-t border-x border-primary/20">{t('solution.comparison.headers.treed')}</div>
              <div className="py-4">{t('solution.comparison.headers.audio')}</div>
              <div className="py-4">{t('solution.comparison.headers.guide')}</div>
              <div className="py-4">{t('solution.comparison.headers.apps')}</div>
            </div>

                        {[
              { feature: t('solution.comparison.rows.interactive'), treed: "yes", audio: "no", guide: "yes", app: "limited" },
              { feature: t('solution.comparison.rows.followup'), treed: "yes", audio: "no", guide: "yes", app: "limited" },
              { feature: t('solution.comparison.rows.eyesOn'), treed: "yes", audio: "yes", guide: "yes", app: "no" },
              { feature: t('solution.comparison.rows.multi'), treed: "yes", audio: "yes", guide: "no", app: "yes" },
              { feature: t('solution.comparison.rows.selfpaced'), treed: "yes", audio: "yes", guide: "no", app: "yes" },
              { feature: t('solution.comparison.rows.zeroLearning'), treed: "yes", audio: "yes", guide: "yes", app: "no" },
              { feature: t('solution.comparison.rows.noOnboarding'), treed: "yes", audio: "yes", guide: "yes", app: "no" },
              { feature: t('solution.comparison.rows.price'), treed: "yes", audio: "yes", guide: "no", app: "yes" },
              { feature: t('solution.comparison.rows.route'), treed: "yes", audio: "limited", guide: "no", app: "caution" },
            ].map((row, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="min-w-[900px] md:min-w-[1100px] grid grid-cols-6 gap-4 md:gap-6 py-4 md:py-5 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors group/row"
              >
                <div className="font-bold pl-4 md:pl-10 col-span-2 text-zinc-300 text-sm md:text-base group-hover/row:text-white transition-colors">{row.feature}</div>
                
                {/* Tree'd Cell with Fancy Animation */}
                <div className="flex justify-center items-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex justify-center items-center text-primary shadow-[0_0_20px_rgba(200,223,82,0)] group-hover/row:shadow-[0_0_25px_rgba(200,223,82,0.2)] group-hover/row:bg-primary group-hover/row:text-black transition-all duration-500"
                  >
                    <Check className="w-5 h-5 md:w-6 md:h-6 stroke-[3]" />
                  </motion.div>
                </div>

                <div className="text-zinc-500 text-center flex justify-center transition-opacity group-hover/row:opacity-100 opacity-60">
                  <StatusIcon status={row.audio} />
                </div>
                <div className="text-zinc-500 text-center flex justify-center transition-opacity group-hover/row:opacity-100 opacity-60">
                  <StatusIcon status={row.guide} />
                </div>
                <div className="text-zinc-500 text-center flex justify-center transition-opacity group-hover/row:opacity-100 opacity-60">
                  <StatusIcon status={row.app} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Engagement Gap */}
<section className="py-24 relative overflow-hidden">
  <div className="container mx-auto relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0"
    >
      <div className="w-full md:flex-1 md:pr-12 flex items-start md:items-center">
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          <span className={isLight ? 'text-zinc-900' : 'text-white'}>
            {t('visitorExperience.engagementDifference.title1')}{' '}
          </span>

          <span
  ref={gapRef}
  onMouseMove={handleGapMouseMove}
  onMouseLeave={handleGapMouseLeave}
  className="text-zinc-500 relative cursor-default inline-block"
>
  {t('visitorExperience.engagementDifference.title2')}

  <motion.span
    className="absolute inset-0 text-white pointer-events-none overflow-hidden select-none"
    style={{
      clipPath: useTransform(
        [gapX, gapY, gapOpacity],
        ([x, y, opacity]: any) => `circle(${opacity * 80}px at ${x}px ${y}px)`
      )
    }}
  >
    {t('visitorExperience.engagementDifference.title2')}
  </motion.span>
</span>
        </h2>
      </div>

      <div className={`hidden md:block w-px self-stretch ${isLight ? 'bg-zinc-200' : 'bg-white/10'}`} />

      <div className="w-full md:flex-1 md:pl-12 flex flex-col items-start md:items-start gap-6">
  <p className={`text-base md:text-xl font-light leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
    {t('visitorExperience.engagementDifference.desc')}
  </p>
  <Link href="/use-cases">
    <span className="inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta">
      {t('buttons.discoverUseCases')}
      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
    </span>
  </Link>
</div>
    </motion.div>
  </div>
</section>
      {/* Final CTA Section - Creative Museum Partnership */}
      <section className="py-24 relative overflow-hidden bg-[#020202]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] opacity-50"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-8 block">{t('visitorExperience.cta.label')}</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8 text-white uppercase">
              {t('visitorExperience.cta.title1')} <br/>
              <span className="text-gradient-primary">{t('visitorExperience.cta.title2')}</span>
            </h2>
            <p className={`text-lg font-light leading-relaxed mb-10 max-w-xl mx-auto ${isLight ? 'desc-neutral' : 'text-zinc-400'}`}>{t('visitorExperience.cta.desc')}</p>
            
            <div className="flex justify-center">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
    <Link href="/booking">
    <Button
      size="lg"
      className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors duration-300 min-w-[240px] justify-center"
    >
      {t('visitorExperience.cta.btn')}
    </Button>
  </Link>

  <Link href="/solution">
    <Button
      variant="ghost"
      className={`rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 min-w-[240px] justify-center ${
        isLight
          ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
          : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      {t('visitorExperience.cta.secondaryBtn')}
    </Button>
  </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "yes") return <Check className="w-6 h-6 text-primary" />;
  if (status === "no") return <X className="w-6 h-6 text-red-500" />;
  if (status === "caution" || status === "limited") return <AlertTriangle className="w-6 h-6 text-[#f97316]" />;
  return <AlertTriangle className="w-6 h-6 text-zinc-500" />;
}