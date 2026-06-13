export const dynamic = 'force-dynamic'

export async function GET() {
  const pat = process.env.AIRTABLE_PAT
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID

  if (!pat || !baseId || !tableId) {
    return Response.json({ leads: [], unconfigured: true })
  }

  try {
    // Airtable REST API v0 rejects sort by singleLineText field name;
    // fetch without a sort param and sort by createdTime client-side
    const fieldList = ["Email","Company Name","Industry","Company Size","Role",
      "AI Readiness Score","Operations Score","Growth Score","Overall Score",
      "Assessment Report","Submitted At"]
    const qs = [
      "pageSize=100",
      ...fieldList.map(f => `fields[]=${encodeURIComponent(f)}`)
    ].join("&")

    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}?${qs}`,
      { headers: { Authorization: `Bearer ${pat}` } }
    )

    if (!res.ok) {
      const err = await res.json()
      console.error("Airtable fetch error:", err)
      return Response.json({ error: "Failed to fetch leads" }, { status: 500 })
    }

    const data = await res.json()
    const leads = (data.records || [])
      .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
      .map(r => ({
      id: r.id,
      company: r.fields["Company Name"] || "",
      email: r.fields["Email"] || "",
      industry: r.fields["Industry"] || "",
      size: r.fields["Company Size"] || "",
      role: r.fields["Role"] || "",
      aiScore: r.fields["AI Readiness Score"] ?? null,
      opsScore: r.fields["Operations Score"] ?? null,
      growthScore: r.fields["Growth Score"] ?? null,
      overallScore: r.fields["Overall Score"] ?? null,
      summary: r.fields["Assessment Report"] || "",
      submittedAt: r.fields["Submitted At"] || ""
    }))

    return Response.json({ leads })
  } catch (e) {
    console.error("Leads fetch error:", e)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}
