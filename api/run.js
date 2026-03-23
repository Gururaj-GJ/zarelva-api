export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Missing input" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are a fraud risk analyst.

Analyze this scenario and return:
- Risk score (0–100)
- Risk level (LOW/MEDIUM/HIGH)
- Estimated exposure
- Key issues

Scenario:
${input}`
      })
    });

    const data = await response.json();

    // 🔥 SAFETY CHECK (important)
    if (!data.output || !data.output[0]) {
      return res.status(500).json({
        error: "Invalid OpenAI response",
        raw: data
      });
    }

    const resultText = data.output[0].content[0].text;

    return res.status(200).json({
      result: resultText
    });

  } catch (error) {
    return res.status(500).json({
      error: "API error",
      details: error.message
    });
  }
}
