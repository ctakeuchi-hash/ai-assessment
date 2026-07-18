import { getSupabase } from './supabase';
import * as local from './local-store';
import type { TranscriptSegment, CopilotSuggestion, CurrentStateMap, SessionRow, SessionDetail } from '@/types';
import type { MeetingSummary } from './anthropic';

export type { SessionRow, SessionDetail };

export async function createSession(): Promise<string | null> {
  const db = getSupabase();
  if (!db) {
    try { return await local.createLocalSession(); } catch (e) { console.error('createSession (local)', e); return null; }
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
  if (!db) {
    try { await local.endLocalSession(sessionId, summary, currentStateMap); } catch (e) { console.error('endSession (local)', e); }
    return;
  }
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
  if (!db) {
    try { await local.updateLocalSessionSummary(sessionId, summary); } catch (e) { console.error('updateSessionSummary (local)', e); }
    return;
  }
  const { error } = await db.from('copilot_sessions').update({
    summary_tldr: summary.tldr,
    summary_topics: summary.topics,
    summary_client_needs: summary.clientNeeds,
    summary_open_questions: summary.openQuestions,
  }).eq('id', sessionId);
  if (error) console.error('updateSessionSummary', error);
}

export async function updateSessionTitle(sessionId: string, title: string) {
  const db = getSupabase();
  if (!db) {
    try { await local.updateLocalSessionTitle(sessionId, title); } catch (e) { console.error('updateSessionTitle (local)', e); }
    return;
  }
  const { error } = await db.from('copilot_sessions').update({ title }).eq('id', sessionId);
  if (error) console.error('updateSessionTitle', error);
}

export async function updateSessionStateMap(sessionId: string, map: CurrentStateMap) {
  const db = getSupabase();
  if (!db) {
    try { await local.updateLocalSessionStateMap(sessionId, map); } catch (e) { console.error('updateSessionStateMap (local)', e); }
    return;
  }
  const { error } = await db.from('copilot_sessions').update({
    current_state_map: map,
  }).eq('id', sessionId);
  if (error) console.error('updateSessionStateMap', error);
}

export async function saveSegment(sessionId: string, segment: TranscriptSegment) {
  const db = getSupabase();
  if (!db) {
    try { await local.saveLocalSegment(sessionId, segment); } catch (e) { console.error('saveSegment (local)', e); }
    return;
  }
  const { error } = await db.from('copilot_segments').insert({
    session_id: sessionId,
    text: segment.text,
    timestamp_ms: segment.timestamp,
  });
  if (error) console.error('saveSegment', error);
}

export async function saveSuggestions(sessionId: string, suggestions: CopilotSuggestion[]) {
  const db = getSupabase();
  if (!db) {
    try { await local.saveLocalSuggestions(sessionId, suggestions); } catch (e) { console.error('saveSuggestions (local)', e); }
    return;
  }
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
  if (!db) {
    try { return await local.listLocalSessions(); } catch (e) { console.error('listSessions (local)', e); return []; }
  }
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
  if (!db) {
    try { return await local.getLocalSession(id); } catch (e) { console.error('getSession (local)', e); return null; }
  }
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
  if (!db) {
    try { return await local.getLocalSessionSegments(sessionId); } catch (e) { console.error('getSessionSegments (local)', e); return []; }
  }
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
  if (!db) {
    try { return await local.getLocalSessionSuggestions(sessionId); } catch (e) { console.error('getSessionSuggestions (local)', e); return []; }
  }
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
