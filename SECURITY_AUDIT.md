# Security Audit Report — Defense Signal Monitor
**Audited:** `/home/user/workspace/defense-monitor/` (index.html, style.css, app.js)  
**Date:** 2026-02-21  
**Auditor:** Automated Static Analysis  
**Application Type:** Static client-side SPA (no backend, no server, no user authentication)

---

## Executive Summary

The Defense Signal Monitor is a read-only, static dashboard. All data is hardcoded in `app.js` — there is no backend, no API calls, no user authentication, and no user-submitted data. This substantially limits the attack surface. There are **no critical vulnerabilities** and **no high-severity issues** in the current state. However, there are several **medium** and **low** severity findings that would become exploitable if the application were ever extended to accept external data, and there are immediately actionable hardening improvements around dependency integrity and missing security headers.

**Overall Risk: LOW** for the current static, hardcoded data deployment.  
**Residual Risk: MEDIUM** if data sources are ever made dynamic (API-fed, user-supplied, or CMS-driven).

---

## Finding Index

| # | Severity | Category | Title |
|---|----------|----------|-------|
| F-01 | MEDIUM | XSS / Architecture | `innerHTML` used with HTML-containing data strings throughout |
| F-02 | MEDIUM | XSS / Architecture | `linkifyTickers()` applied to HTML-containing text, creating regex-on-HTML pattern |
| F-03 | LOW | XSS | CSS class injection via unvalidated data fields interpolated into class attributes |
| F-04 | LOW | XSS | `pol.committee` rendered without escaping or `linkifyTickers` wrapping |
| F-05 | LOW | Dependency | Missing Subresource Integrity (SRI) hash on Chart.js CDN script |
| F-06 | LOW | Dependency | Google Fonts loaded without SRI (by design limitation, but risk noted) |
| F-07 | LOW | Security Headers | No Content Security Policy (CSP) meta tag |
| F-08 | LOW | Security Headers | No `X-Frame-Options` or `X-Content-Type-Options` equivalent meta tags |
| F-09 | INFO | DOM | `dataset.tab` used to construct an `getElementById` lookup — safe as-is |
| F-10 | INFO | Privacy | No tracking scripts, no analytics, no external data exfiltration |
| F-11 | INFO | Sensitive Data | No API keys, credentials, or PII in source |
| F-12 | INFO | External Links | All external links correctly use `rel="noopener"` and `target="_blank"` |
| F-13 | INFO | Content | No mixed content issues |

---

## Detailed Findings

---

### F-01 — MEDIUM: `innerHTML` Used with HTML-Embedded Data Strings

**File:** `app.js`  
**Lines:** 222, 281–285, 415–422, 457–478, 511–521, 537–542, 663–676

**Description:**  
`innerHTML` is used extensively to render template-literal HTML. Several data fields — specifically `signalsFeedData[].text` — contain raw HTML tags (`<strong>`) that are rendered directly via `innerHTML`:

```javascript
// app.js line 281–285
feed.innerHTML = recent.map((sig, i) => `
    <div class="signal-entry${sig.recent ? ' recent' : ''}" style="animation-delay:${i * 0.05}s">
        <span class="signal-date">${sig.date}</span>
        <span class="signal-tag ${sig.tagClass}">${sig.tag}</span>
        <span class="signal-text">${linkifyTickers(sig.text)}</span>  // sig.text contains <strong> tags
    </div>
`).join('');
```

Examples of `sig.text` values containing raw HTML (app.js lines 54–72):
```javascript
{ text: "US strikes Iran by Feb 28 surges to 19% (from 2%). <strong>$338M+ total volume...</strong>", ... }
{ text: "...using <strong>classified military intelligence</strong> to place Polymarket bets.", ... }
```

The same pattern exists for `stock.summary` (line 421) and `pol.summary` (line 675) — though those fields currently contain no HTML — and is passed through `linkifyTickers()` before rendering.

**Current Risk:** LOW — all data is hardcoded in `app.js` and authored by the developer. No user input or external API feeds these strings.

