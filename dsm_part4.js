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
    { ticker: "LHX", company: "L3Harris Technologies", price: 364.54, dayChange: 2.64,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "Active combat operations in Iran validate L3Harris EW/comms/sensor product line. Every aircraft, ship, and sub in theater uses L3Harris gear. Iran strikes = immediate surge demand for replacements and spares. Buy before Monday open.",
        signal: "Operation Epic Fury: 150+ aircraft engaged with L3Harris electronics. F-22 Raptors, carrier air wings, and ISR platforms all dependent on L3Harris EW suites. Demand acceleration from active combat.",
        catalysts: ["Active combat ops", "EW/comms demand surge", "Monday gap up expected"]
    },
    { ticker: "PLTR", company: "Palantir Technologies", price: 137.19, dayChange: 0.92,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "Anthropic designated supply-chain risk to national security. PLTR is THE incumbent AI/targeting platform. Active combat operations = maximum battlefield intelligence demand. OpenAI deal validates AI-in-defense thesis.",
        signal: "OpenAI wins Pentagon AI contract hours after Anthropic cut. PLTR incumbent in AI targeting/intelligence. Active combat ops in Iran = surge demand for real-time battlefield analytics.",
        catalysts: ["Anthropic supply-chain risk", "Active combat AI demand", "Pentagon AI consolidation"]
    },
    { ticker: "BAESY", company: "BAE Systems ADR", price: 116.00, dayChange: 0.91,
        oldScore: 3,
        newScore: 4,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "medium",
        priorityRationale: "$500M Paladin contract validates continued Army investment. Iran strikes will accelerate allied rearmament. European NATO supercycle intact. Was underweighted at score 3 — 10-day backtest showed +16.29%.",
        signal: "$500M+ Army Paladin howitzer contract. European NATO re-arming supercycle accelerating. Iran strikes = allied demand surge.",
        catalysts: ["$500M Paladin contract", "NATO rearmament", "Iran catalyst"]
    },
    { ticker: "BAH", company: "Booz Allen Hamilton", price: 78.83, dayChange: -1.18,
        oldScore: -5,
        newScore: -3,
        action: "UPGRADE",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "$697M Army MCTP training support contract. Active combat operations create training/simulation surge demand. DOGE risk partially offset by military training tailwind.",
        catalysts: ["$697M MCTP contract", "Combat training demand", "DOGE offset"]
    },
    { ticker: "SAIC", company: "Science Applications", price: 92.26, dayChange: 0.61,
        oldScore: -3,
        newScore: -2,
        action: "UPGRADE",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "$95M GAO IT modernization contract. New business partially offsets DOGE exposure.",
        catalysts: ["$95M GAO contract", "IT modernization", "DOGE still a risk"]
    },
    { ticker: "NOC", company: "Northrop Grumman", price: 724.38, dayChange: 1.90,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "B-21 production increase not yet priced in — reconciliation details released <24hrs ago. Geneva talks Thursday could collapse, triggering Midnight Hammer repeat. 2-week strike window open.",
        signal: "B-21 production +25% ($4.5B) in $153B Pentagon reconciliation. Nuclear modernization centerpiece. B-21 validated in prior Iran strikes — analysts flagging for repeat.",
        catalysts: ["$153B Pentagon spend", "B-21 +25% production", "Sentinel ICBM"]
    },
    { ticker: "HII", company: "Huntington Ingalls", price: 444.52, dayChange: 0.34,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "$29B shipbuilding allocation announced <24hrs ago — largest in history. Sole-source nuclear shipyard with zero competition. Dual-carrier ops sustaining demand for years. Market hasn't fully digested reconciliation scale.",
        signal: "$29B shipbuilding in reconciliation — largest allocation. Only nuclear shipyard. 14 Navy vessels now deployed to Iran theater. Dual-carrier posture = max demand.",
        catalysts: ["$29B shipbuilding", "Sole nuclear shipyard", "Dual-carrier ops"]
    },
    { ticker: "BWXT", company: "BWX Technologies", price: 205.98, dayChange: -0.61,
        oldScore: 4,
        newScore: 5,
        action: "UPGRADE",
        priority: "BUY",
        priorityUrgency: "high",
        priorityRationale: "Nuclear sub reactor demand is a multi-year structural tailwind that just accelerated. Zero DOGE exposure. $7.4B backlog = 3+ years revenue visibility. Any Iran strike accelerates nuclear modernization timeline.",
        signal: "Nuclear emphasis in $153B spend — sub reactors, B-21 nuclear systems, Golden Dome. Record $7.4B backlog. Zero DOGE risk. +2.95% on day.",
        catalysts: ["Nuclear spend surge", "$7.4B backlog", "+2.95% momentum"]
    },
    { ticker: "RKLB", company: "Rocket Lab USA", price: 69.10, dayChange: -4.89,
        oldScore: 4,
        newScore: 4,
        action: "HOLD",
        priority: null,
        priorityUrgency: null,
        priorityRationale: null,
        signal: "Golden Dome $24B (classified) benefits space-based tracking. $816M SDA contract intact. -0.34% selloff is broad market, not fundamental.",
        catalysts: ["Golden Dome $24B", "SDA HALO demo", "Selloff = noise"]
    },
    { ticker: "KTOS", company: "Kratos Defense", price: 86.18, dayChange: -6.47,
        oldScore: 4,
        newScore: 3,
        action: "DOWNGRADE",
        priority: "REDUCE",
        priorityUrgency: "medium",
        priorityRationale: "Second consecutive selloff day (-5.90% then -3.85%). CCA timeline is multi-year — near-term catalysts exhausted after AFA Symposium. Trim and redeploy capital to NOC/HII/BWXT where reconciliation dollars flow immediately.",
        signal: "-3.85% selloff continuing despite positive CCA engine contract ($12.4M) and $1.1B Drone Dominance. Market skepticism on execution timeline. Downgrade on momentum deterioration.",
        catalysts: ["-3.85% selloff", "Execution concern", "CCA timeline risk"]
    },
    { ticker: "CRWD", company: "CrowdStrike", price: 371.98, dayChange: -2.39,
        oldScore: 1,
        newScore: 0,
        action: "DOWNGRADE",
        priority: "EXIT",
        priorityUrgency: "high",
        priorityRationale: "Post-earnings dead cat bounce likely temporary. Cyber sector rotation underway — capital better deployed in hardware primes benefiting from $153B reconciliation. Google-Wiz $32B deal reshaping competitive landscape.",
        signal: "Earnings miss — stock -9.85% Feb 23. Cyber demand persistent but execution failing. Moving to excluded on negative momentum.",
        catalysts: ["Earnings miss", "-9.85% crash", "Execution failure"]
    },
    { ticker: "LHX", company: "L3Harris Technologies", price: 364.54, dayChange: 2.64,
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
    { ticker: "LMT", start: 455.63, end: 658.08},
    { ticker: "RTX", start: 158.6, end: 202.62},
    { ticker: "NOC", start: 590.04, end: 724.38},
    { ticker: "KTOS", start: 65.84, end: 86.18},
    { ticker: "RKLB", start: 48.6, end: 69.10},
    { ticker: "BWXT", start: 162.04, end: 205.98},
    { ticker: "HII", start: 270.79, end: 444.52},
    { ticker: "CW", start: 478.15, end: 700.33},
    { ticker: "GD", start: 324.57, end: 357.05},
    { ticker: "LHX", start: 277.62, end: 364.54},
    { ticker: "PLTR", start: 156.71, end: 137.19},
    { ticker: "AVAV", start: 241.35, end: 252.25},
    { ticker: "BAESY", start: 94.24, end: 116.00},
    { ticker: "MRCY", start: 67.55, end: 89.03},
    { ticker: "BA", start: 234.68, end: 227.53},
    { ticker: "LDOS", start: 180.92, end: 175.10},
    { ticker: "FTNT", start: 78.77, end: 79.03},
    { ticker: "CRWD", start: 423.7, end: 371.98},
    { ticker: "JOBY", start: 14.15, end: 10.06}
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
        level: "\u26A0\uFE0F ACTIVE COMBAT",
        levelClass: "critical",
        summary: "OPERATION EPIC FURY is underway. The US and Israel launched a massive strike campaign across Iran on Feb 28, 2026. Israeli officials report Supreme Leader Khamenei killed. 40+ regime figures eliminated. IDF struck 'hundreds of military sites.' Iran retaliating with missiles at Israel and US bases across the Gulf. CENTCOM: no US casualties.",
        evidence: [
            {
                category: "OPERATION EPIC FURY \u2014 STRIKES",
                items: [
                    "US and Israel launched coordinated strike campaign across Iran \u2014 Feb 28, 2026",
                    "Trump declared operations in video statement, urged Iranian people to rise against regime",
                    "Objectives: destroy nuclear program, dismantle missiles, neutralize navy, eliminate Axis of Resistance",
                    "IDF reports striking 'hundreds of military sites' including missile launchers in western Iran",
                    "B-21 Raiders, Tomahawks, F-22, F-35, and carrier-based aircraft all engaged",
                    "Israeli officials: Supreme Leader Khamenei killed \u2014 compound in Tehran struck",
                    "40+ regime figures killed: IRGC commander, defense minister, Security Council secretary",
                    "Iranian Red Crescent: 200+ casualties reported across Iran"
                ]
            },
            {
                category: "IRAN RETALIATION",
                items: [
                    "Iran fired ~35 missiles (Emad/Ghadr) at Israel by 5:42 AM ET \u2014 air raid sirens active",
                    "Iran strikes US bases across Bahrain, UAE, Kuwait, Jordan, Saudi Arabia",
                    "Dubai International Airport concourse damaged by Iranian drone attack \u2014 4 staff injured",
                    "Iraqi PMF airstrikes in Jurf al Sakhr \u2014 Kataib Hezbollah stronghold, 2 PMF killed",
                    "CENTCOM: 'No U.S. casualties. No U.S. Navy ship struck. Armada fully operational.'",
                    "CENTCOM debunks Iran claims of 50 dead US service members as propaganda"
                ]
            },
            {
                category: "FORCE POSTURE (PRE-STRIKE BUILDUP)",
                items: [
                    "150+ aircraft deployed since Feb 17 \u2014 largest concentration since Iraq 2003",
                    "Dual carrier strike groups: USS Ford (CVN-78) + USS Abraham Lincoln (CVN-72)",
                    "12x F-22 Raptors deployed to CENTCOM from RAF Lakenheath",
                    "60+ attack aircraft at Muwaffaq Salti AB, Jordan \u2014 3x normal",
                    "SSGN submarines deployed (Ohio-class: 154 Tomahawks each)",
                    "600+ Tomahawk cruise missiles available across fleet"
                ]
            },
            {
                category: "POST-STRIKE OUTLOOK",
                items: [
                    "Trump told Axios: 'I can go long and take over the whole thing, or end it in 2-3 days'",
                    "VP Vance monitoring from Situation Room; Trump from Mar-a-Lago",
                    "Iranians celebrating in streets of Karaj and Galehdar City \u2014 regime collapse signals",
                    "Polymarket: US strike resolved YES \u2014 $529M volume. Gulf state strike Iran by Mar 7: 46%",
                    "Morningstar: strikes will boost defense stocks Monday \u2014 sector evolving into subscription model",
                    "Markets closed Saturday \u2014 full impact expected Monday open"
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