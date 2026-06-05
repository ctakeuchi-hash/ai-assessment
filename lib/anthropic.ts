import type { CopilotContext, CopilotSuggestion, Workflow } from '@/types';

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
  return (data.suggestions ?? []).map((s: any, i: number) => ({
    ...s,
    id: `${Date.now()}-${i}`,
    timestamp: Date.now(),
  })) as CopilotSuggestion[];
}
