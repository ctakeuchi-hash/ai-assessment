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

export async function POST(req) {
  const password = req.headers.get('x-admin-password');
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { company, industry, size, role, scores, report } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 });
  }

  const reviews = await fetchReviews(company);
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
- AI Readiness: ${scores?.ai ?? '?'}/12
- Operations: ${scores?.ops ?? '?'}/12
- Growth & Sales: ${scores?.growth ?? '?'}/12
- Overall: ${scores?.overall ?? '?'}/36

${report ? `ASSESSMENT SUMMARY:\n${report}\n\n` : ''}${reviewsText}Generate a JSON object. Be specific to their industry and size — not generic:
{
  "companyProfile": "2-3 sentences on what a ${size} company in ${industry} typically looks like operationally",
  "competitors": [
    { "name": "Real competitor or comparable service", "notes": "Why they matter as context" }
  ],
  "industryTrends": [
    { "trend": "Specific current trend in ${industry}", "relevance": "Why it matters now" }
  ],
  "automationOpportunities": [
    { "area": "Specific process or function", "description": "Concrete opportunity based on their scores" }
  ],
  "reviewSummary": ${reviews ? '"Brief summary of customer sentiment"' : 'null'},
  "surveyInsights": "What their scores reveal about their biggest pain points and readiness",
  "conversationStarters": [
    "Specific discovery question tailored to their profile",
    "Another specific question",
    "A third question"
  ],
  "watchFor": [
    "Most likely objection based on their profile",
    "Another concern to watch for"
  ]
}

Return ONLY valid JSON. No markdown fences. No commentary.`;

  try {
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
    const research = JSON.parse(txt.replace(/```json|```/g, '').trim());

    if (!reviews) {
      research.fallbackLinks = [
        { label: 'Google Reviews', url: `https://www.google.com/search?q=${encodeURIComponent(company + ' reviews')}` },
        { label: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(company)}` },
        { label: 'G2', url: `https://www.g2.com/search?utf8=%E2%9C%93&query=${encodeURIComponent(company)}` }
      ];
    } else {
      research.reviewLinks = reviews;
    }

    return Response.json({ success: true, research });
  } catch (e) {
    console.error('Research generation error:', e);
    return Response.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
