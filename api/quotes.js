// Vercel Serverless Function: /api/quotes
// Calls Perplexity Sonar API with structured output to fetch real-time stock prices
// API key is stored as PPLX_API_KEY environment variable in Vercel

const TICKERS = [
  "LMT","RTX","NOC","KTOS","RKLB","BWXT","HII","CW","GD","LHX",
  "PLTR","AVAV","BAESY","MRCY","BA","LDOS","FTNT","CRWD","JOBY",
  "ACHR","PANW","SAIC","BAH","AXON"
];

const SCHEMA = {
  type: "object",
  properties: {
    quotes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ticker: { type: "string" },
          price: { type: "number" },
          changePercent: { type: "number" }
        },
        required: ["ticker", "price", "changePercent"]
      }
    },
    timestamp: { type: "string" }
  },
  required: ["quotes", "timestamp"]
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = process.env.PPLX_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "PPLX_API_KEY not configured" });
  }

  try {
    const tickerList = TICKERS.join(", ");
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are a financial data assistant. Return ONLY the requested JSON with current stock prices. Use the most recent real-time market data available. Be precise with numbers — do not round or estimate."
          },
          {
            role: "user",
            content: `Get the current stock price and today's percentage change for each of these tickers: ${tickerList}. Return the data as JSON with a quotes array and a timestamp string (ISO 8601 UTC).`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: SCHEMA
          }
        },
        max_tokens: 2000,
        temperature: 0.0
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Sonar API error:", response.status, errText);
      return res.status(502).json({ error: "Sonar API error", status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "No content in Sonar response" });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from markdown code blocks if Sonar wraps it
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1].trim());
      } else {
        console.error("Failed to parse Sonar response:", content.substring(0, 500));
        return res.status(502).json({ error: "Invalid JSON from Sonar" });
      }
    }

    // Normalize: ensure quotes is an array
    const quotes = parsed.quotes || parsed;
    const timestamp = parsed.timestamp || new Date().toISOString();

    // Cache for 5 minutes to reduce API calls
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    return res.status(200).json({ quotes, timestamp, source: "perplexity-sonar" });

  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
