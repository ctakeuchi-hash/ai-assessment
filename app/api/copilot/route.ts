import { NextRequest, NextResponse } from 'next/server';
import { COPILOT_SYSTEM_PROMPT } from '@/lib/prompts';
import type { CopilotContext } from '@/types';

export async function POST(req: NextRequest) {
  const { transcript, context } = await req.json() as {
    transcript: string;
    context: CopilotContext;
  };

  if (!transcript) {
    return NextResponse.json({ suggestions: [] });
  }

  const last2000 = transcript.slice(-2000);

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
      system: COPILOT_SYSTEM_PROMPT(context),
      messages: [{ role: 'user', content: `Transcript:\n${last2000}` }],
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
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
