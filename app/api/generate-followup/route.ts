import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type JSXElementConstructor, type ReactElement } from 'react';
import type { FollowUpContent } from '@/types';
import { FollowUpPDF } from '@/components/copilot/FollowUpPDF';

export async function POST(req: NextRequest) {
  const { content, clientName, consultantName, date } = await req.json() as {
    content: FollowUpContent;
    clientName?: string;
    consultantName?: string;
    date: string;
  };

  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });

  const element = createElement(FollowUpPDF, {
    content,
    clientName: clientName || 'Client',
    consultantName: consultantName || 'Consultant',
    date,
  }) as unknown as ReactElement<DocumentProps, JSXElementConstructor<DocumentProps>>;

  const buffer = await renderToBuffer(element);

  const slug = (clientName || 'client').toLowerCase().replace(/\s+/g, '-');
  const dateSlug = new Date(date).toISOString().slice(0, 10);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${slug}-proposal-${dateSlug}.pdf"`,
    },
  });
}
