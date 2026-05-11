import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";

import dashboardLeft  from "@assets/dashboard-left.png";
import dashboardRight from "@assets/dashboard-right.png";
// @ts-ignore
import dashboardCenterVideo from "@assets/dashboard-center.mp4";

// ─── Phase 0: Editorial title intro (0 → 0.25) ───────────────────────────────
const P0_SLIDE_START = 0.04;   // title begins sliding left
const P0_SLIDE_END   = 0.37;   // title fully exits viewport
const P0_END         = 0.50;   // intro complete; dashboard content becomes active

// ─── Phases 1–3: Dashboard scrollytelling ───────────────────────────────
const P1_START   = 0.56;   // locked tray phase ends; side screenshots begin disappearing
const P1_END     = 0.72;   // side screenshots fully gone

const P2_START   = 0.68;   // center video begins scaling
const P2_END     = 0.72;

const P3_START   = 0.74;
const LABEL_SWAP = 0.84;


function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function DashboardScrollytelling() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduced = usePrefersReducedMotion();

const wrapperRef = useRef<HTMLDivElement>(null);
const videoRef   = useRef<HTMLVideoElement>(null);
const titleRef   = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // ─── Phase 0: Title slides left and exits ────────────────────────────────
  // Translates the full-width title layer off screen to the left.
  // "-120%" of the container width guarantees exit on all screen sizes.
const [titleTravel, setTitleTravel] = useState(0);

