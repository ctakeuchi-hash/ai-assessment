import { getSupabase } from './supabase';
import type { TranscriptSegment, CopilotSuggestion, CurrentStateMap, SessionRow, SessionDetail } from '@/types';
import type { MeetingSummary } from './anthropic';

export type { SessionRow, SessionDetail };

// Write ops are only ever called from client components (the copilot recording
// page), so a relative fetch is always safe here.
async function localPost<T = { ok: true }>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch('/api/local-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...body }),
  });
  return res.json();
}

// Read ops are called from both client components (history page) and server
// API routes (PDF/CRM generation), so route straight to the fs store when on
// the server instead of fetching a relative URL (which has no base there).
async function localGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  if (typeof window === 'undefined') {
    const store = await import('./local-session-store');
    switch (action) {
      case 'list': return store.listLocalSessions() as Promise<T>;
      case 'get': return store.getLocalSession(params.id) as Promise<T>;
      case 'segments': return store.getLocalSessionSegments(params.id) as Promise<T>;
      case 'suggestions': return store.getLocalSessionSuggestions(params.id) as Promise<T>;
    }
  }
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`/api/local-sessions?${qs}`);
  return res.json();
}

export async function createSession(): Promise<string | null> {
  const db = getSupabase();
  if (!db) {
    const { id } = await localPost<{ id: string }>('create');
    return id;
  }
  const { data, error } = await db
    .from('copilot_sessions')
    .insert({ title: `Call — ${new Date().toLocaleString()}` })
    .select('id')
    .single();
  if (error) { console.error('createSession', error); return null; }
  return data.id;
}

export async function endSession(sessionId: string, summary?: MeetingSummary | null, currentStateMap?: CurrentStateMap | null) {
  const db = getSupabase();
  if (!db) { await localPost('end', { sessionId, summary, currentStateMap }); return; }
  const patch: Record<string, unknown> = { ended_at: new Date().toISOString() };
  if (summary) {
    patch.summary_tldr = summary.tldr;
    patch.summary_topics = summary.topics;
    patch.summary_client_needs = summary.clientNeeds;
    patch.summary_open_questions = summary.openQuestions;
  }
  if (currentStateMap) {
    patch.current_state_map = currentStateMap;
  }
  const { error } = await db.from('copilot_sessions').update(patch).eq('id', sessionId);
  if (error) console.error('endSession', error);
}

export async function updateSessionSummary(sessionId: string, summary: MeetingSummary) {
  const db = getSupabase();
  if (!db) { await localPost('summary', { sessionId, summary }); return; }
  const { error } = await db.from('copilot_sessions').update({
    summary_tldr: summary.tldr,
    summary_topics: summary.topics,
    summary_client_needs: summary.clientNeeds,
    summary_open_questions: summary.openQuestions,
  }).eq('id', sessionId);
  if (error) console.error('updateSessionSummary', error);
}

export async function updateSessionStateMap(sessionId: string, map: CurrentStateMap) {
  const db = getSupabase();
  if (!db) { await localPost('stateMap', { sessionId, map }); return; }
  const { error } = await db.from('copilot_sessions').update({
    current_state_map: map,
  }).eq('id', sessionId);
  if (error) console.error('updateSessionStateMap', error);
}

export async function saveSegment(sessionId: string, segment: TranscriptSegment) {
  const db = getSupabase();
  if (!db) { await localPost('segment', { sessionId, segment }); return; }
  const { error } = await db.from('copilot_segments').insert({
    session_id: sessionId,
    text: segment.text,
    timestamp_ms: segment.timestamp,
  });
  if (error) console.error('saveSegment', error);
}

export async function saveSuggestions(sessionId: string, suggestions: CopilotSuggestion[]) {
  const db = getSupabase();
  if (!db) { await localPost('suggestions', { sessionId, suggestions }); return; }
  const rows = suggestions.map(s => ({
    session_id: sessionId,
    type: s.type,
    headline: s.headline,
    detail: s.detail,
    confidence: s.confidence,
    triggered_by: s.triggeredBy,
    current_state: s.currentState,
    proposed_solution: s.proposedSolution,
    pricing_tier: s.pricingTier,
    key_benefit: s.keyBenefit,
    likely_objection: s.likelyObjection,
    objection_response: s.objectionResponse,
  }));
  const { error } = await db.from('copilot_suggestions').insert(rows);
  if (error) console.error('saveSuggestions', error);
}

export async function listSessions(): Promise<SessionRow[]> {
  const db = getSupabase();
  if (!db) return localGet<SessionRow[]>('list');
  const { data, error } = await db
    .from('copilot_sessions')
    .select('id, created_at, ended_at, title, segment_count, summary_tldr')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error('listSessions', error); return []; }
  return data ?? [];
}

export async function getSession(id: string): Promise<SessionDetail | null> {
  const db = getSupabase();
  if (!db) return localGet<SessionDetail | null>('get', { id });
  const { data, error } = await db
    .from('copilot_sessions')
    .select('id, created_at, ended_at, title, summary_tldr, summary_topics, summary_client_needs, summary_open_questions, current_state_map')
    .eq('id', id)
    .single();
  if (error) { console.error('getSession', error); return null; }
  return data;
}

export async function getSessionSegments(sessionId: string): Promise<TranscriptSegment[]> {
  const db = getSupabase();
  if (!db) return localGet<TranscriptSegment[]>('segments', { id: sessionId });
  const { data, error } = await db
    .from('copilot_segments')
    .select('id, text, timestamp_ms')
    .eq('session_id', sessionId)
    .order('timestamp_ms', { ascending: true });
  if (error) { console.error('getSessionSegments', error); return []; }
  return (data ?? []).map(r => ({ id: r.id, text: r.text, timestamp: r.timestamp_ms }));
}

export async function getSessionSuggestions(sessionId: string): Promise<CopilotSuggestion[]> {
  const db = getSupabase();
  if (!db) return localGet<CopilotSuggestion[]>('suggestions', { id: sessionId });
  const { data, error } = await db
    .from('copilot_suggestions')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) { console.error('getSessionSuggestions', error); return []; }
  return (data ?? []).map(r => ({
    id: r.id,
    type: r.type,
    headline: r.headline,
    detail: r.detail,
    confidence: r.confidence,
    triggeredBy: r.triggered_by,
    timestamp: new Date(r.created_at).getTime(),
    currentState: r.current_state,
    proposedSolution: r.proposed_solution,
    pricingTier: r.pricing_tier,
    keyBenefit: r.key_benefit,
    likelyObjection: r.likely_objection,
    objectionResponse: r.objection_response,
  }));
}
