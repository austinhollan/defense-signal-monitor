// ============================================
// DEFENSE SIGNAL MONITOR — Application Logic
// Restructured: Theater strip, ETF chart, clean tabs
// Data as of: Feb 25, 2026 14:40 PST
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
    { ticker: "LMT", company: "Lockheed Martin", price: 647.50, score: 5, direction: "bullish", summary: "Record $194B backlog. PAC-3 tripling production. F-47 win. $480M Navy ASW contract (Feb 23). C-130J FMS RAAF deal. 6 politician buys. Stock +31% YTD." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 195.98, score: 5, direction: "bullish", summary: "StormBreaker Navy Super Hornet approval (Feb 20). Most traded defense stock by Congress. $50B Patriot contract. Iran escalation = Patriot demand surge." },
    { ticker: "NOC", company: "Northrop Grumman", price: 703.65, score: 5, direction: "bullish", summary: "UPGRADED: B-21 production +25% ($4.5B) in $153B Pentagon reconciliation. B-21 validated in Iran strikes. Sentinel ICBM. Nuclear modernization centerpiece. Analysts flagging for Midnight Hammer repeat." },
    { ticker: "KTOS", company: "Kratos Defense", price: 88.23, score: 3, direction: "neutral", summary: "DOWNGRADED: -5.90% selloff despite $12.4M CCA engine contract (Feb 23, AFA) and $1.1B Drone Dominance. Market skepticism on execution timeline. Momentum deterioration." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 70.20, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. SDA HALO tactical SATCOM demo ecosystem. Space-based tracking." },
    { ticker: "BWXT", company: "BWX Technologies", price: 208.27, score: 5, direction: "bullish", summary: "UPGRADED: Nuclear emphasis in $153B reconciliation spend. Sole-source naval nuclear. Zero DOGE risk. Record $7.4B backlog. +2.61% on day." },
    { ticker: "HII", company: "Huntington Ingalls", price: 435.58, score: 5, direction: "bullish", summary: "UPGRADED: $29B shipbuilding in $153B reconciliation — largest allocation. Only nuclear shipyard. 14 Navy vessels deployed to Iran theater. +1.84% on day." },
    { ticker: "CW", company: "Curtiss-Wright", price: 698.72, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. AFA Warfare Symposium acquisition reform tailwind." },
    { ticker: "GD", company: "General Dynamics", price: 343.14, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. SSGN deployment confirmed." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 341.05, score: 4, direction: "bullish", summary: "UPGRADED: F-22 deployment + 150 aircraft surge = elevated EW/comms demand. Book-to-bill 1.5x. Iran dual-carrier posture maximizes sensor/comm gear demand." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 134.19, score: 4, direction: "bullish", summary: "UPGRADED: Pentagon summoned Anthropic CEO — AI guardrails dispute. xAI/Google deals done. PLTR incumbent AI/targeting platform benefits. $10B Army contract." },
    { ticker: "AVAV", company: "AeroVironment", price: 255.22, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. Iran escalation = loitering munitions demand surge. Ukraine front stabilizing." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 114.80, score: 3, direction: "bullish", summary: "European NATO re-arming supercycle. Front-line states (Poland, Baltics, Finland) accelerating spending. 4th anniversary of Ukraine invasion Feb 24." },
    { ticker: "MRCY", company: "Mercury Systems", price: 89.30, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. Iran crisis = accelerated Patriot/F-35 procurement." },
    { ticker: "BA", company: "Boeing", price: 230.36, score: 2, direction: "neutral", summary: "F-47 NGAD win. CCA weapon integration testing begun (YFQ-44A inert AIM-120 Feb 23). BUT commercial crisis, high leverage." },
    { ticker: "LDOS", company: "Leidos Holdings", price: 169.89, score: 2, direction: "neutral", summary: "DOGE risk materializing. Navy NGEN. DOGE cuts hitting IT services." },
    { ticker: "FTNT", company: "Fortinet", price: 77.35, score: 1, direction: "neutral", summary: "OT/ICS security growth. Google-Wiz deal ($32B) competitive threat. Chinese/Iranian APTs targeting defense industry (Feb 17 Dragos report)." },
    { ticker: "CRWD", company: "CrowdStrike", price: 363.31, score: 0, direction: "bearish", summary: "DOWNGRADED TO EXCLUDED: Earnings miss — stock -9.85% Feb 23. Execution failure. Moved to excluded on negative momentum despite persistent cyber demand." },
    { ticker: "JOBY", company: "Joby Aviation", price: 9.82, score: 1, direction: "neutral", summary: "Military logistics potential. But pre-revenue, limited defense utility." },
    { ticker: "ACHR", company: "Archer Aviation", price: 7.10, score: 0, direction: "neutral", summary: "Limited defense utility. eVTOL speculation." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 144.84, score: -1, direction: "bearish", summary: "Platformization headwinds. Near 52-week low. Google-Wiz deal pressuring valuation. APT competition heating." },
    { ticker: "SAIC", company: "Science Applications", price: 86.79, score: -3, direction: "bearish", summary: "High DOGE risk. IT consulting targeted. Continued DOGE pressure." },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 75.11, score: -5, direction: "bearish", summary: "DOGE devastation. Named in $5.1B Pentagon cut. Civil revenue -20%. Stock -3.82% Feb 23. Worst performer." }
];

// === SIGNALS FEED DATA ===
const signalsFeedData = [
    { date: "2026-02-25", time: "17:00", tag: "MILTRACK", tagClass: "miltrack", text: 'Air Force begins weapons integration testing on Anduril YFQ-44A Fury CCA — captive carry of inert AIM-120 AMRAAM confirmed. Gen. Wilsbach: \'CCA is a critical part of a larger system-of-systems.\' Northrop names its CCA \'Talon Blue\' (YFQ-48A); GE-Kratos wins engine contract. <strong>TICKERS: KTOS, NOC, BA.</strong>', recent: true, sources: [{name: "Air Combat Command", url: "https://www.acc.af.mil/News/Article-Display/Article/4414428/collaborative-combat-aircraft-program-progresses-through-deliberate-weapons-int/"}, {name: "Defense One", url: "https://www.defenseone.com/business/2026/02/defense-business-brief-obbb-funding-counterdrone-manufacturing-and-cca-update/411673/"}] },
    { date: "2026-02-25", time: "16:30", tag: "OSINT", tagClass: "osint", text: 'Trump confirms weighing \'limited military strikes\' on Iran if Geneva talks fail Thursday. State Dept orders non-emergency departure from Beirut embassy. USS Ford joins USS Lincoln — rare dual-carrier deployment signals sustained air campaign readiness. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII.</strong>', recent: true, sources: [{name: "Washington Post", url: "https://www.washingtonpost.com/world/2026/02/25/iran-us-war-geneva-talks-nuclear/63c7f2c0-1230-11f1-8e8d-fe91db44677b_story.html"}, {name: "Indian Express", url: "https://indianexpress.com/article/world/us-news/iran-us-tensions-live-updates-trump-airstrikes-evacuations-tehran-warning-10548624/"}] },
    { date: "2026-02-25", time: "15:30", tag: "POLYMARKET", tagClass: "polymarket", text: 'UPDATED: Polymarket \'US strikes Iran by Mar 31\' now at <strong>61%</strong> ($16.8M vol). By Feb 28: 11% ($44.6M). By Jun 30: 70%. By Dec 31: 75%. Total market volume: <strong>$418M</strong>. Israel strikes Iran Feb 28: 9% ($2.4M). Strike curve steepening into Geneva talks. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "Polymarket", url: "https://polymarket.com/event/us-strikes-iran-by"}, {name: "Binance", url: "https://www.binance.com/en/square/post/02-25-2026-62-295294650196305"}] },
    { date: "2026-02-25", time: "14:00", tag: "CONTRACT", tagClass: "contract", text: 'SOSi awarded position on $100M USSOUTHCOM IDIQ for Enhanced Domain Awareness — strategic/technical services for Southern Command. Space supply chain stretch: SDA + SSC pursuing hundreds of new LEO/MEO satellites; Boeing opens new IR sensor production line. <strong>TICKERS: RKLB, NOC, BA, LMT.</strong>', recent: true, sources: [{name: "GovCon Wire", url: "https://www.govconwire.com/articles/sosi-ussouthcom-enhanced-domain-awareness"}, {name: "Breaking Defense", url: "https://breakingdefense.com/2026/02/the-space-supply-chain-is-getting-stretched-heres-how-it-could-impact-the-pentagons-plans/"}] },
    { date: "2026-02-25", time: "12:30", tag: "OSINT", tagClass: "osint", text: 'Iran accuses Trump of \'big lies\' ahead of Geneva Round 3 (Thursday). Baghaei: \'concept of limited strike does not exist — any aggression will be met with ferocious response.\' Araghchi: \'We must strike US bases.\' 15-day Trump ultimatum window narrowing. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, KTOS.</strong>', recent: true, sources: [{name: "Washington Post", url: "https://www.washingtonpost.com/world/2026/02/25/iran-us-war-geneva-talks-nuclear/63c7f2c0-1230-11f1-8e8d-fe91db44677b_story.html"}, {name: "Yahoo Finance", url: "https://finance.yahoo.com/news/trump-sets-deal-deadline-iran-123033056.html"}] },
    { date: "2026-02-25", time: "10:00", tag: "MILTRACK", tagClass: "miltrack", text: '12 F-22 Raptors land in Israel — first-ever F-22 deployment to Israel (never sold abroad due to US law). Signals serious US force posture escalation. Combined with dual-carrier deployment, 150+ aircraft surged since Feb 17. <strong>TICKERS: LMT, NOC, LHX, RTX.</strong>', recent: true, sources: [{name: "ILTV News", url: "https://www.youtube.com/watch?v=8XMc7vg0KpI"}, {name: "Indian Express", url: "https://indianexpress.com/article/world/us-news/iran-us-tensions-live-updates-trump-airstrikes-evacuations-tehran-warning-10548624/"}] },
    { date: "2026-02-25", time: "15:44", tag: "OSINT", tagClass: "osint", text: "OFAC sanctions 30+ individuals and entities enabling Iran\'s petroleum sales and ballistic missile/UAV programs. Treasury targets Iran\'s shadow fleet, IRGC, and MODAFL procurement networks in maximum pressure campaign escalation. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>", recent: true, sources: [{name: "US Treasury", url: "https://home.treasury.gov/news/press-releases/sb0405"}, {name: "sentdefender (@OSINTdefender on X)", url: "https://home.treasury.gov/news/press-releases/sb0405"}] },
    { date: "2026-02-25", time: "14:37", tag: "OSINT", tagClass: "osint", text: "Hezbollah signals it will NOT retaliate militarily against \'limited\' US strikes on Iran, but draws red line at strikes on Iran\'s supreme leader. Quote via AFP from unnamed LH official. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026667796277481704"}] },
    { date: "2026-02-25", time: "16:11", tag: "OSINT", tagClass: "osint", text: "@sentdefender assesses Iran strike as \'highly unlikely\' to be averted diplomatically: last Geneva round was \'nothing burger\' and small Iranian concessions won\'t be enough to meet US zero-enrichment redline. <strong>TICKERS: LMT, NOC, RTX, GD, LHX, KTOS.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026691641864536191"}] },
    { date: "2026-02-25", time: "15:02", tag: "OSINT", tagClass: "osint", text: "Indian PM Modi visits Israeli PM Netanyahu at the Knesset — India-Israel announce increased military cooperation including foreign military sales, as US pressures India to limit ties with adversaries. <strong>TICKERS: LMT, RTX, GD.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026674155303686223"}] },
    { date: "2026-02-25", time: "01:22", tag: "OSINT", tagClass: "osint", text: "Germany\'s Federal Foreign Office issues travel warning to Germans in Israel and Lebanon citing \'worsening security situation,\' warning of possible airspace closures — regional escalation signal. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026467914623119716"}] },
    { date: "2026-02-25", time: "03:56", tag: "OSINT", tagClass: "osint", text: "Trump SOTU Iran remarks: invokes Operation Midnight Hammer (June 2025 nuclear strike), warns Iran is \'again pursuing sinister ambitions,\' promises \'I will never allow Iran to have a nuclear weapon.\' Confirms 10-15 day ultimatum window. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, KTOS, BWXT.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026506519328469164"}, {name: "military.com", url: "https://x.com/sentdefender/status/2026506519328469164"}] },
    { date: "2026-02-25", time: "00:00", tag: "MILTRACK", tagClass: "miltrack", text: "US maintains dual aircraft carrier strike groups in Middle East with largest regional air deployment in decades; Iran delegation departs Tehran for Geneva round-3 nuclear talks scheduled Feb 26. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII, GD.</strong>", recent: true, sources: [{name: "PBS NewsHour", url: "https://www.pbs.org/newshour/world/a-timeline-of-tensions-over-irans-nuclear-program-as-talks-with-u-s-approach"}, {name: "AFP", url: "https://www.pbs.org/newshour/world/a-timeline-of-tensions-over-irans-nuclear-program-as-talks-with-u-s-approach"}] },
    { date: "2026-02-25", time: "12:00", tag: "CONTRACT", tagClass: "contract", text: "Kratos Defense (KTOS) awarded $61.07M US Navy contract modification — Lot 7 full-rate production of 70 BQM-177A subsonic aerial targets + RATO kits. Total contract value $238.8M. <strong>TICKERS: KTOS.</strong>", recent: true, sources: [{name: "Kratos Defense", url: "https://www.globenewswire.com/news-release/2026/02/25/3244552/224/en/Kratos-Awarded-61-1-Million-Navy-Contract-Modification-for-Full-Rate-Production-of-70-BQM-177A-Subsonic-Aerial-Targets-and-Equipment.html"}, {name: "GlobeNewswire", url: "https://www.globenewswire.com/news-release/2026/02/25/3244552/224/en/Kratos-Awarded-61-1-Million-Navy-Contract-Modification-for-Full-Rate-Production-of-70-BQM-177A-Subsonic-Aerial-Targets-and-Equipment.html"}] },
    { date: "2026-02-25", time: "12:00", tag: "CONTRACT", tagClass: "contract", text: "QuSecure awarded contract under Missile Defense Agency SHIELD IDIQ (ceiling $151B) for post-quantum cybersecurity capabilities across distributed defense networks.", recent: true, sources: [{name: "QuSecure", url: "https://finance.yahoo.com/news/qusecure-awarded-contract-missile-defense-130000050.html"}, {name: "Yahoo Finance", url: "https://finance.yahoo.com/news/qusecure-awarded-contract-missile-defense-130000050.html"}] },
    { date: "2026-02-25", time: "00:00", tag: "CONTRACT", tagClass: "contract", text: "Pentagon OBBB One Big Beautiful Bill reconciliation plan: $153.3B allocated across 261 subsections — $688M for long-range cruise missiles (Maritime Strike Tomahawk $198M in Q4), $5B critical minerals, CCA engine contracts to Honeywell/Kratos-GE. <strong>TICKERS: NOC, KTOS, RTX, LMT.</strong>", recent: true, sources: [{name: "Defense One", url: "https://www.defenseone.com/business/2026/02/defense-business-brief-obbb-funding-counterdrone-manufacturing-and-cca-update/411673/"}] },
    { date: "2026-02-25", time: "00:00", tag: "EARNINGS", tagClass: "spending", text: "Defense stocks sell off sharply on Iran nuclear talk progress: LMT -3.76%, NOC -4.46%, LHX -6.35%, GD -3.68%, RTX -2.59% as Iranian President Pezeshkian says \'good outcome\' anticipated from Geneva round-3. <strong>TICKERS: LMT, NOC, LHX, GD, RTX.</strong>", recent: true, sources: [{name: "Investing.com", url: "https://www.investing.com/news/stock-market-news/defense-stocks-fall-as-iran-nuclear-talks-show-progress-93CH-4524856"}] },
    { date: "2026-02-25", time: "00:00", tag: "EARNINGS", tagClass: "spending", text: "KTOS Q4 2025 results: revenue +21.9% YoY to $345.1M (beat +500bps); EPS $0.18 (+35% YoY, beat +2000bps); backlog $1.57B; book-to-bill 1.3x. 2026 guidance: revenue +25% at high end. Stock -1.8% post-earnings despite strong beat. <strong>TICKERS: KTOS.</strong>", recent: true, sources: [{name: "MarketBeat", url: "https://www.marketbeat.com/originals/kratos-defense-and-security-solutions-stock-poised-for-acceleration/"}] },
    { date: "2026-02-25", time: "00:00", tag: "EARNINGS", tagClass: "spending", text: "GE Aerospace hits new 52-week high ~$346.80 (+2.1%) on raised analyst targets; Deutsche Bank raises PT to $387 (Buy), consensus $329.29. Air Force awarded GE-Kratos team contract to design engine for expendable CCA. <strong>TICKERS: KTOS.</strong>", recent: true, sources: [{name: "MarketBeat", url: "https://www.marketbeat.com/instant-alerts/ge-aerospace-nysege-hits-new-1-year-high-still-a-buy-2026-02-25/"}] },
    { date: "2026-02-25", time: "00:00", tag: "EARNINGS", tagClass: "spending", text: "BWX Technologies (BWXT) +1.68% to $207.66 as Zacks highlights nuclear submarine/carrier sustainment contractor; backlog expansion and strong Navy bookings. +15.9% over 12 weeks. <strong>TICKERS: BWXT.</strong>", recent: true, sources: [{name: "Zacks Investment Research", url: "https://www.zacks.com/featured-articles/521/best-defense-stocks"}] },
    { date: "2026-02-25", time: "00:00", tag: "POLYMARKET", tagClass: "polymarket", text: "Polymarket \'US strikes Iran by Dec 31\' at 75% ($418M total volume). \'By March 31\' at 61%, \'By Feb 28\' at 11%. Iran nuclear deal by March 31 at 28%. Iran strike on US military by March 31 at 31%. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>", recent: true, sources: [{name: "Polymarket", url: "https://polymarket.com/event/us-strikes-iran-by"}] },
    { date: "2026-02-25", time: "00:00", tag: "POLYMARKET", tagClass: "polymarket", text: "New $180K Polymarket wallet bets against US strike on Iran by March 4, 2026 — largest single bet in recent window against near-term strike.", recent: true, sources: [{name: "Phemex News", url: "https://phemex.com/news/article/new-polymarket-wallet-bets-180k-against-us-strike-on-iran-62626"}] },
    { date: "2026-02-25", time: "03:01", tag: "CONGRESS", tagClass: "trade", text: "Trump calls for congressional stock trading ban at SOTU — draws bipartisan applause. Proposal comes as Restore Trust in Congress Act stalls with 128 co-sponsors; House Administration Committee advancing GOP-backed partial ban. <strong>TICKERS: RTX, LMT, NOC, GD.</strong>", recent: true, sources: [{name: "Politico", url: "https://www.politico.com/live-updates/2026/02/24/trump-state-of-the-union-address-2026/trump-backs-congress-stock-trading-ban-00797162"}, {name: "sentdefender (@OSINTdefender)", url: "https://www.politico.com/live-updates/2026/02/24/trump-state-of-the-union-address-2026/trump-backs-congress-stock-trading-ban-00797162"}] },
    { date: "2026-02-18", time: "00:00", tag: "CONGRESS", tagClass: "trade", text: "Senator Markwayne Mullin (R-OK) purchased RTX shares Dec 28, 2025 — one week before significant US military event. Among 3 flagged defense stock trades by politicians in recent months. <strong>TICKERS: RTX.</strong>", recent: true, sources: [{name: "Instagram", url: "https://www.instagram.com/reel/DU60vNGjykE/"}, {name: "Capitol Trades tracker", url: "https://www.instagram.com/reel/DU60vNGjykE/"}] },
    { date: "2026-02-25", time: "00:00", tag: "DOGE", tagClass: "conflict", text: "Pentagon gives Anthropic Feb 27 5PM deadline: grant unrestricted Claude AI access to military or lose $200M contract, face supply chain risk designation, or Defense Production Act invocation. xAI Grok already cleared for classified systems. <strong>TICKERS: PLTR.</strong>", recent: true, sources: [{name: "CBS News", url: "https://www.wdef.com/hegseth-demands-full-military-access-to-anthropics-ai-model-claude-and-sets-deadline-for-end-of-week/"}, {name: "WDEF", url: "https://www.wdef.com/hegseth-demands-full-military-access-to-anthropics-ai-model-claude-and-sets-deadline-for-end-of-week/"}] },
    { date: "2026-02-25", time: "00:00", tag: "DOGE", tagClass: "conflict", text: "Trump SOTU: $1 trillion FY2026 defense budget approved — \'no choice\' framing. Reports indicate administration targeting $1.5 trillion for FY2027 (+$500B). NATO raised to 5% GDP spending target. <strong>TICKERS: LMT, NOC, GD, RTX, LHX, BWXT, KTOS, HII.</strong>", recent: true, sources: [{name: "Military.com", url: "https://www.military.com/feature/2026/02/24/trumps-2026-state-of-union-1-trillion-defense-budget-warrior-dividend-and-what-it-means-troops.html"}, {name: "Cato Institute", url: "https://www.military.com/feature/2026/02/24/trumps-2026-state-of-union-1-trillion-defense-budget-warrior-dividend-and-what-it-means-troops.html"}] },
    { date: "2026-02-25", time: "00:00", tag: "DOGE", tagClass: "conflict", text: "DOGE litigation: courts ordering disclosure of DOGE employee names, Musk deposition scheduled; DOGE \'shut down\' as of May 2025 but legal battles continue. Defense industrial base budgets appear insulated from DOGE cuts.", recent: true, sources: [{name: "Bloomberg", url: "https://www.arcamax.com/currentnews/newsheadlines/s-4021598"}, {name: "ArcaMax", url: "https://www.arcamax.com/currentnews/newsheadlines/s-4021598"}] },
    { date: "2026-02-25", time: "00:00", tag: "MILTRACK", tagClass: "miltrack", text: "US Army CWO Eric Slover awarded Medal of Honor at SOTU for Chinook helicopter actions during Venezuela Maduro capture operation (Operation Absolute Resolve, January 2026). <strong>TICKERS: BA.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026506350109360525"}] },
    { date: "2026-02-25", time: "00:00", tag: "MILTRACK", tagClass: "miltrack", text: "Iran accelerating talks with China to procure Chinese anti-ship missiles to target US naval forces assembled near Iranian coastline — multiple market sources citing anonymous report. <strong>TICKERS: LMT, RTX, NOC, GD, HII.</strong>", recent: true, sources: [{name: "Chronicle Journal", url: "http://markets.chroniclejournal.com/chroniclejournal/article/marketminute-2026-2-25-wti-oil-prices-near-66-inventory-surges-as-iran-nuclear-deadline-looms"}, {name: "Energy Markets", url: "http://markets.chroniclejournal.com/chroniclejournal/article/marketminute-2026-2-25-wti-oil-prices-near-66-inventory-surges-as-iran-nuclear-deadline-looms"}] },
    { date: "2026-02-24", time: "00:00", tag: "CONTRACT", tagClass: "contract", text: "RTX Pratt & Whitney announces $200M investment in Columbus, Georgia plant — adds 7th isothermal forging press, targeting 30% increase in critical engine part output (F135/GTF) by 2028. <strong>TICKERS: RTX, LMT.</strong>", recent: true, sources: [{name: "Stock Titan", url: "https://www.stocktitan.net/news/RTX/rtx-s-pratt-whitney-broadens-manufacturing-capabilities-with-200-wvmvedoca36d.html"}, {name: "RTX press release", url: "https://www.stocktitan.net/news/RTX/rtx-s-pratt-whitney-broadens-manufacturing-capabilities-with-200-wvmvedoca36d.html"}] },
    { date: "2026-02-25", time: "00:00", tag: "EARNINGS", tagClass: "spending", text: "Northrop Grumman officially names CCA Collaborative Combat Aircraft \'Talon Blue\' (YFQ-48A). NOC -4.46% on Iran talk progress today. Stock at $729 range, 52-week high $745.55. <strong>TICKERS: NOC.</strong>", recent: true, sources: [{name: "Defense One", url: "https://www.defenseone.com/business/2026/02/defense-business-brief-obbb-funding-counterdrone-manufacturing-and-cca-update/411673/"}, {name: "StockAnalysis", url: "https://www.defenseone.com/business/2026/02/defense-business-brief-obbb-funding-counterdrone-manufacturing-and-cca-update/411673/"}] },
    { date: "2026-02-25", time: "00:00", tag: "EARNINGS", tagClass: "spending", text: "LMT vs KTOS analyst comparison: Zacks prefers KTOS (Rank #2 Buy, +263% past year) over LMT (Rank #3 Hold, +50% past year) — UAS/autonomous platform thesis outperforming traditional prime. <strong>TICKERS: KTOS, LMT.</strong>", recent: true, sources: [{name: "Yahoo Finance", url: "https://finance.yahoo.com/news/lmt-vs-ktos-defense-stock-130600582.html"}, {name: "Zacks", url: "https://finance.yahoo.com/news/lmt-vs-ktos-defense-stock-130600582.html"}] },
    { date: "2026-02-25", time: "00:00", tag: "EARNINGS", tagClass: "spending", text: "Precision Aerospace & Defense Group (PAD) Investor Day postponed to March 12 — company pursuing SPAC merger with FACT II Acquisition Corp (Nasdaq: FACT). Defense-sector SPAC activity.", recent: true, sources: [{name: "Business Wire", url: "https://www.businesswire.com/news/home/20260224093642/en/Precision-Aerospace-Defense-Group-Reschedules-Investor-Day-to-March-12-2026"}] },
    { date: "2026-02-25", time: "00:00", tag: "CYBER", tagClass: "cyber", text: "Pentagon sets Feb 27 5PM hard deadline for Anthropic AI classified access; threat to invoke Defense Production Act unprecedented in AI sector — creates PLTR, GOOGL, MSFT competitive realignment risk. <strong>TICKERS: PLTR.</strong>", recent: true, sources: [{name: "TipRanks", url: "https://www.tipranks.com/news/pentagon-ultimatum-puts-anthropic-at-a-crossroads-in-the-expanding-ai-defense-race"}, {name: "CBS News", url: "https://www.tipranks.com/news/pentagon-ultimatum-puts-anthropic-at-a-crossroads-in-the-expanding-ai-defense-race"}] },
    { date: "2026-02-24", time: "10:09", tag: "MILTRACK", tagClass: "miltrack", text: "12x F-22 Raptors departed RAF Lakenheath under KC-46A/KC-135 tanker escort toward CENTCOM AOR. Part of broader Coronet ferry missions. <strong>Largest US airpower concentration in Middle East since Iraq 2003</strong> — 150+ aircraft surged since Feb 17. <strong>BULLISH: LMT, NOC, LHX.</strong>", recent: true, sources: [{name: "Army Recognition", url: "https://www.armyrecognition.com/news/aerospace-news/2026/u-s-sends-12-f-22-raptors-from-uk-base-to-middle-east-as-tensions-with-iran-escalate"}, {name: "Washington Post", url: "https://www.washingtonpost.com/investigations/2026/02/24/united-states-iran-buildup/"}] },
    { date: "2026-02-24", time: "09:30", tag: "OSINT", tagClass: "osint", text: "Washington Post: 150+ US aircraft swept into Europe/Middle East since Feb 17. Satellite shows <strong>60+ attack aircraft at Muwaffaq Salti AB, Jordan</strong> (3x normal). F-35s, drones visible. New air defense systems installed. <strong>ESCALATORY.</strong>", recent: true, sources: [{name: "Washington Post", url: "https://www.washingtonpost.com/investigations/2026/02/24/united-states-iran-buildup/"}] },
    { date: "2026-02-24", time: "09:00", tag: "OSINT", tagClass: "osint", text: "Defense One: Joint Chiefs Chairman Gen. Caine warned Trump that war with Iran 'could be prolonged and damaging with numerous US casualties.' Trump 'leaning toward initial strike in coming days' (NYT). <strong>State Dept evacuated Lebanon</strong>. USS Ford crew at sea since June. <strong>CRITICAL ESCALATION.</strong>", recent: true, sources: [{name: "Defense One", url: "https://www.defenseone.com/threats/2026/02/the-d-brief-february-24-2026/411640/"}] },
    { date: "2026-02-24", time: "08:30", tag: "OSINT", tagClass: "osint", text: "Pentagon vs Anthropic: Hegseth summoned CEO Amodei over AI guardrails dispute. $200M pilot renegotiated. Deals with xAI and Google already done. Pentagon pushing all AI firms to lift safety limits for classified systems. <strong>BULLISH: PLTR.</strong>", recent: true, sources: [{name: "NY Times", url: "https://www.nytimes.com/2026/02/23/us/politics/pentagon-anthropic-ai.html"}] },
    { date: "2026-02-24", time: "08:00", tag: "SPENDING", tagClass: "spending", text: "Pentagon releases <strong>$153B reconciliation spending plan</strong> — accelerating all into 2026. $29B shipbuilding, $24B munitions, $24B Golden Dome (classified), $16B readiness. <strong>B-21 production +25%</strong> ($4.5B). FY2027 target: $1.5T. <strong>BULLISH: NOC, HII, BWXT, RKLB.</strong>", recent: true, sources: [{name: "NY Times", url: "https://www.nytimes.com/2026/02/23/us/politics/pentagon-military-congress-spending.html"}, {name: "Defense One", url: "https://www.defenseone.com/threats/2026/02/the-d-brief-february-24-2026/411640/"}] },
    { date: "2026-02-24", time: "07:30", tag: "POLYMARKET", tagClass: "polymarket", text: "Polymarket: US strikes Iran by Feb 28 at <strong>16%</strong> ($40.1M vol). Mar 15: 51%. Mar 31: 63%. Jun 30: 71%. Total volume: <strong>$393M</strong>. Israel strikes Iran Feb 28: 14%. US/Israel strike by Dec 31: 77%. Russia-Ukraine ceasefire Feb 28: <strong>0%</strong>. Strike curve steepening.", recent: true, sources: [{name: "Polymarket", url: "https://polymarket.com/event/us-strikes-iran-by/us-strikes-iran-by-february-27-2026"}] },
    { date: "2026-02-24", time: "07:00", tag: "CONFLICT", tagClass: "conflict", text: "Robert Pape (U. Chicago): 'Never has the US deployed this much force and not launched strikes.' Hudson Institute: 'Force sufficient for weeks — <strong>2-week decision window</strong>.' Next Iran talks Thursday Geneva — last diplomatic window. <strong>CRITICAL.</strong>", recent: true, sources: [{name: "Alhurra", url: "https://alhurra.com/en/13586"}, {name: "Defense News", url: "https://www.defensenews.com/opinion/2026/02/24/the-us-air-force-needs-more-airpower-but-not-the-kind-its-buying/"}] },
    { date: "2026-02-23", time: "22:47", tag: "POLYMARKET", tagClass: "polymarket", text: "Polymarket: 'US next strikes Iran' — No strike by Feb 28 at <strong>80%</strong>. Feb 28 slot at 5.7%, Feb 27 at 5.2%. Total market volume: <strong>$43.4M+</strong>. Israel strikes Iran by Feb 28: <strong>14%</strong>. Markets pricing diplomacy window still open but tension elevated. <strong>BULLISH: LMT, RTX, NOC if window closes.</strong>", recent: true, sources: [{name: "Polymarket", url: "https://polymarket.com/event/us-next-strikes-iran-on-843/will-the-us-next-strike-iran-on-february-28-2026-et"}] },
    { date: "2026-02-23", time: "20:00", tag: "CONTRACT", tagClass: "contract", text: "AFA Warfare Symposium Day 1 (Aurora, CO): Air Force awards CCA engine contracts — KTOS/GE partnership receives <strong>$12.4M</strong> for GEK1500 (1,500-lb thrust) engine design; Honeywell receives parallel contract for SkyShot1600. Gen. Wilsbach confirms Anduril YFQ-44A CCA began weapons integration testing with inert AIM-120. <strong>BULLISH: KTOS, BA.</strong>", recent: true, sources: [{name: "Air & Space Forces Magazine", url: "https://www.airandspaceforces.com/air-force-taps-two-industry-teams-to-design-small-cca-engines/"}, {name: "FlightGlobal", url: "https://www.flightglobal.com/military-uavs/us-air-force-awards-cca-engine-contracts-to-honeywell-ge-kratos/166405.article"}] },
    { date: "2026-02-23", time: "10:30", tag: "CONTRACT", tagClass: "contract", text: "LMT secures potential <strong>$479.9M</strong> Navy 5-year contract for AN/SQQ-89A(V)15 anti-submarine warfare combat system (NAVSEA sole-source). Supports US Navy + Japan + Australia FMS. Parallel PAC-3 $43.5M quality/modernization award (cumulative $223M contract). <strong>BULLISH: LMT.</strong>", recent: true, sources: [{name: "GovCon Wire", url: "https://www.govconwire.com/articles/lockheed-480m-navy-asw-system-contract"}] },
    { date: "2026-02-23", time: "09:00", tag: "MILTRACK", tagClass: "miltrack", text: "CNN: US military positioned for 'multiple waves of strikes' into Iran. B-2 bomber movements being watched — analysts cite Cancian (CSIS): 'Observe any B-2 movements as indicator of Midnight Hammer repeat.' Diego Garcia UK base access dispute: UK PM Starmer tells Trump base cannot be used for Iran strikes; Trump fired back on Truth Social. <strong>ESCALATORY. Watch NOC (B-21), GD.</strong>", recent: true, sources: [{name: "CNN", url: "https://www.cnn.com/2026/02/23/politics/military-trump-iran-us-strike-mcgurk"}, {name: "Al Jazeera", url: "https://www.aljazeera.com/news/2026/2/20/tracking-the-rapid-us-military-build-up-near-iran"}] },
    { date: "2026-02-23", time: "08:00", tag: "OSINT", tagClass: "osint", text: "Stars & Stripes: Iran experts warn Tehran will respond with 'unrestrained' force if US strikes again. Iran Ambassador letter to UN Security Council: 'all bases, facilities and assets of hostile force in region constitute legitimate targets.' Iran signals closing the window on restrained response. <strong>ESCALATORY. BULLISH: ALL PRIMES, especially LMT, RTX, HII.</strong>", recent: true, sources: [{name: "Stars and Stripes", url: "https://www.stripes.com/theaters/middle_east/2026-02-23/iran-attacks-greater-strikes-20844844.html"}] },
    { date: "2026-02-23", time: "05:00", tag: "CYBER", tagClass: "cyber", text: "OPFOR Journal Feb 2026 Homeland Security Brief: Google Threat Intelligence Group (Feb 10) confirms Russia UNC5792/UNC5976, Iran UNC1549/UNC6446, China APT5, NK APT43 all running active social engineering campaigns against US defense contractor employees. Dragos (Feb 17): Chinese Voltzite/Azurite + Iranian Pyroxene APT groups embedding in US critical infrastructure/defense industry for pre-positioning. <strong>BULLISH: CRWD, FTNT, PLTR.</strong>", recent: true, sources: [{name: "OPFOR Journal", url: "https://www.opforjournal.com/p/homeland-security-brief-february"}, {name: "Dragos", url: "https://www.dragos.com/"}] },
    { date: "2026-02-22", time: "14:32", tag: "MILTRACK", tagClass: "miltrack", text: "12x F-22 Raptors (1st FW, Langley) staged at RAF Lakenheath, UK. Expected to continue to Middle East Monday. Tanker delay resolved. <strong>OSINT: @sentdefender, @havoc_aviation. BULLISH: LMT, LHX.</strong>", recent: true, sources: [{name: "@sentdefender", url: "https://x.com/sentdefender"}, {name: "ADS-B Exchange", url: "https://globe.adsbexchange.com/"}] },
    { date: "2026-02-22", time: "11:17", tag: "MILTRACK", tagClass: "miltrack", text: "10+ C-17A Globemaster IIIs airborne from east coast bound for Europe. Most originated Fort Hood, TX — likely air defense asset movement to Middle East. <strong>ADS-B Exchange confirmed. BULLISH: BA, LMT.</strong>", recent: true, sources: [{name: "ADS-B Exchange", url: "https://globe.adsbexchange.com/"}, {name: "Flightradar24", url: "https://www.flightradar24.com/"}] },
    { date: "2026-02-22", time: "08:45", tag: "MILTRACK", tagClass: "miltrack", text: "USS Gerald R. Ford (CVN-78) entered Mediterranean Sea. 2nd carrier heading to Middle East. Ford's 8th month deployed — redirected from Caribbean. <strong>Dual-carrier posture = PEAK force projection. BULLISH: HII, GD, NOC.</strong>", recent: true, sources: [{name: "MarineTraffic", url: "https://www.marinetraffic.com/"}, {name: "USNI News", url: "https://news.usni.org/"}] },
    { date: "2026-02-21", time: "19:03", tag: "OSINT", tagClass: "osint", text: "Sen. Lindsey Graham urges Trump to strike Iran after Middle East trip. Multiple officials cautioning restraint. Graham: 'opportunity for historic change.' <strong>OSINT: @sentdefender via Axios. ESCALATORY.</strong>", recent: true, sources: [{name: "Axios", url: "https://www.axios.com/"}, {name: "@sentdefender", url: "https://x.com/sentdefender"}] },
    { date: "2026-02-20", time: "16:41", tag: "MILTRACK", tagClass: "miltrack", text: "Pentagon surged 250+ aircraft to region: 64x C-17s to Al Udeid (Qatar), 31x C-17s to Prince Sultan (Saudi Arabia). Largest airlift since 2003 Iraq invasion. <strong>ADS-B/FR24 confirmed. BULLISH: ALL PRIMES.</strong>", recent: true, sources: [{name: "ADS-B Exchange", url: "https://globe.adsbexchange.com/"}, {name: "Flightradar24", url: "https://www.flightradar24.com/"}, {name: "Defense News", url: "https://www.defensenews.com/"}] },
    { date: "2026-02-20", time: "10:22", tag: "MILTRACK", tagClass: "miltrack", text: "USS Abraham Lincoln CSG confirmed operating in Arabian Sea near Oman via satellite imagery. CVW-9 includes F-35C (VMFA-314) and EA-18G Growler. <strong>Eurovision OSINT hex codes tracked. BULLISH: LMT, NOC.</strong>", recent: true, sources: [{name: "Eurovision OSINT", url: "https://spotlight.ebu.ch/p/iran-armada-osint-intelligence-guide"}, {name: "MarineTraffic", url: "https://www.marinetraffic.com/"}] },
        { date: "2026-02-20", time: "09:00", tag: "CONTRACT", tagClass: "contract", text: "RTX/Raytheon: US Navy officially approves <strong>StormBreaker smart weapon</strong> for operational use on F/A-18-E/F Super Hornet fleet. All-weather moving/fixed-target engagement. Already combat-proven; now integrating on F-35A/B/C. Expands RTX strike munitions franchise across entire carrier air wing. <strong>BULLISH: RTX, LMT (F-35 integration).</strong>", recent: true, sources: [{name: "RTX Press Release", url: "https://www.rtx.com/news/news-center/2026/02/20/u-s-navy-approves-raytheons-stormbreaker-smart-weapon-for-use-on-super-hornet"}] },
    { date: "2026-02-19", time: "13:18", tag: "MILTRACK", tagClass: "miltrack", text: "F-16CJ 'Wild Weasel' SEAD aircraft deploying to Middle East. Specialized in destroying enemy air defense radars — Iran-specific capability. <strong>Historically precedes strikes by 7-14 days. BULLISH: LMT, LHX.</strong>", recent: true, sources: [{name: "@AirSpecInt", url: "https://x.com/AirSpecInt"}, {name: "ADS-B Exchange", url: "https://globe.adsbexchange.com/"}] },
    { date: "2026-02-18", time: "09:56", tag: "MILTRACK", tagClass: "miltrack", text: "SSGN submarines (Ohio-class guided missile) reported deploying. Each carries 154 Tomahawk cruise missiles. Silent, undetectable first-strike platform. <strong>AIS dark confirmed. BULLISH: GD, RTX.</strong>", recent: true, sources: [{name: "USNI News", url: "https://news.usni.org/"}, {name: "@MT_Anderson", url: "https://x.com/MT_Anderson"}] },
    { date: "2026-02-15", time: "15:30", tag: "OSINT", tagClass: "osint", text: "AIS spoofing and GPS jamming surging in Strait of Hormuz. Iran seizing vessels claiming AIS non-transmission. USDOT MARAD Advisory 2026-001 issued Feb 9. <strong>Maritime risk ELEVATED. BULLISH: HII, LHX.</strong>", recent: true, sources: [{name: "MARAD Advisories", url: "https://www.maritime.dot.gov/msci"}, {name: "MarineTraffic", url: "https://www.marinetraffic.com/"}] },
    { date: "2026-02-09", time: "07:14", tag: "MILTRACK", tagClass: "miltrack", text: "P-8A Poseidon ISR patrol detected flying repeated tracks in Persian Gulf between Bahrain and UAE. KC-135 tanker briefly appeared near Iranian airspace before coverage cut. <strong>Pre-strike ISR pattern. BULLISH: NOC, RTX.</strong>", recent: true, sources: [{name: "ADS-B Exchange", url: "https://globe.adsbexchange.com/"}, {name: "r/ADSB", url: "https://www.reddit.com/r/ADSB/"}] },
    { date: "2026-02-07", time: "12:08", tag: "MILTRACK", tagClass: "miltrack", text: "112 C-17 Globemaster IIIs reported entering European/Middle East theater in single day. 12x C-17s at Ramstein (unusual), 5x at Al Udeid, 2x MQ-4C Tritons at Al Dhafra. <strong>Naval-technology.com OSINT. BULLISH: BA, LMT.</strong>", recent: true, sources: [{name: "Naval Technology", url: "https://www.naval-technology.com/"}, {name: "ADS-B Exchange", url: "https://globe.adsbexchange.com/"}] },
    { date: "2026-01-26", time: "10:00", tag: "MILTRACK", tagClass: "miltrack", text: "USS Abraham Lincoln CSG confirmed deployed to Middle East by CENTCOM. Escorts: USS Spruance, USS Frank E. Petersen Jr., USS Michael Murphy. CVW-9 with F-35C Lightning II. <strong>4th carrier deployment in 8 months (abnormal). BULLISH: LMT, HII.</strong>", recent: false, sources: [{name: "CENTCOM", url: "https://www.centcom.mil/"}, {name: "USNI News", url: "https://news.usni.org/"}] },
    { date: "2026-02-20", time: "18:15", tag: "CONFLICT", tagClass: "conflict", text: "Iran-US crisis at PEAK intensity. Two carrier strike groups deployed to Gulf. Reuters reports strikes possible within days. <strong>BULLISH: LMT, RTX, NOC, KTOS.</strong>", recent: true, sources: [{name: "Reuters Defense", url: "https://www.reuters.com/business/aerospace-defense/"}] },
    { date: "2026-02-19", time: "14:30", tag: "CONTRACT", tagClass: "contract", text: "Pentagon selects KTOS for Drone Dominance Program — <strong>$1.1B</strong> attritable UAS contract. Largest CCA award. <strong>BULLISH: KTOS, AVAV.</strong>", recent: true, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}, {name: "Defense News", url: "https://www.defensenews.com/"}] },
    { date: "2026-02-18", time: "16:02", tag: "SPENDING", tagClass: "spending", text: "LMT hits $666 52-week high. NOC hits $737. HII hits $443. Defense sector at all-time highs on <strong>$839B appropriation + Iran escalation</strong>.", recent: true, sources: [{name: "Perplexity Finance", url: "https://perplexity.ai/finance/LMT"}] },
    { date: "2026-02-14", time: "16:00", tag: "CONFLICT", tagClass: "conflict", text: "LDOS crashes to $173 (-11% in week). BAH continues slide to $77. <strong>DOGE risk materializing for IT services contractors.</strong>", recent: true, sources: [{name: "Perplexity Finance", url: "https://perplexity.ai/finance/LDOS"}] },
    { date: "2026-02-20", time: "21:30", tag: "POLYMARKET", tagClass: "polymarket", text: "US strikes Iran by Feb 28 surges to 19% (from 2%). <strong>$338M+ total volume on Iran strike timing. BULLISH: LMT, RTX, NOC.</strong>", recent: true, sources: [{name: "Polymarket", url: "https://polymarket.com/predictions/war"}] },
    { date: "2026-02-12", time: "09:45", tag: "POLYMARKET", tagClass: "polymarket", text: "Israeli authorities arrest traders for using <strong>classified military intelligence</strong> to place Polymarket bets. Prediction markets confirmed as intelligence leak vector.", recent: true, sources: [{name: "Reuters", url: "https://www.reuters.com/"}, {name: "Polymarket", url: "https://polymarket.com/"}] },
    { date: "2026-02-22", time: "06:00", tag: "CONFLICT", tagClass: "conflict", text: "ISW (Feb 22 assessment): Russia launched 347 drones/missiles overnight — <strong>shifting target set from energy to water/railway systems</strong> to interdict Ukrainian logistics. Included 4 hypersonic Zirkon cruise missiles. Ukrainian forces advanced near Kupyansk and Novopavlivka. Russia using Belarusian cellular infrastructure to coordinate drone strikes — NATO airspace incursions confirmed deliberate. <strong>Long-war narrative intact. BULLISH: LMT, RTX, AVAV, BAESY.</strong>", recent: true, sources: [{name: "Institute for the Study of War", url: "https://understandingwar.org/research/russia-ukraine/russian-offensive-campaign-assessment-february-22-2026/"}] },
    { date: "2026-02-12", time: "14:20", tag: "CONFLICT", tagClass: "conflict", text: "Trump-Putin peace talks collapse. Long war narrative reinforced. <strong>BULLISH: LMT, RTX, NOC, European defense</strong>", recent: false, sources: [{name: "Reuters", url: "https://www.reuters.com/"}] },
    { date: "2026-01-09", time: "10:30", tag: "TRADE", tagClass: "trade", text: "Rep. Cisneros (D-CA, HASC) buys RTX post-Venezuela op. <strong>HIGH SUSPICION.</strong>", recent: false, sources: [{name: "Capitol Trades", url: "https://www.capitoltrades.com/"}] },
    { date: "2026-01-07", time: "08:00", tag: "SPENDING", tagClass: "spending", text: "European defense stocks hit ATH on Greenland crisis. <strong>Rheinmetall +19%, Saab +22%</strong> in one week.", recent: false, sources: [{name: "Defense News", url: "https://www.defensenews.com/"}] },
    { date: "2026-01-03", time: "22:15", tag: "POLYMARKET", tagClass: "polymarket", text: "Polymarket trader turns $32K → $400K betting on Maduro ouster <strong>hours before US military operation</strong>. Insider trading on prediction markets now a national security concern.", recent: false, sources: [{name: "Polymarket", url: "https://polymarket.com/"}, {name: "Unusual Whales", url: "https://unusualwhales.com/"}] },
    { date: "2026-01-03", time: "06:00", tag: "CONFLICT", tagClass: "conflict", text: "US military captures Maduro in Venezuela. <strong>Defense stocks surge globally.</strong>", recent: false, sources: [{name: "Reuters Defense", url: "https://www.reuters.com/business/aerospace-defense/"}] },
    { date: "2025-12-29", time: "12:00", tag: "TRADE", tagClass: "trade", text: "Sen. Mullin (R-OK, SASC) buys RTX $15K-$50K + CVX $50K-$100K. <strong>5 days before Venezuela op. HIGHEST SUSPICION.</strong>", recent: false, sources: [{name: "Capitol Trades", url: "https://www.capitoltrades.com/"}, {name: "Quiver Quantitative", url: "https://www.quiverquant.com/"}] },
    { date: "2025-12-29", time: "09:00", tag: "DEPLOYMENT", tagClass: "deployment", text: "China \"Justice Mission 2025\" exercises — most extensive ever Taiwan drills.", recent: false, sources: [{name: "Reuters Defense", url: "https://www.reuters.com/business/aerospace-defense/"}] },
    { date: "2025-12-21", time: "15:00", tag: "SPENDING", tagClass: "spending", text: "FY2026 NDAA signed — <strong>$900.6B</strong>. First ever >$900B. <strong>BULLISH ALL PRIMES.</strong>", recent: false, sources: [{name: "Defense News", url: "https://www.defensenews.com/"}, {name: "DoD", url: "https://www.defense.gov/"}] },
    { date: "2025-12-17", time: "11:00", tag: "CONTRACT", tagClass: "contract", text: "$11.1B Taiwan arms sale — largest ever. HIMARS, ATACMS, Javelins. <strong>BULLISH: LMT, RTX.</strong>", recent: false, sources: [{name: "SIPRI", url: "https://www.sipri.org/"}, {name: "Defense News", url: "https://www.defensenews.com/"}] },
    { date: "2025-09-30", time: "14:00", tag: "CONTRACT", tagClass: "contract", text: "$24.3B F-35 Lots 18-19 to LMT. <strong>Largest consecutive F-35 contract ever.</strong>", recent: false, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}] },
    { date: "2025-09-03", time: "14:00", tag: "CONTRACT", tagClass: "contract", text: "$9.8B PAC-3 MSE to LMT. $900.5M Javelin to LMT/RTX.", recent: false, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}] },
    { date: "2025-08-01", time: "10:00", tag: "CONTRACT", tagClass: "contract", text: "$50B RTX Patriot sustainment through 2045. <strong>Largest missile defense contract ever.</strong>", recent: false, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}, {name: "Reuters Defense", url: "https://www.reuters.com/business/aerospace-defense/"}] },
    { date: "2025-06-25", time: "12:00", tag: "SPENDING", tagClass: "spending", text: "NATO agrees 5% GDP target. All 32 members exceed 2%. <strong>BULLISH: ALL DEFENSE.</strong>", recent: false, sources: [{name: "Defense News", url: "https://www.defensenews.com/"}, {name: "Reuters", url: "https://www.reuters.com/"}] },
    { date: "2025-06-13", time: "03:00", tag: "CONFLICT", tagClass: "conflict", text: "Israel/US strikes Iran nuclear sites. <strong>B-21 bombers (NOC) validated. Tomahawks (RTX) used.</strong>", recent: false, sources: [{name: "Reuters Defense", url: "https://www.reuters.com/business/aerospace-defense/"}, {name: "Al Jazeera", url: "https://www.aljazeera.com/"}] },
    { date: "2025-06-12", time: "18:59", tag: "PIZZINT", tagClass: "pizzint", text: "🍕 Pentagon Pizza Index spikes at 6:59 PM ET. Multiple pizza shops near Pentagon show \"much busier than usual\". <strong>Hours later: Israel strikes Iran nuclear sites.</strong>", recent: false, sources: [{name: "PizzINT", url: "https://pizzint.watch"}] },
    { date: "2025-05-30", time: "10:00", tag: "TRADE", tagClass: "trade", text: "Rep. Cisneros (D-CA, HASC) buys NOC, LHX, BA on same day. Sells LMT. <strong>Defense rotation.</strong>", recent: false, sources: [{name: "Capitol Trades", url: "https://www.capitoltrades.com/"}] },
    { date: "2025-05-13", time: "10:00", tag: "TRADE", tagClass: "trade", text: "Sen. Mullin (R-OK, SASC) buys L3Harris $15K-$50K. <strong>Defense spending increase looming.</strong>", recent: false, sources: [{name: "Capitol Trades", url: "https://www.capitoltrades.com/"}, {name: "OpenSecrets", url: "https://www.opensecrets.org/"}] }
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
    { name: "PACIFIC / CHINA", level: "HIGH", levelClass: "high", cardClass: "high", desc: "Taiwan 'Justice Mission 2025' \u2014 most extensive Chinese exercises ever. $11.1B Taiwan arms sale. Chinese Volt Typhoon cyber pre-positioning confirmed active. Submarine buildup accelerating. SDA satellite constellation expanding. $24B Golden Dome (classified). Middle East drawdown may temporarily reduce Pacific posture.", tickers: ["GD", "HII", "BWXT", "CW", "RKLB", "NOC"] },
    { name: "EUROPE / RUSSIA", level: "ELEVATED", levelClass: "elevated", cardClass: "elevated", desc: "Feb 24 = 4th anniversary Ukraine invasion. Russia launched 347 drones/missiles overnight Feb 21-22 \u2014 shifted to water/railway targets. 4x hypersonic Zirkon missiles used. NATO airspace incursions deliberate. All NATO 2%+ GDP, new 5% target. Front-line states accelerating orders. Trump-Putin talks collapsed Feb 12. Ceasefire odds: 0%.", tickers: ["LMT", "RTX", "AVAV", "BAESY"] },
    { name: "MIDDLE EAST", level: "CRITICAL", levelClass: "critical", cardClass: "critical", desc: "LARGEST US buildup since Iraq 2003. 150+ aircraft surged since Feb 17. 12x F-22s departing Lakenheath to CENTCOM. 60+ attack aircraft at Jordan base (3x normal). Dual carrier (Ford + Lincoln). 25-35 surface vessels with 600+ Tomahawks. SSGN subs deployed. State Dept evacuated Lebanon. Trump 'leaning toward initial strike.' Joint Chiefs warn of 'prolonged costly war.' 2-week decision window. Next Geneva talks Thursday.", tickers: ["LMT", "RTX", "LHX", "KTOS", "NOC"] },
    { name: "CYBER", level: "HIGH", levelClass: "high", cardClass: "high", desc: "State actors all targeting US defense contractors \u2014 Google TIG confirms Russia/China/Iran/NK campaigns. Dragos: Chinese/Iranian APTs embedding in critical infrastructure. AIS spoofing surge in Hormuz. FCC warns 4x telecom ransomware increase. Pentagon AI guardrails dispute. Google-Wiz $32B deal reshaping market.", tickers: ["CRWD", "PANW", "FTNT", "PLTR"] },
    { name: "CONUS / STRATEGIC", level: "ELEVATED", levelClass: "elevated", cardClass: "elevated", desc: "Nuclear modernization accelerating. $153B reconciliation spending \u2014 all into 2026. B-21 production +25% ($4.5B). Golden Dome $24B (classified). $1.5T FY2027 target. BWXT record $7.4B backlog. Iran eyeing CONUS proxy strikes per NYT.", tickers: ["NOC", "BWXT", "CW", "PLTR", "RKLB"] }
];

