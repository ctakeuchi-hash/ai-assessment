import { NextRequest, NextResponse } from 'next/server';
import { WORKFLOW_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { description } = await req.json();

  if (!description || description.trim().length < 10) {
    return NextResponse.json({ error: 'Not enough content to diagram' }, { status: 400 });
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
      system: WORKFLOW_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: description }],
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
    return NextResponse.json({ error: 'Failed to parse workflow JSON', raw: text }, { status: 500 });
  }
}
