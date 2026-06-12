'use client';

import type { CopilotContext } from '@/types';

const DEFAULT_KNOWLEDGE_BASE = `
== SERVICES & SOLUTIONS CATALOG ==

READINESS / TECHNOLOGY TRACK
Pain: Everything done manually, no systems
→ Solution: Process audit + starter automation stack (map current workflows, identify top 2 time-wasters, automate both)

Pain: Basic tools but nothing connected
→ Solution: Integration layer — connect existing tools so data flows automatically (e.g. form → CRM → email notification)

Pain: Team resistant to change
→ Solution: Managed implementation with training; we build it, test it with them, go live together. They don't have to figure it out.

Pain: Data scattered across emails/spreadsheets
→ Solution: CRM setup + data consolidation — one source of truth, everything in one place

Pain: Never tried automation
→ Solution: Discovery workshop — 90 minutes to map their top 5 processes and identify the one highest-ROI automation to start with

OPERATIONS TRACK
Pain: 10+ hours/week on admin, data entry, reporting
→ Solution: Admin automation suite — automated reporting, data sync, recurring task triggers

Pain: Customer comms sent manually, inconsistent
→ Solution: Automated messaging sequences (email + SMS) — triggered by actions, not memory

Pain: Scheduling chaos, back-and-forth to book
→ Solution: Online booking + calendar automation — client books, reminders send, confirmations go out automatically

Pain: Things fall through the cracks
→ Solution: Alert + task system — automated notifications when something needs attention, nothing relies on memory

Pain: No real-time reporting, spreadsheets updated manually
→ Solution: Live dashboard — KPIs update automatically, owner sees the business at a glance

GROWTH & SALES TRACK
Pain: Only word of mouth, no real marketing system
→ Solution: Multi-channel lead gen system — consistent content + capture + follow-up

Pain: Leads not followed up, go cold
→ Solution: Automated lead nurture sequence (3–5 touch over 2 weeks) — triggered immediately on inquiry

Pain: No retention system, customers just leave
→ Solution: Loyalty/re-engagement automation — automated check-ins, win-back sequences, referral asks

Pain: Can't measure CAC or LTV
→ Solution: Analytics dashboard + attribution tracking — know exactly where leads come from and what they're worth

Pain: No review management
→ Solution: Review request automation — sends after key moments, responds to negatives before they go public


== PRICING TIERS ==

STARTER — $1,500–3,000 setup + $300/mo
Best for: One clear pain point, first-time automation, budget-conscious clients
Includes: 1-2 automations, setup + training, 30-day support
Pitch: "This is how we prove the ROI before you commit to more."

GROWTH — $4,000–8,000 setup + $600/mo
Best for: 3+ pain points, clients ready to systematize operations fully
Includes: Full workflow suite, integrations, dashboards, ongoing optimization
Pitch: "This is where most clients land once they see what's possible."

ENTERPRISE — Custom pricing
Best for: 50+ employees, complex multi-system environments, multi-location
Includes: Dedicated implementation, custom integrations, SLA support


== OBJECTION SCRIPTS ==

OBJECTION: "We can figure this out ourselves" / "Our IT guy can handle it"
SAY: "You could — and I don't doubt you have the intelligence to figure it out. The question is what the next 6 months look like while you're learning this on top of running the business. We've done this 50+ times. You'd be live in 4 weeks, not 6 months. What's 6 months of the current problem actually costing you?"
FOLLOW UP: If they push back again — "What specifically would you build first? Let's map it out right now — that'll tell us both how complex it is."

OBJECTION: "How do I know this will actually work for us?" / ROI skepticism
SAY: "That's exactly the right question to ask. Let me build the math with you right now. [Specific task from conversation] — how many hours a week does that take? And what's the rough hourly rate for the person doing it? [Listen and calculate.] At those numbers, this pays for itself in [X] weeks. I'll also build a 30-day review into the engagement so you can see the results before we expand."
FOLLOW UP: "I can also connect you with a client in a similar situation if that would help."

OBJECTION: "That's more than we expected" / Price concern
SAY: "I hear you. What were you expecting? [Listen.] Here's the other way to think about it: if we solve [specific problem from conversation], what's that worth to you over the next 12 months? [Let them answer.] At those numbers, the math usually surprises people. And we can also start just with [single highest-ROI automation] at the Starter tier and expand from there once you've seen it work."
FOLLOW UP: Break it into monthly — "$300 a month is less than one hour of your time."

OBJECTION: "We're too busy right now" / Not the right time
SAY: "The businesses that are too busy are usually the ones who need this most — the busyness is the symptom. We handle everything: setup, testing, training. Your team's involvement is about 2 hours total. And the longer you wait, the longer you're spending [X hours/week] on [specific task]. What would need to be true for the timing to feel right?"

OBJECTION: "We like the personal touch" / Automation feels impersonal
SAY: "I completely understand that — and that's actually what good automation protects. Right now you're spending [time] on [repetitive task]. Automation handles the repetitive touchpoints so you can spend that time on the relationship moments that actually matter. Your clients would notice the difference."

OBJECTION: "We need to talk to [partner/team/spouse]"
SAY: "Totally makes sense. Would it be helpful to do a 20-minute call with them included? I can walk through the numbers and answer any questions directly — saves you having to relay everything."
ALSO: Offer a one-pager — "I can put together a one-page summary of what we'd build and what it costs so it's easy to share."

OBJECTION: "Just send me a proposal"
SAY: "Happy to — I just want to make sure I capture the full picture first so the proposal is actually useful. Two more questions: [ask the most important uncovered discovery questions]. Then I'll have everything I need and I can have something to you by [tomorrow/end of week]."


== CLOSING PROMPTS ==
(Use when they show interest or ask forward-looking questions)
IMPORTANT: After saying any close, STOP TALKING. Silence is the move. First to speak often concedes.

HOW-QUESTIONS CLOSE (highest urgency — client has already decided emotionally):
When they ask "how long does setup take," "what would that look like," "how does that work" —
"Based on what you've told me, I'd suggest starting with [specific solution]. The simplest next step is a 30-minute scoping call — I'll map out exactly what we'd build and send you a proposal the same day. Does Thursday or Friday work?"
→ Say it. Then stop. Do not explain further. Wait.

STANDARD CLOSE:
"It sounds like [X] is the main thing hurting you right now. Based on what you've told me, I'd suggest we start with [specific solution]. The simplest next step is a 30-minute scoping call — we'd map out exactly what we build and I'll send you a proposal the same day. Does that work?"

SOFT CLOSE (when they seem interested but uncertain):
"It sounds like there's a real fit here. What would you need to see to feel confident moving forward?"

URGENCY CLOSE (when they've described active pain):
"Every [week/month] you're running without this, you're [losing leads / spending X hours / missing follow-ups]. What's the cost of waiting another 90 days?"

TWO-BUYER CLOSE (when ops manager is bought in but owner is quiet):
"[Ops manager name], it sounds like you've felt this pain most directly. [Owner name], what questions do you have? I want to make sure you both feel good about this before we talk next steps."

PRICE-QUOTED SILENCE RULE:
After stating a price, stop talking. Do not justify, explain, or soften. Let them respond first.
If they push back: "I hear you — what were you expecting?" [Listen.] Then use the ROI frame.


== BUYER PSYCHOLOGY — WHO IS IN THE ROOM ==

OWNER (makes final decision):
- Buying: CERTAINTY — "will this actually work, or will I pay and be in the same place?"
- Signals: asks about risk, ROI, "what happens if it doesn't work," makes final-sounding statements
- Approach: reduce risk, offer 30-day review, reference patterns from similar businesses, start small option

OPS MANAGER (feels the pain daily):
- Buying: RELIEF — "will this get this nightmare off my plate without me having to figure it all out?"
- Signals: describes day-to-day friction, says "I'm the one who has to deal with this," visibly relieved when you describe a solution
- Approach: emphasize "we handle everything — setup, testing, training, your team needs about 2 hours total"
- Give them internal language: "I can put together a one-page summary of what we'd build and what it costs so it's easy to share."

SILENT DECISION-MAKER:
- The person who talks most is rarely the buyer. Watch who others look at when you say something important.
- Direct your close at the quiet one.

OBJECTIONS ARE RARELY ABOUT THE STATED OBJECTION:
- "Too expensive" = "I don't see the value clearly enough yet" → rebuild the ROI, don't defend the price
- "We need to think about it" = "I'm not convinced it will work" → ask what specifically they need to see
- "Not the right time" = "The pain isn't urgent enough yet" → make the cost of waiting concrete


== PRICING STRATEGY ==

ALWAYS ANCHOR WITH GROWTH TIER FIRST:
Present the full Growth package ($4k–8k + $600/mo) as the recommendation. Then offer Starter as a step-down:
"If budget is a tighter consideration right now, we could start with just [single highest-ROI item] at the Starter tier — that's $1,500–3,000 setup plus $300/month — and build from there once you've seen it work."

ROI FRAME (use with every price):
"At $300/month — if this recovers even [X] hours a week for [person doing it], at [their rate], this pays for itself in [X] weeks. And that's before you factor in [leads converted / errors avoided / stress removed]."

AFTER QUOTING PRICE: Stop talking. Wait. Do not soften, explain, or justify. Let them respond.


== ASSESSMENT PATTERNS — LISTEN FOR THESE ==

MATURITY SIGNALS:
- "manually / by hand / in a spreadsheet / in our heads" → Beginner, HIGH opportunity
- "we have templates / we try to / we're supposed to" → Developing, MEDIUM opportunity
- "falls through the cracks / we miss things / when we remember" → Ops gap, HIGH opportunity
- "word of mouth / they find us / we don't really market" → Growth gap, HIGH opportunity
- "when we have time / eventually / we get to it" → Bandwidth constraint → automation argument

TECHNOLOGY MENTIONS → Integration opportunities:
QuickBooks, Xero, FreshBooks → Financial automation
HubSpot, Salesforce, Pipedrive → CRM optimization
Mailchimp, Constant Contact → Email upgrade
Google Sheets/Excel → Dashboard upgrade
Phone / manual calls → SMS/scheduling automation

BUYING SIGNALS → Trigger closing prompt immediately:
HOW-QUESTIONS (highest signal — client is already in): "how long does setup take," "how does that work," "what would that look like"
FORWARD-LOOKING: "that would really help," "we've needed something like this," "when could you start"
AGREEMENT WITH ENERGY: "yeah exactly," "that makes sense," "absolutely" (enthusiastic)
NEXT-STEP QUESTIONS: "what happens after this," "how do we get started," "what does working together look like"


== DISCOVERY QUESTIONS ==
Use these to uncover pain points not yet surfaced:

1. "Walk me through what happens when a new [lead / customer / order] comes in — step by step."
2. "How much time per week would you estimate goes to admin, reporting, or follow-up?"
3. "What happens to [leads / customers / orders] that don't convert or respond immediately?"
4. "If you could wave a magic wand and fix one thing in your operations this month, what would it be?"
5. "What does your team spend the most time on that honestly shouldn't need a human?"
6. "When something falls through the cracks, what usually causes it?"
7. "How do you currently know if the business is on track — what do you look at?"
`.trim();

interface ContextPanelProps {
  context: CopilotContext;
  onChange: (ctx: CopilotContext) => void;
}

export function ContextPanel({ context, onChange }: ContextPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 h-full" style={{ background: '#0e1018' }}>
      <div className="flex items-center justify-between">
        <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#58647a' }}>
          Knowledge Base
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
        placeholder="Paste your services, pricing, objection scripts, and discovery questions here before the call…"
        className="w-full resize-none outline-none flex-1"
        style={{
          background: '#08090f',
          border: '1px solid #1c2030',
          color: '#8a9eb8',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          lineHeight: 1.7,
          padding: '0.75rem',
          minHeight: 400,
        }}
      />
      <p style={{ fontSize: '0.7rem', color: '#2a3040', lineHeight: 1.6 }}>
        Sent to Claude with every suggestion request. Edit freely — your changes are saved automatically.
      </p>
    </div>
  );
}
