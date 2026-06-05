# DragonScale — Post-Assessment Email Sequence
### 3 Emails · 7 Days · Converts Cold Leads to Booked Calls
### Chris Takeuchi · June 2026

---

## HOW THIS SEQUENCE WORKS

**Trigger:** Person completes the assessment but does NOT book a scoping call within 24 hours.
**Goal:** Get them to book a 30-minute scoping call.
**Tone:** Warm, direct, peer-to-peer. Not a nurture drip. Not a sales sequence. A real person following up with something useful.
**From name:** Chris Takeuchi (not DragonScale — people respond to people)
**From email:** chris@dragonscale.consulting

---

## EMAIL 1 — Sent 24 Hours After Assessment Completion

**Subject:** Your DragonScale report — one thing I noticed

Hi [First Name],

You completed the DragonScale assessment yesterday — I pulled your report and wanted to follow up directly.

One thing stood out: your score on [lowest scoring track — Operations / Readiness / Growth] suggests there's meaningful automation opportunity sitting in your [operations / sales workflow / data infrastructure] that's costing you more than most business owners realize when they add it up.

The quick math on something like this: if one person on your team spends even 6 hours a week on work that could be automated, that's 300 hours a year — roughly $15,000-$25,000 in fully loaded labor, depending on their role. Most businesses I talk to have 3-4 of these processes running simultaneously.

Your report gives you the map. The scoping call is where we figure out which one to fix first and what that's actually worth to your business.

It's 30 minutes, no pitch, and I'll send you a fixed-scope proposal within 24 hours if there's a fit — or tell you honestly if there isn't.

[Book a scoping call → Calendly link]

Chris Takeuchi
Founder, DragonScale
chris@dragonscale.consulting

P.S. If you tried Claude for Small Business and hit some limits — that's actually the most common thing I'm hearing right now. The scoping call is a good place to talk through what custom actually looks like for your situation.

---

## EMAIL 2 — Sent 3 Days After Assessment Completion

**Subject:** The $47,000 process hiding in plain sight

Hi [First Name],

A quick story — because it's relevant to what showed up in your assessment.

I worked with a food & bev distributor last year. 12 people, $8M in revenue. Their ops manager spent every Monday morning doing a manual inventory reconciliation across three systems — QuickBooks, their WMS, and a Google Sheet that had become load-bearing infrastructure over five years.

Four hours. Every Monday. For years.

When we added it up: 4 hours × 52 weeks × her fully loaded cost = $47,000 a year of senior ops talent doing work a well-configured automation could do in 4 minutes.

We fixed it in two weeks. The automation runs every Sunday night. Monday morning she gets a clean reconciliation report waiting in her inbox — flagged anomalies highlighted, everything else confirmed.

That's not a technology story. That's an operations story. The technology is just the tool.

Your assessment suggests something similar might be sitting in your business. The specifics are different — yours might be in reporting, order processing, data entry, or customer communication — but the pattern is the same: a process that's been done manually for so long that nobody questions whether it has to be.

If you want to find yours, the scoping call is the right next step.

[Book a 30-minute scoping call → Calendly link]

Chris
chris@dragonscale.consulting

---

## EMAIL 3 — Sent 7 Days After Assessment Completion

**Subject:** Closing the loop on your assessment

Hi [First Name],

Last email from me on this — I don't believe in inbox flooding.

You took the DragonScale assessment a week ago. I followed up twice. If the timing isn't right or it's not a fit, no problem at all — I'd rather you come back when it makes sense than push something that doesn't.

But if you've been meaning to book the call and life got in the way — here it is one more time:

[Book a 30-minute scoping call → Calendly link]

What the call is: 30 minutes. I ask you about your operations, we identify your highest-value automation opportunity together, and I give you my honest read on whether a DragonScale engagement makes sense. Fixed-scope proposal within 24 hours if it does.

What the call isn't: a pitch, a demo, or an hour of my talking about AI trends.

One thing worth knowing: I'm in a founder pricing window right now — first three Build clients get significantly reduced rates. Two of those spots are still open. After they're filled, pricing moves to standard rates.

If that's relevant to your timing, now's a good moment.

[Book your scoping call → Calendly link]

Chris Takeuchi
Founder, DragonScale
chris@dragonscale.consulting

P.S. If you have a specific question before booking — just reply to this email. I read everything.

---

## SEQUENCE SETUP NOTES

**Platform options to run this:**
- ConvertKit (best for solo operators, $29/mo, clean deliverability)
- Instantly.ai (if you're doing cold outreach at volume later)
- Mailchimp (free tier, works fine for now)
- n8n + your own SMTP (most on-brand for DragonScale — automate your own automation business)

**Recommended n8n setup:**
Trigger: Airtable webhook when assessment is completed AND calendly_booked = false
Delay node: 24 hours → Email 1
Delay node: 72 hours → Check if booked → if not → Email 2
Delay node: 168 hours → Check if booked → if not → Email 3
If booked at any point: exit sequence, tag as "call booked"

**Personalization variables to pull from Airtable:**
- [First Name]
- [lowest scoring track] — pull from assessment score
- [Industry] — from assessment industry selector
- [Company size] — from assessment

**Industry-specific versions (optional — Phase 2):**
The story in Email 2 changes by industry:
- CPG/food & bev: inventory reconciliation story (above)
- Pharma/life sciences: batch documentation or vendor qualification story
- Professional services: proposal generation or client reporting story
- Manufacturing: production reporting or quality control story
- Generic: use the inventory story — it translates across industries

**A/B test these subject lines:**
Email 1:
- "Your DragonScale report — one thing I noticed" (current)
- "One thing your assessment revealed" 
- "[First Name] — quick note on your report"

Email 2:
- "The $47,000 process hiding in plain sight" (current)
- "A story about Monday mornings"
- "What 4 hours a week actually costs"

Email 3:
- "Closing the loop on your assessment" (current)
- "Last note from me"
- "Still open if the timing is right"

---

## WHAT HAPPENS AFTER THEY BOOK

Once they book the scoping call:
1. Automated confirmation email from Calendly (set this up in Calendly settings)
2. 24-hour reminder from Calendly
3. Send manually (or automate): "Looking forward to our call — to make the most of our 30 minutes, can you tell me in 2-3 sentences what's eating the most time in your operations right now?" This primes them and gives you intel before the call.
4. Run the scoping call script (dragonscale-scoping-call-script.md)
5. Send proposal within 24 hours

---

*DragonScale · Chris Takeuchi · chris@dragonscale.consulting · June 2026*
