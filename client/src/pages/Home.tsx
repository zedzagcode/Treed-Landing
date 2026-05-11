import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Globe, Zap, Cpu, MousePointer2, MessageSquare, Rocket, Sparkles, Languages, AudioLines, Bot, Footprints, Hand, Leaf, BookOpen, Users, Recycle, Brain, Smile, Coins, Banknote, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { SEO, StructuredData } from "@/components/SEO";
import { useTheme } from "@/contexts/ThemeContext";

import AblaLogo from "@assets/AblaArtFoundationOrangeLogo_1768506160069.png";
import FayoumLogo from "@assets/FayoumLogo_1768505839322.png";

import sideBySide from "@assets/Side-to-side_close_up_1768504652696.png";
import blackTree from "@assets/Full_black_tree_-_Copy_1768504952280.png";
import dashboardImg from "@assets/Dashboard_4_1768505084944.png";

import nfcPanel from "@assets/NFC_Language_Panel_1768514462979.png";
import nfcScan from "@assets/NFC_Scan_1768514547672.png";
import statueTalking from "@assets/Statue_AI_Talking_1768514552464.png";

export default function Home() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const ctaRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const unboundRef = useRef<HTMLSpanElement>(null);
  const unboundX = useMotionValue(0);
  const unboundY = useMotionValue(0);
  const unboundOpacity = useSpring(0, { stiffness: 300, damping: 30 });

  const handleUnboundMouseMove = (e: React.MouseEvent) => {
    if (!unboundRef.current) return;
    const rect = unboundRef.current.getBoundingClientRect();
    unboundX.set(e.clientX - rect.left);
    unboundY.set(e.clientY - rect.top);
    unboundOpacity.set(1);
  };

  const handleUnboundMouseLeave = () => {
    unboundOpacity.set(0);
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground [overflow-x:clip] selection:bg-primary selection:text-primary-foreground">
      <SEO page="home" />
      <StructuredData page="home" />
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 overflow-hidden bg-[#050505]" style={{ backgroundColor: '#050505' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.02)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 text-left"
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-10 backdrop-blur-md">
  {t('hero.label')}
</span>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-10 text-white max-w-3xl" data-testid="text-hero-title">
                {t('hero.futureTitle')} <br/>
                <span className="text-gradient-primary">{t('hero.museumStorytelling')}</span>
              </h1>
                        
              <div className="text-base md:text-lg mb-14 max-w-xl font-light leading-relaxed" style={{ color: isLight ? '#4B5563' : 'rgba(161,161,170,1)' }}>
                <p style={{ color: 'inherit' }}>{t('hero.subtitle')}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-center">
  <Link href="/booking">
    <Button className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold tracking-normal group shadow-none transition-colors duration-300">
      {t('nav.bookDemo')}
      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        <ArrowRight className="ml-2 w-4 h-4" />
      </motion.span>
    </Button>
  </Link>

  <Link href="/solution">
    <Button
      variant="ghost"
      className={`rounded-full h-12 px-8 text-base font-bold tracking-normal transition-colors border duration-300 ${
        isLight
          ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
          : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      {t('hero.explore')}
    </Button>
  </Link>
</div>
            </motion.div>

            <div className="flex-1 relative hidden lg:flex justify-center items-center">
              <div className="relative w-[500px] h-[500px]">
                {/* Dynamic Hero Circle Animation */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <motion.div 
                    animate={{ 
                      rotate: 360,
                      borderRadius: ["50%", "40%", "50%"],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 border border-primary/30 shadow-[0_0_50px_rgba(200,223,82,0.1)]"
                  />
                  <motion.div 
                    animate={{ 
                      rotate: -360,
                      borderRadius: ["50%", "60%", "50%"],
                    }}
                    transition={{ 
                      rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                      borderRadius: { duration: 12, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute inset-10 border border-white/5"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-32 h-32 bg-primary/20 rounded-full blur-3xl"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
          className="mt-20 flex flex-col items-center gap-4 cursor-pointer pointer-events-none pb-12 relative z-20"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-primary/70 font-black drop-shadow-[0_0_8px_rgba(200,223,82,0.3)]">
  {t('home.scroll')}
</span>
          <div className="w-[2.5px] h-20 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent shadow-[0_0_20px_rgba(200,223,82,0.4)] rounded-full"></div>
        </motion.div>
      </section>
      {/* Ecosystem Bento Grid */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="mb-20">
            <span className="text-primary text-sm uppercase tracking-widest font-medium mb-4 block">{t('home.ecosystem.label')}</span>
            <h2 className="text-[2rem] md:text-[2.4rem] leading-[1.2] md:leading-[1.15] font-bold mb-6">
                {t('home.ecosystem.title1')}<br/>
                {t('home.ecosystem.title2')}
            </h2>
            <Link href="/solution">
              <Button size="lg" className="bg-primary !text-black hover:bg-primary/90 rounded-full h-12 px-8 text-base font-bold transition-colors duration-300">
                {t('home.ecosystem.explore')} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="md:col-span-2 relative group overflow-hidden rounded-3xl glass-card border-white/5 bg-zinc-900/40"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-zinc-800/0 to-zinc-900/80"></div>
              <img 
                src={sideBySide} 
                alt="Tree'd handset device used as a screen-free AI museum audio guide"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12">
                <h3 className="text-xl md:text-3xl font-bold mb-2 !text-white">{t('home.ecosystem.handset.title')}</h3>
                <p className="text-sm md:text-lg mb-6 max-w-md text-very-light-gray">
                  {t('home.ecosystem.handset.desc')}
                </p>
                <Link href="/handset" className="inline-flex items-center text-primary font-bold hover:text-white transition-all cursor-pointer uppercase tracking-widest text-sm group/view">
                  {t('home.ecosystem.handset.view')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/view:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-rows-2 gap-6 h-full">
              <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.1 }}
                 className="relative group overflow-hidden rounded-3xl glass-card border-white/5 bg-zinc-900/40"
              >
                 <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-900/90 to-transparent"></div>
                 <img 
                  src={blackTree} 
                  alt="The Tree hub used as charging station and data hub for devices" 
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="relative z-20 h-full flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold mb-2">{t('home.ecosystem.tree.title')}</h3>
                  <Link href="/tree" className="text-primary text-sm font-bold hover:text-white transition-all cursor-pointer inline-flex items-center uppercase tracking-widest group/view">
                    {t('home.ecosystem.tree.view')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/view:translate-x-1" />
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative group overflow-hidden rounded-3xl glass-card border-white/5 bg-zinc-900/40"
              >
                 <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-900/90 to-transparent"></div>
                 <img 
                  src={dashboardImg} 
                  alt="Tree'd analytics dashboard showing museum visitor insights and engagement data"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="relative z-20 h-full flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold mb-2">{t('home.ecosystem.dashboard.title')}</h3>
                  <Link href="/dashboard" className="text-primary text-sm font-bold hover:text-white transition-all cursor-pointer inline-flex items-center uppercase tracking-widest group/view">
                    {t('home.ecosystem.dashboard.view')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/view:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* Visitor Experience Preview */}
      <section className="py-32 relative overflow-hidden bg-[#020202]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,223,82,0.03),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-[8rem] font-black tracking-tighter leading-none mb-8">
              <span className={isLight ? "text-zinc-900" : "text-white"}>{t('home.hero.curiosity')}</span>{" "}
              <span 
                ref={unboundRef}
                onMouseMove={handleUnboundMouseMove}
                onMouseLeave={handleUnboundMouseLeave}
                className={isLight ? "text-zinc-500 relative cursor-default inline-block" : "text-zinc-500 relative cursor-default inline-block"}
              >
                {t('home.hero.unbound')}
                <motion.span 
                  className={isLight ? "absolute inset-0 text-zinc-900 pointer-events-none overflow-hidden select-none" : "absolute inset-0 text-white pointer-events-none overflow-hidden select-none"}
                  style={{ 
                    clipPath: useTransform(
                      [unboundX, unboundY, unboundOpacity],
                      ([x, y, opacity]: any) => `circle(${opacity * 80}px at ${x}px ${y}px)`
                    )
                  }}
                >
                  {t('home.hero.unbound')}
                </motion.span>
              </span>
            </h2>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
              {t('home.hero.desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { icon: <Sparkles className="fill-current" />, title: t('home.visitorExp.ai.title'), desc: t('home.visitorExp.ai.desc'), special: true },
               { icon: <Languages />, title: t('home.visitorExp.multi.title'), desc: t('home.visitorExp.multi.desc') },
               { icon: <Footprints />, title: t('home.visitorExp.instant.title'), desc: t('home.visitorExp.instant.desc') },
               { icon: <AudioLines />, title: t('home.visitorExp.tap.title'), desc: t('home.visitorExp.tap.desc') }
             ].map((item, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className={`p-10 rounded-[2.5rem] bg-zinc-900/40 border transition-all text-center group hover:-translate-y-2 duration-300 relative overflow-hidden
                   ${item.special 
                     ? 'border-transparent bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)] hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.3)]' 
                     : 'border-white/5 hover:border-primary/30'
                   }`}
               >
                 {item.special && (
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] blur-xl"></div>
                 )}
                 {!item.special && (
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"></div>
                 )}
                 
                 <div className="relative z-10">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300
                     ${item.special 
                       ? 'bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 text-white shadow-lg shadow-purple-500/20' 
                       : 'bg-white/5 group-hover:bg-primary group-hover:!text-black'
                     }`}
                     style={item.special ? {} : isLight ? { color: '#4d6012' } : { color: '#c8df52' }}
                   >
                     {item.icon}
                   </div>
                   <h4 className={`text-xl font-bold mb-4 ${item.special ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-white' : isLight ? 'text-zinc-900' : 'text-white'}`}>{item.title}</h4>
                   <p className={`text-sm leading-relaxed text-center ${isLight ? 'desc-neutral' : 'text-zinc-400'}`}>{item.desc}</p>
                 </div>
               </motion.div>
             ))}
          </div>
          <div className="mt-16 text-center">
            <Button 
  size="lg" 
  onClick={scrollToHowItWorks}
  className="bg-primary !text-black hover:bg-primary/90 rounded-full h-14 px-10 text-lg font-bold transition-colors group whitespace-normal"