// === ETF DATA ===
const etfHoldings = [
    { ticker: "LMT", company: "Lockheed Martin", score: 5 },
    { ticker: "RTX", company: "Raytheon Technologies", score: 5 },
    { ticker: "NOC", company: "Northrop Grumman", score: 5 },
    { ticker: "HII", company: "Huntington Ingalls", score: 5 },
    { ticker: "BWXT", company: "BWX Technologies", score: 5 },
    { ticker: "RKLB", company: "Rocket Lab USA", score: 4 },
    { ticker: "CW", company: "Curtiss-Wright", score: 4 },
    { ticker: "LHX", company: "L3Harris Technologies", score: 4 },
    { ticker: "PLTR", company: "Palantir Technologies", score: 4 },
    { ticker: "GD", company: "General Dynamics", score: 3 },
    { ticker: "KTOS", company: "Kratos Defense", score: 3 },
    { ticker: "AVAV", company: "AeroVironment", score: 3 },
    { ticker: "BAESY", company: "BAE Systems ADR", score: 3 },
    { ticker: "MRCY", company: "Mercury Systems", score: 3 },
    { ticker: "BA", company: "Boeing", score: 2 },
    { ticker: "LDOS", company: "Leidos Holdings", score: 2 },
    { ticker: "FTNT", company: "Fortinet", score: 1 },
    { ticker: "JOBY", company: "Joby Aviation", score: 1 }
];

