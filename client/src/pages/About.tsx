import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Target, Zap, Heart, Globe, Cpu, Layers, Package } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";



export default function About() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const inspirationCards = t("about.inspiration.cards", {
    returnObjects: true,
  }) as Array<{ heading: string; body: string }>;

  const whatWeDoCards = t("about.whatWeDo.cards", {
    returnObjects: true,
  }) as Array<{ title: string; body: string }>;

  const careersDisciplines = t("about.careers.disciplines", {
    returnObjects: true,
  }) as string[];

  const careersMarquee = t("about.careers.marqueeItems", {
    returnObjects: true,
  }) as string[];

  // Scrollytelling — Mission → Vision
  const missionSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: missionScrollY } = useScroll({
    target: missionSectionRef,
    offset: ["start start", "end end"],
  });
// Mission: zooms toward viewer, fully disappears before Vision appears
  const missionOpacity = useTransform(missionScrollY, [0, 0.10, 0.25], [1, 1, 0]);
  const missionScale   = useTransform(missionScrollY, [0.15, 0.25], [1, 1.22]);
  // Vision: starts right after mission gone — shorter gap = less scroll between states
  const visionOpacity  = useTransform(missionScrollY, [0.35, 0.55], [0, 1]);
  const visionScale    = useTransform(missionScrollY, [0.35, 0.53], [0.88, 1]);
  // Disable pointer events when invisible — prevents ghost clicks on hidden CTA
  const visionPointerEvents = useTransform(visionOpacity, (o) =>
    (o > 0.05 ? "auto" : "none") as "auto" | "none"
  );
  // White/black rectangle rises from the bottom with smoothstep easing at the end
  // of the Mission/Vision section, "eating" the visible text upward
  const missionRectRaw = useTransform(missionScrollY, [0.85, 1.0], [0, 1]);
  const missionRectEased = useTransform(missionRectRaw, (v) => {
    const t = Math.max(0, Math.min(1, v));
    return t * t * (3 - 2 * t); // smoothstep — slow start, fast middle, slow end
  });
  // inset(100%→0% from top) = panel rises from bottom to fully cover the viewport
  const missionRectClip = useTransform(
    missionRectEased,
    [0, 1],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  );

  // Commitment scrollytelling
  // Rectangle handed off from mission section — this section shows text then opens curtain.
  const commitSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: commitScrollY } = useScroll({
    target: commitSectionRef,
    offset: ["start start", "end end"],
  });
  // Theatre-curtain: smoothstep-eased progress so the panels accelerate in
  // the middle and ease out at the edges — non-linear, premium feel.
  // Runs 0.70→1.0 = 30% of effective scroll (220vh section → 66vh of travel).
  const curtainRaw    = useTransform(commitScrollY, [0.70, 1.0], [0, 1]);
  const curtainEased  = useTransform(curtainRaw, (v) => {
    const t = Math.max(0, Math.min(1, v));
    return t * t * (3 - 2 * t); // smoothstep
  });
  const leftPanelX    = useTransform(curtainEased, [0, 1], ["0%", "-100%"]);
  const rightPanelX   = useTransform(curtainEased, [0, 1], ["0%", "100%"]);
  // Content: dwell window 0.44→0.64 = 20% of 220vh = 44vh fully-solid lock
  const commitContentOpacity = useTransform(commitScrollY, [0.00, 0.14, 0.64, 0.70], [0, 1, 1, 0]);
  const revealRaw = useTransform(commitScrollY, [0.04, 0.44], [0, 100]);

const revealSmooth = useSpring(revealRaw, {
  stiffness: 70,
  damping: 24,
  mass: 0.5,
});
  // Text reveal completes at 44% — earlier completion = longer locked dwell
  // dark mode (white bg): lighter-grey rgb(160) → near-black rgb(15)
  // (rgb 160 is noticeably lighter than the previous 90, giving more contrast
  //  between revealed and unrevealed lines in dark mode)
const textReveal = useTransform(
  revealSmooth,
  (v) =>
    `linear-gradient(to bottom,
      rgb(15,15,15) ${v}%,
      rgb(160,160,160) ${v}%)`
);
  // Light-mode inverse (black bg): visible-grey rgb(110) → near-white rgb(245)
