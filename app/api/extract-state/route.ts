import { NextRequest, NextResponse } from 'next/server';
import { CURRENT_STATE_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();

  if (!transcript || transcript.trim().length < 50) {
    return NextResponse.json({
      processes: [],
      technologyMentioned: [],
      budgetSignals: [],
      timelineSignals: [],
    });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: CURRENT_STATE_PROMPT,
      messages: [{ role: 'user', content: `Discovery call transcript:\n\n${transcript}` }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  const data = await res.json();
  const text = data.content?.find((b: any) => b.type === 'text')?.text ?? '';

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return NextResponse.json(JSON.parse(clean));
  } catch {
    return NextResponse.json({
      processes: [],
      technologyMentioned: [],
      budgetSignals: [],
      timelineSignals: [],
    });
  }
}