useEffect(() => {
  const update = () => {
    if (!titleRef.current) return;

    const textWidth = titleRef.current.getBoundingClientRect().width;
    const viewportWidth = window.innerWidth;

    // travel enough so the ENTIRE title exits
    setTitleTravel(-(textWidth + 320));
  };

  update();

  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);

const rawTitleX = useTransform(
  scrollYProgress,
  [P0_SLIDE_START, P0_SLIDE_END],
  [0, titleTravel]
);

const titleX = useSpring(rawTitleX, {
  stiffness: 55,
  damping: 42,
  mass: 0.45,
});
const titleOpacity = useTransform(
  scrollYProgress,
  [P0_END - 0.06, P0_END],
  [1, 0]
);
  // ─── Dashboard tray fades in after the title exits ───────────────────────
  // Brief opacity ramp (< 5% of total progress) — minimal, just enough to
  // cleanly hand off from the typography phase to the dashboard phase.
  const dashboardOpacity = useTransform(
    scrollYProgress,
    [P0_SLIDE_END, P0_END],
    [0, 1]
  );

  // ─── Left screenshot ──────────────────────────────────────────────────────
  const leftY       = useTransform(scrollYProgress, [P1_START, P1_END], [0, -72]);
  const leftOpacity = useTransform(
    scrollYProgress,
    [P1_START, P1_START + (P1_END - P1_START) * 0.65],
    [1, 0]
  );

  // ─── Right screenshot ─────────────────────────────────────────────────────
  const rightY       = useTransform(scrollYProgress, [P1_START, P1_END], [0, 72]);
  const rightOpacity = useTransform(
    scrollYProgress,
    [P1_START, P1_START + (P1_END - P1_START) * 0.65],
    [1, 0]
  );

  // ─── Center video scale ───────────────────────────────────────────────────
  const centerScale = useTransform(scrollYProgress, [P2_START, P2_END], [1, 1.7]);

  // ─── Labels opacity ───────────────────────────────────────────────────────
  const labelsOpacity = useTransform(
    scrollYProgress,
    [P3_START, P3_START + 0.045],
    [0, 1]
  );

  // ─── Label set tracking ───────────────────────────────────────────────────
  const [labelSet, setLabelSet] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setLabelSet(v >= LABEL_SWAP ? 1 : 0);
    });
    return unsub;
  }, [scrollYProgress]);

  // ─── Video scrubbing (RAF-smoothed lerp) ──────────────────────────────────
  const targetTimeRef  = useRef(0);
  const currentTimeRef = useRef(0);
  const rafRef         = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    // Keep video paused so playback never interferes with scrubbing
    video.pause();

    const seek = (t: number) => {
      // fastSeek is purpose-built for scrubbing — much faster than currentTime
      if (typeof (video as any).fastSeek === "function") {
        (video as any).fastSeek(t);
      } else {
        video.currentTime = t;
      }
    };

    const loop = () => {
      // Only attempt seeks when the video has enough data
      if (video.readyState >= 2 && video.duration) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        // Low lerp factor (0.09) → small, frequent steps → smooth and cheap to decode
        currentTimeRef.current += diff * 0.09;
        // Only seek if there's a meaningful change (avoids redundant decode work)
        if (Math.abs(diff) > 0.005) {
          seek(currentTimeRef.current);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const unsub = scrollYProgress.on("change", (progress) => {
      const video = videoRef.current;
      if (!video?.duration) return;
      const fraction = Math.max(0, Math.min(1, (progress - P3_START) / (0.94 - P3_START)));
      targetTimeRef.current = fraction * video.duration;
    });
    return unsub;
  }, [scrollYProgress, reduced]);

  // ─── Theme-aware colors ───────────────────────────────────────────────────
  const lineClass = isLight ? "bg-zinc-300" : "bg-zinc-500";
  const textClass = isLight ? "text-black" : "text-white";

  return (
    // overflow-x: clip prevents horizontal scrollbar from the overflowing title
    // without creating a new scroll container (which would break position:sticky)
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: "1000vh", overflowX: "clip" }}
    >
      {/* ── Sticky viewport ──────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen flex items-center justify-center">

        {/* ── Phase 0: Giant editorial title ─────────────────────────────── */}
        {/* Absolutely fills the sticky viewport; translates left on scroll  */}
        <motion.div
          aria-hidden="true"
          style={{
            x: titleX,
            opacity: titleOpacity,
            willChange: "transform",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: "max(24px, 4vw)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <h2
  ref={titleRef}
            className={textClass}
            style={{
              // Oversized: intentionally overflows viewport on all breakpoints
              fontSize: "clamp(64px, 14vw, 220px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              // Force single line so text bleeds past both edges
              whiteSpace: "nowrap",
              userSelect: "none",
              margin: 0,
            }}
          >
            {t("dashboard.scrollytelling.title")}
          </h2>
        </motion.div>

        {/* ── Phases 1–3: Dashboard media tray ───────────────────────────── */}
        {/* Fades in after the title exits; all internal behavior unchanged   */}
        <motion.div
          className="flex items-center justify-center w-full px-0"
          style={{
            gap: "clamp(6px, 1.8vw, 22px)",
            opacity: dashboardOpacity,
          }}
        >

          {/* Left screenshot */}
          <motion.div
            aria-hidden="true"
            className="hidden md:block flex-none rounded-xl overflow-hidden shadow-lg"
            style={{
              width: "clamp(240px, 30vw, 600px)",
              aspectRatio: "2 / 1",
              y: leftY,
              opacity: leftOpacity,
            }}
          >
            <img
              src={dashboardLeft}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>

          {/* Center video */}
          <motion.div
            className="relative flex-none rounded-xl shadow-2xl"
            style={{
              width: "clamp(240px, 30vw, 600px)",
              aspectRatio: "2 / 1",
              willChange: "transform",
            }}
          >
            <motion.div
              style={{ scale: centerScale, willChange: "transform" }}
              className="w-full h-full"
            >
              <video
                ref={videoRef}
                src={dashboardCenterVideo}
                crossOrigin="anonymous"
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0.01;
                  }
                }}
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover block rounded-xl overflow-hidden"
                style={{ willChange: "contents" }}
              />
            </motion.div>

            {/* ── Annotation overlay ─────────────────────────────────────── */}
            <motion.div
              className="absolute pointer-events-none"
              style={{
                opacity: labelsOpacity,
                inset: "-120px",
              }}
            >
              {/* Left annotation */}
              <div
                className="absolute"
                style={{
                  right: "calc(100% + 72px)",
                  top: "14%",
                  width: "clamp(180px, 18vw, 320px)",
                }}
              >
                <motion.div
                  className="relative mb-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                  style={{
                    transformOrigin: "right center",
                    width: "100%",
                    height: "1px",
                  }}
                >
                  <div className={`absolute inset-0 ${lineClass}`} />
                  <div
                    className={`absolute right-0 top-[-2px] w-[5px] h-[5px] rounded-full ${lineClass}`}
                  />
                </motion.div>

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`left-${labelSet}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ willChange: "transform, opacity, filter" }}
                    className="text-left flex flex-col items-start"
                  >
                    <div className={`text-2xl font-bold leading-tight mb-3 ${textClass}`}>
                      {labelSet === 0
                        ? t("dashboard.scrollytelling.labels.insights")
                        : t("dashboard.scrollytelling.labels.team")}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right annotation */}
              <div
                className="absolute"
                style={{
                  left: "calc(100% + 72px)",
                  top: "68%",
                  width: "clamp(180px, 18vw, 320px)",
                }}
              >
                <motion.div
                  className="relative mb-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                  style={{
                    transformOrigin: "left center",
                    width: "100%",
                    height: "1px",
                  }}
                >
                  <div className={`absolute inset-0 ${lineClass}`} />
                  <div
                    className={`absolute left-0 top-[-2px] w-[5px] h-[5px] rounded-full ${lineClass}`}
                  />
                </motion.div>

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`right-${labelSet}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    style={{ willChange: "transform, opacity, filter" }}
                    className="text-right flex flex-col items-end"
                  >
                    <div className={`text-2xl font-bold leading-tight mb-3 ${textClass}`}>
                      {labelSet === 0
                        ? t("dashboard.scrollytelling.labels.interface")
                        : t("dashboard.scrollytelling.labels.glance")}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Right screenshot */}
          <motion.div
            aria-hidden="true"
            className="hidden md:block flex-none rounded-xl overflow-hidden shadow-lg"
            style={{
              width: "clamp(240px, 30vw, 600px)",
              aspectRatio: "2 / 1",
              y: rightY,
              opacity: rightOpacity,
            }}
          >
            <img
              src={dashboardRight}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
