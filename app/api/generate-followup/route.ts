import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type JSXElementConstructor, type ReactElement } from 'react';
import type { SessionDetail, CopilotSuggestion } from '@/types';
import { FollowUpPDF } from '@/components/copilot/FollowUpPDF';

export async function POST(req: NextRequest) {
  const { session, suggestions, clientName, consultantName } = await req.json() as {
    session: SessionDetail;
    suggestions: CopilotSuggestion[];
    clientName?: string;
    consultantName?: string;
  };

  if (!session) return NextResponse.json({ error: 'session required' }, { status: 400 });

  const element = createElement(FollowUpPDF, {
    session,
    suggestions,
    clientName: clientName || 'Client',
    consultantName: consultantName || 'Consultant',
  }) as unknown as ReactElement<DocumentProps, JSXElementConstructor<DocumentProps>>;

  const buffer = await renderToBuffer(element);

  const slug = (clientName || 'client').toLowerCase().replace(/\s+/g, '-');
  const date = new Date(session.created_at).toISOString().slice(0, 10);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slug}-proposal-${date}.pdf"`,
    },
  });
}
