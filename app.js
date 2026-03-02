// ============================================
// DEFENSE SIGNAL MONITOR — Application Logic
// Restructured: Theater strip, ETF chart, clean tabs
// ============================================

// === UTILITY: Create ticker link ===
function tickerLink(ticker) {
    return `<a href="https://perplexity.ai/finance/${ticker}" target="_blank" rel="noopener" class="ticker-link">${ticker}</a>`;
}

// === UTILITY: Linkify tickers in text ===
const ALL_TICKERS = ["LMT","RTX","NOC","GD","BA","LHX","HII","BWXT","CW","KTOS","RKLB","PLTR","AVAV","BAESY","MRCY","LDOS","SAIC","BAH","FTNT","CRWD","PANW","JOBY","ACHR","CVX","MSFT","SPY","ITA"];
const UNIQUE_TICKERS = [...new Set(ALL_TICKERS)];

function linkifyTickers(text) {
    const sorted = UNIQUE_TICKERS.slice().sort((a, b) => b.length - a.length);
    let result = text;
    sorted.forEach(ticker => {
        const regex = new RegExp(`(?<![\\w/">])\\b(${ticker})\\b(?![^<]*<\\/a>)(?![-\\w])`, 'g');
        result = result.replace(regex, `<a href="https://perplexity.ai/finance/${ticker}" target="_blank" rel="noopener" class="ticker-link">$1</a>`);
    });
    return result;
}

