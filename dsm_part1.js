// =====================
// Defense Signal Monitor (DSM)
// Part 1: Utilities + Stock Ticker Data + Start of Signals Feed
// =====================

// Utility: format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Utility: format percent with +/− and 2 decimals
function formatPercent(val) {
  const sign = val > 0 ? "+" : "";
  return sign + val.toFixed(2) + "%";
}

// Utility: format timestamp nicely
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
}

// =====================
// STOCK DATA (Live prices injected hourly)
// =====================
const stockData = [
  { ticker: "LMT", company: "Lockheed Martin", price: 655.04, dayChange: -1.42 },
  { ticker: "RTX", company: "RTX (Raytheon)", price: 203.93, dayChange: -2.34 },
  { ticker: "NOC", company: "Northrop Grumman", price: 739.91, dayChange: -1.85 },
  { ticker: "KTOS", company: "Kratos Defense", price: 85.54, dayChange: -4.03 },
  { ticker: "RKLB", company: "Rocket Lab", price: 70, dayChange: -2.66 },
  { ticker: "BWXT", company: "BWX Technologies", price: 195.42, dayChange: -4.94 },
  { ticker: "HII", company: "Huntington Ingalls", price: 421.19, dayChange: -3.62 },
  { ticker: "CW", company: "Curtiss-Wright", price: 678.60, dayChange: -4.77 },
  { ticker: "GD", company: "General Dynamics", price: 360.73, dayChange: -1.47 },
  { ticker: "LHX", company: "L3Harris", price: 360.12, dayChange: -2.34 },
  { ticker: "PLTR", company: "Palantir", price: 152.67, dayChange: -0.34 },
  { ticker: "AVAV", company: "AeroVironment", price: 220.56, dayChange: -2.61 },
  { ticker: "BAESY", company: "BAE Systems", price: 115.36, dayChange: -5.64 },
  { ticker: "MRCY", company: "Mercury Systems", price: 84.96, dayChange: -4.73 },
  { ticker: "BA", company: "Boeing", price: 222.01, dayChange: -2.33 },
  { ticker: "LDOS", company: "Leidos", price: 175.63, dayChange: -0.61 },
  { ticker: "FTNT", company: "Fortinet", price: 84.42, dayChange: 1.97 },
  { ticker: "CRWD", company: "CrowdStrike", price: 426.16, dayChange: 4.53 },
  { ticker: "JOBY", company: "Joby Aviation", price: 9.62, dayChange: -2.78 },
  { ticker: "ACHR", company: "Archer Aviation", price: 6.45, dayChange: -4.59 },
  { ticker: "PANW", company: "Palo Alto Networks", price: 163.16, dayChange: 2.90 },
  { ticker: "SAIC", company: "SAIC", price: 93.41, dayChange: 0.12 },
  { ticker: "BAH", company: "Booz Allen", price: 79.81, dayChange: 1.87 }
];

