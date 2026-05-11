import { useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Battery, Globe, Zap, Mic, Volume2, ShieldCheck, MousePointer2, Scan, MessageSquare, Sparkles, EyeOff, Radio, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import ExplodedView from "@/components/handset/ExplodedView";
import FeatureHighlights from "@/components/handset/FeatureHighlights";
import FormFactors from "@/components/handset/FormFactors";
import { SEO, StructuredData } from "@/components/SEO";

import ESP_cross from "@assets/ESP cross.png";
import StatueAI from "@assets/Statue_AI_Talking_1768514552464.png";

import Statue from "@assets/Statue.png";
// ─── Hero background image ───────────────────────────────────────────────────
// Drop your file here:  attached_assets/handset-hero.png
// Recommended: 16:9, minimum 1920×1080 px
// To try a different image just replace the file — no other changes needed.
import HeroBackground from "@assets/handset-hero.png";

// ─── Timing constants (mirror Solution.tsx scrollytelling) ───────────────────
const H_VIDEO_SCRUB_END  = 0.73; // video reaches last frame at this scroll progress
const H_TITLE_FADE_START = 0.18; // heading starts drifting upward very early
const H_TITLE_FADE_END   = 0.32; // heading fully gone — handset owns the majority

// ─── Handset 180° scrollytelling ─────────────────────────────────────────────
function HandsetRotateScrollytelling() {
  const { t } = useTranslation();
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const smoothTimeRef = useRef(0);
  // Seek-gating: never queue a new seek while the decoder is still busy.
  // Without this, the two concurrent scroll animations on this page cause
  // the video decoder to congest and produce visible choppiness.
  const seekingRef    = useRef(false);

  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  // Scroll → target video time
  useEffect(() => {
    if (reducedMotion.current) return;
    const unsub = scrollYProgress.on("change", (progress) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;
      const vp = Math.min(1, Math.max(0, progress / H_VIDEO_SCRUB_END));
      targetTimeRef.current = vp * video.duration;
    });
    return unsub;
  }, [scrollYProgress]);

  // Seek-gate: clear the lock as soon as the browser finishes each seek
  useEffect(() => {
    if (reducedMotion.current) return;
    const video = videoRef.current;
    if (!video) return;
    const onSeeked = () => { seekingRef.current = false; };
    video.addEventListener("seeked", onSeeked);
    return () => video.removeEventListener("seeked", onSeeked);
  }, []);

  // RAF lerp → video.currentTime (gated — skip if decoder is still busy)
  useEffect(() => {
    if (reducedMotion.current) return;
    let rafId: number;
    const tick = () => {
      const video = videoRef.current;
      if (video && video.duration) {
        smoothTimeRef.current +=
          (targetTimeRef.current - smoothTimeRef.current) * 0.14;
        const next = Math.max(0, Math.min(video.duration, smoothTimeRef.current));
        if (!seekingRef.current && Math.abs(video.currentTime - next) > 0.005) {
          seekingRef.current = true;
          video.currentTime = next;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Reduced-motion fallback: loop-play
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reducedMotion.current) return;
    video.loop = true;
    video.play().catch(() => {});
  }, []);

  // Blur: 14px on entry → clears by 18% → stays 0 (clean sharp hold at end)
  const rawBlur     = useTransform(scrollYProgress, [0, 0.18, 1.0], [14, 0, 0]);
  const videoFilter = useTransform(rawBlur, (v) => `blur(${v}px)`);

  // Subtle zoom: 1.0 → 1.12 over full sticky window
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12]);

  // Title drifts upward and fades — handing focus to the product
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, H_TITLE_FADE_START, H_TITLE_FADE_END],
    [1, 1, 0]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, H_TITLE_FADE_START, H_TITLE_FADE_END],
    [0, 0, -140]
  );

  return (
    // 550vh: video scrubs over first 73% (~400vh), heading gone by 80% (~440vh),
    // leaving ~110vh of clean sharp hold before the section exits
    <div ref={wrapperRef} style={{ height: "550vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Video: scrubs with scroll, then holds sharp */}
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
            <source src="/videos/handset-180.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Overlay — legibility across all blur levels */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0.52) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Heading: drifts upward and fades, revealing the handset */}
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
              fontSize: "clamp(2.4rem, 6vw, 5.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              textAlign: "center",
              margin: 0,
            }}
          >
            <span style={{ color: "#ffffff" }}>
              {t("handset.rotate_scrollytelling.label")}
            </span>
            <br />
            <span style={{ color: "#C8DF52" }}>
              {t("handset.rotate_scrollytelling.highlight")}
            </span>
            <br />
            <span style={{ color: "#ffffff" }}>
              {t("handset.rotate_scrollytelling.rest")}
            </span>
          </h2>
        </motion.div>

      </div>
    </div>
  );
}

