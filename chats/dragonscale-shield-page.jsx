import { useState, useEffect, useRef } from "react";

const TIERS = [
  {
    name: "Shield",
    icon: "🛡",
    tagline: "Your automation stays alive. We handle it if it breaks.",
    bestFor: "Build graduates with a single automation who want it monitored and maintained without thinking about it.",
    price: "$497",
    accent: "#f97316",
    commitment: "3-month minimum · then month-to-month",
    responseTime: "2 business days",
    includes: [
      "Uptime monitoring on your automation",
      "Break-fix resolution within 2 business days",
      "One 15-min async Loom response per month for questions",
      "Access to your private client portal with documentation",
      "Monthly status ping — running clean or here's what we fixed",
    ],
    notIncluded: [
      "New automation builds",
      "Changes to logic or scope",
      "Strategy calls",
      "Major system changes",
    ],
    timeCommitment: "~1–2 hrs/month from Chris if nothing breaks. Near zero if it's running clean.",
    upgradeNote: "When you're ready to grow — upgrade to Shield+ or Nexus Core.",
  },
  {
    name: "Shield+",
    icon: "🛡+",
    tagline: "Your automation stays alive and keeps getting better.",
    bestFor: "Forge Build graduates with 2–3 automations who want light ongoing attention without committing to full Nexus.",
    price: "$997",
    accent: "#a855f7",
    featured: true,
    commitment: "3-month minimum · then month-to-month",
    responseTime: "Next business day",
    includes: [
      "Everything in Shield",
      "One minor automation update or logic change per month",
      "Priority break-fix — next business day vs. 2 days",
      "Monthly 2-sentence status note — what ran, what changed",
      "Quarterly check-in prompt — want to grow this further?",
    ],
    notIncluded: [
      "New automation builds from scratch",
      "Strategy calls",
      "Major system redesigns",
      "Additional integrations beyond original scope",
    ],
    timeCommitment: "~2–3 hrs/month from Chris. Manageable across up to 8 clients.",
    upgradeNote: "The natural next step is Nexus Pro — one new automation per month, monthly strategy call, and active compounding.",
  },
];

const HOWWORKS = [
  { icon: "⚡", title: "You complete a Build", desc: "Spark, Forge, or Ascend. Your automation is live, documented, and working." },
  { icon: "✍️", title: "You add Shield at handoff", desc: "One checkbox in your Build proposal. Half your Build clients say yes on the spot." },
  { icon: "🔍", title: "We monitor automatically", desc: "Uptime checks run continuously. If something breaks, we know before you do." },
  { icon: "🔧", title: "We fix it quietly", desc: "Most issues are resolved without you ever knowing there was one. You get a note in your monthly status ping." },
  { icon: "📈", title: "You grow, we grow", desc: "When you're ready for more — a new automation, a deeper integration, the full Nexus platform — we're already embedded and ready." },
];

const OBJECTIONS = [
  {
    q: "Can't we just maintain it ourselves after the Build handoff?",
    a: "You can — that's why we give you full documentation. Most clients start with that intention. Three months later, when an API token expires or a workflow breaks after a tool update, they'd rather have someone who knows the system already on it. Shield exists for the moment you'd otherwise spend an afternoon debugging something we could fix in 20 minutes.",
  },
  {
    q: "What counts as 'break-fix' vs. a new build?",
    a: "Break-fix is anything that stops the existing automation from working as designed — a broken connection, an expired credential, a tool update that changed an API endpoint. New build is anything that adds functionality, changes logic, or connects a new tool. If you're ever unsure, just ask — we'll tell you honestly which category it falls in before doing any work.",
  },
  {
    q: "What if I need more than one update per month on Shield+?",
    a: "We'll tell you when you're hitting the edge of scope and quote additional work as a change order before touching anything. No surprises on the invoice.",
  },
  {
    q: "What happens after the 3-month minimum?",
    a: "It goes month-to-month with 30 days written notice to cancel. No lock-in beyond the initial commitment. Most clients stay — not because they have to, but because the peace of mind is worth more than the monthly cost.",
  },
];

