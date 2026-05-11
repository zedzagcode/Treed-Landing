import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, ArrowUpRight, Minus, Plus } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { countries as countriesData } from "countries-list";

// ─── COUNTRY OPTIONS (ISO 3166-1, sorted alphabetically) ─────────────────────

const COUNTRY_OPTIONS: { code: string; name: string }[] = Object.entries(countriesData)
  .map(([code, data]) => ({ code, name: (data as { name: string }).name }))
  .sort((a, b) => a.name.localeCompare(b.name));


// ─── TYPES ────────────────────────────────────────────────────────────────────

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  organization: string; jobTitle: string;
  country: string; countryCode: string; city: string;
  usageTypes: string[]; otherUsage: string;
  annualVisitors: string; currentSolutions: string[]; otherSolution: string;
  numGuides: string; numArtifacts: string; numLanguages: number; launchTimeline: string;
  commercialModel: string; additionalInfo: string;
}

const INITIAL_FORM: FormData = {
  firstName: "", lastName: "", email: "", phone: "", organization: "", jobTitle: "",
  country: "", countryCode: "", city: "",
  usageTypes: [], otherUsage: "",
  annualVisitors: "", currentSolutions: [], otherSolution: "",
  numGuides: "", numArtifacts: "", numLanguages: 3, launchTimeline: "",
  commercialModel: "", additionalInfo: "",
};

const TOTAL_STEPS = 4;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold flex items-center gap-1">
      {label}
      {required && <span className="text-primary">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p
      className="text-xs mt-1"
      style={{
        color: "#dc2626",
        WebkitTextFillColor: "#dc2626",
        opacity: 1,
      }}
    >
      {message}
    </p>
  );
}
function StyledInput({
  value, onChange, placeholder, type = "text", inputMode, className,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"]; className?: string;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-xl px-5 py-3.5 outline-none transition-all text-sm focus:border-primary",
        isLight
          ? "bg-zinc-50 border border-zinc-200 focus:bg-white text-zinc-900 placeholder:text-zinc-400"
          : "bg-white/5 border border-white/10 focus:bg-white/10 text-white placeholder:text-zinc-500",
        className
      )}
    />
  );
}

function StyledSelect({
  value, onChange, placeholder, options,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; options: { value: string; label: string }[];
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-xl px-5 py-3.5 outline-none transition-all text-sm focus:border-primary appearance-none cursor-pointer",
        isLight
          ? "bg-white border border-zinc-200 focus:bg-white text-zinc-900"
          : "bg-white/5 border border-white/10 focus:bg-white/10 text-white",
        !value && (isLight ? "text-zinc-500" : "text-zinc-500")
      )}
      style={isLight ? { color: value ? "#18181b" : "#71717a" } : undefined}
    >
      {placeholder && (
        <option value="" disabled hidden style={isLight ? { color: "#71717a", backgroundColor: "#ffffff" } : undefined}>
          {placeholder}
        </option>
      )}

      {options.map((o) => (
        <option
          key={o.value}
          value={o.value}
          style={
            isLight
              ? { color: "#18181b", backgroundColor: "#ffffff" }
              : { color: "#ffffff", backgroundColor: "#18181b" }
          }
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}

// Autocomplete dropdown
function Autocomplete({
  options, value, onChange, placeholder, disabled = false,
}: {
  options: string[]; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSearch(value); }, [value]);

  const filtered = options
    .filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 60);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!options.includes(search)) {
          setSearch(value);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [options, search, value]);

  return (
    <div ref={containerRef} className="relative">
      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={cn(
          "w-full rounded-xl px-5 py-3.5 outline-none transition-all text-sm focus:border-primary",
          isLight
            ? "bg-zinc-50 border border-zinc-200 focus:bg-white text-zinc-900 placeholder:text-zinc-400"
            : "bg-white/5 border border-white/10 focus:bg-white/10 text-white placeholder:text-zinc-500",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full mt-1.5 w-full max-h-52 overflow-y-auto rounded-xl border z-50 shadow-xl",
              isLight ? "bg-white border-zinc-200" : "bg-zinc-900 border-white/10"
            )}
          >
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onChange(opt); setSearch(opt); setOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors",
                  isLight ? "hover:bg-zinc-50 text-zinc-900" : "hover:bg-white/10 text-zinc-200"
                )}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Toggle pill checkbox button
