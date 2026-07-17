import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { TranscriptSegment, CopilotSuggestion, CurrentStateMap, SessionRow, SessionDetail } from '@/types';
import type { MeetingSummary } from './anthropic';

// Server-only fallback store used when Supabase isn't configured — writes one
// JSON file per call session to disk so nothing depends on a cloud DB to save.
const DIR = path.join(process.cwd(), '.data', 'copilot-sessions');

interface LocalSuggestionRow {
  id: string;
  type: string;
  headline: string;
  detail: string;
  confidence: string;
  triggered_by: string;
  current_state?: string;
  proposed_solution?: string;
  pricing_tier?: string;
  key_benefit?: string;
  likely_objection?: string;
  objection_response?: string;
  created_at: string;
}

interface LocalSessionFile extends SessionDetail {
  segments: { id: string; text: string; timestamp_ms: number }[];
  suggestions: LocalSuggestionRow[];
}

function filePath(id: string) {
  return path.join(DIR, `${id}.json`);
}

async function readFile(id: string): Promise<LocalSessionFile | null> {
  try {
    const raw = await fs.readFile(filePath(id), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeFile(session: LocalSessionFile) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(filePath(session.id), JSON.stringify(session, null, 2));
}

export async function createLocalSession(): Promise<string> {
  const id = randomUUID();
  await writeFile({
    id,
    created_at: new Date().toISOString(),
    ended_at: null,
    title: `Call — ${new Date().toLocaleString()}`,
    summary_tldr: null,
    summary_topics: null,
    summary_client_needs: null,
    summary_open_questions: null,
    current_state_map: null,
    segments: [],
    suggestions: [],
  });
  return id;
}

export async function endLocalSession(id: string, summary?: MeetingSummary | null, currentStateMap?: CurrentStateMap | null) {
  const s = await readFile(id);
  if (!s) return;
  s.ended_at = new Date().toISOString();
  if (summary) {
    s.summary_tldr = summary.tldr;
    s.summary_topics = summary.topics;
    s.summary_client_needs = summary.clientNeeds;
    s.summary_open_questions = summary.openQuestions;
  }
  if (currentStateMap) s.current_state_map = currentStateMap;
  await writeFile(s);
}

export async function updateLocalSessionSummary(id: string, summary: MeetingSummary) {
  const s = await readFile(id);
  if (!s) return;
  s.summary_tldr = summary.tldr;
  s.summary_topics = summary.topics;
  s.summary_client_needs = summary.clientNeeds;
  s.summary_open_questions = summary.openQuestions;
  await writeFile(s);
}

export async function updateLocalSessionStateMap(id: string, map: CurrentStateMap) {
  const s = await readFile(id);
  if (!s) return;
  s.current_state_map = map;
  await writeFile(s);
}

export async function saveLocalSegment(id: string, segment: TranscriptSegment) {
  const s = await readFile(id);
  if (!s) return;
  s.segments.push({ id: segment.id, text: segment.text, timestamp_ms: segment.timestamp });
  await writeFile(s);
}

export async function saveLocalSuggestions(id: string, suggestions: CopilotSuggestion[]) {
  const s = await readFile(id);
  if (!s) return;
  for (const sug of suggestions) {
    s.suggestions.push({
      id: sug.id ?? randomUUID(),
      type: sug.type,
      headline: sug.headline,
      detail: sug.detail,
      confidence: sug.confidence,
      triggered_by: sug.triggeredBy,
      current_state: sug.currentState,
      proposed_solution: sug.proposedSolution,
      pricing_tier: sug.pricingTier,
      key_benefit: sug.keyBenefit,
      likely_objection: sug.likelyObjection,
      objection_response: sug.objectionResponse,
      created_at: new Date().toISOString(),
    });
  }
  await writeFile(s);
}

export async function listLocalSessions(): Promise<SessionRow[]> {
  await fs.mkdir(DIR, { recursive: true });
  const files = await fs.readdir(DIR);
  const sessions = await Promise.all(
    files.filter(f => f.endsWith('.json')).map(f => readFile(f.replace(/\.json$/, '')))
  );
  return sessions
    .filter((s): s is LocalSessionFile => s !== null)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50)
    .map(s => ({
      id: s.id,
      created_at: s.created_at,
      ended_at: s.ended_at,
      title: s.title,
      segment_count: s.segments.length,
      summary_tldr: s.summary_tldr,
    }));
}

export async function getLocalSession(id: string): Promise<SessionDetail | null> {
  const s = await readFile(id);
  if (!s) return null;
  const { segments, suggestions, ...detail } = s;
  return detail;
}

export async function getLocalSessionSegments(id: string): Promise<TranscriptSegment[]> {
  const s = await readFile(id);
  if (!s) return [];
  return s.segments.map(seg => ({ id: seg.id, text: seg.text, timestamp: seg.timestamp_ms }));
}

export async function getLocalSessionSuggestions(id: string): Promise<CopilotSuggestion[]> {
  const s = await readFile(id);
  if (!s) return [];
  return s.suggestions.map(r => ({
    id: r.id,
    type: r.type as CopilotSuggestion['type'],
    headline: r.headline,
    detail: r.detail,
    confidence: r.confidence as CopilotSuggestion['confidence'],
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
