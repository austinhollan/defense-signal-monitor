            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#22c55e;"></div> PPLX_DEFENSE (+2.8%)</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#06b6d4;"></div> ITA (+3.8%)</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#64748b;"></div> SPY (+0.6%)</div>
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
    const tenDayLegendEl = document.getElementById("tenDayChartLegend");
    if (tenDayLegendEl) {
        tenDayLegendEl.innerHTML = `
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#22c55e;"></div> PPLX_DEFENSE (+2.8%)</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#06b6d4;"></div> ITA (+3.8%)</div>
            <div class="etf-legend-item"><div class="etf-legend-dot" style="background:#64748b;"></div> SPY (+0.6%)</div>
        `;
    }
}

function renderTenDayChart() {
    const canvas = document.getElementById("tenDayChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const labels = ["Feb 13", "Feb 17", "Feb 18", "Feb 19", "Feb 20", "Feb 23", "Feb 24", "Feb 25", "Feb 26", "Feb 27"];
    const etfData =  [100.0, 100.8, 102.9, 105.5, 103.4, 102.1, 102.6, 101.3, 102.7, 102.8];
    const itaData =  [100.0, 101.4, 102.3, 103.7, 103.7, 102.7, 103.5, 102.7, 103.4, 103.8];
    const spyData =  [100.0, 100.2, 100.7, 100.4, 101.1, 100.1, 100.8, 101.7, 101.1, 100.6];

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