const etfExcluded = [
    { ticker: "CRWD", company: "CrowdStrike", score: 0 },
    { ticker: "ACHR", company: "Archer Aviation", score: 0 },
    { ticker: "PANW", company: "Palo Alto Networks", score: -1 },
    { ticker: "SAIC", company: "Science Applications", score: -3 },
    { ticker: "BAH", company: "Booz Allen Hamilton", score: -5 }
];

// === POSITION CHANGES — Feb 24, 2026 Update ===
// Live quotes as of Feb 24, 2026 ~3:55 PM PST (after-hours)
const positionChanges = [
    {
        ticker: "NOC",
        company: "Northrop Grumman",
        price: 707.21,
        dayChange: -0.78,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "B-21 production increase not yet priced in — reconciliation details released <24hrs ago. Geneva talks Thursday could collapse, triggering Midnight Hammer repeat. 2-week strike window open.",
        signal: "B-21 production +25% ($4.5B) in $153B Pentagon reconciliation. Nuclear modernization centerpiece. B-21 validated in prior Iran strikes — analysts flagging for repeat.",
        catalysts: ["$153B Pentagon spend", "B-21 +25% production", "Sentinel ICBM"]
    },
    {
        ticker: "HII",
        company: "Huntington Ingalls",
        price: 436.49,
        dayChange: -2.51,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "$29B shipbuilding allocation announced <24hrs ago — largest in history. Sole-source nuclear shipyard with zero competition. Dual-carrier ops sustaining demand for years. Market hasn't fully digested reconciliation scale.",
        signal: "$29B shipbuilding in reconciliation — largest allocation. Only nuclear shipyard. 14 Navy vessels now deployed to Iran theater. Dual-carrier posture = max demand.",
        catalysts: ["$29B shipbuilding", "Sole nuclear shipyard", "Dual-carrier ops"]
    },
    {
        ticker: "BWXT",
        company: "BWX Technologies",
        price: 210.47,
        dayChange: 3.06,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "Nuclear sub reactor demand is a multi-year structural tailwind that just accelerated. Zero DOGE exposure. $7.4B backlog = 3+ years revenue visibility. Any Iran strike accelerates nuclear modernization timeline.",
        signal: "Nuclear emphasis in $153B spend — sub reactors, B-21 nuclear systems, Golden Dome. Record $7.4B backlog. Zero DOGE risk. +2.95% on day.",
        catalysts: ["Nuclear spend surge", "$7.4B backlog", "+2.95% momentum"]
    },
    {
        ticker: "PLTR",
        company: "Palantir Technologies",
        price: 134.56,
        dayChange: 4.44,
        oldScore: 3,
        newScore: 4,
        action: "UPGRADE",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "Pentagon summoned Anthropic CEO over AI guardrails — deals with xAI and Google done. PLTR as incumbent AI/targeting platform benefits from Pentagon AI push. $10B Army contract.",
        catalysts: ["Pentagon AI push", "Anthropic dispute = PLTR leverage", "$10B Army"]
    },
    {
        ticker: "RKLB",
        company: "Rocket Lab USA",
        price: 71.45,
        dayChange: 2.12,
        oldScore: 4,
        newScore: 4,
        action: "HOLD",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "Golden Dome $24B (classified) benefits space-based tracking. $816M SDA contract intact. -0.34% selloff is broad market, not fundamental.",
        catalysts: ["Golden Dome $24B", "SDA HALO demo", "Selloff = noise"]
    },
    {
        ticker: "KTOS",
        company: "Kratos Defense",
        price: 90.44,
        dayChange: -0.26,
        oldScore: 4,
        newScore: 3,
        action: "DOWNGRADE",
        priority: "REDUCE",
        priorityUrgency: "medium",
        priorityRationale: "Second consecutive selloff day (-5.90% then -3.85%). CCA timeline is multi-year — near-term catalysts exhausted after AFA Symposium. Trim and redeploy capital to NOC/HII/BWXT where reconciliation dollars flow immediately.",
        signal: "-3.85% selloff continuing despite positive CCA engine contract ($12.4M) and $1.1B Drone Dominance. Market skepticism on execution timeline. Downgrade on momentum deterioration.",
        catalysts: ["-3.85% selloff", "Execution concern", "CCA timeline risk"]
    },
    {
        ticker: "CRWD",
        company: "CrowdStrike",
        price: 362.34,
        dayChange: 3.45,
        oldScore: 1,
        newScore: 0,
        action: "DOWNGRADE",
        priority: "EXIT",
        priorityUrgency: "high",
        priorityRationale: "Post-earnings dead cat bounce likely temporary. Cyber sector rotation underway — capital better deployed in hardware primes benefiting from $153B reconciliation. Google-Wiz $32B deal reshaping competitive landscape.",
        signal: "Earnings miss — stock -9.85% Feb 23. Cyber demand persistent but execution failing. Moving to excluded on negative momentum.",
        catalysts: ["Earnings miss", "-9.85% crash", "Execution failure"]
    },
    {
        ticker: "LHX",
        company: "L3Harris Technologies",
        price: 342.26,
        dayChange: -3.39,
        oldScore: 3,
        newScore: 4,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "medium",
        priorityRationale: "EW/comms demand surge from 150+ aircraft deployment still being priced in. Red-on-red dip today (-0.24%) offers entry point. Any Iran strike = immediate demand spike for L3Harris sensor/comm packages across carrier air wings.",
        signal: "F-22 deployment + 150 aircraft surge = elevated EW/comms demand. LHX book-to-bill 1.5x. Iran dual-carrier posture maximizes sensor/comm gear demand.",
        catalysts: ["F-22 surge", "EW/comms demand", "1.5x book-to-bill"]
    }
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
    { ticker: "LMT", start: 455.63, end: 660.62 },
    { ticker: "RTX", start: 158.60, end: 201.92 },
    { ticker: "NOC", start: 590.04, end: 725.39 },
    { ticker: "KTOS", start: 65.84, end: 94.31 },
    { ticker: "RKLB", start: 48.60, end: 70.21 },
    { ticker: "BWXT", start: 162.04, end: 198.38 },
    { ticker: "HII", start: 270.79, end: 438.01 },
    { ticker: "CW", start: 478.15, end: 699.24 },
    { ticker: "GD", start: 324.57, end: 348.98 },
    { ticker: "LHX", start: 277.62, end: 355.14 },
    { ticker: "PLTR", start: 156.71, end: 130.60 },
    { ticker: "AVAV", start: 241.35, end: 261.33 },
    { ticker: "BAESY", start: 60.19, end: 116.48 },
    { ticker: "MRCY", start: 67.55, end: 85.90 },
    { ticker: "BA", start: 234.68, end: 230.44 },
    { ticker: "LDOS", start: 180.92, end: 172.00 },
    { ticker: "FTNT", start: 78.77, end: 75.60 },
    { ticker: "CRWD", start: 423.70, end: 350.33 },
    { ticker: "JOBY", start: 14.15, end: 9.54 }
];

