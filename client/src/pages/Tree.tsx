import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield, Layout, RefreshCw, Zap, WifiOff, ArrowUpRight, Battery, CheckCircle2, Server, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";
import { useRef, useEffect, useState } from "react";

import Tree_Close_up from "@assets/Tree Close up.png";
import Fast_Infrastructure from "@assets/fast-infrastructure.png";

export default function Tree() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const underlineRef = useRef<SVGPathElement>(null);
  const [strokeOffset, setStrokeOffset] = useState(280);

  useEffect(() => {
    let animationId: number;

    const handleScroll = () => {
      if (!underlineRef.current?.parentElement?.parentElement) return;

      const parentSpan = underlineRef.current.parentElement.parentElement;
      const rect = parentSpan.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start animation when element is 80% down viewport, finish much earlier
      const elementProgress = Math.max(0, Math.min(1, (viewportHeight * 0.9 - rect.top) / (viewportHeight * 0.6)));

      // SVG path length (280 pixels)
      const pathLength = 280;
      const eased = 1 - Math.pow(elementProgress, 2.5);
      setStrokeOffset(pathLength * eased);
    };

    const rafScroll = () => {
      handleScroll();
      animationId = requestAnimationFrame(rafScroll);
    };

    rafScroll();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO page="tree" />
      <StructuredData page="tree" />
      <Navbar />

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className={`absolute inset-0 ${isLight ? "bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)]"} bg-[size:80px_80px]`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_50%,rgba(164,212,59,0.07),transparent)]" />

        <div className="container mx-auto pt-32 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="flex flex-col justify-center">
              <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 mb-10">
                <div className="w-8 h-px bg-primary" />
                <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-black">{t('tree.hero.label')}</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="font-black leading-[0.88] tracking-tighter mb-10" style={{ fontSize: "clamp(72px, 10vw, 148px)" }} data-testid="text-tree-title">
                {t('tree.hero.title')}
              </motion.h1>

              <motion.div initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.45, duration: 0.6 }} className={`w-full h-px mb-10 ${isLight ? "bg-zinc-200" : "bg-white/8"}`} />

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className={`text-base md:text-lg font-light leading-relaxed max-w-none md:max-w-2xl ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
  {t('tree.hero.desc')}
</motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }} className="mt-10 flex flex-col gap-3">
                {[t('tree.hero.bullets.ai'), t('tree.hero.bullets.infra'), t('tree.hero.bullets.runs')].map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{bullet}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.82 }} className="mt-10">
                <a href="#automate">
                  <Button variant="secondary" className="rounded-full h-12 px-8 text-base font-bold tracking-normal group">
                    {t('tree.hero.explore')}
                    <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative hidden lg:block">
              <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(164,212,59,0.1),transparent_70%)] blur-3xl pointer-events-none" />
              <div className={`relative rounded-[2.5rem] overflow-hidden border ${isLight ? "border-zinc-200 shadow-[0_32px_80px_rgba(0,0,0,0.12)]" : "border-white/8 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"}`}>
                <img src={Tree_Close_up} alt="Tree'd central backbone architecture powering AI museum audio guide devices" className="w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="automate" className={`${isLight ? "bg-zinc-50" : "bg-[#060606]"}`}>
        <div className="container mx-auto py-32">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 text-center">
            <h2 className={`font-black tracking-tight leading-[1] mx-auto ${isLight ? "text-zinc-900" : "text-white"}`} style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}>{t('tree.automate.headline')}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(['outcome1', 'outcome2', 'outcome3'] as const).map((key, i) => {
              const pills = t(`tree.automate.${key}.pills`, { returnObjects: true }) as string[];
              return (
                <motion.div key={key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className={`relative flex flex-col rounded-[2.5rem] border overflow-hidden p-7 md:p-8 min-h-[340px] group hover:border-primary/20 transition-all duration-500 ${isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/30 border-white/5"}`}>
                  <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="h-[120px] md:h-[130px] flex flex-col justify-center">
                    <span className={`text-[11px] font-black tracking-[0.25em] ${isLight ? "text-zinc-300" : "text-zinc-700"} group-hover:text-primary transition-colors duration-300`}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={`text-xl md:text-2xl font-bold leading-tight mt-4 ${isLight ? "text-zinc-900" : "text-white"}`}>{t(`tree.automate.${key}.title`)}</h3>
                  </div>
                  <div className="flex flex-col gap-2 mt-6">{Array.isArray(pills) && pills.map((pill, j) => (<span key={j} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] uppercase tracking-[0.18em] font-black border transition-colors w-full ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-500" : "bg-white/4 border-white/8 text-zinc-500"}`}><CheckCircle2 className="w-3 h-3 text-primary shrink-0" />{pill}</span>))}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden min-h-[75vh] flex items-center bg-zinc-950">
        <img src={Fast_Infrastructure} alt="Fast infrastructure background" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div
          className={`absolute inset-0 ${
            isLight
               ? "bg-white/85"
               : "bg-gradient-to-l from-black/90 via-black/20 to-black/00"
           }`}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_0%_50%,rgba(164,212,59,0.07),transparent)]" />

        <div className="container mx-auto relative z-10 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-28 items-center">
            <div>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-primary text-[10px] uppercase tracking-[0.4em] font-black mb-6 block">{t('tree.infrastructure.label')}</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`font-black leading-[1.0] tracking-tight ${isLight ? "text-zinc-900" : "text-white"}`} style={{ fontSize: "clamp(36px, 5vw, 72px)" }}>
                {t('tree.infrastructure.title')}
              </motion.h2>
            </div>
            <div className="flex flex-col gap-10">
              {[
                { icon: <Zap className="w-6 h-6" />, text: t('tree.infrastructure.points.stable') },
                { icon: <Shield className="w-6 h-6" />, text: t('tree.infrastructure.points.simple') },
                { icon: <RefreshCw className="w-6 h-6" />, text: t('tree.infrastructure.points.updates') },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                  <div className="text-primary shrink-0 mt-0.5">{item.icon}</div>
                  <p className={`text-base leading-relaxed max-w-2xl ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`py-48 ${isLight ? "bg-white" : "bg-background"}`}>
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-primary text-[10px] uppercase tracking-[0.4em] font-black mb-5 block">{t('tree.infrastructure.quote.label')}</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={`font-black tracking-tight leading-[1.15] mx-auto max-w-[1100px] ${isLight ? "text-zinc-900" : "text-white"}`} style={{ fontSize: "clamp(38px, 5vw, 78px)" }}>
              {t('tree.infrastructure.quote.headingPrefix')}{' '}
              <span className="relative inline-block">
                {t('tree.infrastructure.quote.headingUnderlined')}
                <svg
                  viewBox="0 0 220 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="absolute left-0 w-full pointer-events-none"
                  style={{ bottom: "-0.18em", height: "0.22em" }}
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 2,5 C 55,3 110,4 165,6 C 185,7 200,8.5 218,11"
                    stroke="rgba(164,212,59,0.3)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    ref={underlineRef}
                    d="M 2,5 C 55,3 110,4 165,6 C 185,7 200,8.5 218,11"
                    stroke="rgba(164,212,59,1)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={280}
                    strokeDashoffset={strokeOffset}
                  />
                </svg>
              </span>
            </motion.h2>
          </div>
        </div>
      </section>

      <section className={`py-32 relative overflow-hidden ${isLight ? "bg-white" : "bg-background"}`}>
        <div className="container mx-auto">
          <div className="mb-20">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-primary text-[10px] uppercase tracking-[0.4em] font-black mb-5 block">{t('tree.operational.label')}</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-black tracking-tight leading-[1] mb-6" style={{ fontSize: "clamp(40px, 6vw, 92px)" }}>{t('tree.operational.title1')} <span className={`font-light ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>{t('tree.operational.title2')}</span></motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`text-lg font-light max-w-xl leading-relaxed ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{t('tree.operational.desc')}</motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto md:auto-rows-[310px]">
            <div className={`md:col-span-8 p-10 md:p-14 rounded-[3rem] border group hover:border-primary/25 transition-all duration-500 flex flex-col relative overflow-hidden ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-900/30 border-white/5"}`}>
              <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-primary/4 rounded-full blur-[130px] group-hover:bg-primary/8 transition-colors duration-700 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(164,212,59,0.03),transparent_50%)] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0"><Zap className="w-7 h-7" /></div>
                  <h4 className={`text-2xl md:text-3xl font-bold leading-tight ${isLight ? "text-zinc-900" : "text-white"}`}>{t('tree.operational.engine.title')}</h4>
                </div>
                <p className={`text-base leading-relaxed max-w-xl ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{(() => { const text = t('tree.operational.engine.desc'); const parts = text.split('Handset'); return parts.length === 2 ? <>{parts[0]}<Link href="/handset" className="underline decoration-primary/40 hover:decoration-primary transition-colors">Handset</Link>{parts[1]}</> : <>{text}</>; })()}</p>
              </div>
            </div>
            <div className={`md:col-span-4 md:row-span-2 p-10 rounded-[3rem] border group hover:border-primary/25 transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-900/30 border-white/5"}`}>
              <div className="relative z-10"><div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform duration-500"><Battery className="w-7 h-7" /></div><h4 className={`text-2xl font-bold mb-4 leading-tight ${isLight ? "text-zinc-900" : "text-white"}`}>{t('tree.operational.power.title')}</h4><p className={`text-sm leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{t('tree.operational.power.desc')}</p></div>
              <div className={`relative rounded-[2rem] border p-8 ${isLight ? "bg-white border-zinc-200" : "bg-zinc-950/60 border-white/5"}`}><div className="space-y-2.5 mb-5">{[100, 82, 96, 71, 100].map((pct, i) => (<div key={i} className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? "bg-zinc-100" : "bg-zinc-800"}`}><motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.6, delay: i * 0.12, ease: "circOut" }} className="h-full bg-primary" style={{ opacity: 0.4 + (pct / 100) * 0.6, boxShadow: pct === 100 ? "0 0 8px rgba(164,212,59,0.4)" : "none" }} /></div>))}</div><span className="text-[9px] uppercase tracking-[0.3em] font-black text-primary animate-pulse">{t('tree.operational.power.status')}</span></div>
            </div>
            <div className={`md:col-span-4 p-10 rounded-[3rem] border group hover:border-primary/25 transition-all duration-500 flex flex-col justify-between overflow-hidden ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-900/30 border-white/5"}`}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-[360deg] transition-transform duration-1000"><RefreshCw className="w-7 h-7" /></div>
              <div><h4 className={`text-xl font-bold mb-3 ${isLight ? "text-zinc-900" : "text-white"}`}>{t('tree.operational.sync.title')}</h4><p className={`text-sm leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{(() => { const text = t('tree.operational.sync.desc'); const parts = text.split('Analytics Dashboard'); return parts.length === 2 ? <>{parts[0]}<Link href="/dashboard" className="underline decoration-primary/40 hover:decoration-primary transition-colors">Analytics Dashboard</Link>{parts[1]}</> : <>{text}</>; })()}</p></div>
            </div>
            <div className={`md:col-span-4 p-10 rounded-[3rem] border group hover:border-primary/25 transition-all duration-500 flex flex-col justify-between ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-zinc-900/30 border-white/5"}`}>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500"><Layout className="w-7 h-7" /></div>
              <div><h4 className={`text-xl font-bold mb-3 ${isLight ? "text-zinc-900" : "text-white"}`}>{t('tree.operational.presentation.title')}</h4><p className={`text-sm leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>{t('tree.operational.presentation.desc')}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-32 ${isLight ? "bg-zinc-50" : "bg-[#060606]"}`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`font-black tracking-tight leading-[1.0] max-w-md ${isLight ? "text-zinc-900" : "text-white"}`} style={{ fontSize: "clamp(36px, 5vw, 68px)" }}>{t('tree.tailored.title')}</motion.h2>
            <div className="flex flex-col items-start md:items-end gap-4">
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`max-w-sm text-base font-light leading-relaxed md:text-right ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{t('tree.tailored.desc')}</motion.p>
              <Link href="/use-cases">
                <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta">
                  {t('buttons.exploreUseCases')}
                  <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                </motion.span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: 'custom', title: t('tree.tailored.items.custom.title'), desc: t('tree.tailored.items.custom.desc'), optional: false },
              { key: 'last', title: t('tree.tailored.items.last.title'), desc: t('tree.tailored.items.last.desc'), optional: false },
              { key: 'scale', title: t('tree.tailored.items.scale.title'), desc: t('tree.tailored.items.scale.desc'), optional: false },
              { key: 'collab', title: t('tree.tailored.items.collab.title'), desc: t('tree.tailored.items.collab.desc'), optional: true },
            ].map((item, i) => (
              <div key={item.key} className={`group relative overflow-hidden rounded-[2.5rem] border cursor-default transition-all duration-500 hover:border-primary/20 ${isLight ? "bg-white border-zinc-200 shadow-sm" : "bg-zinc-900/30 border-white/5"}`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(164,212,59,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col p-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-0 group-hover:scale-[0.97] pointer-events-none max-md:hidden">
                  <span className={`text-[9px] tracking-[0.3em] font-black uppercase ${isLight ? "text-zinc-300" : "text-zinc-700"}`}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
                    <h4 className={`font-black leading-snug ${isLight ? "text-zinc-900" : "text-white"}`} style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}>{item.title}</h4>
                    {item.optional && (<span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-[0.2em] font-black border ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-400" : "bg-white/4 border-white/10 text-zinc-500"}`}>{t('tree.optionalLabel')}</span>)}
                  </div>
                  <div className="flex justify-center"><span className={`text-xs tracking-[0.25em] ${isLight ? "text-zinc-300" : "text-zinc-700"}`}>· · ·</span></div>
                </div>
                <div className="flex flex-col p-10 min-h-[320px] opacity-0 translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 group-hover:translate-y-0 max-md:opacity-100 max-md:translate-y-0 max-md:h-full max-md:min-h-[320px]">
                  <div className="flex items-start gap-3 mb-6">
                    <h4 className={`text-2xl md:text-3xl font-bold leading-snug ${isLight ? "text-zinc-900" : "text-white"}`}>{item.title}</h4>
                    {item.optional && (<span className={`mt-1 px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-[0.18em] font-black border shrink-0 ${isLight ? "bg-zinc-50 border-zinc-200 text-zinc-400" : "bg-white/4 border-white/10 text-zinc-500"}`}>{t('tree.optionalLabel')}</span>)}
                  </div>
                  <p className={`text-lg leading-relaxed flex-1 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{item.desc}</p>
                  <span className={`text-[9px] tracking-[0.3em] font-black uppercase mt-8 ${isLight ? "text-zinc-300" : "text-zinc-700"}`}>{String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-32 relative overflow-hidden border-t ${isLight ? "bg-white border-zinc-100" : "bg-[#040404] border-white/5"}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-primary/6 blur-[140px] pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-primary text-[10px] uppercase tracking-[0.4em] font-black mb-6 block">{t('tree.connectivity.label')}</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`font-black tracking-tight leading-[1] ${isLight ? "text-zinc-900" : "text-white"}`} style={{ fontSize: "clamp(40px, 6.5vw, 96px)" }}>{t('tree.connectivity.title')}</motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-5">
            <div className="flex flex-col gap-10">
              {[
                { icon: <WifiOff className="w-6 h-6" />, title: t('tree.connectivity.onsite.title'), desc: t('tree.connectivity.onsite.desc') },
                { icon: <Shield className="w-6 h-6" />, title: t('tree.connectivity.encrypted.title'), desc: t('tree.connectivity.encrypted.desc') },
                { icon: <Server className="w-6 h-6" />, title: t('tree.connectivity.autonomous.title'), desc: t('tree.connectivity.autonomous.desc') },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                  <div className="text-primary shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <h5 className={`font-bold mb-1 ${isLight ? "text-zinc-900" : "text-white"}`}>{item.title}</h5>
                    <p className={`text-xs leading-relaxed ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div className={`relative p-12 md:p-14 rounded-[3rem] border overflow-hidden flex flex-col justify-between min-h-[320px] ${isLight ? "bg-zinc-900 border-zinc-800" : "bg-zinc-900/50 border-white/5"}`}>
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/18 blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/6 blur-[80px] pointer-events-none" />
              <div className="relative z-10"><h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{t('tree.cta.title1')}<span className="text-primary">{t('tree.cta.magic')}</span>{t('tree.cta.title2')}</h3><p className="text-zinc-400 font-light leading-relaxed">{t('tree.cta.desc')}</p></div>
              <div className="relative z-10 mt-10">
<Link href="/contact" className="block md:inline-block md:w-fit">
  <Button className="w-full md:w-auto bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors">
    {t('tree.cta.btn')}
    <ArrowUpRight className="ml-2 w-4 h-4" />
  </Button>
</Link>
</div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
