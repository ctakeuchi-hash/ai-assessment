export async function POST(req) {
  const { email, company, industry, size, role, scores, report, fullReport, freeform, generatedQuestions } = await req.json()

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
          "Full Report JSON": fullReport || "",
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

    // Fire admin notification — non-blocking, failure is silent
    sendAdminNotification({ email, company, industry, size, role, scores, report }).catch(() => {})

    return Response.json({ success: true, id: data.id })
  } catch (e) {
    console.error("Save lead error:", e)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}

async function sendAdminNotification({ email, company, industry, size, role, scores, report }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const from = process.env.FROM_EMAIL || "onboarding@resend.dev"
  const overall = scores?.overall ?? 0
  const ai = scores?.ai ?? 0
  const ops = scores?.ops ?? 0
  const growth = scores?.growth ?? 0
  const pct = Math.round((overall / 36) * 100)
  const maturity = pct < 33 ? "Beginner" : pct < 56 ? "Developing" : pct < 78 ? "Growing" : "Advanced"

  const summarySnippet = report ? report.slice(0, 400).replace(/</g, '&lt;').replace(/>/g, '&gt;') + (report.length > 400 ? '…' : '') : '(no report)'

  const html = `<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;background:#f5f5f5;margin:0;padding:20px">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-left:4px solid #e8a020;padding:24px 28px;max-width:560px">
<tr><td>
  <div style="font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#e8a020;margin-bottom:8px">NEW ASSESSMENT COMPLETED</div>
  <div style="font-size:22px;font-weight:600;color:#1a1208;margin-bottom:4px">${company || '(no company)'}</div>
  <div style="font-size:13px;color:#888;margin-bottom:20px">${email} &nbsp;·&nbsp; ${industry} &nbsp;·&nbsp; ${size} &nbsp;·&nbsp; ${role}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;padding-top:16px;margin-bottom:16px">
    <tr>
      <td align="center" style="padding:12px 0"><div style="font-size:36px;font-weight:700;color:#e8a020">${overall}</div><div style="font-size:10px;font-family:monospace;color:#999;text-transform:uppercase;letter-spacing:1px">/ 36 Overall</div><div style="font-size:11px;font-family:monospace;color:#e8a020;margin-top:4px">${maturity}</div></td>
      <td align="center" style="padding:12px 0;border-left:1px solid #eee"><div style="font-size:28px;font-weight:600;color:#e8a020">${ai}</div><div style="font-size:10px;font-family:monospace;color:#999;text-transform:uppercase;letter-spacing:1px">/ 12 AI</div></td>
      <td align="center" style="padding:12px 0;border-left:1px solid #eee"><div style="font-size:28px;font-weight:600;color:#4a9eff">${ops}</div><div style="font-size:10px;font-family:monospace;color:#999;text-transform:uppercase;letter-spacing:1px">/ 12 Ops</div></td>
      <td align="center" style="padding:12px 0;border-left:1px solid #eee"><div style="font-size:28px;font-weight:600;color:#38d4a0">${growth}</div><div style="font-size:10px;font-family:monospace;color:#999;text-transform:uppercase;letter-spacing:1px">/ 12 Growth</div></td>
    </tr>
  </table>
  <div style="font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:6px">Report Preview</div>
  <div style="font-size:12px;color:#555;line-height:1.7;background:#f8f6f0;padding:12px 14px;border-left:3px solid #e0d8cc">${summarySnippet}</div>
  <div style="margin-top:20px;text-align:center">
    <a href="https://dragonscale.consulting" style="display:inline-block;background:#1a1208;color:#e8a020;font-family:monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 20px;text-decoration:none">View Dashboard →</a>
  </div>
</td></tr>
</table>
</body></html>`

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Assessment Bot <${from}>`,
      to: ["ctakeuchi@gmail.com"],
      subject: `New Assessment: ${company || email} — ${maturity} (${overall}/36)`,
      html
    })
  })
}
