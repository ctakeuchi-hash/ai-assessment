import { NextRequest, NextResponse } from 'next/server';
import { WORKFLOW_SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const { description } = await req.json();

  if (!description) {
    return NextResponse.json({ error: 'description required' }, { status: 400 });
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
      max_tokens: 2048,
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
    const workflow = JSON.parse(clean);
    return NextResponse.json(workflow);
  } catch {
    return NextResponse.json({ error: 'Failed to parse workflow JSON', raw: text }, { status: 500 });
  }
}
