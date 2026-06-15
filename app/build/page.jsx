"use client";
import { useState, useEffect, useRef } from "react";

const TIERS = [
  {
    name: "Spark",
    icon: "⚡",
    tagline: "Your highest-impact automation, deployed in 2 weeks.",
    bestFor: "One clear, painful manual process you already know about.",
    duration: "2 weeks",
    founderPrice: "$3,500",
    standardPrice: "$6,500",
    accent: "#f97316",
    includes: [
      "90-min discovery session to map the process",
      "1 automation or workflow built & deployed",
      "Handoff documentation",
      "1 team training session",
      "14-day email support post-launch",
    ],
    roiAnchor: "Saves one person 8 hrs/week → payback in under 6 months",
    scopeNote: "Single workflow · Single system integration · No custom UI",
  },
  {
    name: "Forge",
    icon: "🔧",
    tagline: "A full automation system that changes how your team operates.",
    bestFor: "3+ interconnected inefficiencies that need a real fix, not a band-aid.",
    duration: "3–4 weeks",
    founderPrice: "$8,500",
    standardPrice: "$14,500",
    accent: "#a855f7",
    includes: [
      "2 discovery sessions to map full workflow ecosystem",
      "Up to 3 connected automations or 1 complex multi-step system",
      "Integration across 2–3 existing tools",
      "Full handoff documentation",
      "Team training session (up to 5 people)",
      "30-day support window",
    ],
    roiAnchor: "Eliminates 20+ hrs/week of manual work — or replaces a part-time hire",
    scopeNote: "Multi-workflow · Cross-tool integration · Full documentation",
    featured: true,
  },
  {
    name: "Ascend",
    icon: "🐉",
    tagline: "End-to-end AI transformation of one core business function.",
    bestFor: "Owners who want to hand off an entire operational headache permanently.",
    duration: "4–6 weeks",
    founderPrice: "$16,500",
    standardPrice: "$24,500",
    accent: "#06b6d4",
    includes: [
      "Full discovery & process mapping (up to 3 sessions)",
      "Custom AI solution built across the entire function",
      "Full-stack integration across your tools",
      "Complete documentation and runbooks",
      "Team training (unlimited attendees)",
      "60-day support window",
      "Transition path to DragonScale Brain for ongoing management",
    ],
    roiAnchor: "Replaces or significantly reduces a headcount need — payback under 6 months",
    scopeNote: "Full function · Unlimited integrations · Brain-ready handoff",
  },
];

const OBJECTIONS = [
  {
    q: "We've tried automations before and they broke.",
    a: "Most automation breaks because it was built by someone who understands code but not operations. I spent 10 years inside the operations of Fortune 500 companies before I ever wrote a line of automation. I design for how your business actually runs — not how it looks on a flowchart.",
  },
  {
    q: "Can't we just use ChatGPT or Zapier ourselves?",
    a: "You can. The same way you can represent yourself in court or rewire your own electrical panel. The question isn't whether the tools exist — it's whether you have the time, expertise, and operational context to deploy them correctly. Most SMBs spend months experimenting and end up with duct-tape solutions. You get a working system in weeks.",
  },
  {
    q: "How do we know this will actually save us money?",
    a: "We calculate it together on the scoping call before you sign anything. I'll map your current process, quantify the time cost, and show you a conservative ROI projection. If the numbers don't make sense, I'll tell you — I'd rather walk away from a bad fit than deliver something that doesn't move the needle.",
  },
  {
    q: "What if something breaks after handoff?",
    a: "Every Build includes a support window (14–60 days depending on tier) where I'm on call for issues. After that, the system is fully documented so your team can manage it — or you transition to DragonScale Brain where I actively maintain it for you.",
  },
];