const benchmarkData = {
    SPY: { start: 645.05, end: 687.62 },
    ITA: { start: 198.42, end: 242.19 }
};

// === SIMULATED MONTHLY PERFORMANCE DATA (indexed to 100) ===
// 6 months: Aug 29, Sep 30, Oct 31, Nov 30, Dec 31, Jan 31, Feb 23
const perfLabels = ["Aug 29", "Sep 30", "Oct 31", "Nov 30", "Dec 31", "Jan 31", "Feb 23"];
const perfETF =    [100, 103.2, 107.8, 112.4, 118.5, 124.1, 127.9];
const perfITA =    [100, 102.1, 105.3, 109.2, 113.8, 117.4, 120.5];
const perfSPY =    [100, 101.5, 103.8, 102.1, 99.2, 96.5, 105.8];


// === THEATER INTEL DATA ===
const theaterIntelData = [
    {
        name: "MIDDLE EAST",
        level: "CRITICAL",
        levelClass: "critical",
        summary: "The largest concentration of American airpower in the Middle East since the 2003 Iraq invasion, assembled after the collapse of US-Iran nuclear talks on Feb 17. Multiple analysts assess a 2-week decision window before force becomes unsustainable.",
        evidence: [
            {
                category: "AIR POWER SURGE",
                items: [
                    "150+ US military aircraft deployed to region since Feb 17 (Washington Post satellite analysis)",
                    "12x F-22 Raptors departed RAF Lakenheath under tanker escort toward CENTCOM (Feb 24)",
                    "60+ attack aircraft at Muwaffaq Salti AB, Jordan \u2014 3x normal (satellite confirmed)",
                    "F-35 stealth fighters visible at Jordanian base with new air defense installations",
                    "6x E-3 AWACS heading to Saudi Arabia for air coordination",
                    "F-16CJ Wild Weasel SEAD aircraft deploying \u2014 historically precedes strikes by 7-14 days",
                    "B-2 stealth bombers on standby in Missouri; B-21 movement being monitored"
                ]
            },
            {
                category: "NAVAL FORCE POSTURE",
                items: [
                    "Dual carrier strike groups: USS Ford (CVN-78) + USS Abraham Lincoln (CVN-72)",
                    "Ford crew at sea since June \u2014 twice-extended deployment, record length approaching",
                    "25-35 surface vessels including ~12 Arleigh Burke destroyers with Aegis combat systems",
                    "Estimated 600+ Tomahawk cruise missiles available across fleet",
                    "SSGN submarines deployed (Ohio-class: 154 Tomahawks each, always AIS-dark)",
                    "3 Littoral Combat Ships in Gulf for mine countermeasures at Strait of Hormuz",
                    "USS George H.W. Bush showing preparatory activity in Norfolk \u2014 potential 3rd carrier"
                ]
            },
            {
                category: "DIPLOMATIC SIGNALS",
                items: [
                    "State Department evacuated non-essential personnel and families from Lebanon",
                    "Trump gave Iran '10-15 day' ultimatum; NYT reports he's 'leaning toward initial strike'",
                    "Joint Chiefs Chairman Gen. Caine warned of 'prolonged, damaging conflict with numerous US casualties'",
                    "Next US-Iran talks scheduled Thursday in Geneva \u2014 last diplomatic window",
                    "Diego Garcia UK access dispute: PM Starmer says base cannot be used for Iran strikes",
                    "Iran Ambassador UN letter: 'all bases and assets of hostile force are legitimate targets'",
                    "Sen. Lindsey Graham urging Trump to strike after Middle East trip"
                ]
            },
            {
                category: "INTELLIGENCE & ANALYSIS",
                items: [
                    "Robert Pape (U. Chicago): 'Never has the US deployed this much force and not launched strikes'",
                    "Richard Weitz (Hudson Institute): 'Force sufficient for weeks, not days \u2014 2-week decision window'",
                    "CNN: US military positioned for 'multiple waves of strikes' into Iran",
                    "Polymarket: US strikes Iran by Feb 28 at 16% ($40.1M vol); by Mar 31: 63%; total vol $393M",
                    "MILTRACK Composite Score: CRITICAL +18 \u2014 highest ever, comparable only to Iraq 2003"
                ]
            }
        ],
        keyAssets: "2 CSGs (Ford, Lincoln), 150+ aircraft, 600+ Tomahawks, SSGN subs, F-22/F-35/F-16CJ/B-2, THAAD/Patriot batteries",
        tickers: ["LMT", "RTX", "NOC", "LHX", "KTOS", "HII", "GD"],
        sources: [
            {name: "Washington Post", url: "https://www.washingtonpost.com/investigations/2026/02/24/united-states-iran-buildup/"},
            {name: "Defense One", url: "https://www.defenseone.com/threats/2026/02/the-d-brief-february-24-2026/411640/"},
            {name: "Army Recognition", url: "https://www.armyrecognition.com/news/aerospace-news/2026/u-s-sends-12-f-22-raptors-from-uk-base-to-middle-east-as-tensions-with-iran-escalate"},
            {name: "Alhurra", url: "https://alhurra.com/en/13586"},
            {name: "Polymarket", url: "https://polymarket.com/event/us-strikes-iran-by/us-strikes-iran-by-february-27-2026"}
        ]
    },
    {
        name: "PACIFIC / CHINA",
        level: "HIGH",
        levelClass: "high",
        summary: "China's military pressure on Taiwan continues to escalate with unprecedented exercises, while the US counters with record arms sales and submarine buildup. Chinese cyber pre-positioning in US critical infrastructure confirmed active.",
        evidence: [
            {
                category: "MILITARY POSTURE",
                items: [
                    "China 'Justice Mission 2025' \u2014 most extensive Taiwan exercises ever conducted (Dec 2025)",
                    "$11.1B Taiwan arms sale \u2014 largest in history (HIMARS, ATACMS, Javelins)",
                    "$32B arms backlog with Indo-Pacific partners",
                    "Virginia-class submarine production critical for undersea dominance",
                    "SDA satellite constellation expanding \u2014 RKLB $816M contract for space-based tracking",
                    "NOTE: Middle East drawdown may temporarily reduce Pacific posture \u2014 strategic risk"
                ]
            },
            {
                category: "CYBER / HYBRID WARFARE",
                items: [
                    "Chinese Volt Typhoon cyber pre-positioning confirmed active in US infrastructure (Dragos Feb 17)",
                    "China APT5 targeting defense/tech sector employees (Google TIG Feb 10)",
                    "Chinese Voltzite/Azurite APT groups embedding in critical infrastructure for pre-positioning"
                ]
            },
            {
                category: "STRATEGIC POSTURE",
                items: [
                    "Golden Dome missile defense \u2014 $24B allocated in reconciliation bill (details classified)",
                    "SDA $30M HALO tactical SATCOM demo \u2014 early warning capability",
                    "Space-based tracking and ISR expansion to counter Chinese A2/AD"
                ]
            }
        ],
        keyAssets: "Submarine fleet, SDA satellite constellation, Taiwan arms sales, Golden Dome interceptors",
        tickers: ["GD", "HII", "BWXT", "CW", "RKLB", "NOC"],
        sources: [
            {name: "Defense News", url: "https://www.defensenews.com/"},
            {name: "Dragos", url: "https://www.dragos.com/"},
            {name: "SIPRI", url: "https://www.sipri.org/"}
        ]
    },
    {
        name: "EUROPE / RUSSIA",
        level: "ELEVATED",
        levelClass: "elevated",
        summary: "The Ukraine war enters its 4th year with Russia escalating weapon types (hypersonic Zirkon missiles) and shifting targeting to critical infrastructure. NATO rearmament supercycle accelerating with all members exceeding 2% GDP.",
        evidence: [
            {
                category: "ACTIVE CONFLICT",
                items: [
                    "Feb 24, 2026 = 4th anniversary of Russia's invasion of Ukraine",
                    "Russia launched 347 drones/missiles overnight Feb 21-22 \u2014 shifted targeting to water/railway systems",
                    "4x hypersonic Zirkon cruise missiles used \u2014 escalation in weapon sophistication",
                    "Russia using Belarusian cellular infrastructure to coordinate drone strikes",
                    "Ukrainian forces advanced near Kupyansk and Novopavlivka despite bombardment",
                    "Russian cargo ship shadowing transatlantic undersea cables"
                ]
            },
            {
                category: "NATO REARMAMENT",
                items: [
                    "All 32 NATO members now exceed 2% GDP defense spending",
                    "New NATO target: 5% GDP \u2014 massive rearmament supercycle",
                    "Front-line states (Poland, Baltics, Finland) accelerating defense orders",
                    "European defense stocks at all-time highs \u2014 BAE, Rheinmetall +19%, Saab +22%"
                ]
            },
            {
                category: "DIPLOMATIC STATUS",
                items: [
                    "Trump-Putin peace talks collapsed Feb 12 \u2014 long war narrative reinforced",
                    "Polymarket: Russia-Ukraine ceasefire by Feb 28 at 0% ($5.7M volume)",
                    "NATO airspace incursions by Russia confirmed deliberate \u2014 not accidental"
                ]
            }
        ],
        keyAssets: "Switchblade/loitering munitions supply chain, HIMARS/ATACMS, Patriot batteries, NATO FMS pipeline",
        tickers: ["LMT", "RTX", "AVAV", "BAESY"],
        sources: [
            {name: "ISW Assessment", url: "https://understandingwar.org/"},
            {name: "Defense News", url: "https://www.defensenews.com/"},
            {name: "Polymarket", url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-by-february-28-2026"}
        ]
    },
    {
        name: "CYBER",
        level: "HIGH",
        levelClass: "high",
        summary: "All four major adversary nations (Russia, China, Iran, North Korea) are running active campaigns against US defense contractors and critical infrastructure. Maritime cyber anomalies surging in the Strait of Hormuz.",
        evidence: [
            {
                category: "STATE ACTOR CAMPAIGNS",
                items: [
                    "Google Threat Intelligence Group (Feb 10): Russia UNC5792/UNC5976, Iran UNC1549/UNC6446, China APT5, NK APT43 \u2014 all targeting US defense contractor employees",
                    "Dragos (Feb 17): Chinese Voltzite/Azurite + Iranian Pyroxene APT groups embedding in US critical infrastructure",
                    "FCC warns 4x increase in telecom ransomware attacks",
                    "Social engineering campaigns against defense employees at unprecedented scale"
                ]
            },
            {
                category: "MARITIME CYBER",
                items: [
                    "AIS spoofing and GPS jamming surging in Strait of Hormuz",
                    "Iran seizing vessels claiming AIS non-transmission",
                    "USDOT MARAD Advisory 2026-001 issued Feb 9 \u2014 official warning",
                    "Multiple vessels going AIS-dark simultaneously in Persian Gulf"
                ]
            },
            {
                category: "MARKET DYNAMICS",
                items: [
                    "Google-Wiz $32B acquisition reshaping cybersecurity competitive landscape",
                    "Pentagon AI guardrails dispute \u2014 Anthropic summoned, xAI/Google deals done",
                    "Israeli arrest of Polymarket traders using classified intelligence \u2014 leak vector confirmed",
                    "CrowdStrike earnings miss (-9.85% Feb 23) but sector demand persistent"
                ]
            }
        ],
        keyAssets: "Endpoint/cloud security platforms, OT/ICS security, AI-driven threat detection, maritime domain awareness",
        tickers: ["CRWD", "PANW", "FTNT", "PLTR"],
        sources: [
            {name: "Google Threat Intelligence", url: "https://cloud.google.com/security/threat-intelligence"},
            {name: "Dragos", url: "https://www.dragos.com/"},
            {name: "MARAD Advisory", url: "https://www.maritime.dot.gov/msci"}
        ]
    },
    {
        name: "CONUS / STRATEGIC",
        level: "ELEVATED",
        levelClass: "elevated",
        summary: "Massive defense spending acceleration with $153B reconciliation plan being fast-tracked into 2026. Nuclear modernization, missile defense, and B-21 production all ramping. FY2027 target of $1.5T would be the largest US defense budget in history.",
        evidence: [
            {
                category: "SPENDING ACCELERATION",
                items: [
                    "$153B Pentagon reconciliation spending plan released \u2014 accelerating all into 2026",
                    "$29B shipbuilding (new nuclear submarine), $24B munitions, $16B readiness",
                    "$24B Golden Dome missile defense (classified details)",
                    "White House targeting $1.5T defense budget for FY2027 \u2014 50%+ increase",
                    "FY2026 NDAA: $900.6B \u2014 first ever above $900B"
                ]
            },
            {
                category: "NUCLEAR MODERNIZATION",
                items: [
                    "B-21 Raider production accelerated 25% with $4.5B boost \u2014 Northrop deal",
                    "Sentinel ICBM program advancing \u2014 replacement for Minuteman III",
                    "Columbia-class SSBN ramp \u2014 next-gen nuclear deterrent",
                    "BWXT record $7.4B backlog \u2014 sole-source naval nuclear reactor supplier"
                ]
            },
            {
                category: "EMERGING THREATS",
                items: [
                    "Iran NYT (Feb 22): eyeing CONUS proxy strikes as retaliatory option",
                    "SDA satellite constellation for space-based early warning expanding",
                    "AFA Warfare Symposium: 27 new portfolio acquisition executives \u2014 reform push",
                    "CCA drone wingmen started flying with weapons (Air Force, Feb 24)"
                ]
            }
        ],
        keyAssets: "B-21, Sentinel ICBM, Columbia-class SSBN, Golden Dome, SDA HALO SATCOM, CCA drones",
        tickers: ["NOC", "BWXT", "CW", "PLTR", "RKLB"],
        sources: [
            {name: "NY Times", url: "https://www.nytimes.com/2026/02/23/us/politics/pentagon-military-congress-spending.html"},
            {name: "Defense One", url: "https://www.defenseone.com/threats/2026/02/the-d-brief-february-24-2026/411640/"}
        ]
    }
];

// === THEATER INTEL RENDERER ===
function renderTheaterIntel() {
    const grid = document.getElementById('theaterIntelGrid');
    if (!grid) return;
    grid.innerHTML = theaterIntelData.map(theater => {
        const evidenceHTML = theater.evidence.map(cat => `
            <div class="theater-intel-category">
                <div class="theater-intel-cat-header">${cat.category}</div>
                <ul class="theater-intel-items">
                    ${cat.items.map(item => `<li>${linkifyTickers(item)}</li>`).join('')}
                </ul>
            </div>
        `).join('');
        
        const tickersHTML = theater.tickers.map(t => tickerLink(t)).join(', ');
        const sourcesHTML = theater.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="source-link">${s.name}</a>`).join(' &bull; ');
        
        return `
            <div class="theater-intel-card theater-intel-${theater.levelClass}">
                <div class="theater-intel-header">
                    <div class="theater-intel-name">${theater.name}</div>
                    <span class="theater-level-badge ${theater.levelClass}">${theater.level}</span>
                </div>
                <div class="theater-intel-summary">${linkifyTickers(theater.summary)}</div>
                <div class="theater-intel-evidence">${evidenceHTML}</div>
                <div class="theater-intel-footer">
                    <div class="theater-intel-assets">
                        <span class="theater-intel-assets-label">KEY ASSETS:</span>
                        <span>${theater.keyAssets}</span>
                    </div>
                    <div class="theater-intel-tickers">
                        <span class="theater-intel-tickers-label">TICKERS:</span>
                        ${tickersHTML}
                    </div>
                    <div class="theater-intel-sources">
                        <span class="theater-intel-sources-label">SOURCES:</span>
                        ${sourcesHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

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
    renderTheaterIntel();
    // Fetch live prices from Sonar API
    fetchLivePrices();
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

function navigateToMatrixTicker(ticker) {
    // Switch to matrix tab
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const matrixBtn = document.querySelector('.tab-btn[data-tab="matrix"]');
    const matrixPanel = document.getElementById('panel-matrix');
    if (matrixBtn) matrixBtn.classList.add('active');
    if (matrixPanel) matrixPanel.classList.add('active');
    // Find and highlight the row
    setTimeout(() => {
        const rows = document.querySelectorAll('#matrixBody tr');
        rows.forEach(row => {
            row.classList.remove('matrix-highlight');
            const tickerCell = row.querySelector('.ticker-cell');
            if (tickerCell && tickerCell.textContent.trim() === ticker) {
                row.classList.add('matrix-highlight');
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => row.classList.remove('matrix-highlight'), 3000);
            }
        });
    }, 100);
}

function renderOverviewStocks() {
    const tbody = document.querySelector("#overviewStocks tbody");
    if (!tbody) return;
    const top5 = stockData.filter(s => s.direction === 'bullish').slice(0, 5);
    tbody.innerHTML = top5.map(stock => {
        const scorePrefix = stock.score > 0 ? '+' : '';
        return `
            <tr class="overview-clickable-row" data-ticker="${stock.ticker}">
                <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
                <td class="company-cell">${stock.company}</td>
                <td class="price-cell">$${stock.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
                <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            </tr>
        `;
    }).join('');
    // Add click handlers (avoid intercepting ticker-link clicks)
    tbody.querySelectorAll('.overview-clickable-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('a.ticker-link')) return;
            navigateToMatrixTicker(row.dataset.ticker);
        });
    });
}

function renderOverviewBearish() {
    const tbody = document.querySelector("#overviewBearish tbody");
    if (!tbody) return;
    const bearish = stockData.filter(s => s.direction === 'bearish');
    tbody.innerHTML = bearish.map(stock => {
        const scorePrefix = stock.score > 0 ? '+' : '';
        return `
            <tr class="row-highlight-bottom overview-clickable-row" data-ticker="${stock.ticker}">
                <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
                <td class="company-cell">${stock.company}</td>
                <td class="price-cell">$${stock.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
                <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            </tr>
        `;
    }).join('');
    // Add click handlers
    tbody.querySelectorAll('.overview-clickable-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('a.ticker-link')) return;
            navigateToMatrixTicker(row.dataset.ticker);
        });
    });
}

