import { useState, useEffect, useRef } from "react";

const TIERS = [
  {
    name: "Nexus Core",
    icon: "◈",
    tagline: "Your business, answerable for the first time.",
    bestFor: "Build graduates ready to put their automations under one intelligent roof.",
    monthlyPrice: "$1,997",
    annualPrice: "$1,831",
    accent: "#f97316",
    entry: "Requires Spark or Forge Build, or $2,500 onboarding fee",
    dataSources: "Up to 3",
    automations: "Up to 5 active",
    users: "1–2 users",
    interface: "Web app + optional Slack",
    support: "Email · 2 business day response",
    builds: "None included",
    strategy: "None included",
    highlights: [
      "Conversational AI connected to your data sources",
      "Ask questions, get answers about your business in real time",
      "Proactive alerts for anomalies and threshold breaches",
      "Up to 3 data source integrations (CRM, inventory, sales, etc.)",
      "Up to 5 automations running and monitored",
      "DragonScale web interface + optional Slack bot",
      "Monthly health digest — what ran, what flagged, what changed",
    ],
  },
  {
    name: "Nexus Pro",
    icon: "◈◈",
    tagline: "Your AI COO — asking, alerting, and acting across your operations.",
    bestFor: "Growing businesses ready to run a full function on AI.",
    monthlyPrice: "$3,997",
    annualPrice: "$3,664",
    accent: "#a855f7",
    entry: "Requires Forge or Ascend Build, or $3,500 onboarding fee",
    dataSources: "Up to 8",
    automations: "Up to 15 active",
    users: "Up to 5 users",
    interface: "Web app + Slack + Mobile PWA",
    support: "Priority email · Next business day",
    builds: "1 new automation/month",
    strategy: "Monthly 60-min strategy call",
    featured: true,
    highlights: [
      "Everything in Nexus Core",
      "Up to 8 data source integrations",
      "Up to 15 active automations — monitored and managed",
      "Action capability — Nexus can trigger workflows, update records, send alerts",
      "Custom dashboards built to your KPIs",
      "Up to 5 team members with role-based access",
      "1 new automation built every month",
      "Monthly 60-min strategy call with Chris",
      "Mobile PWA access — check your business from anywhere",
      "Quarterly ops review and roadmap session",
    ],
  },
  {
    name: "Nexus Enterprise",
    icon: "◈◈◈",
    tagline: "A fully intelligent operations layer across your entire business.",
    bestFor: "Mid-market companies replacing or augmenting an ops coordinator role.",
    monthlyPrice: "$7,500",
    annualPrice: "$6,875",
    accent: "#06b6d4",
    entry: "Requires Ascend Build, or $5,000 onboarding fee",
    dataSources: "Unlimited",
    automations: "Unlimited active",
    users: "Unlimited users",
    interface: "Web app + Slack + Mobile + Custom domain",
    support: "Dedicated Slack channel · Same-day response",
    builds: "Up to 3 new automations/month",
    strategy: "Bi-weekly strategy calls",
    highlights: [
      "Everything in Nexus Pro",
      "Unlimited data source integrations",
      "Unlimited active automations",
      "Unlimited team members",
      "Custom domain — nexus.yourcompany.com",
      "Up to 3 new automations built every month",
      "Bi-weekly strategy calls with Chris",
      "Dedicated Slack channel — same-day async responses",
      "Annual AI ops audit and full roadmap",
      "First access to new Nexus capabilities",
      "SLA: 99.5% uptime guarantee",
    ],
  },
];

const CAPABILITIES = [
  {
    icon: "💬",
    title: "Ask",
    desc: "Chat with your entire business. 'What were our top 3 fulfillment issues last week?' 'Which SKU is trending down?' 'What's our close rate this month vs. last?' Nexus knows the answer.",
    color: "#f97316",
  },
  {
    icon: "🔔",
    title: "Alert",
    desc: "Nexus watches your business while you sleep. Inventory below threshold, unusual churn signal, missed SLA — it flags what matters before you think to ask.",
    color: "#a855f7",
  },
  {
    icon: "⚡",
    title: "Act",
    desc: "Nexus doesn't just report — it executes. Trigger reorder workflows, update CRM records, send customer notifications, escalate issues. Your business runs itself.",
    color: "#06b6d4",
  },
  {
    icon: "📊",
    title: "Dashboard",
    desc: "Custom-built views of the metrics that matter to your business. Not a generic analytics tool — dashboards built around how you actually run your operation.",
    color: "#c8a96e",
  },
];

