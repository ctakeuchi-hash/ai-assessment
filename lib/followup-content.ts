import type { SessionDetail, CopilotSuggestion, FollowUpContent } from '@/types';

// Pure derivation, no I/O — shared by the "Populate from Call" button (client)
// and, previously, duplicated separately inside each of the three exporters
// (Google Doc, one-pager PDF, pitch deck PDF). Now all three just render this.
export function buildFollowUpContent(session: SessionDetail, suggestions: CopilotSuggestion[]): FollowUpContent {
  const solutionSuggestions = suggestions.filter(s => s.type === 'solution' || s.type === 'workflow').slice(0, 3);
  const clientNeeds = session.summary_client_needs ?? [];
  const processes = session.current_state_map?.processes ?? [];
  const highPainAreas = processes.filter(p => p.opportunitySize === 'high' || p.painPoints.length > 0);

  const challenges = highPainAreas.length > 0
    ? highPainAreas.slice(0, 3).map(p => ({ title: p.area, body: `${p.currentState}${p.painPoints.length ? ` — ${p.painPoints[0]}` : ''}` }))
    : clientNeeds.length > 0
      ? clientNeeds.slice(0, 3).map((need, i) => ({ title: `Need ${i + 1}`, body: need }))
      : [{ title: 'Challenge', body: 'Key operational challenges identified during our discovery conversation.' }];

  const solutions = solutionSuggestions.length > 0
    ? solutionSuggestions.map(s => ({
      headline: s.headline,
      body: s.proposedSolution ?? '',
      pricingTier: s.pricingTier ?? '',
      keyBenefit: s.keyBenefit ?? '',
    }))
    : [{
      headline: 'Custom Automation Suite',
      body: "Based on the processes discussed, we would design and implement an automation layer tailored to your team's workflows.",
      pricingTier: '',
      keyBenefit: '',
    }];

  const hasGrowth = solutionSuggestions.some(s => s.pricingTier?.toLowerCase().includes('growth'));
  const hasStarter = solutionSuggestions.some(s => s.pricingTier?.toLowerCase().includes('starter'));
  const tier = hasGrowth ? { label: 'Growth', setup: '$4,000–8,000', monthly: '$600/mo' }
    : hasStarter ? { label: 'Starter', setup: '$1,500–3,000', monthly: '$300/mo' }
    : { label: 'Scoped after this call', setup: 'TBD', monthly: 'TBD' };

  return {
    understanding: session.summary_tldr || 'Based on our discovery conversation, we have developed a clear picture of where your business stands today and where automation can create the most leverage.',
    challenges,
    solutions,
    tier,
    goLive: '4 weeks',
    nextStep: "Next step: 30-minute scoping call to confirm scope and finalize the proposal. I'll send a calendar link — or reply with a time that works.",
  };
}
