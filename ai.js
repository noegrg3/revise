// Vercel Serverless Function : /api/ai  (variable d'environnement : ANTHROPIC_API_KEY)
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { prompt } = req.body || {};
  if (!prompt || prompt.length > 4000) return res.status(400).json({ error: "bad request" });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  res.status(r.ok ? 200 : 500).json({ text: (d.content || []).map(c => c.text || "").join("") });
}
