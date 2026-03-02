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

// ============================================
// TAB NAVIGATION
// ============================================
function setupTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            buttons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById('panel-' + tabId);
            if (panel) panel.classList.add('active');
        });
    });
}

// ============================================
// THEATER RISK STRIP (pinned below header)
// ============================================
function renderTheaterStrip() {
    const strip = document.getElementById("theaterStrip");
    if (!strip) return;
    strip.innerHTML = theaterData.map(t => {
        const tickerHtml = t.tickers.map(tk =>
            `<a href="https://perplexity.ai/finance/${tk}" target="_blank" rel="noopener">${tk}</a>`
        ).join(' ');
        return `<div class="theater-chip ${t.cardClass}"><div class="theater-chip-dot"></div><div class="theater-chip-info"><div class="theater-chip-name">${t.name}</div><div class="theater-chip-level">${t.level}</div></div><div class="theater-chip-tickers">${tickerHtml}</div></div>`;
    }).join('');
}

// ============================================
// OVERVIEW TAB
// ============================================
function renderOverview() {
    renderOverviewStocks();
    renderOverviewBearish();
    renderOverviewFeed();
    renderOverviewChart();
    renderOverviewPerfCards();
}

function navigateToMatrixTicker(ticker) {
    // Switch to matrix tab
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const matrixBtn = document.querySelector('.tab-btn[data-tab="matrix"]');
    const matrixPanel = document.getElementById('panel-matrix');
    if (matrixBtn) matrixBtn.classList.add('active');
    if (matrixPanel) matrixPanel.classList.add('active');
    // Find and highlight the row
    setTimeout(() => {
        const rows = document.querySelectorAll('#matrixBody tr');
        rows.forEach(row => {
            row.classList.remove('matrix-highlight');
            const tickerCell = row.querySelector('.ticker-cell');
            if (tickerCell && tickerCell.textContent.trim() === ticker) {
                row.classList.add('matrix-highlight');
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => row.classList.remove('matrix-highlight'), 3000);
            }
        });
    }, 100);
}

function renderOverviewStocks() {
    const tbody = document.querySelector("#overviewStocks tbody");
    if (!tbody) return;
    const top5 = stockData.filter(s => s.direction === 'bullish').slice(0, 5);
    tbody.innerHTML = top5.map(stock => {
        const scorePrefix = stock.score > 0 ? '+' : '';
        return `
            <tr class="overview-clickable-row" data-ticker="${stock.ticker}">
                <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
                <td class="company-cell">${stock.company}</td>
                <td class="price-cell">$${stock.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
                <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            </tr>
        `;
    }).join('');
    // Add click handlers (avoid intercepting ticker-link clicks)
    tbody.querySelectorAll('.overview-clickable-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('a.ticker-link')) return;
            navigateToMatrixTicker(row.dataset.ticker);
        });
    });
}

function renderOverviewBearish() {
    const tbody = document.querySelector("#overviewBearish tbody");
    if (!tbody) return;
    const bearish = stockData.filter(s => s.direction === 'bearish');
    tbody.innerHTML = bearish.map(stock => {
        const scorePrefix = stock.score > 0 ? '+' : '';
        return `
            <tr class="row-highlight-bottom overview-clickable-row" data-ticker="${stock.ticker}">
                <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
                <td class="company-cell">${stock.company}</td>
                <td class="price-cell">$${stock.price.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
                <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            </tr>
        `;
    }).join('');
    // Add click handlers
    tbody.querySelectorAll('.overview-clickable-row').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('a.ticker-link')) return;
            navigateToMatrixTicker(row.dataset.ticker);
        });
    });
}

function formatSignalDateTime(date, time) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const parts = date.split('-');
    const m = months[parseInt(parts[1], 10) - 1];
    const d = parseInt(parts[2], 10);
    const hhmm = time || '00:00';
    const [hh, mm] = hhmm.split(':').map(Number);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 || 12;
    return `${m} ${d}, ${h12}:${mm.toString().padStart(2,'0')} ${ampm}`;
}

