import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
  useInView,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";

// Handset colour variants
import HandsetJetBlack   from "@assets/handset-jet-black.png";
import HandsetGunmetal   from "@assets/handset-gunmetal.png";
import HandsetVintageRed from "@assets/handset-vintage-red.png";
import HandsetOliveGreen from "@assets/handset-olive-green.png";
import HandsetIceWhite   from "@assets/handset-ice-white.png";

// Box colour variants
import BoxJetBlack   from "@assets/box-jet-black.png";
import BoxGunmetal   from "@assets/box-gunmetal.png";
import BoxVintageRed from "@assets/box-vintage-red.png";
import BoxOliveGreen from "@assets/box-olive-green.png";
import BoxIceWhite   from "@assets/box-ice-white.png";

// Watch colour variants
import WatchJetBlack   from "@assets/watch-jet-black.png";
import WatchGunmetal   from "@assets/watch-gunmetal.png";
import WatchVintageRed from "@assets/watch-vintage-red.png";
import WatchOliveGreen from "@assets/watch-olive-green.png";
import WatchIceWhite   from "@assets/watch-ice-white.png";

// Custom colour variants
import CustomJetBlack    from "@assets/custom-jet-black.png";
import CustomDeepBlue    from "@assets/custom-deep-blue.png";
import CustomSpaceBlue   from "@assets/custom-space-blue.png";
import CustomLilacPurple from "@assets/custom-lilac-purple.png";
import CustomVintageRed  from "@assets/custom-vintage-red.png";

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

const COLORS: ColorOption[] = [
  { id: "jet-black",   label: "Jet Black",    hex: "#0A0A0A" },
  { id: "gunmetal",    label: "Gunmetal Gray", hex: "#242424" },
  { id: "vintage-red", label: "Vintage Red",   hex: "#D12530" },
  { id: "olive-green", label: "Jade Green",    hex: "#293A24" },
  { id: "ice-white",   label: "Ice White",     hex: "#D9D9D9" },
];

interface CardData {
  key: string;
  image: string;
  colorImages: Record<string, string>; // color-id → imported image
  colors?: ColorOption[];              // override palette (e.g. Custom card)
  alt: string;
  title: string;
  desc: string;
  comingSoon: boolean;
  designYourOwn?: boolean;
}

const SHAPE_CHARS = "◆◉●■▲✦◈⬡◇◎▶◀▼⬟⬠✧★◑◐◒";

function getRandomShape() {
  return SHAPE_CHARS[Math.floor(Math.random() * SHAPE_CHARS.length)];
}

