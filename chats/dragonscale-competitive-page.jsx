import { useState, useEffect, useRef } from "react";

const COMPETITORS = [
  {
    name: "McKinsey / BCG / Deloitte",
    type: "Enterprise Consulting",
    verticalDepth: true,
    builds: false,
    smbPricing: false,
    opsExpertise: true,
    minEngagement: "$250,000+",
    timeToValue: "6–18 months",
    whoTheyServe: "Fortune 500 CPG companies",
    gap: "They write the strategy deck. You implement it yourself. Starting at $250K.",
    accent: "#6b6458",
  },
  {
    name: "SymphonyAI / Aera Technology",
    type: "Enterprise AI Platform",
    verticalDepth: true,
    builds: true,
    smbPricing: false,
    opsExpertise: true,
    minEngagement: "$100,000+",
    timeToValue: "12+ months",
    whoTheyServe: "Hershey, Mars, Kraft — $1B+ companies",
    gap: "Purpose-built for the Fortune 500 manufacturing floor. Not for a $15M distributor.",
    accent: "#6b6458",
  },
  {
    name: "Cyndra / Generic AI Agencies",
    type: "Managed AI Service",
    verticalDepth: false,
    builds: true,
    smbPricing: true,
    opsExpertise: false,
    minEngagement: "$2,000–$10,000 setup",
    timeToValue: "4–8 weeks",
    whoTheyServe: "Any business, any industry",
    gap: "They build AI employees. Not AI that understands demand planning, distributor relationships, or margin thresholds.",
    accent: "#6b6458",
  },
  {
    name: "bushe.co / Generalist Boutiques",
    type: "Solo AI Consultant",
    verticalDepth: false,
    builds: true,
    smbPricing: true,
    opsExpertise: false,
    minEngagement: "$5,000–$15,000",
    timeToValue: "2–4 weeks",
    whoTheyServe: "Any SMB, primarily local market",
    gap: "They ship fast. They don't know what a reorder point is, what S&OP means, or why your distributor relationship changes your inventory logic.",
    accent: "#6b6458",
  },
  {
    name: "Jampack AI",
    type: "CPG SaaS Platform",
    verticalDepth: true,
    builds: true,
    smbPricing: true,
    opsExpertise: true,
    minEngagement: "SaaS subscription",
    timeToValue: "Days (SaaS)",
    whoTheyServe: "CPG brands in wholesale distribution",
    gap: "One use case: wholesale order automation. No surrounding intelligence layer, no cross-function ops, no custom builds.",
    accent: "#f97316",
    partner: true,
  },
  {
    name: "DragonScale",
    type: "Specialist Ops + AI",
    verticalDepth: true,
    builds: true,
    smbPricing: true,
    opsExpertise: true,
    minEngagement: "$2,500 Pilot",
    timeToValue: "1–4 weeks",
    whoTheyServe: "$5M–$20M CPG, pharma, food & bev",
    gap: null,
    accent: "#c8a96e",
    isUs: true,
  },
];

const MATRIX_COLS = [
  { key: "verticalDepth", label: "CPG/Pharma/F&B Depth" },
  { key: "builds", label: "Actually Builds" },
  { key: "smbPricing", label: "SMB Pricing" },
  { key: "opsExpertise", label: "Ops Domain Expertise" },
];

const STATS = [
  { value: "0", label: "Other firms combining all four criteria" },
  { value: "10+", label: "Years inside Fortune 500 CPG ops" },
  { value: "$250K+", label: "What McKinsey charges for the same vertical knowledge" },
  { value: "2 wks", label: "Average DragonScale time to first live automation" },
];

const GAPS = [
  {
    icon: "🏭",
    title: "The Enterprise Gap",
    desc: "SymphonyAI, Aera, Palantir — the best AI tools for CPG and food & bev operations are built for companies with dedicated AI teams, $50M+ tech budgets, and 18-month implementation timelines. A $15M food & bev distributor cannot buy what Hershey buys.",
    solution: "DragonScale brings enterprise ops intelligence to companies a fraction of that size — at prices that make sense.",
  },
  {
    icon: "📋",
    title: "The Strategy Deck Gap",
    desc: "McKinsey's 2026 CPG report tells companies to harness AI for demand forecasting, dynamic pricing, and trade promotion optimization. The same report quietly notes that most companies don't have the data foundation to do any of it. McKinsey doesn't build the foundation. They write the next deck.",
    solution: "DragonScale builds the foundation. We implement, not advise.",
  },
  {
    icon: "🤖",
    title: "The Generic AI Gap",
    desc: "Generic AI agencies and managed AI employee platforms build automations for any business. They don't know what a deduction management workflow looks like. They don't know why your supplier lead time changes your reorder logic. They build generic solutions for generic problems.",
    solution: "DragonScale builds for how your specific operation actually runs.",
  },
];