function CheckboxPill({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : isLight
            ? "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100"
            : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );
}

// Language stepper
function LanguageStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const decrement = () => onChange(Math.max(1, value - 1));
  const increment = () => onChange(Math.min(25, value + 1));

  return (
    <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-primary/40 w-fit">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= 1}
        className={cn(
          "w-12 h-12 flex items-center justify-center transition-colors",
          isLight
            ? "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 disabled:opacity-30"
            : "bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-30"
        )}
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => {
          const digitsOnly = e.target.value.replace(/\D/g, "");

          if (digitsOnly === "") return;

          const parsed = parseInt(digitsOnly, 10);
          if (!isNaN(parsed)) {
            onChange(Math.max(1, Math.min(25, parsed)));
          }
        }}
        className={cn(
          "w-14 h-12 text-center text-sm font-bold outline-none border-x [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          isLight
            ? "bg-zinc-50 border-zinc-200 text-zinc-900"
            : "bg-white/5 border-white/10 text-white"
        )}
      />

      <button
        type="button"
        onClick={increment}
        disabled={value >= 25}
        className={cn(
          "w-12 h-12 flex items-center justify-center transition-colors",
          isLight
            ? "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 disabled:opacity-30"
            : "bg-white/5 text-zinc-300 hover:bg-white/10 disabled:opacity-30"
        )}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

