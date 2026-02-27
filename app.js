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
    { ticker: "LMT", company: "Lockheed Martin", price: 658.08, dayChange: 2.56, score: 5, direction: "bullish", summary: "Record $194B backlog. PAC-3 tripling production. F-47 win. $480M Navy ASW contract (Feb 23). C-130J FMS RAAF deal. 6 politician buys. Stock +31% YTD." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 202.62, dayChange: 2.52, score: 5, direction: "bullish", summary: "StormBreaker Navy Super Hornet approval (Feb 20). Most traded defense stock by Congress. $50B Patriot contract. Iran escalation = Patriot demand surge." },
    { ticker: "NOC", company: "Northrop Grumman", price: 724.38, dayChange: 1.90, score: 5, direction: "bullish", summary: "UPGRADED: B-21 production +25% ($4.5B) in $153B Pentagon reconciliation. B-21 validated in Iran strikes. Sentinel ICBM. Nuclear modernization centerpiece. Analysts flagging for Midnight Hammer repeat." },
    { ticker: "KTOS", company: "Kratos Defense", price: 86.18, dayChange: -6.47, score: 3, direction: "neutral", summary: "DOWNGRADED: -5.90% selloff despite $12.4M CCA engine contract (Feb 23, AFA) and $1.1B Drone Dominance. Market skepticism on execution timeline. Momentum deterioration." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 69.10, dayChange: -4.89, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. SDA HALO tactical SATCOM demo ecosystem. Space-based tracking." },
    { ticker: "BWXT", company: "BWX Technologies", price: 205.98, dayChange: -0.61, score: 5, direction: "bullish", summary: "UPGRADED: Nuclear emphasis in $153B reconciliation spend. Sole-source naval nuclear. Zero DOGE risk. Record $7.4B backlog. +2.61% on day." },
    { ticker: "HII", company: "Huntington Ingalls", price: 444.52, dayChange: 0.34, score: 5, direction: "bullish", summary: "UPGRADED: $29B shipbuilding in $153B reconciliation — largest allocation. Only nuclear shipyard. 14 Navy vessels deployed to Iran theater. +1.84% on day." },
    { ticker: "CW", company: "Curtiss-Wright", price: 700.33, dayChange: -0.24, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. AFA Warfare Symposium acquisition reform tailwind." },
    { ticker: "GD", company: "General Dynamics", price: 357.05, dayChange: 1.80, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. SSGN deployment confirmed." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 364.54, dayChange: 2.64, score: 4, direction: "bullish", summary: "UPGRADED: F-22 deployment + 150 aircraft surge = elevated EW/comms demand. Book-to-bill 1.5x. Iran dual-carrier posture maximizes sensor/comm gear demand." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 137.19, dayChange: 0.92, score: 4, direction: "bullish", summary: "UPGRADED: Pentagon summoned Anthropic CEO — AI guardrails dispute. xAI/Google deals done. PLTR incumbent AI/targeting platform benefits. $10B Army contract." },
    { ticker: "AVAV", company: "AeroVironment", price: 252.25, dayChange: -2.84, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. Iran escalation = loitering munitions demand surge. Ukraine front stabilizing." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 116.00, dayChange: 0.91, score: 3, direction: "bullish", summary: "European NATO re-arming supercycle. Front-line states (Poland, Baltics, Finland) accelerating spending. 4th anniversary of Ukraine invasion Feb 24." },
    { ticker: "MRCY", company: "Mercury Systems", price: 89.03, dayChange: -0.61, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. Iran crisis = accelerated Patriot/F-35 procurement." },
    { ticker: "BA", company: "Boeing", price: 287.46, dayChange: -0.79, score: 2, direction: "neutral", summary: "Aerospace recovery trade. Defense segment stable, but commercial drag. KC-46 issues. Potential defense upside via F-15EX, T-7." },
    { ticker: "LDOS", company: "Leidos", price: 212.63, dayChange: 0.52, score: 3, direction: "bullish", summary: "IT modernization, cyber. Pentagon AI procurement shift could favor integrators. TSA/DoD contracts." },
    { ticker: "FTNT", company: "Fortinet", price: 79.18, dayChange: -0.79, score: 3, direction: "neutral", summary: "Cyber budgets resilient. Government zero-trust modernization. Competitive vs PANW/CRWD." },
    { ticker: "CRWD", company: "CrowdStrike", price: 442.61, dayChange: -0.19, score: 4, direction: "bullish", summary: "Endpoint security leader. Federal cyber tailwinds. High valuation risk." },
    { ticker: "JOBY", company: "Joby Aviation", price: 17.78, dayChange: -2.52, score: 2, direction: "bullish", summary: "DoD Agility Prime pilot programs. Certification timeline risk." },
    { ticker: "ACHR", company: "Archer Aviation", price: 11.62, dayChange: -0.69, score: 2, direction: "bullish", summary: "DoD/UAM optionality. Execution risk." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 225.66, dayChange: 0.47, score: 4, direction: "bullish", summary: "Platform consolidation in cyber. Federal demand solid." },
    { ticker: "SAIC", company: "Science Applications International", price: 156.55, dayChange: -0.17, score: 3, direction: "neutral", summary: "Government IT services. Budget timing risk." },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 163.66, dayChange: -0.63, score: 3, direction: "bullish", summary: "DoD consulting/AI modernization. Benefits from procurement shifts." }
];

// Data as of: Feb 27, 2026, 2:35 PM PST

// (rest of file unchanged)