const textRevealLight = useTransform(
  revealSmooth,
  (v) =>
    `linear-gradient(to bottom,
      rgb(245,245,245) ${v}%,
      rgb(110,110,110) ${v}%)`
);
  // Stage fades to transparent in the last 8% of scroll. Combined with the
  // -mt-[100vh] on Values, the user sees Values through the transparent stage
  // at exactly scrollYProgress = 1.0 — zero extra scrolling needed.
  const stageOpacity = useTransform(commitScrollY, [0.92, 1.0], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black" style={{ overflowX: "clip" }}>
      <SEO page="about" />
      <StructuredData page="about" />
      <Navbar />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-32">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-6 block">{t('about.hero.label')}</span>
              <h1 className="text-5xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.85] w-full lg:max-w-none" data-testid="text-about-title">
                {t('about.hero.title1')}<br/>
                <span className="text-gradient-primary">{t('about.hero.title2')}</span>
              </h1>
              <div className="text-base md:text-lg text-zinc-400 font-light max-w-xl leading-relaxed mb-10">
                <p>{t('about.hero.desc')}</p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex flex-col group/stat cursor-default">
                  <span className="text-4xl font-bold text-white tracking-tighter group-hover/stat:text-primary transition-colors duration-300">03</span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{t('about.hero.stats.countries')}</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10 hidden md:block"></div>
                <div className="flex flex-col group/stat cursor-default">
                  <span className="text-4xl font-bold text-white tracking-tighter group-hover/stat:text-primary transition-colors duration-300">02</span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{t('about.hero.stats.offices')}</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10 hidden md:block"></div>
                <div className="flex flex-col group/stat cursor-default">
                  <span className="text-4xl font-bold text-white tracking-tighter group-hover/stat:text-primary transition-colors duration-300">01</span>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{t('about.hero.stats.goal')}</span>
                </div>
              </div>
            </motion.div>

            <div className="hidden lg:flex relative h-[600px] items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
              >
                {/* Subtle Ambient Background Nodes */}
                <div className="absolute inset-0 z-0">
                  <div className="relative w-full h-full">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0.05, 0.1, 0.05],
                        }}
                        transition={{
                          duration: 5 + i,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2
                        }}
                        className="absolute w-1 h-1 bg-primary rounded-full blur-[2px]"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Central Focus Element - Very Subtle */}
                <div className="relative z-10 flex flex-col items-center">
                   <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-80 h-80 bg-primary/5 rounded-full blur-[100px]"
                  />
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,223,82,0.01)_0%,transparent_70%)] pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Animated Background Text - Infinite Loop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] select-none group/banner">
          <div className="flex whitespace-nowrap mt-20">
            <motion.div 
              initial={{ x: "0%" }}
              animate={{ x: "-100%" }}
              transition={{ 
                duration: 80, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="text-[20vw] font-black uppercase leading-none flex gap-8 items-center pr-8 group-hover/banner:text-primary/20 transition-colors duration-1000"
            >
              <span>CURIOSITY • CULTURE • TECH • HISTORY •</span>
            </motion.div>
            <motion.div 
              initial={{ x: "0%" }}
              animate={{ x: "-100%" }}
              transition={{ 
                duration: 80, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="text-[20vw] font-black uppercase leading-none flex gap-8 items-center pr-8 group-hover/banner:text-primary/20 transition-colors duration-1000"
              aria-hidden="true"
            >
              <span>CURIOSITY • CULTURE • TECH • HISTORY •</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 md:py-36 relative overflow-hidden border-t border-white/5">

        {/* Ambient glow — purely decorative */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/4 w-[700px] h-[400px] rounded-full blur-[160px]"
            style={{ background: 'radial-gradient(circle, rgba(255,191,94,0.07), transparent)' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full blur-[140px]"
            style={{ background: 'radial-gradient(circle, rgba(179,207,255,0.05), transparent)' }}
          />
        </div>

        <div className="container mx-auto relative z-10">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
            className="max-w-3xl mb-20"
          >
            <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-6 block">
              {t('about.whatWeDo.eyebrow')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-[1.05] mb-6">
              {t('about.whatWeDo.heading')}
            </h2>
            <p className={`text-lg md:text-xl font-light leading-relaxed max-w-2xl ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {t('about.whatWeDo.subheading')}
            </p>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {whatWeDoCards.map((card, i) => {
              const icons = [Cpu, Layers, Package] as const;
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.13, duration: 0.7 }}
                  className="group relative"
                >
                  <div className={`h-full p-8 md:p-10 rounded-[2rem] border relative overflow-hidden transition-all duration-500 flex flex-col ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200 hover:border-primary/50'
                      : 'bg-zinc-900/40 border-white/5 hover:border-primary/40'
                  }`}>

                    {/* Top shimmer line on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                    {/* Glow bloom on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-primary/8 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full pointer-events-none" />

                    {/* Icon container */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                      isLight
                        ? 'bg-zinc-100 group-hover:bg-primary/20'
                        : 'bg-white/5 group-hover:bg-primary/15'
                    }`}>
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    {/* Title — always breaks onto two lines after the & */}
                    <h3 className={`text-xl md:text-2xl font-bold tracking-tight mb-4 leading-snug ${
                      isLight ? 'text-zinc-900' : 'text-white'
                    }`}>
                      {(() => {
                        const parts = card.title.split(' & ');
                        return parts.length === 2
                          ? <>{parts[0]} &<br />{parts[1]}</>
                          : card.title;
                      })()}
                    </h3>

                    {/* Body */}
                    <p className={`text-sm md:text-[15px] leading-relaxed ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {card.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Scrollytelling: Mission → Vision ─────────────────────────────── */}
      <section
        ref={missionSectionRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        {/* Sticky viewport stage */}
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* ── Mission text ──
              top-[42%] anchors the label at a fixed screen position
              so it stays at the same Y as the Vision label below        */}
          <motion.div
            style={{ opacity: missionOpacity, scale: missionScale }}
            className="absolute inset-0 pointer-events-none select-none"
          >
            <div className="absolute top-[42%] inset-x-0 flex flex-col items-center text-center px-8">
              <span className="text-primary text-xs font-bold uppercase tracking-[0.35em] mb-7 block">
                {t("about.mission.label")}
              </span>
              <h2
                className={`text-2xl md:text-4xl font-bold tracking-tighter leading-tight max-w-3xl ${
                  isLight ? "text-zinc-900" : "text-white"
                }`}
              >
                {t("about.mission.title")}
              </h2>
            </div>
          </motion.div>

          {/* ── Vision text ──
              Identical anchor (top-[42%]) keeps the label perfectly aligned  */}
          <motion.div
            style={{ opacity: visionOpacity, scale: visionScale, pointerEvents: visionPointerEvents }}
            className="absolute inset-0 select-none"
          >
            <div className="absolute top-[42%] inset-x-0 flex flex-col items-center text-center px-8">
              <span className="text-primary text-xs font-bold uppercase tracking-[0.35em] mb-7 block">
                {t("about.mission.vision.title")}
              </span>
              <h2
                className={`font-bold tracking-tighter leading-[1.15] max-w-2xl ${
                  isLight ? "text-zinc-900" : "text-white"
                }`}
                style={{ fontSize: "clamp(1.6rem, 3.2vw, 3.2rem)" }}
              >
                {t("about.mission.vision.desc")}
              </h2>
              {/* CTA — salvaged from the removed Vision card */}
              <div className="mt-10 pointer-events-auto">
                <Link
                  href="/solution"
                  className={`inline-flex items-center font-bold transition-all cursor-pointer uppercase tracking-widest text-sm group/view ${
                    isLight ? "text-[#4d6012] hover:text-zinc-900" : "text-primary hover:text-white"
                  }`}
                >
                  {t("about.mission.vision.cta")}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/view:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── State indicator — two dots, active one glows ── */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 pointer-events-none">
            <motion.div
              style={{ opacity: missionOpacity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            <motion.div
              style={{ opacity: visionOpacity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>

          {/* ── Rising rectangle ───────────────────────────────────────────── */}
          {/* Single full-width panel — no seam. Rises with smoothstep easing  */}
          {/* from the bottom, eating the vision text. z-30 sits above text.   */}
          <motion.div
            style={{
              clipPath: missionRectClip,
              backgroundColor: isLight ? "#000000" : "#ffffff",
            }}
            className="absolute inset-0 z-30 pointer-events-none"
          />

        </div>
      </section>
      {/* ── Commitment: Rectangle-rise + theatre-curtain scrollytelling ─────── */}
      {/* -mt-[100vh]: pulls the section up so its sticky activates the instant */}
      {/* the mission section's sticky exits — zero dead-scroll gap.            */}
      {/* z-[2]: sits above the mission section at the handoff point.           */}
      <section
        ref={commitSectionRef}
        className="relative -mt-[100vh] z-[2]"
        style={{ height: "320vh", backgroundColor: "transparent" }}
      >
        {/* Stage fades to transparent as curtain finishes (stageOpacity 0.88→1.0) */}
        {/* so when the sticky element exits, Values is already visible beneath.    */}
        <motion.div
          style={{ opacity: stageOpacity }}
          className="sticky top-0 h-screen overflow-hidden"
        >

          {/* ── Left curtain panel ─────────────────────────────────────────── */}
          {/* Starts at x=0 (full coverage), slides left on curtain open.       */}
          {/* w-[calc(50%+1px)] overlaps by 1 px at centre — eliminates seam.   */}
          <motion.div
            style={{ x: leftPanelX, backgroundColor: isLight ? "#000000" : "#ffffff" }}
            className="absolute top-0 left-0 bottom-0 w-[calc(50%+1px)] z-10"
          />

          {/* ── Right curtain panel ────────────────────────────────────────── */}
          <motion.div
            style={{ x: rightPanelX, backgroundColor: isLight ? "#000000" : "#ffffff" }}
            className="absolute top-0 right-0 bottom-0 w-[calc(50%+1px)] z-10"
          />

          {/* ── Commitment content ─────────────────────────────────────────── */}
          <motion.div
            style={{ opacity: commitContentOpacity }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8 md:px-20 pointer-events-none"
          >
            {/* Eyebrow — forced full-opacity #C8DF52 via inline style (bypasses  */}
            {/* any inherited opacity from gradient siblings or ThemeContext)    */}
            <span
              style={{ color: "#C8DF52", opacity: 1 }}
              className="text-xs font-bold uppercase tracking-[0.35em] mb-7 block"
            >
              {t("about.mission.commitment.title")}
            </span>

            {/* Body — same size/weight/tracking as Mission statement.          */}
            {/* Gradient sweeps top-to-bottom: starts grey, scrolls to dark/light */}
            <motion.p
              style={{
                backgroundImage: isLight ? textRevealLight : textReveal,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
              className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight max-w-3xl"
            >
              {t("about.mission.commitment.desc")}
            </motion.p>

            {/* CTA                                                              */}
            {/* dark mode (white bg): lime green → black hover                   */}
            {/* light mode (black bg): lime green → very slight opacity on hover  */}
            <div className="mt-10 pointer-events-auto">
              <Link
                href="/visitor-experience"
                className={`inline-flex items-center font-bold uppercase tracking-widest text-sm group/cta transition-all duration-300 ${
                  isLight
                    ? "text-[#C8DF52] hover:opacity-75"
                    : "text-[#C8DF52] hover:text-black"
                }`}
              >
                {t("about.mission.commitment.cta")}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </section>
      {/* Values Section */}
      {/* -mt-[100vh]: aligns with commitment sticky exit — visible immediately */}
      {/* min-height 200vh + sticky inner: Values stays pinned for 100vh of    */}
      {/* scroll after it appears, so the user can read it before continuing.  */}
      <section className="relative -mt-[100vh]" style={{ minHeight: "130vh" }}>
        <div className="sticky top-0 py-32">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-6 block">{t('about.mission.values.label')}</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
  {t('about.mission.values.heading')}
</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('about.mission.values.curiosity.title'), desc: t('about.mission.values.curiosity.desc'), icon: Zap },
              { title: t('about.mission.values.intent.title'), desc: t('about.mission.values.intent.desc'), icon: Rocket },
              { title: t('about.mission.values.respect.title'), desc: t('about.mission.values.respect.desc'), icon: Heart },
              { title: t('about.mission.values.simple.title'), desc: t('about.mission.values.simple.desc'), icon: Target }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-primary/50 transition-all duration-500 group h-full flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <value.icon className="text-primary w-5 h-5" />
                </div>
                <h4 className="font-bold text-white mb-4 text-xl tracking-tight">{value.title}</h4>
                <p className={`text-sm leading-relaxed mt-auto desc-neutral ${!isLight && 'text-zinc-500'}`}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Inspiration Hover Section */}
      <section className={`py-24 md:py-32 relative overflow-hidden border-t ${isLight ? 'border-zinc-200' : 'border-white/5'}`}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row gap-8 justify-between items-start md:items-end border-b pb-12 mb-16 ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}
          >
            <div className="max-w-2xl space-y-5">
              <h2
  className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] ${
    isLight ? 'text-zinc-900' : 'text-white'
  }`}
>
  <span>{t("about.inspiration.heading.before")}</span>{" "}
  <span className="text-primary inline-flex items-center gap-2 whitespace-nowrap">
    <span aria-hidden="true">→</span>
    <span>{t("about.inspiration.heading.highlight")}</span>
  </span>
</h2>

              <p
                className={`text-base md:text-lg leading-relaxed max-w-xl ${
                  isLight ? 'text-zinc-600' : 'text-zinc-400'
                }`}
              >
                {t("about.inspiration.paragraph.line1")}{" "}
                {t("about.inspiration.paragraph.line2.before")}{" "}
                <mark
                  className={`px-1.5 py-0.5 rounded font-semibold not-italic ${
                    isLight ? 'bg-primary/25 text-zinc-900' : 'bg-primary/20 text-white'
                  }`}
                  style={{ WebkitBoxDecorationBreak: "clone" }}
                >
                  {t("about.inspiration.paragraph.line2.highlight")}
                </mark>
              </p>
            </div>

            <div
              className={`hidden md:flex items-center gap-2 text-xs font-bold tracking-widest uppercase shrink-0 ${
                isLight ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              <span className={`w-8 h-px inline-block ${isLight ? 'bg-zinc-300' : 'bg-zinc-700'}`}></span>
              {t("about.inspiration.label")}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inspirationCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`group relative h-[200px] md:h-[220px] rounded-3xl overflow-hidden border transition-[background-color,border-color] duration-300 ease-out ${
                  isLight
                    ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-primary/40'
                    : 'bg-zinc-950 border-zinc-800/60 hover:bg-zinc-900 hover:border-primary/40'
                }`}
              >
               
                {/* Front state */}
                <div className="absolute inset-0 p-8 md:p-10 pt-12 flex items-end z-10 transition-opacity duration-700 ease-in-out group-hover:opacity-0 pointer-events-none max-md:hidden">
                  <h3
                    className={`text-2xl md:text-3xl font-bold leading-tight tracking-tight pr-6 ${
                      isLight ? 'text-zinc-900' : 'text-white'
                    }`}
                  >
                    {card.heading}
                  </h3>
                </div>
{/* Hover state */}
<div className="absolute inset-0 p-8 pb-14 md:p-10 md:pb-6 flex flex-col z-20 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 pointer-events-none max-md:relative max-md:inset-auto max-md:opacity-100">  <div className="flex items-center gap-3 mb-6 mt-auto">
    <span className="text-xs font-bold tracking-widest text-primary">
      {String(i + 1).padStart(2, "0")}
    </span>
    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
      {card.heading}
    </span>
  </div>

  <p
    className={`text-[15px] leading-relaxed ${
      isLight ? 'text-zinc-700' : 'text-zinc-300'
    }`}
  >
    {card.body}
  </p>
</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Promo — Night Gallery */}
      <section className="relative overflow-hidden bg-[#0E1215] selection:bg-primary selection:text-black">

        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-[8%] w-[600px] h-[600px] rounded-full blur-[160px]" style={{ background: 'rgba(255,191,94,0.07)' }} />
          <div className="absolute bottom-0 right-[15%] w-[400px] h-[400px] rounded-full blur-[140px]" style={{ background: 'rgba(179,207,255,0.04)' }} />
        </div>

        {/* Main two-panel grid — constrained to container for consistent margins */}
        <div className="relative z-10 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_400px]">

          {/* ——— LEFT PANEL ——— */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="py-24 md:py-36 pr-0 lg:pr-16 xl:pr-24 flex flex-col justify-center"
          >
            {/* Section label */}
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px w-10 bg-primary/30" />
              <span className="text-primary font-bold uppercase" style={{ fontSize: '11px', letterSpacing: '0.35em' }}>
                {t('about.careers.label')}
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-black tracking-tighter leading-[0.88] text-white mb-8"
              style={{ fontSize: 'clamp(1.9rem, 5.2vw, 4.4rem)' }}
            >
              {t('about.careers.title1')}
              <br />
              <span className="text-primary">{t('about.careers.title2')}</span>
            </h2>

            {/* Description — forced zinc-400 in light mode to prevent global  */}
            {/* CSS overriding the colour to black on a potentially white bg.   */}
            <p
              className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg mb-12"
              style={isLight ? { color: '#a1a1aa' } : undefined}
            >
              {t('about.careers.desc')}
            </p>

            {/* CTA */}
            <Link href="/careers">
              <Button className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors duration-300">
                {t('about.careers.cta')} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* ——— VERTICAL DIVIDER ——— */}
          <div className="hidden lg:block bg-white/5" />

          {/* ——— RIGHT PANEL — Disciplines ——— */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="py-24 md:py-36 pl-0 lg:pl-10 flex flex-col justify-center border-t border-white/5 lg:border-t-0"
          >
            <p className="text-zinc-500 font-bold uppercase mb-8" style={{ fontSize: '11px', letterSpacing: '0.35em' }}>
              {t('about.careers.disciplinesLabel')}
            </p>

            <div className="flex flex-col">
              {careersDisciplines.map((discipline, i) => (
                <motion.div
                  key={discipline}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                  className="group/disc flex items-center gap-4 py-4 border-b border-white/5 hover:border-primary/25 transition-all duration-300 cursor-default"
                >
                  <span
                    className={`font-bold transition-colors duration-300 ${
                      isLight
                        ? 'text-[#4d6012]/35 group-hover/disc:text-[#4d6012]'
                        : 'text-primary/35 group-hover/disc:text-primary'
                    }`}
                    style={{ fontSize: '10px', letterSpacing: '0.15em', minWidth: '1.5rem' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-400 text-sm font-medium group-hover/disc:text-white transition-colors duration-300 flex-1">
                    {discipline}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover/disc:opacity-100 transition-all duration-300 -translate-x-2 group-hover/disc:translate-x-0" />
                </motion.div>
              ))}
            </div>

            <Link
              href="/careers"
              className="mt-6 inline-flex items-center gap-2 text-zinc-600 hover:text-primary transition-colors duration-300 font-bold uppercase group/all"
              style={{ fontSize: '11px', letterSpacing: '0.3em' }}
            >
              {t('about.careers.viewAll')}
              <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
        </div>{/* end container */}

        {/* Bottom scrolling marquee */}
        <div className="border-t border-white/5 py-4 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex items-center whitespace-nowrap"
          >
            {[0, 1, 2, 3].map((setIdx) => (
              <div key={setIdx} className="flex items-center shrink-0" aria-hidden={setIdx > 0 ? true : undefined}>
                {careersMarquee.map((item) => (
                  <span key={item} className="flex items-center">
                    <span className="text-zinc-600 font-bold uppercase px-5" style={{ fontSize: '11px', letterSpacing: '0.3em' }}>{item}</span>
                    <span className="text-primary/70" style={{ fontSize: '7px' }}>◆</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </section>
      <Footer />
    </div>
  );
}