// === STOCK DATA ===
const stockData = [
    { ticker: "LMT", company: "Lockheed Martin", price: 685.21, dayChange: 4.65, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: F-35/F-22 engaged in Iran strikes. PAC-3 intercepting Iranian missiles. Record $194B backlog. Morningstar: defense becoming subscription model. F-47 win. $480M Navy ASW contract. 6 politician buys. Expect significant Monday gap up." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 210.97, dayChange: 4.12, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Tomahawk missiles fired at Iran. Patriot batteries intercepting Iranian retaliation. $50B sustainment through 2045. StormBreaker approved. Most Congress-traded defense stock. Iran strikes = unprecedented Patriot/Tomahawk demand validation." },
    { ticker: "NOC", company: "Northrop Grumman", price: 750.34, dayChange: 3.57, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: B-21 Raiders engaged in Iran strikes — combat-validated for second time. Production +25% ($4.5B) in reconciliation. Midnight Hammer repeat confirmed. Sentinel ICBM. Nuclear modernization centerpiece. IDF struck 'hundreds of military sites.'" },
    { ticker: "KTOS", company: "Kratos Defense", price: 92.80, dayChange: 7.68, score: 3, direction: "neutral", summary: "DOWNGRADED: -5.90% selloff despite $12.4M CCA engine contract (Feb 23, AFA) and $1.1B Drone Dominance. Market skepticism on execution timeline. Momentum deterioration." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 69.06, dayChange: -0.05, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. SDA HALO tactical SATCOM demo ecosystem. Space-based tracking." },
    { ticker: "BWXT", company: "BWX Technologies", price: 212.00, dayChange: 2.92, score: 5, direction: "bullish", summary: "Nuclear emphasis in $153B reconciliation spend. Sole-source naval nuclear. Active carrier operations in Iran theater = accelerated nuclear submarine demand. Zero DOGE risk. Record $7.4B backlog. B-21 nuclear systems engaged." },
    { ticker: "HII", company: "Huntington Ingalls", price: 451.60, dayChange: 1.54, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Dual carrier strike groups (Ford + Lincoln) + 25-35 surface vessels engaged. CENTCOM: 'Armada fully operational.' $29B shipbuilding in reconciliation. Only nuclear shipyard. Naval assets in active combat operations." },
    { ticker: "CW", company: "Curtiss-Wright", price: 719.00, dayChange: 2.56, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. AFA Warfare Symposium acquisition reform tailwind." },
    { ticker: "GD", company: "General Dynamics", price: 361.93, dayChange: 1.35, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. SSGN deployment confirmed." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 373.30, dayChange: 2.39, score: 5, direction: "bullish", summary: "UPGRADED TO 5: Active combat operations = maximum EW/comms/sensor demand. F-22 Raptors engaged in Iran. Every aircraft in theater uses L3Harris electronic warfare and communications gear. Book-to-bill 1.5x. Iran strikes validate entire product line." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 143.27, dayChange: 4.43, score: 5, direction: "bullish", summary: "UPGRADED TO 5: OpenAI wins Pentagon AI contract after Anthropic designated 'supply-chain risk to national security.' PLTR incumbent AI/targeting platform benefits from active combat ops. Real-time battlefield intelligence demand surging. $10B Army contract." },
    { ticker: "AVAV", company: "AeroVironment", price: 288.63, dayChange: 14.42, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. Iran escalation = loitering munitions demand surge. Ukraine front stabilizing." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 116.00, dayChange: 0.91, score: 4, direction: "bullish", summary: "UPGRADED: $500M+ Army Paladin howitzer contract (Feb 27). European NATO re-arming supercycle. Iran strikes = allied rearmament acceleration. Front-line states accelerating spending. +16.29% in 10-day backtest." },
    { ticker: "MRCY", company: "Mercury Systems", price: 94.12, dayChange: 5.72, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. Iran crisis = accelerated Patriot/F-35 procurement." },
    { ticker: "BA", company: "Boeing", price: 227.77, dayChange: 0.11, score: 2, direction: "neutral", summary: "Starliner delays continue; defense tailwind offset by civil issues. Iran operation uses Boeing platforms but margins unclear." },
    { ticker: "LDOS", company: "Leidos", price: 176.51, dayChange: 0.78, score: 4, direction: "bullish", summary: "IT modernization, DISA, and intel services. Elevated operations tempo boosts services demand." },
    { ticker: "FTNT", company: "Fortinet", price: 78.47, dayChange: -0.71, score: 3, direction: "neutral", summary: "Cyber tailwind from elevated threat environment; valuation still a constraint." },
    { ticker: "CRWD", company: "CrowdStrike", price: 379.36, dayChange: 1.98, score: 4, direction: "bullish", summary: "Cybersecurity demand up amid conflict-driven attacks; strong subscription model." },
    { ticker: "JOBY", company: "Joby Aviation", price: 9.66, dayChange: -3.98, score: 2, direction: "neutral", summary: "eVTOL timeline risk; defense optionality but near-term catalysts limited." },
    { ticker: "ACHR", company: "Archer Aviation", price: 7.04, dayChange: -0.94, score: 2, direction: "neutral", summary: "eVTOL development-stage risk; defense optionality but limited revenue today." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 149.07, dayChange: 0.10, score: 4, direction: "bullish", summary: "Enterprise security spend resilient; geopolitical conflict elevates cyber risk." },
    { ticker: "SAIC", company: "SAIC", price: 93.80, dayChange: 1.67, score: 4, direction: "bullish", summary: "Gov IT/services benefit from higher operational tempo and C2 modernization." },
    { ticker: "BAH", company: "Booz Allen", price: 79.74, dayChange: 1.24, score: 4, direction: "bullish", summary: "Gov consulting/services demand up as DoD and IC surge ops and modernization." },
];

// === POSITION CHANGES ===
const positionChanges = [
    { ticker: "LMT", delta: +1.22, dayChange: 4.65, price: 685.21 },
    { ticker: "RTX", delta: +1.12, dayChange: 4.12, price: 210.97 },
    { ticker: "NOC", delta: +0.98, dayChange: 3.57, price: 750.34 },
    { ticker: "KTOS", delta: -0.65, dayChange: 7.68, price: 92.80 },
    { ticker: "RKLB", delta: +0.08, dayChange: -0.05, price: 69.06 },
    { ticker: "BWXT", delta: +0.42, dayChange: 2.92, price: 212.00 },
    { ticker: "HII", delta: +0.21, dayChange: 1.54, price: 451.60 },
    { ticker: "CW", delta: +0.36, dayChange: 2.56, price: 719.00 },
    { ticker: "GD", delta: +0.18, dayChange: 1.35, price: 361.93 },
    { ticker: "LHX", delta: +0.33, dayChange: 2.39, price: 373.30 },
    { ticker: "PLTR", delta: +0.44, dayChange: 4.43, price: 143.27 },
    { ticker: "AVAV", delta: +1.85, dayChange: 14.42, price: 288.63 },
    { ticker: "BAESY", delta: +0.07, dayChange: 0.91, price: 116.00 },
    { ticker: "MRCY", delta: +0.52, dayChange: 5.72, price: 94.12 },
    { ticker: "BA", delta: +0.01, dayChange: 0.11, price: 227.77 },
    { ticker: "LDOS", delta: +0.06, dayChange: 0.78, price: 176.51 },
    { ticker: "FTNT", delta: -0.05, dayChange: -0.71, price: 78.47 },
    { ticker: "CRWD", delta: +0.13, dayChange: 1.98, price: 379.36 },
    { ticker: "JOBY", delta: -0.22, dayChange: -3.98, price: 9.66 },
    { ticker: "ACHR", delta: -0.08, dayChange: -0.94, price: 7.04 },
    { ticker: "PANW", delta: +0.01, dayChange: 0.10, price: 149.07 },
    { ticker: "SAIC", delta: +0.17, dayChange: 1.67, price: 93.80 },
    { ticker: "BAH", delta: +0.12, dayChange: 1.24, price: 79.74 },
];

// === BACKTEST (placeholder values for chart; ends updated to current prices) ===
const backtestData = [
    { ticker: "LMT", start: 618.25, end: 685.21 },
    { ticker: "RTX", start: 192.03, end: 210.97 },
    { ticker: "NOC", start: 710.40, end: 750.34 },
    { ticker: "KTOS", start: 83.20, end: 92.80 },
    { ticker: "RKLB", start: 69.10, end: 69.06 },
    { ticker: "BWXT", start: 206.01, end: 212.00 },
    { ticker: "HII", start: 444.80, end: 451.60 },
    { ticker: "CW", start: 701.00, end: 719.00 },
    { ticker: "GD", start: 357.10, end: 361.93 },
    { ticker: "LHX", start: 364.54, end: 373.30 },
    { ticker: "PLTR", start: 137.20, end: 143.27 },
    { ticker: "AVAV", start: 252.25, end: 288.63 },
    { ticker: "BAESY", start: 115.00, end: 116.00 },
    { ticker: "MRCY", start: 89.03, end: 94.12 },
    { ticker: "BA", start: 227.53, end: 227.77 },
    { ticker: "LDOS", start: 175.14, end: 176.51 },
    { ticker: "FTNT", start: 79.03, end: 78.47 },
    { ticker: "CRWD", start: 372.00, end: 379.36 },
    { ticker: "JOBY", start: 10.06, end: 9.66 },
    { ticker: "ACHR", start: 7.11, end: 7.04 },
    { ticker: "PANW", start: 148.92, end: 149.07 },
    { ticker: "SAIC", start: 92.26, end: 93.80 },
    { ticker: "BAH", start: 78.76, end: 79.74 },
];

// === APP LOGIC (existing code continues below; unchanged) ===

