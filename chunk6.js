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
