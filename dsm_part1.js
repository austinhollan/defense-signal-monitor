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
    { ticker: "LMT", company: "Lockheed Martin", price: 668.95, dayChange: 21.98, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: F-35/F-22 engaged in Iran strikes. PAC-3 intercepting Iranian missiles. Record $194B backlog. Morningstar: defense becoming subscription model. F-47 win. $480M Navy ASW contract. 6 politician buys. Expect significant Monday gap up." },
    { ticker: "RTX", company: "Raytheon Technologies", price: 211.81, dayChange: 9.55, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Tomahawk missiles fired at Iran. Patriot batteries intercepting Iranian retaliation. $50B sustainment through 2045. StormBreaker approved. Most Congress-traded defense stock. Iran strikes = unprecedented Patriot/Tomahawk demand validation." },
    { ticker: "NOC", company: "Northrop Grumman", price: 756.13, dayChange: 43.67, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: B-21 Raiders engaged in Iran strikes — combat-validated for second time. Production +25% ($4.5B) in reconciliation. Midnight Hammer repeat confirmed. Sentinel ICBM. Nuclear modernization centerpiece. IDF struck 'hundreds of military sites.'" },
    { ticker: "KTOS", company: "Kratos Defense", price: 89.81, dayChange: 4.54, score: 3, direction: "neutral", summary: "DOWNGRADED: -5.90% selloff despite $12.4M CCA engine contract (Feb 23, AFA) and $1.1B Drone Dominance. Market skepticism on execution timeline. Momentum deterioration." },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 70.20, dayChange: 1.87, score: 4, direction: "bullish", summary: "$816M SDA satellite contract. Golden Dome missile defense. SDA HALO tactical SATCOM demo ecosystem. Space-based tracking." },
    { ticker: "BWXT", company: "BWX Technologies", price: 218.15, dayChange: 10.47, score: 5, direction: "bullish", summary: "Nuclear emphasis in $153B reconciliation spend. Sole-source naval nuclear. Active carrier operations in Iran theater = accelerated nuclear submarine demand. Zero DOGE risk. Record $7.4B backlog. B-21 nuclear systems engaged." },
    { ticker: "HII", company: "Huntington Ingalls", price: 451.18, dayChange: 8.95, score: 5, direction: "bullish", summary: "OPERATION EPIC FURY: Dual carrier strike groups (Ford + Lincoln) + 25-35 surface vessels engaged. CENTCOM: 'Armada fully operational.' $29B shipbuilding in reconciliation. Only nuclear shipyard. Naval assets in active combat operations." },
    { ticker: "CW", company: "Curtiss-Wright", price: 728.86, dayChange: 26.07, score: 4, direction: "bullish", summary: "Sole-source naval nuclear controls. Zero DOGE risk. AFA Warfare Symposium acquisition reform tailwind." },
    { ticker: "GD", company: "General Dynamics", price: 362.10, dayChange: 7.57, score: 3, direction: "bullish", summary: "Virginia-class sub production. Franklin bought day after $1.32B contract. Columbia-class ramp. SSGN deployment confirmed." },
    { ticker: "LHX", company: "L3Harris Technologies", price: 374.24, dayChange: 14.07, score: 5, direction: "bullish", summary: "UPGRADED TO 5: Active combat operations = maximum EW/comms/sensor demand. F-22 Raptors engaged in Iran. Every aircraft in theater uses L3Harris electronic warfare and communications gear. Book-to-bill 1.5x. Iran strikes validate entire product line." },
    { ticker: "PLTR", company: "Palantir Technologies", price: 146.05, dayChange: 7.94, score: 5, direction: "bullish", summary: "UPGRADED TO 5: OpenAI wins Pentagon AI contract after Anthropic designated 'supply-chain risk to national security.' PLTR incumbent AI/targeting platform benefits from active combat ops. Real-time battlefield intelligence demand surging. $10B Army contract." },
    { ticker: "AVAV", company: "AeroVironment", price: 213.26, dayChange: -43.93, score: 3, direction: "bullish", summary: "Switchblade Ukraine demand. BlueHalo acquisition. Iran escalation = loitering munitions demand surge. Ukraine front stabilizing." },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 120.88, dayChange: 4.55, score: 4, direction: "bullish", summary: "UPGRADED: $500M+ Army Paladin howitzer contract (Feb 27). European NATO re-arming supercycle. Iran strikes = allied rearmament acceleration. Front-line states accelerating spending. +16.29% in 10-day backtest." },
    { ticker: "MRCY", company: "Mercury Systems", price: 94.25, dayChange: 1.98, score: 3, direction: "bullish", summary: "CEO turnaround. Embedded in F-35/Patriot. Iran crisis = accelerated Patriot/F-35 procurement." },
    { ticker: "BA", company: "Boeing", price: 229.60, dayChange: 1.99, score: 2, direction: "neutral", summary: "F-47 NGAD win. CCA weapon integration testing begun (YFQ-44A inert AIM-120 Feb 23). BUT commercial crisis, high leverage." },
    { ticker: "LDOS", company: "Leidos Holdings", price: 177.41, dayChange: 4.23, score: 2, direction: "neutral", summary: "DOGE risk materializing. Navy NGEN. DOGE cuts hitting IT services." },
    { ticker: "FTNT", company: "Fortinet", price: 78.99, dayChange: 0.15, score: 1, direction: "neutral", summary: "OT/ICS security growth. Google-Wiz deal ($32B) competitive threat. Chinese/Iranian APTs targeting defense industry (Feb 17 Dragos report)." },
    { ticker: "CRWD", company: "CrowdStrike", price: 382.01, dayChange: 12.88, score: 0, direction: "bearish", summary: "DOWNGRADED TO EXCLUDED: Earnings miss — stock -9.85% Feb 23. Execution failure. Moved to excluded on negative momentum despite persistent cyber demand." },
    { ticker: "JOBY", company: "Joby Aviation", price: 10.26, dayChange: 0.20, score: 1, direction: "neutral", summary: "Military logistics potential. But pre-revenue, limited defense utility." },
    { ticker: "ACHR", company: "Archer Aviation", price: 7.46, dayChange: 0.40, score: 0, direction: "neutral", summary: "Limited defense utility. eVTOL speculation." },
    { ticker: "PANW", company: "Palo Alto Networks", price: 150.56, dayChange: 1.20, score: -1, direction: "bearish", summary: "Platformization headwinds. Near 52-week low. Google-Wiz deal pressuring valuation. APT competition heating." },
    { ticker: "SAIC", company: "Science Applications", price: 93.28, dayChange: 0.23, score: -2, direction: "bearish", summary: "$95M GAO IT modernization contract win (Feb 27). Still DOGE-exposed but new contract provides some cushion. Upgrading from -3 to -2." },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 79.50, dayChange: -1.04, score: -3, direction: "bearish", summary: "DOGE devastation offset: $697M Army MCTP training contract win (Feb 27). Active combat operations = surge in training/simulation demand. But still DOGE-exposed on civil side. Upgrading from -5 to -3 on new contract." }
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
    { date: "2026-03-01", time: "14:00", tag: "MILTRACK", tagClass: "miltrack", text: '<strong>3 US service members killed, 5 seriously wounded</strong> in Iranian retaliatory strikes on US installations in the Gulf region. CENTCOM confirms casualties from ballistic missile and drone attacks on bases in Bahrain and UAE. First US KIA since Operation Epic Fury began. <strong>TICKERS: LMT, RTX, NOC, HII, GD, LHX.</strong>', recent: true, sources: [{"name": "CENTCOM", "url": "https://www.centcom.mil/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "12:00", tag: "CYBER", tagClass: "cyber", text: 'WSJ: CENTCOM used Anthropic Claude AI during Operation Epic Fury strikes <strong>despite Anthropic being designated a \'supply-chain risk to national security\'</strong> by Pentagon. AI used for targeting analysis and battle damage assessment. Raises questions about DoD AI procurement and Anthropic\'s classified access status. <strong>TICKERS: PLTR.</strong>', recent: true, sources: [{"name": "Wall Street Journal", "url": "https://www.wsj.com/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "10:00", tag: "MILTRACK", tagClass: "miltrack", text: 'Fox News: <strong>1,000+ Iranian military sites struck in first 24 hours</strong> of Operation Epic Fury. US and Israeli forces continue round-the-clock operations. Pentagon describes campaign as \'most intensive aerial campaign since Iraq 2003.\' <strong>TICKERS: LMT, RTX, NOC, LHX, HII, BWXT.</strong>', recent: true, sources: [{"name": "Fox News", "url": "https://www.foxnews.com/"}, {"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "08:00", tag: "OSINT", tagClass: "osint", text: 'Iran continues retaliatory strikes on Bahrain — <strong>smoke rising from Manama</strong> visible in satellite imagery and social media. Iranian ballistic missiles targeting US Naval Support Activity Bahrain (5th Fleet HQ). Gulf state infrastructure under sustained attack. <strong>TICKERS: LMT, RTX, NOC, HII, GD.</strong>', recent: true, sources: [{"name": "@sentdefender", "url": "https://x.com/sentdefender"}] },
    { date: "2026-03-01", time: "06:00", tag: "OSINT", tagClass: "osint", text: 'Politico: <strong>Pentagon offers no evidence of imminent threat</strong> that justified Operation Epic Fury. Critics question legal basis for strikes. Administration cites 2001/2002 AUMFs and Article II powers. Congress demands briefing. <strong>TICKERS: LMT, RTX, NOC.</strong>', recent: true, sources: [{"name": "Politico", "url": "https://www.politico.com/"}] },
    { date: "2026-03-01", time: "04:00", tag: "CONTRACT", tagClass: "contract", text: 'Photonis Defense awarded <strong>$352.6M Army contract</strong> for Binocular Night Observation Device (BiNOD) systems. Multi-year procurement for next-gen night vision across infantry units. <strong>Night vision/optics supply chain beneficiary.</strong>', recent: true, sources: [{"name": "DoD Contracts", "url": "https://www.defense.gov/News/Contracts/"}] },
    { date: "2026-03-01", time: "02:00", tag: "CONTRACT", tagClass: "contract", text: 'UK awards Leonardo <strong>£1B military helicopter contract</strong> (Reuters). Covers AW149 medium-lift helicopters for British Army to replace aging Puma fleet. European defense spending acceleration continues. <strong>TICKERS: BAESY (European defense proxy).</strong>', recent: true, sources: [{"name": "Reuters", "url": "https://www.reuters.com/"}] },
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
    { date: "2026-02-28", time: "12:00", tag: "POLYMARKET", tagClass: "polymarket", text: '<strong>POLYMARKET RESOLVED: US strikes Iran by Feb 28 = YES.</strong> $529M total volume on Iran strike contracts. Bloomberg reports 6 accounts made ~$1M profit — all freshly created in February, shares purchased hours before first explosions at ~$0.10. Blockchain sleuths hunting insider trading. Gulf state strike Iran by Mar 7: 46%. Iran strike gulf oil facilities by Mar 31: 51%. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2026-02-28/polymarket-iran-bets-hit-529-million-as-new-wallets-draw-notice"}, {name: "Polymarket", url: "https://polymarket.com/event/will-a-gulf-state-strike-iran-by-march-7"}] },
    { date: "2026-02-28", time: "10:00", tag: "OSINT", tagClass: "osint", text: '<strong>US forces conducting airstrikes</strong> on Iranian proxy militia facilities in Iraq and Syria. Additional carrier-based sorties launched from USS Ford. NATO air defense activated in Cyprus and Crete. <strong>TICKERS: LMT, RTX, NOC, HII.</strong>', recent: true, sources: [{name: "@sentdefender", url: "https://x.com/sentdefender/status/2027775854270069226"}] },
    { date: "2026-02-28", time: "07:05", tag: "OSINT", tagClass: "osint", text: 'Iranian state media claims that a ballistic missile strike targeted the U.S. Embassy compound in Baghdad. Reports of explosions in Green Zone. No confirmation from U.S. officials yet. <strong>TICKERS: LMT, RTX, NOC.</strong>', recent: true, sources: [{name: "@sentdefender", url: "https://x.com/sentdefender/status/2027738096160088579"}] },
    { date: "2026-02-27", time: "22:35", tag: "POLYMARKET", tagClass: "polymarket", text: 'Polymarket: Probability of U.S. strike on Iran by Feb 28 surges from <strong>~40% to ~90%</strong> in 6 hours following unusual betting activity and rumors of imminent action. Total volume >$400M. Traders cite White House movement and Israeli Air Force deployments. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "Polymarket", url: "https://polymarket.com/event/will-the-us-strike-iran-by-february-28"}] },
    { date: "2026-02-27", time: "15:45", tag: "CONTRACT", tagClass: "contract", text: 'Booz Allen Hamilton wins <strong>$697M Army Mission Command Training Program contract</strong> (GovCon Wire). Multi-year training support services award. <strong>TICKERS: BAH.</strong>', recent: true, sources: [{name: "GovCon Wire", url: "https://www.govconwire.com/"}] },
    { date: "2026-02-27", time: "13:00", tag: "CONTRACT", tagClass: "contract", text: 'Raytheon (RTX) receives <strong>$1.1B Missile Defense Agency SM-3 contract modification</strong> to support Aegis BMD interceptors (DoD contracts). <strong>TICKERS: RTX.</strong>', recent: true, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}] },
    { date: "2026-02-27", time: "10:00", tag: "CONTRACT", tagClass: "contract", text: 'BAE Systems wins <strong>$500M+ Army Paladin howitzer contract</strong> (DoD contracts). Supports artillery modernization demand. <strong>TICKERS: BAESY.</strong>', recent: true, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}] },
    { date: "2026-02-26", time: "15:25", tag: "CONTRACT", tagClass: "contract", text: 'Leidos (LDOS) wins <strong>$191M Navy Next Generation Enterprise Network (NGEN) contract</strong>. <strong>TICKERS: LDOS.</strong>', recent: true, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}] },
    { date: "2026-02-26", time: "13:45", tag: "CONTRACT", tagClass: "contract", text: 'L3Harris (LHX) awarded <strong>$1.2B Army tactical radios contract</strong>. <strong>TICKERS: LHX.</strong>', recent: true, sources: [{name: "DoD Contracts", url: "https://www.defense.gov/News/Contracts/"}] },
    { date: "2026-02-26", time: "10:10", tag: "CYBER", tagClass: "cyber", text: 'NSA/CISA joint advisory: Iranian state-backed APTs targeting U.S. defense industrial base and critical infrastructure amid escalation. Increased spearphishing and ICS attacks. <strong>TICKERS: FTNT, PANW, CRWD.</strong>', recent: true, sources: [{name: "CISA", url: "https://www.cisa.gov/"}] }
];

