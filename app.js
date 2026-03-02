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
    { ticker: "LMT", company: "Lockheed Martin", price: 658.08, dayChange: 2.56, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: F-35/F-22 engaged in Iran strikes. PAC-3 intercepting Iranian missiles. Record $194B backlog. Morningstar: defense becoming subscription model. F-47 win. $480M Navy ASW contract. 6 politician buys. Expect significant Monday gap up." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 202.62, dayChange: 2.52, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Tomahawk missiles fired at Iran. Patriot batteries intercepting Iranian retaliation. $50B sustainment through 2045. StormBreaker approved. Most Congress-traded defense stock. Iran strikes = unprecedented Patriot/Tomahawk demand validation." },
    { ticker: "NOC", company: "Northrop Grumman", price: 724.38, dayChange: 1.90, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: B-21 Raiders engaged in Iran strikes — combat-validated for second time. Production +25% ($4.5B) in reconciliation. Midnight Hammer repeat confirmed. Sentinel ICBM. Nuclear modernization centerpiece. IDF struck 'hundreds of military sites.'" },
    { ticker: "KTOS", company: "Kratos Defense", price: 86.18, dayChange: -6.47, score: 3, direction: "neutral", summary: "DOWNGRADED: -5.90% selloff despite $12.4M CCA engine contract (Feb 23, AFA) and $1.1B Drone Dominance. Market skepticism on execution timeline. Momentum deterioration." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 69.10, dayChange: -4.89, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. SDA HALO tactical SATCOM demo ecosystem. Space-based tracking." },
    { ticker: "BWXT", company: "BWX Technologies", price: 205.98, dayChange: -0.61, score: 5, direction: "bullish", summary: "Nuclear emphasis in $153B reconciliation spend. Sole-source naval nuclear. Active carrier operations in Iran theater = accelerated nuclear submarine demand. Zero DOGE risk. Record $7.4B backlog. B-21 nuclear systems engaged." },
    { ticker: "HII", company: "Huntington Ingalls", price: 444.52, dayChange: 0.34, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Dual carrier strike groups (Ford + Lincoln) + 25-35 surface vessels engaged. CENTCOM: 'Armada fully operational.' $29B shipbuilding in reconciliation. Only nuclear shipyard. Naval assets in active combat operations." },
    { ticker: "CW", company: "Curtiss-Wright", price: 700.33, dayChange: -0.24, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. AFA Warfare Symposium acquisition reform tailwind." },
    { ticker: "GD", company: "General Dynamics", price: 357.05, dayChange: 1.80, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. SSGN deployment confirmed." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 364.54, dayChange: 2.64, score: 5, direction: "bullish", summary: "UPGRADED TO 5: Active combat operations = maximum EW/comms/sensor demand. F-22 Raptors engaged in Iran. Every aircraft in theater uses L3Harris electronic warfare and communications gear. Book-to-bill 1.5x. Iran strikes validate entire product line." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 137.19, dayChange: 0.92, score: 5, direction: "bullish", summary: "UPGRADED TO 5: OpenAI wins Pentagon AI contract after Anthropic designated 'supply-chain risk to national security.' PLTR incumbent AI/targeting platform benefits from active combat ops. Real-time battlefield intelligence demand surging. $10B Army contract." },
    { ticker: "AVAV", company: "AeroVironment", price: 252.25, dayChange: -2.84, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. Iran escalation = loitering munitions demand surge. Ukraine front stabilizing." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 116.00, dayChange: 0.91, score: 4, direction: "bullish", summary: "UPGRADED: $500M+ Army Paladin howitzer contract (Feb 27). European NATO re-arming supercycle. Iran strikes = allied rearmament acceleration. Front-line states accelerating spending. +16.29% in 10-day backtest." },
    { ticker: "MRCY", company: "Mercury Systems", price: 89.03, dayChange: -0.61, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. Iran crisis = accelerated Patriot/F-35 procurement." },
    { ticker: "BA", company: "Boeing", price: 227.53, dayChange: -0.82, score: 2, direction: "neutral", summary: "F-47 NGAD win. CCA weapon integration testing begun (YFQ-44A inert AIM-120 Feb 23). BUT commercial crisis, high leverage." },
    { ticker: "LDOS", company: "Leidos Holdings", price: 175.10, dayChange: -0.43, score: 2, direction: "neutral", summary: "DOGE risk materializing. Navy NGEN. DOGE cuts hitting IT services." },
    { ticker: "FTNT", company: "Fortinet", price: 79.03, dayChange: -0.21, score: 1, direction: "neutral", summary: "OT/ICS security growth. Google-Wiz deal ($32B) competitive threat. Chinese/Iranian APTs targeting defense industry (Feb 17 Dragos report)." },
    { ticker: "CRWD", company: "CrowdStrike", price: 371.98, dayChange: -2.39, score: 0, direction: "bearish", summary: "DOWNGRADED TO EXCLUDED: Earnings miss — stock -9.85% Feb 23. Execution failure. Moved to excluded on negative momentum despite persistent cyber demand." },
    { ticker: "JOBY", company: "Joby Aviation", price: 10.06, dayChange: -1.66, score: 1, direction: "neutral", summary: "Military logistics potential. But pre-revenue, limited defense utility." },
    { ticker: "ACHR", company: "Archer Aviation", price: 7.12, dayChange: -3.52, score: 0, direction: "neutral", summary: "Limited defense utility. eVTOL speculation." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 148.92, dayChange: -0.32, score: -1, direction: "bearish", summary: "Platformization headwinds. Near 52-week low. Google-Wiz deal pressuring valuation. APT competition heating." },
    { ticker: "SAIC", company: "Science Applications", price: 92.26, dayChange: 0.61, score: -2, direction: "bearish", summary: "$95M GAO IT modernization contract win (Feb 27). Still DOGE-exposed but new contract provides some cushion. Upgrading from -3 to -2." },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 78.83, dayChange: -1.18, score: -3, direction: "bearish", summary: "DOGE devastation offset: $697M Army MCTP training contract win (Feb 27). Active combat operations = surge in training/simulation demand. But still DOGE-exposed on civil side. Upgrading from -5 to -3 on new contract." }
];

// === SIGNALS FEED DATA ===
const signalsFeedData = [ ... omitted ... ]