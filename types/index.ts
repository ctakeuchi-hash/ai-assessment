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
  type: 'solution' | 'question' | 'workflow' | 'warning' | 'closing';
  headline: string;
  detail: string;
  confidence: 'high' | 'medium' | 'low';
  triggeredBy: string;
  timestamp: number;
  // enriched fields (present on solution/workflow suggestions)
  currentState?: string;
  proposedSolution?: string;
  pricingTier?: string;
  keyBenefit?: string;
  likelyObjection?: string;
  objectionResponse?: string;
}

export interface CopilotContext {
  systemPrompt: string;
  knowledgeBase: string;
}

export interface ProcessArea {
  area: string;
  currentState: string;
  maturity: 'beginner' | 'developing' | 'growing' | 'advanced';
  painPoints: string[];
  opportunitySize: 'low' | 'medium' | 'high';
}

export interface CurrentStateMap {
  updatedAt: number;
  processes: ProcessArea[];
  technologyMentioned: string[];
  budgetSignals: string[];
  timelineSignals: string[];
}
