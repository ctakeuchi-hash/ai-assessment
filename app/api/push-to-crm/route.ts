import { NextRequest, NextResponse } from 'next/server';
import { pushToCRM } from '@/lib/airtable';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await pushToCRM(body);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
