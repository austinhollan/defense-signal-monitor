# Defense Signal Monitor

Multi-variable military-political stock intelligence dashboard. Tracks defense equities using signals from military events, congressional insider trading, prediction markets, theater risk assessments, and momentum indicators.

## Features

- **Signal Matrix** — 23 tracked defense/security stocks scored -5 to +5
- **PPLX_DEFENSE ETF** — Signal-weighted hypothetical ETF with 6-month backtest (+27.2% vs ITA +20.0% vs SPY -6.5%)
- **Theater Risk Assessment** — 5 operational theaters (Pacific, Europe, Middle East, Cyber, CONUS)
- **Politician Watchlist** — Congressional insider trading tracker (SASC, HASC, HPSCI members)
- All tickers link to [Perplexity Finance](https://perplexity.ai/finance)

## Signal Sources

| Source | Data |
|--------|------|
| [Capitol Trades](https://www.capitoltrades.com/) | Congressional trading disclosures |
| [Quiver Quantitative](https://www.quiverquant.com/) | Political trading analytics |
| [Defense News](https://www.defensenews.com/) | Defense industry reporting |
| [SIPRI](https://www.sipri.org/) | Arms transfers & military expenditure |
| [DoD Contracts](https://www.defense.gov/News/Contracts/) | Official contract announcements |
| [Polymarket](https://polymarket.com/) | Prediction market probabilities |
| [PizzINT](https://pizzint.watch/) | Pentagon Pizza Index OSINT |

## Tech Stack

Static HTML/CSS/JS — no backend, no API keys, no user data collection.

- Chart.js 4.4.1 (CDN with SRI integrity hash)
- IBM Plex Mono + Inter (Google Fonts)
- Content Security Policy enforced via meta tag + Vercel headers

## Security

See [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for the full audit report. Overall risk: **LOW**.

## Disclaimer

Not financial advice. For research purposes only. All data derived from public sources.
