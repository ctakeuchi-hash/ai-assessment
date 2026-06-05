'use client';

import type { CopilotContext } from '@/types';

const DEFAULT_KNOWLEDGE_BASE = `SERVICES OFFERED:
- Business process automation and workflow design
- CRM implementation and optimization
- Customer communication systems (email, SMS, chatbot)
- Reporting and analytics dashboards
- Integration between business tools

PRICING TIERS:
- Starter: $1,500–$3,000 setup + $300/mo (1-2 automations)
- Growth: $4,000–$8,000 setup + $600/mo (full workflow suite)
- Enterprise: Custom pricing, dedicated support

COMMON INTEGRATIONS:
- CRMs: Salesforce, HubSpot, Pipedrive
- Communication: Twilio, Mailchimp, ActiveCampaign
- Finance: QuickBooks, Stripe, FreshBooks
- Productivity: Slack, Notion, Google Workspace

COMMON OBJECTIONS & RESPONSES:
- "Too expensive" → ROI typically 3-5x in year 1 through time savings
- "Too complex" → We handle setup and training, typically live in 2-4 weeks
- "We'll do it ourselves" → Most teams lack bandwidth; we've done this 50+ times`;

interface ContextPanelProps {
  context: CopilotContext;
  onChange: (ctx: CopilotContext) => void;
}

export function ContextPanel({ context, onChange }: ContextPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 h-full" style={{ background: '#0e1018', borderBottom: '1px solid #1c2030' }}>
      <div className="flex items-center justify-between">
        <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#58647a' }}>
          Your Knowledge Base
        </label>
        <button
          onClick={() => onChange({ ...context, knowledgeBase: DEFAULT_KNOWLEDGE_BASE })}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: '#4a9eff', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Load Template
        </button>
      </div>
      <textarea
        value={context.knowledgeBase}
        onChange={e => onChange({ ...context, knowledgeBase: e.target.value })}
        placeholder="Paste your services, pricing, integrations, and objection responses here before the call…"
        rows={10}
        className="w-full resize-none outline-none"
        style={{
          background: '#08090f',
          border: '1px solid #1c2030',
          color: '#8a9eb8',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.78rem',
          lineHeight: 1.7,
          padding: '0.75rem',
        }}
      />
      <p style={{ fontSize: '0.72rem', color: '#2a3040', lineHeight: 1.6 }}>
        This context is sent to Claude with every transcript update. Persisted to localStorage.
      </p>
    </div>
  );
}