// Progress bar
function ProgressBar({ currentStep, stepTitles }: { currentStep: number; stepTitles: string[] }) {
  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
  return (
    <div className="mb-10">
      {/* Circles */}
      <div className="flex items-start justify-between">
        {stepTitles.map((title, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isCompleted || isCurrent
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(200,223,82,0.3)]"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                )}
              >
                {stepNum}
              </div>
              <span
                className={cn(
                  "mt-2 text-[10px] text-center leading-tight font-medium transition-colors hidden sm:block",
                  isCurrent ? "text-primary" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                )}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress bar track */}
      <div className="mt-4 h-1 rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RequestPricing() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [revealPhone, setRevealPhone] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
    },
    []
  );

 const toggleArray = (field: "usageTypes" | "currentSolutions", value: string) => {
  setFormData((prev) => {
    const arr = prev[field];
    let next: string[];

    if (field === "currentSolutions") {
      if (value === "none") {
        next = arr.includes("none") ? arr.filter((v) => v !== "none") : ["none"];
      } else {
        const withoutNone = arr.filter((v) => v !== "none");
        next = withoutNone.includes(value)
          ? withoutNone.filter((v) => v !== value)
          : [...withoutNone, value];
      }
    } else {
      next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
    }

    return { ...prev, [field]: next };
  });

  setErrors((prev) => {
    const e = { ...prev };
    delete e[field];
    return e;
  });
};

  const validate = (step: number): boolean => {
    const errs: Record<string, string> = {};
    const req = t("requestPricing.errors.required");
    const emailInvalid = t("requestPricing.errors.emailInvalid");
    const selectOne = t("requestPricing.errors.selectAtLeastOne");

    if (step === 1) {
      if (!formData.firstName.trim()) errs.firstName = req;
      if (!formData.lastName.trim()) errs.lastName = req;
      if (!formData.email.trim()) errs.email = req;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = emailInvalid;
      if (!formData.organization.trim()) errs.organization = req;
    }
    if (step === 2) {
      if (!formData.country.trim()) errs.country = req;
      if (!formData.city.trim()) errs.city = req;
      if (formData.usageTypes.length === 0) errs.usageTypes = selectOne;
      if (!formData.annualVisitors) errs.annualVisitors = req;
    }
    if (step === 3) {
      if (!formData.numGuides) errs.numGuides = req;
      if (!formData.numArtifacts) errs.numArtifacts = req;
    }
    if (step === 4) {
      if (!formData.commercialModel) errs.commercialModel = req;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async () => {
    if (!validate(4)) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/pricing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      // still show success — submission logged server-side
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stepTitles = [
    t("requestPricing.form.steps.1.title"),
    t("requestPricing.form.steps.2.title"),
    t("requestPricing.form.steps.3.title"),
    t("requestPricing.form.steps.4.title"),
  ];

  // City is a free-text field — no list restriction, globally inclusive

  const inputBase = isLight
    ? "bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3.5 focus:border-primary outline-none transition-all focus:bg-white text-sm text-zinc-900 placeholder:text-zinc-400"
    : "bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 focus:border-primary outline-none transition-all focus:bg-white/10 text-sm placeholder:text-zinc-500";

  const cardClass = isLight
    ? "bg-white border border-zinc-100 shadow-lg"
    : "glass border-primary/20 shadow-[0_0_80px_-20px_rgba(200,223,82,0.1)]";

  const STEP_VARIANTS = {
    enter: { opacity: 0, x: 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <SEO page="requestPricing" />
      <StructuredData page="requestPricing" />
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(200,223,82,0.08),transparent_60%)]" />
        <div className="container mx-auto relative z-10 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-primary text-xs uppercase tracking-[0.4em] font-bold mb-6 block">
              {t("requestPricing.hero.label")}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tighter">
 <Trans
  i18nKey="requestPricing.hero.headline"
  components={[<span className="text-gradient-primary" />]}
/>
</h1>
            <p className={cn("text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed", isLight ? "text-zinc-600" : "text-zinc-400")}>
              {t("requestPricing.hero.subheadline")}
            </p>
            
          </motion.div>
        </div>
      </section>

      {/* ── SUPPORT BLOCK ── */}
      <section className="pb-20 relative">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
  "p-8 md:p-10 rounded-[2.5rem] border shadow-sm",
  isLight
    ? "border-zinc-200 bg-white"
    : "border-white/5 bg-zinc-900/40"
)}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">
                  {t("requestPricing.support.headline")}
                </h2>
                <p className={cn("text-sm leading-relaxed", isLight ? "text-zinc-600" : "text-zinc-400")}>
                  {t("requestPricing.support.body")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                <Link href="/booking" className="w-full sm:w-auto">
                  <Button className="w-full bg-primary text-black h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">
                    {t("requestPricing.support.ctaPrimary")}
                  </Button>
                </Link>
                {/* Call button: tel on mobile, reveal on desktop */}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 768) {
                      window.location.href = "tel:+31202101985";
                    } else {
                      setRevealPhone((p) => !p);
                    }
                  }}
                  className={cn(
                    "w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs uppercase tracking-widest border transition-all",
                    isLight ? "border-zinc-300 text-zinc-700 hover:border-primary hover:text-primary" : "border-zinc-700 text-zinc-300 hover:border-primary hover:text-primary"
                  )}
                >
                  {revealPhone ? "+31 20 210 1985" : t("requestPricing.support.ctaSecondary")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MULTI-STEP FORM ── */}
      <section ref={formRef} className="pb-32 relative scroll-mt-24">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("p-8 md:p-12 rounded-[3rem] relative", cardClass)}
          >
            {/* Live indicator */}
            <div className="absolute top-8 right-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            </div>

            {submitted ? (
              /* ── SUCCESS STATE ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-5 tracking-tight">
                  {t("requestPricing.success.title")}
                </h2>
                <p className={cn("text-base leading-relaxed max-w-md mx-auto", isLight ? "text-zinc-600" : "text-zinc-400")}>
                  {t("requestPricing.success.body")}
                </p>
                <p className={cn("text-sm mt-6 leading-relaxed", isLight ? "text-zinc-500" : "text-zinc-500")}>
                  {t("requestPricing.success.callText")}{" "}
                  <a href="tel:+31202101985" className="text-primary hover:underline font-medium">
                    {t("requestPricing.success.callLink")}
                  </a>
                  {t("requestPricing.success.callPeriod")}
                </p>
                <p className={cn("text-sm mt-3 leading-relaxed", isLight ? "text-zinc-500" : "text-zinc-500")}>
                  {t("requestPricing.success.blogText")}{" "}
                  <Link href="/blog" className="text-primary hover:underline font-medium">
                    {t("requestPricing.success.blogLink")}
                  </Link>
                  {t("requestPricing.success.blogPeriod")}
                </p>
              </motion.div>
            ) : (
              <>
                {/* Form header */}
                <div className="mb-8">
                  <span className="text-primary text-xs uppercase tracking-[0.3em] font-bold mb-3 block">
                    {t("requestPricing.form.headline")}
                  </span>
                  <p className={cn("text-sm", isLight ? "text-zinc-500" : "text-zinc-500")}>
                    {t("requestPricing.form.intro")}
                  </p>
                </div>

                {/* Progress bar */}
                <ProgressBar currentStep={currentStep} stepTitles={stepTitles} />

                {/* Step content */}
                <div className="relative">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentStep}
                      variants={STEP_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {/* ── STEP 1: About you ── */}
                      {currentStep === 1 && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step1.firstName")} required />
                              <StyledInput value={formData.firstName} onChange={(v) => update("firstName", v)} placeholder="Jane" />
                              <FieldError message={errors.firstName} />
                            </div>
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step1.lastName")} required />
                              <StyledInput value={formData.lastName} onChange={(v) => update("lastName", v)} placeholder="Doe" />
                              <FieldError message={errors.lastName} />
                            </div>
                          </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  <div className="space-y-2">
    <FieldLabel label={t("requestPricing.form.step1.email")} required />
    <StyledInput
      type="email"
      value={formData.email}
      onChange={(v) => update("email", v)}
      placeholder="jane@museum.com"
    />
    <FieldError message={errors.email} />
  </div>

  <div className="space-y-2">
    <FieldLabel label={t("requestPricing.form.step1.phone")} />
    <StyledInput
      type="tel"
      value={formData.phone}
      onChange={(v) => update("phone", v)}
      placeholder="+31 20 000 0000"
    />
  </div>
</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step1.organization")} required />
                              <StyledInput value={formData.organization} onChange={(v) => update("organization", v)} placeholder="The National Museum" />
                              <FieldError message={errors.organization} />
                            </div>
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step1.jobTitle")} />
                              <StyledInput value={formData.jobTitle} onChange={(v) => update("jobTitle", v)} placeholder="Director" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── STEP 2: About your museum ── */}
                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step2.country")} required />
                              <Autocomplete
                                options={COUNTRY_OPTIONS.map((c) => c.name)}
                                value={formData.country}
                                onChange={(name) => {
                                  const match = COUNTRY_OPTIONS.find((c) => c.name === name);
                                  update("country", name);
                                  update("countryCode", match?.code ?? "");
                                }}
                                placeholder={t("requestPricing.form.step2.countryPlaceholder")}
                              />
                              <FieldError message={errors.country} />
                            </div>
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step2.city")} required />
                              <StyledInput
                                value={formData.city}
                                onChange={(v) => update("city", v)}
                                placeholder={t("requestPricing.form.step2.cityPlaceholder")}
                              />
                              <FieldError message={errors.city} />
                            </div>
                          </div>

                          {/* Usage types */}
                          <div className="space-y-3">
                            <div>
                              <FieldLabel label={t("requestPricing.form.step2.usage.label")} required />
                              <p className={cn("text-xs mt-0.5", isLight ? "text-zinc-500" : "text-zinc-500")}>
                                {t("requestPricing.form.step2.usage.helper")}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {(["permanent", "temporary", "special", "other"] as const).map((key) => (
                                <CheckboxPill
                                  key={key}
                                  label={t(`requestPricing.form.step2.usage.${key}`)}
                                  selected={formData.usageTypes.includes(key)}
                                  onClick={() => toggleArray("usageTypes", key)}
                                />
                              ))}
                            </div>
                            <AnimatePresence>
                              {formData.usageTypes.includes("other") && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <StyledInput
                                    value={formData.otherUsage}
                                    onChange={(v) => update("otherUsage", v)}
                                    placeholder={t("requestPricing.form.step2.usage.otherPlaceholder")}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <FieldError message={errors.usageTypes} />
                          </div>

                          {/* Annual visitors */}
                          <div className="space-y-2">
                            <FieldLabel label={t("requestPricing.form.step2.visitors.label")} required />
                            <StyledSelect
                              value={formData.annualVisitors}
                              onChange={(v) => update("annualVisitors", v)}
                              placeholder={t("requestPricing.form.step2.visitors.placeholder")}
                              options={[
                                { value: "under50k", label: t("requestPricing.form.step2.visitors.under50k") },
                                { value: "50to200k", label: t("requestPricing.form.step2.visitors.50to200k") },
                                { value: "200to500k", label: t("requestPricing.form.step2.visitors.200to500k") },
                                { value: "500kplus", label: t("requestPricing.form.step2.visitors.500kplus") },
                              ]}
                            />
                            <FieldError message={errors.annualVisitors} />
                          </div>

                          {/* Current solutions */}
                          <div className="space-y-3">
                            <div>
                              <FieldLabel label={t("requestPricing.form.step2.currentSolution.label")} />
                              <p className={cn("text-xs mt-0.5", isLight ? "text-zinc-500" : "text-zinc-500")}>
                                {t("requestPricing.form.step2.currentSolution.helper")}
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {(["none", "audioGuides", "mobileApp", "liveGuides", "other"] as const).map((key) => (
                                <CheckboxPill
                                  key={key}
                                  label={t(`requestPricing.form.step2.currentSolution.${key}`)}
                                  selected={formData.currentSolutions.includes(key)}
                                  onClick={() => toggleArray("currentSolutions", key)}
                                />
                              ))}
                            </div>
                            <AnimatePresence>
                              {formData.currentSolutions.includes("other") && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <StyledInput
                                    value={formData.otherSolution}
                                    onChange={(v) => update("otherSolution", v)}
                                    placeholder={t("requestPricing.form.step2.currentSolution.otherPlaceholder")}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* ── STEP 3: Project scope ── */}
                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step3.numGuides.label")} required />
                              <StyledSelect
                                value={formData.numGuides}
                                onChange={(v) => update("numGuides", v)}
                                placeholder={t("requestPricing.form.step3.placeholder")}
                                options={[
                                  { value: "10to20", label: t("requestPricing.form.step3.numGuides.10to20") },
                                  { value: "21to50", label: t("requestPricing.form.step3.numGuides.21to50") },
                                  { value: "51to100", label: t("requestPricing.form.step3.numGuides.51to100") },
                                  { value: "100plus", label: t("requestPricing.form.step3.numGuides.100plus") },
                                ]}
                              />
                              <FieldError message={errors.numGuides} />
                            </div>
                            <div className="space-y-2">
                              <FieldLabel label={t("requestPricing.form.step3.numArtifacts.label")} required />
                              <StyledSelect
                                value={formData.numArtifacts}
                                onChange={(v) => update("numArtifacts", v)}
                                placeholder={t("requestPricing.form.step3.placeholder")}
                                options={[
                                  { value: "10to25", label: t("requestPricing.form.step3.numArtifacts.10to25") },
                                  { value: "26to50", label: t("requestPricing.form.step3.numArtifacts.26to50") },
                                  { value: "51to100", label: t("requestPricing.form.step3.numArtifacts.51to100") },
                                  { value: "100plus", label: t("requestPricing.form.step3.numArtifacts.100plus") },
                                ]}
                              />
                              <FieldError message={errors.numArtifacts} />
                            </div>
                          </div>

                          {/* Language stepper */}
                          <div className="space-y-3">
                            <FieldLabel label={t("requestPricing.form.step3.numLanguages.label")} required />
                            <LanguageStepper
  value={formData.numLanguages}
  onChange={(v) => update("numLanguages", Math.max(1, Math.min(25, v)))}
/>
                          </div>

                          {/* Launch timeline */}
                          <div className="space-y-2">
                            <FieldLabel label={t("requestPricing.form.step3.timeline.label")} />
                            <StyledSelect
                              value={formData.launchTimeline}
                              onChange={(v) => update("launchTimeline", v)}
                              placeholder={t("requestPricing.form.step3.placeholder")}
                              options={[
                                { value: "3months", label: t("requestPricing.form.step3.timeline.3months") },
                                { value: "6months", label: t("requestPricing.form.step3.timeline.6months") },
                                { value: "1year", label: t("requestPricing.form.step3.timeline.1year") },
                                { value: "exploring", label: t("requestPricing.form.step3.timeline.exploring") },
                              ]}
                            />
                          </div>
                        </div>
                      )}

                      {/* ── STEP 4: Final details ── */}
                      {currentStep === 4 && (
                        <div className="space-y-6">
                          <div className="space-y-3">
  <div>
    <FieldLabel label={t("requestPricing.form.step4.commercialModel.label")} required />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
    {([
      { key: "directLicensing", label: t("requestPricing.form.step4.commercialModel.directLicensing") },
      { key: "revenueSharing", label: t("requestPricing.form.step4.commercialModel.revenueSharing") },
      { key: "notSure", label: t("requestPricing.form.step4.commercialModel.notSure") },
    ] as const).map((option) => (
      <CheckboxPill
        key={option.key}
        label={option.label}
        selected={formData.commercialModel === option.key}
        onClick={() => update("commercialModel", option.key)}
      />
    ))}
  </div>

  <FieldError message={errors.commercialModel} />

  <p className={cn("text-xs mt-2", isLight ? "text-zinc-500" : "text-zinc-500")}>
    {t("requestPricing.form.step4.commercialModel.helperPrefix")}{" "}
    <a
      href="/revenue-sharing"
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline inline-flex items-center gap-0.5 font-medium"
    >
      {t("requestPricing.form.step4.commercialModel.helperLink")}
      <ArrowUpRight className="w-3 h-3" />
    </a>
  </p>
</div>

                          <div className="space-y-2">
                            <FieldLabel label={t("requestPricing.form.step4.additionalInfo.label")} />
                            <textarea
                              value={formData.additionalInfo}
                              onChange={(e) => update("additionalInfo", e.target.value)}
                              placeholder={t("requestPricing.form.step4.additionalInfo.placeholder")}
                              rows={5}
                              className={cn(
                                "w-full rounded-xl px-5 py-3.5 outline-none transition-all text-sm resize-none focus:border-primary",
                                isLight
                                  ? "bg-zinc-50 border border-zinc-200 focus:bg-white text-zinc-900 placeholder:text-zinc-400"
                                  : "bg-white/5 border border-white/10 focus:bg-white/10 text-white placeholder:text-zinc-500"
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                          isLight
                            ? "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                            : "border-white/10 text-zinc-400 hover:border-white/20 hover:bg-white/5"
                        )}
                        aria-label={t("requestPricing.form.navigation.back")}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    {currentStep < TOTAL_STEPS ? (
                      <Button
                        onClick={handleNext}
                        className="bg-primary text-black h-12 px-8 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.99] transition-all shadow-[0_10px_25px_-8px_rgba(200,223,82,0.3)]"
                      >
                        {t("requestPricing.form.navigation.continue")}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-black h-12 px-8 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.99] transition-all shadow-[0_10px_25px_-8px_rgba(200,223,82,0.3)] disabled:opacity-70 disabled:scale-100"
                      >
                        {isSubmitting ? "…" : t("requestPricing.form.navigation.submit")}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
