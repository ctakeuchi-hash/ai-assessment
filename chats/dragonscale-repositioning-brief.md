# DragonScale — Strategic Repositioning Brief
### Chris Takeuchi · June 2026 · Confidential

---

## What Changed and Why This Document Exists

Two findings in a single session rewrote the competitive landscape for DragonScale:

1. **White-label research** revealed that white-labeling Viktor, Cyndra, or any AI platform is the wrong move — strategically fragile, margin-compressing, and unnecessary given the stack already in hand.

2. **Anthropic's Claude for Small Business launch** (May 13, 2026) created the largest market education event in SMB AI history — and explicitly pointed businesses at outside consultants to go deeper. That outside consultant is DragonScale.

This document captures what changed, what stayed the same, and how the business is now positioned to win.

---

## What We Learned from the White-Label Research

### The Platforms We Evaluated

| Platform | What It Is | White-Label? | Verdict |
|---|---|---|---|
| Viktor | AI employee in Slack/Teams · $50/mo · $75M Series A | ❌ No program | Don't use |
| Cyndra | Managed AI employee service · $500-2K/mo | ✅ But they're a direct competitor | Don't use |
| GoHighLevel | Agency platform · $97/mo | ✅ Built for marketing agencies | Wrong vertical |
| Lindy | No-code agent builder · $49-299/mo | ❌ Not white-label | Useful tool, not a platform |
| Composio | MCP integration layer · developer tool | N/A — it's infrastructure | ✅ USE THIS |

### The Core Finding

Every white-label platform creates a dependency that becomes someone else's leverage over your business. Viktor can raise prices. Cyndra can go direct to your clients. GoHighLevel is built for marketing agencies, not operations consultants.

More importantly: **the stack you already have is better for your specific use case than any of these platforms.**

### The Right Stack — Own It, Don't Rent It

```
Claude API          — AI reasoning layer (Anthropic, best-in-class)
n8n (self-hosted)   — Workflow automation (zero per-client cost)
Composio MCP        — 800+ pre-built connectors (OAuth handled automatically)
Next.js             — Custom branded interface (you already build these)
MCP n8n server      — Claude talks directly to n8n workflows
```

**Composio is the unlock.** Without it, connecting a client's HubSpot + QuickBooks + Shopify takes 2-3 weeks of integration work. With Composio's MCP layer, it takes 2 hours. That's the difference between a 6-week Nexus onboarding and a 2-week one.

### What This Means for Nexus

Nexus is a **proprietary DragonScale platform** — not a white-labeled product. Clients pay DragonScale. They see DragonScale branding. The underlying stack is Claude + n8n + Composio + Next.js, but that's infrastructure, not the product.

**The product is Chris Takeuchi's 10 years of operational knowledge encoded into:**
- System prompts tuned for CPG, pharma, and food & bev operations
- n8n workflows built around real enterprise process patterns
- Composio connectors configured for the tools these businesses actually use
- Dashboards built around KPIs that matter in these industries

That cannot be white-labeled, cloned in 48 hours, or replicated by a $50/month self-serve tool.

---

## What We Learned from Claude for Small Business

### What Anthropic Shipped

On May 13, 2026, Anthropic launched Claude for Small Business — a package of 15 pre-built skills and connectors for QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace, and Microsoft 365, delivered as a toggle inside Claude Cowork.

They backed it with a 10-city training tour, a PayPal partnership, nonprofit funding, and a solopreneurship accelerator. It is the largest coordinated SMB AI education effort any AI company has ever run.

### The Two-Sided Impact

**The threat (small):**
The 15 generic skills commoditize the simplest automations — basic QuickBooks connections, generic HubSpot workflows, standard document signing. True small businesses (under $5M) who just need one simple thing can now get it free.

This affects the very bottom of the Spark tier. It does not affect Forge, Ascend, Nexus, or any client in the $5M-$20M target range.

**The opportunity (enormous):**
Anthropic just spent millions of dollars teaching every SMB owner in America three things:
1. AI automation is real and works
2. It can connect to the tools they already use
3. Custom workflows require an outside consultant