function formatSignalDateTime(date, time) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const parts = date.split('-');
    const m = months[parseInt(parts[1], 10) - 1];
    const d = parseInt(parts[2], 10);
    const hhmm = time || '00:00';
    const [hh, mm] = hhmm.split(':').map(Number);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 || 12;
    return `${m} ${d}, ${h12}:${mm.toString().padStart(2,'0')} ${ampm}`;
}

function renderSourceLinks(sources) {
    if (!sources || sources.length === 0) return '';
    const links = sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="signal-source-link">${s.name}</a>`).join(' ');
    return `<span class="signal-sources">${links}</span>`;
}

function renderOverviewFeed() {
    const feed = document.getElementById("overviewFeed");
    if (!feed) return;
    const sorted = signalsFeedData.slice().sort((a, b) => {
        const da = a.date + (a.time || "00:00");
        const db = b.date + (b.time || "00:00");
        return db.localeCompare(da);
    });
    const recent = sorted.slice(0, 8);
    feed.innerHTML = recent.map((sig, i) => `
        <div class="signal-entry${sig.recent ? ' recent' : ''}" style="animation-delay:${i * 0.05}s">
            <span class="signal-date">${formatSignalDateTime(sig.date, sig.time)}</span>
            <span class="signal-tag ${sig.tagClass}">${sig.tag}</span>
            <span class="signal-text">${linkifyTickers(sig.text)}${renderSourceLinks(sig.sources)}</span>
        </div>
    `).join('');
}

// Track chart instances for proper cleanup on re-render
let _overviewChartInstance = null;
let _etfChartInstance = null;
let _tenDayChartInstance = null;

function renderOverviewChart() {
    const canvas = document.getElementById("overviewChart");
    if (!canvas) return;
    if (_overviewChartInstance) { _overviewChartInstance.destroy(); _overviewChartInstance = null; }
    const ctx = canvas.getContext("2d");
    _overviewChartInstance = new Chart(ctx, {
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
// ============================================
// RENDER ETF TAB — POSITION CHANGES SECTION
// ============================================
function renderPositionChanges() {
    const container = document.getElementById('positionChangesGrid');
    if (!container) return;

    const upgrades = positionChanges.filter(p => p.action === 'UPGRADE');
    const downgrades = positionChanges.filter(p => p.action === 'DOWNGRADE');
    const holds = positionChanges.filter(p => p.action === 'HOLD');
    const priorityActions = positionChanges.filter(p => p.priority !== null);

    // Summary stats
    const summaryEl = document.getElementById('posChangeSummary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="pos-change-stat">
                <span class="pos-stat-count upgrade-count">${upgrades.length}</span>
                <span class="pos-stat-label">UPGRADES</span>
            </div>
            <div class="pos-change-stat">
                <span class="pos-stat-count downgrade-count">${downgrades.length}</span>
                <span class="pos-stat-label">DOWNGRADES</span>
            </div>
            <div class="pos-change-stat">
                <span class="pos-stat-count hold-count">${holds.length}</span>
                <span class="pos-stat-label">REVIEWED / HELD</span>
            </div>
            <div class="pos-change-stat">
                <span class="pos-stat-count net-count">${upgrades.length - downgrades.length > 0 ? '+' : ''}${upgrades.length - downgrades.length}</span>
                <span class="pos-stat-label">NET SCORE CHANGE</span>
            </div>
            <div class="pos-change-stat priority-stat">
                <span class="pos-stat-count priority-count">${priorityActions.length}</span>
                <span class="pos-stat-label">PRIORITY ACTIONS</span>
            </div>
        `;
    }

    let html = '';
    // Sort: priority high first, then medium, then non-priority
    const priorityOrder = { high: 0, medium: 1 };
    const allChanges = [...upgrades, ...holds, ...downgrades];
    allChanges.sort((a, b) => {
        const aP = a.priority ? (priorityOrder[a.priorityUrgency] ?? 2) : 3;
        const bP = b.priority ? (priorityOrder[b.priorityUrgency] ?? 2) : 3;
        if (aP !== bP) return aP - bP;
        return 0; // preserve original order within same priority
    });

    allChanges.forEach((pc, i) => {
        const isUpgrade = pc.action === 'UPGRADE';
        const isDowngrade = pc.action === 'DOWNGRADE';
        const actionClass = isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'hold';
        const arrow = isUpgrade ? '&#9650;' : isDowngrade ? '&#9660;' : '&#9654;';
        const scoreDelta = pc.newScore - pc.oldScore;
        const deltaStr = scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta === 0 ? '0' : `${scoreDelta}`;

        // Live price + day change — pull from shared stockData for consistency
        const liveStock = stockData.find(s => s.ticker === pc.ticker);
        const livePrice = liveStock ? liveStock.price : pc.price;
        const liveDayChange = (liveStock && typeof liveStock.dayChange === 'number') ? liveStock.dayChange : (pc.dayChange || 0);
        const priceStr = '$' + livePrice.toFixed(2);
        const changeSign = liveDayChange >= 0 ? '+' : '';
        const changeClass = liveDayChange >= 0 ? 'day-positive' : 'day-negative';
        const changeStr = `${changeSign}${liveDayChange.toFixed(2)}%`;

        // Priority action badge
        let priorityHtml = '';
        if (pc.priority) {
            const pClass = pc.priority === 'BUY' ? 'priority-buy' : pc.priority === 'EXIT' ? 'priority-exit' : 'priority-reduce';
            const pIcon = pc.priority === 'BUY' ? '&#9650;' : pc.priority === 'EXIT' ? '&#9747;' : '&#9660;';
            const urgencyLabel = pc.priorityUrgency === 'high' ? 'IMMEDIATE' : 'NEAR-TERM';
            priorityHtml = `
            <div class="priority-action-banner ${pClass}">
                <div class="priority-action-header">
                    <span class="priority-action-icon">${pIcon}</span>
                    <span class="priority-action-label">${urgencyLabel} — ${pc.priority}</span>
                    <span class="priority-action-pulse"></span>
                </div>
                <div class="priority-action-rationale">${linkifyTickers(pc.priorityRationale)}</div>
            </div>`;
        }

        const hasPriority = pc.priority !== null;

        html += `
        <div class="pos-change-card ${actionClass}${hasPriority ? ' has-priority' : ''}${hasPriority ? ' priority-' + pc.priorityUrgency : ''}" style="animation-delay:${i * 0.06}s">
            ${priorityHtml}
            <div class="pos-change-header">
                <div class="pos-change-ticker-group">
                    <span class="pos-change-action-badge ${actionClass}">${arrow} ${pc.action}</span>
                    <span class="pos-change-ticker">${tickerLink(pc.ticker)}</span>
                    <span class="pos-change-company">${pc.company}</span>
                    <span class="pos-change-price-live">
                        <span class="pos-price-value">${priceStr}</span>
                        <span class="pos-day-change ${changeClass}">${changeStr}</span>
                    </span>
                </div>
                <div class="pos-change-score-shift">
                    <span class="pos-old-score">+${pc.oldScore}</span>
                    <span class="pos-arrow">&rarr;</span>
                    <span class="pos-new-score ${actionClass}">+${pc.newScore}</span>
                    <span class="pos-delta ${actionClass}">(${deltaStr})</span>
                </div>
            </div>
            <div class="pos-change-signal">${linkifyTickers(pc.signal)}</div>
            <div class="pos-change-catalysts">
                ${pc.catalysts.map(c => `<span class="pos-catalyst-tag ${actionClass}">${c}</span>`).join('')}
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

// ============================================
// ETF TAB — Full Section
// ============================================
function renderETFTab() {
    // Position changes section (new Feb 24)
    renderPositionChanges();

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
            const barWidth = Math.min(((h.weight / 0.12) * 100), 100).toFixed(1);
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
                <td><div class="weight-bar-container"><div class="weight-bar-fill" style="width:${barWidth}%"></div><span class="weight-bar-label">${weightPct}%</span></div></td>
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
    if (_etfChartInstance) { _etfChartInstance.destroy(); _etfChartInstance = null; }
    const ctx = canvas.getContext("2d");
    _etfChartInstance = new Chart(ctx, {
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
                <div class="etf-hero-sub">Feb 10 &rarr; Feb 23, 2026</div>
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
    const labels = ["Feb 10", "Feb 11", "Feb 12", "Feb 13", "Feb 14", "Feb 18", "Feb 19", "Feb 20", "Feb 21", "Feb 23"];
    const etfData =  [100, 101.2, 102.1, 101.8, 102.9, 103.2, 103.8, 104.3, 104.9, 105.3];
    const itaData =  [100, 100.9, 101.5, 101.2, 102.4, 102.8, 103.3, 103.8, 104.5, 104.8];
    const spyData =  [100, 100.0, 100.3, 100.1, 100.5, 100.7, 100.5, 100.3, 100.1, 100.4];

    if (_tenDayChartInstance) { _tenDayChartInstance.destroy(); _tenDayChartInstance = null; }
    _tenDayChartInstance = new Chart(ctx, {
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
            <div class="basket-disclaimer">Share counts based on Feb 23 closing prices. <strong>Not financial advice. For research purposes only.</strong></div>
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
// ============================================
// LIVE PRICE FETCHING — Polygon.io Real-Time API
// Direct client-side calls for real-time quotes
// ============================================

const POLYGON_API_KEY = "0LypqHjCkZpXfYdbUbYMJPXIISPoM0zp";
const POLYGON_BASE = "https://api.polygon.io";

// Tickers available via batch snapshot (exchange-listed)
const BATCH_TICKERS = ["LMT","RTX","NOC","KTOS","RKLB","BWXT","HII","CW","GD","LHX","PLTR","AVAV","MRCY","BA","LDOS","FTNT","CRWD","JOBY","ACHR","PANW","SAIC","BAH"];
// OTC tickers need individual last-trade endpoint
const OTC_TICKERS = ["BAESY"];

async function fetchLivePrices() {
    const dot = document.getElementById("priceStatusDot");
    const footnoteText = document.getElementById("priceFootnoteText");
    let updated = 0;

    try {
        // 1. Batch fetch exchange-listed tickers via snapshot
        const batchUrl = POLYGON_BASE + "/v2/snapshot/locale/us/markets/stocks/tickers?tickers=" +
            BATCH_TICKERS.join(",") + "&apiKey=" + POLYGON_API_KEY;
        const batchRes = await fetch(batchUrl);
        if (!batchRes.ok) throw new Error("Polygon snapshot returned " + batchRes.status);
        const batchData = await batchRes.json();

        if (batchData.tickers && Array.isArray(batchData.tickers)) {
            batchData.tickers.forEach(t => {
                const stock = stockData.find(s => s.ticker === t.ticker);
                if (!stock) return;
                // Use fair market value if available, otherwise last trade, otherwise day close
                const price = t.fmv || (t.lastTrade && t.lastTrade.p) || (t.day && t.day.c);
                if (price && price > 0) {
                    stock.price = Math.round(price * 100) / 100;
                    if (typeof t.todaysChangePerc === "number") {
                        stock.dayChange = Math.round(t.todaysChangePerc * 100) / 100;
                    }
                    updated++;
                }
            });
        }
    } catch (err) {
        console.warn("[DSM] Polygon batch fetch failed:", err.message);
    }

    // 2. Fetch OTC tickers individually (non-blocking)
    for (const otcTicker of OTC_TICKERS) {
        try {
            const otcUrl = POLYGON_BASE + "/v2/last/trade/" + otcTicker + "?apiKey=" + POLYGON_API_KEY;
            const otcRes = await fetch(otcUrl);
            if (!otcRes.ok) continue;
            const otcData = await otcRes.json();
            if (otcData.results && otcData.results.p > 0) {
                const stock = stockData.find(s => s.ticker === otcTicker);
                if (stock) {
                    stock.price = Math.round(otcData.results.p * 100) / 100;
                    updated++;
                }
            }
        } catch (e) {
            console.warn("[DSM] OTC fetch failed for " + otcTicker + ":", e.message);
        }
    }

    // 3. For BAESY, get previous close to calculate day change
    try {
        const prevUrl = POLYGON_BASE + "/v2/aggs/ticker/BAESY/prev?adjusted=true&apiKey=" + POLYGON_API_KEY;
        const prevRes = await fetch(prevUrl);
        if (prevRes.ok) {
            const prevData = await prevRes.json();
            if (prevData.results && prevData.results.length > 0) {
                const prevClose = prevData.results[0].c;
                const baesy = stockData.find(s => s.ticker === "BAESY");
                if (baesy && prevClose > 0) {
                    baesy.dayChange = Math.round(((baesy.price - prevClose) / prevClose) * 10000) / 100;
                }
            }
        }
    } catch (e) {
        console.warn("[DSM] BAESY prev close fetch failed:", e.message);
    }

    // 4. Re-render all price-dependent views
    if (updated > 0) {
        try {
            renderOverview();
            renderMatrix(stockData);
            renderETFTab();
        } catch (renderErr) {
            console.warn("[DSM] Re-render error (non-fatal):", renderErr.message);
        }
    }

    // 5. Update footnote with timestamp (always update if we got any prices)
    const now = new Date();
    const timeStr = now.toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
        hour12: true, timeZoneName: "short"
    });

    if (updated > 0) {
        if (dot) { dot.className = "footnote-dot live"; }
        if (footnoteText) {
            footnoteText.innerHTML = '* Prices as of ' + timeStr +
                '. ' + updated + '/' + stockData.length + ' tickers updated via <a href="https://polygon.io" target="_blank" rel="noopener">Polygon.io</a>.';
        }
        console.log("[DSM] Live prices updated:", updated, "tickers from Polygon.io");
    } else {
        if (dot) { dot.className = "footnote-dot"; }
        if (footnoteText) {
            footnoteText.innerHTML = '* Prices as of ' + timeStr + '. ' +
                '<a href="https://polygon.io" target="_blank" rel="noopener">Polygon.io</a>.';
        }
        console.warn("[DSM] No prices updated from Polygon.io");
    }
}

// Refresh prices every 60 seconds during market hours
setInterval(() => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    // Market hours: 9:30 AM - 4:00 PM ET = ~13:30 - 21:00 UTC
    if (utcHour >= 13 && utcHour <= 21) {
        fetchLivePrices();
    }
}, 60000);
