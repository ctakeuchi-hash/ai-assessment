function maturityLabel(s, max) {
  const p = s / max;
  if (p < .33) return "Beginner";
  if (p < .56) return "Developing";
  if (p < .78) return "Growing";
  return "Advanced";
}

function maturityColor(label) {
  return { Beginner: '#b07010', Developing: '#2870c0', Growing: '#20a070', Advanced: '#508020' }[label] || '#b07010';
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function boldToHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function buildEmailHtml({ company, industry, size, role, results }) {
  const { total, aiS, opsS, grS, aiM, opsM, grM, summary, blindSpots, quickWins, recommendations } = results || {};

  const overallMat = maturityLabel(total, 36);
  const overallColor = maturityColor(overallMat);
  const aiLabel = aiM?.label || maturityLabel(aiS, 12);
  const opsLabel = opsM?.label || maturityLabel(opsS, 12);
  const grLabel = grM?.label || maturityLabel(grS, 12);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const blindHtml = (blindSpots || []).slice(0, 3).map(b => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:10px">
      <tr><td style="padding:12px 14px 12px 16px;background:#faf7ff;border-left:3px solid #8040d0">
        <div style="font-size:18px;line-height:1;margin-bottom:6px">${esc(b.icon)}</div>
        <div style="font-size:13px;font-weight:600;color:#1a0828;margin-bottom:4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">${esc(b.title)}</div>
        <div style="font-size:12px;color:#5a4868;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">${esc(b.desc)}</div>
      </td></tr>
    </table>`).join('');

  const effortColor = { Low: '#20a070', Medium: '#b07010', High: '#c04040' };

  const winsHtml = (quickWins || []).slice(0, 3).map(w => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:10px">
      <tr><td style="padding:14px 16px;background:#f8f6f0;border:1px solid #e0d8cc">
        <div style="font-size:9px;font-family:monospace,monospace;text-transform:uppercase;letter-spacing:1px;padding:2px 7px;background:#f0ece0;color:#806010;border:1px solid #d0c080;display:inline-block;margin-bottom:7px">${esc(w.badgeLabel)}</div>
        <div style="font-size:13px;font-weight:600;color:#1a1208;margin-bottom:4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">${esc(w.title)}</div>
        <div style="font-size:12px;color:#555;line-height:1.65;margin-bottom:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">${esc(w.desc)}</div>
        <div style="font-size:11px;color:#888;font-family:monospace,monospace">Effort: <span style="color:${effortColor[w.effort] || '#888'};font-weight:600">${esc(w.effort)}</span>&nbsp;&nbsp;·&nbsp;&nbsp;Impact: <span style="color:#20a070;font-weight:600">${esc(w.impact)}</span></div>
      </td></tr>
    </table>`).join('');

  const recBorder = { 'r-gold': '#c07010', 'r-blue': '#2870c0', 'r-teal': '#20a070' };

  const recsHtml = (recommendations || []).slice(0, 4).map(r => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:10px">
      <tr><td style="padding:12px 16px;background:#f8f6f0;border-left:3px solid ${recBorder[r.cls] || '#ccc'}">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:6px">
          <tr>
            <td style="font-size:13px;font-weight:600;color:#1a1208;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">${esc(r.title)}</td>
            <td width="70" align="right" style="vertical-align:top">
              <span style="font-size:9px;font-family:monospace,monospace;text-transform:uppercase;letter-spacing:1px;padding:2px 6px;background:#eee;color:#666">${esc(r.tag)}</span>
            </td>
          </tr>
        </table>
        <div style="font-size:12px;color:#555;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif">${boldToHtml(r.body)}</div>
      </td></tr>
    </table>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Business Assessment Report</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ede6;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#f0ede6">
<tr><td align="center" style="padding:24px 12px 40px">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:600px;width:100%">

  <!-- Header -->
  <tr><td style="background:#1a1208;padding:24px 32px 20px">
    <div style="font-family:monospace,monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#e8a020;margin-bottom:5px">BUSINESS ASSESSMENT REPORT</div>
    <div style="font-family:monospace,monospace;font-size:10px;color:#4a5668;letter-spacing:1px">Personalized Operations Analysis</div>
  </td></tr>

  <!-- Company name + overall score -->
  <tr><td style="background:#ffffff;padding:28px 32px 24px;border-left:3px solid #e8a020">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#e8a020;margin-bottom:8px">Operations Report · ${esc(dateStr)}</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#1a1208;margin:0 0 4px;font-weight:normal;line-height:1.2">${esc(company) || 'Your Business'}</div>
    <div style="font-family:monospace,monospace;font-size:11px;color:#888;margin-bottom:24px;letter-spacing:.5px">${esc(industry)} &nbsp;·&nbsp; ${esc(size)} &nbsp;·&nbsp; ${esc(role)}</div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
      <tr>
        <td width="110" valign="top" style="padding-right:22px">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:68px;color:#e8a020;line-height:1;margin-bottom:3px">${total}</div>
          <div style="font-family:monospace,monospace;font-size:9px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">out of 36</div>
          <div style="display:inline-block;font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:3px 8px;color:${overallColor};border:1px solid ${overallColor}">${esc(overallMat)}</div>
        </td>
        <td valign="middle">
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#444;line-height:1.8">${esc(summary)}</div>
        </td>
      </tr>
    </table>

    <!-- Track scores -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:1px solid #eee;margin-top:22px">
      <tr>
        <td width="33%" align="center" style="padding:14px 8px 0 0">
          <div style="font-family:Georgia,serif;font-size:30px;color:#e8a020;line-height:1">${aiS}<span style="font-size:14px;color:#bbb">/12</span></div>
          <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#666;margin-top:5px">Readiness</div>
          <div style="font-family:monospace,monospace;font-size:9px;color:${maturityColor(aiLabel)};margin-top:3px">${esc(aiLabel)}</div>
        </td>
        <td width="34%" align="center" style="padding:14px 8px 0;border-left:1px solid #eee;border-right:1px solid #eee">
          <div style="font-family:Georgia,serif;font-size:30px;color:#4a9eff;line-height:1">${opsS}<span style="font-size:14px;color:#bbb">/12</span></div>
          <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#666;margin-top:5px">Operations</div>
          <div style="font-family:monospace,monospace;font-size:9px;color:${maturityColor(opsLabel)};margin-top:3px">${esc(opsLabel)}</div>
        </td>
        <td width="33%" align="center" style="padding:14px 0 0 8px">
          <div style="font-family:Georgia,serif;font-size:30px;color:#38d4a0;line-height:1">${grS}<span style="font-size:14px;color:#bbb">/12</span></div>
          <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#666;margin-top:5px">Growth</div>
          <div style="font-family:monospace,monospace;font-size:9px;color:${maturityColor(grLabel)};margin-top:3px">${esc(grLabel)}</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Blind Spots -->
  <tr><td style="background:#f8f5fe;padding:24px 32px;border-top:1px solid #e4dff0">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#8040d0;margin-bottom:4px">BLIND SPOTS</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1a1208;margin-bottom:16px;font-weight:normal">What you're not thinking about — but should be</div>
    ${blindHtml}
  </td></tr>

  <!-- Quick Wins -->
  <tr><td style="background:#ffffff;padding:24px 32px;border-top:1px solid #e8e4dc">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#20a070;margin-bottom:4px">QUICK WINS</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1a1208;margin-bottom:16px;font-weight:normal">High-value actions matched to your situation</div>
    ${winsHtml}
  </td></tr>

  <!-- Recommendations -->
  <tr><td style="background:#f8f6f2;padding:24px 32px;border-top:1px solid #e8e4dc">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#e8a020;margin-bottom:4px">RECOMMENDATIONS</div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1a1208;margin-bottom:16px;font-weight:normal">Based on your specific answers</div>
    ${recsHtml}
  </td></tr>

  <!-- CTA -->
  <tr><td style="background:#1a1208;padding:32px;text-align:center">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#f0ead8;margin-bottom:8px;font-weight:normal">Let's build this together</div>
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#7a8898;line-height:1.75;margin-bottom:22px;max-width:420px;margin-left:auto;margin-right:auto">Book a free 20-minute strategy call to review your top recommendations and identify the one change that will have the biggest impact on your business this month.</div>
    <a href="https://hashdigital.io/book" style="display:inline-block;background:#e8a020;color:#08090f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;font-size:13px;font-weight:700;padding:13px 26px;text-decoration:none;letter-spacing:.5px">Book Free Strategy Call →</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#110e06;padding:14px 32px">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
      <tr>
        <td style="font-family:monospace,monospace;font-size:9px;color:#2e3540;text-transform:uppercase;letter-spacing:1px">Business Operations Report · Confidential</td>
        <td align="right" style="font-family:monospace,monospace;font-size:9px;color:#2e3540;text-transform:uppercase;letter-spacing:1px">${esc(company) || 'Your Business'} · ${esc(new Date().toLocaleDateString())}</td>
      </tr>
    </table>
  </td></tr>

</table>

</td></tr>
</table>
</body>
</html>`;
}

export async function POST(req) {
  const { to, company, industry, size, role, results } = await req.json()

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured — skipping email")
    return Response.json({ skipped: true })
  }

  const from = process.env.FROM_EMAIL || "onboarding@resend.dev"
  const html = buildEmailHtml({ company, industry, size, role, results })

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `Business Assessment <${from}>`,
        to: [to],
        subject: `Your Business Assessment Report — ${company || industry || 'Your Business'}`,
        html
      })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("Resend error:", err)
      return Response.json({ error: "Failed to send email" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error("Send email error:", e)
    return Response.json({ error: "Internal error" }, { status: 500 })
  }
}
