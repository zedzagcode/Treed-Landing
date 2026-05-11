import { useRef, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useInView } from "framer-motion";
import { LayoutDashboard, BarChart3, Users, Languages, Activity, TrendingUp, PieChart, ShieldAlert, Map, Zap, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";

import image__1_ from "@assets/image (1).png";
import { ScreenshotGallery } from "@/components/dashboard/ScreenshotGallery";
import { DashboardScrollytelling } from "@/components/dashboard/DashboardScrollytelling";

const SCRAMBLE_CHARS = '!@#$%&*?/|~^°§€£¥Ω√˜μ≤≥αβγδ01∆∑∏';

function useNumberToWordText(target: string, inView: boolean) {
  const [display, setDisplay] = useState(target);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const frames = 28;
    frameRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / frames;
      const locked = Math.floor(progress * target.length);
      setDisplay(
        target.split("").map((char, i) => {
          if (i < locked) return char;
          if (char === " ") return " ";
          return String(Math.floor(Math.random() * 10));
        }).join("")
      );
      if (frameRef.current >= frames) {
        setDisplay(target);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [inView, target]);

  return display;
}

function useScrambleText(target: string, inView: boolean) {
  const [display, setDisplay] = useState(target);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const FRAMES = 24;
    frameRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / FRAMES;
      const locked = Math.floor(progress * target.length);
      setDisplay(
        target.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < locked) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join('')
      );
      if (frameRef.current >= FRAMES) {
        setDisplay(target);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 38);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [inView, target]);

  return display;
}

