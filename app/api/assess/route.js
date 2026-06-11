export async function POST(req) {
  const { prompt } = await req.json()

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Missing API key" }, { status: 500 })
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    })
  })

  const data = await res.json()

  if (!res.ok || data.type === "error") {
    console.error("Anthropic API error:", JSON.stringify(data))
    return Response.json({ error: data.error?.message || "Anthropic API error", detail: data }, { status: res.status })
  }

  return Response.json(data)
}
