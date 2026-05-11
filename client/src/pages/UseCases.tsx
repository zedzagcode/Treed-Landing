import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { SEO, StructuredData } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowRight, Clock, BookOpen, Smile, Zap, Frown, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
// ─── Museum type images (UseCases pentagon section) ──────────────────────────
import imgHighTraffic from "@assets/high-traffic-museum.png";
import imgArtMuseum   from "@assets/art-museum.png";
import imgSciMuseum   from "@assets/science-museum.png";
import imgPrivMuseum  from "@assets/history-museum.png";
import imgTempExh     from "@assets/temporary-exhibition.png";

// ─── Sound Familiar card images ───────────────────────────────────────────────
import imgRevenue    from "@assets/increase-revenue-per-visitor.png";
import imgExperience from "@assets/deliver-a-new-kind-of-experience.png";
import imgLanguage   from "@assets/expand-language-coverage.png";
import imgAgeGroup   from "@assets/adapt-to-every-age-group.png";
import imgLearning   from "@assets/go-beyond-surface-level-learning.png";
import imgExhibition from "@assets/keep-up-with-changing-exhibitions.png";
import imgEngagement from "@assets/increase-visitor-engagement.png";
import imgCollection from "@assets/unlock-more-of-your-collection.png";
import imgBehavior   from "@assets/understand-visitor-behavior.png";


// ─── Types ────────────────────────────────────────────────────────────────────
interface CaseItem    { number: string; shortTitle: string; typeSuffix: string; title: string; problem: string; solution: string; outcome: string; }
interface ImpactItem  { title: string; description: string; }
interface FitItem     { number: string; title: string; description: string; }
interface BeforeAfter { label: string; lines: string[]; }
interface PanelLabels { challenges: string; solution: string; result: string; }

const IMPACT_ICONS = [
  <TrendingUp className="w-5 h-5" />, // Revenue
  <Smile      className="w-5 h-5" />, // Satisfaction
  <Clock      className="w-5 h-5" />, // Time
  <BookOpen   className="w-5 h-5" />, // Explored
  <Zap        className="w-5 h-5" />, // Operational
];

// Pentagon geometry — elliptical: wider horizontally, shorter vertically
// CX/CY = centre, RX/RY = horizontal/vertical spoke radii, SW/SH = container size
const CX = 190, CY = 128, RX = 120, RY = 76, SW = 380, SH = 258;
function getPt(i: number, total: number) {
  const a = ((-90 + i * (360 / total)) * Math.PI) / 180;
  return { x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY };
}

// Museum images — order matches useCases.cases.items in en.json
// 01 High-Traffic, 02 Art, 03 Science & Ed., 04 Private, 05 Temporary
const CASE_IMAGES = [imgHighTraffic, imgArtMuseum, imgSciMuseum, imgPrivMuseum, imgTempExh];

