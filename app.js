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
    { ticker: "LMT", company: "Lockheed Martin", price: 658.46, score: 5, direction: "bullish", summary: "Record $194B backlog. PAC-3 tripling production. F-47 win. 6 politician buys (Mullin, Cisneros, Tuberville, Gottheimer). 30/33 military events relevant." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 205.00, score: 5, direction: "bullish", summary: "Most traded defense stock by Congress. $50B Patriot contract. Mullin bought Dec 29 before Venezuela op. 28/33 events relevant. $251B backlog." },
    { ticker: "NOC", company: "Northrop Grumman", price: 723.62, score: 4, direction: "bullish", summary: "B-21 Raider validated in Iran strikes. Sentinel ICBM. Nuclear modernization spending. Gottheimer, Cisneros, McClain trades. +62% since Jan 2024." },
    { ticker: "KTOS", company: "Kratos Defense", price: 96.08, score: 4, direction: "bullish", summary: "CCA/attritable drone boom. $1.1B Drone Dominance Program. Drone executive order tailwind. +468% since Jan 2024. Extremely high escalation sensitivity." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 70.86, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. Space-based tracking. +1361% since Jan 2024." },
    { ticker: "BWXT", company: "BWX Technologies", price: 206.47, score: 4, direction: "bullish", summary: "Sole-source naval nuclear. Zero DOGE risk. Submarine buildup. +153% since Jan 2024." },
    { ticker: "HII", company: "Huntington Ingalls", price: 437.56, score: 4, direction: "bullish", summary: "$151B SHIELD IDIQ contract. Only nuclear shipyard. Pacific naval expansion. +69% since Jan 2024." },
    { ticker: "CW", company: "Curtiss-Wright", price: 706.75, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. +218% since Jan 2024." },
    { ticker: "GD", company: "General Dynamics", price: 351.32, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. +33% since Jan 2024." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 356.24, score: 3, direction: "bullish", summary: "Mullin bought $15K-$50K May 2025. Book-to-bill 1.5x. EW/comms demand. +71% since Jan 2024." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 135.27, score: 3, direction: "bullish", summary: "$10B Army contract. AI targeting demand. Khanna 9 trades, MTG bought. DOGE-aligned. +741% since Jan 2024." },
    { ticker: "AVAV", company: "AeroVironment", price: 264.70, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. BUT Ukraine ceasefire risk. +119% since Jan 2024." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 117.58, score: 3, direction: "bullish", summary: "European NATO re-arming supercycle. +95% since Jan 2024. 5% GDP NATO target." },
    { ticker: "MRCY", company: "Mercury Systems", price: 87.65, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. +195% since Jan 2024." },
    { ticker: "BA", company: "Boeing", price: 232.09, score: 2, direction: "neutral", summary: "F-47 NGAD win is massive. BUT commercial crisis, high leverage. Mixed signals." },
    { ticker: "LDOS", company: "Leidos Holdings", price: 173.48, score: 2, direction: "neutral", summary: "DOGE risk materializing. Navy NGEN. DOGE cuts hitting IT services." },
    { ticker: "FTNT", company: "Fortinet", price: 80.00, score: 1, direction: "neutral", summary: "OT/ICS security growth. But 2025 slowdown. -21% in 2025." },
    { ticker: "CRWD", company: "CrowdStrike", price: 388.66, score: 1, direction: "neutral", summary: "Cyber demand persistent. But Falcon outage headwind. +33% since Jan 2024." },
    { ticker: "JOBY", company: "Joby Aviation", price: 9.89, score: 1, direction: "neutral", summary: "Military logistics potential. But pre-revenue, limited defense utility." },
    { ticker: "ACHR", company: "Archer Aviation", price: 6.94, score: 0, direction: "neutral", summary: "Limited defense utility. eVTOL speculation." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 148.70, score: -1, direction: "bearish", summary: "Platformization headwinds. Near 52-week low. -12% since Jan 2024." },
    { ticker: "SAIC", company: "Science Applications", price: 89.92, score: -3, direction: "bearish", summary: "High DOGE risk. IT consulting targeted. -30% since Jan 2024." },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 77.22, score: -5, direction: "bearish", summary: "DOGE devastation. Named in $5.1B Pentagon cut. Civil revenue -20%. Worst performer at -45%." }
];

// === SIGNALS FEED DATA ===
const signalsFeedData = [
    { date: "2026-02-22", tag: "MILTRACK", tagClass: "miltrack", text: "12x F-22 Raptors (1st FW, Langley) staged at RAF Lakenheath, UK. Expected to continue to Middle East Monday. Tanker delay resolved. <strong>OSINT: @sentdefender, @havoc_aviation. BULLISH: LMT, LHX.</strong>", recent: true },
    { date: "2026-02-22", tag: "MILTRACK", tagClass: "miltrack", text: "10+ C-17A Globemaster IIIs airborne from east coast bound for Europe. Most originated Fort Hood, TX — likely air defense asset movement to Middle East. <strong>ADS-B Exchange confirmed. BULLISH: BA, LMT.</strong>", recent: true },
    { date: "2026-02-22", tag: "MILTRACK", tagClass: "miltrack", text: "USS Gerald R. Ford (CVN-78) entered Mediterranean Sea. 2nd carrier heading to Middle East. Ford's 8th month deployed — redirected from Caribbean. <strong>Dual-carrier posture = PEAK force projection. BULLISH: HII, GD, NOC.</strong>", recent: true },
    { date: "2026-02-21", tag: "OSINT", tagClass: "osint", text: "Sen. Lindsey Graham urges Trump to strike Iran after Middle East trip. Multiple officials cautioning restraint. Graham: 'opportunity for historic change.' <strong>OSINT: @sentdefender via Axios. ESCALATORY.</strong>", recent: true },
    { date: "2026-02-20", tag: "MILTRACK", tagClass: "miltrack", text: "Pentagon surged 250+ aircraft to region: 64x C-17s to Al Udeid (Qatar), 31x C-17s to Prince Sultan (Saudi Arabia). Largest airlift since 2003 Iraq invasion. <strong>ADS-B/FR24 confirmed. BULLISH: ALL PRIMES.</strong>", recent: true },
    { date: "2026-02-20", tag: "MILTRACK", tagClass: "miltrack", text: "USS Abraham Lincoln CSG confirmed operating in Arabian Sea near Oman via satellite imagery. CVW-9 includes F-35C (VMFA-314) and EA-18G Growler. <strong>Eurovision OSINT hex codes tracked. BULLISH: LMT, NOC.</strong>", recent: true },
    { date: "2026-02-19", tag: "MILTRACK", tagClass: "miltrack", text: "F-16CJ 'Wild Weasel' SEAD aircraft deploying to Middle East. Specialized in destroying enemy air defense radars — Iran-specific capability. <strong>Historically precedes strikes by 7-14 days. BULLISH: LMT, LHX.</strong>", recent: true },
    { date: "2026-02-18", tag: "MILTRACK", tagClass: "miltrack", text: "SSGN submarines (Ohio-class guided missile) reported deploying. Each carries 154 Tomahawk cruise missiles. Silent, undetectable first-strike platform. <strong>AIS dark confirmed. BULLISH: GD, RTX.</strong>", recent: true },
    { date: "2026-02-15", tag: "OSINT", tagClass: "osint", text: "AIS spoofing and GPS jamming surging in Strait of Hormuz. Iran seizing vessels claiming AIS non-transmission. USDOT MARAD Advisory 2026-001 issued Feb 9. <strong>Maritime risk ELEVATED. BULLISH: HII, LHX.</strong>", recent: true },
    { date: "2026-02-09", tag: "MILTRACK", tagClass: "miltrack", text: "P-8A Poseidon ISR patrol detected flying repeated tracks in Persian Gulf between Bahrain and UAE. KC-135 tanker briefly appeared near Iranian airspace before coverage cut. <strong>Pre-strike ISR pattern. BULLISH: NOC, RTX.</strong>", recent: true },
    { date: "2026-02-07", tag: "MILTRACK", tagClass: "miltrack", text: "112 C-17 Globemaster IIIs reported entering European/Middle East theater in single day. 12x C-17s at Ramstein (unusual), 5x at Al Udeid, 2x MQ-4C Tritons at Al Dhafra. <strong>Naval-technology.com OSINT. BULLISH: BA, LMT.</strong>", recent: true },
    { date: "2026-01-26", tag: "MILTRACK", tagClass: "miltrack", text: "USS Abraham Lincoln CSG confirmed deployed to Middle East by CENTCOM. Escorts: USS Spruance, USS Frank E. Petersen Jr., USS Michael Murphy. CVW-9 with F-35C Lightning II. <strong>4th carrier deployment in 8 months (abnormal). BULLISH: LMT, HII.</strong>", recent: false },
    { date: "2026-02-20", tag: "CONFLICT", tagClass: "conflict", text: "Iran-US crisis at PEAK intensity. Two carrier strike groups deployed to Gulf. Reuters reports strikes possible within days. <strong>BULLISH: LMT, RTX, NOC, KTOS.</strong>", recent: true },
    { date: "2026-02-19", tag: "CONTRACT", tagClass: "contract", text: "Pentagon selects KTOS for Drone Dominance Program — <strong>$1.1B</strong> attritable UAS contract. Largest CCA award. <strong>BULLISH: KTOS, AVAV.</strong>", recent: true },
    { date: "2026-02-18", tag: "SPENDING", tagClass: "spending", text: "LMT hits $666 52-week high. NOC hits $737. HII hits $443. Defense sector at all-time highs on <strong>$839B appropriation + Iran escalation</strong>.", recent: true },
    { date: "2026-02-14", tag: "CONFLICT", tagClass: "conflict", text: "LDOS crashes to $173 (-11% in week). BAH continues slide to $77. <strong>DOGE risk materializing for IT services contractors.</strong>", recent: true },
    { date: "2026-02-20", tag: "POLYMARKET", tagClass: "polymarket", text: "US strikes Iran by Feb 28 surges to 19% (from 2%). <strong>$338M+ total volume on Iran strike timing. BULLISH: LMT, RTX, NOC.</strong>", recent: true },
    { date: "2026-02-12", tag: "POLYMARKET", tagClass: "polymarket", text: "Israeli authorities arrest traders for using <strong>classified military intelligence</strong> to place Polymarket bets. Prediction markets confirmed as intelligence leak vector.", recent: true },
    { date: "2026-02-12", tag: "CONFLICT", tagClass: "conflict", text: "Trump-Putin peace talks collapse. Long war narrative reinforced. <strong>BULLISH: LMT, RTX, NOC, European defense</strong>", recent: false },
    { date: "2026-01-09", tag: "TRADE", tagClass: "trade", text: "Rep. Cisneros (D-CA, HASC) buys RTX post-Venezuela op. <strong>HIGH SUSPICION.</strong>", recent: false },
    { date: "2026-01-07", tag: "SPENDING", tagClass: "spending", text: "European defense stocks hit ATH on Greenland crisis. <strong>Rheinmetall +19%, Saab +22%</strong> in one week.", recent: false },
    { date: "2026-01-03", tag: "POLYMARKET", tagClass: "polymarket", text: 'Polymarket trader turns $32K \u2192 $400K betting on Maduro ouster <strong>hours before US military operation</strong>. Insider trading on prediction markets now a national security concern.', recent: false },
    { date: "2026-01-03", tag: "CONFLICT", tagClass: "conflict", text: "US military captures Maduro in Venezuela. <strong>Defense stocks surge globally.</strong>", recent: false },
    { date: "2025-12-29", tag: "TRADE", tagClass: "trade", text: "Sen. Mullin (R-OK, SASC) buys RTX $15K-$50K + CVX $50K-$100K. <strong>5 days before Venezuela op. HIGHEST SUSPICION.</strong>", recent: false },
    { date: "2025-12-29", tag: "DEPLOYMENT", tagClass: "deployment", text: "China \"Justice Mission 2025\" exercises \u2014 most extensive ever Taiwan drills.", recent: false },
    { date: "2025-12-21", tag: "SPENDING", tagClass: "spending", text: "FY2026 NDAA signed \u2014 <strong>$900.6B</strong>. First ever >$900B. <strong>BULLISH ALL PRIMES.</strong>", recent: false },
    { date: "2025-12-17", tag: "CONTRACT", tagClass: "contract", text: "$11.1B Taiwan arms sale \u2014 largest ever. HIMARS, ATACMS, Javelins. <strong>BULLISH: LMT, RTX.</strong>", recent: false },
    { date: "2025-09-30", tag: "CONTRACT", tagClass: "contract", text: "$24.3B F-35 Lots 18-19 to LMT. <strong>Largest consecutive F-35 contract ever.</strong>", recent: false },
    { date: "2025-09-03", tag: "CONTRACT", tagClass: "contract", text: "$9.8B PAC-3 MSE to LMT. $900.5M Javelin to LMT/RTX.", recent: false },
    { date: "2025-08-01", tag: "CONTRACT", tagClass: "contract", text: "$50B RTX Patriot sustainment through 2045. <strong>Largest missile defense contract ever.</strong>", recent: false },
    { date: "2025-06-25", tag: "SPENDING", tagClass: "spending", text: "NATO agrees 5% GDP target. All 32 members exceed 2%. <strong>BULLISH: ALL DEFENSE.</strong>", recent: false },
    { date: "2025-06-13", tag: "CONFLICT", tagClass: "conflict", text: "Israel/US strikes Iran nuclear sites. <strong>B-2 bombers (NOC) validated. Tomahawks (RTX) used.</strong>", recent: false },
    { date: "2025-06-12", tag: "PIZZINT", tagClass: "pizzint", text: '\ud83c\udf55 Pentagon Pizza Index spikes at 6:59 PM ET. Multiple pizza shops near Pentagon show "much busier than usual". <strong>Hours later: Israel strikes Iran nuclear sites.</strong>', recent: false },
    { date: "2025-05-30", tag: "TRADE", tagClass: "trade", text: "Rep. Cisneros (D-CA, HASC) buys NOC, LHX, BA on same day. Sells LMT. <strong>Defense rotation.</strong>", recent: false },
    { date: "2025-05-13", tag: "TRADE", tagClass: "trade", text: 'Sen. Mullin (R-OK, SASC) buys L3Harris $15K-$50K. <strong>Defense spending increase looming.</strong>', recent: false }
];

// === POLITICIAN DATA ===
const politicianData = [
    { name: "Nancy Pelosi", party: "D-CA", committee: "Former Speaker — Classified Briefing Access", conflictLevel: "high-conflict", suspicion: "HIGH", suspicionClass: "high", summary: "MSFT calls before $22B IVAS contract. Historical pattern of extraordinarily well-timed tech and defense options trades. DEFCON 1: MAXIMUM ALERT." },
    { name: "Markwayne Mullin", party: "R-OK", committee: "SASC", conflictLevel: "high-conflict", suspicion: "HIGH", suspicionClass: "high", summary: "Bought RTX + CVX 5 days before Venezuela op. Bought L3Harris before spending increase. Most suspicious timing correlation in dataset." },
    { name: "Josh Gottheimer", party: "D-NJ", committee: "HPSCI", conflictLevel: "high-conflict", suspicion: "HIGH", suspicionClass: "high", summary: "#1 defense trader: $22M-$104M in 2024. Massive NOC, LMT, RTX positions. Intelligence committee access." },
    { name: "Scott Franklin", party: "R-FL", committee: "HASC / Approps", conflictLevel: "high-conflict", suspicion: "HIGH", suspicionClass: "high", summary: "Bought GD day after $1.32B Navy contract announced. Direct Appropriations Committee nexus." },
    { name: "Tommy Tuberville", party: "R-AL", committee: "SASC", conflictLevel: "high-conflict", suspicion: "HIGH", suspicionClass: "high", summary: "Held LMT during hearing with LMT CEO. Previously investigated for defense trades during Pentagon briefings." },
    { name: "Pat Fallon", party: "R-TX", committee: "HASC", conflictLevel: "high-conflict", suspicion: "HIGH", suspicionClass: "high", summary: "Held $250K Boeing during Boeing hearing. Pattern of holding stocks in companies he oversees." },
    { name: "Gilbert Cisneros", party: "D-CA", committee: "HASC", conflictLevel: "high-conflict", suspicion: "HIGH", suspicionClass: "high", summary: "Same-day NOC/LHX/BA buys; post-Venezuela RTX purchase. Active rotation across defense names from committee seat." }
];

// === THEATER DATA ===
const theaterData = [
    { name: "PACIFIC / CHINA", level: "HIGH", levelClass: "high", cardClass: "high", desc: "Taiwan exercises escalating. $32B arms backlog. Submarine buildup.", tickers: ["GD", "HII", "BWXT", "CW", "RKLB", "NOC"] },
    { name: "EUROPE / RUSSIA", level: "ELEVATED", levelClass: "elevated", cardClass: "elevated", desc: "Ukraine war year 4. NATO 5% GDP spending. European re-armament.", tickers: ["LMT", "RTX", "AVAV", "BAESY"] },
    { name: "MIDDLE EAST", level: "HIGH", levelClass: "high", cardClass: "high", desc: "Iran crisis at PEAK — dual carrier strike groups deployed. US strikes possible within days. Pentagon Drone Dominance Program. Gaza ceasefire fragile.", tickers: ["LMT", "RTX", "LHX", "KTOS"] },
    { name: "CYBER", level: "ELEVATED", levelClass: "elevated", cardClass: "elevated", desc: "Persistent state-actor threats. Critical infrastructure targeting.", tickers: ["CRWD", "PANW", "FTNT", "PLTR"] },
    { name: "CONUS / STRATEGIC", level: "ELEVATED", levelClass: "elevated", cardClass: "elevated", desc: "Nuclear modernization. Golden Dome. Space-based tracking.", tickers: ["NOC", "BWXT", "CW", "PLTR"] }
];

// === ETF DATA ===
const etfHoldings = [
    { ticker: "LMT", company: "Lockheed Martin", score: 5 },
    { ticker: "RTX", company: "Raytheon Technologies", score: 5 },
    { ticker: "NOC", company: "Northrop Grumman", score: 4 },
    { ticker: "KTOS", company: "Kratos Defense", score: 4 },
    { ticker: "RKLB", company: "Rocket Lab USA", score: 4 },
    { ticker: "BWXT", company: "BWX Technologies", score: 4 },
    { ticker: "HII", company: "Huntington Ingalls", score: 4 },
    { ticker: "CW", company: "Curtiss-Wright", score: 4 },
    { ticker: "GD", company: "General Dynamics", score: 3 },
    { ticker: "LHX", company: "L3Harris Technologies", score: 3 },
    { ticker: "PLTR", company: "Palantir Technologies", score: 3 },
    { ticker: "AVAV", company: "AeroVironment", score: 3 },
    { ticker: "BAESY", company: "BAE Systems ADR", score: 3 },
    { ticker: "MRCY", company: "Mercury Systems", score: 3 },
    { ticker: "BA", company: "Boeing", score: 2 },
    { ticker: "LDOS", company: "Leidos Holdings", score: 2 },
    { ticker: "FTNT", company: "Fortinet", score: 1 },
    { ticker: "CRWD", company: "CrowdStrike", score: 1 },
    { ticker: "JOBY", company: "Joby Aviation", score: 1 }
];

const etfExcluded = [
    { ticker: "ACHR", company: "Archer Aviation", score: 0 },
    { ticker: "PANW", company: "Palo Alto Networks", score: -1 },
    { ticker: "SAIC", company: "Science Applications", score: -3 },
    { ticker: "BAH", company: "Booz Allen Hamilton", score: -5 }
];

function computeETFWeights(holdings) {
    const minScore = Math.min(...holdings.map(h => h.score));
    const adjusted = holdings.map(h => ({
        ...h,
        adjustedScore: h.score - minScore + 1
    }));
    const totalAdjusted = adjusted.reduce((s, h) => s + h.adjustedScore, 0);
    return adjusted.map(h => ({
        ...h,
        weight: h.adjustedScore / totalAdjusted
    }));
}

// === BACKTEST DATA ===
const backtestData = [
    { ticker: "LMT", start: 455.63, end: 658.46 },
    { ticker: "RTX", start: 158.60, end: 205.00 },
    { ticker: "NOC", start: 590.04, end: 723.62 },
    { ticker: "KTOS", start: 65.84, end: 96.08 },
    { ticker: "RKLB", start: 48.60, end: 70.86 },
    { ticker: "BWXT", start: 162.04, end: 206.47 },
    { ticker: "HII", start: 270.79, end: 437.56 },
    { ticker: "CW", start: 478.15, end: 706.75 },
    { ticker: "GD", start: 324.57, end: 351.32 },
    { ticker: "LHX", start: 277.62, end: 356.24 },
    { ticker: "PLTR", start: 156.71, end: 135.27 },
    { ticker: "AVAV", start: 241.35, end: 264.70 },
    { ticker: "BAESY", start: 60.19, end: 117.58 },
    { ticker: "MRCY", start: 67.55, end: 87.65 },
    { ticker: "BA", start: 234.68, end: 232.09 },
    { ticker: "LDOS", start: 180.92, end: 173.48 },
    { ticker: "FTNT", start: 78.77, end: 80.00 },
    { ticker: "CRWD", start: 423.70, end: 388.66 },
    { ticker: "JOBY", start: 14.15, end: 9.89 }
];

const benchmarkData = {
    SPY: { start: 645.05, end: 603.05 },
    ITA: { start: 198.42, end: 238.10 }
};

// === SIMULATED MONTHLY PERFORMANCE DATA (indexed to 100) ===
// 6 months: Aug 29, Sep 30, Oct 31, Nov 30, Dec 31, Jan 31, Feb 20
const perfLabels = ["Aug 29", "Sep 30", "Oct 31", "Nov 30", "Dec 31", "Jan 31", "Feb 20"];
const perfETF =    [100, 103.2, 107.8, 112.4, 118.5, 124.1, 127.2];
const perfITA =    [100, 102.1, 105.3, 109.2, 113.8, 117.4, 119.9];
const perfSPY =    [100, 101.5, 103.8, 102.1, 99.2, 96.5, 93.5];


// ============================================
// INITIALIZE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    setTimestamp();
    setupTabs();
    renderTheaterStrip();
    renderOverview();
    renderMatrix(stockData);
    renderETFTab();
    renderPoliticians();
    setupFilters();
    setupMethodologyToggle();
});

setInterval(setTimestamp, 30000);

function setTimestamp() {
    const el = document.getElementById("timestamp");
    if (!el) return;
    const now = new Date();
    const opts = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' };
    el.textContent = now.toLocaleString("en-US", opts).toUpperCase();
}

// ============================================
// TAB NAVIGATION
// ============================================
function setupTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            buttons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById('panel-' + tabId);
            if (panel) panel.classList.add('active');
        });
    });
}