// === THEATER DATA ===
const theaterData = [
    {
        name: "MIDDLE EAST",
        risk: "CRITICAL",
        level: 5,
        description: "Active US-IRAN combat operations. Massive strike campaign underway. Gulf nations under attack.",
        update: "OPERATION EPIC FURY ongoing. US/Israel strikes Iran. Iran retaliating against Gulf states. Strait of Hormuz closure threat.",
        color: "#ff4444"
    },
    {
        name: "EUROPE",
        risk: "HIGH",
        level: 4,
        description: "Ukraine conflict escalates with NATO re-arming. EU defense spending surge.",
        update: "European NATO nations accelerating procurement. UK helicopter contract awarded.",
        color: "#ff8800"
    },
    {
        name: "INDO-PACIFIC",
        risk: "ELEVATED",
        level: 3,
        description: "China-Taiwan tensions. US force posture shifts. AUKUS submarine ramp.",
        update: "No new major escalations in past 24h; baseline elevated posture.",
        color: "#ffaa00"
    },
    {
        name: "CYBER",
        risk: "HIGH",
        level: 4,
        description: "Iranian state-backed cyber activity targeting defense and critical infrastructure.",
        update: "Joint NSA/CISA warnings. Defense contractors and OT environments on alert.",
        color: "#00ccff"
    },
    {
        name: "SPACE",
        risk: "ELEVATED",
        level: 3,
        description: "Space-based missile warning and SDA proliferated LEO buildout accelerating.",
        update: "Golden Dome/missile defense initiatives driving LEO tracking demand.",
        color: "#a855f7"
    }
];

