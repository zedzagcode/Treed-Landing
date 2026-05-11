import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

import batteryImg from "@assets/18650_Battery_1771069493985.png";
import chargingImg from "@assets/Handset_Charging_2_1771069493987.png";
import globeImg from "@assets/globe_1771069500181.png";
import designImg from "@assets/Design_2_1771069530085.png";
import statuesImg from "@assets/Statues_1771069530085.png";
import espImg from "@assets/ESP_Final_1771069546582.png";
import syncImg from "@assets/Sync_1771070860371.png";

const SLIDE_IMAGES = [designImg, espImg, globeImg, chargingImg, syncImg, statuesImg, batteryImg];
const AUTOPLAY_INTERVAL = 7000;
const GAP = 16;

function useCardWidth() {
  const [cardW, setCardW] = useState(72);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCardW(88);
      else if (w < 1024) setCardW(78);
      else setCardW(72);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cardW;
}

export default function FeatureHighlights() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const slidesContent = t("handset.feature_highlights.slides", { returnObjects: true }) as Array<{
    title: string;
    desc: string;
    link_text?: string;
    link_href?: string;
  }>;
  
  const totalSlides = slidesContent.length;
  const virtualSlides = [
    { ...slidesContent[totalSlides - 1], image: SLIDE_IMAGES[totalSlides - 1], originalIndex: totalSlides - 1 },
    ...slidesContent.map((s, i) => ({ ...s, image: SLIDE_IMAGES[i], originalIndex: i })),
    { ...slidesContent[0], image: SLIDE_IMAGES[0], originalIndex: 0 }
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const cardW = useCardWidth();
  
  const elapsed = useRef(0);
  const lastTick = useRef(Date.now());
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerInfo = useRef<{ x: number; time: number; pointerId: number } | null>(null);
  const didDrag = useRef(false);

  const resetProgress = useCallback(() => {
    elapsed.current = 0;
    lastTick.current = Date.now();
    setProgress(0);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalSlides);
    } else if (currentIndex === totalSlides + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  }, [currentIndex, totalSlides]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    resetProgress();
  }, [resetProgress]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
    resetProgress();
  }, [resetProgress]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index + 1);
    resetProgress();
  }, [resetProgress]);

  useEffect(() => {
    const tick = () => {
      const running = isPlaying && !isTextHovered && !isDragging && isTransitioning;
      if (running) {
        const now = Date.now();
        elapsed.current += now - lastTick.current;
        lastTick.current = now;
        const pct = Math.min(elapsed.current / AUTOPLAY_INTERVAL, 1);
        setProgress(pct);
        if (pct >= 1) {
          next();
          return;
        }
      } else {
        lastTick.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, isTextHovered, isDragging, isTransitioning, next]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerInfo.current = { x: e.clientX, time: Date.now(), pointerId: e.pointerId };
    didDrag.current = false;
    setIsDragging(true);
    setDragDelta(0);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointerInfo.current) return;
    const dx = e.clientX - pointerInfo.current.x;
    if (Math.abs(dx) > 5) didDrag.current = true;
    setDragDelta(dx);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!pointerInfo.current) return;
    const dx = e.clientX - pointerInfo.current.x;
    const dt = Math.max(Date.now() - pointerInfo.current.time, 1);
    pointerInfo.current = null;
    setIsDragging(false);
    setDragDelta(0);

    const velocity = Math.abs(dx) / dt;
    const threshold = velocity > 0.4 ? 25 : 80;

    if (Math.abs(dx) > threshold) {
      if (dx < 0) next();
      else prev();
    }
  }, [next, prev]);

  const getTransformPx = () => {
    if (!containerRef.current) return '0px';
    const containerW = containerRef.current.offsetWidth;
    const cardPx = (cardW / 100) * containerW;
    const centerOffset = (containerW - cardPx) / 2;
    const baseOffset = -(currentIndex * (cardPx + GAP)) + centerOffset;
    const total = baseOffset + dragDelta;
    return `${total}px`;
  };

  const activeOriginalIndex = virtualSlides[currentIndex].originalIndex;

  return (
    <section 
      className="relative py-12 md:py-20 lg:py-24 bg-[#050505]" 
      style={{ backgroundColor: '#050505', color: '#ffffff' }}
      data-testid="feature-highlights-section"
    >
      {/* Redesigned Centered Heading */}
      <div className="container mx-auto px-6 mb-12 md:mb-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="h-[1px] flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm">
              {t('handset.feature_highlights.label', { defaultValue: 'Discover' })}
            </span>
            <div className="h-[1px] flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none" style={{ color: '#ffffff' }}>
            {t('handset.feature_highlights.title1', { defaultValue: 'Feature' })} <span className="text-primary">{t('handset.feature_highlights.title2', { defaultValue: 'Highlights' })}</span>
          </h2>
        </motion.div>
        
        {/* Subtle glow background for heading */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      </div>

      <div className="relative w-full">
        <div
          ref={containerRef}
          className="relative w-full touch-pan-y select-none overflow-visible mb-[-20px] sm:mb-[-28px] md:mb-[-36px]"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerInfo.current = null;
            setIsDragging(false);
            setDragDelta(0);
          }}
        >
          <div
            className="flex will-change-transform"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${getTransformPx()})`,
              transition: (isDragging || !isTransitioning) ? 'none' : 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              gap: `${GAP}px`,
            }}
          >
            {virtualSlides.map((s, i) => {
              const isActive = i === currentIndex;
              const isBatterySlide = s.originalIndex === 6;
              return (
                <div
                  key={`${s.originalIndex}-${i}`}
                  className="shrink-0 relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5"
                  style={{
                    width: `${cardW}%`,
                    transition: (isDragging || !isTransitioning) ? 'none' : 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
                    opacity: isActive ? 1 : 0.3,
                    filter: isActive ? 'none' : 'brightness(0.3) saturate(0.4)',
                    transform: isActive ? 'scale(1)' : 'scale(0.98)',
                  }}
                  onClick={() => {
                    if (!didDrag.current && !isActive) {
                      goTo(s.originalIndex);
                    }
                  }}
                >
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <img
                      src={s.image}
                      alt={s.title}
                      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${isBatterySlide ? 'object-top' : ''}`}
                      draggable={false}
                      loading="eager"
                    />
                    {!isLight && <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-transparent pointer-events-none" />}
                    {!isLight && <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />}

                    <div
                      className="absolute top-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12 z-10"
                      onMouseEnter={() => { if (isActive) setIsTextHovered(true); }}
                      onMouseLeave={() => setIsTextHovered(false)}
                    >
                      <div
                        className={`carousel-slide-text max-w-md transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'} ${isLight ? 'drop-shadow-lg' : ''}`}
                      >
                        <h3 className="carousel-slide-title text-base sm:text-lg md:text-xl lg:text-3xl font-bold mb-1 md:mb-2 leading-snug tracking-tight">
                          {s.title}
                        </h3>
                        <p className="carousel-slide-desc text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed max-w-sm font-light line-clamp-none sm:line-clamp-2 md:line-clamp-3 text-white/80">
                          {s.desc}
                        </p>
                        {s.link_text && s.link_href && (
                          <a
                            href={s.link_href}
                            className="carousel-slide-link inline-flex items-center gap-1.5 text-primary font-bold text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.2em] hover:text-white transition-colors group cursor-pointer mt-2 md:mt-4"
                            onClick={(e) => { if (didDrag.current) e.preventDefault(); }}
                          >
                            {s.link_text}
                            <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform group-hover:translate-x-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Controls */}
        <div className="sticky bottom-2 sm:bottom-4 md:bottom-6 w-full flex justify-center z-20 pointer-events-none py-4 md:py-6">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full border backdrop-blur-md shadow-2xl pointer-events-auto ${isLight ? "bg-zinc-900 border-zinc-700" : "bg-black/40 border-white/10"}`}>
            {slidesContent.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative focus:outline-none flex items-center"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className={`
                    rounded-full transition-all duration-500 ease-out overflow-hidden
                    ${i === activeOriginalIndex
                      ? `w-8 sm:w-10 md:w-12 h-2 border border-primary/30 ${isLight ? "bg-zinc-700" : "bg-zinc-800/80"}`
                      : `w-2 h-2 ${isLight ? "bg-zinc-500 hover:bg-zinc-300" : "bg-zinc-600/60 hover:bg-zinc-400"}`
                  }
                `}
                >
                  {i === activeOriginalIndex && (
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${progress * 100}%`, transition: 'none', backgroundColor: isLight ? '#4d6012' : '#C8DF52' }}
                    />
                  )}
                </div>
              </button>
            ))}

            <div className={`w-px h-3.5 mx-1 ${isLight ? "bg-zinc-500" : "bg-white/15"}`} />

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`w-7 h-7 rounded-full flex items-center justify-center hover:text-primary transition-colors focus:outline-none ${isLight ? "text-zinc-300" : "text-white/50"}`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