export default function CompetitivePage() {
  const [activeComp, setActiveComp] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(new Set());
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setVisible(p => new Set([...p, e.target.dataset.id]))),
      { threshold: 0.1 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reg = id => el => { refs.current[id] = el; if (el) el.dataset.id = id; };
  const vis = id => visible.has(id);

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#080810", color: "#f0ede8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dm { font-family: 'DM Sans', sans-serif; }
        .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}
        .btn-gold { display:inline-block;padding:15px 36px;background:#c8a96e;color:#080810;font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;letter-spacing:.04em;text-decoration:none;border:none;cursor:pointer;transition:all .2s; }
        .btn-gold:hover { background:#e0c080;transform:translateY(-2px);box-shadow:0 12px 40px rgba(200,169,110,.3); }
        .btn-outline { display:inline-block;padding:14px 35px;background:transparent;color:#c8a96e;font-family:'DM Sans',sans-serif;font-weight:500;font-size:15px;letter-spacing:.04em;text-decoration:none;border:1px solid rgba(200,169,110,.4);cursor:pointer;transition:all .2s; }
        .btn-outline:hover { background:rgba(200,169,110,.08); }
        .noise { position:fixed;inset:0;pointer-events:none;opacity:.02;z-index:999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .grid-bg { background-image:linear-gradient(rgba(200,169,110,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,.04) 1px,transparent 1px);background-size:48px 48px; }
        .tag { display:inline-block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px; }
        .comp-row { transition: background 0.2s; cursor: pointer; }
        .comp-row:hover { background: rgba(200,169,110,.04); }
        .check { color: #22c55e; } .cross { color: #ef4444; }
        .matrix-cell { padding: 16px 20px; border-bottom: 1px solid rgba(200,169,110,.06); border-right: 1px solid rgba(200,169,110,.06); text-align: center; font-family: 'DM Sans', sans-serif; font-size: 18px; }
        .matrix-head { padding: 12px 20px; border-bottom: 1px solid rgba(200,169,110,.1); border-right: 1px solid rgba(200,169,110,.06); font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #6b6458; text-align: center; }
        .matrix-name { padding: 16px 20px; border-bottom: 1px solid rgba(200,169,110,.06); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; }
      `}</style>

      <div className="noise" />

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(8,8,16,.96)":"transparent",borderBottom:scrolled?"1px solid rgba(200,169,110,.1)":"none",backdropFilter:scrolled?"blur(16px)":"none",transition:"all .3s" }}>
        <a href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
          <svg viewBox="0 0 28 28" fill="none" style={{ width:28,height:28 }}>
            <path d="M14 2L24 7.5V20.5L14 26L4 20.5V7.5Z" stroke="#c8a96e" strokeWidth="1" fill="rgba(200,169,110,.05)" />
            <circle cx="14" cy="14" r="2.5" fill="#c8a96e" />
          </svg>
          <span style={{ fontSize:15,fontWeight:800,color:"#f0ede8" }}>DragonScale</span>
        </a>
        <div style={{ display:"flex",gap:16,alignItems:"center" }}>
          <a href="https://ai-assessment-lake.vercel.app" className="dm" style={{ fontSize:13,color:"#a09880",textDecoration:"none" }}>Free Assessment</a>
          <a href="https://calendly.com/chris-takeuchi" className="btn-gold" style={{ padding:"10px 22px",fontSize:13 }}>Book a Call</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"70vh",display:"flex",alignItems:"center",padding:"140px 48px 80px",position:"relative",overflow:"hidden" }}>
        <div className="grid-bg" style={{ position:"absolute",inset:0,opacity:.5 }} />
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 60% at 40% 50%,rgba(200,169,110,.06) 0%,transparent 70%)" }} />

        <div style={{ maxWidth:800,position:"relative",zIndex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:32 }}>
            <a href="/" className="dm" style={{ fontSize:13,color:"#6b6458",textDecoration:"none" }}>DragonScale</a>
            <span style={{ color:"#6b6458" }}>→</span>
            <span className="dm" style={{ fontSize:13,color:"#c8a96e" }}>Why DragonScale</span>
          </div>

          <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:28 }}>
            Competitive Landscape · June 2026
          </div>

          <h1 style={{ fontSize:"clamp(36px,5vw,68px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-.02em",marginBottom:28 }}>
            Every AI firm serving<br />
            CPG and food & bev<br />
            <span style={{ color:"#c8a96e",fontStyle:"italic" }}>has a gap.<br />We fill it.</span>
          </h1>

          <p className="dm" style={{ fontSize:18,color:"#a09880",lineHeight:1.75,maxWidth:620,marginBottom:16 }}>
            The enterprise firms have the vertical knowledge but charge $250K minimum. The generic agencies have the price point but none of the operational depth. Nobody else sits at the intersection of both — for companies your size.
          </p>
          <p className="dm" style={{ fontSize:14,color:"#6b6458",marginBottom:44 }}>
            This page documents the competitive landscape honestly. Make your own call.
          </p>

          <a href="#matrix" className="btn-gold">See the Full Comparison →</a>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:"48px",borderTop:"1px solid rgba(200,169,110,.1)",borderBottom:"1px solid rgba(200,169,110,.1)",background:"rgba(200,169,110,.03)" }}>
        <div style={{ maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:32 }}>
          {STATS.map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:32,fontWeight:800,color:"#c8a96e",letterSpacing:"-.02em",lineHeight:1,marginBottom:8 }}>{s.value}</div>
              <div className="dm" style={{ fontSize:12,color:"#6b6458",letterSpacing:".06em",textTransform:"uppercase",lineHeight:1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE THREE GAPS */}
      <section style={{ padding:"100px 48px",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div ref={reg("gaps-h")} className={`fade-up ${vis("gaps-h")?"in":""}`} style={{ marginBottom:64 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>The Market Gap</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Three gaps nobody<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>else is filling.</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:2 }}>
            {GAPS.map((g,i) => (
              <div key={i} ref={reg(`gap-${i}`)} className={`fade-up ${vis(`gap-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.12}s`,padding:"40px 36px",background:"rgba(255,255,255,.02)",borderLeft:i===0?"none":"1px solid rgba(200,169,110,.06)" }}>
                <div style={{ fontSize:36,marginBottom:20 }}>{g.icon}</div>
                <h3 style={{ fontSize:20,fontWeight:700,marginBottom:16,letterSpacing:"-.01em" }}>{g.title}</h3>
                <p className="dm" style={{ fontSize:14,color:"#6b6458",lineHeight:1.75,marginBottom:20 }}>{g.desc}</p>
                <div style={{ padding:"14px 16px",borderLeft:"2px solid #c8a96e",background:"rgba(200,169,110,.04)" }}>
                  <p className="dm" style={{ fontSize:13,color:"#c8a96e",lineHeight:1.6 }}>{g.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON MATRIX */}
      <section id="matrix" style={{ padding:"100px 48px",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div ref={reg("matrix-h")} className={`fade-up ${vis("matrix-h")?"in":""}`} style={{ marginBottom:56 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>The Comparison</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              How we stack up.<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>Honestly.</span>
            </h2>
            <p className="dm" style={{ fontSize:15,color:"#6b6458",marginTop:16,maxWidth:500 }}>
              Click any row to see the full picture on each competitor — their strengths, their gaps, and who they're actually built for.
            </p>
          </div>

          {/* Matrix table */}
          <div ref={reg("matrix-t")} className={`fade-up ${vis("matrix-t")?"in":""}`} style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",border:"1px solid rgba(200,169,110,.1)" }}>
              <thead>
                <tr style={{ background:"rgba(255,255,255,.02)" }}>
                  <th className="matrix-head" style={{ textAlign:"left",width:220 }}>Firm</th>
                  {MATRIX_COLS.map(c => <th key={c.key} className="matrix-head">{c.label}</th>)}
                  <th className="matrix-head">Min. Engagement</th>
                  <th className="matrix-head">Time to Value</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c, i) => (
                  <>
                    <tr key={i} className="comp-row" onClick={() => setActiveComp(activeComp === i ? null : i)}
                      style={{ background: c.isUs ? "rgba(200,169,110,.06)" : activeComp === i ? "rgba(255,255,255,.03)" : "transparent", borderLeft: c.isUs ? "2px solid #c8a96e" : c.partner ? "2px solid #f97316" : "none" }}>
                      <td className="matrix-name">
                        <div style={{ fontWeight: c.isUs ? 700 : 500, color: c.isUs ? "#c8a96e" : c.partner ? "#f97316" : "#f0ede8" }}>{c.name}</div>
                        <div className="dm" style={{ fontSize:11,color:"#6b6458",marginTop:3 }}>
                          {c.partner ? "⚡ Potential Partner" : c.type}
                        </div>
                      </td>
                      {MATRIX_COLS.map(col => (
                        <td key={col.key} className="matrix-cell">
                          {c[col.key] ? <span className="check">✓</span> : <span className="cross">✗</span>}
                        </td>
                      ))}
                      <td className="matrix-cell">
                        <span className="dm" style={{ fontSize:12,color: c.isUs ? "#c8a96e" : "#a09880" }}>{c.minEngagement}</span>
                      </td>
                      <td className="matrix-cell">
                        <span className="dm" style={{ fontSize:12,color: c.isUs ? "#c8a96e" : "#a09880" }}>{c.timeToValue}</span>
                      </td>
                    </tr>
                    {activeComp === i && !c.isUs && (
                      <tr key={`detail-${i}`}>
                        <td colSpan={7} style={{ padding:"24px 28px",background:"rgba(255,255,255,.02)",borderBottom:"1px solid rgba(200,169,110,.1)" }}>
                          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,flexWrap:"wrap" }}>
                            <div>
                              <div className="dm" style={{ fontSize:11,color:"#6b6458",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8 }}>Who they serve</div>
                              <p className="dm" style={{ fontSize:14,color:"#a09880",lineHeight:1.6 }}>{c.whoTheyServe}</p>
                            </div>
                            <div>
                              <div className="dm" style={{ fontSize:11,color: c.partner ? "#f97316" : "#ef4444",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8 }}>
                                {c.partner ? "The opportunity" : "The gap"}
                              </div>
                              <p className="dm" style={{ fontSize:14,color:"#a09880",lineHeight:1.6 }}>{c.gap}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <p className="dm" style={{ fontSize:12,color:"#4a4440",marginTop:16,textAlign:"center" }}>
            Data compiled June 2026 from public sources, published pricing, and direct research. Click rows to expand details.
          </p>
        </div>
      </section>

      {/* JAMPACK PARTNER NOTE */}
      <section style={{ padding:"80px 48px",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:900,margin:"0 auto" }}>
          <div ref={reg("jampack")} className={`fade-up ${vis("jampack")?"in":""}`} style={{ padding:"40px 48px",background:"rgba(249,115,22,.03)",border:"1px solid rgba(249,115,22,.2)",display:"flex",gap:32,alignItems:"flex-start",flexWrap:"wrap" }}>
            <div style={{ fontSize:36 }}>⚡</div>
            <div style={{ flex:1,minWidth:280 }}>
              <div className="tag" style={{ background:"rgba(249,115,22,.1)",color:"#f97316",border:"1px solid rgba(249,115,22,.3)",marginBottom:16 }}>Partner Opportunity</div>
              <h3 style={{ fontSize:24,fontWeight:700,marginBottom:12,letterSpacing:"-.01em" }}>Jampack AI + DragonScale</h3>
              <p className="dm" style={{ fontSize:15,color:"#a09880",lineHeight:1.75,marginBottom:16 }}>
                Jampack AI automates CPG wholesale operations — purchase orders, truckload scheduling, invoicing — and is already processing $500M+ in annualized wholesale volume. They do one thing well.
              </p>
              <p className="dm" style={{ fontSize:15,color:"#a09880",lineHeight:1.75 }}>
                DragonScale builds the surrounding intelligence layer — demand forecasting, inventory management, performance reporting, cross-function automation — that Jampack's clients need but Jampack doesn't provide. These aren't competing products. They're complements. A CPG brand using Jampack for wholesale ops and DragonScale for everything else gets a complete AI operations stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DRAGONSCALE */}
      <section style={{ padding:"100px 48px",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div ref={reg("why-h")} className={`fade-up ${vis("why-h")?"in":""}`} style={{ marginBottom:64 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>Why DragonScale</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              The only firm that combines<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>all four.</span>
            </h2>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:2 }}>
            {[
              { icon:"🏭", title:"CPG/Pharma/F&B Depth", desc:"10 years inside Fortune 500 supply chains, demand planning, S&OP, and inventory operations in exactly your industry. Not a generalist who Googled it." },
              { icon:"🔧", title:"Actually Builds", desc:"We don't write strategy decks and hand them off. We build the automation, connect the integrations, and deliver a working system. Full stop." },
              { icon:"💰", title:"SMB Pricing", desc:"Starting at $2,500 for a Pilot Build. Not $250,000. Not $100,000. Not even $25,000 to get started. Pricing built for the size of company we serve." },
              { icon:"⚙️", title:"Ops Domain Expertise", desc:"The difference between a working automation and a useful one is knowing what the business actually needs. That comes from 10 years of ops work, not 10 minutes of discovery calls." },
            ].map((item,i) => (
              <div key={i} ref={reg(`why-${i}`)} className={`fade-up ${vis(`why-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.1}s`,padding:"40px 32px",background:"rgba(255,255,255,.02)",borderLeft:i===0?"none":"1px solid rgba(200,169,110,.06)" }}>
                <div style={{ fontSize:32,marginBottom:20 }}>{item.icon}</div>
                <h3 style={{ fontSize:17,fontWeight:700,marginBottom:12,color:"#c8a96e" }}>{item.title}</h3>
                <p className="dm" style={{ fontSize:14,color:"#6b6458",lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLAUDE FOR SMALL BUSINESS CONTEXT */}
      <section style={{ padding:"80px 48px",borderBottom:"1px solid rgba(200,169,110,.08)",background:"rgba(168,85,247,.02)" }}>
        <div style={{ maxWidth:900,margin:"0 auto" }}>
          <div ref={reg("claude-ctx")} className={`fade-up ${vis("claude-ctx")?"in":""}`} style={{ padding:"40px 48px",background:"rgba(168,85,247,.04)",border:"1px solid rgba(168,85,247,.2)" }}>
            <div className="tag" style={{ background:"rgba(168,85,247,.1)",color:"#a855f7",border:"1px solid rgba(168,85,247,.3)",marginBottom:20 }}>The Anthropic Angle</div>
            <h3 style={{ fontSize:24,fontWeight:700,marginBottom:16,letterSpacing:"-.01em" }}>Claude for Small Business shows what's possible. We build what's specific to you.</h3>
            <p className="dm" style={{ fontSize:15,color:"#a09880",lineHeight:1.75,marginBottom:16 }}>
              Anthropic's Claude for Small Business ships 15 pre-built skills for QuickBooks, HubSpot, and Google Workspace. It's a genuinely useful starting point — and it's free. But it doesn't know the difference between your top SKU and your slowest mover. It doesn't know your margin thresholds, your distributor relationships, or what a deduction management workflow looks like.
            </p>
            <p className="dm" style={{ fontSize:15,color:"#a09880",lineHeight:1.75 }}>
              DragonScale is the implementation partner Anthropic explicitly pointed businesses toward when they said custom workflows require "development skills or an outside consultant." We're that consultant — specialized in the verticals where the gap between generic skills and real operational needs is widest.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"100px 48px",position:"relative",overflow:"hidden" }}>
        <div className="grid-bg" style={{ position:"absolute",inset:0,opacity:.4 }} />
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 60% at 50% 50%,rgba(200,169,110,.06) 0%,transparent 70%)" }} />

        <div ref={reg("cta")} className={`fade-up ${vis("cta")?"in":""}`} style={{ maxWidth:620,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ width:1,height:56,background:"linear-gradient(to bottom,transparent,#c8a96e)",margin:"0 auto 40px" }} />
          <h2 style={{ fontSize:"clamp(28px,4vw,52px)",fontWeight:800,letterSpacing:"-.02em",marginBottom:20,lineHeight:1.1 }}>
            Ready to talk to<br />
            <span style={{ color:"#c8a96e",fontStyle:"italic" }}>the firm that fills the gap?</span>
          </h2>
          <p className="dm" style={{ fontSize:16,color:"#a09880",lineHeight:1.7,marginBottom:40 }}>
            Start with the free assessment to see exactly where generic tools are falling short in your business. Or book a scoping call directly — 30 minutes, no pitch, a fixed-scope proposal within 24 hours.
          </p>
          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
            <a href="https://ai-assessment-lake.vercel.app" className="btn-gold" style={{ fontSize:16,padding:"16px 40px" }}>Start Free Assessment →</a>
            <a href="https://calendly.com/chris-takeuchi" className="btn-outline" style={{ fontSize:16,padding:"16px 40px" }}>Book Scoping Call</a>
          </div>
          <div className="dm" style={{ marginTop:20,fontSize:12,color:"#4a4440" }}>Chris Takeuchi · DragonScale · chris@dragonscale.ai</div>
        </div>
      </section>

      <footer style={{ borderTop:"1px solid rgba(200,169,110,.1)",padding:"32px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
        <div className="dm" style={{ fontSize:13,fontWeight:700,color:"#f0ede8" }}>DragonScale</div>
        <div className="dm" style={{ fontSize:12,color:"#6b6458" }}>© 2026 DragonScale · Chris Takeuchi</div>
        <div style={{ display:"flex",gap:24 }}>
          {["Assess","Build","Shield","Nexus"].map(l => (
            <a key={l} href="#" className="dm" style={{ fontSize:12,color:"#6b6458",textDecoration:"none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