// === EVENT / SIGNAL HELPERS ===
function getSignalClass(tag) {
    switch(tag) {
        case "CONTRACT": return "contract";
        case "MILTRACK": return "miltrack";
        case "CYBER": return "cyber";
        case "POLYMARKET": return "polymarket";
        case "OSINT": return "osint";
        case "CONFLICT": return "conflict";
        default: return "osint";
    }
}

function getScoreColor(score) {
    if (score >= 4) return "#22c55e";
    if (score >= 2) return "#fbbf24";
    if (score >= 0) return "#f97316";
    return "#ef4444";
}

function formatPrice(num) {
    return `$${num.toFixed(2)}`;
}

function formatChange(change) {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}`;
}

// === CORE APP STATE ===
let activeTab = "overview";
let selectedTicker = null;

// === RENDER FUNCTIONS ===
function renderTheaterStrip() {
    const container = document.getElementById("theaterStrip");
    if (!container) return;

    container.innerHTML = theaterData.map(theater => `
        <div class="theater-card" style="border-color:${theater.color};">
            <div class="theater-header">
                <span class="theater-name">${theater.name}</span>
                <span class="theater-risk" style="color:${theater.color};">${theater.risk}</span>
            </div>
            <div class="theater-description">${theater.description}</div>
            <div class="theater-update">${theater.update}</div>
        </div>
    `).join("");
}

function renderSignalsFeed() {
    const container = document.getElementById("signalsFeed");
    if (!container) return;

    container.innerHTML = signalsFeedData.slice(0, 18).map(item => `
        <div class="signal-item ${getSignalClass(item.tag)}">
            <div class="signal-meta">
                <span class="signal-date">${item.date} ${item.time}</span>
                <span class="signal-tag ${item.tagClass}">${item.tag}</span>
            </div>
            <div class="signal-text">${linkifyTickers(item.text)}</div>
            ${item.sources ? `<div class="signal-sources">${item.sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join(" ")}</div>` : ""}
        </div>
    `).join("");
}

function renderTickerGrid() {
    const container = document.getElementById("tickerGrid");
    if (!container) return;

    container.innerHTML = stockData.map(stock => {
        const changeClass = stock.dayChange >= 0 ? "positive" : "negative";
        return `
            <div class="ticker-card" data-ticker="${stock.ticker}">
                <div class="ticker-top">
                    <span class="ticker-symbol">${stock.ticker}</span>
                    <span class="ticker-score" style="color:${getScoreColor(stock.score)};">${stock.score}</span>
                </div>
                <div class="ticker-company">${stock.company}</div>
                <div class="ticker-price">${formatPrice(stock.price)}</div>
                <div class="ticker-change ${changeClass}">${formatChange(stock.dayChange)}</div>
            </div>
        `;
    }).join("");

    // Add click handlers
    document.querySelectorAll(".ticker-card").forEach(card => {
        card.addEventListener("click", () => {
            selectedTicker = card.dataset.ticker;
            renderTickerDetail();
        });
    });
}

function renderTickerDetail() {
    const container = document.getElementById("tickerDetail");
    if (!container || !selectedTicker) return;

    const stock = stockData.find(s => s.ticker === selectedTicker);
    if (!stock) return;

    container.innerHTML = `
        <div class="detail-header">
            <div>
                <h2>${stock.company} (${stock.ticker})</h2>
                <a href="https://perplexity.ai/finance/${stock.ticker}" target="_blank" rel="noopener" class="ticker-link">View on Perplexity Finance</a>
            </div>
            <button class="close-btn" id="closeDetail">×</button>
        </div>
        <div class="detail-body">
            <div class="detail-metrics">
                <div class="metric">
                    <span class="metric-label">PRICE</span>
                    <span class="metric-value">${formatPrice(stock.price)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">DAY CHANGE</span>
                    <span class="metric-value ${stock.dayChange >= 0 ? "positive" : "negative"}">${formatChange(stock.dayChange)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">SIGNAL SCORE</span>
                    <span class="metric-value" style="color:${getScoreColor(stock.score)};">${stock.score}</span>
                </div>
            </div>
            <div class="detail-summary">
                <h3>SUMMARY</h3>
                <p>${linkifyTickers(stock.summary)}</p>
            </div>
        </div>
    `;

    document.getElementById("closeDetail").addEventListener("click", () => {
        selectedTicker = null;
        container.innerHTML = "";
    });
}

function renderSignalMatrix() {
    const container = document.getElementById("signalMatrix");
    if (!container) return;

    container.innerHTML = stockData.map(stock => `
        <tr>
            <td>${tickerLink(stock.ticker)}</td>
            <td>${stock.company}</td>
            <td style="color:${getScoreColor(stock.score)}; font-weight:700;">${stock.score}</td>
            <td>${stock.direction.toUpperCase()}</td>
            <td>${linkifyTickers(stock.summary)}</td>
        </tr>
    `).join("");
}

// === TAB HANDLING ===
function switchTab(tabName) {
    activeTab = tabName;

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.toggle("active", tab.id === tabName);
    });

    if (tabName === "overview") {
        renderTickerGrid();
        renderSignalsFeed();
        renderTheaterStrip();
    }
    if (tabName === "matrix") {
        renderSignalMatrix();
    }
}

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
    // Timestamp
    const ts = document.getElementById("timestamp");
    if (ts) ts.textContent = new Date().toLocaleString();

    // Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Initial render
    switchTab("overview");
});
