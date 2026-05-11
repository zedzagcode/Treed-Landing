import React from "react";
import { ArrowRight, Terminal } from "lucide-react";

const metrics = [
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

export function SignalFlow() {
  return (
    <div className="bg-[#020202] min-h-screen text-zinc-300 font-sans selection:bg-[#c8df52] selection:text-black flex flex-col pt-24 pb-32 px-8 md:px-16 lg:px-24">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto w-full mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Terminal className="w-6 h-6 text-[#c8df52]" />
          <span className="font-mono text-sm tracking-widest uppercase text-[#c8df52]">
            System.Process(Metrics)
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6">
          Translate Metrics into Actions
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
          Here's what each metrics category actually tells you and how to utilize
          it, from data to decisions.
        </p>
      </div>

      {/* Pipeline Section */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="border-t border-zinc-800">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row group border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors duration-300"
            >
              {/* Left: Process Input */}
              <div className="flex-1 py-10 lg:py-16 lg:pr-12 relative">
                <div className="font-mono text-xs text-zinc-600 mb-4 tracking-wider uppercase">
                  Input_Signal: {metric.category.replace(/[^a-zA-Z]/g, "_")}
                </div>
                <h3 className="text-2xl md:text-3xl font-medium text-white mb-4 leading-tight">
                  {metric.action}
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-lg">
                  {metric.body}
                </p>
              </div>

              {/* Center: Transform */}
              <div className="hidden lg:flex items-center justify-center w-32 border-l border-r border-zinc-800/50 group-hover:border-zinc-800 transition-colors duration-300 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[1px] w-full bg-zinc-800 group-hover:bg-[#c8df52]/30 transition-colors duration-500" />
                </div>
                <div className="bg-[#020202] z-10 p-4 rounded-full border border-zinc-800 group-hover:border-[#c8df52]/50 group-hover:shadow-[0_0_15px_rgba(200,223,82,0.1)] transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-[#c8df52] transition-colors duration-300" />
                </div>
              </div>

              {/* Right: Process Output */}
              <div className="flex-1 py-10 lg:py-16 lg:pl-12 bg-zinc-900/10 group-hover:bg-zinc-900/20 transition-colors duration-300">
                <div className="font-mono text-xs text-zinc-600 mb-6 tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-[#c8df52] transition-colors duration-300" />
                  Output_Actions
                </div>
                <ul className="space-y-4">
                  {metric.decisions.map((decision, dIndex) => (
                    <li
                      key={dIndex}
                      className="flex items-start gap-4 font-mono text-sm md:text-base"
                    >
                      <span className="text-[#c8df52] mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        &gt;
                      </span>
                      <span className="text-zinc-300 group-hover:text-white transition-colors duration-300">
                        {decision}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