function renderSourceLinks(sources) {
    if (!sources || sources.length === 0) return '';
    const links = sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="signal-source-link">${s.name}</a>`).join(' ');
    return `<span class="signal-sources">${links}</span>`;
}

function renderOverviewFeed() {
    const feed = document.getElementById("overviewFeed");
    if (!feed) return;
    const sorted = signalsFeedData.slice().sort((a, b) => {
        const da = a.date + (a.time || "00:00");
        const db = b.date + (b.time || "00:00");
        return db.localeCompare(da);
    });
    const recent = sorted.slice(0, 8);
    feed.innerHTML = recent.map((sig, i) => `
        <div class="signal-entry${sig.recent ? ' recent' : ''}" style="animation-delay:${i * 0.05}s">
            <span class="signal-date">${formatSignalDateTime(sig.date, sig.time)}</span>
            <span class="signal-tag ${sig.tagClass}">${sig.tag}</span>
            <span class="signal-text">${linkifyTickers(sig.text)}${renderSourceLinks(sig.sources)}</span>
        </div>
    `).join('');
}

// Track chart instances for proper cleanup on re-render
let _overviewChartInstance = null;
let _etfChartInstance = null;
let _tenDayChartInstance = null;

function renderOverviewChart() {
    const canvas = document.getElementById("overviewChart");
    if (!canvas) return;
    if (_overviewChartInstance) { _overviewChartInstance.destroy(); _overviewChartInstance = null; }
    const ctx = canvas.getContext("2d");
    _overviewChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: perfLabels,
            datasets: [
                {
                    label: 'PPLX_DEFENSE',
                    data: perfETF,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.08)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'ITA',
                    data: perfITA,
                    borderColor: '#06b6d4',
                    borderWidth: 1.5,
                    borderDash: [4, 3],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 3
                },
                {
                    label: 'SPY',
                    data: perfSPY,
                    borderColor: '#64748b',
                    borderWidth: 1.5,
                    borderDash: [2, 2],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 3
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
                    titleFont: { family: "'IBM Plex Mono'", size: 10, weight: '600' },
                    bodyFont: { family: "'IBM Plex Mono'", size: 11 },
                    titleColor: '#94a3b8',
                    bodyColor: '#e2e8f0',
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            const val = context.parsed.y;
                            const change = (val - 100).toFixed(1);
                            const sign = change >= 0 ? '+' : '';
                            return `${context.dataset.label}: ${sign}${change}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: "'IBM Plex Mono'", size: 9 } },
                    grid: { color: 'rgba(30,41,59,0.4)', drawBorder: false }
                },
                y: {
                    ticks: {
                        color: '#64748b',
                        font: { family: "'IBM Plex Mono'", size: 9 },
                        callback: v => (v - 100).toFixed(0) + '%'
                    },
                    grid: { color: 'rgba(30,41,59,0.4)', drawBorder: false }
                }
            }
        }
    });
}

function renderOverviewPerfCards() {
    const row = document.getElementById("overviewPerfRow");
    if (!row) return;
    const etfRet = perfETF[perfETF.length - 1] - 100;
    const itaRet = perfITA[perfITA.length - 1] - 100;
    const spyRet = perfSPY[perfSPY.length - 1] - 100;

    row.innerHTML = `
        <div class="overview-perf-card primary">
            <div class="overview-perf-label">PPLX_DEFENSE</div>
            <div class="overview-perf-value positive">+${etfRet.toFixed(1)}%</div>
        </div>
        <div class="overview-perf-card secondary">
            <div class="overview-perf-label">ITA</div>
            <div class="overview-perf-value positive">+${itaRet.toFixed(1)}%</div>
        </div>
        <div class="overview-perf-card tertiary">
            <div class="overview-perf-label">SPY</div>
            <div class="overview-perf-value negative">${spyRet.toFixed(1)}%</div>
        </div>
    `;
}