function ScrambleWord({ word, className }: { word: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(word.split("").map(() => getRandomShape()));
  const [settled, setSettled] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setInterval>[]>([]);

  const start = useCallback(() => {
    timerRefs.current.forEach(clearInterval);
    timerRefs.current = [];
    setSettled(false);

    word.split("").forEach((char, idx) => {
      const delay = setTimeout(() => {
        let cycles = 0;
        const interval = setInterval(() => {
          setDisplay((prev) => {
            const next = [...prev];
            next[idx] = cycles >= 6 ? char : getRandomShape();
            return next;
          });
          cycles++;
          if (cycles > 8) {
            clearInterval(interval);
            if (idx === word.length - 1) setSettled(true);
          }
        }, 55);
        timerRefs.current.push(interval);
      }, idx * 90);
      timerRefs.current.push(delay as unknown as ReturnType<typeof setInterval>);
    });
  }, [word]);

  useEffect(() => {
    if (isInView) start();
    return () => timerRefs.current.forEach(clearInterval);
  }, [isInView, start]);

  return (
    <span ref={ref} className={className} aria-label={word}>
      {display.map((ch, i) => (
        <span
          key={i}
          className={settled ? "transition-none" : "transition-colors duration-75"}
          style={{ display: "inline-block", minWidth: ch === " " ? "0.3em" : undefined }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function ProgressDot({
  index,
  total,
  scrollYProgress,
  isLight,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isLight: boolean;
}) {
  const width = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [8, 32]
  );
  const backgroundColor = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [isLight ? "#d4d4d8" : "#27272a", "#C8DF52"]
  );
  return (
    <motion.div
      className="h-[3px] rounded-full flex-none"
      style={{ width, backgroundColor }}
    />
  );
}

/**
 * Thin fill-line at the bottom of a card — acts as a segment of the overall
 * scroll progress bar. Once a card's segment is passed it stays at 100%.
 */
function CardProgressLine({
  scrollYProgress,
  index,
  total,
  isLight,
}: {
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
  isLight: boolean;
}) {
  const scaleX = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    [0, 1],
  );
  return (
    <div
      className={`relative h-[3px] w-full flex-none overflow-hidden ${
        isLight ? "bg-zinc-100" : "bg-zinc-800"
      }`}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-full bg-primary"
        style={{ scaleX, transformOrigin: "left center" }}
      />
    </div>
  );
}

function FormFactorCard({
  card,
  isLight,
  selectedColorId = null,
  onColorChange = () => {},
  showColors = true,
  showDesc = true,
  compact = false,
  fill = false,
  progressBar,
}: {
  card: CardData;
  isLight: boolean;
  selectedColorId?: string;
  onColorChange?: (id: string) => void;
  showColors?: boolean;
  showDesc?: boolean;
  compact?: boolean;
  /** fill=true: image grows to fill parent height (parent must have explicit height) */
  fill?: boolean;
  /** Optional thin progress line rendered at the very bottom of the card */
  progressBar?: React.ReactNode;
}) {
  const { t } = useTranslation();

  const displayImage =
    (selectedColorId && card.colorImages[selectedColorId]) || card.image;

  const gradient = (
    <div
      className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none ${
        isLight
          ? "bg-gradient-to-t from-white/20 to-transparent"
          : "bg-gradient-to-t from-zinc-900/50 to-transparent"
      }`}
    />
  );

  return (
    <div
      data-testid={`card-formfactor-${card.key}`}
      className={`flex flex-col rounded-[2rem] overflow-hidden border transition-all duration-500 ${
        fill ? "h-full" : ""
      } ${
        isLight
          ? "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md"
          : "bg-zinc-900/70 border-white/[0.07] hover:border-white/[0.12] backdrop-blur-xl"
      }`}
    >
      {fill ? (
        /* Desktop grid: image stretches to fill all available height */
        <div className="relative flex-1 min-h-0 overflow-hidden bg-zinc-950">
          <img
            src={displayImage}
            alt={card.alt}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            draggable={false}
          />
          {gradient}
        </div>
      ) : (
        /* Mobile / aspect-ratio mode */
        <div
          className="relative overflow-hidden bg-zinc-950 flex-shrink-0"
          style={{ aspectRatio: "4/5" }}
        >
          <img
            src={displayImage}
            alt={card.alt}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            draggable={false}
          />
          {gradient}
        </div>
      )}

      {/* Text — always padding-based so card height responds to hidden elements */}
      <div className={`flex-none ${compact ? "py-3 px-4" : "py-5 px-6"} flex flex-col`}>

        {/* Row 1: title + badges — always visible, never wraps swatches so height is consistent */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            data-testid={`text-formfactor-title-${card.key}`}
            className={`text-base font-bold tracking-tight leading-tight ${
              isLight ? "text-zinc-900" : "text-white"
            }`}
          >
            {card.title}
          </h3>
          {card.comingSoon && (
            <span className="text-[8px] uppercase tracking-[0.18em] text-primary font-bold border border-primary/40 rounded-full px-2 py-0.5 whitespace-nowrap leading-none flex-shrink-0">
              {t("handset.formFactors.comingSoon")}
            </span>
          )}
          {card.designYourOwn && (
            <span className="text-[8px] uppercase tracking-[0.18em] text-zinc-300 font-bold border border-white/20 rounded-full px-2 py-0.5 whitespace-nowrap leading-none flex-shrink-0 bg-white/5">
              {t("handset.formFactors.designYourOwn")}
            </span>
          )}
        </div>

        {/* Row 2: color swatches — own line below title, overflow:visible so glow isn't clipped */}
        <div
          role="group"
          aria-label="Select colour"
          style={{
            maxHeight: showColors ? "26px" : "0px",
            overflow: showColors ? "visible" : "hidden",
            opacity: showColors ? 1 : 0,
            marginTop: showColors ? "8px" : "0px",
            pointerEvents: showColors ? "auto" : "none",
            transition: "max-height 0.35s ease, opacity 0.35s ease, margin-top 0.35s ease",
          }}
        >
          <div className="flex items-center gap-[5px] py-[2px]">
            {(card.colors ?? COLORS).map((color) => {
              const isSelected = selectedColorId === color.id;
              return (
                <button
                  key={color.id}
                  title={color.label}
                  aria-label={`${color.label}${isSelected ? " (selected)" : ""}`}
                  aria-pressed={isSelected}
                  onClick={(e) => { e.stopPropagation(); onColorChange(color.id); }}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: color.hex,
                    border: isSelected
                      ? "1.5px solid rgba(200,223,82,0.6)"
                      : `1.5px solid ${
                          color.id === "ice-white"
                            ? "rgba(0,0,0,0.2)"
                            : "rgba(255,255,255,0.12)"
                        }`,
                    boxShadow: isSelected
                      ? "0 0 0 2px rgba(200,223,82,0.25)"
                      : "none",
                    transform: isSelected ? "scale(1.18)" : "scale(1)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease, border 0.15s ease",
                    cursor: "pointer",
                    flexShrink: 0,
                    padding: 0,
                    display: "block",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Row 3: description — slides in/out, unclamped so full text is visible */}
        <p
          data-testid={`text-formfactor-desc-${card.key}`}
          className={`text-xs leading-relaxed ${
            isLight ? "text-zinc-500" : "text-zinc-400"
          }`}
          style={{
            maxHeight: showDesc ? "8rem" : "0px",
            opacity: showDesc ? 1 : 0,
            overflow: "hidden",
            marginTop: showDesc ? "6px" : "0px",
            transition: "max-height 0.35s ease, opacity 0.35s ease, margin-top 0.35s ease",
          }}
        >
          {card.desc}
        </p>
      </div>

      {/* Slot for the per-card scroll progress line (desktop only) */}
      {progressBar}
    </div>
  );
}

function SplitSubtitle({ text, isLight }: { text: string; isLight: boolean }) {
  const commaIdx = text.indexOf(",");
  if (commaIdx === -1)
    return (
      <p className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
        {text}
      </p>
    );
  const line1 = text.slice(0, commaIdx + 1);
  const line2 = text.slice(commaIdx + 1).trim();
  return (
    <div>
      <p className={`text-sm leading-snug ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>
        {line1}
      </p>
      <p
        className={`text-sm leading-snug font-semibold italic ${
          isLight ? "text-zinc-700" : "text-zinc-200"
        }`}
      >
        {line2}
      </p>
    </div>
  );
}

function AnimatedTitle({
  fullTitle,
  isLight,
  className,
}: {
  fullTitle: string;
  isLight: boolean;
  className?: string;
}) {
  const dotIdx = fullTitle.lastIndexOf(".");
  const lastDot = dotIdx !== -1 ? fullTitle.slice(dotIdx) : "";
  const beforeDot = dotIdx !== -1 ? fullTitle.slice(0, dotIdx) : fullTitle;
  const lastSpaceIdx = beforeDot.lastIndexOf(" ");
  const staticPart =
    lastSpaceIdx !== -1 ? beforeDot.slice(0, lastSpaceIdx + 1) : "";
  const animWord =
    lastSpaceIdx !== -1 ? beforeDot.slice(lastSpaceIdx + 1) : beforeDot;

  return (
    <h2
      data-testid="text-formfactors-title"
      className={`font-bold tracking-tighter leading-[0.93] break-normal whitespace-normal ${className}`}
    >
      <span className={isLight ? "text-zinc-900" : "text-white"}>{staticPart}</span>
      <span className="whitespace-nowrap">
        <ScrambleWord word={animWord + lastDot} className="text-primary" />
      </span>
    </h2>
  );
}

export default function FormFactors() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Default to jet-black for every card
  const [cardColors, setCardColors] = useState<Record<string, string>>({
    handset: "jet-black",
    box:     "jet-black",
    watch:   "jet-black",
    custom:  "jet-black",
  });

  const handleColorChange = (cardKey: string, colorId: string) => {
    setCardColors((prev) => ({ ...prev, [cardKey]: colorId }));
  };

  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const headerContainerRef  = useRef<HTMLDivElement>(null);
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(-1);
  const [trackLeft, setTrackLeft] = useState(40);
  const [cardWidth, setCardWidth] = useState(320);

  const { scrollYProgress: desktopScrollYProgress } = useScroll({
    target: desktopContainerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(desktopScrollYProgress, "change", (v) => {
    // Keep all cards at rest size until scrolling actually begins
    if (v < 0.02) { setDesktopActiveIndex(-1); return; }
    setDesktopActiveIndex(Math.min(3, Math.floor(v * 4)));
  });

  // Compute container left edge from CSS breakpoints (avoids getBoundingClientRect timing issues)
  const computeContainerLeft = useCallback((vw: number): number => {
    if (vw >= 1536) return Math.max(80, (vw - 1400) / 2 + 80);
    if (vw >= 1280) return Math.max(64, (vw - 1280) / 2 + 64);
    if (vw >= 1024) return Math.max(48, (vw - 1024) / 2 + 48);
    return 40; // md breakpoint
  }, []);

  // Horizontal translate for desktop overflow row
  const endXMotion = useMotionValue(0);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Left alignment from container CSS
      const left = computeContainerLeft(vw);
      setTrackLeft(left);

      // Dynamic card width: fills available height on large screens, stays proportional on small ones.
      // Scroll hint is now in the header (not in sticky), so overhead is just vertical padding.
      const OVERHEAD = 80;   // top + bottom padding inside sticky panel
      const TEXT_H   = 76;   // text area height when description is shown
      const SCALE    = 1.15;
      const maxByHeight = Math.max(160, ((vh - OVERHEAD) / SCALE - TEXT_H) * (4 / 5));
      // ~2.5 cards visible so scrolling is always needed
      const maxByWidth  = vw * 0.27;
      const CARD_W = Math.min(maxByHeight, maxByWidth);
      setCardWidth(CARD_W);

      const GAP   = 48; // gap-12 = 48px
      const CARDS = 4;
      const trackWidth = left + CARDS * CARD_W + (CARDS - 1) * GAP + CARD_W * 0.4;
      endXMotion.set(Math.min(0, -(trackWidth - vw)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [endXMotion, computeContainerLeft]);

  const x = useTransform(
    [desktopScrollYProgress, endXMotion],
    (latest: number[]) => latest[0] * latest[1]
  );

  // Click a card to scroll to the matching position within the sticky section
  const handleCardClick = useCallback((index: number) => {
    const section = desktopContainerRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const vh = window.innerHeight;
    const sectionHeight = section.offsetHeight;
    const progress = index / 4 + 0.03;
    const targetY = sectionTop + progress * (sectionHeight - vh);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  const cards: CardData[] = [
    {
      key: "handset",
      image: HandsetJetBlack,
      colorImages: {
        "jet-black":   HandsetJetBlack,
        "gunmetal":    HandsetGunmetal,
        "vintage-red": HandsetVintageRed,
        "olive-green": HandsetOliveGreen,
        "ice-white":   HandsetIceWhite,
      },
      alt: "Tree'd flagship museum audio guide handset product render",
      title: t("handset.formFactors.cards.handset.title"),
      desc: t("handset.formFactors.cards.handset.desc"),
      comingSoon: false,
    },
    {
      key: "box",
      image: BoxJetBlack,
      colorImages: {
        "jet-black":   BoxJetBlack,
        "gunmetal":    BoxGunmetal,
        "vintage-red": BoxVintageRed,
        "olive-green": BoxOliveGreen,
        "ice-white":   BoxIceWhite,
      },
      alt: "Tree'd compact box form factor audio device with AUX port",
      title: t("handset.formFactors.cards.box.title"),
      desc: t("handset.formFactors.cards.box.desc"),
      comingSoon: false,
    },
    {
      key: "watch",
      image: WatchJetBlack,
      colorImages: {
        "jet-black":   WatchJetBlack,
        "gunmetal":    WatchGunmetal,
        "vintage-red": WatchVintageRed,
        "olive-green": WatchOliveGreen,
        "ice-white":   WatchIceWhite,
      },
      alt: "Tree'd wearable museum device concept",
      title: t("handset.formFactors.cards.watch.title"),
      desc: t("handset.formFactors.cards.watch.desc"),
      comingSoon: true,
    },
    {
      key: "custom",
      image: CustomJetBlack,
      colorImages: {
        "jet-black":    CustomJetBlack,
        "deep-blue":    CustomDeepBlue,
        "space-blue":   CustomSpaceBlue,
        "lilac-purple": CustomLilacPurple,
        "vintage-red":  CustomVintageRed,
      },
      colors: [
        { id: "jet-black",    label: "Jet Black",    hex: "#0A0A0A" },
        { id: "space-blue",   label: "Space Blue",   hex: "#4E597D" },
        { id: "vintage-red",  label: "Vintage Red",  hex: "#D12530" },
        { id: "deep-blue",    label: "Deep Blue",    hex: "#2B4EB8" },
        { id: "lilac-purple", label: "Lilac Purple", hex: "#8D749E" },
      ],
      alt: "Tree'd custom form factor museum device concept",
      title: t("handset.formFactors.cards.custom.title"),
      desc: t("handset.formFactors.cards.custom.desc"),
      comingSoon: false,
      designYourOwn: true,
    },
  ];

  return (
    <>
      {/* ─── Mobile layout ─── */}
      <div className={`block md:hidden ${isLight ? "bg-white" : "bg-[#050505]"}`}>
        {/* Header — scrolls away before sticky section pins */}
        <div className="px-6 pt-20 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
              {t("handset.formFactors.label")}
            </span>
            <AnimatedTitle
              fullTitle={t("handset.formFactors.title")}
              isLight={isLight}
              className="text-4xl mb-3"
            />
            <SplitSubtitle
              text={t("handset.formFactors.subtitle")}
              isLight={isLight}
            />
          </motion.div>
        </div>

        {/* Static 2×2 grid — no animation, text and colors always visible */}
        <div className="px-4 pb-12 grid grid-cols-2 gap-3">
          {cards.map((card) => (
            <FormFactorCard
              key={card.key}
              card={card}
              isLight={isLight}
              selectedColorId={cardColors[card.key]}
              onColorChange={(id) => handleColorChange(card.key, id)}
              showColors={true}
              showDesc={true}
              compact
            />
          ))}
        </div>
      </div>

      {/* ─── Desktop: header (free scroll) + sticky scrollytelling ─── */}
      <div className={`hidden md:block overflow-x-clip ${isLight ? "bg-white" : "bg-[#050505]"}`}>

        {/* Header — normal flow; scroll hint sits to the right, bottom-aligned with subtitle */}
        <div ref={headerContainerRef} className="container mx-auto pt-20 pb-8">
          <div className="flex items-end gap-16">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
                {t("handset.formFactors.label")}
              </span>
              <AnimatedTitle
                fullTitle={t("handset.formFactors.title")}
                isLight={isLight}
                className="text-4xl xl:text-5xl mb-4"
              />
              <SplitSubtitle
                text={t("handset.formFactors.subtitle")}
                isLight={isLight}
              />
            </motion.div>

            {/* Scroll hint — right column, bottom-aligned with subtitle (text only; progress is on cards) */}
            <div className="flex-none pb-0.5">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? "text-zinc-400" : "text-zinc-600"}`}>
                {t("handset.formFactors.scrollHint")}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll-driven sticky section */}
        <section
          ref={desktopContainerRef}
          className="relative"
          style={{ height: "300vh" }}
        >
          <div className="sticky top-0 h-screen relative py-10">

            {/* Cards row — bottom-aligned so any extra space on large screens sits at the top.
                items-end on BOTH wrappers keeps all card bottoms at the same Y when heights change,
                preventing the jump when description expands/collapses. */}
            <div className="h-full flex items-end overflow-visible pb-2">
              <motion.div
                className="flex gap-12 items-end"
                style={{ x, paddingLeft: trackLeft }}
              >
                {cards.map((card, i) => {
                  const isActive = desktopActiveIndex === i;
                  return (
                    <motion.div
                      key={card.key}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 340, damping: 32 }}
                      style={{
                        width: cardWidth,
                        transformOrigin: "bottom center",
                        zIndex: isActive ? 10 : 1,
                        position: "relative",
                        flexShrink: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => handleCardClick(i)}
                    >
                      <FormFactorCard
                        card={card}
                        isLight={isLight}
                        selectedColorId={cardColors[card.key]}
                        onColorChange={(id) => handleColorChange(card.key, id)}
                        showColors={isActive}
                        showDesc={isActive}
                        progressBar={
                          <CardProgressLine
                            scrollYProgress={desktopScrollYProgress}
                            index={i}
                            total={4}
                            isLight={isLight}
                          />
                        }
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
