import React from "react";
import { ArrowRight, CheckCircle2, HelpCircle, Activity, Headphones, Globe, BatteryCharging } from "lucide-react";

export function ContrastPanel() {
  const metrics = [
    {
      icon: Activity,
      category: "Visitor Behavior",
      without: {
        headline: "Guessing where visitors go and why some galleries always feel empty.",
        subtext: "Are they bored? Is the layout confusing? You only have assumptions to work with."
      },
      action: "Know which spaces are working and which aren't — then adapt",
      body: "See where visitors slow down, what themes they keep returning to, and which galleries lose them. Now you have a reason to rearrange.",
      decisions: [
        "Rearrange underperforming galleries",
        "Adjust exhibit placement",
        "Redesign visitor flow"
      ]
    },
    {
      icon: Headphones,
      category: "Listening & Interaction",
      without: {
        headline: "Hoping visitors actually like the audio stories you spent months producing.",
        subtext: "Are they listening to the end? Skipping halfway? You won't know until they leave."
      },
      action: "See what visitors actually engage with",
      body: "See which audio stories get finished, which ones are skipped, and what visitors ask next. You'll quickly spot what holds attention and what needs improvement.",
      decisions: [
        "Rewrite weak stories",
        "Add depth where curiosity is high",
        "Remove content that gets skipped"
      ]
    },
    {
      icon: Globe,
      category: "Language & Origin",
      without: {
        headline: "Assuming your standard 3 languages cover everyone who walks through the door.",
        subtext: "Missing out on growing demographics because of outdated assumptions and lack of data."
      },
      action: "Turn assumptions into clear audience insight",
      body: "See which languages visitors use, how that changes over time, and which groups engage with which exhibits.",
      decisions: [
        "Adjust signage languages",
        "Allocate multilingual staff",
        "Target content by visitor group"
      ]
    },
    {
      icon: BatteryCharging,
      category: "System Health",
      without: {
        headline: "Waiting for a visitor to complain that their device is dead or broken.",
        subtext: "Staff running around replacing devices during peak hours instead of helping guests."
      },
      action: "Your staff manages visitors. Not hardware.",
      body: "Battery levels, docking status, signal stability: all visible before the doors open. No surprises on the floor.",
      decisions: [
        "Identify devices that need charging",
        "Decide the number of devices required",
        "Ensure full system readiness"
      ]
    }
  ];

  return (
    <div className="bg-[#020202] min-h-screen text-zinc-100 font-sans selection:bg-[#c8df52] selection:text-black py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Translate Metrics <br className="hidden md:block" />
            <span className="text-[#c8df52]">into Actions</span>
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Here's what each metrics category actually tells you and how to utilize it, moving straight from data to definitive decisions.
          </p>
        </div>

        {/* Contrast Panels */}
        <div className="flex flex-col gap-16 md:gap-24">
          {metrics.map((metric, index) => (
            <div key={index} className="relative group">
              
              {/* Category Label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-[#c8df52] group-hover:bg-[#c8df52]/10 transition-colors duration-500">
                  <metric.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors duration-500">
                  {metric.category}
                </h3>
              </div>

              {/* Split Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950/50">
                
                {/* LEFT: Without Tree'd */}
                <div className="p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-zinc-900 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <HelpCircle className="w-24 h-24 text-zinc-500" />
                  </div>
                  
                  <div className="relative z-10 opacity-60 mix-blend-luminosity blur-[0.5px] transition-all duration-700 hover:blur-none hover:opacity-100">
                    <div className="inline-block px-3 py-1 rounded-full border border-zinc-800 text-xs font-medium text-zinc-500 mb-6 uppercase tracking-wider">
                      Without Data
                    </div>
                    <p className="text-xl md:text-2xl font-medium text-zinc-400 mb-4 leading-snug">
                      "{metric.without.headline}"
                    </p>
                    <p className="text-zinc-600 leading-relaxed">
                      {metric.without.subtext}
                    </p>
                  </div>
                </div>

                {/* RIGHT: With Tree'd */}
                <div className="p-8 md:p-12 bg-[#0a0a0a] relative overflow-hidden group-hover:bg-[#0f1105] transition-colors duration-700">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8df52] opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity duration-700 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8df52]/10 text-[#c8df52] text-xs font-medium mb-6 uppercase tracking-wider">
                      With Tree'd
                    </div>
                    
                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                      {metric.action}
                    </h4>
                    
                    <p className="text-zinc-400 leading-relaxed mb-10 text-lg">
                      {metric.body}
                    </p>

                    <div className="space-y-4">
                      <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Decisions you can make today
                      </div>
                      {metric.decisions.map((decision, dIndex) => (
                        <div key={dIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#c8df52] shrink-0 mt-0.5" />
                          <span className="text-zinc-200 font-medium">{decision}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
