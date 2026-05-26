import React, { useEffect, useState } from "react";
import { Loader2, Terminal, Cpu, ShieldCheck, Activity } from "lucide-react";
import { motion } from "motion/react";

interface ConsoleLogsProps {
  symbol: string;
  indicator: string;
  bias: string;
  riskPercent: number;
  capital: number;
  seriesSize: number;
  rrSetup: string;
  horizonMode: string;
}

export default function ConsoleLogs({
  symbol,
  indicator,
  bias,
  riskPercent,
  capital,
  seriesSize,
  rrSetup,
  horizonMode,
}: ConsoleLogsProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const baseLogs = [
    `CRITICAL ENGINE: INGESTING SECTOR PARAMS... [OK]`,
    `LOAD: TARGET ASSET MATRIX: ${symbol} AT $${capital.toLocaleString()} CAPITAL`,
    `COGNITIVE ROUTINE: INJECTING STRATEGIC BIAS: ${bias.toUpperCase()} FILTER LEVEL`,
    `MATRIC SUBSYSTEM: ANALYZING PATTERNS: "${indicator}"`,
    `SESSION ENVIRONMENT: CONFIGURING ${horizonMode.toUpperCase()} HORIZON METALS`,
    `BRACKET PROTOCOL: STRUCTURING STRICT ${rrSetup} R:R MATRIX (RISK: ${riskPercent}%)`,
    `AETHER_ENGINE: CONNECTING TO SERVER ACCELERATOR GRID...`,
    `INTELLIGENCE SECURE: COMBUSTING COGNITIVE MATRIX WITH GEMINI-3.5-FLASH`,
    `PINE GENERATOR: COMPILING SECURE TRADINGVIEW SCRIPT COMPATIBILITY`,
    `SIMULATOR BLOCK: SWEEPING ${seriesSize} CHRONOLOGICAL TRIAL SEQUENCE SLOTS`,
    `NARRATIVE SYNTHESIS: CONSTRUCTING EXPECTANCY REPORT SHEETS`,
    `OPTIMIZER: CLEANING MEMORY ACCRETION AND CACHE SHARDS`,
    `SYSTEM HARVEST: STRATEGY MATRIX READY FOR IMMEDIATE HUD DEPLOYMENT!`,
  ];

  // Stagger entry of telemetry console logs to simulate ultra-high-speed calculations
  useEffect(() => {
    setLogs([]);
    setProgress(0);
    let logIdx = 0;
    
    // Quick logs sequence
    const logInterval = setInterval(() => {
      if (logIdx < baseLogs.length) {
        setLogs((prev) => [...prev, baseLogs[logIdx]]);
        setProgress((prev) => Math.min(prev + (100 / baseLogs.length), 100));
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 280);

    return () => clearInterval(logInterval);
  }, [symbol, indicator, bias, riskPercent, capital, rrSetup, horizonMode]);

  return (
    <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] select-none">
      
      {/* Moving scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40"></div>
      
      {/* Laser Scanning Line Animation */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400/30 blur-xs shadow-[0_0_12px_#22d3ee] animate-[bounce_3s_infinite] pointer-events-none"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side: Animated Geometric Radar Sweep */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border border-cyan-500/10 flex items-center justify-center bg-cyan-950/5">
            {/* Center Core */}
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 bg-slate-950 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            
            {/* Pulsating Ring 1 */}
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute w-24 h-24 rounded-full border border-cyan-500/30"
            />

            {/* Pulsating Ring 2 */}
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.25, 0.05] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute w-36 h-36 rounded-full border border-indigo-500/20"
            />

            {/* Sweep Arm Indicator */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "5s" }}>
              <div className="w-1/2 h-full border-r border-cyan-500/40 opacity-70 origin-right" style={{
                background: "linear-gradient(90deg, transparent 70%, rgba(34,211,238,0.1) 100%)",
                clipPath: "polygon(50% 50%, 100% 0, 100% 100%)"
              }}></div>
            </div>

            {/* High Tech Framing Grids */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-cyan-500/5"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-cyan-500/5"></div>

            {/* Small floating tracking indicators */}
            <div className="absolute top-4 left-6 text-[8px] font-mono text-cyan-400/70 border border-cyan-500/20 px-1 py-0.5 rounded bg-slate-950/80">
              RAD: 247&deg;
            </div>
            <div className="absolute bottom-6 right-4 text-[8px] font-mono text-indigo-400/70 border border-indigo-500/20 px-1 py-0.5 rounded bg-slate-950/80">
              CORES: AUTO
            </div>
          </div>
          
          <div className="mt-5 text-center">
            <h3 className="text-sm font-display font-medium text-slate-100 uppercase tracking-widest flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              SYNTHESIZING STRATEGIC GRID
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1.5 uppercase">
              COMPUTING EXPOTENCY MATRIX &bull; SEQUENCE CHUNKS
            </p>
          </div>
        </div>

        {/* Right Side: Streaming Console Logger */}
        <div className="flex flex-col h-64 md:h-72 border border-cyan-500/10 rounded-xl bg-slate-950/90 overflow-hidden font-mono text-xs text-cyan-400/90 relative">
          <div className="bg-slate-900/60 border-b border-cyan-500/10 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Aether Terminal telemetry</span>
            </div>
            <span className="text-[9px] bg-slate-950 border border-cyan-900 px-2 py-0.5 rounded text-cyan-400 font-bold animate-pulse">
              LIVE PORT 3000
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-cyan-950/80 scrollbar-track-transparent">
            {logs.map((log, index) => {
              const isOk = log && (log.includes("[OK]") || log.includes("READY"));
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-1.5 leading-relaxed text-[10px]"
                >
                  <span className="text-slate-600 shrink-0">&raquo;</span>
                  <span className={`${isOk ? "text-emerald-400 font-semibold" : "text-cyan-400/90"}`}>{log}</span>
                </motion.div>
              );
            })}
            <div className="h-4" />
          </div>

          {/* Core HUD Progress Gauge */}
          <div className="border-t border-cyan-500/10 bg-slate-900/40 p-3 flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-950 border border-cyan-500/15 roundedOverflow overflow-hidden rounded relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400" 
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-[10px] font-bold text-cyan-400 w-8 text-right font-mono">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>

        </div>

      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500"></div>
    </div>
  );
}
