import { NextRequest, NextResponse } from 'next/server';
import {
  createLocalSession,
  endLocalSession,
  saveLocalSegment,
  saveLocalSuggestions,
  updateLocalSessionSummary,
  updateLocalSessionStateMap,
  listLocalSessions,
  getLocalSession,
  getLocalSessionSegments,
  getLocalSessionSuggestions,
} from '@/lib/local-session-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const id = searchParams.get('id') ?? '';

  switch (action) {
    case 'list': return NextResponse.json(await listLocalSessions());
    case 'get': return NextResponse.json(await getLocalSession(id));
    case 'segments': return NextResponse.json(await getLocalSessionSegments(id));
    case 'suggestions': return NextResponse.json(await getLocalSessionSuggestions(id));
    default: return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  switch (body.action) {
    case 'create': {
      const id = await createLocalSession();
      return NextResponse.json({ id });
    }
    case 'end':
      await endLocalSession(body.sessionId, body.summary, body.currentStateMap);
      return NextResponse.json({ ok: true });
    case 'segment':
      await saveLocalSegment(body.sessionId, body.segment);
      return NextResponse.json({ ok: true });
    case 'suggestions':
      await saveLocalSuggestions(body.sessionId, body.suggestions);
      return NextResponse.json({ ok: true });
    case 'summary':
      await updateLocalSessionSummary(body.sessionId, body.summary);
      return NextResponse.json({ ok: true });
    case 'stateMap':
      await updateLocalSessionStateMap(body.sessionId, body.map);
      return NextResponse.json({ ok: true });
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
