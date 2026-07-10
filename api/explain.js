// api/explain.js
// This runs on Vercel's server, NOT in the browser.
// The Gemini key stays here and is never sent to the client.

const MODEL = "gemini-2.5-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Missing 'text' in request body." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server misconfiguration." });
  }

  const prompt = `
Explain the following so a 15 year old can understand.

Return markdown.

Document:

${text}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Gemini API error" });
    }

    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return res.status(502).json({ error: "Gemini returned an empty response." });
    }

    return res.status(200).json({ text: output });
  } catch (err) {
    console.error("Server error calling Gemini:", err);
    return res.status(500).json({ error: "Failed to reach Gemini API." });
  }
}