const ROI = [
  { label: "Your time debugging a broken automation", value: "3–6 hrs", note: "If you don't know the system" },
  { label: "Your hourly value as a business owner", value: "$150–500/hr", note: "Conservative estimate" },
  { label: "Cost of one self-repair attempt", value: "$450–3,000", note: "Per incident" },
  { label: "Shield monthly cost", value: "$497/mo", note: "Covers unlimited incidents" },
  { label: "Breakeven point", value: "1 incident", note: "Per month, at $150/hr" },
];

export default function ShieldPage() {
  const [openObj, setOpenObj] = useState(null);
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
    <div style={{ fontFamily:"'Playfair Display', Georgia, serif", background:"#080810", color:"#f0ede8", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .dm { font-family:'DM Sans',sans-serif; }
        .fade-up { opacity:0; transform:translateY(24px); transition:opacity .6s ease,transform .6s ease; }
        .fade-up.in { opacity:1; transform:translateY(0); }
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}
        .btn-gold { display:inline-block;padding:15px 36px;background:#c8a96e;color:#080810;font-family:'DM Sans',sans-serif;font-weight:600;font-size:15px;letter-spacing:.04em;text-decoration:none;border:none;cursor:pointer;transition:all .2s; }
        .btn-gold:hover { background:#e0c080;transform:translateY(-2px);box-shadow:0 12px 40px rgba(200,169,110,.3); }
        .btn-outline { display:inline-block;padding:14px 35px;background:transparent;color:#c8a96e;font-family:'DM Sans',sans-serif;font-weight:500;font-size:15px;letter-spacing:.04em;text-decoration:none;border:1px solid rgba(200,169,110,.4);cursor:pointer;transition:all .2s; }
        .btn-outline:hover { background:rgba(200,169,110,.08); }
        .card { background:rgba(255,255,255,.02);border:1px solid rgba(200,169,110,.1);transition:transform .3s,box-shadow .3s; }
        .noise { position:fixed;inset:0;pointer-events:none;opacity:.02;z-index:999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .grid-bg { background-image:linear-gradient(rgba(200,169,110,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,.04) 1px,transparent 1px);background-size:48px 48px; }
        .tag { display:inline-block;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px; }
        .obj-btn { width:100%;background:none;border:none;cursor:pointer;text-align:left;color:inherit;font-family:inherit; }
        .check { color:#22c55e;margin-right:10px;flex-shrink:0; }
        .cross { color:#4a4440;margin-right:10px;flex-shrink:0; }
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
          <a href="/build" className="dm" style={{ fontSize:13,color:"#a09880",textDecoration:"none" }}>Build</a>
          <a href="/nexus" className="dm" style={{ fontSize:13,color:"#a09880",textDecoration:"none" }}>Nexus</a>
          <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ padding:"10px 22px",fontSize:13 }}>Book a Call</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"75vh",display:"flex",alignItems:"center",padding:"140px 48px 80px",position:"relative",overflow:"hidden" }}>
        <div className="grid-bg" style={{ position:"absolute",inset:0,opacity:.5 }} />
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 60% at 40% 50%,rgba(200,169,110,.05) 0%,transparent 70%)" }} />

        <div style={{ maxWidth:760,position:"relative",zIndex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:32 }}>
            <a href="/" className="dm" style={{ fontSize:13,color:"#6b6458",textDecoration:"none" }}>DragonScale</a>
            <span style={{ color:"#6b6458" }}>→</span>
            <span className="dm" style={{ fontSize:13,color:"#c8a96e" }}>Shield</span>
          </div>

          <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:28 }}>
            Maintenance · From $497/mo
          </div>

          <h1 style={{ fontSize:"clamp(36px,5vw,68px)",fontWeight:800,lineHeight:1.05,letterSpacing:"-.02em",marginBottom:28 }}>
            Your automation<br />
            should keep running<br />
            <span style={{ color:"#c8a96e",fontStyle:"italic" }}>after we leave.</span>
          </h1>

          <p className="dm" style={{ fontSize:18,color:"#a09880",lineHeight:1.75,maxWidth:560,marginBottom:16 }}>
            Shield is the maintenance layer that comes after your Build. We monitor your automations, fix what breaks, and keep your business running — so you never have to think about it.
          </p>
          <p className="dm" style={{ fontSize:14,color:"#6b6458",marginBottom:44,maxWidth:500 }}>
            Available exclusively to DragonScale Build clients. Added at handoff or anytime after.
          </p>

          <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
            <a href="https://calendly.com/chris-dragonscale" className="btn-gold">Add Shield to My Build →</a>
            <a href="/build" className="btn-outline">Start with a Build First</a>
          </div>
        </div>

        {/* Price callout */}
        <div style={{ position:"absolute",right:"8%",top:"50%",transform:"translateY(-50%)",textAlign:"center",opacity:.5 }} className="hide-sm">
          <div className="dm" style={{ fontSize:11,color:"#6b6458",letterSpacing:".12em",textTransform:"uppercase",marginBottom:8 }}>Starting at</div>
          <div style={{ fontSize:52,fontWeight:800,color:"#c8a96e",letterSpacing:"-.03em",lineHeight:1 }}>$497</div>
          <div style={{ width:40,height:1,background:"rgba(200,169,110,.3)",margin:"12px auto" }} />
          <div className="dm" style={{ fontSize:12,color:"#6b6458" }}>per month</div>
        </div>
      </section>

      {/* ROI MATH */}
      <section style={{ padding:"80px 48px",borderTop:"1px solid rgba(200,169,110,.1)",borderBottom:"1px solid rgba(200,169,110,.1)",background:"rgba(200,169,110,.02)" }}>
        <div style={{ maxWidth:900,margin:"0 auto" }}>
          <div ref={reg("roi-h")} className={`fade-up ${vis("roi-h")?"in":""}`} style={{ marginBottom:40,maxWidth:500 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:16 }}>The ROI Math</div>
            <h2 style={{ fontSize:"clamp(24px,3vw,38px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Shield pays for itself<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>on the first incident.</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:2 }}>
            {ROI.map((r,i) => (
              <div key={i} ref={reg(`roi-${i}`)} className={`fade-up ${vis(`roi-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.08}s`,padding:"24px 20px",background:"rgba(255,255,255,.02)",borderLeft:i===0?"none":"1px solid rgba(200,169,110,.06)" }}>
                <div className="dm" style={{ fontSize:10,color:"#6b6458",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8,lineHeight:1.4 }}>{r.label}</div>
                <div style={{ fontSize:24,fontWeight:800,color:i===3?"#c8a96e":i===4?"#22c55e":"#f0ede8",letterSpacing:"-.01em",marginBottom:6 }}>{r.value}</div>
                <div className="dm" style={{ fontSize:11,color:"#4a4440",lineHeight:1.4 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"100px 48px",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div ref={reg("how-h")} className={`fade-up ${vis("how-h")?"in":""}`} style={{ marginBottom:64 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>How Shield Works</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Set it. Forget it.<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>We've got it.</span>
            </h2>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",left:16,top:0,bottom:0,width:1,background:"linear-gradient(to bottom,transparent,rgba(200,169,110,.3),transparent)" }} />
            {HOWWORKS.map((h,i) => (
              <div key={i} ref={reg(`how-${i}`)} className={`fade-up ${vis(`how-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.1}s`,display:"flex",gap:40,marginBottom:40,paddingLeft:48,position:"relative" }}>
                <div style={{ position:"absolute",left:8,top:6,width:17,height:17,borderRadius:"50%",background:"#080810",border:"1px solid #c8a96e",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:"#c8a96e" }} />
                </div>
                <div>
                  <div style={{ fontSize:20,marginBottom:8 }}>{h.icon}</div>
                  <div style={{ fontSize:17,fontWeight:700,marginBottom:8 }}>{h.title}</div>
                  <p className="dm" style={{ fontSize:14,color:"#6b6458",lineHeight:1.65,maxWidth:500 }}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section style={{ padding:"100px 48px",background:"rgba(200,169,110,.02)",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div ref={reg("price-h")} className={`fade-up ${vis("price-h")?"in":""}`} style={{ marginBottom:56 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>Pricing</div>
            <h2 style={{ fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Two tiers.<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>One job — keep it running.</span>
            </h2>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:24 }}>
            {TIERS.map((t,i) => (
              <div key={i} ref={reg(`tier-${i}`)} className={`card fade-up ${vis(`tier-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.15}s`,padding:"40px 36px",position:"relative",display:"flex",flexDirection:"column",borderColor:t.featured?"rgba(168,85,247,.3)":"rgba(200,169,110,.1)",background:t.featured?"rgba(168,85,247,.03)":"rgba(255,255,255,.02)" }}>
                {t.featured&&<div style={{ position:"absolute",top:-1,left:0,right:0,height:2,background:"linear-gradient(to right,transparent,#a855f7,transparent)" }} />}
                {t.featured&&<div style={{ position:"absolute",top:16,right:16 }}><div className="tag" style={{ background:"rgba(168,85,247,.15)",color:"#a855f7",border:"1px solid rgba(168,85,247,.3)",fontSize:10 }}>Most Popular</div></div>}

                <div style={{ fontSize:28,marginBottom:16 }}>{t.icon}</div>
                <div className="dm" style={{ fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:t.accent,marginBottom:8 }}>DragonScale</div>
                <h3 style={{ fontSize:28,fontWeight:800,marginBottom:8 }}>{t.name}</h3>
                <p style={{ fontSize:14,fontStyle:"italic",color:"#a09880",marginBottom:6,lineHeight:1.5 }}>{t.tagline}</p>
                <p className="dm" style={{ fontSize:13,color:"#6b6458",marginBottom:28,lineHeight:1.5 }}>Best for: {t.bestFor}</p>

                <div style={{ marginBottom:28,padding:"20px 0",borderTop:"1px solid rgba(200,169,110,.1)",borderBottom:"1px solid rgba(200,169,110,.1)" }}>
                  <div style={{ fontSize:42,fontWeight:800,color:"#c8a96e",letterSpacing:"-.02em",lineHeight:1 }}>{t.price}</div>
                  <div className="dm" style={{ fontSize:12,color:"#6b6458",marginTop:6 }}>per month · {t.commitment}</div>
                </div>

                <div style={{ marginBottom:20,flex:1 }}>
                  <div className="dm" style={{ fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"#6b6458",marginBottom:12 }}>Included</div>
                  {t.includes.map((item,j) => (
                    <div key={j} className="dm" style={{ display:"flex",gap:8,marginBottom:8,fontSize:13,color:"#a09880",lineHeight:1.5 }}>
                      <span className="check">✓</span>{item}
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom:20 }}>
                  <div className="dm" style={{ fontSize:11,letterSpacing:".1em",textTransform:"uppercase",color:"#6b6458",marginBottom:12 }}>Not included</div>
                  {t.notIncluded.map((item,j) => (
                    <div key={j} className="dm" style={{ display:"flex",gap:8,marginBottom:6,fontSize:13,color:"#4a4440",lineHeight:1.5 }}>
                      <span className="cross">—</span>{item}
                    </div>
                  ))}
                </div>

                <div style={{ padding:"12px 16px",background:"rgba(200,169,110,.04)",borderLeft:`2px solid ${t.accent}40`,marginBottom:20 }}>
                  <div className="dm" style={{ fontSize:12,color:"#6b6458" }}>⏱ {t.timeCommitment}</div>
                </div>

                <div className="dm" style={{ fontSize:12,color:"#c8a96e",marginBottom:24,lineHeight:1.5 }}>
                  ↗ {t.upgradeNote}
                </div>

                <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ textAlign:"center",background:t.featured?"#a855f7":"#c8a96e",color:t.featured?"#fff":"#080810" }}>
                  Add Shield to My Engagement →
                </a>
              </div>
            ))}
          </div>

          {/* Annual note */}
          <div ref={reg("annual")} className={`fade-up ${vis("annual")?"in":""}`} style={{ marginTop:40,padding:"24px 32px",background:"rgba(34,197,94,.04)",border:"1px solid rgba(34,197,94,.15)",display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap" }}>
            <div style={{ fontSize:20 }}>💡</div>
            <div>
              <div className="dm" style={{ fontSize:14,fontWeight:600,color:"#22c55e",marginBottom:4 }}>Pay annually — get one month free</div>
              <p className="dm" style={{ fontSize:13,color:"#6b6458",lineHeight:1.6 }}>
                Shield annual: $5,464 (saves $530 vs. monthly) · Shield+ annual: $10,967 (saves $997 vs. monthly). Price locked for 12 months with 60-day notice on any future increase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PATH TO NEXUS */}
      <section style={{ padding:"80px 48px",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:900,margin:"0 auto" }}>
          <div ref={reg("path-h")} className={`fade-up ${vis("path-h")?"in":""}`} style={{ marginBottom:40 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>The Bigger Picture</div>
            <h2 style={{ fontSize:"clamp(24px,3vw,40px)",fontWeight:800,letterSpacing:"-.02em" }}>
              Shield is the floor.<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>Nexus is the ceiling.</span>
            </h2>
          </div>

          <div style={{ display:"flex",gap:0,overflowX:"auto" }}>
            {[
              { label:"Build", sub:"One-time sprint", color:"#f97316", desc:"Custom automation built and deployed" },
              { label:"Shield", sub:"$497–997/mo", color:"#c8a96e", desc:"Monitored, maintained, always running", active:true },
              { label:"Shield+", sub:"$997/mo", color:"#a855f7", desc:"Light updates, priority support" },
              { label:"Nexus", sub:"$1,997/mo+", color:"#06b6d4", desc:"Full intelligence layer. Ask, alert, act." },
            ].map((s,i) => (
              <div key={i} style={{ flex:1,minWidth:160,padding:"24px 20px",background:s.active?"rgba(200,169,110,.06)":"rgba(255,255,255,.02)",border:"1px solid rgba(200,169,110,.1)",borderLeft:i===0?"1px solid rgba(200,169,110,.1)":"none",position:"relative" }}>
                {s.active&&<div style={{ position:"absolute",top:-1,left:0,right:0,height:2,background:"linear-gradient(to right,transparent,#c8a96e,transparent)" }} />}
                <div style={{ fontSize:11,fontFamily:"'DM Sans',sans-serif",letterSpacing:".1em",textTransform:"uppercase",color:s.color,marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#f0ede8",marginBottom:6 }}>{s.sub}</div>
                <div style={{ fontSize:12,fontFamily:"'DM Sans',sans-serif",color:"#6b6458",lineHeight:1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          <p className="dm" style={{ fontSize:14,color:"#6b6458",marginTop:24,lineHeight:1.7,maxWidth:600 }}>
            Every Shield client is a natural Nexus candidate. When you're ready to go from maintenance to intelligence — one interface connected to everything, asking and alerting across your whole business — the upgrade conversation is a single email. We're already embedded. The transition takes days, not weeks.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"100px 48px",borderBottom:"1px solid rgba(200,169,110,.08)" }}>
        <div style={{ maxWidth:800,margin:"0 auto" }}>
          <div ref={reg("faq-h")} className={`fade-up ${vis("faq-h")?"in":""}`} style={{ marginBottom:56 }}>
            <div className="tag" style={{ background:"rgba(200,169,110,.08)",color:"#c8a96e",border:"1px solid rgba(200,169,110,.2)",marginBottom:20 }}>Questions</div>
            <h2 style={{ fontSize:"clamp(26px,3vw,42px)",fontWeight:800,letterSpacing:"-.02em" }}>
              The things people<br /><span style={{ color:"#c8a96e",fontStyle:"italic" }}>actually ask.</span>
            </h2>
          </div>

          {OBJECTIONS.map((o,i) => (
            <div key={i} ref={reg(`faq-${i}`)} className={`fade-up ${vis(`faq-${i}`)?"in":""}`} style={{ transitionDelay:`${i*.1}s`,borderBottom:"1px solid rgba(200,169,110,.08)" }}>
              <button className="obj-btn" onClick={() => setOpenObj(openObj===i?null:i)} style={{ padding:"24px 0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16 }}>
                <span style={{ fontSize:16,fontWeight:600,lineHeight:1.4,flex:1 }}>{o.q}</span>
                <span style={{ color:"#c8a96e",fontSize:20,flexShrink:0,transition:"transform .3s",transform:openObj===i?"rotate(45deg)":"none" }}>+</span>
              </button>
              {openObj===i&&(
                <div className="dm" style={{ paddingBottom:24,fontSize:15,color:"#a09880",lineHeight:1.75,paddingRight:40 }}>
                  {o.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"100px 48px",position:"relative",overflow:"hidden" }}>
        <div className="grid-bg" style={{ position:"absolute",inset:0,opacity:.4 }} />
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 50% 60% at 50% 50%,rgba(200,169,110,.05) 0%,transparent 70%)" }} />

        <div ref={reg("cta")} className={`fade-up ${vis("cta")?"in":""}`} style={{ maxWidth:600,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1 }}>
          <div style={{ width:1,height:56,background:"linear-gradient(to bottom,transparent,#c8a96e)",margin:"0 auto 40px" }} />
          <h2 style={{ fontSize:"clamp(28px,4vw,52px)",fontWeight:800,letterSpacing:"-.02em",marginBottom:20,lineHeight:1.1 }}>
            Don't let your Build<br />
            <span style={{ color:"#c8a96e",fontStyle:"italic" }}>become a liability.</span>
          </h2>
          <p className="dm" style={{ fontSize:16,color:"#a09880",lineHeight:1.7,marginBottom:12 }}>
            You invested in a working automation. Shield makes sure it stays that way — quietly, automatically, without needing to think about it.
          </p>
          <p className="dm" style={{ fontSize:14,color:"#6b6458",marginBottom:40 }}>
            Add it at Build handoff or anytime after. Month-to-month after the first 3 months.
          </p>
          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
            <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ fontSize:16,padding:"16px 40px" }}>Add Shield →</a>
            <a href="/build" className="btn-outline" style={{ fontSize:16,padding:"16px 40px" }}>Start with a Build</a>
          </div>
          <div className="dm" style={{ marginTop:20,fontSize:12,color:"#4a4440" }}>Chris Takeuchi · DragonScale · chris@dragonscale.consulting</div>
        </div>
      </section>

      <footer style={{ borderTop:"1px solid rgba(200,169,110,.1)",padding:"32px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
        <div className="dm" style={{ fontSize:13,fontWeight:700,color:"#f0ede8" }}>DragonScale Shield</div>
        <div className="dm" style={{ fontSize:12,color:"#6b6458" }}>© 2026 DragonScale · Chris Takeuchi</div>
        <div style={{ display:"flex",gap:24 }}>
          {["Assess","Build","Shield","Nexus"].map(l=>(
            <a key={l} href={`/${l.toLowerCase()}`} className="dm" style={{ fontSize:12,color:l==="Shield"?"#c8a96e":"#6b6458",textDecoration:"none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
