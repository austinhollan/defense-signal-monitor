// =====================
// Defense Signal Monitor - Part 1
// =====================

function formatPercent(value) {
  const sign = value > 0 ? '+' : '';
  return sign + value.toFixed(2) + '%';
}

function formatPrice(value) {
  return '$' + value.toFixed(2);
}

function getChangeColor(change) {
  return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
}

// =====================
// Stock Data (23 tickers)
// =====================

const stockData = [
  { ticker: "LMT", company: "Lockheed Martin", price: 651.11, dayChange: -2.01 },
  { ticker: "RTX", company: "RTX Corp", price: 202.27, dayChange: -3.14 },
  { ticker: "NOC", company: "Northrop Grumman", price: 742.80, dayChange: -1.46 },
  { ticker: "KTOS", company: "Kratos", price: 85.52, dayChange: -4.05 },
  { ticker: "RKLB", company: "Rocket Lab", price: 69.71, dayChange: -3.06 },
  { ticker: "BWXT", company: "BWX Technologies", price: 197.45, dayChange: -3.95 },
  { ticker: "HII", company: "Huntington Ingalls", price: 421.64, dayChange: -3.52 },
  { ticker: "CW", company: "Curtiss-Wright", price: 681.47, dayChange: -4.37 },
  { ticker: "GD", company: "General Dynamics", price: 357.83, dayChange: -2.26 },
  { ticker: "LHX", company: "L3Harris", price: 362.61, dayChange: -1.67 },
  { ticker: "PLTR", company: "Palantir", price: 153.35, dayChange: 0.10 },
  { ticker: "AVAV", company: "AeroVironment", price: 220.18, dayChange: -2.78 },
  { ticker: "BAESY", company: "BAE Systems", price: 115.22, dayChange: -5.76 },
  { ticker: "MRCY", company: "Mercury Systems", price: 86.63, dayChange: -2.86 },
  { ticker: "BA", company: "Boeing", price: 221.31, dayChange: -2.64 },
  { ticker: "LDOS", company: "Leidos", price: 174.82, dayChange: -1.06 },
  { ticker: "FTNT", company: "Fortinet", price: 84.55, dayChange: 2.12 },
  { ticker: "CRWD", company: "CrowdStrike", price: 426.92, dayChange: 4.72 },
  { ticker: "JOBY", company: "Joby Aviation", price: 9.65, dayChange: -2.38 },
  { ticker: "ACHR", company: "Archer Aviation", price: 6.50, dayChange: -3.85 },
  { ticker: "PANW", company: "Palo Alto Networks", price: 163.43, dayChange: 3.07 },
  { ticker: "SAIC", company: "SAIC", price: 92.38, dayChange: -0.99 },
  { ticker: "BAH", company: "Booz Allen", price: 79.43, dayChange: 1.38 }
];

// =====================
// Signals Feed Data (continues in part 2)
// =====================

const signalsFeedData = [
  {
    time: "08:57",
    category: "MILITARY MOVEMENT",
    title: "CENTCOM: U.S. has destroyed 17 Iranian vessels; meeting with defense contractors Friday",
    details: "Multiple outlets report CENTCOM claims it destroyed 17 Iranian vessels and nearly 2,000 targets, while Reuters/CNBC report Lockheed/RTX execs to meet White House officials Friday about accelerating weapons production.",
    impact: "High",
    source: "CNBC / Reuters",
    link: "https://www.cnbc.com/2026/03/04/us-iran-war-live-updates.html"
  },
  {
    time: "08:52",
    category: "MARKET SIGNAL",
    title: "Polymarket Iran bets draw scrutiny after traders profit; new 'Kurds in Iran' market at 61%",
    details: "USA Today and others report a Polymarket user made >$500K on Iran-related bets; Polymarket launched new Iran-related contracts including a market on US military coordination/support to Kurds in Iran by March 31, currently 61%.",
    impact: "Medium",
    source: "USA Today / Polymarket",
    link: "https://www.usatoday.com/story/money/2026/03/03/magamyman-polymarket-trader-iran-bets/88949233007/"
  },
  {
    time: "08:45",
    category: "TECHNOLOGY",
    title: "Axios: Iran war showcases PrSM and low-cost UCAS drone; Pentagon using AI tools",
    details: "Axios reports the conflict has showcased new weapons (PrSM, LUCAS) and use of AI tools by Pentagon commands.",
    impact: "Medium",
    source: "Axios",
    link: "https://www.axios.com/2026/03/05/iran-war-anthropic-prsm-drones"
  },
