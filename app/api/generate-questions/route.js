export async function POST(req) {
  const { industry } = await req.json();
  if (!industry) return Response.json({ error: "industry required" }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Missing API key" }, { status: 500 });
  }

  const prompt = `You are building a business operations assessment for a "${industry}" business.

Write exactly 5 multiple-choice questions that reveal how mature and automated this type of business is.
Each question must have exactly 4 answer options that progress from most manual/basic (option 0) to most automated/sophisticated (option 3).

Questions should cover the highest-friction operational areas specific to ${industry} businesses — the things they typically do manually that could be automated.

Respond ONLY with a valid JSON array, no other text:
[
  {"text": "question text", "opts": ["most manual answer", "basic/some effort", "more systematized", "most automated/advanced"]},
  {"text": "...", "opts": ["...", "...", "...", "..."]},
  {"text": "...", "opts": ["...", "...", "...", "..."]},
  {"text": "...", "opts": ["...", "...", "...", "..."]},
  {"text": "...", "opts": ["...", "...", "...", "..."]}
]`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim() || "";
    const json = JSON.parse(raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, ""));

    if (!Array.isArray(json) || json.length !== 5) throw new Error("unexpected shape");

    return Response.json({ questions: json });
  } catch (e) {
    console.error("generate-questions error:", e);
    return Response.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
