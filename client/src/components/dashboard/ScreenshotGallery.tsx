import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, TrendingUp, Languages, Layers, LayoutDashboard, BarChart3, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Screenshot assets ───────────────────────────────────────────────────────
import imgCompletionRates from "@assets/completion-rates.png";
import imgArtifacts       from "@assets/artifacts.png";
import imgHome            from "@assets/home.png";
import imgLanguageMix     from "@assets/language-mix.png";
import imgAnalytics       from "@assets/analytics.png";

// ─── Constants ───────────────────────────────────────────────────────────────
const CARD_W      = 360;
const CARD_H      = Math.round(CARD_W / 2);         // 180 px — strict 2:1
const CALLOUT_GAP = 48;   // card edge → callout centre, same above and below
const HOVER_SCALE = 1.5; // how much a card grows on hover

// ─── Arc geometry ────────────────────────────────────────────────────────────
// Cards sit on a circle: centre (0, 2638), radius ≈ 2638.
// Verified: outer (±340, 22), middle (±175, 6), centre (0, 0) all satisfy it.
// stackedRot/spreadRot are the tangent angles at each card's x position.
// The two persistent callouts reuse the same tangent → perfect arc alignment.

const CARDS = [
  { key: "completionRates", image: imgCompletionRates, spreadX: -340, stackedRot: -6, spreadRot: -10, arcY: 22, z: 1, Icon: TrendingUp   as LucideIcon },
  { key: "artifacts",       image: imgArtifacts,       spreadX: -175, stackedRot: -3, spreadRot:  -5, arcY:  6, z: 2, Icon: Layers        as LucideIcon },
  { key: "home",            image: imgHome,            spreadX:    0, stackedRot:  0, spreadRot:   0, arcY:  0, z: 5, Icon: LayoutDashboard as LucideIcon },
  { key: "languageMix",     image: imgLanguageMix,     spreadX:  175, stackedRot:  3, spreadRot:   5, arcY:  6, z: 2, Icon: Languages      as LucideIcon },
  { key: "analytics",       image: imgAnalytics,       spreadX:  340, stackedRot:  6, spreadRot:  10, arcY: 22, z: 1, Icon: BarChart3      as LucideIcon },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────
export function ScreenshotGallery() {
  const { t }     = useTranslation();
  const { theme } = useTheme();
  const isLight   = theme === "light";

  const containerRef     = useRef<HTMLDivElement>(null);
  const lightboxImgRef   = useRef<HTMLImageElement>(null);

  const [hovered,         setHovered]        = useState<number | null>(null);
  const [lightbox,        setLightbox]       = useState<number | null>(null);
  const [scale,           setScale]          = useState(1);
  // Lazy initialiser: read window width synchronously on first render so the
  // correct layout (auto height vs 100 vh) is applied from the very first paint.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);

  // Mobile slider
  const [mobileSlide,     setMobileSlide]    = useState(0);
  const [slideDirection,  setSlideDirection] = useState(1); // 1 = forward, -1 = backward

  const handleSlideNext = useCallback(() => {
    setSlideDirection(1);
    setMobileSlide(i => (i + 1) % CARDS.length);
  }, []);
  const handleSlidePrev = useCallback(() => {
    setSlideDirection(-1);
    setMobileSlide(i => (i - 1 + CARDS.length) % CARDS.length);
  }, []);

  type ZoomState = { lensX: number; lensY: number; bgX: number; bgY: number; bgW: number; bgH: number };
  const [zoomPos, setZoomPos] = useState<ZoomState | null>(null);

  /* ── Responsive scale ──────────────────────────────────────────────────── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      // Below 900 px: shrink stage for mobile/tablet.
      // 900–1440 px: scale 1.0 (base design, feels right on 14" laptop).
      // 1440 px+: grow proportionally up to 1.5× so cards fill large monitors.
      setScale(w < 480 ? 0.40 : w < 640 ? 0.55 : w < 900 ? 0.82 : Math.min(1.62, w / 1100));
      setIsMobile(w < 768);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Re-sync Framer Motion's scroll observer after viewport resize ──────── */
  // useScroll caches the target element's pixel boundaries (e.g. the pixel
  // height of the 300 vh container). Moving the browser between monitors
  // changes the viewport size, so CSS vh units get new pixel values — but
  // Framer Motion's cached measurements go stale, causing scrollYProgress to
  // compute wrong values and the spread animation to never activate.
  //
  // Dispatching a synthetic "scroll" event on the next animation frame forces
  // Framer Motion's observer to re-run getBoundingClientRect() on the target
  // and recalculate progress with the freshly-laid-out element. rAF ensures
  // the dispatch fires AFTER React has re-rendered and the browser has
  // recomputed vh units — so the measurements will be correct.
  useEffect(() => {
    let raf: ReturnType<typeof requestAnimationFrame>;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        window.dispatchEvent(new Event("scroll")),
      );
    };
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Escape closes lightbox ────────────────────────────────────────────── */
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  /* ── Reset zoom lens when lightbox opens / closes ───────────────────────── */
  useEffect(() => { setZoomPos(null); }, [lightbox]);

  /* ── Magnifier lens — tracks cursor over the lightbox image ─────────────── */
  const ZOOM = 2.5;
  const LENS = 120; // circle diameter in px

  const handleZoomMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = lightboxImgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const bgW = rect.width  * ZOOM;
    const bgH = rect.height * ZOOM;
    const posX = (e.clientX - rect.left) / rect.width;
    const posY = (e.clientY - rect.top)  / rect.height;
    setZoomPos({
      lensX: e.clientX - rect.left - LENS / 2,
      lensY: e.clientY - rect.top  - LENS / 2,
      bgX:   -(posX * bgW - LENS / 2),
      bgY:   -(posY * bgH - LENS / 2),
      bgW,
      bgH,
    });
  }, []);

  /* ── Scroll progress ───────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hold range 0.40→0.75 — slightly stickier than before.
  const spread = useTransform(
    scrollYProgress,
    [0.08, 0.40, 0.75, 0.92],
    [0, 1, 1, 0],
  );

  /* ── Hover enabled only when cards are fully expanded ───────────────────── */
  // Placed here so `spread` is already initialised when this effect runs.
  // spread.on returns an unsubscribe fn — returned directly as cleanup.
  useEffect(
    () => spread.on("change", (v) => {
      // Hysteresis: enable hover as cards reach full spread, but keep hover
      // enabled through the entire collapse phase — only disable once cards
      // are nearly back to stacked (v < 0.05).
      if (v > 0.95)       setIsFullyExpanded(true);
      else if (v < 0.05) { setIsFullyExpanded(false); setHovered(null); }
    }),
    [spread],
  );

  // Callouts fade in while cards are still fanning out (0.28→0.38), well
  // before full spread, so they feel part of the spreading motion.
  const calloutScrollOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.38, 0.68, 0.75],
    [0, 1, 1, 0],
  );

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  /* ── Per-card MotionValues ─────────────────────────────────────────────── */
  const cx0 = useTransform(spread, v => v * CARDS[0].spreadX);
  const cx1 = useTransform(spread, v => v * CARDS[1].spreadX);
  const cx2 = useTransform(spread, () => 0);
  const cx3 = useTransform(spread, v => v * CARDS[3].spreadX);
  const cx4 = useTransform(spread, v => v * CARDS[4].spreadX);

  const cy0 = useTransform(spread, v => v * CARDS[0].arcY);
  const cy1 = useTransform(spread, v => v * CARDS[1].arcY);
  const cy2 = useTransform(spread, () => 0);
  const cy3 = useTransform(spread, v => v * CARDS[3].arcY);
  const cy4 = useTransform(spread, v => v * CARDS[4].arcY);

  // Arc tangent rotations — reused by callouts for perfect alignment.
  const cr0 = useTransform(spread, v => CARDS[0].stackedRot + v * (CARDS[0].spreadRot - CARDS[0].stackedRot));
  const cr1 = useTransform(spread, v => CARDS[1].stackedRot + v * (CARDS[1].spreadRot - CARDS[1].stackedRot));
  const cr2 = useTransform(spread, () => 0);
  const cr3 = useTransform(spread, v => CARDS[3].stackedRot + v * (CARDS[3].spreadRot - CARDS[3].stackedRot));
  const cr4 = useTransform(spread, v => CARDS[4].stackedRot + v * (CARDS[4].spreadRot - CARDS[4].stackedRot));

  /* ── Hover springs — one per card ──────────────────────────────────────── */
  // Each spring animates 0→1 when its card is hovered, matching whileHover.
  // They drive: (1) callout y offset so the gap stays fixed as the card grows,
  //             (2) callout rotation straightening toward 0°.
  // For persistent callouts (0, 3) the spring also combines with scroll opacity.
  // For hover-only callouts (1, 2, 4) the spring IS the opacity.
  const SPRING = { stiffness: 340, damping: 28 } as const;
  const hs0 = useSpring(0, SPRING);
  const hs1 = useSpring(0, SPRING);
  const hs2 = useSpring(0, SPRING);
  const hs3 = useSpring(0, SPRING);
  const hs4 = useSpring(0, SPRING);

  // anyHovered: 1 the moment any card is hovered, 0 when nothing is.
  // Used to instantly hide persistent callouts the moment any interaction starts.
  const anyHovered = useMotionValue(0);
  const hov0       = useMotionValue(0); // 1 only when card 0 is hovered
  const hov3       = useMotionValue(0); // 1 only when card 3 is hovered

  useEffect(() => {
    anyHovered.set(hovered !== null ? 1 : 0);
    hov0.set(hovered === 0 ? 1 : 0);
    hov3.set(hovered === 3 ? 1 : 0);
    hs0.set(hovered === 0 ? 1 : 0);
    hs1.set(hovered === 1 ? 1 : 0);
    hs2.set(hovered === 2 ? 1 : 0);
    hs3.set(hovered === 3 ? 1 : 0);
    hs4.set(hovered === 4 ? 1 : 0);
  }, [hovered, anyHovered, hov0, hov3, hs0, hs1, hs2, hs3, hs4]);

  // cop = max(hov_n,  (1 − anyHovered) × scrollOpacity)
  //
  // Nothing hovered  → anyHovered=0, hov=0 → max(0,  1 × scroll) = scroll  ✓
  // Own card hovered → anyHovered=1, hov=1 → max(1,  0 × scroll) = 1       ✓
  // Other card hover → anyHovered=1, hov=0 → max(0,  0 × scroll) = 0       ✓
  //
  // The hide is instant (MotionValue snaps) so the callout disappears the
  // moment any card is touched. The reappearance follows calloutScrollOpacity,
  // which is already a smooth scroll-driven fade.
  const cop0 = useTransform(
    [calloutScrollOpacity, hov0, anyHovered],
    ([scroll, h, any]) => Math.max(h as number, (1 - (any as number)) * (scroll as number)),
  );
  const cop3 = useTransform(
    [calloutScrollOpacity, hov3, anyHovered],
    ([scroll, h, any]) => Math.max(h as number, (1 - (any as number)) * (scroll as number)),
  );

  /* ── Callout final positions ───────────────────────────────────────────── */
  // Base y = card centre y ± (CARD_H/2 + CALLOUT_GAP)
  // Hover adjustment = hs × (HOVER_SCALE − 1) × CARD_H/2
  //   → callout moves away from card by exactly how much the card edge moves,
  //     keeping the visual gap constant at all scale states.
  // Rotation = arc tangent × (1 − hs) → straightens to 0° in sync with card.

  // Card 0 — Completion Rates — callout ABOVE
  const HOVER_EDGE_DELTA = (HOVER_SCALE - 1) * (CARD_H / 2); // ~18 px

  const co0y = useTransform(
    [spread, hs0],
    ([sp, t]) =>
      (sp as number) * CARDS[0].arcY
      - (CARD_H / 2 + CALLOUT_GAP)
      - (t as number) * HOVER_EDGE_DELTA,   // moves further up as card expands
  );
  const co0rot = useTransform(
    [cr0, hs0],
    ([rot, t]) => (rot as number) * (1 - (t as number)), // straightens on hover
  );

  // Card 1 — Artifacts — BELOW — hover-only (hs1 is also the opacity)
  const co1y = useTransform(
    [spread, hs1],
    ([sp, t]) =>
      (sp as number) * CARDS[1].arcY
      + (CARD_H / 2 + CALLOUT_GAP)
      + (t as number) * HOVER_EDGE_DELTA,
  );
  const co1rot = useTransform(
    [cr1, hs1],
    ([rot, t]) => (rot as number) * (1 - (t as number)),
  );

  // Card 2 — Home — ABOVE — hover-only (hs2 is also the opacity)
  const co2y = useTransform(
    [spread, hs2],
    ([sp, t]) =>
      (sp as number) * CARDS[2].arcY
      - (CARD_H / 2 + CALLOUT_GAP)
      - (t as number) * HOVER_EDGE_DELTA,
  );
  // cr2 is always 0 (Home has no arc tilt), so rotation stays 0 — no transform needed.

  // Card 3 — Language Mix — BELOW — persistent
  const co3y = useTransform(
    [spread, hs3],
    ([sp, t]) =>
      (sp as number) * CARDS[3].arcY
      + (CARD_H / 2 + CALLOUT_GAP)
      + (t as number) * HOVER_EDGE_DELTA,
  );
  const co3rot = useTransform(
    [cr3, hs3],
    ([rot, t]) => (rot as number) * (1 - (t as number)),
  );

  // Card 4 — Analytics — ABOVE — hover-only (hs4 is also the opacity)
  const co4y = useTransform(
    [spread, hs4],
    ([sp, t]) =>
      (sp as number) * CARDS[4].arcY
      - (CARD_H / 2 + CALLOUT_GAP)
      - (t as number) * HOVER_EDGE_DELTA,
  );
  const co4rot = useTransform(
    [cr4, hs4],
    ([rot, t]) => (rot as number) * (1 - (t as number)),
  );

  /* ── Mobile-persistent opacity for hover-only callouts ────────────────── */
  // On mobile there is no hover, so cards 1, 2, 4 use the same scroll-driven
  // opacity as the persistent callouts. On desktop they stay hover-only.
  const isMobileMotion = useMotionValue(0);
  useEffect(() => {
    isMobileMotion.set(isMobile ? 1 : 0);
  }, [isMobile, isMobileMotion]);

  const co1opacity = useTransform(
    [calloutScrollOpacity, hs1, isMobileMotion],
    ([s, h, m]) => (m as number) > 0.5 ? (s as number) : (h as number),
  );
  const co2opacity = useTransform(
    [calloutScrollOpacity, hs2, isMobileMotion],
    ([s, h, m]) => (m as number) > 0.5 ? (s as number) : (h as number),
  );
  const co4opacity = useTransform(
    [calloutScrollOpacity, hs4, isMobileMotion],
    ([s, h, m]) => (m as number) > 0.5 ? (s as number) : (h as number),
  );

  const cardMotions = [
    { x: cx0, y: cy0, rotate: cr0 },
    { x: cx1, y: cy1, rotate: cr1 },
    { x: cx2, y: cy2, rotate: cr2 },
    { x: cx3, y: cy3, rotate: cr3 },
    { x: cx4, y: cy4, rotate: cr4 },
  ];

  /* ── Shared border class ───────────────────────────────────────────────── */
  const borderCls = `border-t ${isLight ? "border-zinc-200" : "border-white/5"}`;

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Mobile: full-bleed slider ─────────────────────────────────────── */}
      {isMobile && (
        <section className={`relative ${borderCls} pt-10 pb-8`}>

          {/* Heading — padded */}
          <div className="px-5 text-center mb-3">
            <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
              {t("dashboard.gallery.label")}
            </span>
            <h2 className={`text-3xl font-bold tracking-tight leading-tight ${isLight ? "text-zinc-900" : "text-white"}`}>
              {t("dashboard.gallery.title")}
            </h2>
          </div>

          {/* Expand tip — padded */}
          <div className="px-5 flex justify-end mb-4">
            <span className={`flex items-center gap-1 text-[10px] font-light tracking-wide ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>
              <Maximize2 className="w-3 h-3 shrink-0" />
              {t("dashboard.gallery.expandTip")}
            </span>
          </div>

          {/* Full-bleed 2:1 image container — no horizontal padding */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2 / 1" }}>

            {/* Animated slide */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileSlide}
                className="absolute inset-0"
                initial={{ opacity: 0, x: slideDirection * 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection * -32 }}
                transition={{ duration: 0.24, ease: "easeInOut" }}
              >
                <button
                  className="block w-full h-full cursor-zoom-in"
                  onClick={() => setLightbox(mobileSlide)}
                  aria-label={t(`dashboard.gallery.cards.${CARDS[mobileSlide].key}`)}
                >
                  <img
                    src={CARDS[mobileSlide].image}
                    alt={t(`dashboard.gallery.cards.${CARDS[mobileSlide].key}`)}
                    className="w-full h-full object-cover object-top"
                    draggable={false}
                  />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Feature label — frosted-glass pill overlaid at bottom centre.
                Animates with the slide; avoids the garish green-box look by
                using a neutral dark glass that reads on any screenshot colour. */}
            <AnimatePresence mode="wait" initial={false}>
              {(() => {
                const card = CARDS[mobileSlide];
                const Icon = card.Icon;
                return (
                  <motion.div
                    key={mobileSlide + "-caption"}
                    className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide whitespace-nowrap px-4 py-2 rounded-full"
                      style={{
                        color:                "rgba(255,255,255,0.95)",
                        background:           "rgba(0,0,0,0.45)",
                        backdropFilter:       "blur(12px) saturate(160%)",
                        WebkitBackdropFilter: "blur(12px) saturate(160%)",
                        border:               "1px solid rgba(255,255,255,0.18)",
                        boxShadow:            "0 2px 12px rgba(0,0,0,0.35)",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 text-primary" />
                      {t(`dashboard.gallery.cards.${card.key}`)}
                    </span>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Liquid-glass chevron arrows — overlaid on the image sides.
                bg, border, and box-shadow tuned for contrast on both light and
                dark screenshots; always use white icons with a text-shadow. */}
            {(() => {
              const arrowStyle: React.CSSProperties = {
                background:           isLight
                  ? "rgba(255,255,255,0.60)"
                  : "rgba(20,20,20,0.40)",
                backdropFilter:       "blur(14px) saturate(180%)",
                WebkitBackdropFilter: "blur(14px) saturate(180%)",
                border:               isLight
                  ? "1px solid rgba(0,0,0,0.10)"
                  : "1px solid rgba(255,255,255,0.28)",
                boxShadow: isLight
                  ? "0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.8)"
                  : "0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
              };
              const iconCls = isLight ? "text-zinc-800" : "text-white";
              return (
                <>
                  <button
                    onClick={handleSlidePrev}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2 transition-transform duration-150 active:scale-90"
                    style={arrowStyle}
                  >
                    <ChevronLeft className={`w-5 h-5 ${iconCls}`} />
                  </button>
                  <button
                    onClick={handleSlideNext}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 transition-transform duration-150 active:scale-90"
                    style={arrowStyle}
                  >
                    <ChevronRight className={`w-5 h-5 ${iconCls}`} />
                  </button>
                </>
              );
            })()}
          </div>

          {/* Dot / pill indicators — padded */}
          <div className="px-5 flex justify-center items-center gap-1.5 mt-4">
            {CARDS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  setSlideDirection(i > mobileSlide ? 1 : -1);
                  setMobileSlide(i);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === mobileSlide
                    ? "bg-primary w-5 h-1.5"
                    : `w-1.5 h-1.5 ${isLight ? "bg-zinc-300 hover:bg-zinc-400" : "bg-white/30 hover:bg-white/50"}`
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Desktop: scroll-driven fan ────────────────────────────────────── */}
      {/* NOTE: containerRef div is always rendered (even on mobile) so that
          useScroll({ target: containerRef }) never encounters a null ref,
          which would throw "Target ref is defined but not hydrated". */}
      <section
        className={`relative ${borderCls} ${isMobile ? "hidden" : ""}`}
        style={{ overflowX: "clip" }}
      >
        <div ref={containerRef} style={{ height: "300vh" }}>
          <div
            className={`sticky top-0 flex flex-col items-center ${isMobile ? "py-10" : "justify-center"}`}
            style={isMobile ? undefined : { height: "100vh" }}
          >

            {/* ── Heading ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-2 px-4 relative z-20 w-full"
            >
              <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
                {t("dashboard.gallery.label")}
              </span>
              <h2
                className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${
                  isLight ? "text-zinc-900" : "text-white"
                }`}
              >
                {t("dashboard.gallery.title")}
              </h2>
            </motion.div>

            {/* ── "Click to expand" tip ───────────────────────────────── */}
            {/* Right-aligned, thin, minimal vertical footprint. */}
            <div className="w-full flex justify-end px-6 md:px-10 mb-3 relative z-20">
              <span
                className={`flex items-center gap-1 text-[10px] font-light tracking-wide ${
                  isLight ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                <Maximize2 className="w-3 h-3 shrink-0" />
                {t("dashboard.gallery.expandTip")}
              </span>
            </div>

            {/* ── Card stage ──────────────────────────────────────────── */}
            {/* Stage extra height is reduced on mobile (callouts are simpler).
                Negative margins cancel the phantom whitespace that CSS scale()
                leaves behind in the document flow. */}
            {(() => {
              const stageH = CARD_H + (isMobile ? 160 : 320);
              return (
            <div
              className="relative flex items-center justify-center"
              style={{
                height: `${stageH}px`,
                width: "100%",
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                marginTop:    `${-(stageH * (1 - scale)) / 2}px`,
                marginBottom: `${-(stageH * (1 - scale)) / 2}px`,
              }}
            >

              {/* Cards */}
              {CARDS.map((card, i) => {
                const m     = cardMotions[i];
                const isHov = hovered === i;
                return (
                  <motion.div
                    key={card.key}
                    className={`absolute select-none ${isFullyExpanded ? "cursor-zoom-in" : "cursor-default"}`}
                    style={{
                      x:             m.x,
                      y:             m.y,
                      rotate:        m.rotate,
                      zIndex:        isHov ? 50 : card.z,
                      // Disable all pointer interaction until cards are fully spread.
                      // This prevents accidental hover during the fan-out animation.
                      pointerEvents: isFullyExpanded ? "auto" : "none",
                    }}
                    // Scale larger than before; rotate → 0 so card & callout
                    // both become straight in sync.
                    whileHover={{
                      scale:  HOVER_SCALE,
                      rotate: 0,
                      transition: { type: "spring", ...SPRING },
                    }}
                    onHoverStart={() => setHovered(i)}
                    onHoverEnd={()  => setHovered(null)}
                    onClick={() => setLightbox(i)}
                  >
                    <div
                      className={`rounded-2xl overflow-hidden shadow-2xl ring-1 transition-shadow duration-300 ${
                        isLight
                          ? "ring-black/10 hover:shadow-[0_20px_60px_-10px_rgba(200,223,82,0.35)]"
                          : "ring-white/10 hover:shadow-[0_20px_60px_-10px_rgba(200,223,82,0.3)]"
                      }`}
                      style={{ width: `${CARD_W}px`, height: `${CARD_H}px` }}
                    >
                      <img
                        src={card.image}
                        alt={t(`dashboard.gallery.cards.${card.key}`)}
                        className="w-full h-full object-cover object-top"
                        width={CARD_W}
                        height={CARD_H}
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                );
              })}

              {/* ── Callout: Completion Rates (card 0, ABOVE) ─────────── */}
              {/* x tracks card 0; y moves further up when card expands so the
                  gap stays constant; rotate straightens in sync with card. */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  x:       cx0,
                  y:       co0y,
                  rotate:  co0rot,
                  opacity: cop0,
                  zIndex:  60,
                }}
              >
                <span className="inline-flex items-center gap-1.5 bg-primary text-black text-[11px] font-bold px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  {t("dashboard.gallery.cards.completionRates")}
                </span>
              </motion.div>

              {/* ── Callout: Language Mix (card 3, BELOW) — persistent ── */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ x: cx3, y: co3y, rotate: co3rot, opacity: cop3, zIndex: 60 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-primary text-black text-[11px] font-bold px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
                  <Languages className="w-3.5 h-3.5 shrink-0" />
                  {t("dashboard.gallery.cards.languageMix")}
                </span>
              </motion.div>

              {/* ── Callout: Artifacts (card 1, BELOW) — hover / mobile-persistent ── */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ x: cx1, y: co1y, rotate: co1rot, opacity: co1opacity, zIndex: 60 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-primary text-black text-[11px] font-bold px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  {t("dashboard.gallery.cards.artifacts")}
                </span>
              </motion.div>

              {/* ── Callout: Home (card 2, ABOVE) — hover / mobile-persistent ──── */}
              {/* cr2 is always 0 so rotate is omitted — Home has no arc tilt. */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ x: cx2, y: co2y, opacity: co2opacity, zIndex: 60 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-primary text-black text-[11px] font-bold px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                  {t("dashboard.gallery.cards.home")}
                </span>
              </motion.div>

              {/* ── Callout: Analytics (card 4, ABOVE) — hover / mobile-persistent ── */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ x: cx4, y: co4y, rotate: co4rot, opacity: co4opacity, zIndex: 60 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-primary text-black text-[11px] font-bold px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
                  <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                  {t("dashboard.gallery.cards.analytics")}
                </span>
              </motion.div>
            </div>
            ); })()}
          </div>
        </div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              key="lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm"
              style={{ zIndex: 9999 }}
              onClick={() => setLightbox(null)}
            >
              <motion.div
                key="lightbox-content"
                initial={{ scale: 0.88, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                // On mobile constrain to viewport width so the image never crops.
                className="relative w-full mx-auto"
                style={{ maxWidth: "min(64rem, calc(100vw - 2rem))" }}
                onClick={e => e.stopPropagation()}
              >
                {/* Title ABOVE the image — centred */}
                <p className="text-center text-white/70 text-xs md:text-sm font-semibold tracking-wide mb-3">
                  {t(`dashboard.gallery.cards.${CARDS[lightbox].key}`)}
                </p>

                {/* Image + lens wrapper */}
                <div
                  className="relative"
                  onMouseMove={handleZoomMove}
                  onMouseLeave={() => setZoomPos(null)}
                  style={{ cursor: zoomPos ? "zoom-in" : "default" }}
                >
                  <img
                    ref={lightboxImgRef}
                    src={CARDS[lightbox].image}
                    alt={t(`dashboard.gallery.cards.${CARDS[lightbox].key}`)}
                    className="w-full rounded-xl md:rounded-2xl shadow-2xl block"
                    draggable={false}
                  />

                  {/* Magnifier lens */}
                  {zoomPos && (
                    <div
                      className="absolute pointer-events-none rounded-full overflow-hidden"
                      style={{
                        left:      zoomPos.lensX,
                        top:       zoomPos.lensY,
                        width:     LENS,
                        height:    LENS,
                        border:    "2px solid rgba(255,255,255,0.5)",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.65)",
                        zIndex:    20,
                      }}
                    >
                      <img
                        src={CARDS[lightbox].image}
                        alt=""
                        draggable={false}
                        style={{
                          position: "absolute",
                          width:    `${zoomPos.bgW}px`,
                          height:   `${zoomPos.bgH}px`,
                          left:     `${zoomPos.bgX}px`,
                          top:      `${zoomPos.bgY}px`,
                          maxWidth: "none",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Mobile: centred close button below image */}
                <div className="mt-4 flex justify-center md:hidden">
                  <button
                    onClick={() => setLightbox(null)}
                    aria-label="Close"
                    className="bg-white hover:bg-white/90 transition-colors duration-150 rounded-full p-2.5 shadow-lg"
                  >
                    <X className="w-5 h-5 text-zinc-900" />
                  </button>
                </div>

                {/* Desktop close — absolute top-right corner of image */}
                <button
                  onClick={() => setLightbox(null)}
                  aria-label="Close"
                  className="hidden md:block absolute top-3 right-3 bg-white hover:bg-white/90 transition-colors duration-150 rounded-full p-2 shadow-lg"
                >
                  <X className="w-5 h-5 text-zinc-900" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