// ============================================
// RENDER SIGNAL MATRIX
// ============================================
function renderMatrix(data) {
    const tbody = document.getElementById("matrixBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((stock, i) => {
        const tr = document.createElement("tr");
        tr.style.animationDelay = `${i * 0.02}s`;
        if (stock.score >= 4) tr.classList.add("row-highlight-top");
        else if (stock.score <= -3) tr.classList.add("row-highlight-bottom");

        const scorePrefix = stock.score > 0 ? "+" : "";
        tr.innerHTML = `
            <td class="ticker-cell">${tickerLink(stock.ticker)}</td>
            <td class="company-cell">${stock.company}</td>
            <td class="price-cell">$${stock.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="score-cell"><span class="score-badge ${stock.direction}">${scorePrefix}${stock.score}</span></td>
            <td><span class="direction-badge ${stock.direction}">${stock.direction.toUpperCase()}</span></td>
            <td class="summary-cell">${linkifyTickers(stock.summary)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// ============================================
// RENDER ETF TAB — POSITION CHANGES SECTION
// ============================================
function renderPositionChanges() {
    const container = document.getElementById('positionChangesGrid');
    if (!container) return;

    const upgrades = positionChanges.filter(p => p.action === 'UPGRADE');
    const downgrades = positionChanges.filter(p => p.action === 'DOWNGRADE');
    const holds = positionChanges.filter(p => p.action === 'HOLD');
    const priorityActions = positionChanges.filter(p => p.priority !== null);

    // Summary stats
    const summaryEl = document.getElementById('posChangeSummary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="pos-change-stat">
                <span class="pos-stat-count upgrade-count">${upgrades.length}</span>
                <span class="pos-stat-label">UPGRADES</span>
            </div>
            <div class="pos-change-stat">
                <span class="pos-stat-count downgrade-count">${downgrades.length}</span>
                <span class="pos-stat-label">DOWNGRADES</span>
            </div>
            <div class="pos-change-stat">
                <span class="pos-stat-count hold-count">${holds.length}</span>
                <span class="pos-stat-label">REVIEWED / HELD</span>
            </div>
            <div class="pos-change-stat">
                <span class="pos-stat-count net-count">${upgrades.length - downgrades.length > 0 ? '+' : ''}${upgrades.length - downgrades.length}</span>
                <span class="pos-stat-label">NET SCORE CHANGE</span>
            </div>
            <div class="pos-change-stat priority-stat">
                <span class="pos-stat-count priority-count">${priorityActions.length}</span>
                <span class="pos-stat-label">PRIORITY ACTIONS</span>
            </div>
        `;
    }

    let html = '';
    // Sort: priority high first, then medium, then non-priority
    const priorityOrder = { high: 0, medium: 1 };
    const allChanges = [...upgrades, ...holds, ...downgrades];
    allChanges.sort((a, b) => {
        const aP = a.priority ? (priorityOrder[a.priorityUrgency] ?? 2) : 3;
        const bP = b.priority ? (priorityOrder[b.priorityUrgency] ?? 2) : 3;
        if (aP !== bP) return aP - bP;
        return 0; // preserve original order within same priority
    });

    allChanges.forEach((pc, i) => {
        const isUpgrade = pc.action === 'UPGRADE';
        const isDowngrade = pc.action === 'DOWNGRADE';
        const actionClass = isUpgrade ? 'upgrade' : isDowngrade ? 'downgrade' : 'hold';
        const arrow = isUpgrade ? '&#9650;' : isDowngrade ? '&#9660;' : '&#9654;';
        const scoreDelta = pc.newScore - pc.oldScore;
        const deltaStr = scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta === 0 ? '0' : `${scoreDelta}`;

        // Live price + day change — pull from shared stockData for consistency
        const liveStock = stockData.find(s => s.ticker === pc.ticker);
        const livePrice = liveStock ? liveStock.price : pc.price;
        const liveDayChange = (liveStock && typeof liveStock.dayChange === 'number') ? liveStock.dayChange : (pc.dayChange || 0);
        const priceStr = '$' + livePrice.toFixed(2);
        const changeSign = liveDayChange >= 0 ? '+' : '';
        const changeClass = liveDayChange >= 0 ? 'day-positive' : 'day-negative';
        const changeStr = `${changeSign}${liveDayChange.toFixed(2)}%`;

        // Priority action badge
        let priorityHtml = '';
        if (pc.priority) {
            const pClass = pc.priority === 'BUY' ? 'priority-buy' : pc.priority === 'EXIT' ? 'priority-exit' : 'priority-reduce';
            const pIcon = pc.priority === 'BUY' ? '&#9650;' : pc.priority === 'EXIT' ? '&#9747;' : '&#9660;';
            const urgencyLabel = pc.priorityUrgency === 'high' ? 'IMMEDIATE' : 'NEAR-TERM';
            priorityHtml = `
            <div class="priority-action-banner ${pClass}">
                <div class="priority-action-header">
                    <span class="priority-action-icon">${pIcon}</span>
                    <span class="priority-action-label">${urgencyLabel} — ${pc.priority}</span>
                    <span class="priority-action-pulse"></span>
                </div>
                <div class="priority-action-rationale">${linkifyTickers(pc.priorityRationale)}</div>
            </div>`;
        }

        const hasPriority = pc.priority !== null;

        html += `
        <div class="pos-change-card ${actionClass}${hasPriority ? ' has-priority' : ''}${hasPriority ? ' priority-' + pc.priorityUrgency : ''}" style="animation-delay:${i * 0.06}s">
            ${priorityHtml}
            <div class="pos-change-header">
                <div class="pos-change-ticker-group">
                    <span class="pos-change-action-badge ${actionClass}">${arrow} ${pc.action}</span>
                    <span class="pos-change-ticker">${tickerLink(pc.ticker)}</span>
                    <span class="pos-change-company">${pc.company}</span>
                    <span class="pos-change-price-live">
                        <span class="pos-price-value">${priceStr}</span>
                        <span class="pos-day-change ${changeClass}">${changeStr}</span>
                    </span>
                </div>
                <div class="pos-change-score-shift">
                    <span class="pos-old-score">+${pc.oldScore}</span>
                    <span class="pos-arrow">&rarr;</span>
                    <span class="pos-new-score ${actionClass}">+${pc.newScore}</span>
                    <span class="pos-delta ${actionClass}">(${deltaStr})</span>
                </div>
            </div>
            <div class="pos-change-signal">${linkifyTickers(pc.signal)}</div>
            <div class="pos-change-catalysts">
                ${pc.catalysts.map(c => `<span class="pos-catalyst-tag ${actionClass}">${c}</span>`).join('')}
            </div>
        </div>
        `;
    });
    container.innerHTML = html;
}

