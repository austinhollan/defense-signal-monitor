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
    { ticker: "LMT", company: "Lockheed Martin", price: 641.37, dayChange: -0.95, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: F-35/F-22 engaged in Iran strikes. PAC-3 intercepting Iranian missiles. Record $194B backlog. Morningstar: defense becoming subscription model. F-47 win. $480M Navy ASW contract. 6 politician buys. Expect significant Monday gap up." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 196.49, dayChange: 0.26, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Tomahawk missiles fired at Iran. Patriot batteries intercepting Iranian retaliation. $50B sustainment through 2045. StormBreaker approved. Most Congress-traded defense stock. Iran strikes = unprecedented Patriot/Tomahawk demand validation." },
    { ticker: "NOC", company: "Northrop Grumman", price: 704.93, dayChange: 0.18, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: B-21 Raiders engaged in Iran strikes — combat-validated for second time. Production +25% ($4.5B) in reconciliation. Midnight Hammer repeat confirmed. Sentinel ICBM. Nuclear modernization centerpiece. IDF struck 'hundreds of military sites.'" },
    { ticker: "KTOS", company: "Kratos Defense", price: 89.04, dayChange: 0.92, score: 3, direction: "neutral", summary: "DOWNGRADED: -5.90% selloff despite $12.4M CCA engine contract (Feb 23, AFA) and $1.1B Drone Dominance. Market skepticism on execution timeline. Momentum deterioration." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 70.39, dayChange: 0.27, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. SDA HALO tactical SATCOM demo ecosystem. Space-based tracking." },
    { ticker: "BWXT", company: "BWX Technologies", price: 202.57, dayChange: -2.74, score: 5, direction: "bullish", summary: "Nuclear emphasis in $153B reconciliation spend. Sole-source naval nuclear. Active carrier operations in Iran theater = accelerated nuclear submarine demand. Zero DOGE risk. Record $7.4B backlog. B-21 nuclear systems engaged." },
    { ticker: "HII", company: "Huntington Ingalls", price: 434.48, dayChange: -0.25, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Dual carrier strike groups (Ford + Lincoln) + 25-35 surface vessels engaged. CENTCOM: 'Armada fully operational.' $29B shipbuilding in reconciliation. Only nuclear shipyard. Naval assets in active combat operations." },
    { ticker: "CW", company: "Curtiss-Wright", price: 686.53, dayChange: -1.74, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. AFA Warfare Symposium acquisition reform tailwind." },
    { ticker: "GD", company: "General Dynamics", price: 343.85, dayChange: 0.21, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. SSGN deployment confirmed." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 349.15, dayChange: 2.38, score: 5, direction: "bullish", summary: "UPGRADED TO 5: Active combat operations = maximum EW/comms/sensor demand. F-22 Raptors engaged in Iran. Every aircraft in theater uses L3Harris electronic warfare and communications gear. Book-to-bill 1.5x. Iran strikes validate entire product line." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 133.32, dayChange: -0.65, score: 5, direction: "bullish", summary: "UPGRADED TO 5: OpenAI wins Pentagon AI contract after Anthropic designated 'supply-chain risk to national security.' PLTR incumbent AI/targeting platform benefits from active combat ops. Real-time battlefield intelligence demand surging. $10B Army contract." },
    { ticker: "AVAV", company: "AeroVironment", price: 256.48, dayChange: 0.49, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. Iran escalation = loitering munitions demand surge. Ukraine front stabilizing." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 114.01, dayChange: -0.84, score: 4, direction: "bullish", summary: "UPGRADED: $500M+ Army Paladin howitzer contract (Feb 27). European NATO re-arming supercycle. Iran strikes = allied rearmament acceleration. Front-line states accelerating spending. +16.29% in 10-day backtest." },
    { ticker: "MRCY", company: "Mercury Systems", price: 87.25, dayChange: -2.30, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. Iran crisis = accelerated Patriot/F-35 procurement." },
    { ticker: "BA", company: "Boeing", price: 226.95, dayChange: -1.48, score: 2, direction: "neutral", summary: "F-47 NGAD win. CCA weapon integration testing begun (YFQ-44A inert AIM-120 Feb 23). BUT commercial crisis, high leverage." },
    { ticker: "LDOS", company: "Leidos Holdings", price: 175.60, dayChange: 3.36, score: 2, direction: "neutral", summary: "DOGE risk materializing. Navy NGEN. DOGE cuts hitting IT services." },
    { ticker: "FTNT", company: "Fortinet", price: 78.63, dayChange: 1.65, score: 1, direction: "neutral", summary: "OT/ICS security growth. Google-Wiz deal ($32B) competitive threat. Chinese/Iranian APTs targeting defense industry (Feb 17 Dragos report)." },
    { ticker: "CRWD", company: "CrowdStrike", price: 377.41, dayChange: 3.88, score: 0, direction: "bearish", summary: "DOWNGRADED TO EXCLUDED: Earnings miss — stock -9.85% Feb 23. Execution failure. Moved to excluded on negative momentum despite persistent cyber demand." },
    { ticker: "JOBY", company: "Joby Aviation", price: 10.10, dayChange: 2.85, score: 1, direction: "neutral", summary: "Military logistics potential. But pre-revenue, limited defense utility." },
    { ticker: "ACHR", company: "Archer Aviation", price: 7.09, dayChange: -0.14, score: 0, direction: "neutral", summary: "Limited defense utility. eVTOL speculation." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 148.49, dayChange: 2.52, score: -1, direction: "bearish", summary: "Platformization headwinds. Near 52-week low. Google-Wiz deal pressuring valuation. APT competition heating." },
    { ticker: "SAIC", company: "Science Applications", price: 91.16, dayChange: 5.04, score: -2, direction: "bearish", summary: "$95M GAO IT modernization contract win (Feb 27). Still DOGE-exposed but new contract provides some cushion. Upgrading from -3 to -2." },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 79.63, dayChange: 6.02, score: -3, direction: "bearish", summary: "DOGE devastation offset: $697M Army MCTP training contract win (Feb 27). Active combat operations = surge in training/simulation demand. But still DOGE-exposed on civil side. Upgrading from -5 to -3 on new contract." }
];

// === SIGNALS FEED DATA ===
const signalsFeedData = [
    { date: "2026-03-01", time: "14:00", tag: "MILTRACK", tagClass: "miltrack", text: '<strong>3 US service members killed, 5 seriously wounded</strong> in Iranian retaliatory strikes on US installations in the Gulf region. CENTCOM confirms casualties from ballistic missile and drone attacks on bases in Bahrain and UAE. First US KIA since Operation Epic Fury began. <strong>TICKERS: LMT, RTX, NOC, HII, GD, LHX.</strong>', recent: true, sources: [{"name": "CENTCOM", "url": "https://www.centcom.mil/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "12:00", tag: "CYBER", tagClass: "cyber", text: 'WSJ: CENTCOM used Anthropic Claude AI during Operation Epic Fury strikes <strong>despite Anthropic being designated a \'supply-chain risk to national security\'</strong> by Pentagon. AI used for targeting analysis and battle damage assessment. Raises questions about DoD AI procurement and Anthropic\'s classified access status. <strong>TICKERS: PLTR.</strong>', recent: true, sources: [{"name": "Wall Street Journal", "url": "https://www.wsj.com/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "10:00", tag: "MILTRACK", tagClass: "miltrack", text: 'Fox News: <strong>1,000+ Iranian military sites struck in first 24 hours</strong> of Operation Epic Fury. US and Israeli forces continue round-the-clock operations. Pentagon describes campaign as \'most intensive aerial campaign since Iraq 2003.\' <strong>TICKERS: LMT, RTX, NOC, LHX, HII, BWXT.</strong>', recent: true, sources: [{"name": "Fox News", "url": "https://www.foxnews.com/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "08:00", tag: "OSINT", tagClass: "osint", text: 'Iran continues retaliatory strikes on Bahrain — <strong>smoke rising from Manama</strong> visible in satellite imagery and social media. Iranian ballistic missiles targeting US Naval Support Activity Bahrain (5th Fleet HQ). Gulf state infrastructure under sustained attack. <strong>TICKERS: LMT, RTX, NOC, HII, GD.</strong>', recent: true, sources: [{"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "06:00", tag: "OSINT", tagClass: "osint", text: 'Politico: <strong>Pentagon offers no evidence of imminent threat</strong> that justified Operation Epic Fury. Critics question legal basis for strikes. Administration cites 2001/2002 AUMFs and Article II powers. Congress demands briefing. <strong>TICKERS: LMT, RTX, NOC.</strong>', recent: true, sources: [{"name": "Politico", "url": "https://www.politico.com/"}] },
    { date: "2026-03-01", time: "04:00", tag: "CONTRACT", tagClass: "contract", text: 'Photonis Defense awarded <strong>$352.6M Army contract</strong> for Binocular Night Observation Device (BiNOD) systems. Multi-year procurement for next-gen night vision across infantry units. <strong>Night vision/optics supply chain beneficiary.</strong>', recent: true, sources: [{"name": "DoD Contracts", "url": "https://www.defense.gov/News/Contracts/"}] },
    { date: "2026-03-01", time: "02:00", tag: "CONTRACT", tagClass: "contract", text: 'UK awards Leonardo <strong>£1B military helicopter contract</strong> (Reuters). Covers AW149 medium-lift helicopters for British Army to replace aging Puma fleet. European defense spending acceleration continues. <strong>TICKERS: BAESY (European defense proxy).</strong>', recent: true, sources: [{"name": "Reuters", "url": "https://www.reuters.com/"}] },
    { date: "2026-02-28", time: "22:30", tag: "OSINT", tagClass: "osint", text: 'Iranians celebrate in streets of Karaj and Galehdar City after reports of Supreme Leader Khamenei\'s death. @sentdefender: \'I\'ll miss our conversations\' — posts GIF referencing Khamenei. Regime collapse signals emerging. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII, BWXT.</strong>', recent: true, sources: [{name: "@sentdefender", url: "https://x.com/sentdefender/status/2027876133039997364"}, {name: "@sentdefender", url: "https://x.com/sentdefender/status/2027877189488636270"}] },
    { date: "2026-02-28", time: "22:06", tag: "MILTRACK", tagClass: "miltrack", text: 'CENTCOM debunks Iranian propaganda: \"No U.S. casualties. No U.S. Navy ship struck. The Armada is fully operational. Damage to U.S. installations minimal — has not impacted operations.\" Iran claims of 50 dead U.S. service members called a LIE. <strong>TICKERS: LMT, RTX, NOC, HII, GD.</strong>', recent: true, sources: [{name: "U.S. Central Command (@CENTCOM)", url: "https://x.com/CENTCOM/status/2027868060217192498"}] },
    { date: "2026-02-28", time: "22:00", tag: "OSINT", tagClass: "osint", text: 'Dubai International Airport concourse damaged by Iranian drone attack — 4 staff injured. Dubai Media Office confirms minor structural damage. Iran retaliating against Gulf states hosting US forces. UAE, Saudi Arabia, Bahrain, Kuwait, Jordan all targeted. <strong>TICKERS: LMT, RTX, NOC, LHX, HII.</strong>', recent: true, sources: [{name: "@sentdefender", url: "https://x.com/sentdefender/status/2027874896349393206"}] },
    { date: "2026-02-28", time: "19:28", tag: "OSINT", tagClass: "osint", text: 'Trump tells Axios from Mar-a-Lago: \"I can go long and take over the whole thing, or end it in two or three days.\" Claims several \'off ramps\' from Operation Epic Fury. \"In any case, it will take them several years to recover from this attack.\" VP Vance monitors from Situation Room. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII.</strong>', recent: true, sources: [{name: "@sentdefender (Axios interview)", url: "https://x.com/sentdefender/status/2027828107697099138"}] },
    { date: "2026-02-28", time: "17:00", tag: "MILTRACK", tagClass: "miltrack", text: '<strong>OPERATION EPIC FURY LAUNCHED.</strong> US and Israel conducting massive strike campaign across Iran. Trump declares military operations in video statement, urges Iranian people to rise against regime. Objectives: destroy nuclear program, dismantle missile capability, neutralize Iranian navy, eliminate Axis of Resistance. <strong>B-21 RAIDERS, TOMAHAWKS, F-22/F-35 ALL ENGAGED. TICKERS: LMT, RTX, NOC, GD, LHX, HII, BWXT, KTOS, RKLB.</strong>', recent: true, sources: [{name: "LiveNOW from FOX", url: "https://www.livenowfox.com/news/us-military-strikes-iran"}, {name: "ISW Special Report", url: "https://understandingwar.org/research/middle-east/iran-update-special-report-us-and-israeli-strikes-february-28-2026/"}] },
    { date: "2026-02-28", time: "15:12", tag: "OSINT", tagClass: "osint", text: 'Fox News: <strong>Supreme Leader Ayatollah Khamenei confirmed dead</strong> per Israeli officials. Khamenei\'s compound and offices in Tehran hit during strikes. 40+ Iranian security/regime figures killed including IRGC commander, defense minister, Security Council secretary, and head of Khamenei\'s military bureau. <strong>REGIME DECAPITATION. TICKERS: ALL PRIMES.</strong>', recent: true, sources: [{name: "NPR", url: "https://www.npr.org/2026/02/28/nx-s1-5730158/israel-iran-strikes-trump-us"}, {name: "LiveNOW from FOX", url: "https://www.livenowfox.com/news/us-military-strikes-iran"}] },
    { date: "2026-02-28", time: "14:20", tag: "OSINT", tagClass: "osint", text: 'Netanyahu nationally televised address: \"There are growing signs that Khamenei is no longer around.\" IDF reports striking <strong>\"hundreds of military sites\"</strong> including missile launchers in western Iran. Iran\'s Foreign Ministry calls attack \'gross violation\' of sovereignty. Iranian Red Crescent: 200+ killed. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "NPR", url: "https://www.npr.org/2026/02/28/nx-s1-5730158/israel-iran-strikes-trump-us"}, {name: "LiveNOW from FOX", url: "https://www.livenowfox.com/news/us-military-strikes-iran"}] },
    { date: "2026-02-28", time: "08:40", tag: "CONFLICT", tagClass: "conflict", text: '<strong>IRAN RETALIATES.</strong> ~35 missiles (Emad/Ghadr) fired at Israel by 5:42 AM ET. Air raid sirens in Israel. Iran also strikes US bases across Bahrain, UAE, Kuwait, Jordan, Saudi Arabia. Dubai airport concourse damaged. CENTCOM: no US casualties, US Navy fleet fully operational. Iraqi PMF airstrikes in Jurf al Sakhr — 2 PMF killed. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII.</strong>', recent: true, sources: [{name: "ISW Special Report", url: "https://understandingwar.org/research/middle-east/iran-update-special-report-us-and-israeli-strikes-february-28-2026/"}, {name: "NPR", url: "https://www.npr.org/2026/02/28/nx-s1-5730158/israel-iran-strikes-trump-us"}] },
    { date: "2026-02-28", time: "12:00", tag: "POLYMARKET", tagClass: "polymarket", text: '<strong>POLYMARKET RESOLVED: US strikes Iran by Feb 28 = YES.</strong> $529M total volume on Iran strike contracts. Bloomberg reports 6 accounts made ~$1M profit — all freshly created in February, shares purchased hours before first explosions at ~$0.10. Blockchain sleuths hunting insider trading. Gulf state strike Iran by Mar 7: 46%. Iran strike gulf oil facilities by Mar 31: 51%. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2026-02-28/polymarket-iran-bets-hit-529-million-as-new_wallets-draw-notice"}, {name: "Polymarket", url: "https://polymarket.com/event/will-a-gulf-state-strike-iran-by-march-7"}] },
    { date: "2026-02-28", time: "08:00", tag: "CYBER", tagClass: "cyber", text: '<strong>OpenAI wins Pentagon AI contract</strong> hours after Anthropic was cut. Trump on Truth Social: \"We don\'t need it, we don\'t want it.\" Hegseth designates Anthropic a <strong>\"supply-chain risk to national security.\"</strong> Altman: DoW \"displayed deep respect for safety.\" PLTR/xAI/Google already integrated. <strong>TICKERS: PLTR.</strong>', recent: true, sources: [{name: "Business Insider", url: "https://www.businessinsider.com/openai-ai-deal-sam-altman-pentagon-defense-department-anthropic-2026-2"}, {name: "The Meridiem", url: "https://www.themeridiem.com/ai/2026/2/28/openai-wins-pentagon-ai-contract_as-technical-safeguards-become-vendor-baseline"}] },
    { date: "2026-02-28", time: "10:00", tag: "EARNINGS", tagClass: "spending", text: 'Morningstar/MarketWatch: Iran strikes will boost defense stocks when markets reopen Monday. Analyst thesis: defense sector evolving into <strong>subscription-model businesses</strong> — maintenance contracts drive recurring revenue on growing installed base. LMT F-35 program = 26% of sales. RTX Patriot sustainment through 2045. NOC B-21 long-term support. <strong>BULLISH: LMT, RTX, NOC.</strong>', recent: true, sources: [{name: "Morningstar", url: "https://www.morningstar.com/news/marketwatch/20260228188/us-strikes-on-iran-will-likely-boost-defense-stocks-heres-what-will-keep-the-cash-flowing-even-after-the-conflict-ends"}] },
    { date: "2026-02-27", time: "18:00", tag: "CONTRACT", tagClass: "contract", text: 'BAE Systems books <strong>$500M+ Army contract</strong> for additional M109A7 Paladin self-propelled howitzers. Artillery production acceleration supports long-range fires modernization. <strong>TICKERS: BAESY.</strong>', recent: true, sources: [{name: "GovCon Wire", url: "https://www.govconwire.com/articles/saic-gao-95m-tis-contract-win"}] },
    { date: "2026-02-27", time: "16:00", tag: "CONTRACT", tagClass: "contract", text: 'Booz Allen Hamilton secures <strong>$697M Army MCTP</strong> training support contract. Covers mission command training, simulation exercises, and large-scale combat operations training worldwide. <strong>TICKERS: BAH.</strong>', recent: true, sources: [{name: "Washington Technology", url: "https://www.washingtontechnology.com/contracts/2026/02/booz-allen-wins-697m-army-training-support-contract/411755/"}, {name: "GovCon Wire", url: "https://www.govconwire.com/articles/booz-allen-697m-army-mctp-training-contract"}] },
    { date: "2026-02-27", time: "14:00", tag: "CONTRACT", tagClass: "contract", text: 'SAIC wins <strong>$95M GAO contract</strong> for enterprise IT modernization services under Technical Information Services program. End-to-end IT support for Government Accountability Office. <strong>TICKERS: SAIC.</strong>', recent: true, sources: [{name: "GovCon Wire", url: "https://www.govconwire.com/articles/saic-gao-95m-tis-contract-win"}] },
    { date: "2026-02-25", time: "17:00", tag: "MILTRACK", tagClass: "miltrack", text: 'Air Force begins weapons integration testing on Anduril YFQ-44A Fury CCA — captive carry of inert AIM-120 AMRAAM confirmed. Gen. Wilsbach: \'CCA is a critical part of a larger system-of-systems.\' Northrop names its CCA \'Talon Blue\' (YFQ-48A); GE-Kratos wins engine contract. <strong>TICKERS: KTOS, NOC, BA.</strong>', recent: true, sources: [{name: "Air Combat Command", url: "https://www.acc.af.mil/News/Article-Display/Article/4414428/collaborative-combat-aircraft-program-progresses-through-deliberate_weapons-int/"}, {name: "Defense One", url: "https://www.defenseone.com/business/2026/02/defense-business-brief-obbb-funding-counterdrone-manufacturing-and-cca_update/411673/"}] },
    { date: "2026-02-25", time: "16:30", tag: "OSINT", tagClass: "osint", text: 'Trump confirms weighing \'limited military strikes\' on Iran if Geneva talks fail Thursday. State Dept orders non-emergency departure from Beirut embassy. USS Ford joins USS Lincoln — rare dual-carrier deployment signals sustained air campaign readiness. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII.</strong>', recent: true, sources: [{name: "Washington Post", url: "https://www.washingtonpost.com/world/2026/02/25/iran-us-war-geneva-talks-nuclear/63c7f2c0-1230-11f1-8e8d-fe91db44677b_story.html"}, {name: "Indian Express", url: "https://indianexpress.com/article/world/us-news/iran-us-tensions-live-updates-trump-airstrikes-evacuations-tehran-warning-10548624/"}] },
    { date: "2026-02-25", time: "15:30", tag: "POLYMARKET", tagClass: "polymarket", text: 'UPDATED: Polymarket \'US strikes Iran by Mar 31\' now at <strong>61%</strong> ($16.8M vol). By Feb 28: 11% ($44.6M). By Jun 30: 70%. By Dec 31: 75%. Total market volume: <strong>$418M</strong>. Israel strikes Iran Feb 28: 9% ($2.4M). Strike curve steepening into Geneva talks. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "Polymarket", url: "https://polymarket.com/event/us-strikes-iran-by"}, {name: "Binance", url: "https://www.binance.com/en/square/post/02-25-2026-62-295294650196305"}] },
    { date: "2026-02-25", time: "14:00", tag: "CONTRACT", tagClass: "contract", text: 'SOSi awarded position on $100M USSOUTHCOM IDIQ for Enhanced Domain Awareness — strategic/technical services for Southern Command. Space supply chain stretch: SDA + SSC pursuing hundreds of new LEO/MEO satellites; Boeing opens new IR sensor production line. <strong>TICKERS: RKLB, NOC, BA, LMT.</strong>', recent: true, sources: [{name: "GovCon Wire", url: "https://www.govconwire.com/articles/sosi-ussouthcom-enhanced-domain-awareness"}, {name: "Breaking Defense", url: "https://breakingdefense.com/2026/02/the-space-supply-chain-is-getting-stretched-heres-how-it_could-impact-the-pentagons-plans/"}] },
    { date: "2026-02-25", time: "12:30", tag: "OSINT", tagClass: "osint", text: 'Iran accuses Trump of \'big lies\' ahead of Geneva Round 3 (Thursday). Baghaei: \'concept of limited strike does not exist — any aggression will be met with ferocious response.\' Araghchi: \'We must strike US bases.\' 15-day Trump ultimatum window narrowing. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, KTOS.</strong>', recent: true, sources: [{name: "Washington Post", url: "https://www.washingtonpost.com/world/2026/02/25/iran-us-war-geneva-talks-nuclear/63c7f2c0-1230-11f1-8e8d-fe91db44677b_story.html"}, {name: "Yahoo Finance", url: "https://finance.yahoo.com/news/trump-sets-deal-deadline-iran-123033056.html"}] },
    { date: "2026-02-25", time: "10:00", tag: "MILTRACK", tagClass: "miltrack", text: '12 F-22 Raptors land in Israel — first-ever F-22 deployment to Israel (never sold abroad due to US law). Signals serious US force posture escalation. Combined with dual-carrier deployment, 150+ aircraft surged since Feb 17. <strong>TICKERS: LMT, NOC, LHX, RTX.</strong>', recent: true, sources: [{name: "ILTV News", url: "https://www.youtube.com/watch?v=8XMc7vg0KpI"}, {name: "Indian Express", url: "https://indianexpress.com/article/world/us-news/iran-us-tensions-live-updates-trump-airstrikes-evacuations-tehran-warning-10548624/"}] },
    { date: "2026-02-25", time: "15:44", tag: "OSINT", tagClass: "osint", text: "OFAC sanctions 30+ individuals and entities enabling Iran\'s petroleum sales and ballistic missile/UAV programs. Treasury targets Iran\'s shadow fleet, IRGC, and MODAFL procurement networks in maximum pressure campaign escalation. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>", recent: true, sources: [{name: "US Treasury", url: "https://home.treasury.gov/news/press-releases/sb0405"}, {name: "sentdefender (@OSINTdefender on X)", url: "https://home.treasury.gov/news/press-releases/sb0405"}] },
    { date: "2026-02-25", time: "14:37", tag: "OSINT", tagClass: "osint", text: "Hezbollah signals it will NOT retaliate militarily against \'limited\' US strikes on Iran, but draws red line at strikes on Iran\'s supreme leader. Quote via AFP from unnamed LH official. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026667796277481704"}] },
    { date: "2026-02-25", time: "16:11", tag: "OSINT", tagClass: "osint", text: "@sentdefender assesses Iran strike as \'highly unlikely\' to be averted diplomatically: last Geneva round was \'nothing burger\' and small Iranian concessions won\'t be enough to meet US zero-enrichment redline. <strong>TICKERS: LMT, NOC, RTX, GD, LHX, KTOS.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026691641864536191"}] },
    { date: "2026-02-25", time: "15:02", tag: "OSINT", tagClass: "osint", text: "Indian PM Modi visits Israeli PM Netanyahu at the Knesset — India-Israel announce increased military cooperation including foreign military sales, as US pressures India to limit ties with adversaries. <strong>TICKERS: LMT, RTX, GD.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026674155303686223"}] },
    { date: "2026-02-25", time: "01:22", tag: "OSINT", tagClass: "osint", text: "Germany\'s Federal Foreign Office issues travel warning to Germans in Israel and Lebanon citing \'worsening security situation,\' warning of possible airspace closures — regional escalation signal. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026467914623119716"}] },
    { date: "2026-02-25", time: "03:56", tag: "OSINT", tagClass: "osint", text: "Trump SOTU Iran remarks: invokes Operation Midnight Hammer (June 2025 nuclear strike), warns Iran is \'again pursuing sinister ambitions,\' promises \'I will never allow Iran to have a nuclear weapon.\' Confirms 10-15 day ultimatum window. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, KTOS, BWXT.</strong>", recent: true, sources: [{name: "@sentdefender (OSINTdefender)", url: "https://x.com/sentdefender/status/2026506519328469164"}, {name: "military.com", url: "https://x.com/sentdefender/status/2026506519328469164"}] },
    { date: "2026-02-25", time: "00:00", tag: "MILTRACK", tagClass: "miltrack", text: "US maintains dual aircraft carrier strike groups in Middle East with largest regional air deployment in decades; Iran delegation departs Tehran for Geneva round-3 nuclear talks scheduled Feb 26. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII, GD.</strong>", recent: true, sources: [{name: "PBS NewsHour", url: "https://www.pbs.org/newshour/world/a_timeline-of-tensions-over-irans-nuclear-program-as-talks-with-u-s-approach"}, {name: "AFP", url: "https://www.pbs.org/newshour/world/a_timeline-of_tensions-over-irans-nuclear-program-as-talks_with-u_s-approach"}] }
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
    { name: "PACIFIC / CHINA", level: "HIGH", levelClass: "high", cardClass: "high", desc: "Taiwan 'Justice Mission 2025' — most extensive Chinese exercises ever. $11.1B Taiwan arms sale. Chinese Volt Typhoon cyber pre-positioning confirmed active. Submarine buildup accelerating. SDA satellite constellation expanding. $24B Golden Dome (classified). Middle East drawdown may temporarily reduce Pacific posture.", tickers: ["GD", "HII", "BWXT", "CW", "RKLB", "NOC"] },
    { name: "EUROPE / RUSSIA", level: "ELEVATED", levelClass: "elevated", cardClass: "elevated", desc: "Feb 24 = 4th anniversary Ukraine invasion. Russia launched 347 drones/missiles overnight Feb 21-22 — shifted to water/railway targets. 4x hypersonic Zirkon missiles used. NATO airspace incursions deliberate. All NATO 2%+ GDP, new 5% target. Front-line states accelerating orders. Trump-Putin talks collapsed Feb 12. Ceasefire odds: 0%.", tickers: ["LMT", "RTX", "AVAV", "BAESY"] },
    { name: "MIDDLE EAST", level: "⚠️ ACTIVE COMBAT", levelClass: "critical", cardClass: "critical", desc: "OPERATION EPIC FURY UNDERWAY. US and Israel conducting massive strike campaign across Iran. Khamenei reportedly killed (Israeli officials). 40+ regime figures eliminated. IDF struck 'hundreds of military sites.' Iran retaliating with missiles at Israel, US bases across Gulf. Dubai airport hit. CENTCOM: no US casualties, fleet fully operational. Trump: 'I can go long or end it in 2-3 days.'", tickers: ["LMT", "RTX", "NOC", "LHX", "KTOS", "HII", "GD", "BWXT"] },
    { name: "CYBER", level: "HIGH", levelClass: "high", cardClass: "high", desc: "State actors all targeting US defense contractors — Google TIG confirms Russia/China/Iran/NK campaigns. Dragos: Chinese/Iranian APTs embedding in critical infrastructure. AIS spoofing surge in Hormuz. FCC warns 4x telecom ransomware increase. Pentagon AI guardrails dispute. Google-Wiz $32B deal reshaping market.", tickers: ["CRWD", "PANW", "FTNT", "PLTR"] },
    { name: "CONUS / STRATEGIC", level: "ELEVATED", levelClass: "elevated", cardClass: "elevated", desc: "Nuclear modernization accelerating. $153B reconciliation spending — all into 2026. B-21 production +25% ($4.5B). Golden Dome $24B (classified). $1.5T FY2027 target. BWXT record $7.4B backlog. Iran eyeing CONUS proxy strikes per NYT.", tickers: ["NOC", "BWXT", "CW", "PLTR", "RKLB"] }
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
    { ticker: "LHX", company: "L3Harris Technologies", score: 5 },
    { ticker: "PLTR", company: "Palantir Technologies", score: 5 },
    { ticker: "GD", company: "General Dynamics", score: 3 },
    { ticker: "KTOS", company: "Kratos Defense", score: 3 },
    { ticker: "AVAV", company: "AeroVironment", score: 3 },
    { ticker: "BAESY", company: "BAE Systems ADR", score: 4 },
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
    { ticker: "SAIC", company: "Science Applications", score: -2 },
    { ticker: "BAH", company: "Booz Allen Hamilton", score: -3 }
];

// === POSITION CHANGES — Feb 28, 2026 Update (Operation Epic Fury) ===
const positionChanges = [
    { ticker: "LHX", company: "L3Harris Technologies", price: 349.15, dayChange: 2.38,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "Active combat operations in Iran validate L3Harris EW/comms/sensor product line. Every aircraft, ship, and sub in theater uses L3Harris gear. Iran strikes = immediate surge demand for replacements and spares. Buy before Monday open.",
        signal: "Operation Epic Fury: 150+ aircraft engaged with L3Harris electronics. F-22 Raptors, carrier air wings, and ISR platforms all dependent on L3Harris EW suites. Demand acceleration from active combat.",
        catalysts: ["Active combat ops", "EW/comms demand surge", "Monday gap up expected"]
    },
    { ticker: "PLTR", company: "Palantir Technologies", price: 133.32, dayChange: -0.65,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "Anthropic designated supply-chain risk to national security. PLTR is THE incumbent AI/targeting platform. Active combat operations = maximum battlefield intelligence demand. OpenAI deal validates AI-in-defense thesis.",
        signal: "OpenAI wins Pentagon AI contract hours after Anthropic cut. PLTR incumbent in AI targeting/intelligence. Active combat ops in Iran = surge demand for real-time battlefield analytics.",
        catalysts: ["Anthropic supply-chain risk", "Active combat AI demand", "Pentagon AI consolidation"]
    },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 114.01, dayChange: -0.84,
        oldScore: 3,
        newScore: 4,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "medium",
        priorityRationale: "$500M Paladin contract validates continued Army investment. Iran strikes will accelerate allied rearmament. European NATO supercycle intact. Was underweighted at score 3 — 10-day backtest showed +16.29%.",
        signal: "$500M+ Army Paladin howitzer contract. European NATO re-arming supercycle accelerating. Iran strikes = allied demand surge.",
        catalysts: ["$500M Paladin contract", "NATO rearmament", "Iran catalyst"]
    },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 79.63, dayChange: 6.02,
        oldScore: -5,
        newScore: -3,
        action: "UPGRADE",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "$697M Army MCTP training support contract. Active combat operations create training/simulation surge demand. DOGE risk partially offset by military training tailwind.",
        catalysts: ["$697M MCTP contract", "Combat training demand", "DOGE offset"]
    },
    { ticker: "SAIC", company: "Science Applications", price: 91.16, dayChange: 5.04,
        oldScore: -3,
        newScore: -2,
        action: "UPGRADE",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "$95M GAO IT modernization contract. New business partially offsets DOGE exposure.",
        catalysts: ["$95M GAO contract", "IT modernization", "DOGE still a risk"]
    },
    { ticker: "NOC", company: "Northrop Grumman", price: 704.93, dayChange: 0.18,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "B-21 production increase not yet priced in — reconciliation details released <24hrs ago. Geneva talks Thursday could collapse, triggering Midnight Hammer repeat. 2-week strike window open.",
        signal: "B-21 production +25% ($4.5B) in $153B Pentagon reconciliation. Nuclear modernization centerpiece. B-21 validated in prior Iran strikes — analysts flagging for repeat.",
        catalysts: ["$153B Pentagon spend", "B-21 +25% production", "Sentinel ICBM"]
    },
    { ticker: "HII", company: "Huntington Ingalls", price: 434.48, dayChange: -0.25,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "$29B shipbuilding allocation announced <24hrs ago — largest in history. Sole-source nuclear shipyard with zero competition. Dual-carrier ops sustaining demand for years. Market hasn't fully digested reconciliation scale.",
        signal: "$29B shipbuilding in reconciliation — largest allocation. Only nuclear shipyard. 14 Navy vessels now deployed to Iran theater. Dual-carrier posture = max demand.",
        catalysts: ["$29B shipbuilding", "Sole nuclear shipyard", "Dual-carrier ops"]
    },
    { ticker: "BWXT", company: "BWX Technologies", price: 202.57, dayChange: -2.74,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "Nuclear sub reactor demand is a multi-year structural tailwind that just accelerated. Zero DOGE exposure. $7.4B backlog = 3+ years revenue visibility. Any Iran strike accelerates nuclear modernization timeline.",
        signal: "Nuclear emphasis in $153B spend — sub reactors, B-21 nuclear systems, Golden Dome. Record $7.4B backlog. Zero DOGE risk. +2.95% on day.",
        catalysts: ["Nuclear spend surge", "$7.4B backlog", "+2.95% momentum"]
    },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 70.39, dayChange: 0.27,
        oldScore: 4,
        newScore: 4,
        action: "HOLD",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "Golden Dome $24B (classified) benefits space-based tracking. $816M SDA contract intact. -0.34% selloff is broad market, not fundamental.",
        catalysts: ["Golden Dome $24B", "SDA HALO demo", "Selloff = noise"]
    },
    { ticker: "KTOS", company: "Kratos Defense", price: 89.04, dayChange: 0.92,
        oldScore: 4,
        newScore: 3,
        action: "DOWNGRADE",
        priority: "REDUCE",
        priorityUrgency: "medium",
        priorityRationale: "Second consecutive selloff day (-5.90% then -3.85%). CCA timeline is multi-year — near-term catalysts exhausted after AFA Symposium. Trim and redeploy capital to NOC/HII/BWXT where reconciliation dollars flow immediately.",
        signal: "-3.85% selloff continuing despite positive CCA engine contract ($12.4M) and $1.1B Drone Dominance. Market skepticism on execution timeline. Downgrade on momentum deterioration.",
        catalysts: ["-3.85% selloff", "Execution concern", "CCA timeline risk"]
    },
    { ticker: "CRWD", company: "CrowdStrike", price: 377.41, dayChange: 3.88,
        oldScore: 1,
        newScore: 0,
        action: "DOWNGRADE",
        priority: "EXIT",
        priorityUrgency: "high",
        priorityRationale: "Post-earnings dead cat bounce likely temporary. Cyber sector rotation underway — capital better deployed in hardware primes benefiting from $153B reconciliation. Google-Wiz $32B deal reshaping competitive landscape.",
        signal: "Earnings miss — stock -9.85% Feb 23. Cyber demand persistent but execution failing. Moving to excluded on negative momentum.",
        catalysts: ["Earnings miss", "-9.85% crash", "Execution failure"]
    },
    { ticker: "LHX", company: "L3Harris Technologies", price: 349.15, dayChange: 2.38,
        oldScore: 3,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "medium",
        priorityRationale: "EW/comms demand surge from 150+ aircraft deployment and active combat operations. Iran strikes = immediate demand spike for L3Harris sensor/comm packages across carrier air wings.",
        signal: "F-22 deployment + 150 aircraft surge + Operation Epic Fury = maximum EW/comms demand. LHX book-to-bill 1.5x. Active combat validates entire product line.",
        catalysts: ["Active combat ops", "EW/comms demand", "1.5x book-to-bill"]
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
    { ticker: "LMT", start: 455.63, end: 658.08 },
    { ticker: "RTX", start: 158.6, end: 202.62 },
    { ticker: "NOC", start: 590.04, end: 724.38 },
    { ticker: "KTOS", start: 65.84, end: 86.18 },
    { ticker: "RKLB", start: 48.6, end: 69.1 },
    { ticker: "BWXT", start: 162.04, end: 205.98 },
    { ticker: "HII", start: 270.79, end: 444.52 },
    { ticker: "CW", start: 478.15, end: 700.33 },
    { ticker: "GD", start: 324.57, end: 357.05 },
    { ticker: "LHX", start: 277.62, end: 364.54 },
    { ticker: "PLTR", start: 156.71, end: 137.19 },
    { ticker: "AVAV", start: 241.35, end: 252.25 },
    { ticker: "BAESY", start: 94.24, end: 116.0 },
    { ticker: "MRCY", start: 67.55, end: 89.03 },
    { ticker: "BA", start: 234.68, end: 227.53 },
    { ticker: "LDOS", start: 180.92, end: 175.1 },
    { ticker: "FTNT", start: 78.77, end: 79.03 },
    { ticker: "CRWD", start: 423.7, end: 371.98 },
    { ticker: "JOBY", start: 14.15, end: 10.06 }
];

const benchmarkData = {
    SPY: { start: 645.05, end: 685.99 },
    ITA: { start: 198.42, end: 243.72 }
};

// === SIMULATED MONTHLY PERFORMANCE DATA (indexed to 100) ===
// 6 months: Aug 29, Sep 30, Oct 31, Nov 30, Dec 31, Jan 31, Feb 23
const perfLabels = ["Aug 29", "Sep 30", "Oct 31", "Nov 30", "Dec 31", "Jan 31", "Feb 27"];
const perfETF =    [100.0, 111.2, 116.9, 104.5, 109.8, 126.5, 125.6];
const perfITA =    [100.0, 105.5, 108.8, 103.4, 108.2, 117.1, 122.8];
const perfSPY =    [100.0, 103.3, 105.7, 105.9, 105.7, 107.3, 106.3];


// === THEATER INTEL DATA ===
const theaterIntelData = [
    {
        name: "MIDDLE EAST",
        level: "⚠️ ACTIVE COMBAT",
        levelClass: "critical",
        summary: "OPERATION EPIC FURY is underway. The US and Israel launched a massive strike campaign across Iran on Feb 28, 2026. Israeli officials report Supreme Leader Khamenei killed. 40+ regime figures eliminated. IDF struck 'hundreds of military sites.' Iran retaliating with missiles at Israel and US bases across the Gulf. CENTCOM: no US casualties.",
        evidence: [
            {
                category: "OPERATION EPIC FURY — STRIKES",
                items: [
                    "US and Israel launched coordinated strike campaign across Iran — Feb 28, 2026",
                    "Trump declared operations in video statement, urged Iranian people to rise against regime",
                    "Objectives: destroy nuclear program, dismantle missiles, neutralize navy, eliminate Axis of Resistance",
                    "IDF reports striking 'hundreds of military sites' including missile launchers in western Iran",
                    "B-21 Raiders, Tomahawks, F-22, F-35, and carrier-based aircraft all engaged",
                    "Israeli officials: Supreme Leader Khamenei killed — compound in Tehran struck",
                    "40+ regime figures killed: IRGC commander, defense minister, Security Council secretary",
                    "Iranian Red Crescent: 200+ casualties reported across Iran"
                ]
            },
            {
                category: "IRAN RETALIATION",
                items: [
                    "Iran fired ~35 missiles (Emad/Ghadr) at Israel by 5:42 AM ET — air raid sirens active",
                    "Iran strikes US bases across Bahrain, UAE, Kuwait, Jordan, Saudi Arabia",
                    "Dubai International Airport concourse damaged by Iranian drone attack — 4 staff injured",
                    "Iraqi PMF airstrikes in Jurf al Sakhr — Kataib Hezbollah stronghold, 2 PMF killed",
                    "CENTCOM: 'No U.S. casualties. No U.S. Navy ship struck. Armada fully operational.'",
                    "CENTCOM debunks Iran claims of 50 dead US service members as propaganda"
                ]
            },
            {
                category: "FORCE POSTURE (PRE-STRIKE BUILDUP)",
                items: [
                    "150+ aircraft deployed since Feb 17 — largest concentration since Iraq 2003",
                    "Dual carrier strike groups: USS Ford (CVN-78) + USS Abraham Lincoln (CVN-72)",
                    "12x F-22 Raptors deployed to CENTCOM from RAF Lakenheath",
                    "60+ attack aircraft at Muwaffaq Salti AB, Jordan — 3x normal",
                    "SSGN submarines deployed (Ohio-class: 154 Tomahawks each)",
                    "600+ Tomahawk cruise missiles available across fleet"
                ]
            },
            {
                category: "POST-STRIKE OUTLOOK",
                items: [
                    "Trump told Axios: 'I can go long and take over the whole thing, or end it in 2-3 days'",
                    "VP Vance monitoring from Situation Room; Trump from Mar-a-Lago",
                    "Iranians celebrating in streets of Karaj and Galehdar City — regime collapse signals",
                    "Polymarket: US strike resolved YES — $529M volume. Gulf state strike Iran by Mar 7: 46%",
                    "Morningstar: strikes will boost defense stocks Monday — sector evolving into subscription model",
                    "Markets closed Saturday — full impact expected Monday open"
                ]
            }
        ],
        keyAssets: "2 CSGs (Ford, Lincoln), 150+ aircraft, 600+ Tomahawks, SSGN subs, F-22/F-35/B-21, THAAD/Patriot batteries",
        tickers: ["LMT", "RTX", "NOC", "LHX", "KTOS", "HII", "GD", "BWXT"],
        sources: [
            {name: "ISW Special Report", url: "https://understandingwar.org/research/middle-east/iran-update-special-report-us-and-israeli-strikes-february-28-2026/"},
            {name: "NPR", url: "https://www.npr.org/2026/02/28/nx-s1-5730158/israel-iran-strikes-trump-us"},
            {name: "LiveNOW from FOX", url: "https://www.livenowfox.com/news/us-military-strikes-iran"},
            {name: "CENTCOM", url: "https://x.com/CENTCOM/status/2027868060217192498"},
            {name: "Bloomberg (Polymarket)", url: "https://www.bloomberg.com/news/articles/2026-02-28/polymarket-iran-bets-hit-529-million-as-new-wallets-draw-notice"}
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
                    "China 'Justice Mission 2025' — most extensive Taiwan exercises ever conducted (Dec 2025)",
                    "$11.1B Taiwan arms sale — largest in history (HIMARS, ATACMS, Javelins)",
                    "$32B arms backlog with Indo-Pacific partners",
                    "Virginia-class submarine production critical for undersea dominance",
                    "SDA satellite constellation expanding — RKLB $816M contract for space-based tracking",
                    "NOTE: Middle East drawdown may temporarily reduce Pacific posture — strategic risk"
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
                    "Golden Dome missile defense — $24B allocated in reconciliation bill (details classified)",
                    "SDA $30M HALO tactical SATCOM demo — early warning capability",
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
                    "Russia launched 347 drones/missiles overnight Feb 21-22 — shifted targeting to water/railway systems",
                    "4x hypersonic Zirkon cruise missiles used — escalation in weapon sophistication",
                    "Russia using Belarusian cellular infrastructure to coordinate drone strikes",
                    "Ukrainian forces advanced near Kupyansk and Novopavlivka despite bombardment",
                    "Russian cargo ship shadowing transatlantic undersea cables"
                ]
            },
            {
                category: "NATO REARMAMENT",
                items: [
                    "All 32 NATO members now exceed 2% GDP defense spending",
                    "New NATO target: 5% GDP — massive rearmament supercycle",
                    "Front-line states (Poland, Baltics, Finland) accelerating defense orders",
                    "European defense stocks at all-time highs — BAE, Rheinmetall +19%, Saab +22%"
                ]
            },
            {
                category: "DIPLOMATIC STATUS",
                items: [
                    "Trump-Putin peace talks collapsed Feb 12 — long war narrative reinforced",
                    "Polymarket: Russia-Ukraine ceasefire by Feb 28 at 0% ($5.7M volume)",
                    "NATO airspace incursions by Russia confirmed deliberate — not accidental"
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
                    "Google Threat Intelligence Group (Feb 10): Russia UNC5792/UNC5976, Iran UNC1549/UNC6446, China APT5, NK APT43 — all targeting US defense contractor employees",
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
                    "USDOT MARAD Advisory 2026-001 issued Feb 9 — official warning",
                    "Multiple vessels going AIS-dark simultaneously in Persian Gulf"
                ]
            },
            {
                category: "MARKET DYNAMICS",
                items: [
                    "Google-Wiz $32B acquisition reshaping cybersecurity competitive landscape",
                    "Pentagon AI guardrails dispute — Anthropic summoned, xAI/Google deals done",
                    "Israeli arrest of Polymarket traders using classified intelligence — leak vector confirmed",
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
                    "$153B Pentagon reconciliation spending plan released — accelerating all into 2026",
                    "$29B shipbuilding (new nuclear submarine), $24B munitions, $16B readiness",
                    "$24B Golden Dome missile defense (classified details)",
                    "White House targeting $1.5T defense budget for FY2027 — 50%+ increase",
                    "FY2026 NDAA: $900.6B — first ever above $900B"
                ]
            },
            {
                category: "NUCLEAR MODERNIZATION",
                items: [
                    "B-21 Raider production accelerated 25% with $4.5B boost — Northrop deal",
                    "Sentinel ICBM program advancing — replacement for Minuteman III",
                    "Columbia-class SSBN ramp — next-gen nuclear deterrent",
                    "BWXT record $7.4B backlog — sole-source naval nuclear reactor supplier"
                ]
            },
            {
                category: "EMERGING THREATS",
                items: [
                    "Iran NYT (Feb 22): eyeing CONUS proxy strikes as retaliatory option",
                    "SDA satellite constellation for space-based early warning expanding",
                    "AFA Warfare Symposium: 27 new portfolio acquisition executives — reform push",
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

// ... (rest of file unchanged for brevity in this tool payload)
