import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import {
  CheckCircle2,
  Plus,
  Minus,
  Info,
  ChevronDown,
  Calculator as CalcIcon,
  TrendingUp,
  Coins,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";

const CURRENCIES = [
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "£", code: "GBP", name: "British Pound" },
];

// Tap-friendly tooltip: hover works on desktop unchanged; tap toggles on mobile
function InfoTooltip({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip
        open={open || undefined}
        onOpenChange={(v) => { if (!v) setOpen(false); }}
      >
        <TooltipTrigger asChild>
          <button
            type="button"
            className="outline-none select-none touch-manipulation"
            onPointerDown={(e) => {
              if (e.pointerType === "touch") {
                e.preventDefault();
                setOpen((o) => !o);
              }
            }}
          >
            <Info className="w-3 h-3 text-zinc-600 hover:text-primary transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-zinc-900 border-white/10 text-white p-4 rounded-xl max-w-xs z-50">
          <p className="text-sm font-medium">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function RevenueSharing() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const chartColor = isLight ? "#4D6012" : "#d4ff33";
  const calcRef = useRef<HTMLDivElement>(null);

  // Dynamic font sizing for projected earnings figure
  const earningsRowRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLSpanElement>(null);
  const [earningsFontSize, setEarningsFontSize] = useState(80);

  // Dynamic font sizing for annual visitors input
  const visitorsGroupRef = useRef<HTMLDivElement>(null);
  const [visitorsFontSize, setVisitorsFontSize] = useState(36);

  // Calculator State
  const [visitors, setVisitors] = useState(250000);
  const [adoptionRate, setAdoptionRate] = useState(33);
  const [pricePerTour, setPricePerTour] = useState(8);
  const [museumShare, setMuseumShare] = useState(100);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // Input string states to allow typing
  const [visitorsInput, setVisitorsInput] = useState("250,000");
  const [adoptionInput, setAdoptionInput] = useState("33");
  const [shareInput, setShareInput] = useState("100");

  useEffect(() => {
    setVisitorsInput(visitors.toLocaleString());
  }, [visitors]);

  useEffect(() => {
    setAdoptionInput(adoptionRate.toString());
  }, [adoptionRate]);

  useEffect(() => {
    setShareInput(museumShare.toString());
  }, [museumShare]);

  // Calculations (moved up so projectedEarnings is available for useCallback below)
  const totalTours = Math.round(visitors * (adoptionRate / 100));
  const totalRevenue = totalTours * pricePerTour;
  const projectedEarnings = Math.round(totalRevenue * (museumShare / 100));

  // Compute the largest font size that fits the number without overflowing past the euro sign
  const computeEarningsFontSize = useCallback(() => {
    if (!earningsRowRef.current || !symbolRef.current) return;

    const rowWidth = earningsRowRef.current.clientWidth;
    const symbolWidth = symbolRef.current.offsetWidth;
    // px-4 both sides (32px) + mr-4 gap (16px) + small safety buffer (8px)
    const available = rowWidth - symbolWidth - 56;
    if (available <= 20) return;

    const text = projectedEarnings.toLocaleString();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Binary search for the largest font size that fits — capped at 140px
    // so that very small numbers (e.g. single digit) don't balloon uncontrollably
    let lo = 20,
      hi = 140;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      ctx.font = `900 ${mid}px Raleway, sans-serif`;
      if (ctx.measureText(text).width <= available) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    setEarningsFontSize(Math.floor(lo));
  }, [projectedEarnings]);

  useEffect(() => {
    // Run immediately and after fonts are ready (for accurate canvas metrics)
    computeEarningsFontSize();
    document.fonts?.ready.then(computeEarningsFontSize);

    const observer = new ResizeObserver(computeEarningsFontSize);
    if (earningsRowRef.current) observer.observe(earningsRowRef.current);
    return () => observer.disconnect();
  }, [computeEarningsFontSize, currency]);

  // Compute the largest font that fits the visitors number inside the input box
  const computeVisitorsFontSize = useCallback(() => {
    if (!visitorsGroupRef.current) return;
    // Subtract space for the two absolute-positioned buttons (each: left/right-2=8px + w-12=48px)
    // plus an inner safety margin of 16px
    const available = visitorsGroupRef.current.clientWidth - 128;
    if (available <= 20) return;

    const text = visitorsInput;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lo = 12, hi = 48;
    for (let i = 0; i < 25; i++) {
      const mid = (lo + hi) / 2;
      ctx.font = `900 ${mid}px Raleway, sans-serif`;
      if (ctx.measureText(text).width <= available) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    setVisitorsFontSize(Math.floor(lo));
  }, [visitorsInput]);

  useEffect(() => {
    computeVisitorsFontSize();
    document.fonts?.ready.then(computeVisitorsFontSize);

    const observer = new ResizeObserver(computeVisitorsFontSize);
    if (visitorsGroupRef.current) observer.observe(visitorsGroupRef.current);
    return () => observer.disconnect();
  }, [computeVisitorsFontSize]);

  const scrollToCalculator = () => {
    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Chart Data: Projecting revenue based on different adoption rates (0% to 100%)
  const chartData = useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => {
      const rate = i * 5;
      const tours = Math.round(visitors * (rate / 100));
      const revenue = tours * pricePerTour;
      const earnings = Math.round(revenue * (museumShare / 100));
      return {
        rate: `${rate}%`,
        adoption: rate,
        revenue: earnings,
      };
    });
  }, [visitors, pricePerTour, museumShare]);

  const formatCurrency = (val: number) => {
    return `${currency.symbol}${val.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO page="revenueSharing" />
      <StructuredData page="revenueSharing" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[140px] animate-pulse-slow"></div>
          {!isLight && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)]"></div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 group cursor-default">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400 group-hover:text-primary transition-colors">
                {t("revenueSharing.hero.label")}
              </span>
            </div>

            <h1
              className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-12"
              data-testid="text-revenue-title"
            >
              {t("revenueSharing.hero.title")}
              <br />
              <span className="text-gradient-primary">
                {t("revenueSharing.hero.subtitle")}
              </span>
            </h1>

            <div className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
              <p>{t("revenueSharing.hero.desc")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center w-full max-w-md mx-auto">
              <Link
                href="/booking"
                className="w-full sm:w-1/2"
                data-testid="button-get-started-with-treed"
              >
                <Button className="w-full bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors duration-300">
                  {t("revenueSharing.hero.cta.primary")}
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={scrollToCalculator}
                className={`w-full sm:w-1/2 rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 ${
                  isLight
                    ? "!bg-transparent !text-zinc-900 border-zinc-300 hover:!bg-black/5 hover:border-zinc-400"
                    : "!bg-transparent text-white border-white/10 hover:!bg-white/10 hover:border-white/20"
                }`}
              >
                {t("revenueSharing.hero.cta.secondary")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section - Overarching Core Principle */}
      <section
        className={`py-32 relative ${isLight ? "bg-zinc-50" : "bg-black/40"}`}
      >
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Core Principle: Balanced Design */}
            <div className="mb-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative p-10 md:p-20 rounded-[3.5rem] border backdrop-blur-3xl overflow-hidden group ${isLight ? "bg-white border-zinc-200" : "bg-zinc-900/40 border-white/5"}`}
              >
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Coins size={160} strokeWidth={1} />
                </div>
                <div className="relative z-10 max-w-3xl">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-6 block">
                    {t("revenueSharing.philosophy.label")}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
                    {t("revenueSharing.philosophy.title")}
                  </h2>
                  <p
                    className={`text-sm md:text-2xl font-light leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-300"}`}
                  >
                    {t("revenueSharing.philosophy.desc")}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Drivers: Primary then Secondary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
              {/* Primary Driver */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 md:p-16 rounded-[3.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10">
                    <TrendingUp className="text-primary w-8 h-8" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-4 block">
                    {t("revenueSharing.philosophy.primary.label")}
                  </span>
                  <h3 className="text-4xl font-bold mb-8 tracking-tighter">
                    {t("revenueSharing.philosophy.primary.title")}
                  </h3>
                  <p className="text-sm md:text-xl text-zinc-400 leading-relaxed font-medium">
                    {t("revenueSharing.philosophy.primary.desc")}
                  </p>
                </div>
                <div className="mt-12 h-1 w-24 bg-primary/20 rounded-full">
                  <div className="w-2/3 bg-primary rounded-full"></div>
                </div>
              </motion.div>

              {/* Secondary Drivers */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 md:p-16 rounded-[3.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-3xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10">
                  <Plus className="text-zinc-400 w-8 h-8" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 mb-4 block">
                  {t("revenueSharing.philosophy.secondary.label")}
                </span>
                <h3 className="text-4xl font-bold mb-10 tracking-tighter">
                  {t("revenueSharing.philosophy.secondary.title")}
                </h3>
                <ul className="space-y-6">
                  {(
                    t("revenueSharing.philosophy.secondary.items", {
                      returnObjects: true,
                    }) as string[]
                  ).map((driver, i) => (
                    <li key={i} className="flex items-center gap-5 group">
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs text-zinc-500 font-mono group-hover:border-primary group-hover:text-primary transition-colors">
                        0{i + 1}
                      </div>
                      <span className="text-sm md:text-lg text-zinc-300 font-medium group-hover:text-white transition-colors">
                        {driver}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Waived Upfront Costs: Separate and Clear */}
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 ${isLight ? "" : ""}`}
            >
              <div className="md:col-span-1">
                <h3
                  className={`text-5xl font-black tracking-tighter mb-4 leading-none uppercase ${isLight ? "text-zinc-900" : "text-white"}`}
                >
                  {t("revenueSharing.waived.title")}
                </h3>
                <p
                  className={
                    isLight ? "text-zinc-600 text-lg" : "text-zinc-500 text-lg"
                  }
                >
                  {t("revenueSharing.waived.desc")}
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    ...(t("revenueSharing.waived.items.hardware", {
                      returnObjects: true,
                    }) as any),
                  },
                  {
                    ...(t("revenueSharing.waived.items.software", {
                      returnObjects: true,
                    }) as any),
                  },
                  {
                    ...(t("revenueSharing.waived.items.access", {
                      returnObjects: true,
                    }) as any),
                  },
                  {
                    ...(t("revenueSharing.waived.items.infra", {
                      returnObjects: true,
                    }) as any),
                  },
                ].map((cost, i) => (
                  <div
                    key={i}
                    className={`p-8 rounded-3xl border transition-colors ${isLight ? "bg-zinc-50 border-zinc-200 hover:bg-zinc-100" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"}`}
                  >
                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3 block">
                      {cost.label}
                    </span>
                    <div
                      className={`text-xl font-bold mb-1 ${isLight ? "text-zinc-900" : "text-foreground"}`}
                    >
                      {cost.title}
                    </div>
                    <div
                      className={`text-sm font-medium ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
                    >
                      {cost.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="revenue-calculator" ref={calcRef} className="py-40 relative">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-8 md:mb-24">
              <div className="max-w-2xl">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-8">
                  {t("revenueSharing.calculator.title")}
                  <br />
                  <span className="text-zinc-600">
                    {t("revenueSharing.calculator.subtitle")}
                  </span>
                </h2>
                <p className={`text-xl font-light ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
  {t("revenueSharing.calculator.desc")}
</p>
              </div>
<div className="flex gap-2 bg-zinc-900/50 p-2 rounded-2xl border border-white/5 w-fit mx-auto md:mx-0">
  {CURRENCIES.map((c) => (
    <button
      key={c.code}
      onClick={() => setCurrency(c)}
      className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
        currency.code === c.code
          ? isLight
            ? "bg-primary !text-zinc-950"
            : "bg-primary text-zinc-800"
          : isLight
            ? "!text-zinc-300 hover:!text-zinc-600"
            : "text-zinc-500 hover:text-white"
      }`}
    >
      {c.symbol} {c.code}
    </button>
  ))}
</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-8">
                <div className="p-10 rounded-[3.5rem] bg-zinc-900/30 border border-white/5 backdrop-blur-3xl space-y-12">
                {/* Visitors per Year */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500">
                      {t("revenueSharing.calculator.labels.annualVisitors")}
                    </label>
                  </div>
                  <div ref={visitorsGroupRef} className="relative group">
                    <button
                      onClick={() =>
                        setVisitors((prev) => Math.max(0, prev - 10000))
                      }
                     className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
  isLight
    ? "bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700"
    : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
}`}
                      >
                      <Minus className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={visitorsInput}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        const num = Math.min(99000000, Number(raw));
                        setVisitorsInput(num.toLocaleString());
                        setVisitors(num);
                      }}
                      className="bg-zinc-900/50 border-white/10 rounded-2xl h-24 font-black text-center px-8 sm:px-16 focus:ring-2 focus:ring-primary/20 transition-all overflow-hidden"
                      style={{ fontSize: `${visitorsFontSize}px`, transition: "font-size 0.2s ease" }}
                    />
                    <button
                      onClick={() => setVisitors((prev) => Math.min(99000000, prev + 10000))}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
                        isLight
                          ? "bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700"
                          : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      }`}
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>

                {/* Adoption Rate */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <label className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500">
                        {t("revenueSharing.calculator.labels.adoptionRate")}
                      </label>
                      <InfoTooltip content={t("revenueSharing.calculator.labels.adoptionTip")} />
                    </div>
                    {/* Mobile: tappable numeric input only — ± live at slider ends */}
                    <div className="md:hidden flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={adoptionInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setAdoptionInput(val);
                          setAdoptionRate(Math.min(100, Number(val)));
                        }}
                        className="w-9 bg-transparent text-primary font-black text-base text-right focus:outline-none"
                      />
                      <span className="text-primary font-black text-base">%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <button
                      onClick={() =>
                        setAdoptionRate(Math.max(0, adoptionRate - 1))
                      }
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-all flex-shrink-0"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-grow space-y-4">
                      <Slider
                        value={[adoptionRate]}
                        onValueChange={([v]) => setAdoptionRate(v)}
                        max={100}
                        className="py-4"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setAdoptionRate(Math.min(100, adoptionRate + 1))
                      }
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-all flex-shrink-0"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="hidden md:block w-24 relative">
                      <Input
                        value={adoptionInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setAdoptionInput(val);
                          setAdoptionRate(Math.min(100, Number(val)));
                        }}
                        className="h-12 bg-white/5 border-white/10 text-right font-bold rounded-xl pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Museum Share */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <label className="text-xs uppercase tracking-[0.3em] font-black text-zinc-500">
                        {t("revenueSharing.calculator.labels.museumShare")}
                      </label>
                      <InfoTooltip content={t("revenueSharing.calculator.labels.shareTip")} />
                    </div>
                    {/* Mobile: tappable numeric input only — ± live at slider ends */}
                    <div className="md:hidden flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={shareInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setShareInput(val);
                          setMuseumShare(Math.min(100, Number(val)));
                        }}
                        className="w-9 bg-transparent text-primary font-black text-base text-right focus:outline-none"
                      />
                      <span className="text-primary font-black text-base">%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6">
                    <button
                      onClick={() =>
                        setMuseumShare(Math.max(0, museumShare - 1))
                      }
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-all flex-shrink-0"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-grow space-y-4">
                      <Slider
                        value={[museumShare]}
                        onValueChange={([v]) => setMuseumShare(v)}
                        max={100}
                        className="py-4"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setMuseumShare(Math.min(100, museumShare + 1))
                      }
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-all flex-shrink-0"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="hidden md:block w-24 relative">
                      <Input
                        value={shareInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setShareInput(val);
                          setMuseumShare(Math.min(100, Number(val)));
                        }}
                        className="h-12 bg-white/5 border-white/10 text-right font-bold rounded-xl pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price per Tour */}
                <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
                        {t("revenueSharing.calculator.labels.pricePerTour")}
                      </label>
                      <InfoTooltip content={t("revenueSharing.calculator.labels.priceTip")} />
                    </div>
                    <Coins size={20} className="text-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() =>
                        setPricePerTour(Math.max(1, pricePerTour - 1))
                      }
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isLight
                          ? "bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700"
                          : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      }`}
                    >
                      <Minus size={16} />
                    </button>
                    {/* Desktop: static display */}
                    <div
                      className={`hidden md:block text-4xl font-black tracking-tighter ${isLight ? "text-zinc-900" : "text-white"}`}
                    >
                      {currency.symbol}
                      {pricePerTour}
                    </div>
                    {/* Mobile: tappable numeric input */}
                    <div className="md:hidden flex items-center">
                      <span className={`text-3xl font-black tracking-tighter ${isLight ? "text-zinc-900" : "text-white"}`}>
                        {currency.symbol}
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={pricePerTour}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "");
                          const val = raw === "" ? 1 : Math.min(99, Math.max(1, Number(raw)));
                          setPricePerTour(val);
                        }}
                        className={`w-12 bg-transparent text-3xl font-black tracking-tighter text-center focus:outline-none border-b ${isLight ? "text-zinc-900 border-zinc-300" : "text-white border-white/20"}`}
                      />
                    </div>
                    <button
                      onClick={() => setPricePerTour(Math.min(99, pricePerTour + 1))}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isLight
                          ? "bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700"
                          : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      }`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Strategy CTA Card */}
<Link href="/booking" className="block">
  <div className="p-6 md:p-6 rounded-[2rem] bg-primary flex flex-row self-start items-center justify-between gap-4 md:gap-8 group cursor-pointer hover:bg-white transition-all duration-500">
    <div className="text-left flex-1 min-w-0">
      <h3 style={{ color: "#18181b" }} className="text-lg md:text-3xl font-black tracking-tighter mb-1 md:mb-2 leading-tight">
        {t("revenueSharing.calculator.labels.getStarted")}
      </h3>
      <p className="!text-zinc-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">
        {t("revenueSharing.calculator.labels.bookCall")}
      </p>
    </div>
    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
      <ArrowRight className="w-5 h-5 md:w-8 md:h-8" />
    </div>
  </div>
</Link>
            </div>

              {/* Results & Forecast Column */}
              <div className="lg:col-span-7 space-y-8">
                {/* Result Container - Optimized for large figures */}
                <div className="p-8 md:p-16 rounded-[4rem] bg-zinc-900/30 border border-white/5 backdrop-blur-3xl relative overflow-hidden flex flex-col items-center min-h-[360px] md:min-h-[440px] justify-between">
                  <div className="relative z-10 text-center w-full pt-4 flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary mb-6 md:mb-10 block">
                      {t("revenueSharing.calculator.labels.forecast")}
                    </span>

                    <div
                      ref={earningsRowRef}
                      className="flex items-center justify-center w-full max-w-full px-4 overflow-hidden"
                    >
                      <span
                        ref={symbolRef}
                        className={`font-black mr-4 flex-shrink-0 ${isLight ? "text-zinc-900" : "text-zinc-700"}`}
                        style={{ fontSize: "clamp(1.25rem, 3.5vw, 3rem)" }}
                      >
                        {currency.symbol}
                      </span>
                      <motion.div
                        key={projectedEarnings}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`font-black tracking-tight leading-none whitespace-nowrap ${isLight ? "text-zinc-900" : "text-white"}`}
                        style={{
                          fontSize: `${earningsFontSize}px`,
                          transition: "font-size 0.3s ease",
                        }}
                      >
                        {projectedEarnings.toLocaleString()}
                      </motion.div>
                    </div>

                    <p className="text-zinc-500 text-base md:text-lg font-medium mt-6 md:mt-12">
                      {t("revenueSharing.calculator.labels.netEarnings")}
                    </p>
                  </div>

                  {/* Embedded Sub-stats */}
                  <div className="w-full pt-6 md:pt-10 border-t border-white/5 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                      <div className="text-center group">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-1 md:mb-2 block group-hover:text-zinc-400 transition-colors">
                          {t("revenueSharing.calculator.labels.totalRevenue")}
                        </span>
                        <div
                          className={`text-xl md:text-2xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}
                          style={{
                            fontSize:
                              totalRevenue.toLocaleString().length > 10
                                ? "1.25rem"
                                : "1.5rem",
                          }}
                        >
                          {formatCurrency(totalRevenue)}
                        </div>
                      </div>
                      <div className="text-center group">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-1 md:mb-2 block group-hover:text-zinc-400 transition-colors">
                          {t("revenueSharing.calculator.labels.totalTours")}
                        </span>
                        <div
                          className={`text-xl md:text-2xl font-black ${isLight ? "text-zinc-900" : "text-white"}`}
                        >
                          {totalTours.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Forecast Chart */}
                <div className="hidden md:block p-10 rounded-[3.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h4 className="text-xl font-bold tracking-tight">
                        {t("revenueSharing.calculator.labels.chart.title")}
                      </h4>
                      <p className="text-zinc-500 text-sm">
                        {t("revenueSharing.calculator.labels.chart.subtitle")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                          {t("revenueSharing.calculator.labels.chart.legend")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-28 md:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={chartColor}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={chartColor}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="rate"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#525252",
                            fontSize: 10,
                            fontWeight: "bold",
                          }}
                        />
                        <YAxis hide={true} domain={[0, "auto"]} />
                        <RechartsTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-zinc-900/90 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
                                  <p className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-2">
                                    {t("revenueSharing.calculator.labels.adoptionRate")}: {payload[0].payload.rate}
                                  </p>
                                  <p className="text-2xl font-black text-primary">
                                    {formatCurrency(payload[0].value as number)}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke={chartColor}
                          strokeWidth={4}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          animationDuration={1500}
                        />
                        <ReferenceLine
                          x={`${Math.round(adoptionRate / 5) * 5}%`}
                          stroke="white"
                          strokeDasharray="5 5"
                          strokeOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
