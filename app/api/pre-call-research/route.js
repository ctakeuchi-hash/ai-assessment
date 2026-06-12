function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function fetchReviews(company) {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) return null;
  try {
    const q = encodeURIComponent(`"${company}" reviews`);
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${q}&count=5`, {
      headers: { Accept: 'application/json', 'X-Subscription-Token': apiKey }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.web?.results || []).slice(0, 5).map(r => ({ title: r.title, snippet: r.description, url: r.url }));
  } catch (e) {
    return null;
  }
}

async function generateResearch({ company, industry, size, role, scores, maturity, answers, freeform, reviews }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  const qaLines = [];
  if (answers) {
    ['ai', 'ops', 'growth', 'deep'].forEach(track => {
      (answers[track] || []).forEach(({ q, a }) => qaLines.push(`Q: ${q}\nA: ${a}`));
    });
  }

  const freeformLines = [];
  if (freeform?.painPoint) freeformLines.push(`Pain point: "${freeform.painPoint}"`);
  if (freeform?.growthBlocker) freeformLines.push(`Growth blocker: "${freeform.growthBlocker}"`);
  if (freeform?.priority) freeformLines.push(`Top priority: "${freeform.priority}"`);

  const reviewsText = reviews?.length
    ? `CUSTOMER REVIEW SNIPPETS:\n${reviews.map(r => `- "${r.snippet}" (${r.url})`).join('\n')}\n\n`
    : '';

  const prompt = `You are a pre-call research assistant for Hash Digital, an intelligent automation consultancy. Generate a research brief for an upcoming sales call.

PROSPECT:
Company: ${company}
Industry: ${industry}
Size: ${size}
Contact Role: ${role}

ASSESSMENT SCORES:
- AI Readiness: ${scores.ai}/12 (${maturity.ai})
- Operations: ${scores.ops}/12 (${maturity.ops})
- Growth & Sales: ${scores.growth}/12 (${maturity.growth})
- Overall: ${scores.overall}/36

${qaLines.length ? `SURVEY Q&A:\n${qaLines.join('\n\n')}\n\n` : ''}${freeformLines.length ? `IN THEIR OWN WORDS:\n${freeformLines.join('\n')}\n\n` : ''}${reviewsText}Generate a JSON object with these exact fields. Be specific to their industry and size — not generic:
{
  "companyProfile": "2-3 sentences on what a ${size} company in ${industry} typically looks like operationally — structure, how they run, common pain points",
  "competitors": [
    { "name": "Name of a real competitor or comparable service", "notes": "What they offer and why they're relevant context" }
  ],
  "industryTrends": [
    { "trend": "Specific current trend in ${industry}", "relevance": "Why it matters to this prospect right now" }
  ],
  "automationOpportunities": [
    { "area": "Specific process or function", "description": "Concrete automation opportunity based on their scores and industry" }
  ],
  "reviewSummary": ${reviews ? '"Brief summary of customer sentiment from the review snippets"' : 'null'},
  "surveyInsights": "2-3 sentences summarizing what their scores and answers reveal about their biggest pain points and readiness",
  "conversationStarters": [
    "Specific discovery question tailored to their profile and scores",
    "Another specific question",
    "A third question"
  ],
  "watchFor": [
    "Most likely objection or friction point based on their industry/size/role",
    "Another potential concern"
  ]
}

Return ONLY valid JSON. No markdown fences. No commentary.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
  });

  const data = await res.json();
  if (!res.ok || data.type === 'error') throw new Error(data.error?.message || 'Anthropic API error');
  const txt = data.content?.find(b => b.type === 'text')?.text || '';
  return JSON.parse(txt.replace(/```json|```/g, '').trim());
}

