import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

function GlobeAnimation() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "30px 30px" }}
      >
        <circle cx="30" cy="30" r="22" fill="none" stroke="#C8DF52" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="30" cy="30" rx="12" ry="22" fill="none" stroke="#C8DF52" strokeWidth="1.2" opacity="0.5" />
        <ellipse cx="30" cy="30" rx="22" ry="12" fill="none" stroke="#C8DF52" strokeWidth="1.2" opacity="0.4" />
        <line x1="8" y1="30" x2="52" y2="30" stroke="#C8DF52" strokeWidth="0.8" opacity="0.3" />
        <line x1="30" y1="8" x2="30" y2="52" stroke="#C8DF52" strokeWidth="0.8" opacity="0.3" />
        <ellipse cx="30" cy="30" rx="18" ry="22" fill="none" stroke="#C8DF52" strokeWidth="0.8" opacity="0.3" />
      </motion.g>
    </svg>
  );
}

function NFCAnimation() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <g transform="translate(15, 30)">
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M ${8 + i * 8} ${-8 - i * 6} A ${10 + i * 8} ${10 + i * 8} 0 0 1 ${8 + i * 8} ${8 + i * 6}`}
            fill="none"
            stroke="#C8DF52"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>
    </svg>
  );
}

function SoundBarsAnimation() {
  const bars = [12, 20, 28, 36, 44];
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      {bars.map((x, i) => (
        <motion.rect
          key={i}
          x={x}
          width="4"
          rx="2"
          fill="#C8DF52"
          animate={{
            height: [8, 20 + Math.random() * 16, 8],
            y: [26, 18 - Math.random() * 8, 26],
          }}
          transition={{
            duration: 0.8 + i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </svg>
  );
}

function HumanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 52" fill="none" className={className}>
      <circle cx="16" cy="8" r="5" fill="currentColor" />
      <path 
        d="M16 14c-4 0-7 3-7 7v12h2v14c0 1 1 2 2 2s2-1 2-2V33h2v14c0 1 1 2 2 2s2-1 2-2V33h2V21c0-4-3-7-7-7z" 
        fill="currentColor" 
      />
    </svg>
  );
}

function MouseIcon({ opacity, scale }: { opacity: any; scale: any }) {
  const { t } = useTranslation();
  return (
    <motion.div 
      style={{ opacity, scale }}
      className="absolute bottom-24 flex flex-col items-center gap-3 pointer-events-none"
    >
      <svg width="24" height="40" viewBox="0 0 28 44" fill="none">
        <rect x="1" y="1" width="26" height="42" rx="13" stroke="white" strokeWidth="2" opacity="0.3" />
        <motion.rect
          x="12" y="10" width="4" height="8" rx="2"
          fill="#C8DF52"
          animate={{ y: [10, 20, 10] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <span className="text-zinc-500 text-[10px] font-bold tracking-[0.4em] uppercase">{t("hero.explore")}</span>
    </motion.div>
  );
}

export default function VisitorJourney() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isManualNav, setIsManualNav] = useState(false);
  const [isZoomFinished, setIsZoomFinished] = useState(false);
  const manualNavTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const STEPS = [
    {
      num: t("visitorExperience.visitorJourney.steps.step1.num"),
      title: t("visitorExperience.visitorJourney.steps.step1.title"),
      description: t("visitorExperience.visitorJourney.steps.step1.desc"),
    },
    {
      num: t("visitorExperience.visitorJourney.steps.step2.num"),
      title: t("visitorExperience.visitorJourney.steps.step2.title"),
      description: t("visitorExperience.visitorJourney.steps.step2.desc"),
    },
    {
      num: t("visitorExperience.visitorJourney.steps.step3.num"),
      title: t("visitorExperience.visitorJourney.steps.step3.title"),
      description: t("visitorExperience.visitorJourney.steps.step3.desc"),
    },
    {
      num: t("visitorExperience.visitorJourney.steps.step4.num"),
      title: t("visitorExperience.visitorJourney.steps.step4.title"),
      description: t("visitorExperience.visitorJourney.steps.step4.desc"),
    },
    {
      num: t("visitorExperience.visitorJourney.steps.step5.num"),
      title: t("visitorExperience.visitorJourney.steps.step5.title"),
      description: t("visitorExperience.visitorJourney.steps.step5.desc"),
    },
  ];

  const { scrollYProgress: introProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "start -100vh"],
  });

  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });
const headingScaleMobile = useTransform(introProgress, [0, 1], [1, 10]);
const headingFontSizeDesktop = useTransform(
  introProgress,
  [0, 1],
  ["clamp(90px, 11vw, 180px)", "1800px"]
);
  // Desktop: font-size flip (render huge, start at 10% ≈ 97% of screen width)
  // Mobile: normal readable font, scale 1→10 (starts full-size, zooms dramatically)
  const headingOpacity = useTransform(introProgress, [0, 0.8, 1], [1, 1, 0]);
  
  const mouseOpacity = useTransform(introProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const mouseScale = useTransform(introProgress, [0, 0.4, 0.6], [1, 1, 0.8]);

  useMotionValueEvent(introProgress, "change", (v) => {
    setIsZoomFinished(v > 0.99);
  });

  const smoothProgress = useSpring(journeyProgress, { stiffness: 55, damping: 25 });

  useEffect(() => {
    const unsubscribe = journeyProgress.on("change", (v) => {
      if (isManualNav || !isZoomFinished) return;
      
      // Node positions: 0.0, 0.25, 0.5, 0.75, 1.0
      // We want Step 3 (ASK) and Step 4 (ANSWER) both at Node 4 (1.0)
      // Displaced one node to the right from original (3->4, 4->4)
      
      let step = 0;
      if (v < 0.125) step = 0;
      else if (v < 0.375) step = 1;
      else if (v < 0.625) step = 2;
      else if (v < 0.95) step = 3; 
      else step = 4; 
      
      setActiveStep(step);
    });
    return unsubscribe;
  }, [journeyProgress, isManualNav, isZoomFinished]);

  useEffect(() => {
    if (!isZoomFinished) {
      setActiveStep(0);
    }
  }, [isZoomFinished]);

  const navigateToStep = useCallback((stepIndex: number) => {
    setIsManualNav(true);
    setActiveStep(stepIndex);
    if (manualNavTimeout.current) clearTimeout(manualNavTimeout.current);

    const journeyEl = journeyRef.current;
    if (!journeyEl) return;

    const rect = journeyEl.getBoundingClientRect();
    const scrollableHeight = journeyEl.scrollHeight - window.innerHeight;
    const fraction = stepIndex / 4;
    const targetScroll = window.scrollY + rect.top + scrollableHeight * fraction;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });

    manualNavTimeout.current = setTimeout(() => {
      setIsManualNav(false);
    }, 1200);
  }, []);

  const humanX = useTransform(smoothProgress, (v) => {
    if (!isZoomFinished) return 0;
    return v * 100;
  });

  return (
    <section ref={sectionRef} id="visitor-journey" className="relative bg-background" style={{ overflowX: "clip" }}>
      <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden sticky top-0 z-50 pointer-events-none">
        {/*
          Font-size flip: render at ~10× the natural size, scale from 0.1→1 instead of 1→10.
          The browser rasterizes text at the large DOM size, so scaling toward 1.0 never
          produces a blurry/pixelated bitmap on the first occurrence.
        */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.h2
            style={{
              opacity: headingOpacity,
              scale: isMobile ? headingScaleMobile : 1,
              // Desktop: font-size flip trick — clamp max raised to 1800px so font scales
              // proportionally on large screens (900px cap caused text to shrink on wide viewports)
              // Mobile: normal readable font — wraps naturally, zooms in dramatically
              fontSize: isMobile
               ? "clamp(2.5rem, 13vw, 4.5rem)"
               : headingFontSizeDesktop,
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              whiteSpace: isMobile ? "normal" : "nowrap",
              ...(isMobile
                ? { maxWidth: "85vw", wordBreak: "break-word" as const, lineHeight: 1.15 }
                : {}),
            }}
            className="font-black tracking-tighter text-center leading-none"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C8DF52] to-white">
              {t("visitorExperience.visitorJourney.title")}
            </span>
          </motion.h2>
        </div>
        <MouseIcon opacity={mouseOpacity} scale={mouseScale} />
      </div>

      <div className="h-[100vh] pointer-events-none" />

      <div 
        ref={journeyRef} 
        className="relative -mt-[100vh]" 
        style={{ 
          height: "350vh",
          pointerEvents: isZoomFinished ? "auto" : "none"
        }}
      >
        <motion.div 
          className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isZoomFinished ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto px-6 h-full flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-16 w-full items-center justify-center relative z-10 h-auto lg:h-full">
              <div className="w-full lg:h-full relative flex items-center justify-center">
                <LeftRevolver activeStep={activeStep} onStepClick={navigateToStep} steps={STEPS} />
              </div>
              <div className="w-full lg:h-full relative flex items-center justify-center">
                <RightMap activeStep={activeStep} humanX={humanX} onNodeClick={navigateToStep} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function renderJourneyDescription(description: string, stepIndex: number) {
  // First step contains "Handset" link
  if (stepIndex === 0) {
    const parts = description.split('Handset');
    if (parts.length === 2) {
      return <>{parts[0]}<Link href="/handset" className="underline decoration-primary/40 hover:decoration-primary transition-colors">Handset</Link>{parts[1]}</>;
    }
  }
  return <>{description}</>;
}

function LeftRevolver({ activeStep, onStepClick, steps }: { activeStep: number; onStepClick: (i: number) => void; steps: any[] }) {
  const isMobile = useIsMobile();
  return (
    <div className="relative w-full h-[260px] lg:h-[600px] flex items-center justify-center" style={{ perspective: "1200px" }}>
      <div className="absolute inset-x-0 top-0 h-12 lg:h-40 pointer-events-none z-20 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-12 lg:h-40 pointer-events-none z-20 bg-gradient-to-t from-background to-transparent" />
      
      <div className="w-full relative h-full flex items-center justify-center">
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const distance = i - activeStep;
          const absDistance = Math.abs(distance);
          
          return (
            <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                onClick={(e) => { e.stopPropagation(); onStepClick(i); }}
                className="cursor-pointer px-4 w-full max-w-md pointer-events-auto"
                initial={false}
                animate={{
                  y: distance * (isMobile ? 130 : 180),
                  scale: isActive ? 1 : Math.max(0.75, 1 - absDistance * 0.1),
                  opacity: isActive ? 1 : Math.max(0, 0.4 - absDistance * 0.2),
                  rotateX: distance * 12,
                  z: isActive ? 0 : -absDistance * 100,
                }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
                style={{ 
                  transformStyle: "preserve-3d", 
                  zIndex: isActive ? 10 : 5 - absDistance,
                }}
              >
                <div
                  className={`w-full rounded-2xl lg:rounded-[2.5rem] p-5 lg:p-10 transition-all duration-700 border ${
                    isActive
                      ? "border-[#C8DF52]/30 bg-white/[0.03] backdrop-blur-xl shadow-2xl"
                      : "border-white/[0.05] bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-[10px] font-bold tracking-[0.4em] uppercase transition-colors duration-500 ${
                      isActive ? "text-[#C8DF52]" : "text-zinc-600"
                    }`}>
                      {step.num}
                    </span>
                    <h3 className={`text-2xl font-black font-heading transition-colors duration-500 ${
                      isActive ? "text-white" : "text-zinc-500"
                    }`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className={`text-base md:text-lg leading-relaxed transition-colors duration-500 font-sans ${
                    isActive ? "text-zinc-300" : "text-zinc-600"
                  }`}>
                    {renderJourneyDescription(step.description, i)}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RightMap({
  activeStep,
  humanX,
  onNodeClick,
}: {
  activeStep: number;
  humanX: any;
  onNodeClick: (i: number) => void;
}) {
  const { t } = useTranslation();

  const NODE_LABELS = [
    t("visitorExperience.visitorJourney.nodes.start"),
    t("visitorExperience.visitorJourney.nodes.tap"),
    t("visitorExperience.visitorJourney.nodes.play"),
    t("visitorExperience.visitorJourney.nodes.ask"),
    t("visitorExperience.visitorJourney.nodes.answer")
  ];


  return (
    <div className="relative w-full h-[200px] lg:h-[600px] flex items-center justify-center px-8 lg:px-0">
      <div className="relative w-full max-w-lg h-full flex items-center justify-center">
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-zinc-800 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-[1.5px] bg-[#C8DF52] -translate-y-1/2 origin-left"
          style={{ width: useTransform(humanX, (v: number) => `${v}%`) }}
        />

        <motion.div
          className="absolute -translate-x-1/2 z-40 pointer-events-none text-white"
          style={{
            left: useTransform(humanX, (v: number) => `${v}%`),
            top: "50%",
            y: "-140%",
          }}
        >
          <HumanIcon className="w-10 h-14 md:w-12 md:h-16 drop-shadow-[0_0_15px_rgba(200,223,82,0.3)]" />
        </motion.div>

        {NODE_LABELS.map((label, i) => {
          const isActive = i === activeStep;
          const leftPercent = i * 25;
          const isChatStep = i === 3 || i === 4;

          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${leftPercent}%`, top: "50%", zIndex: isActive ? 30 : 5 }}
            >
              <div
                onClick={(e) => { e.stopPropagation(); onNodeClick(i); }}
                className="cursor-pointer relative flex items-center justify-center w-24 h-24"
              >
                <motion.div
                  className="rounded-full border-[1.5px] flex items-center justify-center bg-background z-20 relative shadow-xl"
                  animate={{
                    width: isActive ? 84 : 16,
                    height: isActive ? 84 : 16,
                    borderColor: isActive ? "#C8DF52" : "rgba(255,255,255,0.15)",
                    backgroundColor: isActive ? "rgba(200,223,82,0.08)" : "rgba(255,255,255,0.05)",
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <AnimatePresence>
                    {isActive && !isChatStep && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="w-[65%] h-[65%]"
                      >
                        {i === 0 && <GlobeAnimation />}
                        {i === 1 && <NFCAnimation />}
                        {i === 2 && <SoundBarsAnimation />}
                      </motion.div>
                    )}
                    {isActive && isChatStep && (
                       <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="w-[50%] h-[50%] flex items-center justify-center"
                      >
                         <div className={`w-3 h-3 rounded-full ${i === 3 ? 'bg-white' : 'bg-[#C8DF52]'}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

              </div>

              <motion.span
                className="absolute text-[11px] font-black tracking-[0.25em] uppercase whitespace-nowrap pointer-events-none mt-8 z-30"
                style={{ top: "50%" }}
                animate={{
                  color: isActive ? "#C8DF52" : "rgba(113,113,122,0.5)",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                {label}
              </motion.span>
            </div>
          );
        })}

                        <AnimatePresence>
          {activeStep === 3 && (
            <motion.div
              key="ask-bubble"
              initial={{ scale: 0, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                mass: 0.8
              }}
              className="absolute w-[220px] md:w-[260px] p-6 shadow-2xl z-50 pointer-events-none rounded-2xl bg-white text-black"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "12px",
                transform: "translateX(-50%)",
                transformOrigin: "50% 0%"
              }}
            >
              <div className="absolute -top-[6px] w-3 h-3 bg-white rotate-45 left-1/2 -translate-x-1/2" />
              <p className="text-sm md:text-base leading-relaxed font-bold italic text-center">
                {"\u201CWhat\u2019s the symbolism of the blue pigment here?\u201D"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeStep === 4 && (
            <motion.div
              key="answer-bubble"
              initial={{ scale: 0, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                mass: 0.8
              }}
              className="absolute w-[220px] md:w-[260px] p-6 shadow-2xl z-50 pointer-events-none rounded-2xl bg-[#C8DF52] text-black"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "12px",
                transform: "translateX(-50%)",
                transformOrigin: "100% 0%"
              }}
            >
              <div className="absolute -top-[6px] w-3 h-3 bg-[#C8DF52] rotate-45 right-[4px]" />
              <p className="text-sm md:text-base leading-relaxed font-bold italic text-center" style={{ color: '#000' }}>
                {"\u201CThe blue pigment represents the divine, sourced from lapis lazuli.\u201D"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
