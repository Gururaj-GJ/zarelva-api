export default async function handler(req, res) {

  // ✅ ADD THIS (CORS FIX)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are a fraud risk analyst. Analyze this scenario and return risk insights:\n\n${input}`
      })
    });

    const data = await response.json();

    return res.status(200).json({
      result: data.output?.[0]?.content?.[0]?.text || "No response"
    });

  } catch (error) {
    return res.status(500).json({
      error: "API error",
      details: error.message
    });
  }
}
