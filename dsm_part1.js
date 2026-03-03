// dsm_part1.js — utils + initial data (do not close signalsFeedData array here)

// -------- Utilities
const fmtMoney = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "–";
  const num = Number(n);
  return "$" + num.toFixed(2);
};

const fmtPct = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "–";
  const num = Number(n);
  const sign = num > 0 ? "+" : "";
  return sign + num.toFixed(2) + "%";
};

const clsPct = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "";
  return Number(n) >= 0 ? "chgpos" : "chgneg";
};

// -------- Stock data (prices updated hourly)
const stockData = [
  { ticker: "LMT", company: "Lockheed Martin", price: 667.71, dayChange: -1.33 },
  { ticker: "RTX", company: "RTX", price: 206.52, dayChange: -2.66 },
  { ticker: "NOC", company: "Northrop Grumman", price: 758.99, dayChange: -1.18 },
  { ticker: "KTOS", company: "Kratos", price: 88.95, dayChange: -1.95 },
  { ticker: "RKLB", company: "Rocket Lab", price: 70.13, dayChange: -1.18 },
  { ticker: "BWXT", company: "BWX Technologies", price: 205.84, dayChange: -4.91 },
  { ticker: "HII", company: "Huntington Ingalls", price: 440.55, dayChange: -2.90 },
  { ticker: "CW", company: "Curtiss-Wright", price: 702.12, dayChange: -3.35 },
  { ticker: "GD", company: "General Dynamics", price: 364.70, dayChange: -0.02 },
  { ticker: "LHX", company: "L3Harris", price: 367.99, dayChange: -2.77 },
  { ticker: "PLTR", company: "Palantir", price: 147.22, dayChange: 1.41 },
  { ticker: "AVAV", company: "AeroVironment", price: 228.30, dayChange: 9.59 },
  { ticker: "BAESY", company: "BAE Systems", price: 119.56, dayChange: -0.24 },
  { ticker: "MRCY", company: "Mercury Systems", price: 89.43, dayChange: -1.74 },
  { ticker: "BA", company: "Boeing", price: 224.06, dayChange: -2.47 },
  { ticker: "LDOS", company: "Leidos", price: 180.76, dayChange: 0.76 },
  { ticker: "FTNT", company: "Fortinet", price: 81.10, dayChange: 2.42 },
  { ticker: "CRWD", company: "CrowdStrike", price: 391.42, dayChange: 1.70 },
  { ticker: "JOBY", company: "Joby Aviation", price: 9.77, dayChange: -4.92 },
  { ticker: "ACHR", company: "Archer", price: 6.72, dayChange: -10.64 },
  { ticker: "PANW", company: "Palo Alto Networks", price: 156.09, dayChange: 3.96 },
  { ticker: "SAIC", company: "SAIC", price: 94.42, dayChange: 2.09 },
  { ticker: "BAH", company: "Booz Allen", price: 79.20, dayChange: 1.79 },
];