That third point is Anthropic's own words. They built the awareness, the credibility, and the appetite — then pointed businesses at the partner ecosystem to go deeper.

**DragonScale is that partner.**

### The Skill Marketplace — The Biggest Long-Term Opportunity

Anthropic has signaled a third-party skill marketplace for H2 2026. This means DragonScale can build industry-specific skills — CPG demand planning, food & bev inventory management, pharma compliance documentation — and sell them through Anthropic's own distribution channel.

Built once. Sold to every small business using Claude for Small Business in those verticals. That's productized IP at scale, with Anthropic's brand behind it.

---

## The Repositioning — Before and After

### Before

| | Old Position |
|---|---|
| **Who we are** | An AI consulting firm that builds automations |
| **What we sell** | Custom AI automation for SMBs |
| **Why us** | We build solutions, not just recommendations |
| **vs. Viktor/AI tools** | We're more customized |
| **vs. Claude for Small Business** | Didn't exist yet |
| **Entry point** | $6,500 Spark Build |
| **Top of funnel** | Free assessment |

### After

| | New Position |
|---|---|
| **Who we are** | The operations expert who makes AI work specifically for your business |
| **What we sell** | The custom layer on top of AI tools you already trust |
| **Why us** | 10 years of enterprise ops knowledge + we build it ourselves |
| **vs. Viktor/AI tools** | We configure for your specific operations; they're generic |
| **vs. Claude for Small Business** | That's where you start. We're where you go next. |
| **Entry point** | $2,500 Pilot Build ("Beyond the 15 Skills") |
| **Top of funnel** | Free assessment + Claude for Small Business graduates |

---

## The New Positioning Statement

**For $5M-$20M businesses in CPG, food & bev, and pharma who have discovered AI tools but need them to actually fit their operations:**

> DragonScale builds the custom AI layer that generic tools can't. We take Claude's intelligence, connect it to your specific data, train it on your specific processes, and build automations around how your business actually runs — not how Anthropic thinks every small business runs.
>
> Claude for Small Business shows you what's possible. DragonScale builds what's specific to you.

---

## The New Funnel — How Claude for Small Business Feeds DragonScale

```
AWARENESS (Anthropic does this for us)
Claude for Small Business
15 generic skills · Free · Toggle-on
Business owner learns AI works, hits the wall
                    ↓
DIAGNOSIS (DragonScale)
DragonScale Assess — Free · 8 minutes
"Find what the generic skills are missing
 in your specific business"
New assessment question: "Have you tried
Claude for Small Business? What worked?
What didn't?"
Report leads with the custom gap analysis.
                    ↓
ENTRY BUILD (new tier)
DragonScale Pilot — $2,500 · 1 week
"Beyond the 15 Skills"
Fix the #1 gap that generic tools left open.
Lowest friction. Highest intent clients.
                    ↓
FULL BUILD
Spark   $6,500   ($3,500 founder)
Forge   $16,500  ($8,500 founder)
Ascend  $27,500  ($16,500 founder)
                    ↓
MAINTENANCE
Shield   $497/mo
Shield+  $997/mo
                    ↓
INTELLIGENT OPERATIONS PLATFORM
Nexus Core       $1,997/mo
Nexus Pro        $3,997/mo
Nexus Enterprise $7,500/mo
```

---

## Updated Pricing Architecture — Full Rationale

### What Changed and Why

| Tier | Old Price | New Price | Reason |
|---|---|---|---|
| Pilot | Didn't exist | $2,500 | Captures Claude for Small Business graduates |
| Spark | $6,500 | $6,500 | Hold — reposition, don't discount |
| Forge | $14,500 | $16,500 | Raise — untouched by competition, expertise premium justified |
| Ascend | $24,500 | $27,500 | Raise — same rationale, full function transformation |
| Shield | $497 | $497 | Hold — unaffected |
| Shield+ | $997 | $997 | Hold — unaffected |
| Nexus Core | $1,997 | $1,997 | Hold — reposition above free Claude tools |
| Nexus Pro | $3,997 | $3,997 | Hold — untouched |
| Nexus Enterprise | $7,500 | $7,500 | Hold — untouched |

