import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  Layers,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  XCircle,
  DollarSign,
  ChevronRight,
  Info,
  Loader2,
  AlertTriangle,
  Zap,
  RefreshCw,
} from "lucide-react";
import { BacktestResponse, Trade } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { playTick, playWinSweep, playLossSweep, playArpeggioSequence } from "./utils/audioSynth";

// Import modular cockpit subcomponents
import CockpitHeader from "./components/CockpitHeader";
import ConsoleLogs from "./components/ConsoleLogs";
import DiagnosticTerminal from "./components/DiagnosticTerminal";

export default function App() {
  // Configured quantitative settings matching backtest expectations
  const [symbol, setSymbol] = useState("XAU/USD");
  const [indicator, setIndicator] = useState("Order Block Sweeps");
  const [bias, setBias] = useState("Bullish");
  const [riskPerTradePercent, setRiskPerTradePercent] = useState(1.0);
  const [accountSize, setAccountSize] = useState(100000);
  const [seriesSize, setSeriesSize] = useState<number>(15);
  const [newsBufferEnabled, setNewsBufferEnabled] = useState(false);
  const [timeframe, setTimeframe] = useState("15m");
  const [strategyProtocol, setStrategyProtocol] = useState("Order Block Sweeps");
  const [optimizedTimeframe, setOptimizedTimeframe] = useState<string | null>(null);
  const [optimizedProtocol, setOptimizedProtocol] = useState<string | null>(null);
  const [rrSetup, setRrSetup] = useState<"1:1.5" | "1:2" | "1:3">("1:2");
  const [horizonMode, setHorizonMode] = useState<"Intraday Scalping" | "Macro Swing Execution">("Intraday Scalping");

  const getOptimalTimeframe = (protocol: string, horizon: "Intraday Scalping" | "Macro Swing Execution") => {
    if (horizon === "Macro Swing Execution") {
      if (protocol === "ICT Silver Bullet Model") return "5m";
      return "Daily";
    } else {
      if (protocol === "ICT Silver Bullet Model") return "1m";
      return "15m";
    }
  };

  // Live simulated price telemetry
  const [livePrice, setLivePrice] = useState<number>(0);
  const [priceChangePct, setPriceChangePct] = useState<number>(0);
  const [priceBid, setPriceBid] = useState<number>(0);
  const [priceAsk, setPriceAsk] = useState<number>(0);

  // Tick live price telemetry feedback based on chosen symbol
  useEffect(() => {
    let basePrice = 2330.0;
    if (symbol === "XAU/USD") basePrice = 2330.00;
    else if (symbol === "XAG/USD") basePrice = 31.50;
    else if (symbol === "EUR/USD") basePrice = 1.08550;
    else if (symbol === "GBP/USD") basePrice = 1.25200;
    else if (symbol === "BTC/USDT") basePrice = 67500.00;
    else if (symbol === "ETH/USDT") basePrice = 3450.00;

    setLivePrice(basePrice);
    setPriceBid(basePrice - basePrice * 0.05 / basePrice);
    setPriceAsk(basePrice + basePrice * 0.05 / basePrice);
    setPriceChangePct((Math.random() - 0.5) * 0.1);

    const interval = setInterval(() => {
      setLivePrice((prev) => {
        let pip = 0.01;
        let volatilityFactor = 1;
        if (symbol === "EUR/USD" || symbol === "GBP/USD") {
          pip = 0.00001;
          volatilityFactor = 8;
        } else if (symbol === "BTC/USDT") {
          pip = 0.5;
          volatilityFactor = 15;
        } else if (symbol === "ETH/USDT") {
          pip = 0.05;
          volatilityFactor = 12;
        } else if (symbol === "XAU/USD") {
          pip = 0.05;
          volatilityFactor = 10;
        } else if (symbol === "XAG/USD") {
          pip = 0.005;
          volatilityFactor = 8;
        }

        const ticks = Math.round((Math.random() - 0.5) * volatilityFactor);
        const nextPrice = prev + ticks * pip;
        
        const spread = symbol.includes("EUR") || symbol.includes("GBP") ? 0.00012 : symbol.includes("BTC") ? 2.5 : 0.15;
        setPriceBid(nextPrice - spread / 2);
        setPriceAsk(nextPrice + spread / 2);
        setPriceChangePct((prevPct) => prevPct + (Math.random() - 0.5) * 0.004);
        
        return nextPrice;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [symbol]);

  // Sound Matrix State (Web Audio API)
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Simulated quantitative engine states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [data, setData] = useState<BacktestResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"chart" | "code" | "narrative">("chart");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  // Run strategy synthesis backtest on application startup
  useEffect(() => {
    handleRunStrategy();
  }, []);

    // Submit parameter bounds to core backend strategy synthesizer
  const handleRunStrategy = () => {
    setLoading(true);
    setErrorMsg(null);
    setData(null);
    setSelectedTrade(null);
    setCurrentPage(1);
    if (soundEnabled) {
      playArpeggioSequence();
    }
    
    setTimeout(() => {
      try {
        const simulatedTrades: Trade[] = [];
        let baseWinProbability = 0.55; 
        if (strategyProtocol === "ICT Silver Bullet Model") {
          baseWinProbability = 0.64; 
        }

        for (let i = 1; i <= seriesSize; i++) {
          const id = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
          const direction = bias === "Bi-Directional" ? (Math.random() > 0.5 ? "LONG" : "SHORT") : (bias === "Bullish" ? "LONG" : "SHORT");
          
          let entryPrice = 2330.00 + (Math.random() - 0.5) * 45;
          if (symbol === "XAG/USD") entryPrice = 31.50 + (Math.random() - 0.5) * 2;
          if (symbol === "EUR/USD") entryPrice = 1.08550 + (Math.random() - 0.5) * 0.01;
          if (symbol === "GBP/USD") entryPrice = 1.25200 + (Math.random() - 0.5) * 0.01;
          if (symbol === "BTC/USDT") entryPrice = 67500.00 + (Math.random() - 0.5) * 800;
          if (symbol === "ETH/USDT") entryPrice = 3450.00 + (Math.random() - 0.5) * 50;
          
          let outcome: "WIN" | "LOSS" | "SKIPPED" = "LOSS";
          
          if (newsBufferEnabled && Math.random() < 0.13) {
            outcome = "SKIPPED";
          } else {
            outcome = Math.random() < baseWinProbability ? "WIN" : "LOSS";
          }

          let rGain = 0;
          let comment = "";
          let takeProfit = entryPrice;
          let stopLoss = entryPrice;

          const tickOffset = symbol.includes("EUR") || symbol.includes("GBP") ? 0.0015 : symbol.includes("XAG") ? 0.25 : symbol.includes("BTC") ? 150 : symbol.includes("ETH") ? 15 : 12.5;

          if (outcome === "WIN") {
            rGain = rrSetup === "1:1.5" ? 1.5 : rrSetup === "1:3" ? 3.0 : 2.0;
            takeProfit = direction === "LONG" ? entryPrice + (tickOffset * rGain) : entryPrice - (tickOffset * rGain);
            stopLoss = direction === "LONG" ? entryPrice - tickOffset : entryPrice + tickOffset;
            comment = `${strategyProtocol} executed beautifully. Target validation liquidity matrix hit flawlessly.`;
          } else if (outcome === "LOSS") {
            rGain = -1.0;
            takeProfit = direction === "LONG" ? entryPrice + (tickOffset * (rrSetup === "1:1.5" ? 1.5 : rrSetup === "1:3" ? 3.0 : 2.0)) : entryPrice - (tickOffset * (rrSetup === "1:1.5" ? 1.5 : rrSetup === "1:3" ? 3.0 : 2.0));
            stopLoss = direction === "LONG" ? entryPrice - tickOffset : entryPrice + tickOffset;
            comment = `Liquidity swept past structural invalidation. Stop loss triggered under premium bounds.`;
          } else {
            rGain = 0;
            comment = horizonMode === "Macro Swing Execution" 
              ? `Trade execution bypassed. High overnight spread or rollover risk parameters detected.`
              : `Trade skipped automatically by 15-min Red Folder News Buffer rule safely.`;
          }

          simulatedTrades.push({
            id,
            tradeIndex: i,
            symbol,
            direction,
            entryPrice: parseFloat(entryPrice.toFixed(symbol.includes("EUR") || symbol.includes("GBP") ? 5 : 2)),
            takeProfit: parseFloat(takeProfit.toFixed(symbol.includes("EUR") || symbol.includes("GBP") ? 5 : 2)),
            stopLoss: parseFloat(stopLoss.toFixed(symbol.includes("EUR") || symbol.includes("GBP") ? 5 : 2)),
            outcome,
            rGain,
            comment
          });
        }

        const localResult: BacktestResponse = {
          success: true,
          trades: simulatedTrades,
          strategyDetails: {
            optimizedTimeframe: getOptimalTimeframe(strategyProtocol, horizonMode),
            optimizedProtocol: strategyProtocol,
            strategyCode: `/*\n * @strategy Aether Quantitative Protocol: ${strategyProtocol}\n * Enforced parameters: Risk ${riskPerTradePercent}%, Cap $${accountSize.toLocaleString()}\n */\n//@version=5\nstrategy("Aether Synthesizer Edge Matrix", overlay=true)`,
            reportNarrative: `Execution loop completed successfully across ${seriesSize} sample sequences utilizing localized structural parameters.`
          }
        };

        setData(localResult);
        
        if (localResult.strategyDetails?.optimizedTimeframe) {
          setOptimizedTimeframe(localResult.strategyDetails.optimizedTimeframe);
          setTimeframe(localResult.strategyDetails.optimizedTimeframe);
        }
        if (localResult.strategyDetails?.optimizedProtocol) {
          setOptimizedProtocol(localResult.strategyDetails.optimizedProtocol);
          setStrategyProtocol(localResult.strategyDetails.optimizedProtocol);
          setIndicator(localResult.strategyDetails.optimizedProtocol);
        }
        if (localResult.trades && localResult.trades.length > 0) {
          setSelectedTrade(localResult.trades[0]);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Failed to process simulation data bounds inside client matrix container.");
      } finally {
        setLoading(false);
      }
    }, 500);
  };


  // Click on chronological logs table to investigate details and play audio sweep
  const inspectTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    if (soundEnabled) {
      if (trade.outcome === "WIN") {
        playWinSweep();
      } else if (trade.outcome === "LOSS") {
        playLossSweep();
      } else {
        playTick();
      }
    }
  };

  // Physical slider change callbacks yielding tick feeds
  const handleCapitalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSize(parseInt(e.target.value));
    if (soundEnabled) playTick();
  };

  const handleRiskInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRiskPerTradePercent(parseFloat(e.target.value));
    if (soundEnabled) playTick();
  };

  // Dynamically compute trade matrices on the frontend to allow absolute drag synchronization
  const dynamicTrades = React.useMemo(() => {
    if (!data || !data.trades) return [];

    let currentAccumR = 0;
    return data.trades.map((t) => {
      // Use the rGain provided by the backend to handle slippage correctly
      const rGain = t.rGain;
      currentAccumR += rGain;

      const rUnitCashVal = accountSize * (riskPerTradePercent / 100);
      const pnlCash = rGain * rUnitCashVal;
      const balance = accountSize + (currentAccumR * rUnitCashVal);

      return {
        ...t,
        rGain,
        pnlCash,
        cumulativeR: currentAccumR,
        balance,
      };
    });
  }, [data, accountSize, riskPerTradePercent]);

  // Map the selected trade dynamically as well so its properties keep scales aligned
  const currentSelectedTrade = React.useMemo(() => {
    if (!selectedTrade) return null;
    return dynamicTrades.find((t) => t.id === selectedTrade.id) || selectedTrade;
  }, [selectedTrade, dynamicTrades]);

  // Handle table pagination beautifully at high sample series sizes
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dynamicTrades.length / itemsPerPage) || 1;
  const paginatedTrades = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return dynamicTrades.slice(start, start + itemsPerPage);
  }, [dynamicTrades, currentPage, itemsPerPage]);

  // Formatting simulated R values to continuous chart cumulative values from dynamic calculations
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [
      { name: "Start", R: 0, Cash: 0, balance: accountSize },
      ...dynamicTrades.map((t) => ({
        name: `T-${t.tradeIndex}`,
        R: parseFloat(t.cumulativeR.toFixed(2)),
        Cash: parseFloat(t.pnlCash.toFixed(2)),
        balance: parseFloat(t.balance.toFixed(2)),
        outcome: t.outcome,
      })),
    ];
  }, [data, dynamicTrades, accountSize]);

  // Core metrics computation computed dynamically from current state
  const winsCount = React.useMemo(() => dynamicTrades.filter((t) => t.outcome === "WIN").length, [dynamicTrades]);
  const lossesCount = React.useMemo(() => dynamicTrades.filter((t) => t.outcome === "LOSS").length, [dynamicTrades]);
  const skippedCount = React.useMemo(() => dynamicTrades.filter((t) => t.outcome === "SKIPPED").length, [dynamicTrades]);

  const totalTradesCount = React.useMemo(() => {
    if (newsBufferEnabled) {
      return winsCount + lossesCount; // Exclude SKIPPED trades
    }
    return dynamicTrades.length;
  }, [newsBufferEnabled, winsCount, lossesCount, dynamicTrades]);

  const winRate = React.useMemo(() => {
    const activeTrades = winsCount + lossesCount;
    return activeTrades > 0 ? parseFloat(((winsCount / activeTrades) * 100).toFixed(1)) : 0;
  }, [winsCount, lossesCount]);

  const netProfitR = React.useMemo(() => {
    return dynamicTrades.length > 0 ? parseFloat(dynamicTrades[dynamicTrades.length - 1].cumulativeR.toFixed(1)) : 0;
  }, [dynamicTrades]);

  const maxDrawdownR = React.useMemo(() => {
    let peakR = 0;
    let maxDD = 0;
    dynamicTrades.forEach((t) => {
      if (t.cumulativeR > peakR) {
        peakR = t.cumulativeR;
      }
      const currentDD = peakR - t.cumulativeR;
      if (currentDD > maxDD) {
        maxDD = currentDD;
      }
    });
    return parseFloat(maxDD.toFixed(1));
  }, [dynamicTrades]);

  const extCashPnL = React.useMemo(() => {
    return netProfitR * (accountSize * (riskPerTradePercent / 100));
  }, [netProfitR, accountSize, riskPerTradePercent]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative">
      
      {/* Absolute Aesthetic Background Grids & Volumetric Starry Nebulae */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.06),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.04),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-20" />
      
      {/* Visual cyber mesh pattern backing cards */}
      <div className="absolute inset-0 bg-transparent" style={{
        backgroundImage: `radial-gradient(rgba(34,211,238,0.035) 1.5px, transparent 1.5px)`,
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
      }} />

      {/* 1. Cockpit Header Bar */}
      <CockpitHeader soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} symbol={symbol} timeframe={getOptimalTimeframe(strategyProtocol, horizonMode)} />

      {/* Main Working Grid Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">

        {/* Global Actionable Error Display Block */}
        {errorMsg && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-rose-200 text-sm flex items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold font-display">Aether Compilation Invalidation</p>
                <p className="text-xs text-rose-300/80 font-mono">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs underline text-rose-400 hover:text-rose-300 font-mono transition pr-2 select-none"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2. Panoramic Layout View */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <ConsoleLogs
                symbol={symbol}
                indicator={indicator}
                bias={bias}
                riskPercent={riskPerTradePercent}
                capital={accountSize}
                seriesSize={seriesSize}
                rrSetup={rrSetup}
                horizonMode={horizonMode}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Cockpit Config Input Panel (Left, col-4) paired with Quant Metrics Panel (Right, col-8) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Aether Strategic Settings Cockpit */}
                <div className="lg:col-span-4 bg-slate-900/35 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Neon border corners */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-500/60"></div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-500/60"></div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
                      <Sliders className="w-4 h-4 animate-pulse text-cyan-500" />
                      <span>STRATEGY SYNTHESIS COCKPIT</span>
                    </div>

                    <div className="space-y-4">
                      {/* Asset Select Dropdown */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="field-asset">
                          1. Target Market Pair
                        </label>
                        <select
                          id="field-asset"
                          value={symbol}
                          onChange={(e) => { setSymbol(e.target.value); if (soundEnabled) playTick(); }}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg py-2 px-3 text-xs text-slate-100 outline-none transition focus:ring-1 focus:ring-cyan-500/35 font-mono"
                        >
                          <option value="XAU/USD">Gold Spot (XAU/USD)</option>
                          <option value="XAG/USD">Silver Spot (XAG/USD)</option>
                          <option value="EUR/USD">Euro / US Dollar (EUR/USD)</option>
                          <option value="GBP/USD">British Pound / US Dollar (GBP/USD)</option>
                          <option value="BTC/USDT">Bitcoin / USDT (BTC/USDT)</option>
                          <option value="ETH/USDT">Ethereum / USDT (ETH/USDT)</option>
                        </select>
                      </div>

                      {/* Mini Telemetry Bar displaying live simulated prices */}
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-[10px] relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
                        <div className="flex items-center justify-between text-slate-500 mb-1.5">
                          <span>LIVE COCKPIT FEED</span>
                          <span className="text-cyan-400 flex items-center gap-1.5 font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></span>
                            ACTIVE FEED
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-bold text-slate-100 font-sans tracking-tight">
                            {livePrice.toLocaleString(undefined, {
                              minimumFractionDigits: (symbol === "EUR/USD" || symbol === "GBP/USD") ? 5 : 2,
                              maximumFractionDigits: (symbol === "EUR/USD" || symbol === "GBP/USD") ? 5 : 2
                            })}
                          </span>
                          <span className={`font-bold text-[10px] flex items-center gap-0.5 ${priceChangePct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {priceChangePct >= 0 ? "▲" : "▼"}{priceChangePct >= 0 ? "+" : ""}{priceChangePct.toFixed(3)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-[8.5px] border-t border-slate-800/50 mt-2.5 pt-2">
                          <span>BID: <strong className="text-slate-300 font-medium">
                            {priceBid.toLocaleString(undefined, {
                              minimumFractionDigits: (symbol === "EUR/USD" || symbol === "GBP/USD") ? 5 : 2,
                              maximumFractionDigits: (symbol === "EUR/USD" || symbol === "GBP/USD") ? 5 : 2
                            })}
                          </strong></span>
                          <span>ASK: <strong className="text-slate-300 font-medium">
                            {priceAsk.toLocaleString(undefined, {
                              minimumFractionDigits: (symbol === "EUR/USD" || symbol === "GBP/USD") ? 5 : 2,
                              maximumFractionDigits: (symbol === "EUR/USD" || symbol === "GBP/USD") ? 5 : 2
                            })}
                          </strong></span>
                        </div>
                      </div>

                      {/* Quantitative Strategy Suite Dropdown */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="field-protocol">
                          2. Quantitative Strategy Suite
                        </label>
                        <select
                          id="field-protocol"
                          value={strategyProtocol}
                          onChange={(e) => { 
                            const val = e.target.value;
                            setStrategyProtocol(val); 
                            setIndicator(val);
                            if (soundEnabled) playTick(); 
                          }}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg py-2 px-3 text-xs text-slate-100 outline-none transition focus:ring-1 focus:ring-cyan-500/35 font-mono"
                        >
                          <option value="ICT Silver Bullet Model">ICT Silver Bullet Model</option>
                          <option value="Order Block Sweeps">Order Block Sweeps</option>
                          <option value="ICT 2022 FVG Framework">ICT 2022 FVG Framework</option>
                          <option value="Autonomous Breakout V4">Autonomous Breakout V4</option>
                          <option value="Aether Mean Reversion V1">Aether Mean Reversion V1</option>
                        </select>
                      </div>

                      {/* 🎯 System Synced Timeframe Readout Display */}
                      <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 font-mono text-[10px]">
                        <div className="flex items-center justify-between text-slate-500 mb-1">
                          <span>🎯 SYSTEM SYNCED TIMEFRAME</span>
                          <span className="text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/20 border border-cyan-900/40">
                            AUTO-SYNCED
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">
                            Current Synced Interval
                          </span>
                          <span className="text-xs font-black text-cyan-400 font-mono italic tracking-wide bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {getOptimalTimeframe(strategyProtocol, horizonMode)}
                          </span>
                        </div>
                      </div>

                      {/* 3. Risk-to-Reward Setup */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="field-rr-setup">
                          3. Risk-to-Reward Setup
                        </label>
                        <select
                          id="field-rr-setup"
                          value={rrSetup}
                          onChange={(e) => { setRrSetup(e.target.value as any); if (soundEnabled) playTick(); }}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg py-2 px-3 text-xs text-slate-100 outline-none transition focus:ring-1 focus:ring-cyan-500/35 font-mono"
                        >
                          <option value="1:1.5">1:1.5 Matrix</option>
                          <option value="1:2">1:2 Structural (Default)</option>
                          <option value="1:3">1:3 Aggressive Expansion</option>
                        </select>
                      </div>

                      {/* Trading Horizon Mode Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Trading Horizon Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => { setHorizonMode("Intraday Scalping"); if (soundEnabled) playTick(); }}
                            className={`py-2 px-1 rounded-lg text-[10px] font-mono font-bold transition text-center border cursor-pointer ${
                              horizonMode === "Intraday Scalping"
                                ? "bg-cyan-950/20 text-cyan-300 border-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                                : "bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400"
                            }`}
                          >
                            Intraday Scalping
                          </button>
                          <button
                            type="button"
                            onClick={() => { setHorizonMode("Macro Swing Execution"); if (soundEnabled) playTick(); }}
                            className={`py-2 px-1 rounded-lg text-[10px] font-mono font-bold transition text-center border cursor-pointer ${
                              horizonMode === "Macro Swing Execution"
                                ? "bg-indigo-950/20 text-indigo-300 border-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.15)]"
                                : "bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400"
                            }`}
                          >
                            Macro Swing Execution
                          </button>
                        </div>
                      </div>

                      {/* 4. Sample Series Size Option Selector Group */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          4. Sample Series Size
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[15, 50, 100, 250].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => { setSeriesSize(size); if (soundEnabled) playTick(); }}
                              className={`py-2 px-1 rounded-lg text-[10.5px] font-mono font-bold transition text-center border cursor-pointer ${
                                seriesSize === size
                                  ? "bg-cyan-950/20 text-cyan-300 border-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                                  : "bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400"
                              }`}
                            >
                              {size} T
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 5. Directional Protocol Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          5. Directional Protocol
                        </label>
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => { setBias("Bi-Directional"); if (soundEnabled) playTick(); }}
                            className={`w-full text-left p-2 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                              bias === "Bi-Directional"
                                ? "bg-cyan-950/25 text-cyan-300 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                : "bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-[spin_8s_linear_infinite]" />
                              <div>
                                <p className="text-[11px] font-bold font-mono uppercase tracking-wide">Bi-Directional Dual Bias</p>
                                <p className="text-[8.5px] text-slate-500 font-sans">Alternates LONG & SHORT setups dynamically per trial sequence</p>
                              </div>
                            </div>
                            <span className="text-[8px] bg-cyan-950 border border-cyan-900 text-cyan-400 font-bold px-1 rounded uppercase">ADVANCED</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => { setBias("Bullish"); if (soundEnabled) playTick(); }}
                              className={`py-1.5 px-2 rounded-lg text-[10.5px] font-mono font-medium transition flex items-center justify-center gap-1 border cursor-pointer ${
                                bias === "Bullish"
                                  ? "bg-emerald-950/25 text-emerald-300 border-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.1)]"
                                  : "bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400"
                              }`}
                            >
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                              <span>BULLISH ONLY</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => { setBias("Bearish"); if (soundEnabled) playTick(); }}
                              className={`py-1.5 px-2 rounded-lg text-[10.5px] font-mono font-medium transition flex items-center justify-center gap-1 border cursor-pointer ${
                                bias === "Bearish"
                                  ? "bg-rose-950/25 text-rose-300 border-rose-500/80 shadow-[0_0_6px_rgba(239,68,68,0.1)]"
                                  : "bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400"
                              }`}
                            >
                              <TrendingDown className="w-3 h-3 text-rose-500" />
                              <span>BEARISH ONLY</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Guardian Toggle - 15-Min News Buffer or Overnight Swap Fee */}
                      <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              {horizonMode === "Macro Swing Execution" 
                                ? "Overnight Swap Fee Dynamic Adjustment" 
                                : "15-Min Red Folder News (CPI/NFP/FOMC Only)"}
                            </p>
                            <p className="text-[9.5px] text-slate-500 font-sans leading-snug">
                              {horizonMode === "Macro Swing Execution"
                                ? "Compensates for carrying trades overnight. Activating this applies a rollover swap fee of -0.12R to executed trades and skips high-spread consolidations."
                                : "Disciplined capital protection logic. Randomly intercepts & skips ~13% of trades near high-impact event times."}
                            </p>
                          </div>
                          
                          {/* Fine custom toggle switch element */}
                          <div className="relative inline-flex items-center shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => { setNewsBufferEnabled(!newsBufferEnabled); if (soundEnabled) playTick(); }}
                              className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                                newsBufferEnabled ? "bg-cyan-500" : "bg-slate-800"
                              }`}
                            >
                              <span
                                className={`block w-3.5 h-3.5 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                                  newsBufferEnabled ? "translate-x-5.5" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Account Starting Size Slider Input */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="capital-range">
                            6. Engine Capital Size
                          </label>
                          <span className="text-xs font-mono text-cyan-400 font-bold">${accountSize.toLocaleString()}</span>
                        </div>
                        <input
                          id="capital-range"
                          type="range"
                          min="10000"
                          max="500000"
                          step="5000"
                          value={accountSize}
                          onChange={handleCapitalInput}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-[8px] text-slate-600 font-mono mt-0.5">
                          <span>$10k</span>
                          <span>$250k</span>
                          <span>$500k</span>
                        </div>
                      </div>

                      {/* Fixed Risk Percentage Slider Input */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            7. Risk Allocated Per Trade
                          </label>
                          <span className="text-xs font-mono text-cyan-400 font-bold">{riskPerTradePercent}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.25"
                          max="5.0"
                          step="0.25"
                          value={riskPerTradePercent}
                          onChange={handleRiskInput}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-[8px] text-slate-600 font-mono mt-0.5">
                          <span>0.25%</span>
                          <span>2.5%</span>
                          <span>5.0%</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 italic pl-1 border-l border-cyan-500/20 leading-normal">
                          Wins yield <strong className="text-emerald-400 font-semibold">+{rrSetup === "1:1.5" ? "1.5" : rrSetup === "1:3" ? "3.0" : "2.0"}R</strong> (+{(riskPerTradePercent * (rrSetup === "1:1.5" ? 1.5 : rrSetup === "1:3" ? 3.0 : 2.0)).toFixed(2)}%) and losses yield <strong className="text-rose-400 font-semibold">-1.0R</strong> (-{riskPerTradePercent.toFixed(2)}%).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Launch Button triggers Synthesis Engine */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleRunStrategy}
                      className="w-full relative group overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-bold font-mono text-xs tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] select-none cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-slate-950 shrink-0" />
                      <span>SYNTHESIZE &amp; RUN STRATEGY</span>
                    </button>
                    <p className="text-[9px] text-center text-slate-500 mt-2 uppercase font-mono tracking-tighter">
                      SYNTHESIZES CODE &amp; {seriesSize} TRIAL SAMPLES
                    </p>
                  </div>

                </div>

                {/* Dashboard Metrics and Performance Tab Console */}
                <div className="lg:col-span-8 flex flex-col justify-between gap-6">
                  
                  {/* High Tech Metrics HUD Bar (Win Rate, Net Profit R-Units, Drawdowns) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* Orders Metri-Block */}
                    <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                      <div className="absolute right-3 top-2 text-[9px] font-mono text-cyan-500/60 uppercase font-semibold">T-{totalTradesCount}</div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">TRIAL ORDER SPLITS</p>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-semibold font-display text-slate-100">{totalTradesCount}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Matrix Orders</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded overflow-hidden mt-3 border border-slate-800">
                        <div className="bg-cyan-500 h-full w-full"></div>
                      </div>
                    </div>

                    {/* Win percentage Block */}
                    <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                      <div className="absolute right-3 top-2 text-[9px] font-mono text-cyan-500/60 uppercase font-semibold">W%</div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">PROB WIN RATE</p>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-2xl font-semibold font-display text-slate-100">{winRate}%</span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-3 font-mono">
                        {winsCount} Wins / {lossesCount} Losses{skippedCount > 0 ? ` / ${skippedCount} Skipped` : ""}
                      </p>
                    </div>

                    {/* Net Earned R Outlay Block */}
                    <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                      <div className="absolute right-3 top-2 text-[9px] font-mono text-cyan-500/60 uppercase font-semibold">PnL</div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">NET PERFORMANCE</p>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className={`text-2xl font-semibold font-display ${netProfitR >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {netProfitR >= 0 ? "+" : ""}{netProfitR} R
                        </span>
                      </div>
                      <p className="text-[9px] text-emerald-400/80 font-mono mt-3 truncate flex items-center">
                        <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>PnL: {netProfitR >= 0 ? "+" : ""}${extCashPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </p>
                    </div>

                    {/* Maximum drawdown Block */}
                    <div className="bg-slate-900/35 border border-slate-800/60 p-4 rounded-2xl relative overflow-hidden backdrop-blur-md">
                      <div className="absolute right-3 top-2 text-[9px] font-mono text-cyan-500/60 uppercase font-semibold">DD</div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">MAX R-DRAWDOWN</p>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-2xl font-semibold font-display text-orange-400">-{maxDrawdownR} R</span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono mt-3 truncate">
                        Est: -${(maxDrawdownR * accountSize * (riskPerTradePercent / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                  </div>

                  {/* Diagnostic Console Tabs Container */}
                  <DiagnosticTerminal
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    loading={loading}
                    soundEnabled={soundEnabled}
                    strategyCode={data?.strategyDetails.strategyCode}
                    reportNarrative={data?.strategyDetails.reportNarrative}
                    optimizedTimeframe={data?.strategyDetails.optimizedTimeframe}
                    optimizedProtocol={data?.strategyDetails.optimizedProtocol}
                    totalTrades={seriesSize}
                    timeframe={getOptimalTimeframe(strategyProtocol, horizonMode)}
                  >
                    {/* Performance Line Chart embedded inside Diagnostic Terminal */}
                    <div id="equity-curve-chart-wrapper" className="overflow-hidden w-full h-[235px]">
                      <ResponsiveContainer key={`chart-${horizonMode}-${symbol}`} width="100%" height={235} minWidth={280}>
                        <LineChart
                          data={chartData}
                          margin={{ top: 10, right: 15, left: -25, bottom: -5 }}
                        >
                          <defs>
                            <linearGradient id="gradientR" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.18} />
                              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                          <XAxis
                            dataKey="name"
                            stroke="#475569"
                            fontSize={9}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#475569"
                            fontSize={9}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(t) => `${t >= 0 ? "+" : ""}${t}R`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const p = payload[0].payload;
                                const isFirst = p.name === "Start";
                                const rVal = p.R;
                                const balance = p.balance;
                                const pctGain = rVal * riskPerTradePercent;

                                return (
                                  <div className="bg-slate-950 border border-cyan-500/20 px-3 py-2.5 rounded-lg text-[11px] font-mono shadow-xl space-y-1 select-none">
                                    <p className="text-slate-400 font-bold border-b border-slate-900 pb-0.5 mb-1 text-center">{p.name}</p>
                                    <div className="flex justify-between gap-5">
                                      <span className="text-slate-500">Net R units:</span>
                                      <span className={rVal >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                        {rVal >= 0 ? "+" : ""}{rVal} R
                                      </span>
                                    </div>
                                    <div className="flex justify-between gap-5">
                                      <span className="text-slate-500">Balance:</span>
                                      <span className="text-slate-200">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {!isFirst && (
                                      <div className="flex justify-between gap-5 border-t border-slate-900/50 pt-1">
                                        <span className="text-slate-500">Rate of change:</span>
                                        <span className={pctGain >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                          {pctGain >= 0 ? "+" : ""}{pctGain.toFixed(2)}%
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" opacity={0.4} />
                          
                          {/* Glow outline Line */}
                          <Line
                            type="monotone"
                            dataKey="R"
                            stroke="#22d3ee"
                            strokeWidth={5}
                            strokeOpacity={0.12}
                            className="blur-[4px]"
                            dot={false}
                            activeDot={false}
                            isAnimationActive={!(seriesSize === 100 || seriesSize === 250)}
                          />
                          {/* Primary Sharpe Line */}
                          <Line
                            type="monotone"
                            dataKey="R"
                            stroke="#06b6d4"
                            strokeWidth={2.5}
                            dot={{ r: 3.5, stroke: "#0891b2", strokeWidth: 1.5, fill: "#020617" }}
                            activeDot={{ r: 6, stroke: "#22d3ee", strokeWidth: 2, fill: "#020617" }}
                            isAnimationActive={!(seriesSize === 100 || seriesSize === 250)}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </DiagnosticTerminal>

                </div>

              </div>

              {/* 3. Operational Order Ledger Table & Inspectors (Dual Column Row) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Horizontal logs table panel */}
                <div className="lg:col-span-8 bg-slate-900/35 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm font-display font-medium text-slate-100 flex items-center gap-1.5 uppercase">
                        <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                        Chronological simulated order ledger
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Fixed brackets enforce target returns. Click an order line to listen and inspect diagnostics.
                      </p>
                    </div>
                    <div className="text-[9px] font-mono bg-slate-950 border border-slate-800 py-1 px-2.5 rounded text-slate-400 uppercase select-none">
                      Index 1 &bull; {seriesSize} OLD &raquo; NEW
                    </div>
                  </div>

                  {/* Standardized Table View */}
                  <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/60">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800/80 bg-slate-950 text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                          <th className="py-2.5 px-3 min-w-[55px]"># Index</th>
                          <th className="py-2.5 px-3 min-w-[75px]">Asset</th>
                          <th className="py-2.5 px-3 min-w-[65px]">Direction</th>
                          <th className="py-2.5 px-3">Entry Level</th>
                          <th className="py-2.5 px-3">Outcome</th>
                          <th className="py-2.5 px-3 text-right">Cash Earned</th>
                          <th className="py-2.5 px-3 text-right">R Unit</th>
                          <th className="py-2.5 px-3 hidden md:table-cell">Diagnostic Snippet</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/40 text-[10px] sm:text-[11px] font-mono text-slate-300">
                        {paginatedTrades && paginatedTrades.length > 0 ? (
                          paginatedTrades.map((t) => {
                            const isWin = t.outcome === "WIN";
                            const isSelected = currentSelectedTrade?.id === t.id;
                            
                            return (
                              <tr
                                key={t.id}
                                onClick={() => inspectTrade(t)}
                                className={`hover:bg-cyan-500/5 cursor-pointer transition select-none ${
                                  isSelected ? "bg-cyan-950/20 text-cyan-200 border-l-2 border-cyan-500" : ""
                                }`}
                              >
                                <td className="py-2.5 px-3 font-semibold text-slate-400 flex items-center gap-1">
                                  {t.tradeIndex}
                                  {isSelected && <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-300">{t.symbol}</td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                      t.direction === "LONG"
                                        ? "bg-cyan-950/55 text-cyan-400 border border-cyan-900/40"
                                        : "bg-indigo-950/55 text-indigo-400 border border-indigo-900/40"
                                    }`}
                                  >
                                    {t.direction}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-330">{t.entryPrice?.toLocaleString(undefined, { minimumFractionDigits: (symbol || t.symbol || "").includes("EUR") ? 5 : 2 })}</td>
                                <td className="py-2.5 px-3">
                                  <span className={`inline-flex items-center gap-1 ${
                                    t.outcome === "WIN" 
                                      ? "text-emerald-400" 
                                      : t.outcome === "SKIPPED" 
                                        ? "text-amber-400" 
                                        : "text-rose-400"
                                  }`}>
                                    {t.outcome === "WIN" ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : t.outcome === "SKIPPED" ? (
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                    )}
                                    {t.outcome}
                                  </span>
                                </td>
                                <td className={`py-2.5 px-3 text-right font-bold ${
                                  t.outcome === "WIN" 
                                    ? "text-emerald-400" 
                                    : t.outcome === "SKIPPED" 
                                      ? "text-slate-400" 
                                      : "text-rose-400"
                                }`}>
                                  {t.outcome === "WIN" ? "+$" : t.outcome === "SKIPPED" ? "" : "-$"}${Math.abs(t.pnlCash).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                </td>
                                <td className={`py-2.5 px-3 text-right font-bold ${
                                  t.outcome === "WIN" 
                                    ? "text-emerald-400" 
                                    : t.outcome === "SKIPPED" 
                                      ? "text-slate-400" 
                                      : "text-rose-400"
                                }`}>
                                  {t.outcome === "WIN" ? "+2.0R" : t.outcome === "SKIPPED" ? "0.0R" : "-1.0R"}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 italic truncate max-w-[150px] hidden md:table-cell select-none">
                                  {t.comment}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-6 text-center text-slate-500">
                              No strategy simulated matrix loaded.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* High Tech Pagination Control Bar */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-900/40 text-xs font-mono select-none flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); if (soundEnabled) playTick(); }}
                        className="py-1 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950 rounded transition text-slate-400 hover:text-cyan-400 cursor-pointer text-[10px]"
                      >
                        &laquo; PREV BLOCK
                      </button>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-slate-500 font-sans">PAGE</span>
                        <span className="text-cyan-400 font-extrabold">{currentPage}</span>
                        <span className="text-slate-500 font-sans">OF</span>
                        <span className="text-slate-200 font-extrabold">{totalPages}</span>
                        <span className="text-slate-800">|</span>
                        <span className="text-slate-500 font-sans">
                          SHOWING {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, dynamicTrades.length)} OF {dynamicTrades.length} ORDERS
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); if (soundEnabled) playTick(); }}
                        className="py-1 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950 rounded transition text-slate-400 hover:text-cyan-400 cursor-pointer text-[10px]"
                      >
                        NEXT BLOCK &raquo;
                      </button>
                    </div>
                  )}

                </div>

                {/* Analytical inspector diagnostics (Col-4) */}
                <div className="lg:col-span-4 bg-slate-900/35 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Neon HUD Bracket Styling */}
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-500/60"></div>
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-500/60"></div>

                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span>Order Diagnostics Inspector</span>
                    </div>

                    {currentSelectedTrade ? (
                      <div className="space-y-4">
                        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between shadow-inner">
                          <div>
                            <p className="text-[9px] text-slate-500 font-mono tracking-wider">LEDGER BLOCK ID</p>
                            <p className="text-sm font-bold text-slate-200 font-mono">{currentSelectedTrade.id}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold border ${
                              currentSelectedTrade.outcome === "WIN"
                                ? "bg-emerald-950/65 text-emerald-400 border-emerald-500/60"
                                : currentSelectedTrade.outcome === "SKIPPED"
                                  ? "bg-amber-950/65 text-amber-400 border-amber-500/60 animate-pulse"
                                  : "bg-rose-950/65 text-rose-400 border-rose-500/60"
                            }`}
                          >
                            {currentSelectedTrade.outcome === "WIN" ? "PROFIT EXITED" : currentSelectedTrade.outcome === "SKIPPED" ? "NEWS BUFFERED" : "LIQUIDITY SWEPT"}
                          </span>
                        </div>

                        {/* Telemetry specs dashboard */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono select-none">
                          <div className="bg-slate-950 border border-slate-800/50 p-2.5 rounded-lg shadow-inner">
                            <p className="text-[9px] text-slate-500 font-sans">Ticker Asset</p>
                            <p className="font-bold text-slate-300">{currentSelectedTrade.symbol}</p>
                          </div>
                          <div className="bg-slate-950 border border-slate-800/50 p-2.5 rounded-lg shadow-inner">
                            <p className="text-[9px] text-slate-500 font-sans">Strategic Bias</p>
                            <p className="font-bold text-slate-300">{currentSelectedTrade.direction}</p>
                          </div>
                          <div className="bg-slate-950 border border-slate-800/50 p-2.5 rounded-lg shadow-inner">
                            <p className="text-[9px] text-slate-500 font-sans">Filled Entry</p>
                            <p className="font-bold text-slate-300">
                              {currentSelectedTrade.entryPrice?.toLocaleString(undefined, { minimumFractionDigits: (symbol || currentSelectedTrade.symbol || "").includes("EUR") ? 5 : 2 })}
                            </p>
                          </div>
                          <div className="bg-slate-950 border border-slate-800/50 p-2.5 rounded-lg shadow-inner">
                            <p className="text-[9px] text-slate-500 font-sans">Return Ratio</p>
                            <p className={`font-bold ${
                              currentSelectedTrade.outcome === "WIN" 
                                ? "text-emerald-400" 
                                : currentSelectedTrade.outcome === "SKIPPED"
                                  ? "text-slate-400 animate-pulse"
                                  : "text-rose-400"
                            }`}>
                              {currentSelectedTrade.outcome === "WIN" ? "+2.0 R Units" : currentSelectedTrade.outcome === "SKIPPED" ? "0.0 R Units" : "-1.0 R Units"}
                            </p>
                          </div>
                        </div>

                        {/* Interactive strict 1:2 R:R exit bracket visualization graph */}
                        <div>
                          <p className="text-[9px] font-mono text-slate-500 mb-1.5 uppercase tracking-wider select-none">
                            BRACKET EXIT PARAMETERS (1:2 RR MATRIX)
                          </p>
                          <div className="bg-slate-950 border border-slate-800/85 rounded-xl p-3 space-y-3 relative font-mono text-[10.5px]">
                            {/* Take profit trigger */}
                            <div className={`flex items-center justify-between border-l-2 pl-2 ${currentSelectedTrade.outcome === "WIN" ? "border-emerald-500" : "border-slate-800"}`}>
                              <div>
                                <p className="text-[8.5px] text-slate-500 uppercase">Take profit level (+2R)</p>
                                <p className={`font-semibold ${currentSelectedTrade.outcome === "WIN" ? "text-emerald-400" : "text-slate-400"}`}>{currentSelectedTrade.takeProfit?.toLocaleString(undefined, { minimumFractionDigits: (symbol || currentSelectedTrade.symbol || "").includes("EUR") ? 5 : 2 })}</p>
                              </div>
                              {currentSelectedTrade.outcome === "WIN" ? (
                                <span className="text-[8px] bg-emerald-950 border border-emerald-900 text-emerald-400 px-1.5 py-0.5 rounded font-bold animate-pulse">TRIGGERED</span>
                              ) : currentSelectedTrade.outcome === "SKIPPED" ? (
                                <span className="text-[8px] border border-slate-800 text-slate-600 px-1.5 py-0.5 rounded font-bold">CANCELED</span>
                              ) : null}
                            </div>

                            {/* Center core entry */}
                            <div className="flex items-center justify-between border-l-2 border-cyan-500 pl-2 bg-cyan-950/10 py-1 rounded-r">
                              <div>
                                <p className="text-[8.5px] text-cyan-400 uppercase">Execution entry price</p>
                                <p className="font-semibold text-slate-200">{currentSelectedTrade.entryPrice?.toLocaleString(undefined, { minimumFractionDigits: (symbol || currentSelectedTrade.symbol || "").includes("EUR") ? 5 : 2 })}</p>
                              </div>
                              <span className="text-[8px] text-slate-500 uppercase font-bold">{currentSelectedTrade.outcome === "SKIPPED" ? "BYPASSED" : "LOCKED"}</span>
                            </div>

                            {/* Stop loss trigger */}
                            <div className={`flex items-center justify-between border-l-2 pl-2 ${currentSelectedTrade.outcome === "LOSS" ? "border-rose-500" : "border-slate-800"}`}>
                              <div>
                                <p className="text-[8.5px] text-slate-500 uppercase">Stop invalidation (-1R)</p>
                                <p className={`font-semibold ${currentSelectedTrade.outcome === "LOSS" ? "text-rose-400" : "text-slate-400"}`}>{currentSelectedTrade.stopLoss?.toLocaleString(undefined, { minimumFractionDigits: (symbol || currentSelectedTrade.symbol || "").includes("EUR") ? 5 : 2 })}</p>
                              </div>
                              {currentSelectedTrade.outcome === "LOSS" ? (
                                <span className="text-[8px] bg-rose-950 border border-rose-900 text-rose-400 px-1.5 py-0.5 rounded font-bold">TRIGGERED</span>
                              ) : currentSelectedTrade.outcome === "SKIPPED" ? (
                                <span className="text-[8px] border border-slate-800 text-slate-600 px-1.5 py-0.5 rounded font-bold">CANCELED</span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Actionable narrative comment */}
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs leading-relaxed select-text shadow-inner border-l-2 border-cyan-500">
                          <p className="text-[8px] text-slate-500 font-mono mb-1 uppercase tracking-wider select-none">
                            Quant diagnostic comment
                          </p>
                          <p className="text-slate-300 italic font-mono leading-relaxed">&ldquo;{currentSelectedTrade.comment}&rdquo;</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-600 text-xs font-mono uppercase">
                        Select an order in grid log to investigate metrics
                      </div>
                    )}
                  </div>

                  {/* Informational telemetry tip */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono leading-normal bg-slate-950/50 p-2.5 rounded-lg border border-slate-900">
                    <span className="text-cyan-400 font-bold uppercase block mb-1">AETHER STRATEGIC DECREES:</span>
                    Strict mathematical expectancies suggest keeping trial allocations below 1.5% starting account parameters to guard drawdown limits securely.
                  </div>

                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Modern High-End Panoramic HUD Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 relative mt-16 py-10 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="uppercase tracking-widest text-[10px] text-slate-400">
            AETHER-SYNTHESIZER COMPILATION MATRIX SYSTEM &bull; PORT 3000
          </p>
          <p className="max-w-3xl mx-auto text-slate-500 leading-normal text-[10.5px]">
            All quantitative index formulas, simulated trial logs and generated Pinescript components are evaluated dynamically inside standard sandbox containers. Past mock performances do not guarantee real currency account yields. Trade responsibly.
          </p>
        </div>
      </footer>

    </div>
  );
}
