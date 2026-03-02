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
    { ticker: "LMT", company: "Lockheed Martin", price: 676.70, dayChange: 22.07, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: F-35/F-22 engaged in Iran strikes. PAC-3 intercepting Iranian missiles. Record $194B backlog. Morningstar: defense becoming subscription model. F-47 win. $480M Navy ASW contract. 6 politician buys. Expect significant Monday gap up." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 212.16, dayChange: 9.54, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Tomahawk missiles fired at Iran. Patriot batteries intercepting Iranian retaliation. $50B sustainment through 2045. StormBreaker approved. Most Congress-traded defense stock. Iran strikes = unprecedented Patriot/Tomahawk demand validation." },
    { ticker: "NOC", company: "Northrop Grumman", price: 768.02, dayChange: 43.64, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: B-21 Raiders engaged in Iran strikes — combat-validated for second time. Production +25% ($4.5B) in reconciliation. Midnight Hammer repeat confirmed. Sentinel ICBM. Nuclear modernization centerpiece. IDF struck 'hundreds of military sites.'" },
    { ticker: "KTOS", company: "Kratos Defense", price: 90.72, dayChange: 4.54, score: 3, direction: "neutral", summary: "DOWNGRADED: -5.90% selloff despite $12.4M CCA engine contract (Feb 23, AFA) and $1.1B Drone Dominance. Market skepticism on execution timeline. Momentum deterioration." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 70.97, dayChange: 1.87, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. SDA HALO tactical SATCOM demo ecosystem. Space-based tracking." },
    { ticker: "BWXT", company: "BWX Technologies", price: 216.47, dayChange: 10.49, score: 5, direction: "bullish", summary: "Nuclear emphasis in $153B reconciliation spend. Sole-source naval nuclear. Active carrier operations in Iran theater = accelerated nuclear submarine demand. Zero DOGE risk. Record $7.4B backlog. B-21 nuclear systems engaged." },
    { ticker: "HII", company: "Huntington Ingalls", price: 453.73, dayChange: 9.21, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Dual carrier strike groups (Ford + Lincoln) + 25-35 surface vessels engaged. CENTCOM: 'Armada fully operational.' $29B shipbuilding in reconciliation. Only nuclear shipyard. Naval assets in active combat operations." },
    { ticker: "CW", company: "Curtiss-Wright", price: 726.48, dayChange: 26.15, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. AFA Warfare Symposium acquisition reform tailwind." },
    { ticker: "GD", company: "General Dynamics", price: 364.78, dayChange: 7.73, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. SSGN deployment confirmed." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 378.48, dayChange: 13.94, score: 5, direction: "bullish", summary: "UPGRADED TO 5: Active combat operations = maximum EW/comms/sensor demand. F-22 Raptors engaged in Iran. Every aircraft in theater uses L3Harris electronic warfare and communications gear. Book-to-bill 1.5x. Iran strikes validate entire product line." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 145.13, dayChange: 7.94, score: 5, direction: "bullish", summary: "UPGRADED TO 5: OpenAI wins Pentagon AI contract after Anthropic designated 'supply-chain risk to national security.' PLTR incumbent AI/targeting platform benefits from active combat ops. Real-time battlefield intelligence demand surging. $10B Army contract." },
    { ticker: "AVAV", company: "AeroVironment", price: 208.32, dayChange: -43.93, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. Iran escalation = loitering munitions demand surge. Ukraine front stabilizing." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 119.84, dayChange: 3.84, score: 4, direction: "bullish", summary: "UPGRADED: $500M+ Army Paladin howitzer contract (Feb 27). European NATO re-arming supercycle. Iran strikes = allied rearmament acceleration. Front-line states accelerating spending. +16.29% in 10-day backtest." },
    { ticker: "MRCY", company: "Mercury Systems", price: 91.01, dayChange: 1.98, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. Iran crisis = accelerated Patriot/F-35 procurement." },
    { ticker: "BA", company: "Boeing", price: 229.74, dayChange: 2.21, score: 2, direction: "neutral", summary: "F-47 NGAD win. CCA weapon integration testing begun (YFQ-44A inert AIM-120 Feb 23). BUT commercial crisis, high leverage." },
    { ticker: "LDOS", company: "Leidos Holdings", price: 179.40, dayChange: 4.30, score: 2, direction: "neutral", summary: "DOGE risk materializing. Navy NGEN. DOGE cuts hitting IT services." },
    { ticker: "FTNT", company: "Fortinet", price: 79.18, dayChange: 0.15, score: 1, direction: "neutral", summary: "OT/ICS security growth. Google-Wiz deal ($32B) competitive threat. Chinese/Iranian APTs targeting defense industry (Feb 17 Dragos report)." },
    { ticker: "CRWD", company: "CrowdStrike", price: 384.86, dayChange: 12.88, score: 0, direction: "bearish", summary: "DOWNGRADED TO EXCLUDED: Earnings miss — stock -9.85% Feb 23. Execution failure. Moved to excluded on negative momentum despite persistent cyber demand." },
    { ticker: "JOBY", company: "Joby Aviation", price: 10.27, dayChange: 0.21, score: 1, direction: "neutral", summary: "Military logistics potential. But pre-revenue, limited defense utility." },
    { ticker: "ACHR", company: "Archer Aviation", price: 7.52, dayChange: 0.40, score: 0, direction: "neutral", summary: "Limited defense utility. eVTOL speculation." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 150.12, dayChange: 1.20, score: -1, direction: "bearish", summary: "Platformization headwinds. Near 52-week low. Google-Wiz deal pressuring valuation. APT competition heating." },
    { ticker: "SAIC", company: "Science Applications", price: 92.49, dayChange: 0.23, score: -2, direction: "bearish", summary: "$95M GAO IT modernization contract win (Feb 27). Still DOGE-exposed but new contract provides some cushion. Upgrading from -3 to -2." },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 77.81, dayChange: -1.02, score: -3, direction: "bearish", summary: "DOGE devastation offset: $697M Army MCTP training contract win (Feb 27). Active combat operations = surge in training/simulation demand. But still DOGE-exposed on civil side. Upgrading from -5 to -3 on new contract." }
];

// === SIGNALS FEED DATA ===
const signalsFeedData = [
    { date: "2026-03-01", time: "14:00", tag: "MILTRACK", tagClass: "miltrack", text: '<strong>3 US service members killed, 5 seriously wounded</strong> in Iranian retaliatory strikes on US installations in the Gulf region. CENTCOM confirms casualties from ballistic missile and drone attacks on bases in Bahrain and UAE. First US KIA since Operation Epic Fury began. <strong>TICKERS: LMT, RTX, NOC, HII, GD, LHX.</strong>', recent: true, sources: [{"name": "CENTCOM", "url": "https://www.centcom.mil/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "12:00", tag: "CYBER", tagClass: "cyber", text: 'WSJ: CENTCOM used Anthropic Claude AI during Operation Epic Fury strikes <strong>despite Anthropic being designated a \'supply-chain risk to national security\'</strong> by Pentagon. AI used for targeting analysis and battle damage assessment. Raises questions about DoD AI procurement and Anthropics classified access status. <strong>TICKERS: PLTR.</strong>', recent: true, sources: [{"name": "Wall Street Journal", "url": "https://www.wsj.com/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    // ... rest of file unchanged
];