### Founder Rates (first 3 clients per tier)

| Tier | Founder Rate | Standard Rate |
|---|---|---|
| Pilot | $1,500 | $2,500 |
| Spark | $3,500 | $6,500 |
| Forge | $8,500 | $16,500 |
| Ascend | $16,500 | $27,500 |

---

## The Competitive Position — One Clear Map

```
FREE TIER (Anthropic)
Claude for Small Business
· 15 generic skills
· 7 pre-connected tools
· Works for true SMBs under $5M
· Hits walls fast for complex businesses
                ↓ graduates become DragonScale leads

CONFIGURED LAYER (Viktor, Cyndra, Lindy)
· Self-serve or white-glove generic AI employees
· No ops domain expertise
· No industry-specific knowledge
· Compete on features and price
                ↓ DragonScale wins on expertise, not features

DRAGONSCALE — THE EXPERT LAYER
· 10 years CPG/pharma/food & bev ops knowledge
· Custom-built for each client's specific processes
· Powered by Claude + n8n + Composio on owned infra
· Assess → Build → Shield → Nexus journey
· Skill marketplace play in H2 2026
                ↓ leads to

NEXUS — THE INTELLIGENT OPERATIONS PLATFORM
· Everything connected, everything intelligent
· Asks, alerts, acts across the entire business
· The destination every Build client is heading toward
```

---

## The Three Immediate Actions

### Action 1 — Update the Landing Page (This Week)
Add one line above the CTA:

> *"Claude for Small Business shows you what's possible. We build what's specific to you."*

Add a new assessment question: *"Have you tried Claude for Small Business?"*
If yes: their report leads with a custom gap analysis of what generic skills missed.

### Action 2 — Add the Pilot Tier (This Week)
$2,500 · 1 week · "Beyond the 15 Skills"
This is your new top-of-funnel conversion product. Low risk for the client. High signal for you — anyone who's already tried the free tools and is still looking is a serious buyer.

### Action 3 — Contact Anthropic Partnerships (This Month)
Anthropic explicitly needs implementation partners to make Claude for Small Business work for complex businesses. You are the ideal partner — operations expertise, Claude-native stack, SMB focus.

Draft outreach positions DragonScale as:
- A specialized implementation partner for $5M-$20M operations-heavy SMBs
- A potential skill developer for the upcoming marketplace
- A referral partner for businesses that graduate beyond the 15 generic skills

Getting on Anthropic's partner registry before the marketplace launches H2 2026 is worth more than any paid marketing channel.

---

## What Didn't Change

- **The brand:** DragonScale. The koi-to-dragon transformation story. English-first.
- **The product names:** Assess, Build, Shield, Nexus.
- **The core moat:** Chris Takeuchi's 10 years of enterprise ops experience across CPG, pharma, and food & bev. This cannot be replicated by any platform.
- **The tech stack:** Claude API + n8n + Next.js + Composio MCP. Own it, don't rent it.
- **The client profile:** $5M-$20M companies in operations-heavy industries. Too complex for generic tools. Too small for enterprise consulting firms.
- **The philosophy:** You build things. Shield pays for the person who watches them. Nexus pays for the person who runs them. You keep building.

---

## The One-Paragraph Summary

Anthropic just spent millions of dollars educating your exact target market about AI — and then told them they need an outside consultant to go deeper. White-labeling Viktor or Cyndra would have made DragonScale a reseller of someone else's platform with someone else's margin and someone else's leverage over your business. Instead, DragonScale owns its stack (Claude + n8n + Composio + Next.js), owns its brand, and owns the expertise layer that no platform can replicate. The new Pilot tier at $2,500 captures the newly educated graduates of Claude for Small Business. Forge and Ascend are repriced to reflect the expertise premium the market now understands. And the Anthropic skill marketplace in H2 2026 is the productized IP play that turns DragonScale from a services business into a platform business — built once, sold thousands of times, with Anthropic's distribution behind it.

---

*DragonScale · Chris Takeuchi · chris@dragonscale.ai · June 2026*
