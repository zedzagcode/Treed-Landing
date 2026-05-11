import { Link } from "wouter";
import { Menu, X, ChevronDown, Globe, Layers, Leaf, BarChart2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLenis } from "@/components/ui/SmoothScroll";

import Tree_d_Logo___Secondary from "@assets/Tree'd Logo - Secondary.png";
import Tree_d_Logo___Primary from "@assets/Tree'd_Logo_-_Primary_1774951390210.png";


export function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const lenis = useLenis();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"main" | "ecosystem">("main");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Scroll state tracking with refined hysteresis
  const scrollState = useRef({
    prevScrollY: 0,
    accumulatedDownwardScroll: 0,
    accumulatedUpwardScroll: 0,
    lastInteractionTime: 0,
    rafId: null as number | null,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Cancel pending rAF to avoid duplicate processing
      if (scrollState.current.rafId) {
        cancelAnimationFrame(scrollState.current.rafId);
      }

      scrollState.current.rafId = requestAnimationFrame(() => {
        // Clamp scroll value to handle iOS elastic scroll
        const currentScrollY = Math.max(0, window.scrollY);
        if (currentScrollY < 60) {
          setIsHidden(false);
          scrollState.current.accumulatedDownwardScroll = 0;
          scrollState.current.accumulatedUpwardScroll = 0;
        }
        const prevScrollY = scrollState.current.prevScrollY;
        const delta = currentScrollY - prevScrollY;

        // Update scrolled state for background/border styling
        setIsScrolled(!isMobileMenuOpen && currentScrollY > 20);

        // Dead zone: ignore scroll changes smaller than 10px (prevents jitter)
        if (Math.abs(delta) < 10) {
          scrollState.current.prevScrollY = currentScrollY;
          return;
        }

        // Lock navbar visible for 1.5s after user interaction (click/touch)
        const timeSinceInteraction = Date.now() - scrollState.current.lastInteractionTime;
        const isLockedByInteraction = timeSinceInteraction < 1500;

        if (isLockedByInteraction) {
          setIsHidden(false);
          scrollState.current.prevScrollY = currentScrollY;
          return;
        }

        // Hysteresis logic: require cumulative scroll, not just instant delta
        if (delta > 10) {
          // User scrolling DOWN: accumulate downward distance
          scrollState.current.accumulatedDownwardScroll += delta;

          // Hide only if: cumulative downward scroll >= 25px AND scrollY > 70
          if (
            scrollState.current.accumulatedDownwardScroll >= 60 &&
            currentScrollY > 100
          ) {
            setIsHidden(true);
          }

          // Reset upward accumulation when switching direction
          scrollState.current.accumulatedUpwardScroll = 0;
        } else if (delta < -10) {
          // User scrolling UP: accumulate upward distance
          scrollState.current.accumulatedUpwardScroll += Math.abs(delta);

          // Show only after cumulative upward scroll >= 50px (prevents flicker)
          if (scrollState.current.accumulatedUpwardScroll >= 30) {
            setIsHidden(false);
            scrollState.current.accumulatedUpwardScroll = 0;
          }

          // Reset downward accumulation when switching direction
          scrollState.current.accumulatedDownwardScroll = 0;
        }

        scrollState.current.prevScrollY = currentScrollY;
      });
    };

    // Lock navbar visible on user interaction (prevents hiding while reading)
    const handleInteraction = (e: any) => {
      if (isMobileMenuOpen) return;
      scrollState.current.lastInteractionTime = Date.now();
      setIsHidden(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleInteraction);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleInteraction);
      if (scrollState.current.rafId) {
        cancelAnimationFrame(scrollState.current.rafId);
      }
    };
  }, []);

  // Show navbar when mouse hovers near the top of the screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsMouseNearTop(e.clientY < 60);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, lenis]);

  // Close language dropdown when navbar hides
  useEffect(() => {
    if (isHidden) {
      setIsLanguageDropdownOpen(false);
    }
  }, [isHidden]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const solutionLinks = [
    { name: t('solutionLinks.overview'), href: "/solution" },
    { name: t('solutionLinks.handset'), href: "/handset" },
    { name: t('solutionLinks.tree'), href: "/tree" },
    { name: t('solutionLinks.dashboard'), href: "/dashboard" },
    { name: t('solutionLinks.useCases'), href: "/use-cases" },
  ];

  const navLinks = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.visitorExperience'), href: "/visitor-experience" },
    { name: t('nav.sustainability'), href: "/sustainability" },
    { name: t('nav.blog'), href: "/blog" },
    { name: t('nav.about'), href: "/about" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 border-b transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMobileMenuOpen
            ? "py-4 xl:py-2 bg-transparent border-transparent"
            : isScrolled
              ? "py-3 xl:py-2 glass border-white/5"
              : "py-3 xl:py-2 bg-transparent border-transparent"
        } ${!isMobileMenuOpen && isHidden && !isMouseNearTop ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="container mx-auto flex items-center justify-between py-3 xl:py-0">
          {!isMobileMenuOpen && (
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <img
                src={isMobileMenuOpen ? Tree_d_Logo___Primary : (isLight ? Tree_d_Logo___Primary : Tree_d_Logo___Secondary)}
                alt="Tree'd"
                className="h-8 aspect-auto transition-transform group-hover:scale-105"
                style={{ aspectRatio: "auto" }}
              />
              <span className="sr-only">Tree'd</span>
            </Link>
          )}

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-6 2xl:gap-10">
            <Link
              href="/"
              className="text-[10px] font-bold text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest"
              data-testid="link-nav-home"
            >
              {t('nav.home')}
            </Link>

            <div
              className="relative flex items-center h-full"
              onMouseEnter={() => setIsEcosystemOpen(true)}
              onMouseLeave={() => setIsEcosystemOpen(false)}
            >
              <Link
                href="/solution"
                className={`flex items-center gap-1 text-[10px] font-bold hover:text-primary transition-colors uppercase tracking-widest outline-none cursor-pointer ${isLight ? "text-zinc-700" : "text-zinc-400"}`}
                onClick={() => setIsEcosystemOpen(false)}
                data-testid="link-nav-ecosystem"
              >
                {t('nav.ecosystem')}
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${isEcosystemOpen ? 'rotate-180' : ''}`}
                  style={{ display: 'block' }}
                />
              </Link>

              <AnimatePresence>
                {isEcosystemOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute top-full left-0 mt-2 rounded-xl overflow-hidden shadow-2xl min-w-[200px] z-50 ${isLight ? "bg-white border border-zinc-200" : "bg-zinc-900 border border-white/10"}`}
                    onMouseEnter={() => setIsEcosystemOpen(true)}
                    onMouseLeave={() => setIsEcosystemOpen(false)}
                  >
                    <div className="py-2">
                      {solutionLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`block px-6 py-2 text-[10px] font-bold hover:text-primary transition-all uppercase tracking-[0.2em] ${isLight ? "text-zinc-700 hover:bg-zinc-100" : "text-zinc-400 hover:bg-white/5"}`}
                          onClick={() => setIsEcosystemOpen(false)}
                          data-testid={`link-ecosystem-${link.href.replace('/', '')}`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] font-bold text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest"
                data-testid={`link-nav-${link.href.replace('/', '')}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right: Language + Book Demo + Toggle */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-4">
            <DropdownMenu open={isLanguageDropdownOpen} onOpenChange={setIsLanguageDropdownOpen}>
              <DropdownMenuTrigger className={`flex items-center gap-2 text-[11px] font-bold hover:text-primary transition-colors uppercase outline-none cursor-pointer ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                <Globe className="w-3 h-3" />
                {i18n.language.toUpperCase() === 'EN-US' ? 'EN' : i18n.language.toUpperCase()}
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`min-w-[80px] z-50 ${isLight ? "bg-white border-zinc-200 text-zinc-900" : "bg-zinc-900 border-white/10 text-white"}`}>
                {['en', 'nl', 'fr'].map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    className={`text-[10px] cursor-pointer font-bold uppercase ${isLight ? `${i18n.language === lang ? 'text-primary' : 'text-zinc-700'} focus:bg-zinc-100 focus:text-primary` : `${i18n.language === lang ? 'text-primary' : 'text-white'} focus:bg-white/10 focus:text-primary`}`}
                    onClick={() => changeLanguage(lang)}
                  >
                    {lang === 'en' ? 'EN' : lang === 'nl' ? 'NL' : 'FR'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/booking">
              <Button className="bg-[#C8DF52] text-black hover:opacity-90 font-bold uppercase tracking-tighter text-[10px] rounded-full px-3 cursor-pointer h-7">
                {t('nav.bookDemo')}
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile / Tablet: Hamburger — visible below xl */}
          <div className={`xl:hidden flex items-center gap-3 flex-shrink-0 relative ${isMobileMenuOpen ? "px-6" : ""}`} style={{ zIndex: 9999 }}>
            <button
              className={`p-2 rounded-lg transition-all ${isLight ? "bg-white/80 hover:bg-white shadow-sm" : "bg-black/40 hover:bg-black/60"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              style={{ zIndex: 9999 }}
            >
              {!isMobileMenuOpen && (
                <Menu size={28} className={isLight ? "text-black" : "text-white"} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="xl:hidden fixed inset-0 z-[1001] bg-[#C8DF52]"
          >
            {/* Close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 left-6 z-[50]"
              aria-label="Close menu"
            >
              <X size={28} className="text-black" />
            </button>

            <div
              data-lenis-prevent
              className="flex flex-col h-full px-6 pt-28 pb-6"
            >
              {/* Headline */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold leading-tight text-black">
                  {t('mobileMenu.headline')}
                </h1>
              </div>

              {/* Main view */}
              {mobileView === "main" ? (
                <div className="flex flex-col flex-1">
                  {/* Home */}
                  <Link href="/">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-between items-center py-3 border-b border-black/20 text-lg font-medium text-black"
                    >
                      <span>{t('nav.home')}</span>
                      <span className="text-black">→</span>
                    </div>
                  </Link>

                  {/* Ecosystem — opens sub-view, does NOT navigate */}
                  <div
                    onClick={() => setMobileView("ecosystem")}
                    className="flex justify-between items-center py-3 border-b border-black/20 text-lg font-medium cursor-pointer text-black"
                  >
                    <span>{t('nav.ecosystem')}</span>
                    <span className="text-black">→</span>
                  </div>

                  {/* Use Cases */}
                  <Link href="/use-cases">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex justify-between items-center py-3 border-b border-black/20 text-lg font-medium text-black"
                    >
                      <span>{t('solutionLinks.useCases')}</span>
                      <span className="text-black">→</span>
                    </div>
                  </Link>

                  {/* Other nav links */}
                  {navLinks.slice(1).map((link) => (
                    <Link key={link.name} href={link.href}>
                      <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex justify-between items-center py-3 border-b border-black/20 text-lg font-medium text-black"
                      >
                        <span>{link.name}</span>
                        <span className="text-black">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Ecosystem sub-view */
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Back — outside scroll zone, always visible */}
                  <div
                    onClick={() => setMobileView("main")}
                    className="flex items-center gap-2 mb-4 cursor-pointer flex-shrink-0"
                  >
                    <span className="text-black/60 text-sm font-bold tracking-wide">← {t('mobileMenu.ecosystem.back')}</span>
                  </div>

                  {/* Section label — outside scroll zone */}
                  <div className="text-[9px] font-black tracking-[0.3em] text-black/40 uppercase mb-3 flex-shrink-0">
                    {t('nav.ecosystem')}
                  </div>

                  {/*
                    Scrollable bento zone.
                    Inner div uses min-h-full so it fills the scroll area proportionally.
                    If card min-heights push the grid taller than the scroll area, scroll activates.
                    All colours use hardcoded hex / arbitrary Tailwind classes to bypass
                    the .light overrides in index.css (which target named classes like
                    bg-zinc-950, text-white, h3, p with !important).
                  */}
                  {/* Scrollable zone — fixed-height cards, scrolls on very small screens */}
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">

                      {/* ── Card 1: Handset — full width, h-54 ── */}
                      <Link
                        href="/handset"
                        className="col-span-2"
                        onClick={() => { setMobileView("main"); setIsMobileMenuOpen(false); }}
                      >
                        <div className="relative rounded-2xl overflow-hidden h-54" style={{ backgroundColor: '#0a0a0a' }}>
                          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-[#C8DF52]/[0.16] blur-3xl pointer-events-none" />
                          <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full bg-[#C8DF52]/[0.12] blur-3xl pointer-events-none" />
                          <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#C8DF52]/[0.07] blur-3xl pointer-events-none" />
                          <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <div className="max-w-[70%]">
                              <div className="inline-flex items-center gap-1.5 bg-[#C8DF52]/10 border border-[#C8DF52]/30 text-[#C8DF52] text-[9px] font-black uppercase tracking-widest rounded-full px-2.5 py-0.5 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C8DF52]" />
                                {t('mobileMenu.ecosystem.badge')}
                              </div>
                              <span className="block text-[#ffffff] text-2xl font-bold leading-tight mb-1">
                                {t('mobileMenu.ecosystem.handset.title')}
                              </span>
                              <span className="block text-[#a1a1aa] text-xs leading-snug mb-3">
                                {t('mobileMenu.ecosystem.handset.desc')}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[#C8DF52] text-[10px] font-bold uppercase tracking-widest">
                                {t('mobileMenu.ecosystem.explore')} →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* ── Card 2: Overview — full width, h-32 ── */}
                      <Link
                        href="/solution"
                        className="col-span-2"
                        onClick={() => { setMobileView("main"); setIsMobileMenuOpen(false); }}
                      >
                        <div className="relative rounded-2xl overflow-hidden h-32 flex flex-col justify-end p-4" style={{ backgroundColor: '#0a0a0a' }}>
                          <div className="absolute right-0 inset-y-0 w-40 bg-gradient-to-l from-[#C8DF52]/[0.09] to-transparent pointer-events-none" />
                          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#C8DF52]/[0.07] blur-3xl pointer-events-none" />
                          <div className="relative z-10">
                            <Layers className="w-5 h-5 text-[#C8DF52] mb-2.5" />
                            <span className="text-[#ffffff] font-bold text-base block leading-tight mb-0.5">
                              {t('mobileMenu.ecosystem.overview.title')}
                            </span>
                            <span className="text-[#71717a] text-[11px]">
                              {t('mobileMenu.ecosystem.overview.desc')}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* ── Card 3: Tree — left half, h-32 ── */}
                      <Link
                        href="/tree"
                        onClick={() => { setMobileView("main"); setIsMobileMenuOpen(false); }}
                      >
                        <div className="relative rounded-2xl overflow-hidden h-32 flex flex-col justify-end p-4" style={{ backgroundColor: '#0a0a0a' }}>
                          <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-[#C8DF52]/[0.10] blur-3xl pointer-events-none" />
                          <div className="relative z-10">
                            <Leaf className="w-5 h-5 text-[#C8DF52] mb-2.5" />
                            <span className="text-[#ffffff] font-bold text-xs block leading-tight mb-0.5">
                              {t('mobileMenu.ecosystem.tree.title')}
                            </span>
                            <span className="text-[#71717a] text-[10px] leading-snug">
                              {t('mobileMenu.ecosystem.tree.desc')}
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* ── Card 4: Dashboard — right half, h-32 ── */}
                      <Link
                        href="/dashboard"
                        onClick={() => { setMobileView("main"); setIsMobileMenuOpen(false); }}
                      >
                        <div className="relative rounded-2xl overflow-hidden h-32 flex flex-col justify-end p-4" style={{ backgroundColor: '#0a0a0a' }}>
                          <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#C8DF52]/[0.10] blur-3xl pointer-events-none" />
                          <div className="relative z-10">
                            <BarChart2 className="w-5 h-5 text-[#C8DF52] mb-2.5" />
                            <span className="text-[#ffffff] font-bold text-xs block leading-tight mb-0.5">
                              {t('mobileMenu.ecosystem.dashboard.title')}
                            </span>
                            <span className="text-[#71717a] text-[10px] leading-snug">
                              {t('mobileMenu.ecosystem.dashboard.desc')}
                            </span>
                          </div>
                        </div>
                      </Link>

                    </div>
                  </div>
                </div>
              )}

              {/* Bottom CTA row */}
              <div className="flex items-center justify-between gap-3 mt-6">
                {/* Book Demo CTA */}
                <Link href="/booking" className="flex-1">
                <div
  onClick={() => setIsMobileMenuOpen(false)}
  className="flex-1 !bg-black !text-[#C8DF52] rounded-full px-6 py-4 text-sm font-bold uppercase flex justify-between items-center"
>
                    <span>{t('nav.bookDemo')}</span>
                    <span>→</span>
                  </div>
                </Link>

                {/* Language selector + Theme toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-[#B7D34B] rounded-full px-4 py-4 text-sm font-bold flex items-center gap-1" style={{ color: '#000000' }}>
                        {i18n.language.toUpperCase().slice(0, 2)}
                        <ChevronDown className="w-3 h-3" style={{ color: '#000000' }} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="top"
                      align="end"
                      className="bg-black text-white border-none"
                      style={{ zIndex: 9999 }}
                    >
                      {['en', 'nl', 'fr'].map((lang) => (
                        <DropdownMenuItem
                          key={lang}
                          onClick={() => {
                            i18n.changeLanguage(lang);
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-sm font-bold cursor-pointer focus:bg-white/10 focus:text-white"
                        >
                          {lang.toUpperCase()}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Theme toggle — same as desktop, visible only when menu is open */}
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}                          