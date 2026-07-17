import type { CopilotContext, CopilotSuggestion, CurrentStateMap, Workflow } from '@/types';

export async function generateWorkflow(description: string): Promise<Workflow> {
  const res = await fetch('/api/workflow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });

  if (!res.ok) {
    throw new Error(`Workflow API error: ${res.status}`);
  }

  const data = await res.json();
  return data as Workflow;
}

export interface MeetingSummary {
  tldr: string;
  topics: { heading: string; bullets: string[] }[];
  clientNeeds: string[];
  openQuestions: string[];
}

export async function getMeetingSummary(transcript: string): Promise<MeetingSummary> {
  const res = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) throw new Error(`Summarize API error: ${res.status}`);
  return res.json() as Promise<MeetingSummary>;
}

export async function extractCurrentState(transcript: string): Promise<CurrentStateMap> {
  const res = await fetch('/api/extract-state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  });

  if (!res.ok) throw new Error(`Extract state API error: ${res.status}`);
  const data = await res.json();
  return { ...data, updatedAt: Date.now() } as CurrentStateMap;
}

export async function getCopilotSuggestions(
  transcript: string,
  context: CopilotContext
): Promise<CopilotSuggestion[]> {
  const res = await fetch('/api/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, context }),
  });

  if (!res.ok) {
    throw new Error(`Copilot API error: ${res.status}`);
  }

  const data = await res.json();
  return (data.suggestions ?? []).map((s: any) => ({
    ...s,
    // Stable per (type, headline) so a re-surfaced suggestion reuses its existing
    // card/React key instead of mounting fresh and collapsing what's expanded.
    id: `${s.type}:${s.headline}`,
    timestamp: Date.now(),
  })) as CopilotSuggestion[];
}
