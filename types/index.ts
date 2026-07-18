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

export interface FollowUpChallenge {
  title: string;
  body: string;
}

export interface FollowUpSolution {
  headline: string;
  body: string;
  pricingTier: string;
  keyBenefit: string;
}

export interface FollowUpContent {
  understanding: string;
  challenges: FollowUpChallenge[];
  solutions: FollowUpSolution[];
  tier: { label: string; setup: string; monthly: string };
  goLive: string;
  nextStep: string;
}

export interface SessionRow {
  id: string;
  created_at: string;
  ended_at: string | null;
  title: string | null;
  segment_count: number;
  summary_tldr: string | null;
}

export interface SessionDetail {
  id: string;
  created_at: string;
  ended_at: string | null;
  title: string | null;
  summary_tldr: string | null;
  summary_topics: { heading: string; bullets: string[] }[] | null;
  summary_client_needs: string[] | null;
  summary_open_questions: string[] | null;
  current_state_map: CurrentStateMap | null;
  followup_content: FollowUpContent | null;
}