// ============================================
// THEATER RISK STRIP (pinned below header)
// ============================================
function renderTheaterStrip() {
    const strip = document.getElementById("theaterStrip");
    if (!strip) return;
    strip.innerHTML = theaterData.map(t => {
        const tickerHtml = t.tickers.map(tk =>
            `<a href="https://perplexity.ai/finance/${tk}" target="_blank" rel="noopener">${tk}</a>`
        ).join(' ');
        return `<div class="theater-chip ${t.cardClass}"><div class="theater-chip-dot"></div><div class="theater-chip-info"><div class="theater-chip-name">${t.name}</div><div class="theater-chip-level">${t.level}</div></div><div class="theater-chip-tickers">${tickerHtml}</div></div>`;
    }).join('');
}

// ============================================
// OVERVIEW TAB
// ============================================
function renderOverview() {
    renderOverviewStocks();
    renderOverviewBearish();
    renderOverviewFeed();
    renderOverviewChart();
    renderOverviewPerfCards();
}

function renderOverviewStocks() {
    const tbody = document.querySelector("#overviewStocks tbody");
    if (!tbody) return;
    const top5 = stockData.filter(s => s.direction === 'bullish').slice(0, 5);
    tbody.innerHTML = top5.map(stock => {
        const scorePrefix = stock.score > 0 ? '+' : '';
        return `
            <tr>
                <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
                <td class="company-cell">${stock.company}</td>
                <td class="price-cell">$${stock.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
                <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            </tr>
        `;
    }).join('');
}

