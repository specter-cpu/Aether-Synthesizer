import React from "react";
import { Cpu, Volume2, VolumeX, Activity, Zap } from "lucide-react";
import { motion } from "motion/react";
import { playTick } from "../utils/audioSynth";

interface CockpitHeaderProps {
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  latency?: number;
  symbol?: string;
  timeframe?: string;
}

export default function CockpitHeader({
  soundEnabled,
  setSoundEnabled,
  latency = 9,
  symbol = "BTC/USDT",
  timeframe = "15m",
}: CockpitHeaderProps) {
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) {
      setTimeout(() => playTick(), 50);
    }
  };

  return (
    <header className="border-b border-cyan-500/10 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-50 px-4 py-3 sm:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Immersive HUD Scanning Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Information / Human-literal Labels */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative cursor-pointer group" onClick={() => soundEnabled && playTick()}>
            <div className="absolute inset-0 bg-cyan-500/35 rounded-lg blur-md opacity-75 group-hover:scale-110 transition duration-300"></div>
            <div className="relative bg-slate-950 border border-cyan-500/45 p-2 rounded-lg text-cyan-400 group-hover:border-cyan-400 transition">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            {/* HUD Bracket Styling */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-display font-medium tracking-normal text-slate-100 uppercase">
                Aether<span className="text-cyan-400 font-semibold font-mono tracking-tight">-Synthesizer</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/30 text-cyan-300">
                L-35
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider mix-blend-plus-lighter">
              AUTONOMOUS QUANT STRATEGY ENGINEERING SUITE
            </p>
          </div>
        </div>

        {/* Tactical Ambient Settings Dashboard */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
          
          {/* Quick HUD indicator */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-900/60 py-1.5 px-3 rounded-md border border-slate-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            <span className="text-cyan-400 font-extrabold">{symbol}</span>
            <span className="text-slate-600">@</span>
            <span className="text-indigo-400 font-extrabold">{timeframe}</span>
            <span className="text-slate-600">|</span>
            <span>AETHER MATRIX CONNECTED</span>
            <span className="text-slate-600">|</span>
            <span>PING: <span className="text-cyan-400 font-bold">{latency}ms</span></span>
          </div>

          {/* Procedural Audio Feedback Activation */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 text-xs font-mono font-semibold py-1.5 px-3 rounded-md border transition-all cursor-pointer relative overflow-hidden ${
              soundEnabled
                ? "bg-cyan-950/30 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400"
                : "bg-slate-900/40 text-slate-500 border-slate-800 hover:text-slate-400 hover:border-slate-700"
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span>SONICS TYPE: SIN-SWEEP</span>
                <span className="absolute top-0 right-1 text-[8px] text-cyan-500 font-extrabold animate-pulse">●</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-600" />
                <span>SONICS: DEACTIVATED</span>
              </>
            )}
          </button>

          {/* Little active signal stream */}
          <div className="hidden lg:flex flex-col text-[9px] font-mono leading-none border-l border-slate-800 pl-3">
            <span className="text-slate-500">SYSTEM STENCIL</span>
            <span className="text-cyan-500 md:animate-pulse">DYNAMIC RADIALS</span>
          </div>

        </div>

      </div>
    </header>
  );
}
