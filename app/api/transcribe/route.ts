import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'DEEPGRAM_API_KEY not configured' }, { status: 500 });
  }

  const contentType = req.headers.get('content-type') ?? 'audio/webm';
  const audio = await req.arrayBuffer();

  if (audio.byteLength < 1000) {
    return NextResponse.json({ text: '' });
  }

  const url = 'https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&smart_format=true&language=en&filler_words=false';

  const dgRes = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': contentType,
    },
    body: audio,
  });

  if (!dgRes.ok) {
    const err = await dgRes.text();
    console.error('Deepgram error:', err);
    return NextResponse.json({ text: '' });
  }

  const data = await dgRes.json();
  const text: string = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';

  return NextResponse.json({ text });
}

export const maxDuration = 30;