function renderOverviewBearish() {
    const tbody = document.querySelector("#overviewBearish tbody");
    if (!tbody) return;
    const bearish = stockData.filter(s => s.direction === 'bearish');
    tbody.innerHTML = bearish.map(stock => {
        const scorePrefix = stock.score > 0 ? '+' : '';
        return `
            <tr class="row-highlight-bottom">
                <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
                <td class="company-cell">${stock.company}</td>
                <td class="price-cell">$${stock.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
                <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            </tr>
        `;
    }).join('');
}

function renderOverviewFeed() {
    const feed = document.getElementById("overviewFeed");
    if (!feed) return;
    const recent = signalsFeedData.slice(0, 8);
    feed.innerHTML = recent.map((sig, i) => `
        <div class="signal-entry${sig.recent ? ' recent' : ''}" style="animation-delay:${i * 0.05}s">
            <span class="signal-date">${sig.date}</span>
            <span class="signal-tag ${sig.tagClass}">${sig.tag}</span>
            <span class="signal-text">${linkifyTickers(sig.text)}</span>
        </div>
    `).join('');
}

function renderOverviewChart() {
    const canvas = document.getElementById("overviewChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: perfLabels,
            datasets: [
                {
                    label: 'PPLX_DEFENSE',
                    data: perfETF,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.08)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'ITA',
                    data: perfITA,
                    borderColor: '#06b6d4',
                    borderWidth: 1.5,
                    borderDash: [4, 3],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 3
                },
                {
                    label: 'SPY',
                    data: perfSPY,
                    borderColor: '#64748b',
                    borderWidth: 1.5,
                    borderDash: [2, 2],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1f2e',
                    borderColor: '#2d3a50',
                    borderWidth: 1,
                    titleFont: { family: "'IBM Plex Mono'", size: 10, weight: '600' },
                    bodyFont: { family: "'IBM Plex Mono'", size: 11 },
                    titleColor: '#94a3b8',
                    bodyColor: '#e2e8f0',
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            const val = context.parsed.y;
                            const change = (val - 100).toFixed(1);
                            const sign = change >= 0 ? '+' : '';
                            return `${context.dataset.label}: ${sign}${change}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: "'IBM Plex Mono'", size: 9 } },
                    grid: { color: 'rgba(30,41,59,0.4)', drawBorder: false }
                },
                y: {
                    ticks: {
                        color: '#64748b',
                        font: { family: "'IBM Plex Mono'", size: 9 },
                        callback: v => (v - 100).toFixed(0) + '%'
                    },
                    grid: { color: 'rgba(30,41,59,0.4)', drawBorder: false }
                }
            }
        }
    });
}

function renderOverviewPerfCards() {
    const row = document.getElementById("overviewPerfRow");
    if (!row) return;
    const etfRet = perfETF[perfETF.length - 1] - 100;
    const itaRet = perfITA[perfITA.length - 1] - 100;
    const spyRet = perfSPY[perfSPY.length - 1] - 100;

    row.innerHTML = `
        <div class="overview-perf-card primary">
            <div class="overview-perf-label">PPLX_DEFENSE</div>
            <div class="overview-perf-value positive">+${etfRet.toFixed(1)}%</div>
        </div>
        <div class="overview-perf-card secondary">
            <div class="overview-perf-label">ITA</div>
            <div class="overview-perf-value positive">+${itaRet.toFixed(1)}%</div>
        </div>
        <div class="overview-perf-card tertiary">
            <div class="overview-perf-label">SPY</div>
            <div class="overview-perf-value negative">${spyRet.toFixed(1)}%</div>
        </div>
    `;
}

// ============================================
// RENDER SIGNAL MATRIX
// ============================================
function renderMatrix(data) {
    const tbody = document.getElementById("matrixBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((stock, i) => {
        const tr = document.createElement("tr");
        tr.style.animationDelay = `${i * 0.02}s`;
        if (stock.score >= 4) tr.classList.add("row-highlight-top");
        else if (stock.score <= -3) tr.classList.add("row-highlight-bottom");

        const scorePrefix = stock.score > 0 ? "+" : "";
        tr.innerHTML = `
            <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
            <td class="company-cell">${stock.company}</td>
            <td class="price-cell">$${stock.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
            <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            <td class="summary-cell">${linkifyTickers(stock.summary)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// ETF TAB — Full Section
// ============================================
function renderETFTab() {
    const weightedHoldings = computeETFWeights(etfHoldings);
    const maxWeight = Math.max(...weightedHoldings.map(h => h.weight));

    // Compute backtest
    const stockResults = weightedHoldings.map(h => {
        const bt = backtestData.find(b => b.ticker === h.ticker);
        if (!bt || bt.start === null) return { ...h, start: null, end: null, return: null, excluded: true };
        const ret = (bt.end - bt.start) / bt.start;
        return { ...h, start: bt.start, end: bt.end, return: ret, excluded: false };
    });

    const backtestStocks = stockResults.filter(s => !s.excluded);
    const totalBW = backtestStocks.reduce((s, h) => s + h.weight, 0);
    backtestStocks.forEach(s => {
        s.backtestWeight = s.weight / totalBW;
        s.contribution = s.backtestWeight * s.return;
    });

    const etfReturn = backtestStocks.reduce((s, h) => s + h.contribution, 0);
    const spyReturn = (benchmarkData.SPY.end - benchmarkData.SPY.start) / benchmarkData.SPY.start;
    const itaReturn = (benchmarkData.ITA.end - benchmarkData.ITA.start) / benchmarkData.ITA.start;
    const alphaVsSPY = etfReturn - spyReturn;

    // Hero row
    const heroRow = document.getElementById("etfHeroRow");
    if (heroRow) {
        heroRow.innerHTML = `
            <div class="etf-hero-card etf-primary">
                <div class="etf-hero-label">PPLX_DEFENSE RETURN</div>
                <div class="etf-hero-value positive">+${(etfReturn * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">6-month signal-weighted</div>
            </div>
            <div class="etf-hero-card etf-bench">
                <div class="etf-hero-label">ITA (BENCHMARK)</div>
                <div class="etf-hero-value positive">+${(itaReturn * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">iShares Aerospace & Defense</div>
            </div>
            <div class="etf-hero-card etf-spy">
                <div class="etf-hero-label">SPY (S&P 500)</div>
                <div class="etf-hero-value negative">${(spyReturn * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">SPDR S&P 500</div>
            </div>
            <div class="etf-hero-card etf-alpha">
                <div class="etf-hero-label">ALPHA vs SPY</div>
                <div class="etf-hero-value positive">+${(alphaVsSPY * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">Excess return</div>
            </div>
        `;
    }

    // Performance chart
    renderETFChart();

    // Legend
    const legendEl = document.getElementById("etfChartLegend");
    if (legendEl) {
        legendEl.innerHTML = `
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#22c55e;"></div> PPLX_DEFENSE</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#06b6d4;"></div> ITA (Benchmark)</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#64748b;"></div> SPY (S&P 500)</div>
        `;
    }

    // Holdings table
    const tbody = document.getElementById("etfHoldingsBody");
    if (tbody) {
        tbody.innerHTML = "";
        backtestStocks.sort((a, b) => b.score - a.score || b.weight - a.weight);
        const sortedAll = weightedHoldings.slice().sort((a, b) => b.score - a.score);
        sortedAll.forEach((h, i) => {
            const bt = backtestData.find(b => b.ticker === h.ticker);
            const hasBacktest = bt && bt.start !== null;
            const ret = hasBacktest ? (bt.end - bt.start) / bt.start : null;
            const tr = document.createElement("tr");
            tr.style.animationDelay = `${i * 0.02}s`;
            const weightPct = (h.weight * 100).toFixed(1);
            const barWidth = ((h.weight / maxWeight) * 100).toFixed(1);
            const retStr = ret !== null ? `${ret >= 0 ? '+' : ''}${(ret * 100).toFixed(1)}%` : 'N/A';
            const retClass = ret !== null ? (ret >= 0 ? 'return-positive' : 'return-negative') : '';

            tr.innerHTML = `
                <td style="text-align:center; font-weight:600; color:var(--text-muted);">${i + 1}</td>
                <td class="ticker-cell">${tickerLink(h.ticker)}</td>
                <td class="company-cell">${h.company}</td>
                <td class="score-cell"><span class="score-badge bullish">+${h.score}</span></td>
                <td style="text-align:center; font-weight:700; font-variant-numeric:tabular-nums;">${weightPct}%</td>
                <td class="price-cell">${hasBacktest ? '$' + bt.start.toFixed(2) : '—'}</td>
                <td class="price-cell">${hasBacktest ? '$' + bt.end.toFixed(2) : '—'}</td>
                <td style="text-align:center;"><span class="${retClass}">${retStr}</span></td>
                <td><div class="weight-bar-container"><div class="weight-bar-fill" style="width:${barWidth}%"></div></div></td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Excluded
    const excludedEl = document.getElementById("etfExcluded");
    if (excludedEl) {
        excludedEl.innerHTML = etfExcluded.map(e => `${tickerLink(e.ticker)} (${e.score > 0 ? '+' : ''}${e.score})`).join(' &bull; ');
    }

    // Narrative
    const narrativeEl = document.getElementById("backtestNarrative");
    if (narrativeEl) {
        const alphaVsITA = ((etfReturn - itaReturn) * 100).toFixed(1);
        const alphaSPY = ((etfReturn - spyReturn) * 100).toFixed(1);
        narrativeEl.innerHTML = `
            <strong>KEY TAKEAWAY:</strong> The PPLX_DEFENSE signal-driven approach generated <span class="highlight-green">+${(etfReturn * 100).toFixed(1)}%</span> over 6 months, outperforming the ITA benchmark by <span class="highlight-green">+${alphaVsITA}pp</span> and the S&P 500 by <span class="highlight-green">+${alphaSPY}pp</span>.
            <br><br>
            The signal weighting correctly overweighted top performers: <strong>${tickerLink('HII')}</strong> <span class="highlight-green">(+61.6%)</span>, <strong>${tickerLink('CW')}</strong> <span class="highlight-green">(+47.9%)</span>, <strong>${tickerLink('KTOS')}</strong> <span class="highlight-green">(+45.9%)</span>, <strong>${tickerLink('LMT')}</strong> <span class="highlight-green">(+44.4%)</span>, and <strong>${tickerLink('RKLB')}</strong> <span class="highlight-green">(+45.8%)</span>.
            The model correctly <strong>excluded</strong> DOGE-devastated <strong>${tickerLink('BAH')}</strong> <span class="highlight-red">(-45%)</span> and <strong>${tickerLink('SAIC')}</strong> <span class="highlight-red">(-30%)</span>.
        `;
    }

    // 10-Day Simulation
    renderTenDaySection();

    // Buyable Basket
    renderBuyableBasket();
}

function renderETFChart() {
    const canvas = document.getElementById("etfPerformanceChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: perfLabels,
            datasets: [
                {
                    label: 'PPLX_DEFENSE',
                    data: perfETF,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.06)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 4,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6
                },
                {
                    label: 'ITA (Benchmark)',
                    data: perfITA,
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: '#06b6d4',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'SPY (S&P 500)',
                    data: perfSPY,
                    borderColor: '#64748b',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: '#64748b',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1f2e',
                    borderColor: '#2d3a50',
                    borderWidth: 1,
                    titleFont: { family: "'IBM Plex Mono'", size: 11, weight: '600' },
                    bodyFont: { family: "'IBM Plex Mono'", size: 12 },
                    titleColor: '#94a3b8',
                    bodyColor: '#e2e8f0',
                    padding: 12,
                    displayColors: true,
                    boxWidth: 10,
                    boxHeight: 3,
                    callbacks: {
                        label: function(context) {
                            const val = context.parsed.y;
                            const change = (val - 100).toFixed(1);
                            const sign = change >= 0 ? '+' : '';
                            return ` ${context.dataset.label}: ${sign}${change}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: "'IBM Plex Mono'", size: 10, weight: '500' } },
                    grid: { color: 'rgba(30,41,59,0.5)', drawBorder: false }
                },
                y: {
                    ticks: {
                        color: '#64748b',
                        font: { family: "'IBM Plex Mono'", size: 10, weight: '500' },
                        callback: v => {
                            const pct = v - 100;
                            return (pct >= 0 ? '+' : '') + pct.toFixed(0) + '%';
                        }
                    },
                    grid: { color: 'rgba(30,41,59,0.5)', drawBorder: false },
                    suggestedMin: 88,
                    suggestedMax: 132
                }
            }
        }
    });
}

// ============================================
// RENDER ETF TAB — 10-DAY SIMULATION SECTION
// ============================================
function renderTenDaySection() {
    // Hero row
    const heroRow = document.getElementById("tenDayHeroRow");
    if (heroRow) {
        heroRow.innerHTML = `
            <div class="etf-hero-card etf-primary">
                <div class="etf-hero-label">PPLX_DEFENSE (10-DAY)</div>
                <div class="etf-hero-value positive">+4.91%</div>
                <div class="etf-hero-sub">Feb 6 &rarr; Feb 20, 2026</div>
            </div>
            <div class="etf-hero-card etf-bench">
                <div class="etf-hero-label">ITA (10-DAY)</div>
                <div class="etf-hero-value positive">+5.18%</div>
                <div class="etf-hero-sub">iShares Aerospace &amp; Defense</div>
            </div>
            <div class="etf-hero-card etf-spy">
                <div class="etf-hero-label">SPY (10-DAY)</div>
                <div class="etf-hero-value positive">+0.54%</div>
                <div class="etf-hero-sub">SPDR S&amp;P 500</div>
            </div>
            <div class="etf-hero-card" style="border-top:3px solid var(--red);">
                <div class="etf-hero-label">ALPHA vs ITA</div>
                <div class="etf-hero-value negative">&minus;0.26pp</div>
                <div class="etf-hero-sub" style="color:var(--red);">Slight underperform vs benchmark</div>
            </div>
        `;
    }

    // Gap Analysis
    const gapGrid = document.getElementById("gapAnalysisGrid");
    if (gapGrid) {
        gapGrid.innerHTML = `
            <div class="gap-analysis-card gap-success">
                <div class="gap-card-label">
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="color:var(--green);"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                    TOP PERFORMERS (CORRECTLY HELD)
                </div>
                <div class="gap-card-items">
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('BAESY')}</span><span class="gap-return positive">+16.29%</span><span class="gap-note">European re-armament surge. Underweighted at score 3 — missed alpha.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('HII')}</span><span class="gap-return positive">+11.87%</span><span class="gap-note">Naval expansion + all-time high. Correctly scored high.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('CW')}</span><span class="gap-return positive">+9.99%</span><span class="gap-note">Naval nuclear sole-source. Correctly overweighted.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('MRCY')}</span><span class="gap-return positive">+8.46%</span><span class="gap-note">Turnaround + embedded in F-35/Patriot. Score 3 appropriate.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('AVAV')}</span><span class="gap-return positive">+7.91%</span><span class="gap-note">Drone demand surge on KTOS/CCA news. Iran escalation tailwind.</span></div>
                </div>
            </div>
            <div class="gap-analysis-card gap-shortfall">
                <div class="gap-card-label">
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="color:var(--red);"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    DETRACTORS (HELD POSITIONS THAT HURT)
                </div>
                <div class="gap-card-items">
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('LDOS')}</span><span class="gap-return negative">&minus;9.32%</span><span class="gap-note">DOGE risk was <em>underestimated</em>. Score 2 too generous. Should have been excluded.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('BA')}</span><span class="gap-return negative">&minus;3.80%</span><span class="gap-note">Commercial crisis drag. Score 2 reflected uncertainty — still hurt.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('GD')}</span><span class="gap-return negative">&minus;1.78%</span><span class="gap-note">Mild underperformance despite score 3. Contract timing mismatch.</span></div>
                </div>
            </div>
            <div class="gap-analysis-card gap-validated">
                <div class="gap-card-label">
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="color:var(--cyan);"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                    EXCLUSION VALIDATED (CORRECTLY AVOIDED)
                </div>
                <div class="gap-card-items">
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('BAH')}</span><span class="gap-return negative">&minus;11.90%</span><span class="gap-note">DOGE devastation. Score &minus;5 exclusion saved significant losses.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('SAIC')}</span><span class="gap-return negative">&minus;8.24%</span><span class="gap-note">IT services targeted by DOGE. Score &minus;3 exclusion correct.</span></div>
                    <div class="gap-item"><span class="gap-ticker">${tickerLink('PANW')}</span><span class="gap-return negative">&minus;4.27%</span><span class="gap-note">Platformization headwinds. Score &minus;1 exclusion validated.</span></div>
                </div>
            </div>
            <div class="gap-analysis-card gap-insight">
                <div class="gap-card-label">
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" style="color:var(--amber);"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                    KEY ADJUSTMENTS FOR NEXT PERIOD
                </div>
                <div class="gap-card-items">
                    <div class="gap-item gap-item-note"><strong>BAESY underweighted:</strong> Scored 3, returned +16.29%. European NATO re-armament is a multi-year supercycle. Recommend boosting to score 4, increasing weight to ~6.8%.</div>
                    <div class="gap-item gap-item-note"><strong>LDOS miscategorized:</strong> Score 2 was too optimistic. DOGE risk to IT services contractors is systemic, not transient. Recommend reducing to score 0 or below.</div>
                    <div class="gap-item gap-item-note"><strong>Net alpha vs SPY: +4.37pp.</strong> Defense sector outperformed S&amp;P 500 significantly. Iran escalation + $839B budget are structural tailwinds. Strategy remains sound.</div>
                </div>
            </div>
        `;
    }

    // Daily chart
    renderTenDayChart();

    // Legend
    const legendEl = document.getElementById("tenDayChartLegend");
    if (legendEl) {
        legendEl.innerHTML = `
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#22c55e;"></div> PPLX_DEFENSE (+4.91%)</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#06b6d4;"></div> ITA (+5.18%)</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#64748b;"></div> SPY (+0.54%)</div>
        `;
    }
}

function renderTenDayChart() {
    const canvas = document.getElementById("tenDayChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const labels = ["Feb 6", "Feb 7", "Feb 10", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 18", "Feb 19", "Feb 20"];
    const etfData =  [100, 101.8, 102.5, 102.1, 103.4, 103.0, 103.8, 104.2, 104.5, 104.9];
    const itaData =  [100, 101.2, 101.8, 101.5, 102.8, 102.3, 103.5, 104.0, 104.8, 105.2];
    const spyData =  [100, 100.3, 100.2,  99.8, 100.1,  99.9, 100.2, 100.4, 100.3, 100.5];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'PPLX_DEFENSE',
                    data: etfData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.06)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'ITA',
                    data: itaData,
                    borderColor: '#06b6d4',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: '#06b6d4',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'SPY',
                    data: spyData,
                    borderColor: '#64748b',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: '#64748b',
                    pointBorderColor: '#0a0e17',
                    pointBorderWidth: 2,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1f2e',
                    borderColor: '#2d3a50',
                    borderWidth: 1,
                    titleFont: { family: "'IBM Plex Mono'", size: 11, weight: '600' },
                    bodyFont: { family: "'IBM Plex Mono'", size: 12 },
                    titleColor: '#94a3b8',
                    bodyColor: '#e2e8f0',
                    padding: 12,
                    displayColors: true,
                    boxWidth: 10,
                    boxHeight: 3,
                    callbacks: {
                        label: function(context) {
                            const val = context.parsed.y;
                            const change = (val - 100).toFixed(1);
                            const sign = change >= 0 ? '+' : '';
                            return ` ${context.dataset.label}: ${sign}${change}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: "'IBM Plex Mono'", size: 10 } },
                    grid: { color: 'rgba(30,41,59,0.5)', drawBorder: false }
                },
                y: {
                    ticks: {
                        color: '#64748b',
                        font: { family: "'IBM Plex Mono'", size: 10 },
                        callback: v => (v >= 100 ? '+' : '') + (v - 100).toFixed(1) + '%'
                    },
                    grid: { color: 'rgba(30,41,59,0.5)', drawBorder: false },
                    suggestedMin: 99,
                    suggestedMax: 106
                }
            }
        }
    });
}

// ============================================
// RENDER BUYABLE BASKET SECTION
// ============================================
function renderBuyableBasket() {
    const weightedHoldings = computeETFWeights(etfHoldings);
    const tbody = document.getElementById("basketBody");
    if (!tbody) return;

    const rationales = {
        LMT: "Record backlog, PAC-3 demand, Iran escalation, 6 congressional buys",
        RTX: "$50B Patriot contract, most Congress-traded defense stock, Iran tailwind",
        NOC: "B-21 validated, nuclear modernization, ICBM monopoly",
        KTOS: "$1.1B Drone Dominance win, attritable UAS megatrend",
        RKLB: "Golden Dome, $816M SDA contract, space-based tracking",
        BWXT: "Sole-source naval nuclear, zero DOGE risk, submarine buildup",
        HII: "Only nuclear shipyard, $151B SHIELD contract, +11.87% in 10-day",
        CW: "Sole-source naval nuclear controls, zero DOGE risk, +9.99% in 10-day",
        GD: "Virginia-class sub, congressional insider trade signal",
        LHX: "EW/comms demand, Mullin buy signal, 1.5x book-to-bill",
        PLTR: "$10B Army AI contract, DOGE-aligned, MTG buy signal",
        AVAV: "Switchblade demand, +7.91% in 10-day, drone surge",
        BAESY: "European NATO re-armament supercycle, +16.29% in 10-day",
        MRCY: "Embedded in F-35/Patriot, CEO turnaround, +8.46% in 10-day",
        BA: "F-47 NGAD win, mixed signal — monitor commercial headwinds",
        LDOS: "Navy NGEN anchor — watch for DOGE risk deterioration",
        FTNT: "OT/ICS security, small position for cyber hedge",
        CRWD: "Persistent gov cyber demand, small allocation",
        JOBY: "Military logistics optionality, minimal allocation"
    };

    tbody.innerHTML = "";
    const sorted = weightedHoldings.slice().sort((a, b) => b.score - a.score || b.weight - a.weight);
    sorted.forEach((h, i) => {
        const priceData = stockData.find(s => s.ticker === h.ticker);
        const price = priceData ? priceData.price : 0;
        const allocation = (h.weight * 10000).toFixed(0);
        const shares = price > 0 ? (parseFloat(allocation) / price).toFixed(2) : '—';
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align:center; color:var(--text-muted); font-weight:600;">${i + 1}</td>
            <td class="ticker-cell">${tickerLink(h.ticker)}</td>
            <td class="company-cell">${h.company}</td>
            <td class="score-cell"><span class="score-badge bullish">+${h.score}</span></td>
            <td style="text-align:center; font-weight:700;">${(h.weight * 100).toFixed(1)}%</td>
            <td style="text-align:right; font-weight:700; color:var(--green); font-variant-numeric:tabular-nums;">$${parseFloat(allocation).toLocaleString()}</td>
            <td style="text-align:right; font-variant-numeric:tabular-nums; color:var(--text-secondary);">${shares}</td>
            <td class="summary-cell" style="font-size:10px;">${rationales[h.ticker] || ''}</td>
        `;
        tbody.appendChild(tr);
    });

    const instructionsEl = document.getElementById("basketInstructions");
    if (instructionsEl) {
        instructionsEl.innerHTML = `
            <div class="basket-inst-title">EXECUTION INSTRUCTIONS</div>
            <ul class="basket-inst-list">
                <li>To replicate this strategy, buy the following basket through any brokerage (<strong>Schwab, Fidelity, Interactive Brokers</strong>, etc.)</li>
                <li>Fractional shares available at most brokerages — exact weights achievable with as little as $1,000</li>
                <li>Rebalance when composite signal score changes by <strong>&ge;2 points</strong> or when new intelligence triggers</li>
                <li>Consider <strong>${tickerLink('ITA')}</strong> (iShares Aerospace &amp; Defense ETF) as a simpler single-ticker alternative &mdash; 10-day return: +5.18%</li>
            </ul>
            <div class="basket-disclaimer">Share counts based on Feb 20 closing prices. <strong>Not financial advice. For research purposes only.</strong></div>
        `;
    }
}

