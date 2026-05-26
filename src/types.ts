export interface Trade {
  id: string;
  tradeIndex: number;
  symbol: string;
  direction: "LONG" | "SHORT";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  outcome: "WIN" | "LOSS" | "SKIPPED";
  rGain: number;
  pnlCash: number;
  cumulativeR: number;
  time: string;
  comment: string;
}

export interface Metrics {
  totalTrades: number;
  winsCount: number;
  lossesCount: number;
  winRate: number;
  netProfitR: number;
  maxDrawdownR: number;
  estimatedCashPnL: number;
}

export interface StrategyDetails {
  symbol: string;
  indicator: string;
  bias: string;
  riskPerTradePercent: number;
  accountSize: number;
  strategyCode: string;
  reportNarrative: string;
  optimizedTimeframe?: string;
  optimizedProtocol?: string;
}

export interface BacktestResponse {
  metrics: Metrics;
  trades: Trade[];
  strategyDetails: StrategyDetails;
}