// ============================================
// ETF TAB — Full Section
// ============================================
function renderETFTab() {
    // Position changes section (new Feb 24)
    renderPositionChanges();

    const weightedHoldings = computeETFWeights(etfHoldings);
    const maxWeight = Math.max(...weightedHoldings.map(h => h.weight));

    // Compute backtest
    const stockResults = weightedHoldings.map(h => {
        const bt = backtestData.find(b => b.ticker === h.ticker);
        if (!bt || bt.start === null) return { ...h, start: null, end: null, return: null, excluded: true };
        const ret = (bt.end - bt.start) / bt.start;
        return { ...h, start: bt.start, end: bt.end, return: ret, excluded: false };
    });

    const backtestStocks = stockResults.filter(s => !s.excluded);
    const totalBW = backtestStocks.reduce((s, h) => s + h.weight, 0);
    backtestStocks.forEach(s => {
        s.backtestWeight = s.weight / totalBW;
        s.contribution = s.backtestWeight * s.return;
    });

    const etfReturn = backtestStocks.reduce((s, h) => s + h.contribution, 0);
    const spyReturn = (benchmarkData.SPY.end - benchmarkData.SPY.start) / benchmarkData.SPY.start;
    const itaReturn = (benchmarkData.ITA.end - benchmarkData.ITA.start) / benchmarkData.ITA.start;
    const alphaVsSPY = etfReturn - spyReturn;

    // Hero row
    const heroRow = document.getElementById("etfHeroRow");
    if (heroRow) {
        heroRow.innerHTML = `
            <div class="etf-hero-card etf-primary">
                <div class="etf-hero-label">PPLX_DEFENSE RETURN</div>
                <div class="etf-hero-value positive">+${(etfReturn * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">6-month signal-weighted</div>
            </div>
            <div class="etf-hero-card etf-bench">
                <div class="etf-hero-label">ITA (BENCHMARK)</div>
                <div class="etf-hero-value positive">+${(itaReturn * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">iShares Aerospace & Defense</div>
            </div>
            <div class="etf-hero-card etf-spy">
                <div class="etf-hero-label">SPY (S&P 500)</div>
                <div class="etf-hero-value negative">${(spyReturn * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">SPDR S&P 500</div>
            </div>
            <div class="etf-hero-card etf-alpha">
                <div class="etf-hero-label">ALPHA vs SPY</div>
                <div class="etf-hero-value positive">+${(alphaVsSPY * 100).toFixed(1)}%</div>
                <div class="etf-hero-sub">Excess return</div>
            </div>
        `;
    }

    // Performance chart
    renderETFChart();

    // Legend
    const legendEl = document.getElementById("etfChartLegend");
    if (legendEl) {
        legendEl.innerHTML = `