const INTEGRATIONS = [
  "Shopify", "QuickBooks", "HubSpot", "Salesforce", "Google Sheets",
  "Airtable", "Slack", "Gmail", "Notion", "Monday.com",
  "NetSuite", "Klaviyo", "Stripe", "WooCommerce", "Zendesk",
];

const JOURNEY = [
  { phase: "Day 1", title: "Onboarding call", desc: "90 minutes. We map your data sources, define your top 10 questions you want Nexus to answer, and set your first alert thresholds." },
  { phase: "Week 1", title: "Connections built", desc: "We connect your data sources, configure the AI, and set up your web interface. You get a staging environment to explore." },
  { phase: "Week 2", title: "First automations live", desc: "Your existing Build automations are connected to Nexus. Alerts are live. You ask your first real business questions." },
  { phase: "Month 1", title: "Dashboards delivered", desc: "Custom dashboards built around your KPIs. Your team gets access. The morning habit begins." },
  { phase: "Ongoing", title: "Compounding intelligence", desc: "Every month we add data sources, refine alerts, and build new automations. Nexus gets smarter as your business grows." },
];

export default function NexusPage() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(new Set());
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setVisible(p => new Set([...p, e.target.dataset.id]))),
      { threshold: 0.1 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reg = (id) => (el) => { refs.current[id] = el; if (el) el.dataset.id = id; };
  const vis = (id) => visible.has(id);

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#080810", color: "#f0ede8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dm { font-family: 'DM Sans', sans-serif; }
        .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}
        .btn-gold { display:inline-block;padding:15px 36px;background:#c8a96e;color:#080810;font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;letter-spacing:.04em;text-decoration:none;border:none;cursor:pointer;transition:all .2s; }
        .btn-gold:hover { background:#e0c080;transform:translateY(-2px);box-shadow:0 12px 40px rgba(200,169,110,.3); }
        .btn-outline { display:inline-block;padding:14px 35px;background:transparent;color:#c8a96e;font-family:'DM Sans',sans-serif;font-weight:500;font-size:15px;letter-spacing:.04em;text-decoration:none;border:1px solid rgba(200,169,110,.4);cursor:pointer;transition:all .2s; }
        .btn-outline:hover { background:rgba(200,169,110,.08);border-color:#c8a96e; }
        .card { background:rgba(255,255,255,.02);border:1px solid rgba(200,169,110,.1);transition:transform .3s,box-shadow .3s; }
        .card:hover { transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,.4); }
        .noise { position:fixed;inset:0;pointer-events:none;opacity:.02;z-index:999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .grid-bg { background-image:linear-gradient(rgba(200,169,110,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,.04) 1px,transparent 1px);background-size:48px 48px; }
        .tag { display:inline-block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px; }
        .toggle-btn { background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;padding:8px 20px;transition:all .2s; }
        .check { color:#c8a96e;margin-right:10px;flex-shrink:0; }
        .integration-pill { display:inline-block;padding:6px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(200,169,110,.1);font-family:'DM Sans',sans-serif;font-size:12px;color:#6b6458;margin:4px;transition:all .2s; }
        .integration-pill:hover { border-color:rgba(200,169,110,.3);color:#a09880; }
        .chat-bubble { padding:12px 16px;border-radius:0;margin-bottom:8px;font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.5;max-width:85%; }
        .bubble-user { background:rgba(200,169,110,.12);border:1px solid rgba(200,169,110,.2);color:#f0ede8;margin-left:auto; }
        .bubble-nexus { background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#a09880; }
        @keyframes pulse { 0%,100%{opacity:.4}50%{opacity:1} }
        .pulse { animation:pulse 2s infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        .float { animation:float 4s ease-in-out infinite; }
      `}</style>

      <div className="noise" />

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(8,8,16,.96)":"transparent",borderBottom:scrolled?"1px solid rgba(200,169,110,.1)":"none",backdropFilter:scrolled?"blur(16px)":"none",transition:"all .3s" }}>
        <a href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
          <svg viewBox="0 0 28 28" fill="none" style={{ width:28,height:28 }}>
            <path d="M14 2L24 7.5V20.5L14 26L4 20.5V7.5Z" stroke="#c8a96e" strokeWidth="1" fill="rgba(200,169,110,.05)" />
            <circle cx="14" cy="14" r="2.5" fill="#c8a96e" />
          </svg>
          <div>
            <span style={{ fontSize:15,fontWeight:800,color:"#f0ede8" }}>DragonScale</span>
            <span style={{ fontSize:15,fontWeight:300,color:"#c8a96e",marginLeft:6 }}>Nexus</span>
          </div>
        </a>
        <div style={{ display:"flex",gap:16,alignItems:"center" }}>
          <a href="#pricing" className="dm" style={{ fontSize:13,color:"#a09880",textDecoration:"none" }}>Pricing</a>
          <a href="#how-it-works" className="dm" style={{ fontSize:13,color:"#a09880",textDecoration:"none" }}>How It Works</a>
          <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ padding:"10px 22px",fontSize:13 }}>Book a Demo</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px 48px 80px",position:"relative",overflow:"hidden" }}>
        <div className="grid-bg" style={{ position:"absolute",inset:0,opacity:.6 }} />
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 60% at 50% 40%,rgba(168,85,247,.08) 0%,transparent 70%)" }} />

        {/* Floating chat preview */}
        <div className="float hide-sm" style={{ position:"absolute",right:"6%",top:"50%",transform:"translateY(-50%)",width:320,zIndex:2 }}>
          <div style={{ background:"rgba(8,8,16,.95)",border:"1px solid rgba(200,169,110,.2)",padding:24,boxShadow:"0 40px 80px rgba(0,0,0,.6)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:"#22c55e" }} className="pulse" />
              <span className="dm" style={{ fontSize:12,color:"#6b6458",letterSpacing:".08em",textTransform:"uppercase" }}>Nexus · Live</span>
            </div>
            <div className="chat-bubble bubble-user">What's our inventory status on SKU-2847?</div>
            <div className="chat-bubble bubble-nexus">
              <span style={{ color:"#c8a96e",fontWeight:600 }}>SKU-2847</span> is at <span style={{ color:"#f97316" }}>127 units</span> — 18% below your reorder threshold. Based on your 14-day velocity of 22 units/day, you have <span style={{ color:"#ef4444" }}>5.8 days</span> of stock remaining.<br /><br />
              <span style={{ color:"#22c55e" }}>✓ Reorder workflow triggered</span> — PO draft sent to your supplier contact.
            </div>
            <div className="chat-bubble bubble-user" style={{ marginTop:12 }}>Show me this week vs. last week revenue</div>
            <div style={{ background:"rgba(200,169,110,.06)",border:"1px solid rgba(200,169,110,.15)",padding:"12px 14px",marginTop:4 }}>
              <div className="dm" style={{ fontSize:11,color:"#6b6458",marginBottom:8,letterSpacing:".06em",textTransform:"uppercase" }}>Revenue · Week over Week</div>
              {[["This week","$48,320","+12.4%","#22c55e"],["Last week","$42,980","baseline","#6b6458"]].map(([label,val,change,color])=>(
                <div key={label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  <span className="dm" style={{ fontSize:12,color:"#a09880" }}>{label}</span>
                  <span className="dm" style={{ fontSize:13,fontWeight:600,color:"#f0ede8" }}>{val}</span>
                  <span className="dm" style={{ fontSize:11,color }}>{change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:680,position:"relative",zIndex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:32 }}>
            <a href="/" className="dm" style={{ fontSize:13,color:"#6b6458",textDecoration:"none" }}>DragonScale</a>
            <span style={{ color:"#6b6458" }}>→</span>
            <span className="dm" style={{ fontSize:13,color:"#c8a96e" }}>Nexus</span>
          </div>

          <div className="tag" style={{ background:"rgba(168,85,247,.1)",color:"#a855f7",border:"1px solid rgba(168,85,247,.3)",marginBottom:28 }}>
            Your AI COO · Available 24/7
          </div>

          <h1 style={{ fontSize:"clamp(38px,5.5vw,72px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-.02em",marginBottom:28 }}>
            Chat with your<br />
            entire business.<br />
            <span style={{ color:"#c8a96e",fontStyle:"italic" }}>In one interface.</span>
          </h1>

          <p className="dm" style={{ fontSize:18,color:"#a09880",lineHeight:1.75,maxWidth:520,marginBottom:16 }}>
            Nexus connects to every layer of your operation — your data, your automations, your communications — and gives you a single intelligent interface to ask, alert, and act.
          </p>
          <p className="dm" style={{ fontSize:14,color:"#6b6458",marginBottom:44,maxWidth:480 }}>
            Not a dashboard. Not a chatbot. An AI operations layer that knows your business as well as you do — and never sleeps.
          </p>

          <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
            <a href="https://calendly.com/chris-dragonscale" className="btn-gold">Book a Live Demo →</a>
            <a href="#pricing" className="btn-outline">See Pricing</a>
          </div>
          <div className="dm" style={{ marginTop:20,fontSize:13,color:"#6b6458" }}>
            Requires a DragonScale Build engagement or onboarding fee · Setup in 2 weeks
          </div>
        </div>
      </section>

      {/* ASK ALERT ACT DASHBOARD */}
      <section style={{ padding:"100px 48px",borderTop:"1px solid rgba(200,169,110,.1)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div ref={reg("cap-h")} className={`fade-up ${vis("cap-h")?"in":""}`} style={{ marginBottom:64,maxWidth:600 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>What Nexus Does</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Four capabilities.<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>One interface.</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:2 }}>
            {CAPABILITIES.map((c,i)=>(
              <div key={i} ref={reg(`cap-${i}`)} className={`fade-up ${vis(`cap-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.12}s`,padding:"40px 32px",background:"rgba(255,255,255,.02)",borderLeft:i===0?"none":"1px solid rgba(200,169,110,.06)" }}>
                <div style={{ fontSize:32,marginBottom:20 }}>{c.icon}</div>
                <div style={{ fontSize:22,fontWeight:700,marginBottom:12,color:c.color }}>{c.title}</div>
                <p className="dm" style={{ fontSize:14,color:"#6b6458",lineHeight:1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding:"100px 48px",background:"rgba(200,169,110,.02)",borderTop:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div ref={reg("jour-h")} className={`fade-up ${vis("jour-h")?"in":""}`} style={{ marginBottom:64 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>Getting Started</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Live in <span style={{ color:"#c8a96e",fontStyle:"italic" }}>two weeks.</span>
            </h2>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",left:16,top:0,bottom:0,width:1,background:"linear-gradient(to bottom,transparent,rgba(200,169,110,.3),transparent)" }} />
            {JOURNEY.map((j,i)=>(
              <div key={i} ref={reg(`jour-${i}`)} className={`fade-up ${vis(`jour-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.1}s`,display:"flex",gap:40,marginBottom:48,paddingLeft:48,position:"relative" }}>
                <div style={{ position:"absolute",left:8,top:6,width:17,height:17,borderRadius:"50%",background:"#080810",border:"1px solid #c8a96e",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:"#c8a96e" }} />
                </div>
                <div>
                  <div className="dm" style={{ fontSize:11,color:"#c8a96e",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6 }}>{j.phase}</div>
                  <div style={{ fontSize:18,fontWeight:700,marginBottom:8 }}>{j.title}</div>
                  <p className="dm" style={{ fontSize:14,color:"#6b6458",lineHeight:1.6,maxWidth:500 }}>{j.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section style={{ padding:"80px 48px",borderTop:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:900,margin:"0 auto",textAlign:"center" }}>
          <div ref={reg("int-h")} className={`fade-up ${vis("int-h")?"in":""}`}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>Integrations</div>
            <h2 style={{ fontSize:"clamp(24px,3vw,40px)",fontWeight:800,letterSpacing:"-.02em",marginBottom:12 }}>
              Connects to your <span style={{ color:"#c8a96e",fontStyle:"italic" }}>existing stack.</span>
            </h2>
            <p className="dm" style={{ fontSize:15,color:"#6b6458",marginBottom:40 }}>No ripping and replacing. Nexus reads what you already use.</p>
            <div>
              {INTEGRATIONS.map(name=>(
                <span key={name} className="integration-pill">{name}</span>
              ))}
              <span className="integration-pill" style={{ color:"#c8a96e",borderColor:"rgba(200,169,110,.2)" }}>+ your custom sources</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding:"100px 48px",borderTop:"1px solid rgba(200,169,110,.1)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div ref={reg("price-h")} className={`fade-up ${vis("price-h")?"in":""}`} style={{ marginBottom:20 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>Pricing</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Three tiers.<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>One platform.</span>
            </h2>
          </div>

          {/* Billing toggle */}
          <div ref={reg("toggle")} className={`fade-up d1 ${vis("toggle")?"in":""}`} style={{ display:"flex",alignItems:"center",gap:0,marginBottom:56,background:"rgba(255,255,255,.03)",border:"1px solid rgba(200,169,110,.1)",width:"fit-content",padding:4 }}>
            <button className="toggle-btn dm" onClick={()=>setBillingAnnual(false)} style={{ color:!billingAnnual?"#f0ede8":"#6b6458",background:!billingAnnual?"rgba(200,169,110,.12)":"transparent",fontWeight:!billingAnnual?600:400 }}>Monthly</button>
            <button className="toggle-btn dm" onClick={()=>setBillingAnnual(true)} style={{ color:billingAnnual?"#f0ede8":"#6b6458",background:billingAnnual?"rgba(200,169,110,.12)":"transparent",fontWeight:billingAnnual?600:400 }}>
              Annual <span style={{ fontSize:11,color:"#22c55e",marginLeft:4 }}>Save 8%</span>
            </button>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:24 }}>
            {TIERS.map((t,i)=>(
              <div key={i} ref={reg(`tier-${i}`)} className={`card fade-up ${vis(`tier-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.15}s`,padding:"40px 36px",position:"relative",display:"flex",flexDirection:"column",borderColor:t.featured?"rgba(168,85,247,.3)":"rgba(200,169,110,.1)",background:t.featured?"rgba(168,85,247,.03)":"rgba(255,255,255,.02)" }}>
                {t.featured&&<div style={{ position:"absolute",top:-1,left:0,right:0,height:2,background:"linear-gradient(to right,transparent,#a855f7,transparent)" }} />}
                {t.featured&&<div style={{ position:"absolute",top:16,right:16 }}><div className="tag" style={{ background:"rgba(168,85,247,.15)",color:"#a855f7",border:"1px solid rgba(168,85,247,.3)",fontSize:10 }}>Most Popular</div></div>}

                <div style={{ fontSize:20,color:t.accent,fontFamily:"monospace",letterSpacing:"-.05em",marginBottom:16 }}>{t.icon}</div>
                <div className="dm" style={{ fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:t.accent,marginBottom:8 }}>DragonScale</div>
                <h3 style={{ fontSize:26,fontWeight:800,marginBottom:8,letterSpacing:"-.01em" }}>{t.name}</h3>
                <p style={{ fontSize:13,fontStyle:"italic",color:"#a09880",marginBottom:24,lineHeight:1.5 }}>{t.tagline}</p>

                <div style={{ marginBottom:28,padding:"20px 0",borderTop:"1px solid rgba(200,169,110,.1)",borderBottom:"1px solid rgba(200,169,110,.1)" }}>
                  <div style={{ fontSize:42,fontWeight:800,color:"#c8a96e",letterSpacing:"-.02em",lineHeight:1 }}>
                    {billingAnnual?t.annualPrice:t.monthlyPrice}
                  </div>
                  <div className="dm" style={{ fontSize:12,color:"#6b6458",marginTop:6 }}>
                    per month{billingAnnual?" · billed annually":""} · {t.users}
                  </div>
                </div>

                {/* Specs */}
                <div style={{ marginBottom:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  {[["Data Sources",t.dataSources],["Automations",t.automations],["New Builds/mo",t.builds],["Strategy",t.strategy]].map(([label,val])=>(
                    <div key={label} style={{ padding:"10px 12px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(200,169,110,.06)" }}>
                      <div className="dm" style={{ fontSize:10,color:"#6b6458",letterSpacing:".08em",textTransform:"uppercase",marginBottom:4 }}>{label}</div>
                      <div className="dm" style={{ fontSize:12,color:val==="None included"?"#4a4440":"#a09880",fontStyle:val==="None included"?"italic":"normal" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div style={{ flex:1,marginBottom:28 }}>
                  {t.highlights.map((h,j)=>(
                    <div key={j} className="dm" style={{ display:"flex",gap:8,marginBottom:8,fontSize:13,color:"#a09880",lineHeight:1.5 }}>
                      <span className="check">✓</span>{h}
                    </div>
                  ))}
                </div>

                <div className="dm" style={{ fontSize:11,color:"#4a4440",marginBottom:20,padding:"10px 12px",background:"rgba(255,255,255,.02)",border:"1px solid rgba(200,169,110,.06)",lineHeight:1.5 }}>
                  🔑 Entry: {t.entry}
                </div>

                <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ textAlign:"center",background:t.featured?"#a855f7":"#c8a96e",color:t.featured?"#fff":"#080810" }}>
                  Book a Demo →
                </a>
              </div>
            ))}
          </div>

          {/* Annual note */}
          <div ref={reg("annual")} className={`fade-up ${vis("annual")?"in":""}`} style={{ marginTop:40,padding:"24px 32px",background:"rgba(34,197,94,.04)",border:"1px solid rgba(34,197,94,.2)",display:"flex",gap:20,alignItems:"center",flexWrap:"wrap" }}>
            <div style={{ fontSize:20 }}>💡</div>
            <div>
              <div className="dm" style={{ fontSize:14,fontWeight:600,color:"#22c55e",marginBottom:4 }}>Annual plans save you one month per year</div>
              <p className="dm" style={{ fontSize:13,color:"#6b6458",lineHeight:1.6 }}>Pay annually and get 8.3% off — equivalent to one free month. Nexus Pro annual is $43,967 upfront vs. $47,964 monthly. Price locked for 12 months with 60-day notice on any future increase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"100px 48px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 70% at 50% 50%,rgba(168,85,247,.07) 0%,transparent 70%)" }} />
        <div className="grid-bg" style={{ position:"absolute",inset:0,opacity:.4 }} />

        <div ref={reg("cta")} className={`fade-up ${vis("cta")?"in":""}`} style={{ maxWidth:640,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ width:1,height:56,background:"linear-gradient(to bottom,transparent,#a855f7)",margin:"0 auto 40px" }} />
          <h2 style={{ fontSize:"clamp(28px,4vw,52px)",fontWeight:800,letterSpacing:"-.02em",marginBottom:20,lineHeight:1.1 }}>
            See Nexus running<br />
            <span style={{ color:"#c8a96e",fontStyle:"italic" }}>on your actual business.</span>
          </h2>
          <p className="dm" style={{ fontSize:16,color:"#a09880",lineHeight:1.7,marginBottom:40,maxWidth:480,margin:"0 auto 40px" }}>
            Book a 30-minute live demo. We'll connect a sample of your data and show you exactly what Nexus sees — before you sign anything.
          </p>
          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
            <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ fontSize:16,padding:"16px 40px" }}>Book Live Demo →</a>
            <a href="https://ai-assessment-lake.vercel.app" className="btn-outline" style={{ fontSize:16,padding:"16px 40px" }}>Start with Assessment</a>
          </div>
          <div className="dm" style={{ marginTop:20,fontSize:12,color:"#4a4440" }}>Chris Takeuchi · DragonScale · chris@dragonscale.ai</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(200,169,110,.1)",padding:"32px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
        <div className="dm" style={{ fontSize:13,fontWeight:700,color:"#f0ede8" }}>DragonScale <span style={{ color:"#a855f7" }}>Nexus</span></div>
        <div className="dm" style={{ fontSize:12,color:"#6b6458" }}>© 2026 DragonScale · Chris Takeuchi</div>
        <div style={{ display:"flex",gap:24 }}>
          {["Assess","Build","Shield","Nexus"].map(l=>(
            <a key={l} href="#" className="dm" style={{ fontSize:12,color:"#6b6458",textDecoration:"none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
