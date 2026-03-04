// Defense Signal Monitor - Part 1

// Utility functions
function formatMoney(num) {
  return '$' + num.toFixed(2);
}

function formatChange(pct) {
  const sign = pct >= 0 ? '+' : '';
  return sign + pct.toFixed(2) + '%';
}

// Stock data
const stockData = [
  { ticker: "LMT", company: "Lockheed Martin", price: 658.09, dayChange: -1.46 },
  { ticker: "RTX", company: "RTX", price: 205.59, dayChange: -0.45 },
  { ticker: "NOC", company: "Northrop Grumman", price: 741.18, dayChange: -2.36 },
  { ticker: "KTOS", company: "Kratos", price: 86.16, dayChange: -3.14 },
  { ticker: "RKLB", company: "Rocket Lab", price: 69.98, dayChange: -0.21 },
  { ticker: "BWXT", company: "BWX Technologies", price: 202.81, dayChange: -1.47 },
  { ticker: "HII", company: "Huntington Ingalls", price: 434.47, dayChange: -1.33 },
  { ticker: "CW", company: "Curtiss-Wright", price: 695.73, dayChange: -0.89 },
  { ticker: "GD", company: "General Dynamics", price: 360.85, dayChange: -1.06 },
  { ticker: "LHX", company: "L3Harris", price: 363.4, dayChange: -1.25 },
  { ticker: "PLTR", company: "Palantir", price: 150.4, dayChange: 2.16 },
  { ticker: "AVAV", company: "AeroVironment", price: 223.92, dayChange: -1.92 },
  { ticker: "BAESY", company: "BAE Systems", price: 119.55, dayChange: -0.25 },
  { ticker: "MRCY", company: "Mercury Systems", price: 89.68, dayChange: 0.28 },
  { ticker: "BA", company: "Boeing", price: 222.24, dayChange: -0.84 },
  { ticker: "LDOS", company: "Leidos", price: 178.97, dayChange: -0.99 },
  { ticker: "FTNT", company: "Fortinet", price: 81.81, dayChange: 0.88 },
  { ticker: "CRWD", company: "CrowdStrike", price: 386.15, dayChange: -1.35 },
  { ticker: "JOBY", company: "Joby", price: 9.83, dayChange: 0.72 },
  { ticker: "ACHR", company: "Archer", price: 6.62, dayChange: -1.41 },
  { ticker: "PANW", company: "Palo Alto Networks", price: 156.24, dayChange: 0.1 },
  { ticker: "SAIC", company: "SAIC", price: 92.65, dayChange: -1.87 },
  { ticker: "BAH", company: "Booz Allen", price: 78.6, dayChange: -0.76 }
];

// Signals feed data (continued in part2)
const signalsFeedData = [
    { date: "2026-02-28", time: "17:00", tag: "MILTRACK", tagClass: "miltrack", text: '<strong>OPERATION EPIC FURY LAUNCHED.</strong> US and Israel conducting massive strike campaign across Iran. Trump declares military operations in video statement, urges Iranian people to rise against regime. Objectives: destroy nuclear program, dismantle missile capability, neutralize Iranian navy, eliminate Axis of Resistance. <strong>B-21 RAIDERS, TOMAHAWKS, F-22/F-35 ALL ENGAGED. TICKERS: LMT, RTX, NOC, GD, LHX, HII, BWXT, KTOS, RKLB.</strong>', recent: true, sources: [{name: "LiveNOW from FOX", url: "https://www.livenowfox.com/news/us-military-strikes-iran"}, {name: "ISW Special Report", url: "https://understandingwar.org/research/middle-east/iran-update-special-report-us-and-israeli-strikes-february-28-2026/"}] },
    { date: "2026-02-28", time: "15:12", tag: "OSINT", tagClass: "osint", text: 'Fox News: <strong>Supreme Leader Ayatollah Khamenei confirmed dead</strong> per Israeli officials. Khamenei\'s compound and offices in Tehran hit during strikes. 40+ Iranian security/regime figures killed including IRGC commander, defense minister, Security Council secretary, and head of Khamenei\'s military bureau. <strong>REGIME DECAPITATION. TICKERS: ALL PRIMES.</strong>', recent: true, sources: [{name: "NPR", url: "https://www.npr.org/2026/02/28/nx-s1-5730158/israel-iran-strikes-trump-us"}, {name: "LiveNOW from FOX", url: "https://www.livenowfox.com/news/us-military-strikes-iran"}] },
    { date: "2026-02-28", time: "14:20", tag: "OSINT", tagClass: "osint", text: 'Netanyahu nationally televised address: \"There are growing signs that Khamenei is no longer around.\" IDF reports striking <strong>\"hundreds of military sites\"</strong> including missile launchers in western Iran. Iran\'s Foreign Ministry calls attack \'gross violation\' of sovereignty. Iranian Red Crescent: 200+ killed. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "NPR", url: "https://www.npr.org/2026/02/28/nx-s1-5730158/israel-iran-strikes-trump-us"}, {name: "LiveNOW from FOX", url: "https://www.livenowfox.com/news/us-military-strikes-iran"}] },
    { date: "2026-02-28", time: "08:40", tag: "CONFLICT", tagClass: "conflict", text: '<strong>IRAN RETALIATES.</strong> ~35 missiles (Emad/Ghadr) fired at Israel by 5:42 AM ET. Air raid sirens in Israel. Iran also strikes US bases across Bahrain, UAE, Kuwait, Jordan, Saudi Arabia. Dubai airport concourse damaged. CENTCOM: no US casualties, US Navy fleet fully operational. Iraqi PMF airstrikes in Jurf al Sakhr — 2 PMF killed. <strong>TICKERS: LMT, RTX, NOC, GD, LHX, HII.</strong>', recent: true, sources: [{name: "ISW Special Report", url: "https://understandingwar.org/research/middle-east/iran-update-special-report-us-and-israeli-strikes-february-28-2026/"}, {name: "NPR", url: "https://www.npr.org/2026/02/28/nx-s1-5730158/israel-iran-strikes-trump-us"}] },
    { date: "2026-02-28", time: "12:00", tag: "POLYMARKET", tagClass: "polymarket", text: '<strong>POLYMARKET RESOLVED: US strikes Iran by Feb 28 = YES.</strong> $529M total volume on Iran strike contracts. Bloomberg reports 6 accounts made ~$1M profit — all freshly created in February, shares purchased hours before first explosions at ~$0.10. Blockchain sleuths hunting insider trading. Gulf state strike Iran by Mar 7: 46%. Iran strike gulf oil facilities by Mar 31: 51%. <strong>TICKERS: LMT, RTX, NOC, GD, LHX.</strong>', recent: true, sources: [{name: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2026-02-28/polymarket-iran-bets-hit-529-million-as-new-wallets-draw-notice"}, {name: "Polymarket", url: "https://polymarket.com/event/will-a-gulf-state-strike-iran-by-march-7"}] },