**Future Risk: MEDIUM** — if `signalsFeedData`, `stockData`, or `politicianData` are ever fetched from an API, CMS, or database, the `innerHTML` + embedded-HTML pattern becomes a stored XSS vulnerability. An attacker controlling any data field could inject arbitrary HTML and JavaScript (e.g., `<img src=x onerror=alert(1)>`).

**Recommended Fix:**  
1. **Separate structure from content.** Use `textContent` for all user/data-sourced text, and build DOM nodes with `createElement` + `appendChild`.
2. **If HTML formatting is needed** in text fields (bold, links), use a strict allowlist sanitizer (e.g., [DOMPurify](https://github.com/cure53/DOMPurify)) before assigning to `innerHTML`:
   ```javascript
   import DOMPurify from 'dompurify';
   element.innerHTML = DOMPurify.sanitize(sig.text, { ALLOWED_TAGS: ['strong', 'em', 'a'], ALLOWED_ATTR: ['href', 'rel', 'target', 'class'] });
   ```
3. **Long-term:** migrate to a framework (React, Svelte) that auto-escapes by default, or adopt a template engine with auto-escaping.

---

### F-02 — MEDIUM: `linkifyTickers()` Applied to HTML Strings — Regex-on-HTML Anti-Pattern

**File:** `app.js`  
**Lines:** 15–23, 285, 421, 675

**Description:**  
`linkifyTickers()` runs regex replacements on strings that **already contain HTML**. This is the classic "regex on HTML" anti-pattern:

```javascript
// app.js lines 15–23
function linkifyTickers(text) {
    const sorted = UNIQUE_TICKERS.slice().sort((a, b) => b.length - a.length);
    let result = text;
    sorted.forEach(ticker => {
        const regex = new RegExp(`(?<![\\w/">])\\b(${ticker})\\b(?![^<]*<\\/a>)(?![-\\w])`, 'g');
        result = result.replace(regex, `<a href="https://perplexity.ai/finance/${ticker}" target="_blank" rel="noopener" class="ticker-link">$1</a>`);
    });
    return result;
}
```

Called with HTML-bearing strings:
```javascript
// app.js line 285
<span class="signal-text">${linkifyTickers(sig.text)}</span>
// where sig.text is: "...BULLISH: LMT, RTX, NOC.</strong>"
```

The negative lookahead `(?![^<]*<\/a>)` attempts to avoid double-linking, but this lookahead is fragile: it scans forward for `</a>` without accounting for nested tags. Unusual ticker names that happen to match attribute values in injected HTML could bypass the guard.

More critically, if any `ticker` in `ALL_TICKERS` ever contained regex metacharacters (e.g., `C++`, `BRK.B`), the `new RegExp(ticker)` call would throw or produce unintended matches. Currently all tickers are safe uppercase ASCII, but this is an implicit assumption, not an enforced constraint.

```javascript
// app.js line 12 — if any future ticker were "C++" or "U.S.":
const ALL_TICKERS = ["LMT","RTX","NOC",...]; // safe today, implicit constraint
```

**Current Risk:** LOW — tickers are hardcoded safe strings, HTML in text fields is developer-authored.

**Recommended Fix:**  
1. Validate `ALL_TICKERS` entries against a strict allowlist regex (e.g., `/^[A-Z]{1,5}$/`) before constructing `RegExp` objects.
2. Run `linkifyTickers()` only on **plain text** strings. If the text contains markup, parse it as a DOM tree (using `DOMParser` or a `<template>` element) and linkify text nodes only:
   ```javascript
   function linkifyTextNode(textNode) {
       // operate on Text nodes only, never on raw HTML strings
   }
   ```

---

### F-03 — LOW: CSS Class Injection via Unvalidated Data Fields in Class Attributes

**File:** `app.js`  
**Lines:** 226, 252–253, 270–271, 282, 284, 419–420, 669, 672

**Description:**  
Multiple data fields are interpolated directly into HTML `class` attribute values without validation:

```javascript
// app.js line 226
`<div class="theater-chip ${t.cardClass}">` // t.cardClass from theaterData

// app.js line 252–253
`<span class="score-badge ${stock.direction}">` // stock.direction from stockData
`<span class="direction-badge ${stock.direction}">`

// app.js line 284
`<span class="signal-tag ${sig.tagClass}">` // sig.tagClass from signalsFeedData

// app.js line 669
`<span class="suspicion-badge ${pol.suspicionClass}">` // pol.suspicionClass from politicianData

// app.js line 672
`<span class="committee-dot ${pol.conflictLevel}">` // pol.conflictLevel from politicianData
```

If any of these fields were externally sourced, an attacker could inject class names that break layout, or in some browser/CSS configurations, trigger CSS-based data exfiltration via attribute selectors. More immediately: a value like `" onmouseover="alert(1)` would break out of the class attribute and inject an event handler.

**Current Risk:** LOW — all values are hardcoded developer-controlled strings (`"bullish"`, `"high"`, `"polymarket"`, etc.).

**Recommended Fix:**  
Validate or sanitize class values against an explicit allowlist before interpolation:

```javascript
const VALID_DIRECTIONS = new Set(['bullish', 'bearish', 'neutral']);
const safeDirection = VALID_DIRECTIONS.has(stock.direction) ? stock.direction : 'neutral';
// Then use safeDirection in the template
```

---

### F-04 — LOW: `pol.committee` Rendered Unescaped Without Linkification Wrapper

**File:** `app.js`  
**Lines:** 673

**Description:**  
The `pol.committee` field is interpolated into `innerHTML` without any HTML escaping or sanitization:

```javascript
// app.js lines 671–673
<div class="pol-committee">
    <span class="committee-dot ${pol.conflictLevel}"></span>
    ${pol.committee}   // ← no escaping, no linkifyTickers, direct interpolation
</div>
```

While `pol.summary` is passed through `linkifyTickers()`, `pol.committee` is not — making it inconsistent. Current values are benign strings like `"SASC"` or `"HASC / Approps"`, but this is an unguarded injection point if `politicianData` is ever populated from an external source.

**Recommended Fix:**  
Either escape the value with a helper function or pass it through `linkifyTickers()` for consistency:

```javascript
function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// Then:
${escapeHtml(pol.committee)}
```

---

### F-05 — LOW: Missing Subresource Integrity (SRI) Hash on Chart.js CDN Script

**File:** `index.html`  
**Line:** 10

**Description:**  
Chart.js is loaded from jsDelivr CDN without an SRI integrity hash:

```html
<!-- index.html line 10 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

Without SRI, if the CDN were compromised or the URL served a different file (due to CDN cache poisoning, BGP hijacking, or supply chain compromise), the browser would execute the malicious script silently. The version is pinned (`@4.4.1`), which is good — but pinning alone is insufficient without integrity verification.

**Note:** Google Fonts (lines 7–9) is a CSS resource loaded without SRI. SRI on cross-origin stylesheets is less critical than on scripts, but the same class of risk applies in theory (CSS can exfiltrate data via attribute selectors and `url()` requests).

**Recommended Fix:**  
Generate the SRI hash for the current file and add the `integrity` and `crossorigin` attributes:

```bash
# Generate hash:
curl -s https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

```html
<!-- Fixed: -->
<script
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
  integrity="sha384-<hash-here>"
  crossorigin="anonymous">
</script>
```

jsDelivr provides pre-computed SRI hashes at: `https://www.jsdelivr.com/package/npm/chart.js?version=4.4.1`

---

### F-06 — LOW: Google Fonts Loaded Without SRI

**File:** `index.html`  
**Lines:** 7–9

**Description:**  
```html
<!-- index.html lines 7–9 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

Google Fonts dynamically generates CSS responses (the `display=swap` URL returns different content based on the `User-Agent`), which makes SRI hashes impossible to pre-compute for this resource. This is a known limitation of the Google Fonts API.

**Risk:** The primary risk is that Google Fonts serves a CSS file that loads font files from `fonts.gstatic.com`. Google could theoretically embed tracking or a malicious `url()` call. In practice, this is a trusted service, but for a high-assurance deployment it represents an external dependency.

**Recommended Fix (options, in order of preference):**
1. **Self-host fonts:** Download the WOFF2 files and the CSS, serve them locally. This eliminates the external dependency entirely and also improves performance.
2. **Accept the risk** with the understanding that Google Fonts is a widely-trusted CDN with no history of compromise.

---

### F-07 — LOW: No Content Security Policy (CSP)

**File:** `index.html`  
**Lines:** 1–12 (head section)

**Description:**  
No `Content-Security-Policy` meta tag or HTTP header is configured. Without a CSP, the browser has no restrictions on:
- Where scripts can be loaded from
- Inline script execution
- Where data can be sent (`connect-src`)
- Framing of the page (`frame-ancestors`)

This does not represent an immediate exploit, but it means there is no defense-in-depth layer. If an XSS vulnerability is introduced, a CSP would limit its impact.

**Recommended Fix:**  
Add a CSP meta tag (note: meta-tag CSP cannot set `frame-ancestors` or `sandbox` — a server-sent header is preferred for full coverage, but a meta tag is useful for static deployments):

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  connect-src 'none';
  img-src 'self' data:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'none';
">
```

**Important:** The current application uses no inline `<script>` blocks or inline `style=""` attributes that would require `'unsafe-inline'` — this is excellent and means a strict CSP can be adopted without `'unsafe-inline'`.

---

### F-08 — LOW: No X-Frame-Options / Clickjacking Protection

**File:** `index.html`

**Description:**  
There is no `X-Frame-Options` header or `frame-ancestors` CSP directive. The page can be embedded in an iframe on any origin. For a read-only dashboard this is low risk, but clickjacking could be used to trick users into clicking elements (e.g., ticker links) while the page is overlaid with deceptive UI.

**Recommended Fix:**  
If served via a web server (nginx, Apache, S3 + CloudFront), add:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
```
Or as a meta tag for the CSP `frame-ancestors` directive (see F-07).

---

### F-09 — INFO: `dataset.tab` Used in `getElementById` — Safe As-Is

**File:** `app.js`  
**Lines:** 206, 210

**Description:**  
Tab navigation reads `btn.dataset.tab` from `<button data-tab="...">` elements and constructs a DOM ID lookup:

```javascript
// app.js lines 206, 210
const tabId = btn.dataset.tab;
const panel = document.getElementById('panel-' + tabId);
```

The `data-tab` values (`"overview"`, `"matrix"`, `"etf"`, `"watchlist"`) are hardcoded in the HTML and cannot be modified by an attacker without already having code execution. `getElementById` is not an injection vector — it simply returns `null` for unmatched IDs. **No action required.**

---

### F-10 — INFO: No Tracking Scripts or Analytics

**File:** `index.html`, `app.js`

**Description:**  
A full audit of all script `src` attributes and JavaScript confirms there are no tracking pixels, analytics beacons, advertising SDKs, session replay tools, or fingerprinting scripts. The only external JavaScript resource is Chart.js (rendering only). No `fetch()`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon()`, or `image.src` tracking calls were found anywhere in the codebase. **This is a positive finding.**

---

### F-11 — INFO: No API Keys, Credentials, or PII in Source

**File:** `app.js`, `index.html`, `style.css`

**Description:**  
A full scan of all three files found:
- No hardcoded API keys, tokens, or secrets
- No private URLs, internal IP addresses, or staging endpoints  
- No PII beyond publicly available information (politician names from public STOCK Act disclosures)
- No database connection strings or credentials

All data in `stockData`, `signalsFeedData`, `politicianData`, and `theaterData` is either publicly available financial data, publicly reported political trading disclosures, or editorial analysis. **This is a positive finding.**

---

### F-12 — INFO: External Links Correctly Use `rel="noopener"`

**File:** `index.html` (lines 340–349, 360–364), `app.js` (lines 8, 20, 224)

**Description:**  
All `target="_blank"` links — both in static HTML and dynamically generated by `tickerLink()` and `renderTheaterStrip()` — include `rel="noopener"`:

```html
<!-- index.html line 340 — correct -->
<a href="https://www.capitoltrades.com/" target="_blank" rel="noopener" class="source-link">Capitol Trades</a>

<!-- app.js line 8 — correct -->
return `<a href="https://perplexity.ai/finance/${ticker}" target="_blank" rel="noopener" class="ticker-link">${ticker}</a>`;
```

`rel="noopener"` prevents the opened page from accessing `window.opener`, eliminating reverse tabnapping. **This is a positive finding.** Note that modern browsers (Chrome 88+, Firefox 79+) implicitly add `noopener` to `target="_blank"` links regardless, so this is also forward-compatible.

**Minor note:** `rel="noreferrer"` would additionally suppress the `Referer` header to external sites. This is optional but worth considering for privacy:
```html
rel="noopener noreferrer"
```

---

### F-13 — INFO: No Mixed Content

**File:** `index.html`

**Description:**  
All external resources use HTTPS:
- `https://fonts.googleapis.com` — HTTPS ✓
- `https://fonts.gstatic.com` — HTTPS ✓  
- `https://cdn.jsdelivr.net` — HTTPS ✓

All dynamically generated links (`perplexity.ai/finance/...`) use HTTPS. No HTTP resources are referenced. **No mixed content issues.**

---

## Summary Table

| Finding | Severity | Exploitable Now | Exploitable If Data Goes Dynamic |
|---------|----------|----------------|----------------------------------|
| F-01: innerHTML + HTML data | MEDIUM | No | Yes — stored XSS |
| F-02: Regex-on-HTML linkify | MEDIUM | No | Yes — bypass risk |
| F-03: CSS class injection | LOW | No | Yes — attribute injection |
| F-04: pol.committee unescaped | LOW | No | Yes — HTML injection |
| F-05: No SRI on Chart.js | LOW | Yes (supply chain) | Yes |
| F-06: No SRI on Google Fonts | LOW | Yes (supply chain) | Yes |
| F-07: No CSP | LOW | No (defense depth) | Yes — reduces XSS severity |
| F-08: No X-Frame-Options | LOW | Yes (clickjack) | Yes |
| F-09: dataset.tab lookup | INFO | No | No |
| F-10: No tracking | INFO | N/A (positive) | N/A |
| F-11: No credentials | INFO | N/A (positive) | N/A |
| F-12: rel=noopener correct | INFO | N/A (positive) | N/A |
| F-13: No mixed content | INFO | N/A (positive) | N/A |

---

## Prioritized Remediation Recommendations

### Immediate (low effort, high impact)

1. **Add SRI to Chart.js** (F-05) — 5 minutes. Eliminates CDN supply chain risk for the one external script.
2. **Add CSP meta tag** (F-07) — 15 minutes. Adds defense-in-depth against future XSS introductions.

### Before any API/dynamic data integration

3. **Add `escapeHtml()` helper and apply it** to all text fields rendered via `innerHTML` (F-01, F-04).
4. **Add DOMPurify** for any field that intentionally contains markup (F-01).
5. **Add allowlist validation** for all class-interpolated fields: `direction`, `tagClass`, `cardClass`, `suspicionClass`, `conflictLevel` (F-03).
6. **Refactor `linkifyTickers()`** to operate on DOM Text nodes, not raw HTML strings (F-02).

### Optional hardening

7. **Self-host Google Fonts** to eliminate the Google Fonts external dependency (F-06).
8. **Add `rel="noreferrer"`** to all external links to suppress `Referer` headers (F-12, minor).
9. **Add server-side security headers** (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) if serving via a web server (F-08).

---

## Overall Risk Assessment

**Current Risk: LOW.**  
This is a well-structured static dashboard. The developer has made several good security choices: no external API calls, no user input rendered to DOM, no tracking, correct use of `rel="noopener"` on all external links, and version-pinned CDN dependencies. The `innerHTML` + embedded HTML pattern is a latent risk, not a present exploit.

**Residual Risk after adding SRI + CSP: VERY LOW** for the current deployment model.  
**Risk classification elevates to MEDIUM** immediately upon any integration of external data sources (APIs, user input, CMS feeds) without the escaping and sanitization improvements noted above.
