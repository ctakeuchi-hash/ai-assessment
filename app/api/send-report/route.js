import { Resend } from "resend";

function buildEmailHtml({ biz, results }) {
  const { company, industry, size, role, email } = biz;
  const { total, aiS, opsS, grS, aiM, opsM, grM, summary, blindSpots, quickWins, recommendations } = results;

  const matLabel = (score, max) => {
    const pct = score / max;
    if (pct < 0.4) return "Beginner";
    if (pct < 0.6) return "Developing";
    if (pct < 0.8) return "Growing";
    return "Advanced";
  };

  const overallLabel = matLabel(total, 36);

  const blindSpotsHtml = (blindSpots || []).map(b => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1c2030;vertical-align:top">
        <span style="font-size:1.2rem">${b.icon}</span>&nbsp;
        <strong style="color:#c0a0e8;font-size:13px">${b.title}</strong>
        <p style="color:#7a6888;font-size:12px;margin:4px 0 0">${b.desc}</p>
      </td>
    </tr>`).join("");

  const quickWinsHtml = (quickWins || []).map(q => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1c2030">
        <span style="font-family:monospace;font-size:10px;color:#38d4a0;text-transform:uppercase;letter-spacing:.08em">${q.badgeLabel}</span>
        <p style="color:#b8ccdc;font-size:13px;font-weight:600;margin:4px 0 2px">${q.title}</p>
        <p style="color:#58647a;font-size:12px;margin:0">${q.desc}</p>
        <p style="color:#444;font-size:11px;margin:4px 0 0;font-family:monospace">Effort: ${q.effort} &nbsp;·&nbsp; Impact: ${q.impact}</p>
      </td>
    </tr>`).join("");

  const recsHtml = (recommendations || []).map(r => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1c2030;border-left:2px solid ${r.cls==="r-gold"?"#e8a020":r.cls==="r-blue"?"#4a9eff":"#38d4a0"}">
        <span style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:${r.cls==="r-gold"?"#a07010":r.cls==="r-blue"?"#2870c0":"#20a070"}">${r.tag}</span>
        <p style="color:#b8ccdc;font-size:13px;font-weight:600;margin:4px 0 2px">${r.title}</p>
        <p style="color:#58647a;font-size:12px;margin:0">${r.body}</p>
      </td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#08090f;color:#ddd8cc;font-family:'Outfit',Arial,sans-serif;margin:0;padding:0">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#08090f">
  <tr><td align="center" style="padding:40px 16px">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

      <!-- Header -->
      <tr>
        <td style="padding-bottom:24px;border-bottom:1px solid #1c2030">
          <p style="font-family:monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#e8a020;margin:0 0 8px">Business Assessment</p>
          <h1 style="font-size:28px;color:#f0ead8;margin:0 0 8px;font-weight:600">${company || "Your Business"}</h1>
          <p style="font-size:12px;color:#58647a;margin:0;font-family:monospace">${industry} · ${size} · ${role}</p>
        </td>
      </tr>

      <!-- Overall Score -->
      <tr>
        <td style="padding:24px 0">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e1018;border:1px solid #1c2030">
            <tr>
              <td style="padding:24px 28px;vertical-align:middle;width:120px">
                <p style="font-size:56px;color:#e8a020;font-family:Georgia,serif;margin:0;line-height:1">${total}</p>
                <p style="font-size:10px;color:#2a3040;font-family:monospace;text-transform:uppercase;letter-spacing:.08em;margin:4px 0 0">out of 36</p>
                <span style="display:inline-block;font-family:monospace;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;margin-top:8px;background:#140e02;color:#e8a020;border:1px solid #3a2808">${overallLabel}</span>
              </td>
              <td style="padding:24px 28px;vertical-align:middle">
                <p style="font-size:13px;color:#6a8098;line-height:1.8;margin:0">${summary || ""}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Track Scores -->
      <tr>
        <td style="padding-bottom:24px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${[
                { name: "Readiness", s: aiS, m: aiM, color: "#e8a020" },
                { name: "Operations", s: opsS, m: opsM, color: "#4a9eff" },
                { name: "Growth & Sales", s: grS, m: grM, color: "#38d4a0" },
              ].map(t => `
              <td width="33%" style="padding:0 4px;vertical-align:top">
                <div style="background:#0e1018;border:1px solid #1c2030;border-top:2px solid ${t.color};padding:16px">
                  <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#58647a;margin:0 0 8px">${t.name}</p>
                  <p style="font-size:24px;color:${t.color};font-family:Georgia,serif;margin:0;line-height:1">${t.s}<span style="font-size:12px;color:#2a3040">/12</span></p>
                  <p style="font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:.06em;color:${t.color};opacity:.7;margin:4px 0 0">${t.m?.label || ""}</p>
                </div>
              </td>`).join("")}
            </tr>
          </table>
        </td>
      </tr>

      <!-- Blind Spots -->
      <tr>
        <td style="padding-bottom:24px">
          <p style="font-size:18px;color:#e0d8c8;font-family:Georgia,serif;margin:0 0 4px">Your Blind Spots</p>
          <p style="font-size:11px;font-family:monospace;color:#2a3040;text-transform:uppercase;letter-spacing:.08em;margin:0 0 12px">What you're not thinking about — but should be</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0814;border:1px solid #201030">
            ${blindSpotsHtml}
          </table>
        </td>
      </tr>

      <!-- Quick Wins -->
      <tr>
        <td style="padding-bottom:24px">
          <p style="font-size:18px;color:#e0d8c8;font-family:Georgia,serif;margin:0 0 4px">Quick Wins</p>
          <p style="font-size:11px;font-family:monospace;color:#2a3040;text-transform:uppercase;letter-spacing:.08em;margin:0 0 12px">High value · Matched to your situation</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e1018;border:1px solid #1c2030">
            ${quickWinsHtml}
          </table>
        </td>
      </tr>

      <!-- Recommendations -->
      <tr>
        <td style="padding-bottom:24px">
          <p style="font-size:18px;color:#e0d8c8;font-family:Georgia,serif;margin:0 0 4px">Personalized Recommendations</p>
          <p style="font-size:11px;font-family:monospace;color:#2a3040;text-transform:uppercase;letter-spacing:.08em;margin:0 0 12px">Based on your specific answers</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0e1018;border:1px solid #1c2030">
            ${recsHtml}
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:28px;background:linear-gradient(135deg,#0e0a04,#0a0e18);border:1px solid #302010;text-align:center;margin-bottom:24px">
          <p style="font-size:22px;color:#f0ead8;font-family:Georgia,serif;margin:0 0 8px">Let's build this together</p>
          <p style="font-size:13px;color:#58647a;line-height:1.7;margin:0 0 20px">Book a free 20-minute strategy call to review your top recommendations and identify the one change that will have the biggest impact this month.</p>
          <a href="https://calendly.com" style="display:inline-block;background:#e8a020;color:#08090f;font-weight:600;font-size:14px;padding:12px 28px;text-decoration:none">Book Free Strategy Call →</a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:20px 0;border-top:1px solid #1c2030;margin-top:24px">
          <p style="font-family:monospace;font-size:10px;color:#2a3040;text-transform:uppercase;letter-spacing:.08em;margin:0">Business Operations Report · Confidential · ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

async function saveToAirtable({ email, biz, results }) {
  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  if (!pat || !baseId || !tableId) return;

  await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${pat}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        "Email": email,
        "Company Name": biz.company || "",
        "Industry": biz.industry || "",
        "Company Size": biz.size || "",
        "Role": biz.role || "",
        "AI Readiness Score": results.aiS ?? 0,
        "Operations Score": results.opsS ?? 0,
        "Growth Score": results.grS ?? 0,
        "Overall Score": results.total ?? 0,
        "Assessment Report": results.summary || "",
        "Submitted At": new Date().toISOString()
      },
      typecast: true
    })
  }).catch(e => console.error("Airtable save error:", e));
}

export async function POST(req) {
  const { email, biz, results } = await req.json();

  if (!email || !results) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Email not configured" }, { status: 500 });
  }
  const resend = new Resend(apiKey);

  const html = buildEmailHtml({ biz, results });

  const fromDomain = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "Business Assessment";

  try {
    const emailRes = await resend.emails.send({
      from: `${fromName} <${fromDomain}>`,
      to: [email],
      subject: `Your Business Operations Report — ${biz.company || "Assessment Complete"}`,
      html,
    });

    if (emailRes.error) {
      console.error("Resend error:", emailRes.error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    // save lead to Airtable (non-blocking)
    saveToAirtable({ email, biz, results });

    return Response.json({ success: true });
  } catch (e) {
    console.error("Send report error:", e);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