export default function Handset() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const specs = [
    { 
      icon: (
        <div className="relative group/battery-spec">
          <Battery className="w-6 h-6 transition-colors group-hover:text-primary" />
          <motion.div 
            initial={{ height: 0 }}
            whileHover={{ height: '70%' }}
            className="absolute bottom-1 left-1.5 right-1.5 bg-primary/40 rounded-sm pointer-events-none transition-all duration-500"
          />
        </div>
      ), 
      title: t('handset.capabilities.items.battery.title'), 
      desc: t('handset.capabilities.items.battery.desc') 
    },
    { icon: <Zap className="w-6 h-6" />, title: t('handset.capabilities.items.latency.title'), desc: t('handset.capabilities.items.latency.desc') },
    { icon: <Globe className="w-6 h-6" />, title: t('handset.capabilities.items.lang.title'), desc: t('handset.capabilities.items.lang.desc') },
    { icon: <ShieldCheck className="w-6 h-6" />, title: t('handset.capabilities.items.privacy.title'), desc: t('handset.capabilities.items.privacy.desc') }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black overflow-x-clip">
      <SEO page="handset" />
      <StructuredData page="handset" />
      <Navbar />
      {/* ─── Hero Section — 16:9 background image ───────────────────────────────
           To swap the image: drop your file into client/public/images/
           and name it exactly:  handset-hero.jpg
           (also accepts .jpeg / .png / .webp — update HERO_BG at the top of
           this file to match the extension if you use a different format)
       ──────────────────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden handset-hero-section"
        style={{
          aspectRatio: "16 / 9",
          backgroundColor: "#0f0f0f",
          /* Force dark-mode font rendering inside this section regardless of page theme.
             Inline style beats the .light { color-scheme: light } class rule (no !important there).
             This is the correct fix — the section sits on a dark image so dark rendering is right. */
          colorScheme: "dark",
        }}
      >
        {/* Background image — absolutely positioned, same pattern as the scrollytelling video.
             Mobile: object-right shows the right side of the image (where the handset is).
             Desktop (md+): object-center for balanced composition. */}
        <img
          src={HeroBackground}
          alt=""
          aria-hidden="true"
          className="object-center"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Light-mode navbar cover — white bar that sits behind the transparent navbar
             so the navbar looks correct over the dark hero image in light mode. */}
        {isLight && (
          <div
            aria-hidden="true"
            className="handset-hero-navbg absolute top-0 left-0 right-0 pointer-events-none"
            style={{ backgroundColor: "#ffffff", zIndex: 5 }}
          />
        )}

        {/* Left-to-right gradient overlay — keeps text readable at all times */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.58) 42%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        {/* Bottom fade — blends into the rest of the page */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "120px",
            background: "linear-gradient(to bottom, transparent 0%, #050505 100%)",
          }}
        />

        {/* ── Content ── */}
        <div
          className="relative z-10 h-full container mx-auto flex items-center handset-hero-padding"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-left handset-hero-text"
          >
            <span className="inline-block px-4 py-1 rounded-full border border-primary/30 text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-6">
              {t("handset.hero.label")}
            </span>

            <h1
              className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]"
              data-testid="text-handset-title"
            >
              {t("handset.hero.title1")}
              <br />
              <span className="text-gradient-primary">{t("handset.hero.title2")}</span>
            </h1>

            <div className="text-base md:text-lg text-zinc-300 font-light max-w-2xl leading-relaxed mb-12">
              <p className="handset-hero-desc">{t("handset.hero.desc")}</p>
            </div>

            <div className="flex gap-4">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-primary !text-black hover:bg-primary/90 rounded-full px-10 h-14 font-bold text-sm uppercase tracking-widest cursor-pointer transition-colors group"
                >
                  {t("nav.bookDemo")}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Floating Specs Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden items-center"
          >
            <div className="p-12 text-center bg-[#050505] rounded-2xl">
              <div className="text-5xl font-bold text-primary mb-2">{t('handset.specs.lang.val')}</div>
              <div className="text-zinc-500 text-xs uppercase tracking-widest font-bold">{t('handset.specs.lang.label')}</div>
            </div>
            <div className="p-12 text-center bg-[#050505] relative group rounded-[0.875rem] border border-white/5 cursor-pointer overflow-visible">
              {/* Battery Progress Bar */}
              <div className="absolute inset-2 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 flex items-center">
                <div 
                  className="h-full bg-[#C8DF52] w-0 group-hover:w-full transition-all duration-[5000ms] group-hover:duration-[300ms] ease-in-out relative shadow-[0_0_20px_rgba(200,223,82,0.3)]"
                >
                  <div className="absolute inset-0 bg-white/20 blur-sm"></div>
                </div>
                
                {/* Visual Battery Markers */}
                <div className="absolute inset-0 flex items-center justify-around pointer-events-none px-2 z-20">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-px h-1/2 bg-white/30" />
                  ))}
                </div>
              </div>

              {/* Battery Tip (Bump) */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2 h-8 bg-zinc-800 rounded-r-md border-r border-white/20 z-10 group-hover:bg-[#C8DF52] transition-colors duration-300"></div>
              
              <div className="relative z-30 pointer-events-none transition-colors duration-300">
                <div className={`text-4xl font-bold mb-2 drop-shadow-sm leading-tight group-hover:text-black transition-colors duration-300 ${isLight ? "text-zinc-900" : "text-white/90"}`}>{t('handset.specsPage.battery.val')}</div>
<div className={`text-xs uppercase tracking-widest font-bold transition-all duration-300 ${isLight ? "text-zinc-700 opacity-100" : "text-white/80 opacity-80"} group-hover:text-black group-hover:opacity-100`}>{t('handset.specsPage.battery.label')}</div>
              </div>
            </div>
            <div className="p-12 text-center bg-[#050505] rounded-2xl">
              <div className="text-5xl font-bold text-primary mb-2">{t('handset.specs.latency.val')}<span className="text-3xl">{t('handset.specs.latency.unit')}</span></div>
              <div className="text-zinc-500 text-xs uppercase tracking-widest font-bold">{t('handset.specs.latency.label')}</div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Exploded View Section */}
      <ExplodedView />
      {/* Intelligence inside Section */}
      <section className="py-32 bg-zinc-950/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="flex-1"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">{t('handset.internal.title')}</h2>
              <p className="text-lg mb-12 leading-relaxed desc-neutral">
                {t('handset.internal.desc')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl group hover:border-transparent transition-all relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                     <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-white">{t('handset.internal.dialogue.title')}</h4>
                     <p className="text-sm leading-relaxed group-hover:text-zinc-300 transition-colors desc-neutral">{t('handset.internal.dialogue.desc')}</p>
                   </div>
                </div>
                
                <div className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl group hover:border-primary/20 transition-all">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <EyeOff className="w-6 h-6" />
                   </div>
                   <h4 className="text-xl font-bold mb-3 text-white">{t('handset.internal.presence.title')}</h4>
                   <p className="text-sm leading-relaxed desc-neutral">{t('handset.internal.presence.desc')}</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="flex-1"
            >
              <div className="rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                <div className="absolute inset-0 bg-black/60 z-10 transition-opacity duration-500 group-hover:bg-black/40"></div>
                <img src={ESP_cross} alt="Internal microchip inside the Tree’d AI museum audio guide handset" className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Form Factors Section */}
      <FormFactors />
      {/* Interaction Design Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,223,82,0.05),transparent_50%)]"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-24 items-center">
            
            <div className="flex-1 relative group order-2 md:order-1 hidden md:block">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="relative z-10 rounded-[3rem] overflow-hidden aspect-square border border-white/5 bg-zinc-900/50 shadow-2xl">
                <img 
                  src={StatueAI} 
                  alt="Museum visitor experience concept showing classical statue using Tree’d AI audio guide"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute top-6 left-6 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center font-black text-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="flex-1 order-1 md:order-2">
              <span className="text-primary text-xs uppercase tracking-[0.4em] font-bold mb-6 block">{t('handset.interaction.title')}</span>
              
              <div className="mb-14 relative pl-8 border-l-2 border-primary/30">
                <p className="text-4xl md:text-6xl font-light leading-[1.1] text-white">
                  {t('handset.interaction.quote')}
                </p>
              </div>
              
              <p className="text-xl font-light mb-12 leading-relaxed max-w-lg desc-neutral">
                {t('handset.interaction.desc')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-primary/20 hover:bg-zinc-900/80 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-black">
                    <Radio className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-white">{t('handset.interaction.tap.title')}</h4>
                  <p className="text-sm desc-neutral">{t('handset.interaction.tap.desc')}</p>
                </div>

                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-primary/20 hover:bg-zinc-900/80 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-black overflow-hidden">
                    <motion.div
                      whileHover={{ 
                        scale: [1, 1.2, 1],
                        transition: { repeat: Infinity, duration: 0.5 }
                      }}
                    >
                      <Volume2 className="w-6 h-6" />
                    </motion.div>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-white">{t('handset.interaction.audio.title')}</h4>
                  <p className="text-sm desc-neutral">{t('handset.interaction.audio.desc')}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* 180° Scrollytelling — "Designed to be held" */}
      <HandsetRotateScrollytelling />

      {/* Capabilities Grid */}
      <section className="py-32 bg-zinc-950/50">
        <div className="container mx-auto">
          <div className="max-w-2xl mb-20">
            <h2 className="text-4xl font-bold mb-6">{t('handset.capabilities.title')}</h2>
            <p className="text-lg desc-neutral">{t('handset.capabilities.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specs.map((spec, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2.5rem] border transition-all ${isLight ? "bg-zinc-100 border-zinc-200 hover:border-primary/40" : "bg-zinc-900/40 border-white/5 hover:border-primary/20"}`}
              >
                <div className="text-primary mb-6">{spec.icon}</div>
                <h4 className={`text-xl font-bold mb-3 ${isLight ? "text-zinc-900" : "text-white"}`}>{spec.title}</h4>
                <p className={`text-sm leading-relaxed desc-neutral ${!isLight && "text-zinc-500"}`}>{spec.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <FeatureHighlights />
      {/* Final CTA Section - Completely Redesigned & Unique */}
      <section className="py-32 relative overflow-hidden bg-zinc-950">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(200,223,82,0.05),transparent_50%)]"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[4rem] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700"></div>
            
            <div className="relative z-10 text-center md:text-left">
             <span
  className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 block"
  style={{ color: isLight ? '#4d6012' : '#c8df52' }}
>
  {t('handset.hero.label')}
</span>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
  {t('handset.cta.title')}
</h2>
<p className="text-sm md:text-xl mb-12 max-w-2xl font-light leading-relaxed desc-neutral">
  {t('handset.cta.desc')}
</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking" className="inline-flex w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold transition-colors shadow-xl group">
                    {t('handset.cta.btn')} <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
                <Link href="/request-pricing" className="inline-flex w-full sm:w-auto">
  <Button
    size="lg"
    variant="ghost"
    className={`w-full sm:w-auto rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 ${
      isLight
        ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
        : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
    }`}
  >
    {t('handset.cta.btnSecondary')}
  </Button>
</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