// -------- Signals Feed data (array continues in dsm_part2.js)
const signalsFeedData = [
  {
    title: "U.S. strikes Iran in 'Operation Epic Fury' as conflict escalates",
    desc:
      "Reports indicate U.S. and Israeli airstrikes have hit numerous Iranian targets, with the U.S. military reporting casualties and ongoing operations.",
    source: "CBS News",
    url: "https://www.cbsnews.com/live-updates/iran-us-war-day-3-american-deaths-israel-gulf-allies-hit-missile-strikes/",
    time: "Mar 3, 2026",
    tags: ["Iran", "U.S. military", "CENTCOM"],
  },
  {
    title: "Polymarket Iran strike markets draw scrutiny over potential insider trading",
    desc:
      "Large, well-timed bets ahead of U.S.-Israel strikes on Iran have prompted calls for investigation and oversight of prediction markets.",
    source: "NPR",
    url: "https://www.npr.org/2026/03/01/nx-s1-5731568/polymarket-trade-iran-supreme-leader-killing",
    time: "Mar 2, 2026",
    tags: ["Polymarket", "Congress", "Iran"],
  },
  {
    title: "Kratos receives $7M order for Counter-UAS Systems",
    desc:
      "Kratos announced a ~$7M production contract award for a Counter-UAS system to detect and track aerial threats.",
    source: "Kratos",
    url: "https://www.kratosdefense.com/newsroom/kratos-receives-7-million-order-for-counter-uas-systems",
    time: "Mar 3, 2026",
    tags: ["Contract", "Counter-UAS", "KTOS"],
  },
  {
    title: "Congressman raises concerns about Polymarket bettor profits ahead of Iran strike",
    desc:
      "Rep. Mike Levin flagged suspiciously timed Polymarket wagers generating over $500k from Iran-strike related contracts.",
    source: "Mediaite",
    url: "https://www.mediaite.com/media/news/we-need-answers-congressman-calls-out-polymarket-bettor-who-scored-more-than-500k-overnight-on-iran-strike/",
    time: "Mar 1, 2026",
    tags: ["Congress", "Polymarket", "Oversight"],
  },
  {
    title: "Pentagon policy chief argues Iran strikes aren't an 'endless' war",
    desc:
      "Pentagon officials defended the operation against Iran amid scrutiny of strategy shifts and campaign duration.",
    source: "POLITICO",
    url: "https://www.politico.com/news/2026/03/03/iran-strikes-arent-an-endless-war-pentagon-policy-chief-argues-00808690",
    time: "Mar 3, 2026",
    tags: ["Pentagon", "Policy", "Iran"],
  },
  {
    title: "Senate Armed Services hearing: GOP chair criticizes Pentagon strategy amid Iran situation",
    desc:
      "SASC Chairman Roger Wicker criticized the National Defense Strategy and questioned alignment with current Middle East military operations.",
    source: "The Hill",
    url: "https://thehill.com/policy/defense/5765238-pentagon-criticized-russia-ukraine-middle-east/",
    time: "Mar 3, 2026",
    tags: ["Congress", "Pentagon", "Strategy"],
  },
  {
    title: "Polymarket Iran page shows Hormuz closure odds near coin-flip by June",
    desc:
      "Polymarket's Iran hub lists markets including Strait of Hormuz closure odds and leadership transition timelines.",
    source: "Polymarket",
    url: "https://polymarket.com/iran",
    time: "Mar 2, 2026",
    tags: ["Polymarket", "Hormuz", "Iran"],
  },
  {
    title: "Sentdefender reports Iranian drone hit U.S. Consulate in Dubai",
    desc:
      "OSINTdefender posted that an Iranian one-way attack drone struck the U.S. Consulate in Dubai, causing a small fire with no injuries reported.",
    source: "OSINTdefender",
    url: "https://x.com/sentdefender/status/2028921988778021153",
    time: "Mar 3, 2026",
    tags: ["Iran", "UAE", "Drone"],
  },
  {
    title: "Sentdefender: U.S. considering moving Patriot/THAAD assets from South Korea to Middle East",
    desc:
      "OSINTdefender cited Chosun Daily reporting possible relocation of air defenses and ISR assets amid Iran conflict.",
    source: "OSINTdefender",
    url: "https://x.com/sentdefender/status/2028675746068152807",
    time: "Mar 3, 2026",
    tags: ["THAAD", "Patriot", "Middle East"],
  },
  {
    title: "Sentdefender: Macron says France will deploy carrier Charles de Gaulle to eastern Mediterranean",
    desc:
      "French president said the carrier will be sent to support defense of Gulf partners and protect shipping.",
    source: "OSINTdefender",
    url: "https://x.com/sentdefender/status/2028913723138818508",
    time: "Mar 3, 2026",
    tags: ["France", "Carrier", "Hormuz"],
  },
  {
    title: "Sentdefender: Trump orders DFC political risk insurance for maritime trade; Navy escorts possible",
    desc:
      "OSINTdefender shared Trump's post ordering DFC to provide political risk insurance and suggesting U.S. Navy escorts through the Strait of Hormuz.",
    source: "OSINTdefender",
    url: "https://x.com/sentdefender/status/2028924803382755823",
    time: "Mar 3, 2026",
    tags: ["Hormuz", "Shipping", "U.S. Navy"],
  },
  {
    title: "Sentdefender: Sirens in Bahrain amid incoming threats",
    desc: "OSINTdefender reported sirens in Bahrain during the ongoing Iran conflict.",
    source: "OSINTdefender",
    url: "https://x.com/sentdefender/status/2028922045862457683",
    time: "Mar 3, 2026",
    tags: ["Bahrain", "Iran"],
  },
  {
    title: "Sentdefender: Tel Aviv sirens + explosions heard; initial reports of impacts in open areas",
    desc:
      "OSINTdefender posted about renewed sirens and explosions near Tel Aviv with early reports of impacts in open areas.",
    source: "OSINTdefender",
    url: "https://x.com/sentdefender/status/2028939117673799724",
    time: "Mar 3, 2026",
    tags: ["Israel", "Iran", "Missiles"],
  },
  {
    title: "Sentdefender: Iran International reports Mojtaba Khamenei elected next Supreme Leader",
    desc:
      "OSINTdefender cited Iran International reporting Mojtaba Khamenei elected next Supreme Leader under IRGC pressure.",
    source: "OSINTdefender",
    url: "https://x.com/sentdefender/status/2028935122745983366",
    time: "Mar 3, 2026",
    tags: ["Iran", "Leadership"],
  },
