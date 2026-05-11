import { useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Battery, Globe, Zap, ArrowRight, Activity, ShieldCheck, Check, Database, Server, Palette, Unplug, Gauge, Languages, X, Radio, MessageCircleOff, Users, MessageCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";

import Both_low_light_mood_close_up_dramatic from "@assets/Both low-light mood close up dramatic.png";
import very_low_lighting from "@assets/very low lighting.png";
import Dashboard from "@assets/Dashboard.png";
import SolutionHeroDark from "@assets/dark-solution-hero.png";
import SolutionHeroLight from "@assets/light-solution-hero.png";

// ─── Scroll-to-video timing constants ────────────────────────────────────────
// Video scrubs from 0 → VIDEO_SCRUB_END of scroll progress.
// Wrapper is 550vh: 5s clip at ~73vh/s + 110vh clean-hold at the end.
const VIDEO_SCRUB_END  = 0.73; // video reaches last frame at this progress
const TITLE_FADE_START = 0.64; // heading starts drifting upward
const TITLE_FADE_END   = 0.80; // heading fully gone — 20% clean hold remains

// ─── PART 1: Scrollytelling ───────────────────────────────────────────────────
function ConversationalScrollytelling() {
  const { t } = useTranslation();
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const smoothTimeRef = useRef(0);

  // Detect reduced-motion preference once on mount
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  // ── Scroll → target video time ──────────────────────────────────────────────
  // Runs whenever framer-motion fires a scroll update. Writes to a ref so the
  // RAF loop can read it without triggering re-renders.
  useEffect(() => {
    if (reducedMotion.current) return;
    const unsub = scrollYProgress.on("change", (progress) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;
      const videoProgress = Math.min(1, Math.max(0, progress / VIDEO_SCRUB_END));
      targetTimeRef.current = videoProgress * video.duration;
    });
    return unsub;
  }, [scrollYProgress]);

  // ── RAF lerp: smoothTime → targetTime → video.currentTime ──────────────────
  // Lerp factor 0.14 gives snappy-but-smooth response.
  // Skip tiny corrections (< 2ms) to avoid triggering unnecessary decoder work.
  useEffect(() => {
    if (reducedMotion.current) return;
    let rafId: number;
    const tick = () => {
      const video = videoRef.current;
      if (video && video.duration) {
        smoothTimeRef.current +=
          (targetTimeRef.current - smoothTimeRef.current) * 0.14;
        const next = Math.max(
          0,
          Math.min(video.duration, smoothTimeRef.current)
        );
        if (Math.abs(video.currentTime - next) > 0.002) {
          video.currentTime = next;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Reduced-motion fallback: just loop-play ─────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reducedMotion.current) return;
    video.loop = true;
    video.play().catch(() => {});
  }, []);

  // ── Scroll-driven animation values ─────────────────────────────────────────
  // Blur: starts at max (14px) on entry, clears quickly by 18%, stays at 0 forever after.
  // The last 20% of scroll (after text is gone) is a clean sharp hold — no blur at all.
  const rawBlur   = useTransform(
    scrollYProgress,
    [0, 0.18, 1.0],
    [14,    0,   0]
  );
  const videoFilter = useTransform(rawBlur, (v) => `blur(${v}px)`);

  // Subtle continuous zoom: 1.0 → 1.14 over the full sticky window
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.14]);

  // Title drifts upward and fades out — "goes upwards naturally"
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, TITLE_FADE_START, TITLE_FADE_END],
    [1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, TITLE_FADE_START, TITLE_FADE_END],
    [0, 0, -140]
  );

  return (
    // 550vh wrapper → 100vh sticky panel + 450vh scroll travel
    // Video scrubs over first 73% (~328vh), text gone by 80% (~440vh),
    // leaving ~110vh of clean sharp hold before the section exits
    <div ref={wrapperRef} className="scrollytelling-wrapper" style={{ height: "550vh", position: "relative", backgroundColor: "black", marginTop: "-1px" }}>
      {/* ── Sticky viewport panel ─────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          zIndex: 50,
        }}
      >
        {/* ── Video: scrubs with scroll, then blurs + holds ─────────────── */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            filter: videoFilter,
            scale: videoScale,
            willChange: "transform, filter",
          }}
        >
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          >
            <source
              src="/videos/handset-scrollytelling.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>

        {/* ── Gradient overlay — text legibility at all blur levels ─────── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Title: drifts up and fades, handing focus to the video ────── */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1.5rem",
            opacity: titleOpacity,
            y: titleY,
            willChange: "opacity, transform",
            pointerEvents: "none",
          }}
        >
          <h2
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "clamp(2rem, 5vw, 4.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
            }}
          >
            <span style={{ color: "#ffffff" }}>
              {t("solution.conversational_guide.scrollytelling.label")}
            </span>
            <br />
            <span style={{ color: "#C8DF52" }}>
              {t("solution.conversational_guide.scrollytelling.highlight")}
            </span>
            <br />
            <span style={{ color: "#ffffff" }}>
              {t("solution.conversational_guide.scrollytelling.rest")}
            </span>
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

