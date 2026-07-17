import { NextRequest, NextResponse } from 'next/server';
import { createBrandedDoc } from '@/lib/google-drive';
import type { SessionDetail, CopilotSuggestion } from '@/types';

export async function POST(req: NextRequest) {
  const { session, suggestions, clientName, consultantName } = await req.json() as {
    session: SessionDetail;
    suggestions: CopilotSuggestion[];
    clientName?: string;
    consultantName?: string;
  };

  if (!session) return NextResponse.json({ error: 'session required' }, { status: 400 });

  try {
    const doc = await createBrandedDoc(session, suggestions ?? [], clientName || 'Client', consultantName || 'Consultant');
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed to create Google Doc' }, { status: 500 });
  }
}
