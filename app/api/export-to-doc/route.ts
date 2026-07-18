import { NextRequest, NextResponse } from 'next/server';
import { createBrandedDoc } from '@/lib/google-drive';
import type { FollowUpContent } from '@/types';

export async function POST(req: NextRequest) {
  const { content, clientName, consultantName, date } = await req.json() as {
    content: FollowUpContent;
    clientName?: string;
    consultantName?: string;
    date: string;
  };

  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });

  try {
    const doc = await createBrandedDoc(content, clientName || 'Client', consultantName || 'Consultant', date);
    return NextResponse.json(doc);
  } catch (e) {
    // GaxiosError from googleapis carries Google's real error_description in
    // response.data — e.message alone (e.g. "invalid_grant") isn't enough to
    // diagnose which of client_id/secret/refresh_token is wrong.
    const details = (e as { response?: { data?: unknown } })?.response?.data;
    console.error('export-to-doc failed', e instanceof Error ? e.message : e, details ?? '');
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed to create Google Doc' }, { status: 500 });
  }
}
