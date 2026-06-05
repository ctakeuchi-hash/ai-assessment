import { NextRequest, NextResponse } from 'next/server';
import { SUMMARIZE_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();

  if (!transcript || transcript.trim().length < 50) {
    return NextResponse.json({ error: 'Not enough content to summarize' }, { status: 400 });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SUMMARIZE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Meeting transcript so far:\n\n${transcript}` }],
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
    return NextResponse.json({ error: 'Failed to parse summary JSON', raw: text }, { status: 500 });
  }
}