// ─── Liquid green hero shape — subtle organic blobs ───────────────────────────
function GreenShape() {
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[380px] lg:min-h-[460px]" aria-hidden>
      {/* Outermost ambient haze */}
      <div className="absolute w-[380px] h-[380px] rounded-full bg-primary/8 blur-[100px]" />

      {/* Large morphing blob — slow, liquid */}
      <motion.div
        className="absolute w-[280px] h-[280px]"
        style={{ background: "radial-gradient(circle at 45% 42%, rgba(200,223,82,0.18), rgba(200,223,82,0.04) 70%)" }}
        animate={{
          borderRadius: [
            "62% 38% 30% 70% / 58% 32% 68% 42%",
            "38% 62% 68% 32% / 42% 68% 32% 58%",
            "70% 30% 42% 58% / 30% 58% 42% 68%",
            "62% 38% 30% 70% / 58% 32% 68% 42%",
          ],
          scale: [1, 1.07, 0.96, 1],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Medium blob — counter-phase, slight drift */}
      <motion.div
        className="absolute w-[200px] h-[200px]"
        style={{ background: "radial-gradient(circle at 58% 55%, rgba(200,223,82,0.16), transparent 68%)" }}
        animate={{
          borderRadius: [
            "42% 58% 66% 34% / 52% 42% 58% 48%",
            "58% 42% 34% 66% / 40% 62% 46% 54%",
            "42% 58% 66% 34% / 52% 42% 58% 48%",
          ],
          x: [0, 18, -10, 0],
          y: [0, -14, 12, 0],
          scale: [1, 0.93, 1.06, 1],
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner glow core — softly pulsing */}
      <motion.div
        className="absolute w-[100px] h-[100px] rounded-full bg-primary/35"
        style={{ filter: "blur(14px)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bright centre point */}
      <motion.div
        className="absolute w-[22px] h-[22px] rounded-full bg-primary"
        style={{ boxShadow: "0 0 24px rgba(200,223,82,0.7), 0 0 60px rgba(200,223,82,0.2)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── HERO — centred ─────────────────────────────────────────────────────────
function Hero() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [wordIdx, setWordIdx] = useState(0);
  const words = t("useCases.hero.rotatingWords", { returnObjects: true }) as string[];
  const isFrench = i18n.language === "fr";

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <section
      className={`relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden ${isLight ? "bg-background" : ""}`}
      style={isLight ? {} : { backgroundColor: "#050505" }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {!isLight && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,223,82,0.04)_0%,transparent_55%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
          </>
        )}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ backgroundColor: isLight ? "rgba(200,223,82,0.07)" : "rgba(200,223,82,0.05)" }}
        />
      </div>

      <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className={`inline-block px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.3em] font-bold mb-10 backdrop-blur-md ${
            isLight ? "border-zinc-300 bg-zinc-100 text-zinc-500" : "border-white/10 bg-white/5 text-zinc-400"
          }`}
        >
          {t("useCases.hero.eyebrow")}
        </motion.span>

        {/* h1 — Space Grotesk via global font-heading base rule */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-black tracking-tighter leading-none mb-12 text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block text-zinc-500">{t("useCases.hero.preText")}</span>

          {/* Pill + rotating word + EXPERIENCE — on the same line */}
          <span className="inline-flex items-center justify-center gap-3 sm:gap-4 my-1 flex-wrap" aria-live="polite" aria-atomic="true">
            <span className="relative inline-flex items-center" style={{ verticalAlign: "bottom" }}>
              <span aria-hidden className="absolute inset-0 rounded-full border border-primary/50 pointer-events-none"
                style={{ boxShadow: "0 0 14px rgba(200,223,82,0.18)" }} />
              <span className={`relative inline-block overflow-hidden px-5 sm:px-7 ${isFrench ? "py-2.5 sm:py-3" : "py-1"}`} style={{ lineHeight: isFrench ? 1.35 : 1.15 }}>
                <span aria-hidden className="invisible font-black tracking-tighter block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  {isFrench ? "COMMISSAIRE" : "EDUCATOR"}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%",   opacity: 1 }}
                    exit={{   y: "-110%", opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute inset-0 flex items-center justify-center text-primary font-black tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                  >
                    {words[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
            <span className={`font-black tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl ${isLight ? "text-zinc-900" : "text-white"}`}>
              {t("useCases.hero.experienceText")}
            </span>
          </span>

          <span className="block text-zinc-500">{t("useCases.hero.postText")}</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          className={`text-lg md:text-xl max-w-xl mb-12 font-light leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
        >
          {t("useCases.hero.subtext")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link href="/booking">
            <Button size="lg" className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal group transition-colors duration-300">
              {t("useCases.hero.ctaPrimary")}
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.span>
            </Button>
          </Link>
          <Link href="/request-pricing">
            <Button variant="ghost" size="lg"
              className={`rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 ${
                isLight ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
                        : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {t("useCases.hero.ctaSecondary")}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 1.2 }}
        className="mt-20 flex flex-col items-center pointer-events-none" aria-hidden
      >
        <div className="w-[2px] h-16 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent rounded-full shadow-[0_0_16px_rgba(200,223,82,0.3)]" />
      </motion.div>
    </section>
  );
}

// ─── USE CASES — Single grid: [heading+image+arrows | pentagon+panel] ───────────
function UseCasesSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const cases       = t("useCases.cases.items",       { returnObjects: true }) as CaseItem[];
  const panelLabels = t("useCases.cases.panelLabels", { returnObjects: true }) as PanelLabels;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = cases[activeIdx];
  const pts    = cases.map((_, i) => getPt(i, cases.length));
  const n      = cases.length;

  const goTo = (idx: number) => setActiveIdx(((idx % n) + n) % n);

  const glassBtn: React.CSSProperties = {
    background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: isLight ? "1px solid rgba(0,0,0,0.10)" : "1px solid rgba(255,255,255,0.14)",
    boxShadow: isLight ? "0 4px 16px rgba(0,0,0,0.07)" : "0 4px 20px rgba(0,0,0,0.35)",
  };

  // Very subtle gradient — barely-there tint, not a bold gradient
  const sectionBg = isLight
    ? "linear-gradient(145deg, #f6f9f3 0%, #f9f9f9 55%, #f4f4f8 100%)"
    : "linear-gradient(145deg, #07090d 0%, #050505 50%, #060a07 100%)";

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ background: sectionBg }}
    >
      {/* Ambient glow accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_75%_60%,rgba(200,223,82,0.04),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto relative z-10">

        {/*
          Two-row layout — solves the vertical alignment problem:
          Row 1 (items-start): heading sits at the same top edge as the pentagon.
          Row 2 (items-center): image and panel text share the same vertical centre line.
          The gap between rows provides breathing room between pentagon and panel.
        */}

        {/* ── Row 1: heading (left) | pentagon (right) — tops aligned ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start mb-10 md:mb-14">

          {/* Section heading */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-6 block"
            >
              {t("useCases.cases.eyebrow")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-5xl md:text-7xl font-bold tracking-tighter leading-none ${isLight ? "text-zinc-900" : "text-white"}`}
            >
              {t("useCases.cases.title")}
            </motion.h2>
          </div>

          {/* Pentagon lives in row 1, right column */}
          <div className="flex flex-col gap-10">
            <div className="hidden md:flex items-start justify-center">
              <div className="relative flex-shrink-0" style={{ width: SW, height: SH }}>
                <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH}
                  style={{ position: "absolute", inset: 0, display: "block" }}>
                  <ellipse cx={CX} cy={CY} rx={RX + 14} ry={RY + 9}
                    stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
                  {pts.map((p, i) => (
                    <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y}
                      stroke={isLight ? "#d4d4d8" : "#27272a"} strokeWidth="1" strokeDasharray="3 6" />
                  ))}
                  <motion.line x1={CX} y1={CY}
                    animate={{ x2: pts[activeIdx].x, y2: pts[activeIdx].y }} initial={false}
                    stroke="#C8DF52" strokeWidth="1.8" strokeLinecap="round"
                    transition={{ type: "spring", stiffness: 260, damping: 28 }} />
                  <circle cx={CX} cy={CY} r="20" stroke="#C8DF52" strokeWidth="1"
                    fill="rgba(200,223,82,0.07)" strokeOpacity="0.4" />
                  <circle cx={CX} cy={CY} r="5" fill="#C8DF52" fillOpacity="0.75" />
                </svg>
                <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
                  {cases.map((c, i) => {
                    const isActive = i === activeIdx;
                    return (
                      <div key={i} style={{
                        position: "absolute",
                        left: `${(pts[i].x / SW) * 100}%`,
                        top:  `${(pts[i].y / SH) * 100}%`,
                        transform: "translate(-50%,-50%)",
                      }}>
                        <motion.button onClick={() => goTo(i)} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
                          <div className={`px-3 py-2.5 rounded-2xl border text-center transition-all duration-300 ${
                            isActive ? "border-primary/50"
                              : isLight ? "border-zinc-200 bg-white hover:border-primary/30"
                                        : "border-white/10 bg-zinc-900/90 hover:border-primary/30"
                          }`} style={{
                            minWidth: "80px", maxWidth: "104px",
                            ...(isActive ? {
                              background: isLight ? "rgba(248,248,248,0.96)" : "rgba(12,14,10,0.92)",
                              backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                              boxShadow: isLight
                                ? "0 0 24px rgba(200,223,82,0.15), inset 0 0 0 1px rgba(200,223,82,0.2)"
                                : "0 0 24px rgba(200,223,82,0.2), inset 0 0 0 1px rgba(200,223,82,0.15)",
                            } : {}),
                          }}>
                            {/* Card number */}
                            <div className="text-[9px] font-mono mb-1 font-bold"
                              style={{ color: isActive ? "#C8DF52" : "#52525b" }}>{c.number}</div>
                            {/* Type descriptor — first line, styled per active state */}
                            <div className={`text-[10px] font-bold leading-tight transition-colors duration-300 ${
                              isActive ? "text-primary" : isLight ? "text-zinc-700" : "text-zinc-300"
                            }`}>{c.shortTitle}</div>
                            {/* "Museum" / "Exhibition" — second line, always static & muted */}
                            <div className="text-[9px] font-medium text-zinc-400 mt-0.5 leading-tight">
                              {c.typeSuffix}
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: image + arrows (left) | panel text (right) — centres aligned ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left: frameless image + arrows + mobile pills */}
          <div className="flex flex-col gap-6">

            {/*
              Frameless image — no bg, no border, no rounding.
              Cross-dissolve: both images stack and overlap simultaneously.
              Scale barely moves (1.2%) — enough to feel alive but imperceptible as zoom.
            */}
            <div className="relative w-full" style={{ height: 400 }}>
              <AnimatePresence>
                <motion.img
                  key={activeIdx}
                  src={CASE_IMAGES[activeIdx]}
                  alt={cases[activeIdx].title}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ objectPosition: "center center" }}
                  initial={{ opacity: 0, scale: 1.012 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{   opacity: 0, scale: 0.988 }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  loading="lazy"
                />
              </AnimatePresence>
            </div>

            {/* Liquid-glass chevron arrows */}
            <div className="flex items-center gap-3">
              <motion.button onClick={() => goTo(activeIdx - 1)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={glassBtn} aria-label="Previous museum type">
                <ChevronLeft className={`w-4 h-4 ${isLight ? "text-zinc-700" : "text-white"}`} />
              </motion.button>
              <motion.button onClick={() => goTo(activeIdx + 1)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={glassBtn} aria-label="Next museum type">
                <ChevronRight className={`w-4 h-4 ${isLight ? "text-zinc-700" : "text-white"}`} />
              </motion.button>
            </div>

            {/* Mobile pills */}
            <div className="flex flex-wrap gap-3 justify-start md:hidden">
              {cases.map((c, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all duration-300 ${
                    i === activeIdx
                      ? "border-primary bg-primary/10 text-primary"
                      : isLight ? "border-zinc-200 bg-white text-zinc-600" : "border-white/10 bg-zinc-900/60 text-zinc-400"
                  }`}>
                  <span className="text-[10px] font-mono mr-2">{c.number}</span>{c.shortTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Right: panel text only — pentagon is in Row 1 above */}
          <div className="w-full">

            {/*
              Two-line heading:
              · Line 1 (shortTitle) — animates on case switch (fade in/out)
              · Line 2 (typeSuffix: "Museum" / "Exhibition") — always static, never animates
                Same treatment as "COMMON CHALLENGES" — a label, not content.
            */}
            <h3 className={`text-3xl md:text-4xl xl:text-5xl font-bold tracking-tighter leading-none mb-7 ${isLight ? "text-zinc-900" : "text-white"}`}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`t-${activeIdx}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="block"
                >
                  {active.shortTitle}
                </motion.span>
              </AnimatePresence>
              {/* Static — does not participate in the case-switch animation */}
              <span className="block">{active.typeSuffix}</span>
            </h3>

            <p className={`text-[10px] uppercase tracking-[0.35em] font-bold mb-3 ${isLight ? "!text-[#4d6012]" : "!text-[#C8DF52]"}`}>{panelLabels.challenges}</p>
            <AnimatePresence mode="wait">
              <motion.p key={`c-${activeIdx}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className={`text-base md:text-lg font-light leading-relaxed mb-7 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}
              >
                {active.problem}
              </motion.p>
            </AnimatePresence>

            <div className="w-full h-px mb-7"
              style={{ backgroundColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }} />

            <p className={`text-[10px] uppercase tracking-[0.35em] font-bold mb-3 ${isLight ? "!text-[#4d6012]" : "!text-[#C8DF52]"}`}>{panelLabels.solution}</p>
            <AnimatePresence mode="wait">
              <motion.p key={`s-${activeIdx}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className={`text-base md:text-lg font-light leading-relaxed mb-7 ${isLight ? "text-zinc-600" : "text-zinc-300"}`}
              >
                {active.solution}
              </motion.p>
            </AnimatePresence>

            <div className="w-full h-px mb-7" style={{ backgroundColor: "rgba(200,223,82,0.15)" }} />

            <p className={`text-[10px] uppercase tracking-[0.35em] font-bold mb-3 ${isLight ? "!text-[#4d6012]" : "!text-[#C8DF52]"}`}>{panelLabels.result}</p>
            <AnimatePresence mode="wait">
              <motion.p key={`r-${activeIdx}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className={`text-xl md:text-2xl font-bold leading-snug ${isLight ? "text-zinc-600" : "text-primary"}`}
              >
                {active.outcome}
              </motion.p>
            </AnimatePresence>
          </div>

        </div>{/* end Row 2 grid */}
      </div>
    </section>
  );
}

// ─── TRANSFORMATION — bold hover-interactive redesign ─────────────────────────
function TransformationSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const before = t("useCases.transformation.before", { returnObjects: true }) as BeforeAfter;
  const after  = t("useCases.transformation.after",  { returnObjects: true }) as BeforeAfter;
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle when not hovered
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => setActiveIdx(i => (i + 1) % after.lines.length), 3000);
    return () => clearInterval(id);
  }, [isPaused, after.lines.length]);

  return (
    <section
      className={`py-28 md:py-40 relative overflow-hidden ${isLight ? "bg-white" : "bg-[#020202]"}`}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container mx-auto relative z-10">

        {/* Header: eyebrow+title LEFT, CTA RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-10 lg:gap-24 xl:gap-32 mb-20 md:mb-28 items-end">
          <div>
            <motion.span initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-6 block">
              {t("useCases.transformation.eyebrow")}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none ${isLight ? "text-zinc-900" : "text-white"}`}>
              {t("useCases.transformation.title")}
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-start justify-end gap-4">
            <p className={`text-sm font-light leading-relaxed max-w-xs ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
              {t("useCases.transformation.ctaSubtext")}
            </p>
            <Link href="/visitor-experience">
              <span
                className="inline-flex items-center font-bold hover:opacity-80 transition-all cursor-pointer uppercase tracking-widest text-sm group/cta"
                style={{ color: isLight ? "#4d6012" : "#c8df52" }}
              >
                {t("useCases.transformation.ctaText")}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* ── The transformation contrast — hover interaction ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-0 lg:gap-0"
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT: before states — list, small, muted — DESKTOP ONLY */}
          <div className={`hidden lg:block lg:border-r ${isLight ? "border-zinc-200" : "border-white/5"} lg:pr-12 xl:pr-20`}>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8" style={{ color: isLight ? "#4d6012" : "#C8DF52" }}>
              {before.label}
            </p>
            <div className="space-y-1">
              {before.lines.map((line, i) => (
                <motion.div
                  key={i}
                  onMouseEnter={() => { setActiveIdx(i); setIsPaused(true); }}
                  className={`group flex items-start gap-4 py-4 cursor-default rounded-xl px-3 -mx-3 transition-all duration-200 ${
                    i === activeIdx
                      ? isLight ? "bg-zinc-100" : "bg-white/[0.04]"
                      : "hover:bg-white/[0.02]"
                  }`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <span className={`text-[10px] font-mono mt-1 flex-shrink-0 transition-colors ${
                    i === activeIdx ? "text-primary" : isLight ? "text-zinc-400" : "text-zinc-700"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`text-base font-light leading-relaxed transition-all duration-300 ${
                    i === activeIdx
                      ? isLight ? "text-zinc-400 line-through decoration-zinc-400" : "text-zinc-500 line-through decoration-zinc-600"
                      : isLight ? "text-zinc-500" : "text-zinc-600"
                  }`}>
                    {line}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: after state — HUGE, changes on hover */}
          <div className="hidden lg:flex items-center justify-start lg:pl-12 xl:pl-20 min-h-[360px]">
            <div className="w-full">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-10" style={{ color: isLight ? "#4d6012" : "#C8DF52" }}>
                {after.label}
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeIdx}
                  initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                  exit={{   opacity: 0, y: -28, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`font-heading font-black tracking-tighter leading-none ${isLight ? "text-zinc-600" : "text-primary"}`}
                  style={{ fontSize: "clamp(2.5rem, 4.5vw, 5.5rem)" }}
                >
                  {after.lines[activeIdx]}
                </motion.p>
              </AnimatePresence>
              {/* Subtle progress dots */}
              <div className="flex gap-2 mt-10">
                {after.lines.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveIdx(i); setIsPaused(true); }}
                    className={`h-1 rounded-full transition-all duration-400 ${
                      i === activeIdx ? "w-8 bg-primary" : "w-3 bg-zinc-700 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: stacked pairs — ONLY FOR MOBILE */}
          <div className="lg:hidden mt-12 space-y-10">
            {before.lines.map((bLine, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`pt-6 border-t ${isLight ? "border-zinc-200" : "border-white/5"}`}>
                <p className={`text-sm mb-3 line-through decoration-primary ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>{bLine}</p>
                <p className={`text-2xl font-black tracking-tighter leading-snug ${isLight ? "text-zinc-600" : "text-primary"}`}>{after.lines[i]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── IMPACT CARD (sub-component for 2+3 layout) ─────────────────────────────
function ImpactCard({ item, icon, isLight, delay }: { item: ImpactItem; icon: React.ReactNode; isLight: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[3rem] border backdrop-blur-3xl group relative overflow-hidden flex flex-col transition-all duration-500 ${
        isLight ? "bg-white border-zinc-200 hover:border-primary/40"
                : "bg-zinc-900/40 border-white/5 hover:border-primary/30"
      }`}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem]" />
      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 ${
          isLight
            ? "bg-primary/15 text-[#4d6012] group-hover:bg-primary/30 group-hover:shadow-[0_0_16px_rgba(200,223,82,0.35)]"
            : "bg-primary/10 text-primary  group-hover:bg-primary/25 group-hover:shadow-[0_0_20px_rgba(200,223,82,0.35)]"
        }`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold mb-4 transition-colors group-hover:text-primary ${isLight ? "text-zinc-900" : "text-white"}`}>
          {item.title}
        </h3>
        <p className={`text-sm leading-relaxed ${isLight ? "desc-neutral" : "text-zinc-400"}`}>{item.description}</p>
      </div>
    </motion.div>
  );
}

// ─── IMPACT ───────────────────────────────────────────────────────────────────
function ImpactSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const items = t("useCases.impact.items", { returnObjects: true }) as ImpactItem[];

  return (
    <section className="py-32 md:py-48 relative overflow-hidden">
      {/* These blobs are barely visible (5% opacity) even on desktop. On mobile,
          blur-[120px] + animate-pulse is continuous GPU work for invisible output.
          Hidden below md — desktop still gets the full ambient effect. */}
      <div className="hidden md:block absolute top-0 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="hidden md:block absolute bottom-0 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto relative z-10">
        <div className="mb-20 md:mb-24">
          <motion.span initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-6 block">
            {t("useCases.impact.eyebrow")}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-7xl font-bold tracking-tighter leading-none ${isLight ? "text-zinc-900" : "text-white"}`}>
            {t("useCases.impact.title")}
          </motion.h2>
        </div>

        {/* Row 1: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {items.slice(0, 2).map((item, i) => (
            <ImpactCard key={i} item={item} icon={IMPACT_ICONS[i]} isLight={isLight} delay={i * 0.1} />
          ))}
        </div>
        {/* Row 2: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(2).map((item, i) => (
            <ImpactCard key={i + 2} item={item} icon={IMPACT_ICONS[i + 2]} isLight={isLight} delay={(i + 2) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOUND FAMILIAR — scrollytelling card carousel ────────────────────────────
// Images mapped to card order (matches useCases.fit.items order in en.json)
const CARD_IMAGES = [
  imgRevenue, imgExperience, imgLanguage, imgAgeGroup, imgLearning,
  imgExhibition, imgEngagement, imgCollection, imgBehavior,
];

const CARD_GAP = 12;

function getCardW(dist: number, mobile: boolean): number {
  if (mobile) {
    if (dist === 0) return 290;
    if (dist === 1) return 68;
    if (dist === 2) return 50;
    return 0;
  }
  if (dist === 0) return 432;
  if (dist === 1) return 108;
  if (dist === 2) return 78;
  if (dist === 3) return 62;
  return 50;
}

function FitSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const items = t("useCases.fit.items", { returnObjects: true }) as FitItem[];

  const wrapperRef  = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);   // measured to compute cardH
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [cardProgress, setCardProgress] = useState(0); // 0–1 within the active card's scroll slice
  const [carouselW,    setCarouselW]    = useState(1200);
  const [mobile,       setMobile]       = useState(false);
  const [cardH,        setCardH]        = useState(456);
  const activeRef = useRef(0);
  activeRef.current = activeIdx;

  // cardH = viewport height  minus  actual measured header height  minus  progress bar  minus a small gap.
  // Recalculates whenever the header resizes (e.g. text reflows at different breakpoints) or window resizes.
  // On mobile the header is hidden and the card is fixed at 340px.
  useEffect(() => {
    const PROGRESS_H = 48; // progress dots row (pb-9 = 36px + breathing room)
    const GAP        = 12;

    const compute = () => {
      const isMob = window.innerWidth < 768;
      setMobile(isMob);
      if (isMob) { setCardH(340); return; }
      const headerH = headerRef.current?.offsetHeight ?? 100;
      setCardH(Math.min(520, Math.max(260, window.innerHeight - headerH - PROGRESS_H - GAP)));
    };

    compute();
    window.addEventListener("resize", compute);

    // Also recompute whenever the header itself changes height (font size, wrapping, etc.)
    let obs: ResizeObserver | null = null;
    if (headerRef.current) {
      obs = new ResizeObserver(compute);
      obs.observe(headerRef.current);
    }

    return () => { window.removeEventListener("resize", compute); obs?.disconnect(); };
  }, []);

  // Measure carousel container width
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCarouselW(e.contentRect.width));
    ro.observe(el);
    setCarouselW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Scroll-driven: 500vh wrapper, sticky 100vh panel.
  // Card height is now computed from the real measured header height so every card
  // is fully visible before the user starts scrolling — no artificial buffer needed.
  // Progress maps linearly: each of the 9 cards owns ~55 vh of scroll travel.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (p) => {
      const rawIdx  = p * items.length;
      const idx     = Math.min(items.length - 1, Math.floor(rawIdx));
      // progress within this card's slice: rawIdx - idx gives the fractional part.
      // When rawIdx reaches items.length (p=1, last card), progress correctly hits 1.
      const progress = Math.min(1, rawIdx - idx);
      if (idx !== activeRef.current) setActiveIdx(idx);
      setCardProgress(progress);
    });
    return unsub;
  }, [scrollYProgress, items.length]);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActiveIdx(i => Math.min(items.length - 1, i + 1));
      if (e.key === "ArrowLeft")  setActiveIdx(i => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [items.length]);

  // Translate carousel so active card is centred
  const computeX = (idx: number) => {
    let acc = 0;
    for (let i = 0; i < idx; i++) {
      acc += getCardW(Math.abs(i - idx), mobile) + CARD_GAP;
    }
    return carouselW / 2 - (acc + getCardW(0, mobile) / 2);
  };



  const glassBtnStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
  };

  return (
    /* 500vh wrapper — 9 cards × ~55 vh each, no pre-buffer (card is fully visible on entry) */
    <div ref={wrapperRef} style={{ height: "500vh" }} className="relative">

      {/* ── Sticky 100vh panel ── */}
      <div
        className="sticky top-0 h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: isLight ? "#f8f8f8" : "#050505" }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] rounded-full bg-primary/5 blur-[130px]" />
        </div>

        {/* Header — compact so cards get maximum height on every screen size */}
        <div ref={headerRef} className="container mx-auto pt-6 pb-3 md:pt-10 md:pb-5 flex-shrink-0 relative z-10">
          <span className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-2 md:mb-4 block">
            {t("useCases.fit.eyebrow")}
          </span>
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <h2 className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tighter leading-tight max-w-xl ${isLight ? "text-zinc-900" : "text-white"}`}>
              {t("useCases.fit.title")}
            </h2>
            <div className="flex-shrink-0">
              <Link href="/booking">
                <Button
                  size="lg"
                  className="bg-primary !text-black hover:bg-primary/90 rounded-full h-11 px-7 text-sm font-bold transition-colors group"
                >
                  {t("useCases.fit.cta")}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex-1 relative overflow-hidden flex items-start md:items-center pt-10 md:pt-0"
        >
          {/* Left arrow */}
          <button
            onClick={() => { setActiveIdx(i => Math.max(0, i - 1)); setCardProgress(0); }}
            disabled={activeIdx === 0}
            className="absolute left-4 md:left-8 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-20 hover:scale-105 active:scale-95"
            style={glassBtnStyle}
            aria-label={t("useCases.fit.eyebrow")}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => { setActiveIdx(i => Math.min(items.length - 1, i + 1)); setCardProgress(0); }}
            disabled={activeIdx === items.length - 1}
            className="absolute right-4 md:right-8 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-20 hover:scale-105 active:scale-95"
            style={glassBtnStyle}
            aria-label={t("useCases.fit.cta")}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Sliding cards row */}
          <motion.div
            className="absolute flex items-center"
            style={{ gap: CARD_GAP }}
            animate={{ x: computeX(activeIdx) }}
            transition={{ type: "spring", stiffness: 320, damping: 40, restDelta: 0.5 }}
          >
            {items.map((card, i) => {
              const dist    = Math.abs(i - activeIdx);
              const isAct   = dist === 0;
              const cardW   = getCardW(dist, mobile);
              if (mobile && dist > 2) return null;

              return (
                <motion.div
                  key={i}
                  onClick={() => { setActiveIdx(i); setCardProgress(0); }}
                  className="relative flex-shrink-0 rounded-[2rem] overflow-hidden cursor-pointer select-none"
                  animate={{
                    width: cardW,
                  }}
                  style={{ height: cardH }}
                  transition={{ type: "spring", stiffness: 320, damping: 40 }}
                >
                  {/* Background photo — lazy-loaded since FitSection is far below
                      the fold. On mobile this alone saves downloading 9 images
                      (~1–3 MB) at page-load before the user even scrolls there. */}
                  <div className="absolute inset-0">
                    <img
                      src={CARD_IMAGES[i]}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading="lazy"
                    />
                    {/* Gradient overlay — heavier on inactive so vertical text is readable */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isAct
                          ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)"
                          : "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 100%)",
                      }}
                    />
                    {/* Active: subtle primary tint at top */}
                    {isAct && (
                      <div
                        className="absolute inset-0"
                        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(200,223,82,0.06) 0%, transparent 60%)" }}
                      />
                    )}
                  </div>

                  {/* Number */}
                  <div className="absolute top-5 left-5 z-10">
                    <span
                      className="text-[10px] font-mono font-bold text-white/70"
                    >
                      {card.number}
                    </span>
                  </div>

                  {/* ACTIVE: horizontal title + description — fade only, no y movement */}
                  {isAct && (
                    <div className="absolute left-6 right-6 bottom-6 z-10">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.28, delay: 0.1 }}
                          className="fit-card-content"
                        >
                          <h3
                            className="font-bold tracking-tight leading-snug mb-3"
                            style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.65rem)", color: "#ffffff" }}
                          >
                            {card.title}
                          </h3>
                          <p
                            className="text-sm font-light leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.68)" }}
                          >
                            {card.description}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}

                  {/* INACTIVE: rotated vertical title */}
                  {!isAct && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <span
                        className="font-bold text-[11px] tracking-widest"
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          whiteSpace: "nowrap",
                          maxHeight: cardH - 48,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {card.title}
                      </span>
                    </div>
                  )}

                  {/*
                    Per-card scroll progress line — sits at the absolute bottom, clipped by the
                    card's overflow-hidden + rounded-[2rem] for a clean inset look.
                    · Completed cards (i < activeIdx): fully filled (scaleX 1)
                    · Active card (i === activeIdx):   fills as user scrolls (scaleX = cardProgress)
                    · Upcoming cards (i > activeIdx):  empty (scaleX 0)
                    · Arrow/click resets cardProgress to 0, scroll updates it in real time.
                  */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[3px] origin-left"
                    style={{ backgroundColor: "#C8DF52" }}
                    animate={{
                      scaleX: i < activeIdx ? 1 : i === activeIdx ? cardProgress : 0,
                    }}
                    transition={{ duration: 0.08, ease: "linear" }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom breathing room — progress is now shown per-card (green line at card base) */}
        <div className="pb-5 flex-shrink-0" />
      </div>
    </div>
  );
}

// ─── FINAL CTA — light mode fixed ─────────────────────────────────────────────
function CTABlock() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section
      className={`py-24 relative overflow-hidden ${isLight ? "bg-background" : ""}`}
      style={isLight ? {} : { backgroundColor: "#050505" }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
      </div>
      <div className="container mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-8 block">
            {t("useCases.cta.eyebrow")}
          </span>
          <h2 className={`text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight uppercase ${isLight ? "text-zinc-900" : "text-white"}`}>
            {t("useCases.cta.title")}
          </h2>
          <p className={`text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
            {t("useCases.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" className="bg-primary !text-black hover:bg-primary/90 rounded-full h-14 px-10 text-lg font-bold transition-colors group">
                {t("useCases.cta.primary")}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/request-pricing">
              <Button size="lg" variant="ghost"
                className={`rounded-full h-14 px-10 text-base font-bold transition-colors border duration-300 ${
                  isLight ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
                          : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}>
                {t("useCases.cta.secondary")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function UseCases() {
  return (
    <div className="min-h-screen bg-background text-foreground [overflow-x:clip] selection:bg-primary selection:text-black">
      <SEO page="useCases" />
      <StructuredData page="useCases" />
      <Navbar />
      <Hero />
      <UseCasesSection />
      <TransformationSection />
      <ImpactSection />
      <FitSection />
      <CTABlock />
      <Footer />
    </div>
  );
}