function buildResearchEmail({ company, industry, size, role, scores, research, freeform, airtableRecordId }) {
  const baseId = process.env.AIRTABLE_BASE_ID || '';
  const tableId = process.env.AIRTABLE_TABLE_ID || '';
  const airtableUrl = airtableRecordId
    ? `https://airtable.com/${baseId}/${tableId}/${airtableRecordId}`
    : `https://airtable.com/${baseId}/${tableId}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const itemCard = (borderColor, name, notes) => `
    <div style="padding:10px 14px;background:#0e1018;border-left:2px solid ${borderColor};margin-bottom:8px">
      <div style="font-family:monospace,monospace;font-size:11px;font-weight:600;color:#f0ead8;margin-bottom:3px">${esc(name)}</div>
      <div style="font-family:-apple-system,sans-serif;font-size:12px;color:#6a8098;line-height:1.5">${esc(notes)}</div>
    </div>`;

  const competitorsHtml = (research.competitors || []).map(c => itemCard('#4a9eff', c.name, c.notes)).join('');
  const trendsHtml = (research.industryTrends || []).map(t => itemCard('#38d4a0', t.trend, t.relevance)).join('');
  const oppsHtml = (research.automationOpportunities || []).map(o => itemCard('#e8a020', o.area, o.description)).join('');

  const startersHtml = (research.conversationStarters || []).map((s, i) => `
    <div style="padding:8px 14px;background:#0e1018;border-left:2px solid #a060f0;margin-bottom:8px">
      <span style="font-family:monospace,monospace;font-size:10px;color:#a060f0;margin-right:8px">${i + 1}.</span>
      <span style="font-family:-apple-system,sans-serif;font-size:12px;color:#d0c8bc;line-height:1.5">${esc(s)}</span>
    </div>`).join('');

  const watchHtml = (research.watchFor || []).map(w => `
    <div style="padding:8px 14px;background:#0e1018;border-left:2px solid #e85858;margin-bottom:8px">
      <span style="font-family:-apple-system,sans-serif;font-size:12px;color:#c0a8a8;line-height:1.5">${esc(w)}</span>
    </div>`).join('');

  const freeformHtml = (freeform?.painPoint || freeform?.growthBlocker || freeform?.priority) ? `
  <tr><td style="background:#120e02;padding:20px 28px;border-top:1px solid #2a2010">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#e8a020;margin-bottom:14px">IN THEIR OWN WORDS</div>
    ${freeform?.painPoint ? `<div style="margin-bottom:10px"><div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#8a7040;margin-bottom:4px">Biggest pain point</div><div style="font-family:-apple-system,sans-serif;font-size:13px;color:#c8b880;font-style:italic;line-height:1.6">"${esc(freeform.painPoint)}"</div></div>` : ''}
    ${freeform?.growthBlocker ? `<div style="margin-bottom:10px"><div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#8a7040;margin-bottom:4px">Holding back growth</div><div style="font-family:-apple-system,sans-serif;font-size:13px;color:#c8b880;font-style:italic;line-height:1.6">"${esc(freeform.growthBlocker)}"</div></div>` : ''}
    ${freeform?.priority ? `<div><div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#8a7040;margin-bottom:4px">Top priority this month</div><div style="font-family:-apple-system,sans-serif;font-size:13px;color:#c8b880;font-style:italic;line-height:1.6">"${esc(freeform.priority)}"</div></div>` : ''}
  </td></tr>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pre-Call Research: ${esc(company)}</title>
</head>
<body style="margin:0;padding:0;background-color:#08090f">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#08090f">
<tr><td align="center" style="padding:20px 12px 40px">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:600px;width:100%">

  <tr><td style="background:#0e1018;padding:20px 28px 18px;border-bottom:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#e8a020;margin-bottom:4px">PRE-CALL RESEARCH BRIEF</div>
    <div style="font-family:monospace,monospace;font-size:10px;color:#3a4658;letter-spacing:1px">Hash Digital · Internal · ${esc(dateStr)}</div>
  </td></tr>

  <tr><td style="background:#0e1018;padding:20px 28px 22px;border-bottom:1px solid #1c2030">
    <div style="font-family:Georgia,serif;font-size:22px;color:#f0ead8;margin-bottom:4px">${esc(company)}</div>
    <div style="font-family:monospace,monospace;font-size:10px;color:#58647a;margin-bottom:18px">${esc(industry)} · ${esc(size)} · ${esc(role)}</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:1px solid #1c2030">
      <tr>
        <td width="33%" align="center" style="padding:14px 8px">
          <div style="font-family:Georgia,serif;font-size:26px;color:#e8a020;line-height:1">${scores.ai}<span style="font-size:13px;color:#3a4658">/12</span></div>
          <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#58647a;margin-top:4px">AI Readiness</div>
        </td>
        <td width="33%" align="center" style="padding:14px 8px;border-left:1px solid #1c2030;border-right:1px solid #1c2030">
          <div style="font-family:Georgia,serif;font-size:26px;color:#4a9eff;line-height:1">${scores.ops}<span style="font-size:13px;color:#3a4658">/12</span></div>
          <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#58647a;margin-top:4px">Operations</div>
        </td>
        <td width="34%" align="center" style="padding:14px 8px">
          <div style="font-family:Georgia,serif;font-size:26px;color:#38d4a0;line-height:1">${scores.growth}<span style="font-size:13px;color:#3a4658">/12</span></div>
          <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#58647a;margin-top:4px">Growth</div>
        </td>
      </tr>
    </table>
    <div style="margin-top:18px;text-align:center">
      <a href="${esc(airtableUrl)}" style="display:inline-block;background:#e8a020;color:#08090f;font-family:-apple-system,sans-serif;font-size:12px;font-weight:700;padding:10px 22px;text-decoration:none;letter-spacing:.5px">View Record in Airtable →</a>
    </div>
  </td></tr>

  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#e8a020;margin-bottom:10px">COMPANY PROFILE</div>
    <div style="font-family:-apple-system,sans-serif;font-size:13px;color:#a0b0c0;line-height:1.7">${esc(research.companyProfile)}</div>
  </td></tr>

  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a060f0;margin-bottom:10px">SURVEY INSIGHTS</div>
    <div style="font-family:-apple-system,sans-serif;font-size:13px;color:#a0b0c0;line-height:1.7">${esc(research.surveyInsights)}</div>
  </td></tr>

  ${freeformHtml}

  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#4a9eff;margin-bottom:12px">COMPETITOR LANDSCAPE</div>
    ${competitorsHtml}
  </td></tr>

  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#38d4a0;margin-bottom:12px">INDUSTRY TRENDS</div>
    ${trendsHtml}
  </td></tr>

  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#e8a020;margin-bottom:12px">AUTOMATION OPPORTUNITIES</div>
    ${oppsHtml}
  </td></tr>

  ${research.reviewSummary ? `
  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#58647a;margin-bottom:10px">CUSTOMER REVIEW SENTIMENT</div>
    <div style="font-family:-apple-system,sans-serif;font-size:13px;color:#a0b0c0;line-height:1.7">${esc(research.reviewSummary)}</div>
  </td></tr>` : ''}

  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#a060f0;margin-bottom:12px">CONVERSATION STARTERS</div>
    ${startersHtml}
  </td></tr>

  <tr><td style="background:#0e1018;padding:20px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#e85858;margin-bottom:12px">WATCH FOR</div>
    ${watchHtml}
  </td></tr>

  <tr><td style="background:#08090f;padding:14px 28px;border-top:1px solid #1c2030">
    <div style="font-family:monospace,monospace;font-size:9px;color:#2a3040;text-transform:uppercase;letter-spacing:1px;text-align:center">Hash Digital · Pre-Call Research · Internal Use Only</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function POST(req) {
  const { email, company, industry, size, role, scores, maturity, answers, freeform, airtableRecordId } = await req.json();

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn('RESEND_API_KEY not configured — skipping pre-call research email');
    return Response.json({ skipped: true });
  }

  try {
    const reviews = await fetchReviews(company);
    const research = await generateResearch({ company, industry, size, role, scores, maturity, answers, freeform, reviews });
    const html = buildResearchEmail({ company, industry, size, role, scores, research, freeform, airtableRecordId });

    const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const to = process.env.INTERNAL_NOTIFY_EMAIL || 'ctakeuchi@gmail.com';

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Hash Digital <${from}>`,
        to: [to],
        subject: `Pre-Call Research: ${company} (${industry})`,
        html
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.json().catch(() => ({}));
      console.error('Resend error:', err);
      return Response.json({ error: 'Failed to send research email' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error('Pre-call research error:', e);
    return Response.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
