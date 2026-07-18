import type { TranscriptSegment, CopilotSuggestion, CurrentStateMap, SessionRow, SessionDetail } from '@/types';
import type { MeetingSummary } from './anthropic';

// Browser-only fallback store used when Supabase isn't configured. The app is
// deployed to Vercel, whose serverless functions have a read-only filesystem —
// so "save it on this machine" has to mean the browser's IndexedDB, not a
// server-side file. Every function here must only ever be called client-side.
const DB_NAME = 'copilot-local';
const STORE = 'sessions';

interface LocalSession extends SessionDetail {
  segments: TranscriptSegment[];
  suggestions: CopilotSuggestion[];
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getRaw(id: string): Promise<LocalSession | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function put(session: LocalSession): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put(session);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function createLocalSession(): Promise<string> {
  const id = crypto.randomUUID();
  await put({
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
  const s = await getRaw(id);
  if (!s) return;
  s.ended_at = new Date().toISOString();
  if (summary) {
    s.summary_tldr = summary.tldr;
    s.summary_topics = summary.topics;
    s.summary_client_needs = summary.clientNeeds;
    s.summary_open_questions = summary.openQuestions;
  }
  if (currentStateMap) s.current_state_map = currentStateMap;
  await put(s);
}

export async function updateLocalSessionSummary(id: string, summary: MeetingSummary) {
  const s = await getRaw(id);
  if (!s) return;
  s.summary_tldr = summary.tldr;
  s.summary_topics = summary.topics;
  s.summary_client_needs = summary.clientNeeds;
  s.summary_open_questions = summary.openQuestions;
  await put(s);
}

export async function updateLocalSessionTitle(id: string, title: string) {
  const s = await getRaw(id);
  if (!s) return;
  s.title = title;
  await put(s);
}

export async function updateLocalSessionStateMap(id: string, map: CurrentStateMap) {
  const s = await getRaw(id);
  if (!s) return;
  s.current_state_map = map;
  await put(s);
}

export async function saveLocalSegment(id: string, segment: TranscriptSegment) {
  const s = await getRaw(id);
  if (!s) return;
  s.segments.push(segment);
  await put(s);
}

export async function saveLocalSuggestions(id: string, suggestions: CopilotSuggestion[]) {
  const s = await getRaw(id);
  if (!s) return;
  s.suggestions.push(...suggestions);
  await put(s);
}

export async function listLocalSessions(): Promise<SessionRow[]> {
  const db = await openDB();
  const all: LocalSession[] = await new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return all
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
  const s = await getRaw(id);
  if (!s) return null;
  const { segments, suggestions, ...detail } = s;
  return detail;
}

export async function getLocalSessionSegments(id: string): Promise<TranscriptSegment[]> {
  return (await getRaw(id))?.segments ?? [];
}

export async function getLocalSessionSuggestions(id: string): Promise<CopilotSuggestion[]> {
  return (await getRaw(id))?.suggestions ?? [];
}