function renderPrivacyBody(body: string, index: number) {
  if (index === 0) {
    const parts = body.split('Handset');
    if (parts.length === 2) return <>{parts[0]}<Link href="/handset" className="underline decoration-primary/40 hover:decoration-primary transition-colors">Handset</Link>{parts[1]}</>;
  }
  if (index === 2) {
    const parts = body.split('The Tree');
    if (parts.length === 2) return <>{parts[0]}<Link href="/tree" className="underline decoration-primary/40 hover:decoration-primary transition-colors">The Tree</Link>{parts[1]}</>;
  }
  return <>{body}</>;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const scrambleRef = useRef<HTMLHeadingElement>(null);
  const scrambleInView = useInView(scrambleRef, { once: true, margin: '-80px' });
  const scrambledWord = useScrambleText(t('dashboard.actions.title1a'), scrambleInView);
  const descRef = useRef<HTMLParagraphElement>(null);
  const numbersRef = useRef<HTMLSpanElement>(null);
  const numbersInView = useInView(numbersRef, { once: true, margin: '-80px' });
    const ctaLabel = t('dashboard.cta.label');
  const ctaHeadline = t('dashboard.cta.headline');
  const ctaSubheadline = t('dashboard.cta.subheadline');
  const ctaPrimary = t('dashboard.cta.primary');
  const ctaSecondary = t('dashboard.cta.secondary');
  const ctaNumbersWord = t('dashboard.cta.numbersWord');
  const ctaHeadlineParts = ctaHeadline.split('{{numbers}}');
  const animatedNumbers = useNumberToWordText(ctaNumbersWord, numbersInView);

  const scrollToEmbed = () => {
    const embed = document.getElementById('dashboard-hero-embed');
    if (!embed) return;
    embed.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const metrics = [
    {
      id: "behavior",
      title: t('dashboard.metrics.behavior.title'),
      icon: <Map className="w-6 h-6 text-primary" />,
      items: t('dashboard.metrics.behavior.items', { returnObjects: true }) as string[]
    },
    {
      id: "interaction",
      title: t('dashboard.metrics.interaction.title'),
      icon: <Activity className="w-6 h-6 text-primary" />,
      items: t('dashboard.metrics.interaction.items', { returnObjects: true }) as string[]
    },
    {
      id: "language",
      title: t('dashboard.metrics.language.title'),
      icon: <Languages className="w-6 h-6 text-primary" />,
      items: t('dashboard.metrics.language.items', { returnObjects: true }) as string[]
    },
    {
      id: "system",
      title: t('dashboard.metrics.system.title'),
      icon: <Zap className="w-6 h-6 text-primary" />,
      items: t('dashboard.metrics.system.items', { returnObjects: true }) as string[]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <SEO page="dashboard" />
      <StructuredData page="dashboard" />
      <Navbar />
      {/* New Modern Hero Section */}
      <section className="pt-56 pb-20 relative overflow-hidden">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
        
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <span className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-8 block">{t('dashboard.hero.label')}</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.02] tracking-tight px-4 md:px-0" data-testid="text-dashboard-title">
              {t('dashboard.hero.title')}
            </h1>
            <div className="text-xl md:text-2xl font-light leading-relaxed mb-16 max-w-2xl mx-auto desc-neutral">
              <p ref={descRef}>{t('dashboard.hero.desc')}</p>
            </div>
            
            {/* Centered Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }} 
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ delay: 0.2, duration: 1, type: "spring" }}
              className="relative max-w-4xl mx-auto perspective-1000"
            >
              <div id="dashboard-hero-embed" className="glass rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_0_80px_-20px_rgba(200,223,82,0.2)] bg-zinc-900/40 backdrop-blur-xl transform-gpu hover:scale-[1.01] transition-transform duration-700">
                <div className="sl-embed" style={{ position: 'relative', paddingBottom: 'calc(47.50% + 25px)', width: '100%', height: 0 }}>
                  <iframe 
                    loading="lazy" 
                    className="sl-demo" 
                    src="https://app.storylane.io/demo/jyjklxzmpk60?embed=inline" 
                    name="sl-embed" 
                    allow="fullscreen" 
                    allowFullScreen 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  ></iframe>
                </div>
              </div>
              {/* Glow Effect */}
              <div className="absolute -inset-10 bg-primary/20 blur-[100px] -z-10 rounded-full"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <div className="section-divider"></div>
      <section className="py-32 bg-zinc-950/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
              <span className="text-primary text-sm font-bold uppercase tracking-widest mb-6 block">{t('dashboard.metrics.label')}</span>
              <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter leading-none">{t('dashboard.metrics.title')}</h2>
              <p className={`text-lg leading-relaxed max-w-xl ${isLight ? '' : 'text-zinc-400'}`} style={isLight ? { color: '#4B5563' } : undefined}>
                {t('dashboard.metrics.desc')}
              </p>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="space-y-4"
            >
              <Accordion type="single" collapsible defaultValue="behavior" className="w-full">
                {metrics.map((metric) => (
                  <AccordionItem key={metric.id} value={metric.id} className="border-white/10">
                    <AccordionTrigger className="text-2xl font-bold py-6 hover:no-underline hover:text-primary transition-colors">
                      <div className="flex items-center gap-4">
                        {metric.icon}
                        {metric.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8">
                      <ul className="space-y-4 pl-10">
                        {metric.items.map((item, idx) => (
                          <li key={idx} className="text-zinc-400 flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Translate Metrics into Actions — DecisionDeck */}
      {(() => {
        const actionCards = t('dashboard.actions.cards', { returnObjects: true }) as Array<{ category: string; action: string; body: string; decisions: string[] }>;
        const nums = ['01', '02', '03', '04'];
        return (
          <section className={`py-24 md:py-32 relative overflow-hidden border-t ${isLight ? 'border-zinc-200' : 'border-white/5'}`}>
            <div className="container mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row gap-8 justify-between items-start md:items-end border-b pb-12 mb-16 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}
              >
                <div className="max-w-2xl space-y-5">
                  <h2 ref={scrambleRef} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]" data-testid="text-metrics-actions-title">
                    <span className="font-mono tabular-nums">{scrambledWord}</span>{' '}
                    <span>{t('dashboard.actions.title1b')}</span> <span className="text-primary">→</span> <span className="text-primary">{t('dashboard.actions.title2')}</span>
                  </h2>
                  <p className={`text-base md:text-lg leading-relaxed max-w-xl ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                    {t('dashboard.actions.desc')}{' '}
                    <mark className={`px-1.5 py-0.5 rounded font-semibold not-italic ${isLight ? 'bg-primary/25 text-zinc-900' : 'bg-primary/20 text-white'}`} style={{ WebkitBoxDecorationBreak: 'clone' }}>{t('dashboard.actions.descHighlight')}</mark>
                  </p>
                </div>
                <div className={`hidden md:flex items-center gap-2 text-xs font-bold tracking-widest uppercase shrink-0 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span className={`w-8 h-px inline-block ${isLight ? 'bg-zinc-300' : 'bg-zinc-700'}`}></span>
                  {t('dashboard.actions.hoverHint')}
                </div>
              </motion.div>

              {/* 2×2 card grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {actionCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`group relative h-[400px] md:h-[420px] rounded-3xl overflow-hidden border transition-[background-color,border-color] duration-300 ease-out ${isLight   ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-primary/40'   : 'bg-zinc-950 border-zinc-800/60 hover:bg-zinc-900 hover:border-primary/40'}`}
data-testid={`card-metrics-${nums[i]}`}
                  >
                    {/* Always-visible header: number + category */}
                    <div className="absolute top-0 inset-x-0 p-8 md:p-10 z-30 flex items-center gap-3">
                      <span className="text-xs font-bold tracking-widest text-primary">{nums[i]}</span>
                      <span className={`text-xs font-bold uppercase tracking-widest ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>{card.category}</span>
                    </div>

                    {/* Front: action headline — fades out on hover */}
                    <div className="absolute inset-0 p-8 md:p-10 pt-20 flex items-end z-10 transition-opacity duration-700 ease-in-out group-hover:opacity-0 pointer-events-none max-md:hidden">
                      <h3 className={`text-2xl md:text-3xl font-bold leading-tight tracking-tight pr-6 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                        {card.action}
                      </h3>
                    </div>

                    {/* Back: body + decisions — fades in on hover */}
                    <div className="absolute inset-0 p-8 md:p-10 pt-20 flex flex-col justify-end z-20 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 pointer-events-none max-md:relative max-md:inset-auto max-md:opacity-100 max-md:pt-20">
                      <div className="space-y-5">
                        <p className={`text-[15px] leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                          {card.body}
                        </p>
                        <div className="space-y-3">
                          <p className={`text-[10px] font-bold tracking-widest uppercase ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>{t('dashboard.actions.exampleDecisions')}</p>
                          <ul className="space-y-2.5">
                            {card.decisions.map((d, di) => (
                              <li key={di} className="flex items-start gap-3" data-testid={`decision-${nums[i]}-${di}`}>
                                <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span className={`text-sm font-medium leading-snug ${isLight ? 'text-zinc-800' : 'text-zinc-100'}`}>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      <section className="py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-10 mb-14 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}
          >
            <div>
              <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-3 block">{t('dashboard.visuals.label')}</span>
              <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>{t('dashboard.visuals.title')}</h2>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="lg:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-zinc-900/20 border border-white/5 p-12"
            >
               <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{t('dashboard.visuals.engagement.title')}</h3>
                    <p className="text-sm desc-neutral">{t('dashboard.visuals.engagement.desc')}</p>
                  </div>
                  <TrendingUp className="text-primary" />
               </div>
               <img src={image__1_} alt={t('dashboard.visuals.engagement.desc')} className="w-full rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
            </motion.div>
            
            <div className="lg:col-span-4 space-y-6">
              {[
                { icon: <Languages />, title: t('dashboard.visuals.mix.title'), desc: t('dashboard.visuals.mix.desc') },
                { icon: <PieChart />, title: t('dashboard.visuals.popularity.title'), desc: t('dashboard.visuals.popularity.desc') },
                { icon: <Users />, title: t('dashboard.visuals.reach.title'), desc: t('dashboard.visuals.reach.desc') }
              ].map((item, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-primary/30 transition-all"
                >
                  <div className={`${isLight ? 'text-[#4d6012]' : 'text-primary'} mb-4`}>{item.icon}</div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm leading-relaxed desc-neutral">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      
      {/* Dashboard Scrollytelling Section — desktop only */}
      <div className="hidden lg:block">
       <DashboardScrollytelling />
      </div>

      {/* Screenshot Gallery Section */}
      <ScreenshotGallery />

      {/* Privacy Section */}
      {(() => {
        const privacyStatements = t('dashboard.privacy.statements', { returnObjects: true }) as Array<{ title: string; body: string }>;
        const privacyPills = t('dashboard.privacy.pills', { returnObjects: true }) as string[];
        return (
          <section className={`py-24 md:py-32 relative overflow-hidden border-t ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-900'}`}>
            {/* Subtle background grid */}
            <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]'} bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_60%_at_50%_0%,black,transparent)]`}></div>

            <div className="container mx-auto relative z-10">

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-14"
              >
                <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">{t('dashboard.privacy.label')}</span>
                <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.0] max-w-4xl ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  {t('dashboard.privacy.headline1')}<br />
                  <span className="text-primary">{t('dashboard.privacy.headline2')}</span>
                </h2>
              </motion.div>

              {/* Pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-wrap gap-2.5 mb-16"
              >
                {privacyPills.map((pill, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide border cursor-default transition-all duration-300 ${isLight ? 'bg-white border-zinc-200 text-zinc-700 shadow-sm hover:border-primary/50 hover:bg-primary/8 hover:text-zinc-900 hover:shadow-md' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-primary/60 hover:bg-primary/10 hover:text-white'}`}
                    data-testid={`pill-privacy-${i}`}
                  >
                    <Check className="w-3 h-3 text-primary shrink-0" />
                    {pill}
                  </span>
                ))}
              </motion.div>

              {/* Statement matrix — 2×2 grid with gap-px dividing lines */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-px ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`}>
                {privacyStatements.map((s, i) => (
                  <motion.div
                    key={i}
                    className={`p-10 md:p-12 group cursor-default transition-all duration-500 ${isLight ? 'bg-zinc-50 hover:bg-white hover:shadow-[inset_4px_0_0_#c8df52]' : 'bg-zinc-950 hover:bg-zinc-900 hover:shadow-[inset_4px_0_0_#c8df52]'}`}
                    data-testid={`statement-privacy-${i}`}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${isLight ? 'border-zinc-200 bg-white group-hover:border-primary/40 group-hover:bg-primary/5' : 'border-zinc-800 bg-zinc-900 group-hover:border-primary/40 group-hover:bg-primary/10'}`}>
                        <span className="text-[10px] font-bold text-primary tabular-nums">0{i + 1}</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className={`text-lg md:text-xl font-bold leading-snug transition-colors duration-300 ${isLight ? 'text-zinc-900 group-hover:text-zinc-950' : 'text-white'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-[15px] leading-relaxed transition-colors duration-300 ${isLight ? 'text-zinc-600 group-hover:text-zinc-700' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                          {renderPrivacyBody(s.body, i)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </section>
        );
      })()}
      <section className={`pt-24 pb-32 md:pt-32 md:pb-40 border-t ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-white/5 bg-zinc-950/40'}`}>
        <div className="container mx-auto">
          <div className={`relative overflow-hidden rounded-[2.5rem] border p-10 md:p-16 ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/60'}`}>
            <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(circle_at_top_left,rgba(200,223,82,0.12),transparent_40%),linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]' : 'bg-[radial-gradient(circle_at_top_left,rgba(200,223,82,0.14),transparent_40%),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]'} bg-[size:auto,56px_56px,56px_56px]`}></div>
                          <div className="relative z-10 max-w-4xl">
                <p
                  className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-5"
                  data-testid="text-dashboard-cta-label"
                >
                  {ctaLabel}
                </p>
                <h2
                  className={`text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl ${
                    isLight ? 'text-zinc-900' : 'text-white'
                  }`}
                  data-testid="text-dashboard-cta-headline"
                >
                  {ctaHeadlineParts[0]}
                  <span ref={numbersRef} className="inline-block min-w-[6ch] text-primary tabular-nums">
                    {animatedNumbers}
                  </span>
                  {ctaHeadlineParts[1]}
                </h2>
                                          <p className={`mt-6 text-lg md:text-xl leading-relaxed max-w-2xl ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`} data-testid="text-dashboard-cta-subheadline">
                {ctaSubheadline}
              </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-sm md:text-base font-bold tracking-normal transition-colors duration-300"
                  data-testid="button-dashboard-cta-primary"
                >
                  {ctaPrimary}
                </Link>
                <button
                  onClick={scrollToEmbed}
                  className={`inline-flex items-center justify-center rounded-full h-12 px-6 md:px-8 text-sm md:text-base font-bold tracking-normal transition-colors border duration-300 whitespace-nowrap ${
                    isLight
                      ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
                      : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                  data-testid="button-dashboard-cta-secondary"
                >
                  {ctaSecondary}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}