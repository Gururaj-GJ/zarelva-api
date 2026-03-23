export default async function handler(req, res) {

  // ✅ CORS (important for browser tools like Hoppscotch)
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

Analyze the scenario and return:
- Risk level (Low / Medium / High)
- Reason
- Recommendation

Scenario:
${input}`
      })
    });

    const data = await response.json();

    // 🔍 Debug log (check in Vercel logs if needed)
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    return res.status(200).json({
      result: data.output_text || "No response"
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      error: "API error",
      details: error.message
    });
  }
}
