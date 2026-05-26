import React, { useState } from "react";
import { Copy, Check, Terminal, BookOpen, Activity, FileCode, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playTick } from "../utils/audioSynth";

interface DiagnosticTerminalProps {
  activeTab: "chart" | "code" | "narrative";
  setActiveTab: (tab: "chart" | "code" | "narrative") => void;
  loading: boolean;
  strategyCode?: string;
  reportNarrative?: string;
  soundEnabled: boolean;
  children?: React.ReactNode; // For the Recharts container passed in
  optimizedTimeframe?: string | null;
  optimizedProtocol?: string | null;
  totalTrades?: number;
  timeframe?: string;
}

export default function DiagnosticTerminal({
  activeTab,
  setActiveTab,
  loading,
  strategyCode = "",
  reportNarrative = "",
  soundEnabled,
  children,
  optimizedTimeframe = null,
  optimizedProtocol = null,
  totalTrades = 15,
  timeframe = "15m",
}: DiagnosticTerminalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (soundEnabled) playTick();
    try {
      await navigator.clipboard.writeText(strategyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy script code:", err);
    }
  };

  const handleTabChange = (tab: "chart" | "code" | "narrative") => {
    if (soundEnabled) playTick();
    setActiveTab(tab);
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl flex-1 flex flex-col overflow-hidden backdrop-blur-md shadow-xl relative min-h-[380px]">
      
      {/* Upper HUD Navigation Tab Row */}
      <div className="border-b border-slate-800/80 bg-slate-950/70 px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap z-10">
        <div className="flex bg-slate-950/80 border border-slate-800 p-0.5 rounded-lg">
          <button
            onClick={() => handleTabChange("chart")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "chart"
                ? "bg-slate-800/80 text-cyan-400 border border-slate-700/60 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-500/80" />
            <span>PERFORMANCE CURVE</span>
          </button>
          <button
            onClick={() => handleTabChange("narrative")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "narrative"
                ? "bg-slate-800/80 text-cyan-400 border border-slate-700/60 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>INTELLIGENCE REPORT</span>
          </button>
          <button
            onClick={() => handleTabChange("code")}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "code"
                ? "bg-slate-800/80 text-cyan-400 border border-slate-700/60 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>PINE v5 ENGINE SCRIPT</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
          <span className="uppercase tracking-wider">Dynamic {totalTrades}-Trade Matrix</span>
        </div>
      </div>

      {/* Main interactive screen workspace */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col relative bg-slate-950/25">
        
        <AnimatePresence mode="wait">
          
          {/* 1. Recharts Container Slot */}
          {activeTab === "chart" && (
            <motion.div
              key="chart-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-xl">
                <div>
                  <h3 className="text-sm font-display font-medium text-slate-200 flex items-center gap-2 uppercase">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Cumulative Strategy Portfolio Gain Curve ({timeframe})
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-normal">
                    Tracks continuous equity dynamics. Critical metrics map maximum R-drawdown troughs against capital.
                  </p>
                </div>
                {optimizedTimeframe && optimizedProtocol && (
                  <div id="optimized-matching-badge" className="self-start md:self-auto bg-cyan-950/50 border border-cyan-500/55 text-cyan-300 text-[11px] font-mono rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.15)] animate-pulse">
                    <span className="text-amber-400 font-bold">🎯 MATCH SECURED:</span>
                    <span className="text-white font-semibold underline decoration-cyan-400 decoration-1 decoration-dotted underline-offset-2">{optimizedTimeframe} Timeframe</span>
                    <span className="text-slate-400">for</span>
                    <span className="bg-cyan-900/50 text-slate-100 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold">{optimizedProtocol}</span>
                  </div>
                )}
              </div>

              {/* Wrapped Recharts Canvas */}
              <div className="flex-1 min-h-[250px] relative">
                {children}
              </div>
            </motion.div>
          )}

          {/* 2. Markdown Intelligence Narrative Evaluation */}
          {activeTab === "narrative" && (
            <motion.div
              key="narrative-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-3">
                <h3 className="text-sm font-display font-medium text-slate-200 flex items-center gap-2 uppercase">
                  <BookOpen className="w-4 h-4 text-indigo-400 animate-pulse" />
                  Autonomous Strategy Intelligence Assessment
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-normal">
                  Synthesized quantitative edge diagnostic prepared autonomously by the Aether engine logic. Formulates mathematical expectancies.
                </p>
              </div>

              {/* Technical Report Box */}
              <div className="flex-1 bg-slate-950/80 border border-slate-800/60 rounded-xl p-4 overflow-y-auto max-h-[300px] text-xs leading-relaxed text-slate-300 font-sans border-l-3 border-l-indigo-500 shadow-inner">
                <div className="space-y-4">
                  {reportNarrative.split("\n\n").map((para, idx) => {
                    if (para.startsWith("###")) {
                      return (
                        <h4 key={idx} className="text-xs font-mono font-bold text-cyan-400 tracking-wider border-b border-slate-800 pb-1 mt-4 uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded bg-cyan-400"></span>
                          {para.replace("###", "").trim()}
                        </h4>
                      );
                    }
                    if (para.startsWith("- ") || para.startsWith("* ")) {
                      return (
                        <ul key={idx} className="list-none space-y-1.5 pl-1.5 font-mono text-slate-300">
                          {para.split("\n").map((li, lIdx) => (
                            <li key={lIdx} className="flex items-start gap-2 text-[11px]">
                              <span className="text-indigo-400 select-none font-bold mt-px">&bull;</span>
                              <span>{li.replace(/^[\s*-]+/, "").trim()}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className="text-[11px] leading-relaxed text-slate-400 italic">
                        {para}
                      </p>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. Pinescript Script Terminal Editor */}
          {activeTab === "code" && (
            <motion.div
              key="code-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-display font-medium text-slate-200 flex items-center gap-2 uppercase">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Pinescript Execution Terminal (TradingView Pine SDK v5)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-normal">
                    Ready-to-deploy automated Pinescript logic. Paste this script straight into the Pine Editor in your TradingView console.
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-bold">
                    Pine Script v5
                  </span>
                </div>
              </div>

              {/* Copy Script Canvas wrapper */}
              <div className="relative flex-1 bg-slate-950 border border-slate-800/80 rounded-xl flex overflow-hidden shadow-inner group">
                
                {/* Numeric line columns to simulate a software editor layout */}
                <div className="bg-slate-950/50 border-r border-slate-900/80 p-3 select-none text-[10px] text-right font-mono text-slate-600 space-y-0.5 leading-relaxed min-w-[34px] tracking-tighter">
                  {Array.from({ length: Math.min(strategyCode.split("\n").length, 25) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                  {strategyCode.split("\n").length > 25 && <div>...</div>}
                </div>

                {/* Main scroll block */}
                <pre className="flex-1 overflow-auto text-[11px] font-mono text-emerald-400 bg-slate-950 p-3 leading-relaxed select-text scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-transparent">
                  {strategyCode}
                </pre>

                {/* Floating copy HUD button */}
                <button
                  onClick={handleCopy}
                  className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-mono font-bold py-1.5 px-3 rounded-lg border transition shadow-lg cursor-pointer ${
                    copied
                      ? "bg-emerald-950 text-emerald-400 border-emerald-500"
                      : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED MATRIX</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY PINE SCRIPT</span>
                    </>
                  )}
                </button>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Futuristic Outer Frame Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700"></div>
    </div>
  );
}