>
              {t('visitorExperience.steps.label')} <ArrowDown className="ml-2 w-5 h-5 transition-transform group-hover:translate-y-1 shrink-0" />
            </Button>
          </div>
        </div>
      </section>
      {/* Why Museums Choose Us - Creative Interactive Concept */}
      <section className="py-40 relative bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,223,82,0.05),transparent_70%)]"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start relative">

            {/* Left: The Statement */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">{t('home.advantages.label')}</span>
                <h2 className={`text-5xl md:text-7xl font-black tracking-tighter leading-none mb-12 ${isLight ? "text-zinc-900" : "text-white"}`}>
                  {t('home.advantages.title')} <br/>
                  <span className="text-primary">{t('home.advantages.chooseUs')}</span>
                </h2>
                <p className={`text-xl font-light leading-relaxed max-w-md mb-12 ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                  {t('home.advantages.desc')}
                </p>
                <Link href="/solution">
  <Button
    size="lg"
    variant="ghost"
    className={`rounded-full h-14 px-10 text-base font-bold transition-colors border duration-300 ${
      isLight
        ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
        : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
    }`}
  >
    {t('home.advantages.cta')}
  </Button>
</Link>
              </motion.div>
            </div>

            {/* Right: The Creative Interaction */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Abstract decorative element */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              {[
                {
                  title: t('home.advantages.items.edu.title'),
                  desc: t('home.advantages.items.edu.desc'),
                  icon: <Brain className="w-5 h-5" />,
                  button: { text: t('home.advantages.items.edu.cta'), link: "/dashboard" }
                },
                {
                  title: t('home.advantages.items.finance.title'),
                  desc: t('home.advantages.items.finance.desc'),
                  icon: <Banknote className="w-5 h-5" />,
                  button: { text: t('home.advantages.items.finance.cta'), link: "/revenue-sharing" }
                },
                {
                  title: t('home.advantages.items.reach.title'),
                  desc: t('home.advantages.items.reach.desc'),
                  icon: <Smile className="w-5 h-5" />,
                  button: { text: t('home.advantages.items.reach.cta'), link: "/visitor-experience" }
                },
                {
                  title: t('home.advantages.items.tech.title'),
                  desc: t('home.advantages.items.tech.desc'),
                  icon: <Leaf className="w-5 h-5" />,
                  button: { text: t('home.advantages.items.tech.cta'), link: "/sustainability" },
                  special: true
                }
              ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`p-10 rounded-[3rem] border backdrop-blur-3xl group relative overflow-hidden flex flex-col h-full transition-all duration-500
                      ${item.special 
                        ? 'bg-primary/10 border-primary/20 hover:bg-primary/20' 
                        : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                      }`}
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300
                          ${item.special 
                            ? 'bg-primary text-black' 
                            : 'bg-white/5 group-hover:bg-primary group-hover:!text-black'
                          }`}
                          style={item.special ? {} : isLight ? { color: '#4d6012' } : { color: '#c8df52' }}
                        >
                          {item.icon}
                        </div>
                      </div>
                      
                      <h3 className={`text-xl font-bold mb-4 ${isLight ? "text-zinc-900" : "text-white"}`}>{item.title}</h3>
                      <p className={`text-sm leading-relaxed mb-8 ${isLight ? 'desc-neutral' : 'text-zinc-400'}`}>
                        {item.desc}
                      </p>

                      <div className="mt-auto">
                        <Link
                          href={item.button.link}
                          className={`inline-flex items-center font-bold transition-all cursor-pointer group/btn uppercase tracking-[0.15em] text-[10px]
                            ${item.special 
                              ? 'text-white hover:text-primary' 
                              : 'hover:text-white'
                            }`}
                          style={item.special ? {} : isLight ? { color: '#4d6012' } : { color: '#c8df52' }}
                        >
                          {item.button.text} <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </section>
      {/* How It Works - Steps */}
      <section id="how-it-works" className="py-32 relative overflow-hidden bg-zinc-950/30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-primary text-xs uppercase tracking-[0.5em] font-bold mb-4 block">{t('visitorExperience.steps.label')}</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{t('visitorExperience.steps.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-32 md:gap-12">
            {[
              {
                title: t('visitorExperience.steps.step1.title'),
                description: t('visitorExperience.steps.step1.desc'),
                img: nfcPanel,
                alt: "Selecting a language on the Tree\u2019d museum audio guide NFC language panel"
              },
              {
                title: t('visitorExperience.steps.step2.title'),
                description: t('visitorExperience.steps.step2.desc'),
                img: nfcScan,
                alt: "Using the Tree\u2019d handheld audio guide to hear about an exhibit NFC tag in a museum"
              },
              {
                title: t('visitorExperience.steps.step3.title'),
                description: t('visitorExperience.steps.step3.desc'),
                img: statueTalking,
                alt: "Starting a conversation with the Tree\u2019d AI-powered museum audio guide handset"
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative mb-10 rounded-[3rem] overflow-hidden aspect-square border border-white/5 bg-zinc-900/50 shadow-2xl">
                  <img
                    src={step.img}
                    alt={step.alt}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-6 left-6 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                    {i + 1}
                  </div>
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${isLight ? '!text-black' : 'text-white'} group-hover:!text-primary transition-colors`}>{step.title}</h2>
                <p className={`leading-relaxed font-light ${isLight ? 'desc-neutral' : 'text-zinc-400'}`}>{step.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/visitor-experience">
             <Button size="lg" className="bg-primary !text-black hover:bg-primary/90 rounded-full h-14 px-10 text-lg font-bold transition-colors group whitespace-normal" data-testid="button-explore-full-journey">
                {t('visitorExperience.steps.explore')} <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Client Logos Section - Glow on Hover */}
      <section className="py-24 bg-background relative overflow-hidden group/logos">
        <div className="container mx-auto px-6">
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
             className="flex flex-col items-center justify-center gap-16"
          >
            <div className="text-center w-full">
              <div className="text-xs uppercase tracking-[0.5em] font-bold text-zinc-500 mb-12 group-hover/logos:text-primary transition-all duration-500 group-hover/logos:[text-shadow:0_0_10px_rgba(200,223,82,0.5)]">{t('home.ourClients')}</div>
              <div className="flex flex-wrap justify-center gap-16 md:gap-32 items-center opacity-60 hover:opacity-100 transition-opacity">
                <a data-testid="link-client-abla" href="https://ablaartfoundation.org/" target="_blank" rel="noopener noreferrer">
                  <img data-testid="img-client-abla" src={AblaLogo} alt="Abla Art Foundation – Tree'd museum partner" className="h-28 md:h-40 w-auto object-contain grayscale hover:grayscale-0 transition-all hover:[filter:drop-shadow(0_0_20px_rgba(200,223,82,0.4))]" />
                </a>
                <a data-testid="link-client-fayoum" href="https://fayoumartcenter.com/" target="_blank" rel="noopener noreferrer">
                  <img data-testid="img-client-fayoum" src={FayoumLogo} alt="Fayoum Art Center – Tree'd museum partner" className="h-28 md:h-40 w-auto object-contain grayscale hover:grayscale-0 transition-all hover:[filter:drop-shadow(0_0_20px_rgba(200,223,82,0.4))]" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Final CTA Section - Refined & Neater */}
      <section 
        className="py-24 relative bg-[#050505] overflow-hidden group/cta"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-white uppercase">
              {t('home.cta.title')}
            </h2>
            <p className={`text-lg mb-10 max-w-xl mx-auto font-light leading-relaxed ${isLight ? "text-[#4B5563]" : "text-zinc-400"}`}>
              {t('home.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking">
                <Button size="lg" className="bg-primary !text-black hover:bg-primary/90 rounded-full h-14 px-10 text-lg font-bold transition-colors group">
                  {t('home.cta.btn')} <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/request-pricing">
                <Button
  size="lg"
  variant="ghost"
  className={`rounded-full h-14 px-10 text-base font-bold transition-colors border duration-300 ${
    isLight
      ? "!text-zinc-900 border-zinc-300 hover:bg-black/5 hover:border-zinc-400"
      : "text-white border-white/10 hover:bg-white/10 hover:border-white/20"
  }`}
>
                  {t('home.cta.btnSecondary')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-white">
              {t('homeFaq.title')}
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-4">
            {t('homeFaq.questions', { returnObjects: true }).map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className={`w-full group relative p-6 rounded-2xl border transition-all duration-300 text-left ${isLight ? "bg-zinc-100 border-zinc-200 hover:bg-zinc-200" : "border-white/5 bg-white/5 hover:bg-white/10"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className={`text-lg font-bold group-hover:text-primary transition-colors pr-4 ${isLight ? "text-zinc-900" : "text-white"}`}>
                      {item.q}
                    </h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  <div
                    className={`text-sm leading-relaxed overflow-hidden transition-all duration-300 m-0 ${
                      openFaqIndex === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                    } ${isLight ? "text-zinc-700" : "text-zinc-400"}`}
                  >
                    {item.a}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/faq">
              <button className="inline-flex items-center text-primary font-bold hover:text-white transition-all cursor-pointer uppercase tracking-widest text-sm group/view">
                {t('homeFaq.cta')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/view:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
