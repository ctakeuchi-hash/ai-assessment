export async function POST(req) {
  const body = await req.json()
  const { error, context, email, company, industry } = body

  console.error("[ERROR LOG]", JSON.stringify({ error, context, email, company, industry, ts: new Date().toISOString() }))

  const pat = process.env.AIRTABLE_PAT
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_ERRORS_TABLE_ID

  if (!pat || !baseId || !tableId) {
    return Response.json({ ok: true, note: "Airtable errors table not configured — logged to console only" })
  }

  try {
    await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${pat}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          "Error": String(error || "Unknown error"),
          "Context": String(context || ""),
          "Email": email || "",
          "Company": company || "",
          "Industry": industry || "",
          "Timestamp": new Date().toISOString()
        },
        typecast: true
      })
    })
  } catch (e) {
    console.error("[ERROR LOG] Airtable write failed:", e.message)
  }

  return Response.json({ ok: true })
}