// ─── PART 2: Static Content Block ────────────────────────────────────────────
function ConversationalGuideStatic() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const traditionalItems = t(
    "solution.conversational_guide.static.traditional.items",
    { returnObjects: true }
  ) as string[];
  const conversationalItems = t(
    "solution.conversational_guide.static.conversational.items",
    { returnObjects: true }
  ) as string[];

  const traditionalIcons = [
    <Radio className="w-4 h-4" />,
    <MessageCircleOff className="w-4 h-4" />,
    <Users className="w-4 h-4" />,
  ];
  const conversationalIcons = [
    <Zap className="w-4 h-4" />,
    <MessageCircle className="w-4 h-4" />,
    <Wand2 className="w-4 h-4" />,
  ];

  const handleScrollToHandset = () => {
    const el = document.getElementById("handset");
    if (el) {
      const navbarHeight = 88;
      const top =
        el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="what-is-conversational-guide"
      className={`py-28 relative ${isLight ? "bg-zinc-50" : "bg-zinc-950/60"}`}
    >
      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,223,82,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(200,223,82,0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="container mx-auto relative z-10 max-w-5xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h2
            className={`text-4xl md:text-6xl font-bold tracking-tighter mb-8 ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            {t("solution.conversational_guide.static.title")}
          </h2>
          <div className="space-y-5 max-w-3xl">
            <p
              className={`text-lg md:text-xl font-light leading-relaxed ${
                isLight ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              {t("solution.conversational_guide.static.para1")}
            </p>
            <p
              className={`text-lg md:text-xl font-light leading-relaxed ${
                isLight ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              {t("solution.conversational_guide.static.para2")}
            </p>
          </div>
        </motion.div>

        {/* Comparison columns */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Left — Traditional */}
          <div
            className={`rounded-3xl p-8 border ${
              isLight
                ? "bg-white border-zinc-200"
                : "bg-zinc-900/50 border-white/8"
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-[0.28em] block mb-6 ${
                isLight ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {t("solution.conversational_guide.static.traditional.label")}
            </span>
            <ul className="space-y-4">
              {traditionalItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-red-400/60 shrink-0">
                    {traditionalIcons[i]}
                  </span>
                  <span
                    className={`text-sm font-light ${
                      isLight ? "text-zinc-500" : "text-zinc-500"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Conversational (highlighted) */}
          <div
            className={`rounded-3xl p-8 border relative overflow-hidden ${
              isLight
                ? "bg-white border-primary/40 shadow-[0_0_0_1px_rgba(200,223,82,0.3),0_8px_32px_-8px_rgba(200,223,82,0.15)]"
                : "bg-zinc-900/50 border-primary/25"
            }`}
          >
            {/* Lime glow at top edge */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-primary block mb-6">
              {t("solution.conversational_guide.static.conversational.label")}
            </span>
            <ul className="space-y-4">
              {conversationalItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-primary shrink-0">
                    {conversationalIcons[i]}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isLight ? "text-zinc-800" : "text-zinc-200"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex justify-center"
        >
          <button
            onClick={handleScrollToHandset}
            className="group inline-flex items-center gap-2 bg-primary !text-black rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all duration-300"
          >
            {t("solution.conversational_guide.static.cta")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function ComparisonCard({ comp, idx }: { comp: any; idx: number }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className={`relative h-full rounded-[2.5rem] overflow-hidden border transition-all duration-700 ${isLight ? "border-zinc-200 hover:border-primary/40 bg-white shadow-lg" : "border-white/10 hover:border-primary/30"}`}>
        {!isLight && <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/95 via-zinc-900/90 to-black" />}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
          <div className="mb-8">
            <span className={`text-[10px] font-black uppercase tracking-[0.25em] block mb-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>{comp.title}</span>
            <ul className="space-y-4">
              {comp.items.map((item: string, i: number) => (
                <li key={i} className={`flex items-start gap-3 text-sm font-light leading-relaxed ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                  <X className="w-3.5 h-3.5 text-red-500/50 mt-1 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative my-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[9px] font-black text-primary uppercase tracking-[0.3em] ${isLight ? "bg-white" : "bg-zinc-900"}`}>vs</div>
          </div>

          <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary block mb-4">{comp.treed_title}</span>
            <ul className="space-y-4">
              {comp.treed_items.map((item: string, i: number) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 text-sm font-medium group-hover:text-primary transition-colors duration-500 leading-relaxed ${isLight ? "text-zinc-800" : "text-white"}`}
                >
                  <Check className="w-3.5 h-3.5 text-primary mt-1 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Solution() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const comparisons = t('solution.comparison_new.comparisons', { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black [overflow-x:clip]">
      <SEO page="solution" />
      <StructuredData page="solution" />
      <Navbar />
<section
  className="solution-hero relative min-h-screen flex items-center"
  style={{ colorScheme: isLight ? "light" : "dark" }}
>
  {/* Hero background image */}
  <img
    src={isLight ? SolutionHeroLight : SolutionHeroDark}
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full object-cover object-center z-0"
  />

  {/* Dark gradient overlay for text readability — lighter in light mode */}
  <div
    aria-hidden="true"
    className={`absolute inset-0 z-10 pointer-events-none ${
      isLight
        ? "bg-gradient-to-b from-white/10 via-transparent to-white/100"
        : "bg-gradient-to-b from-black/65 via-black/45 to-black/70"
    }`}
  />

  <div className="solution-hero-text container mx-auto px-6 relative z-20 pt-40 md:pt-28 lg:pt-24 pb-20 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <span className={`text-primary text-xs uppercase tracking-[0.5em] font-bold mb-8 block`}>{t('solution.hero.label')}</span>
            <h1 className={`text-6xl md:text-8xl font-bold mb-10 leading-[0.9] tracking-tighter ${isLight ? 'text-zinc-900' : 'text-white'}`} data-testid="text-solution-title">
              {t('solution.hero.title1')}<br/>
              <span className="text-gradient-primary">{t('solution.hero.title2')}</span>
            </h1>
            <div className={`text-base md:text-lg max-w-3xl font-light leading-relaxed mb-12 text-balance ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              <p>{t('solution.hero.desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
              {[
                {
                  title: t('solution.hero.boxes.ai.title'),
                  desc: t('solution.hero.boxes.ai.desc')
                },
                {
                  title: t('solution.hero.boxes.multi.title'),
                  desc: t('solution.hero.boxes.multi.desc')
                },
                {
                  title: t('solution.hero.boxes.local.title'),
                  desc: t('solution.hero.boxes.local.desc')
                }
              ].map((box, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="group relative pt-8"
                >
                  <div className="absolute top-0 left-0 w-8 h-[2px] bg-primary transition-all duration-500 group-hover:w-full" />
                  <h3 className={`text-xl font-bold mb-4 group-hover:text-primary transition-colors ${isLight ? 'text-zinc-900' : 'text-white'}`}>{box.title}</h3>
                  <div className={`text-sm leading-relaxed font-light ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{box.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Scrollytelling: What is a Conversational Museum Guide? ── */}
      <ConversationalScrollytelling />

      {/* ── Static Content Block ── */}
      <ConversationalGuideStatic />

      <section id="handset" className="py-24 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t('solution.handset.title')}</h2>
              <p className={`text-lg mb-8 leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                {t('solution.handset.desc')}
              </p>
              <div className="space-y-6 mb-12">
                {[
                  { icon: <Globe className="w-5 h-5" />, title: t('solution.handset.specs.lang.title'), desc: t('solution.handset.specs.lang.desc') },
                  { icon: <Battery className="w-5 h-5" />, title: t('solution.handset.specs.battery.title'), desc: t('solution.handset.specs.battery.desc') },
                  { icon: <Zap className="w-5 h-5" />, title: t('solution.handset.specs.latency.title'), desc: t('solution.handset.specs.latency.desc') }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.01 }}
                    className="flex gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-white/[0.03] transition-colors duration-500 group/item cursor-default"
                  >
                    <div className="text-primary shrink-0 opacity-80 group-hover/item:opacity-100 transition-opacity">{item.icon}</div>
                    <div>
                      <h4 className={`font-bold text-sm transition-colors ${isLight ? "text-zinc-900 group-hover/item:text-zinc-700" : "text-zinc-200 group-hover/item:text-white"}`}>{item.title}</h4>
                      <p className="text-zinc-500 text-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link href="/handset">
                <Button className="group bg-primary !text-black rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all">
                  {t('solution.handset.cta')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <Link href="/handset" className="hidden md:block">
  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group">
    <img
      src={Both_low_light_mood_close_up_dramatic}
      alt="Tree'd screen-free AI museum audio guide handset device"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  </div>
</Link>
          </div>
        </div>
      </section>
      <section id="tree" className="py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <Link href="/tree" className="hidden md:block order-2 md:order-1">
  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group">
    <img
      src={very_low_lighting}
      alt="Tree'd central audio guide hub that distributes content to museum handsets"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  </div>
</Link>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6">{t('solution.tree.title')}</h2>
              <p className={`text-lg mb-8 leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                {t('solution.tree.desc')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-12">
                {[
                  { icon: <Unplug className="w-5 h-5" />, title: t('solution.tree.specs.charging') },
                  { icon: <Database className="w-5 h-5" />, title: t('solution.tree.specs.storage') },
                  { icon: <Server className="w-5 h-5" />, title: t('solution.tree.specs.local') },
                  { icon: <Palette className="w-5 h-5" />, title: t('solution.tree.specs.custom') }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center gap-3 hover:bg-white/[0.03] transition-all duration-500 group/tree cursor-default"
                  >
                    <div className="text-primary shrink-0 opacity-80 group-hover/tree:opacity-100 transition-opacity">{item.icon}</div>
                    <span className={`text-sm font-bold transition-colors ${isLight ? "text-zinc-900 group-hover/tree:text-zinc-700" : "text-zinc-200 group-hover/tree:text-white"}`}>{item.title}</span>
                  </motion.div>
                ))}
              </div>
              <Link href="/tree">
                <Button className="group bg-primary !text-black rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all">
                  {t('solution.tree.cta')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section id="dashboard" className="py-24 bg-zinc-950/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t('solution.dashboard.title')}</h2>
              <p className={`text-lg mb-8 leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                {t('solution.dashboard.desc')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-12">
                {[
                  { icon: <Gauge className="w-5 h-5" />, title: t('solution.dashboard.specs.trends') },
                  { icon: <Languages className="w-5 h-5" />, title: t('solution.dashboard.specs.mix') },
                  { icon: <Activity className="w-5 h-5" />, title: t('solution.dashboard.specs.health') },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: t('solution.dashboard.specs.privacy') }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center gap-3 hover:bg-white/[0.03] transition-all duration-500 group/dash cursor-default"
                  >
                    <div className="text-primary shrink-0 opacity-80 group-hover/dash:opacity-100 transition-opacity">{item.icon}</div>
                    <span className={`text-sm font-bold transition-colors ${isLight ? "text-zinc-900 group-hover/dash:text-zinc-700" : "text-zinc-200 group-hover/dash:text-white"}`}>{item.title}</span>
                  </motion.div>
                ))}
              </div>
              <Link href="/dashboard">
                <Button className="group bg-primary !text-black rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all">
                  {t('solution.dashboard.cta')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <Link href="/dashboard" className="hidden md:block">
  <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group">
    <img
      src={Dashboard}
      alt="Tree'd museum analytics dashboard showing visitor engagement and language insights"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  </div>
</Link>
          </div>
        </div>
      </section>

      {/* Moved Static Comparison Section */}
      <section id="comparison" className="py-32 relative bg-zinc-950/20">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,223,82,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,223,82,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(200,223,82,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-4 ${isLight ? "text-foreground" : "text-white"}`}>
              {t('solution.comparison_new.why_different.title')}
            </h2>
            <p className="text-zinc-500 text-lg font-light max-w-2xl mx-auto">
              {t('solution.comparison_new.why_different.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {comparisons.map((comp, idx) => (
              <ComparisonCard
                key={idx}
                comp={comp}
                idx={idx}
              />
            ))}
          </div>

          <div className="text-center flex flex-wrap justify-center gap-4">
            <Link href="/visitor-experience">
              <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
                <Button
                  variant="ghost"
                  className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors"
                  data-testid="link-visitor-journey"
                >
                  {t('solution.comparison_new.cta')}
                </Button>
              </motion.div>
            </Link>
            <Link href="/use-cases">
              <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
                <Button
                  variant="ghost"
                  className={`rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 ${
                    isLight
                      ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
                      : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                  data-testid="link-explore-use-cases"
                >
                  {t('buttons.exploreUseCases')}
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      <section id="revenue" className="py-24 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center p-12 rounded-[3rem] border
            ${isLight ? 'bg-white border-zinc-200' : 'bg-gradient-to-br from-zinc-900/50 to-primary/5 border-white/5'}`}>
            <div>
              <span className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-6 block">{t('solution.revenue.label')}</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">{t('solution.revenue.title')} <span className="text-primary">{t('solution.revenue.subtitle')}</span></h2>
              <p className={`text-base md:text-xl font-light leading-relaxed mb-4 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`} dangerouslySetInnerHTML={{ __html: t('solution.revenue.desc') }} />
              <p className={`hidden md:block text-xl font-light leading-relaxed mb-8 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`} dangerouslySetInnerHTML={{ __html: t('solution.revenue.desc2') }} />
              <Link href="/revenue-sharing">
                <Link href="/revenue-sharing"
                  className="inline-flex items-center text-primary font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/revenue">
  {t('solution.revenue.cta')}
  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/revenue:translate-x-1" />
</Link>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {(t('solution.revenue.models', { returnObjects: true }) as any[]).map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 20 }}
                  className={`p-6 rounded-2xl border backdrop-blur-xl group/model cursor-default relative overflow-hidden
                    ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-black/40 border-white/5'}`}
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover/model:scale-y-100 transition-transform duration-500 origin-bottom"></div>
                  <h4 className={`font-bold mb-2 group-hover/model:text-primary transition-colors ${isLight ? 'text-zinc-800' : 'text-white'}`}>{item.title}</h4>
                  <p className={`text-sm transition-colors ${isLight ? 'text-zinc-500 group-hover/model:text-zinc-700' : 'text-zinc-500 group-hover/model:text-zinc-300'}`}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
