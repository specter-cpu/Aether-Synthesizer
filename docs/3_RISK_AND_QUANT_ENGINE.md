### 2.1 The Cockpit
The Command Cockpit is the control plane of the Aether-Synthesizer. It ingests user configuration arrays (such as Capital Allocation, Risk per Trade, Target Asset, and Execution Profiles) and maps them into real-time parameters. It features telemetry indicators with specialized micro-animations to represent live socket data rates and interactive toggle arrays that command the simulation environment.

### 2.2 Autonomous Matching Engine
Once initialized, the Autonomous Matching Engine executes synthetic trade entries and exits. It operates on institutional pricing algorithms that simulate order block invalidations, fair value gap expansions, and liquidity sweep displacement points. It generates programmatic, standard Pine Script formulas dynamically corresponding to the active asset configuration, exporting directly to third-party charting terminals.

### 2.3 Hybrid Timeframe Sync
The Hybrid Timeframe Sync subsystem ensures that execution-level charts and indicators correspond to the macroeconomic profiles selected. It maps profile types dynamically:
*   **Intraday Scalping:** Coordinates micro-trend analysis, locking timeframe profiles (e.g., standard indicators at a $15\text{m}$ resolution, while pinning the high-speed *ICT Silver Bullet Model* to a granular $1\text{m}$ interval).
*   **Macro Swing Execution:** Shifts to structural holding models, mapping indicator signals to $Daily$ views, while locking the *ICT Silver Bullet Model* at a tight, high-efficiency $5\text{m}$ execution speed.

### 2.4 Risk Matrix
The Risk Matrix models the mathematical boundaries of each state. It computes precise position-sizing coefficients based on stop-loss thresholds and limits leverage dynamically to maintain risk parameters. The system automatically restricts maximum systemic drawdown via hard stops, preventing catastrophic terminal degradation.

---

## 3. Advanced Risk Management Protocol

### 3.1 15-Min Red Folder News Filter
To simulate professional capital requirements, Aether-Synthesizer implements the **15-Min Red Folder Filter**. Macroeconomic "Red Folder" news releases are modeled as high-volatility, low-liquidity events. When active:
*   The system scans upcoming economic events within a $\pm 15$-minute window of the synthetic entry.
*   Trades qualifying during this period have their success probability decreased by an **absolute $15.5\%$** to reflect erratic spread widening, bid-ask vacuuming, and irrational market behavior during structural data releases.

### 3.2 Real-World 5% Slippage Friction Modeling
No institutional execution suffers zero friction. To eliminate the bias of idealized backtesting, Aether-Synthesizer subjects every transaction to a **5% Slippage-Friction Constraint**:
1.  Winning trades are penalized by having $5\%$ of their positive R-unit yield shaved off, representing latency cost and spread slippage on take-profit fills.
2.  Losing trades are compounded by adding $5\%$ of an R-unit loss (resulting in $-1.05\text{R}$ instead of a clean $-1.00\text{R}$ stop) representing worst-case execution slippage beneath protective stops under high velocity.

---

## 4. Mathematical Scaling Engine
The system uses a pure **R-Unit Coordinate Matrix** to calculate portfolio trajectories. Rather than evaluating performance in nominal dollar values which fluctuate based on initial capital sizing, the underlying architecture calculates standard deviations of risk.

$$\text{R} = \frac{\text{Price}_{\text{Exit}} - \text{Price}_{\text{Entry}}}{\text{Price}_{\text{Entry}} - \text{Price}_{\text{Stop-Loss}}}$$

Each successful trade yields:

$$G_j = \text{Unit R} \times R_R \times \left(1 - \text{Friction}_{\text{win}}\right) \quad \left[\text{where } R_R = \text{Target Reward Ratio (e.g. } 3\text{ or } 2\text{)}\right]$$

Each failed trade yields:

$$L_k = -1.00\times \left(1 + \text{Friction}_{\text{loss}}\right) = -1.05\text{R}$$

The Cumulative Portfolio Equity $E(n)$ at any trade sequence index $n$ is calculated relative to initial starting balance $C_0$ as:

$$E(n) = C_0 \times \left(1 + \sum_{i=1}^{n} T_i \cdot \alpha\right)$$

Where $T_i$ represents the outcome in R units (either $G_j$ or $L_k$) on trade $i$, and $\alpha$ is the user-defined portfolio risk coefficient per trade ($\% \text{ Risk} / 100$). This mathematical isolation guarantees unbiased evaluation of systemic alpha across any arbitrary account denomination.
