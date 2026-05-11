import React, { useState } from 'react';
import { ArrowRight, Activity, Headphones, Globe, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ControlRoom() {
  const [activeIndex, setActiveIndex] = useState(0);

  const categories = [
    {
      id: 'behavior',
      title: 'VISITOR BEHAVIOR',
      icon: Activity,
      action: "Know which spaces are working and which aren't — then adapt",
      body: "See where visitors slow down, what themes they keep returning to, and which galleries lose them. Now you have a reason to rearrange.",
      decisions: [
        "Rearrange underperforming galleries",
        "Adjust exhibit placement",
        "Redesign visitor flow"
      ]
    },
    {
      id: 'listening',
      title: 'LISTENING & INTERACTION',
      icon: Headphones,
      action: "See what visitors actually engage with",
      body: "See which audio stories get finished, which ones are skipped, and what visitors ask next. You'll quickly spot what holds attention and what needs improvement.",
      decisions: [
        "Rewrite weak stories",
        "Add depth where curiosity is high",
        "Remove content that gets skipped"
      ]
    },
    {
      id: 'language',
      title: 'LANGUAGE & ORIGIN',
      icon: Globe,
      action: "Turn assumptions into clear audience insight",
      body: "See which languages visitors use, how that changes over time, and which groups engage with which exhibits.",
      decisions: [
        "Adjust signage languages",
        "Allocate multilingual staff",
        "Target content by visitor group"
      ]
    },
    {
      id: 'health',
      title: 'SYSTEM HEALTH',
      icon: Cpu,
      action: "Your staff manages visitors. Not hardware.",
      body: "Battery levels, docking status, signal stability: all visible before the doors open. No surprises on the floor.",
      decisions: [
        "Identify devices that need charging",
        "Decide the number of devices required",
        "Ensure full system readiness"
      ]
    }
  ];

  const activeCategory = categories[activeIndex];

  return (
    <div className="bg-[#020202] min-h-screen w-full text-white font-sans selection:bg-[#c8df52] selection:text-black flex flex-col items-center justify-center py-24 px-8 md:px-16 lg:px-24">
      {/* Container */}
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c8df52] animate-pulse"></span>
            <span className="text-[#c8df52] font-mono text-sm tracking-wider uppercase">System Live</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
            Translate Metrics into Actions
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Here's what each metrics category actually tells you and how to utilize it, from data to decisions.
          </p>
        </div>

        {/* Control Room Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left: Station Panels */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {categories.map((cat, idx) => {
              const isActive = activeIndex === idx;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "group relative flex items-center justify-between w-full p-4 md:p-5 rounded-xl border transition-all duration-300 text-left overflow-hidden",
                    isActive 
                      ? "bg-zinc-900/80 border-zinc-700 shadow-[0_0_30px_rgba(200,223,82,0.05)]" 
                      : "bg-transparent border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/30"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c8df52]" />
                  )}
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-300",
                      isActive ? "bg-[#c8df52]/10 text-[#c8df52]" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-400"
                    )}>
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-zinc-500 tracking-widest mb-1">STATION 0{idx + 1}</span>
                      <span className={cn(
                        "font-medium tracking-wide transition-colors duration-300",
                        isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                      )}>
                        {cat.title}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center justify-center w-8 h-8">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all duration-500",
                      isActive 
                        ? "bg-[#c8df52] shadow-[0_0_12px_#c8df52]" 
                        : "bg-zinc-800"
                    )} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Main Display */}
          <div className="lg:col-span-8 min-h-[500px]">
            <div className="relative h-full w-full rounded-2xl bg-zinc-900/30 border border-zinc-800/80 p-8 md:p-12 overflow-hidden flex flex-col">
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-700 -translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-700 translate-x-[1px] -translate-y-[1px]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-700 -translate-x-[1px] translate-y-[1px]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-700 translate-x-[1px] translate-y-[1px]" />
              
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm bg-[#c8df52] animate-pulse" />
                  <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                    Displaying: {activeCategory.title}
                  </span>
                </div>
                <span className="font-mono text-xs text-zinc-600">
                  REF: 00{activeIndex + 1}
                </span>
              </div>

              {/* Content area with simple transition keying */}
              <div 
                key={activeIndex} 
                className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700"
              >
                <h3 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
                  {activeCategory.action}
                </h3>
                
                <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-12 max-w-3xl">
                  {activeCategory.body}
                </p>

                <div className="mt-auto">
                  <div className="font-mono text-sm tracking-widest text-zinc-500 uppercase mb-6 flex items-center gap-4">
                    <span>Decisions</span>
                    <div className="h-px bg-zinc-800 flex-1" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeCategory.decisions.map((decision, i) => (
                      <div 
                        key={i} 
                        className="bg-black/50 border border-zinc-800/80 p-5 rounded-lg flex flex-col gap-4 hover:border-[#c8df52]/30 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-[#c8df52]/10 transition-colors">
                          <ArrowRight size={14} className="text-zinc-500 group-hover:text-[#c8df52] transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-zinc-300 leading-snug">
                          {decision}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
