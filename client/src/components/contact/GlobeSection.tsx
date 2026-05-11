import { useRef, useEffect } from "react";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { Building2, Building, ExternalLink } from "lucide-react";

// ─── Map geometry ─────────────────────────────────────────────────────────────
const AMS_X   = 902.5, AMS_Y   = 255;
const CAIRO_X = 1051,  CAIRO_Y = 422;
const ARC_D   = `M${AMS_X},${AMS_Y} Q${(AMS_X + CAIRO_X) / 2},${(AMS_Y + CAIRO_Y) / 2 - 25} ${CAIRO_X},${CAIRO_Y}`;

// ─── LocationCard ─────────────────────────────────────────────────────────────
function LocationCard({
  icon, title, address, mapUrl, mapLabel, isLight,
}: {
  icon: React.ReactNode; title: string; address: string;
  mapUrl: string; mapLabel: string; isLight: boolean;
}) {
  return (
    <div className={`flex gap-3 p-4 rounded-[1.5rem] border backdrop-blur-sm transition-all duration-500
        ${isLight
          ? "bg-white/90 border-black/8 hover:border-black/20"
          : "bg-black/65 border-white/10 hover:border-primary/35"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border
          ${isLight
            ? "bg-primary/15 text-[#4d6012] border-primary/25"
            : "bg-primary/10 text-primary border-primary/20"}`}>
        {icon}
      </div>
      <div>
        <h3 className={`text-sm font-bold mb-0.5 ${isLight ? "text-zinc-900" : "text-white"}`}>
          {title}
        </h3>
        <p className={`text-xs leading-snug ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
          {address}
        </p>
        <a href={mapUrl} target="_blank" rel="noopener noreferrer"
           className={`inline-flex items-center gap-1 mt-1.5 text-[0.65rem] font-semibold tracking-wide transition-colors
            ${isLight ? "text-[#4d6012] hover:text-[#3a4a0e]" : "text-primary hover:text-primary/80"}`}>
          <ExternalLink className="w-2.5 h-2.5" />
          {mapLabel}
        </a>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function GlobeSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const sectionRef = useRef<HTMLDivElement>(null);
  const mapSvgRef  = useRef<SVGSVGElement>(null);

  const pinColor = isLight ? "#4d6012" : "#C8DF52";

  // ─── SVG preserveAspectRatio sync ─────────────────────────────────────────
  // Mobile  : xMidYMin meet  (matches object-top on the image)
  // Desktop : xMidYMid meet  (matches object-center — unchanged)
  useEffect(() => {
    const svg = mapSvgRef.current;
    if (!svg) return;
    const update = () => {
      svg.setAttribute(
        "preserveAspectRatio",
        window.innerWidth >= 768 ? "xMidYMid meet" : "xMidYMin meet"
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ─── Scroll progress ───────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ─── Motion transforms ─────────────────────────────────────────────────────
  const sectionOpacity   = useTransform(scrollYProgress, [0, 0.08],    [0, 1]);
  const amsPinOpacity    = useTransform(scrollYProgress, [0.18, 0.30], [0, 1]);
  const amsCardOpacity   = useTransform(scrollYProgress, [0.30, 0.42], [0, 1]);
  const amsCardY         = useTransform(scrollYProgress, [0.30, 0.42], [12, 0]);
  const cairoPinOpacity  = useTransform(scrollYProgress, [0.42, 0.54], [0, 1]);
  const arcProgressMV    = useTransform(scrollYProgress, [0.50, 0.78], [0, 1]);
  const cairoCardOpacity = useTransform(scrollYProgress, [0.74, 0.88], [0, 1]);
  const cairoCardY       = useTransform(scrollYProgress, [0.74, 0.88], [12, 0]);

  const amsCard = (
    <LocationCard
      icon={<Building2 className="w-4 h-4" />}
      title={t("contact.globe.ams.title")}
      address={t("contact.globe.ams.address")}
      mapUrl="https://maps.app.goo.gl/tcgSsSpgBpJtM3fs7"
      mapLabel={t("contact.globe.openInMaps")}
      isLight={isLight}
    />
  );
  const cairoCard = (
    <LocationCard
      icon={<Building className="w-4 h-4" />}
      title={t("contact.globe.cairo.title")}
      address={t("contact.globe.cairo.address")}
      mapUrl="https://maps.app.goo.gl/JwCL6b5aAWZvKL9i9"
      mapLabel={t("contact.globe.openInMaps")}
      isLight={isLight}
    />
  );

  return (
    <div ref={sectionRef} style={{ height: "300vh", position: "relative" }}
         className={isLight ? "bg-white" : "bg-black"}>
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        className={`flex flex-col justify-center md:justify-start ${isLight ? "bg-white" : "bg-black"}`}
      >
        {/* ── Heading ─────────────────────────────────────────────────────────
            Desktop : pt-16 pb-5 — unchanged, perfect as-is
            Mobile  : pt-6  pb-2 — compact; centering is handled by
                      justify-center on the container, not by padding        */}
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="flex-none container mx-auto px-4 pt-6 pb-2 md:pt-16 md:pb-5 text-center"
        >
          <span className={`text-xs uppercase tracking-[0.4em] font-bold mb-4 block
              ${isLight ? "text-[#4d6012]" : "text-primary"}`}>
            {t("contact.globe.label")}
          </span>
          <h2 className={`text-4xl md:text-6xl font-bold tracking-tighter leading-none
              ${isLight ? "text-zinc-900" : "text-white"}`}>
<span className="text-gradient-primary">
  {t("contact.globe.title2")}
</span>
&nbsp;
{t("contact.globe.title1")}
          </h2>
        </motion.div>

        {/* ── Map ─────────────────────────────────────────────────────────────
            Desktop : flex-1  → fills remaining height (unchanged)
            Mobile  : h-[56.25vw] → exactly 16:9 at viewport width, so the
                      image fills the container with zero letterbox and the
                      whole content block can be centred by justify-center   */}
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="relative min-h-0 h-[56.25vw] md:h-auto md:flex-1"
        >
          <img
            src="/world-map.png"
            alt="World map"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain object-top md:object-center select-none pointer-events-none"
            style={{ filter: isLight ? "brightness(0.72) contrast(1.3)" : "none" }}
          />

          <svg
            ref={mapSvgRef}
            viewBox="0 0 1920 1080"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <motion.path
              d={ARC_D}
              fill="none" stroke={pinColor} strokeWidth={4} strokeLinecap="round"
              style={{ pathLength: arcProgressMV }}
            />
            <motion.g style={{ opacity: amsPinOpacity }}>
              <circle cx={AMS_X} cy={AMS_Y} r={12} fill={pinColor} />
              <circle cx={AMS_X} cy={AMS_Y} r={22}
                fill="none" stroke={pinColor} strokeWidth={2} opacity={0.3} />
            </motion.g>
            <motion.g style={{ opacity: cairoPinOpacity }}>
              <circle cx={CAIRO_X} cy={CAIRO_Y} r={12} fill={pinColor} />
              <circle cx={CAIRO_X} cy={CAIRO_Y} r={22}
                fill="none" stroke={pinColor} strokeWidth={2} opacity={0.3} />
            </motion.g>
          </svg>

          {/* Desktop overlay cards — top-left, hidden on mobile */}
          <div className="absolute hidden md:flex flex-col gap-3 z-10"
               style={{ left: "3%", top: "13%", width: "min(260px, 22vw)" }}>
            <motion.div style={{ opacity: amsCardOpacity, y: amsCardY }}>
              {amsCard}
            </motion.div>
            <motion.div style={{ opacity: cairoCardOpacity, y: cairoCardY }}>
              {cairoCard}
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile cards — below the map, hidden on desktop */}
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="flex-none md:hidden container mx-auto px-4 pb-2 pt-3"
        >
          <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
            <motion.div style={{ opacity: amsCardOpacity, y: amsCardY }}>
              {amsCard}
            </motion.div>
            <motion.div style={{ opacity: cairoCardOpacity, y: cairoCardY }}>
              {cairoCard}
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