const PROCESS = [
  { step: "01", title: "Assessment", desc: "Take the free 8-minute DragonScale Assess. Your report reveals the highest-value automation opportunities in your business.", icon: "📋" },
  { step: "02", title: "Scoping Call", desc: "30 minutes with Chris Takeuchi. We map the process, quantify the ROI, and confirm which Build tier fits your situation.", icon: "📞" },
  { step: "03", title: "Proposal", desc: "You receive a fixed-scope proposal within 24 hours. Clear deliverables, clear timeline, clear price. No surprises.", icon: "📄" },
  { step: "04", title: "Build Sprint", desc: "We kick off. You get weekly check-ins. I build, test, and document everything while you run your business.", icon: "⚙️" },
  { step: "05", title: "Handoff", desc: "Live walkthrough, training session, and full documentation. Your team is ready to run it from day one.", icon: "🚀" },
];

export default function DragonScaleBuild() {
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
      (entries) => entries.forEach(e => e.isIntersecting && setVisible(p => new Set([...p, e.target.dataset.id]))),
      { threshold: 0.12 }
    );
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reg = (id) => (el) => { refs.current[id] = el; if (el) el.dataset.id = id; };
  const vis = (id) => visible.has(id);

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#0a0a0f", color: "#f0ede8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dm { font-family: 'DM Sans', sans-serif; }
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; }
        .btn-gold { display: inline-block; padding: 15px 36px; background: #c8a96e; color: #0a0a0f; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; letter-spacing: 0.04em; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s; }
        .btn-gold:hover { background: #e0c080; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(200,169,110,0.3); }
        .btn-outline { display: inline-block; padding: 14px 35px; background: transparent; color: #c8a96e; font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 15px; letter-spacing: 0.04em; text-decoration: none; border: 1px solid rgba(200,169,110,0.4); cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { background: rgba(200,169,110,0.08); border-color: #c8a96e; }
        .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(200,169,110,0.12); transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .tier-featured { background: rgba(168,85,247,0.04); border-color: rgba(168,85,247,0.3); }
        .noise { position: fixed; inset: 0; pointer-events: none; opacity: 0.02; z-index: 999; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .scale-bg { background-image: repeating-linear-gradient(60deg, transparent, transparent 18px, rgba(200,169,110,0.025) 18px, rgba(200,169,110,0.025) 19px), repeating-linear-gradient(-60deg, transparent, transparent 18px, rgba(200,169,110,0.025) 18px, rgba(200,169,110,0.025) 19px); }
        .obj-btn { width: 100%; background: none; border: none; cursor: pointer; text-align: left; color: inherit; font-family: inherit; }
        .tag { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; }
        .founder-badge { background: rgba(200,169,110,0.12); border: 1px solid rgba(200,169,110,0.3); color: #c8a96e; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; display: inline-block; }
        @media (max-width: 768px) { .hide-sm { display: none !important; } .stack { flex-direction: column !important; } }
      `}</style>

      <div className="noise" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(10,10,15,0.96)" : "transparent", borderBottom: scrolled ? "1px solid rgba(200,169,110,0.12)" : "none", backdropFilter: scrolled ? "blur(16px)" : "none", transition: "all 0.3s" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg viewBox="0 0 28 28" fill="none" style={{ width: 28, height: 28 }}>
            <path d="M14 2L24 7.5V20.5L14 26L4 20.5V7.5Z" stroke="#c8a96e" strokeWidth="1" fill="rgba(200,169,110,0.05)" />
            <circle cx="14" cy="14" r="2.5" fill="#c8a96e" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#f0ede8", letterSpacing: "0.01em" }}>DragonScale</span>
        </a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="https://dragonscale.consulting" className="dm" style={{ fontSize: 13, color: "#a09880", textDecoration: "none" }}>Free Assessment</a>
          <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ padding: "10px 22px", fontSize: 13 }}>Book Scoping Call</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "85vh", display: "flex", alignItems: "center", padding: "120px 48px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 65% at 65% 45%, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />
        <div className="scale-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

        <div style={{ maxWidth: 760, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <a href="/" className="dm" style={{ fontSize: 13, color: "#6b6458", textDecoration: "none" }}>DragonScale</a>
            <span style={{ color: "#6b6458" }}>→</span>
            <span className="dm" style={{ fontSize: 13, color: "#c8a96e" }}>Build</span>
          </div>

          <div className="founder-badge" style={{ marginBottom: 28 }}>⏳ Founder Pricing — First 3 Clients Only</div>

          <h1 style={{ fontSize: "clamp(38px, 5.5vw, 72px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 28 }}>
            We diagnose, design,<br />
            and deploy — <span style={{ color: "#c8a96e", fontStyle: "italic" }}>in weeks,<br />not quarters.</span>
          </h1>

          <p className="dm" style={{ fontSize: 18, color: "#a09880", lineHeight: 1.75, maxWidth: 580, marginBottom: 16 }}>
            A fixed-scope AI automation sprint built around the highest-value opportunity in your business. Clear deliverables. Fixed price. No retainer required.
          </p>
          <p className="dm" style={{ fontSize: 14, color: "#6b6458", marginBottom: 44 }}>
            Every Build starts with the free DragonScale Assessment — so we know exactly where to focus before we scope a single thing.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="https://calendly.com/chris-dragonscale" className="btn-gold">Book Free Scoping Call →</a>
            <a href="https://dragonscale.consulting" className="btn-outline">Take the Assessment First</a>
          </div>

          <div className="dm" style={{ marginTop: 32, fontSize: 13, color: "#6b6458" }}>
            30-min call · No pitch · Fixed-scope proposal within 24 hrs
          </div>
        </div>

        {/* Floating price hint */}
        <div className="hide-sm" style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", textAlign: "center", opacity: 0.6 }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6458", marginBottom: 8 }}>Starting from</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#c8a96e", letterSpacing: "-0.03em", lineHeight: 1 }}>$3,500</div>
          <div style={{ width: 40, height: 1, background: "rgba(200,169,110,0.3)", margin: "12px auto" }} />
          <div style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: "#6b6458" }}>Founder Rate</div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: "100px 48px", borderTop: "1px solid rgba(200,169,110,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div ref={reg("proc-h")} className={`fade-up ${vis("proc-h") ? "in" : ""}`} style={{ marginBottom: 64 }}>
            <div className="tag" style={{ background: "rgba(200,169,110,0.08)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)", marginBottom: 20 }}>How a Build Works</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>From assessment to live<br /><span style={{ color: "#c8a96e", fontStyle: "italic" }}>in five steps.</span></h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
            {PROCESS.map((p, i) => (
              <div key={i} ref={reg(`proc-${i}`)} className={`fade-up ${vis(`proc-${i}`) ? "in" : ""}`} style={{ transitionDelay: `${i * 0.1}s`, padding: "32px 28px", background: "rgba(255,255,255,0.02)", borderLeft: i === 0 ? "none" : "1px solid rgba(200,169,110,0.08)", position: "relative" }}>
                <div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.15em", color: "#c8a96e", marginBottom: 16, opacity: 0.6 }}>{p.step}</div>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{p.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{p.title}</div>
                <div className="dm" style={{ fontSize: 13, color: "#6b6458", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="pricing" style={{ padding: "100px 48px", background: "rgba(200,169,110,0.02)", borderTop: "1px solid rgba(200,169,110,0.1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div ref={reg("price-h")} className={`fade-up ${vis("price-h") ? "in" : ""}`} style={{ marginBottom: 16 }}>
            <div className="tag" style={{ background: "rgba(200,169,110,0.08)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)", marginBottom: 20 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em" }}>Three scopes.<br /><span style={{ color: "#c8a96e", fontStyle: "italic" }}>One framework.</span></h2>
          </div>
          <p ref={reg("price-sub")} className={`dm fade-up d1 ${vis("price-sub") ? "in" : ""}`} style={{ fontSize: 16, color: "#6b6458", maxWidth: 520, marginBottom: 56, lineHeight: 1.7 }}>
            All tiers are fixed-scope and fixed-price. No hourly billing, no scope creep surprises. What's in the proposal is what you pay.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {TIERS.map((t, i) => (
              <div key={i} ref={reg(`tier-${i}`)} className={`card fade-up ${t.featured ? "tier-featured" : ""} ${vis(`tier-${i}`) ? "in" : ""}`} style={{ transitionDelay: `${i * 0.15}s`, padding: "40px 36px", position: "relative", display: "flex", flexDirection: "column" }}>
                {t.featured && (
                  <div style={{ position: "absolute", top: -1, left: 0, right: 0, height: 2, background: "linear-gradient(to right, transparent, #a855f7, transparent)" }} />
                )}
                {t.featured && (
                  <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <div className="tag" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.3)", fontSize: 10 }}>Most Popular</div>
                  </div>
                )}

                <div style={{ fontSize: 32, marginBottom: 16 }}>{t.icon}</div>
                <div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, marginBottom: 8 }}>DragonScale Build</div>
                <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.01em" }}>{t.name}</h3>
                <p style={{ fontSize: 14, fontStyle: "italic", color: "#a09880", marginBottom: 6, lineHeight: 1.5 }}>{t.tagline}</p>
                <p className="dm" style={{ fontSize: 13, color: "#6b6458", marginBottom: 32, lineHeight: 1.5 }}>Best for: {t.bestFor}</p>

                {/* Pricing */}
                <div style={{ marginBottom: 32, padding: "24px 0", borderTop: "1px solid rgba(200,169,110,0.1)", borderBottom: "1px solid rgba(200,169,110,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 8 }}>
                    <div>
                      <div className="dm" style={{ fontSize: 11, color: "#6b6458", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Founder Rate</div>
                      <div style={{ fontSize: 38, fontWeight: 800, color: "#c8a96e", letterSpacing: "-0.02em", lineHeight: 1 }}>{t.founderPrice}</div>
                    </div>
                    <div style={{ paddingBottom: 6 }}>
                      <div className="dm" style={{ fontSize: 11, color: "#6b6458", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Standard</div>
                      <div className="dm" style={{ fontSize: 18, color: "#4a4440", textDecoration: "line-through" }}>{t.standardPrice}</div>
                    </div>
                  </div>
                  <div className="dm" style={{ fontSize: 12, color: "#6b6458" }}>⏱ {t.duration} · Fixed scope · Fixed price</div>
                </div>

                {/* Includes */}
                <div style={{ marginBottom: 24, flex: 1 }}>
                  <div className="dm" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6458", marginBottom: 14 }}>What's included</div>
                  {t.includes.map((item, j) => (
                    <div key={j} className="dm" style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: "#a09880", lineHeight: 1.5 }}>
                      <span style={{ color: t.accent, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>

                {/* ROI */}
                <div style={{ padding: "14px 16px", background: `${t.accent}08`, borderLeft: `2px solid ${t.accent}40`, marginBottom: 28 }}>
                  <div className="dm" style={{ fontSize: 12, color: t.accent, opacity: 0.8 }}>📈 {t.roiAnchor}</div>
                </div>

                <div className="dm" style={{ fontSize: 11, color: "#4a4440", marginBottom: 24, letterSpacing: "0.05em" }}>{t.scopeNote}</div>

                <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ background: t.featured ? "#a855f7" : "#c8a96e", textAlign: "center", color: t.featured ? "#fff" : "#0a0a0f" }}>
                  Book Scoping Call →
                </a>
              </div>
            ))}
          </div>

          {/* Founder badge */}
          <div ref={reg("founder")} className={`fade-up ${vis("founder") ? "in" : ""}`} style={{ marginTop: 48, padding: "28px 36px", background: "rgba(200,169,110,0.05)", border: "1px solid rgba(200,169,110,0.2)", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ fontSize: 28 }}>⏳</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Founder Pricing — First 3 Clients Only</div>
              <p className="dm" style={{ fontSize: 14, color: "#a09880", lineHeight: 1.7, maxWidth: 680 }}>
                I'm in a limited founder pricing window. The first three Build clients get a significantly reduced rate in exchange for honest feedback and — if the results are there — a case study I can share with future clients. After those three are filled, pricing moves to standard rates permanently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIONS */}
      <section style={{ padding: "100px 48px", borderTop: "1px solid rgba(200,169,110,0.1)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div ref={reg("obj-h")} className={`fade-up ${vis("obj-h") ? "in" : ""}`} style={{ marginBottom: 56 }}>
            <div className="tag" style={{ background: "rgba(200,169,110,0.08)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)", marginBottom: 20 }}>Common Questions</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}>The things people<br /><span style={{ color: "#c8a96e", fontStyle: "italic" }}>actually ask.</span></h2>
          </div>

          {OBJECTIONS.map((o, i) => (
            <div key={i} ref={reg(`obj-${i}`)} className={`fade-up ${vis(`obj-${i}`) ? "in" : ""}`} style={{ transitionDelay: `${i * 0.1}s`, borderBottom: "1px solid rgba(200,169,110,0.1)" }}>
              <button className="obj-btn" onClick={() => setOpenObj(openObj === i ? null : i)} style={{ padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>{o.q}</span>
                <span style={{ color: "#c8a96e", fontSize: 20, flexShrink: 0, transition: "transform 0.3s", transform: openObj === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openObj === i && (
                <div className="dm" style={{ paddingBottom: 24, fontSize: 15, color: "#a09880", lineHeight: 1.75, paddingRight: 40 }}>
                  {o.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "100px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,169,110,0.06) 0%, transparent 70%)" }} />
        <div className="scale-bg" style={{ position: "absolute", inset: 0 }} />

        <div ref={reg("final")} className={`fade-up ${vis("final") ? "in" : ""}`} style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom, transparent, #c8a96e)", margin: "0 auto 40px" }} />
          <h2 style={{ fontSize: "clamp(30px, 4vw, 54px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.1 }}>
            Not sure which tier<br />is right for you?
          </h2>
          <p className="dm" style={{ fontSize: 16, color: "#a09880", lineHeight: 1.7, marginBottom: 12 }}>
            That's exactly what the scoping call is for. 30 minutes with Chris Takeuchi. We map your situation, calculate the ROI, and you walk away with a clear recommendation — whether you hire us or not.
          </p>
          <p className="dm" style={{ fontSize: 14, color: "#6b6458", marginBottom: 40 }}>
            No pitch. No pressure. A fixed-scope proposal within 24 hours if it's a fit.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://calendly.com/chris-dragonscale" className="btn-gold" style={{ fontSize: 16, padding: "16px 40px" }}>Book Scoping Call →</a>
            <a href="https://dragonscale.consulting" className="btn-outline" style={{ fontSize: 16, padding: "16px 40px" }}>Take Free Assessment</a>
          </div>
          <div className="dm" style={{ marginTop: 20, fontSize: 12, color: "#4a4440" }}>
            Chris Takeuchi · DragonScale · chris@dragonscale.ai
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(200,169,110,0.1)", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div className="dm" style={{ fontSize: 13, fontWeight: 700, color: "#f0ede8" }}>DragonScale Build</div>
        <div className="dm" style={{ fontSize: 12, color: "#6b6458" }}>© 2026 DragonScale · Chris Takeuchi</div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="https://dragonscale.consulting" className="dm" style={{ fontSize: 12, color: "#6b6458", textDecoration: "none" }}>Assess</a>
          <a href="#" className="dm" style={{ fontSize: 12, color: "#6b6458", textDecoration: "none" }}>Brain</a>
          <a href="mailto:chris@dragonscale.ai" className="dm" style={{ fontSize: 12, color: "#6b6458", textDecoration: "none" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