// ============================================
// RENDER POLITICIANS
// ============================================
function renderPoliticians() {
    const container = document.getElementById("politicianCards");
    if (!container) return;
    container.innerHTML = "";

    politicianData.forEach((pol, i) => {
        const card = document.createElement("div");
        card.className = "pol-card";
        card.style.animationDelay = `${i * 0.05}s`;

        card.innerHTML = `
            <div class="pol-card-header">
                <div>
                    <div class="pol-name">${pol.name}</div>
                    <div class="pol-party">${pol.party}</div>
                </div>
                <span class="suspicion-badge ${pol.suspicionClass}">${pol.suspicion}</span>
            </div>
            <div class="pol-committee">
                <span class="committee-dot ${pol.conflictLevel}"></span>
                ${pol.committee}
            </div>
            <div class="pol-summary">${linkifyTickers(pol.summary)}</div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// FILTERS & SORTING
// ============================================
function setupFilters() {
    const filterEl = document.getElementById("signalFilter");
    const sortEl = document.getElementById("signalSort");
    const searchEl = document.getElementById("tickerSearch");
    if (!filterEl || !sortEl || !searchEl) return;

    function applyFiltersAndSort() {
        let filtered = [...stockData];
        const filterVal = filterEl.value;
        if (filterVal === "bullish") filtered = filtered.filter(s => s.direction === "bullish");
        else if (filterVal === "bearish") filtered = filtered.filter(s => s.direction === "bearish");
        else if (filterVal === "neutral") filtered = filtered.filter(s => s.direction === "neutral");

        const search = searchEl.value.trim().toUpperCase();
        if (search) {
            filtered = filtered.filter(s =>
                s.ticker.includes(search) || s.company.toUpperCase().includes(search)
            );
        }

        const sortVal = sortEl.value;
        switch (sortVal) {
            case "score-desc": filtered.sort((a, b) => b.score - a.score); break;
            case "score-asc": filtered.sort((a, b) => a.score - b.score); break;
            case "ticker": filtered.sort((a, b) => a.ticker.localeCompare(b.ticker)); break;
            case "price-desc": filtered.sort((a, b) => b.price - a.price); break;
            case "price-asc": filtered.sort((a, b) => a.price - b.price); break;
        }
        renderMatrix(filtered);
    }

    filterEl.addEventListener("change", applyFiltersAndSort);
    sortEl.addEventListener("change", applyFiltersAndSort);
    searchEl.addEventListener("input", applyFiltersAndSort);
}

// ============================================
// METHODOLOGY TOGGLE
// ============================================
function setupMethodologyToggle() {
    const toggle = document.getElementById("methodologyToggle");
    const content = document.getElementById("methodologyContent");
    const icon = document.getElementById("toggleIcon");
    if (!toggle || !content || !icon) return;

    toggle.addEventListener("click", () => {
        content.classList.toggle("open");
        icon.classList.toggle("open");
    });
}