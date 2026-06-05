export type NodeType = 'trigger' | 'process' | 'decision' | 'output' | 'integration';

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  type: NodeType;
  connections: string[];
}

export interface Workflow {
  title: string;
  steps: WorkflowStep[];
}

export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number;
  speaker?: 'me' | 'client';
}

export interface CopilotSuggestion {
  id: string;
  type: 'solution' | 'question' | 'workflow' | 'warning';
  headline: string;
  detail: string;
  confidence: 'high' | 'medium' | 'low';
  triggeredBy: string;
  timestamp: number;
}

export interface CopilotContext {
  systemPrompt: string;
  knowledgeBase: string;
}
