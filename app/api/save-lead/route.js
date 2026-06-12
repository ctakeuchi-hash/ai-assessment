export async function POST(req) {
  const { email, company, industry, size, role, scores, report, freeform, generatedQuestions } = await req.json()

  const pat = process.env.AIRTABLE_PAT
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID

  if (!pat || !baseId || !tableId) {
    return Response.json({ error: "Airtable not configured" }, { status: 500 })
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pat}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Email": email,
          "Company Name": company || "",
          "Industry": industry || "",
          "Company Size": size || "",
          "Role": role || "",
          "AI Readiness Score": scores?.ai ?? 0,
          "Operations Score": scores?.ops ?? 0,
          "Growth Score": scores?.growth ?? 0,
          "Overall Score": scores?.overall ?? 0,
          "Assessment Report": report || "",
          "Pain Point": freeform?.painPoint || "",
          "Growth Blocker": freeform?.growthBlocker || "",
          "Top Priority": freeform?.priority || "",
          "Custom Questions": generatedQuestions ? JSON.stringify(generatedQuestions) : "",
          "Submitted At": new Date().toISOString()
        },
        typecast: true
      })
    })

    if (!res.ok) {
      const err = await res.json()
      console.error("Airtable error:", err)
      return Response.json({ error: "Failed to save" }, { status: 500 })
    }

    const data = await res.json()
    return Response.json({ success: true, id: data.id })
  } catch (e) {
    console.error("Save lead error:", e)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}