// =====================
// SIGNALS FEED (continues into Part 2)
// =====================
// IMPORTANT: Do NOT close this array here. It continues into dsm_part2.js.
const signalsFeedData = [
  {
    id: 1,
    timestamp: "2026-02-28T12:10:00Z",
    title: "US & Israel launch strikes on Iran; Supreme Leader reported killed",
    category: "Military Escalation",
    summary:
      "Joint US-Israeli strikes hit Iranian missile facilities and leadership targets; reports indicate Iran’s Supreme Leader was killed.",
    impact: "High",
    tickers: ["LMT", "RTX", "NOC", "GD"],
    sources: [
      {
        name: "Reuters",
        url: "https://www.reuters.com/",
      },
    ],
  },
  {
    id: 2,
    timestamp: "2026-03-01T09:40:00Z",
    title: "Iran launches missile and drone retaliation; Gulf states request more interceptors",
    category: "Military Escalation",
    summary:
      "Iran fired missiles and drones at Israel and US regional partners; Gulf allies reportedly running low on interceptors and asking US to expedite resupply.",
    impact: "High",
    tickers: ["RTX", "LMT", "NOC"],
    sources: [
      {
        name: "CBS News",
        url: "https://www.cbsnews.com/",
      },
    ],
  },
  {
    id: 3,
    timestamp: "2026-03-03T16:00:00Z",
    title: "Defense executives to meet White House on accelerating weapons production; Pentagon drafting ~$50B supplemental",
    category: "Policy / Procurement",
    summary:
      "White House plans meeting with defense firm leaders (incl. Lockheed and RTX) to accelerate production; Pentagon preparing a draft supplemental request around $50B to replenish munitions.",
    impact: "High",
    tickers: ["LMT", "RTX", "NOC", "GD"],
    sources: [
      {
        name: "Reuters",
        url: "https://www.reuters.com/business/aerospace-defense/defense-executives-plan-meet-white-house-strikes-iran-diminish-stockpiles-2026-03-04/",
      },
    ],
  },
  {
    id: 4,
    timestamp: "2026-03-03T18:00:00Z",
    title: "Polymarket Iran-strike betting draws scrutiny after trader profits $500K+",
    category: "Markets / Prediction",
    summary:
      "Reports say a Polymarket user profited more than $500K by betting on timing of US strike on Iran, raising concerns about insider knowledge and calls for regulation.",
    impact: "Medium",
    tickers: ["LMT", "RTX"],
    sources: [
      {
        name: "USA Today",
        url: "https://www.usatoday.com/story/money/2026/03/03/magamyman-polymarket-trader-iran-bets/88949233007/",
      },
      {
        name: "CBS News",
        url: "https://www.cbsnews.com/news/iran-khamenei-prediction-markets-insider-trading/",
      },
    ],
  },
  {
    id: 5,
    timestamp: "2026-03-03T22:00:00Z",
    title: "Lockheed wins $1.9B IDIQ for C-130J training systems (JMATS IV)",
    category: "Contract Award",
    summary:
      "Lockheed Martin Rotary and Mission Systems awarded $1.9B IDIQ for C-130J Maintenance and Training System (JMATS) IV to modernize and sustain C-130J aircrew and maintenance training devices.",
    impact: "High",
    tickers: ["LMT"],
    sources: [
      {
        name: "War.gov",
        url: "https://www.war.gov/News/Contracts/Contract/Article/4420261/contracts-for-march-3-2026/",
      },
    ],
  },
  {
    id: 6,
    timestamp: "2026-03-02T22:00:00Z",
    title: "Northrop awarded $225.1M Navy contract modification for E-130J training materials",
    category: "Contract Award",
    summary:
      "Northrop Grumman Systems awarded $225.1M modification for design, development, and delivery of E-130J training weapons systems materials (Take Charge and Move Out recapitalization program).",
    impact: "High",
    tickers: ["NOC"],
    sources: [
      {
        name: "War.gov",
        url: "https://www.war.gov/News/Contracts/Contract/Article/4419143/contracts-for-march-2-2026/",
      },
    ],
  },
  {
    id: 7,
    timestamp: "2026-03-03T22:30:00Z",
    title: "Raytheon awarded $26.8M Navy BladeRunner prototype integration contract",
    category: "Contract Award",
    summary:
      "Raytheon Co. awarded $26.84M cost-plus-fixed-fee contract for BladeRunner program, integrating ultra-wideband, low-latency processing with phased-array hardware into a system prototype.",
    impact: "Medium",
    tickers: ["RTX"],
    sources: [
      {
        name: "War.gov",
        url: "https://www.war.gov/News/Contracts/Contract/Article/4420261/contracts-for-march-3-2026/",
      },
    ],
  },
  {
    id: 8,
    timestamp: "2026-03-05T10:00:00Z",
    title: "Axios: Iran war showcases new US war machines (PrSM, low-cost drones)",
    category: "Technology / Capability",
    summary:
      "Axios reports the Iran conflict is showcasing new US capabilities, including Precision Strike Missiles (PrSM) and low-cost unmanned combat system drones, alongside expanded AI-enabled targeting.",
    impact: "Medium",
    tickers: ["LMT"],
    sources: [
      {
        name: "Axios",
        url: "https://www.axios.com/2026/03/05/iran-war-anthropic-prsm-drones",
      },
    ],
  },
  {
    id: 9,
    timestamp: "2026-03-05T12:30:00Z",
    title: "U.S. military says Iran’s ability to impact U.S. forces and partners is rapidly declining",
    category: "Military Update",
    summary:
      "CBS live updates cite CENTCOM saying Iran’s ability to impact U.S. forces and regional partners is rapidly declining as strikes continue; Gulf allies reportedly still requesting more interceptors.",
    impact: "High",
    tickers: ["RTX", "LMT"],
    sources: [
      {
        name: "CBS News",
        url: "https://www.cbsnews.com/live-updates/us-iran-war-spreads-azerbaijan-israel-strikes-tehran-lebanon/",
      },
    ],
  },
