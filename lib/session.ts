import { supabase } from './supabase';
import type { TranscriptSegment, CopilotSuggestion, CurrentStateMap } from '@/types';
import type { MeetingSummary } from './anthropic';

export async function createSession(): Promise<string | null> {
  const { data, error } = await supabase
    .from('copilot_sessions')
    .insert({ title: `Call — ${new Date().toLocaleString()}` })
    .select('id')
    .single();
  if (error) { console.error('createSession', error); return null; }
  return data.id;
}

export async function endSession(sessionId: string, summary?: MeetingSummary | null, currentStateMap?: CurrentStateMap | null) {
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
  const { error } = await supabase.from('copilot_sessions').update(patch).eq('id', sessionId);
  if (error) console.error('endSession', error);
}

export async function updateSessionSummary(sessionId: string, summary: MeetingSummary) {
  const { error } = await supabase.from('copilot_sessions').update({
    summary_tldr: summary.tldr,
    summary_topics: summary.topics,
    summary_client_needs: summary.clientNeeds,
    summary_open_questions: summary.openQuestions,
  }).eq('id', sessionId);
  if (error) console.error('updateSessionSummary', error);
}

export async function updateSessionStateMap(sessionId: string, map: CurrentStateMap) {
  const { error } = await supabase.from('copilot_sessions').update({
    current_state_map: map,
  }).eq('id', sessionId);
  if (error) console.error('updateSessionStateMap', error);
}

export async function saveSegment(sessionId: string, segment: TranscriptSegment) {
  const { error } = await supabase.from('copilot_segments').insert({
    session_id: sessionId,
    text: segment.text,
    timestamp_ms: segment.timestamp,
  });
  if (error) console.error('saveSegment', error);
}

export async function saveSuggestions(sessionId: string, suggestions: CopilotSuggestion[]) {
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
  const { error } = await supabase.from('copilot_suggestions').insert(rows);
  if (error) console.error('saveSuggestions', error);
}

export interface SessionRow {
  id: string;
  created_at: string;
  ended_at: string | null;
  title: string | null;
  segment_count: number;
  summary_tldr: string | null;
}

export async function listSessions(): Promise<SessionRow[]> {
  const { data, error } = await supabase
    .from('copilot_sessions')
    .select('id, created_at, ended_at, title, segment_count, summary_tldr')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error('listSessions', error); return []; }
  return data ?? [];
}

export interface SessionDetail {
  id: string;
  created_at: string;
  ended_at: string | null;
  title: string | null;
  summary_tldr: string | null;
  summary_topics: MeetingSummary['topics'] | null;
  summary_client_needs: string[] | null;
  summary_open_questions: string[] | null;
  current_state_map: CurrentStateMap | null;
}

export async function getSession(id: string): Promise<SessionDetail | null> {
  const { data, error } = await supabase
    .from('copilot_sessions')
    .select('id, created_at, ended_at, title, summary_tldr, summary_topics, summary_client_needs, summary_open_questions, current_state_map')
    .eq('id', id)
    .single();
  if (error) { console.error('getSession', error); return null; }
  return data;
}

export async function getSessionSegments(sessionId: string): Promise<TranscriptSegment[]> {
  const { data, error } = await supabase
    .from('copilot_segments')
    .select('id, text, timestamp_ms')
    .eq('session_id', sessionId)
    .order('timestamp_ms', { ascending: true });
  if (error) { console.error('getSessionSegments', error); return []; }
  return (data ?? []).map(r => ({ id: r.id, text: r.text, timestamp: r.timestamp_ms }));
}

export async function getSessionSuggestions(sessionId: string): Promise<CopilotSuggestion[]> {
  const { data, error } = await supabase
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
