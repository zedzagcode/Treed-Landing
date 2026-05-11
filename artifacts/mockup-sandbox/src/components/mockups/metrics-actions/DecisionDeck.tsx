import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const metricsData = [
  {
    category: "Visitor Behavior",
    action: "Know which spaces are working and which aren't — then adapt",
    body: "See where visitors slow down, what themes they keep returning to, and which galleries lose them. Now you have a reason to rearrange.",
    decisions: [
      "Rearrange underperforming galleries",
      "Adjust exhibit placement",
      "Redesign visitor flow",
    ],
  },
  {
    category: "Listening & Interaction",
    action: "See what visitors actually engage with",
    body: "See which audio stories get finished, which ones are skipped, and what visitors ask next. You'll quickly spot what holds attention and what needs improvement.",
    decisions: [
      "Rewrite weak stories",
      "Add depth where curiosity is high",
      "Remove content that gets skipped",
    ],
  },
  {
    category: "Language & Origin",
    action: "Turn assumptions into clear audience insight",
    body: "See which languages visitors use, how that changes over time, and which groups engage with which exhibits.",
    decisions: [
      "Adjust signage languages",
      "Allocate multilingual staff",
      "Target content by visitor group",
    ],
  },
  {
    category: "System Health",
    action: "Your staff manages visitors. Not hardware.",
    body: "Battery levels, docking status, signal stability: all visible before the doors open. No surprises on the floor.",
    decisions: [
      "Identify devices that need charging",
      "Decide the number of devices required",
      "Ensure full system readiness",
    ],
  },
];

export function DecisionDeck() {
  return (
    <div className="bg-[#020202] min-h-screen w-full flex flex-col items-center py-24 px-8 md:px-16 lg:px-24 font-sans text-zinc-50">
      <div className="max-w-7xl w-full mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end border-b border-zinc-800 pb-12">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
              Translate Metrics <br />
              <span className="text-[#c8df52]">into Actions.</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl">
              Here's what each metrics category actually tells you and how to utilize it, from data to decisions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium tracking-wider uppercase">
            <span className="w-8 h-[1px] bg-zinc-700"></span>
            Hover to unlock
          </div>
        </div>

        {/* Interactive Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metricsData.map((item, index) => (
            <div
              key={index}
              className="group relative h-[420px] rounded-3xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 hover:border-[#c8df52]/30 transition-all duration-700 ease-out"
            >
              {/* Front Face (Default State) */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:translate-y-4 pointer-events-none">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3">
                    <span className="text-xs font-bold tracking-widest text-[#c8df52] uppercase">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-medium leading-tight tracking-tight text-white pr-8">
                    {item.action}
                  </h3>
                </div>
              </div>

              {/* Back Face (Hover State) */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-20 opacity-0 translate-y-8 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-y-0 bg-gradient-to-br from-zinc-900 to-black">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#c8df52]"></span>
                    <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    {item.body}
                  </p>
                </div>

                <div className="space-y-6 mt-8">
                  <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                    Decisions Unlocked
                  </p>
                  <ul className="space-y-4">
                    {item.decisions.map((decision, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-[#c8df52] shrink-0 mt-0.5" />
                        <span className="text-zinc-100 font-medium leading-snug">
                          {decision}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8df52]/5 rounded-bl-full -translate-y-full translate-x-full transition-transform duration-700 ease-out group-hover:translate-y-0 group-hover:translate-x-0 z-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
