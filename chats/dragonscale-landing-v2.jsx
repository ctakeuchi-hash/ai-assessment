import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["How It Works", "Solutions", "About", "Contact"];

const SOLUTIONS = [
  {
    icon: "⚡",
    tag: "Free · 8 Minutes",
    name: "DragonScale Assess",
    tagline: "Find what generic AI tools are missing in your business.",
    description:
      "Answer 15 targeted questions across readiness, operations, and growth. Get a dynamic AI-generated report — personalized to your industry — showing exactly where off-the-shelf AI tools fall short and where your biggest custom opportunity lives.",
    cta: "Start Free Assessment",
    href: "https://ai-assessment-lake.vercel.app",
    accent: "#f97316",
    step: "01",
  },
  {
    icon: "🔧",
    tag: "Fixed Scope · From $2,500",
    name: "DragonScale Build",
    tagline: "The custom version that generic tools can't build.",
    description:
      "From a 1-week Pilot that fixes your #1 gap, to a full Ascend engagement that transforms an entire business function. Built by someone with 10 years of enterprise ops experience — not an AI tool configurator.",
    cta: "Book a Scoping Call",
    href: "#contact",
    accent: "#a855f7",
    step: "02",
  },
  {
    icon: "◈",
    tag: "Ongoing · Compounding",
    name: "DragonScale Nexus",
    tagline: "One interface. Your entire business. Ask, alert, and act.",
    description:
      "A fully managed AI operations platform connected to every layer of your business — your data, your automations, your communications. Not a generic AI employee. An intelligent system built specifically for how your operation runs.",
    cta: "See Nexus",
    href: "#contact",
    accent: "#06b6d4",
    step: "03",
  },
];

const PAIN_POINTS = [
  "You tried Claude for Small Business — and hit its limits in two weeks",
  "Your team spends hours on reports that should take minutes",
  "Data lives in five places and nobody trusts any of them",
  "You know AI works — you just need it built for YOUR business",
  "Your best people are buried in work a machine should be doing",
];

const STATS = [
  { value: "10+", label: "Years enterprise ops consulting" },
  { value: "F500", label: "CPG, pharma & food & bev clients" },
  { value: "$2,500", label: "Entry point — Pilot Build" },
  { value: "0", label: "Generic skills. Everything custom." },
];

export default function DragonScaleLanding() {
  const [activeStep, setActiveStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((p) => (p + 1) % PAIN_POINTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, e.target.dataset.section]));
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerRef = (key) => (el) => {
    sectionRefs.current[key] = el;
    if (el) el.dataset.section = key;
  };

  const isVisible = (key) => visibleSections.has(key);

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", background: "#0a0a0f", color: "#f0ede8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dm { font-family: 'DM Sans', sans-serif; }

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-up.d1 { transition-delay: 0.1s; }
        .fade-up.d2 { transition-delay: 0.2s; }
        .fade-up.d3 { transition-delay: 0.3s; }
        .fade-up.d4 { transition-delay: 0.4s; }

        .hero-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: wordIn 0.6s ease forwards;
        }
        @keyframes wordIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .scale-in.visible {
          opacity: 1;
          transform: scale(1);
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }

        .btn-primary {
          display: inline-block;
          padding: 14px 32px;
          background: #c8a96e;
          color: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.04em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .btn-primary:hover {
          background: #e0c080;
          transform: translateY(-2px);
        }

        .btn-ghost {
          display: inline-block;
          padding: 13px 31px;
          background: transparent;
          color: #c8a96e;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.04em;
          text-decoration: none;
          border: 1px solid #c8a96e;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .btn-ghost:hover {
          background: #c8a96e20;
        }

        .pain-item {
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .dragon-line {
          position: absolute;
          width: 1px;
          background: linear-gradient(to bottom, transparent, #c8a96e40, transparent);
          left: 50%;
          top: 0;
          bottom: 0;
        }

        .noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          z-index: 999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .scale-pattern {
          background-image: repeating-linear-gradient(
            60deg,
            transparent,
            transparent 20px,
            rgba(200,169,110,0.03) 20px,
            rgba(200,169,110,0.03) 21px
          ),
          repeating-linear-gradient(
            -60deg,
            transparent,
            transparent 20px,
            rgba(200,169,110,0.03) 20px,
            rgba(200,169,110,0.03) 21px
          );
        }

        .glow-gold {
          box-shadow: 0 0 80px rgba(200,169,110,0.12);
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #a09880;
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #c8a96e; }

        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 80px;
          font-weight: 800;
          color: rgba(200,169,110,0.08);
          line-height: 1;
          position: absolute;
          top: -20px;
          right: 20px;
        }

        .tag-pill {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 0;
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .stack-mobile { flex-direction: column !important; }
          .full-mobile { width: 100% !important; }
        }
      `}</style>

      {/* Noise overlay */}
      <div className="noise" />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,15,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(200,169,110,0.15)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, position: "relative" }}>
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32 }}>
              <path d="M16 2 L28 8 L28 24 L16 30 L4 24 L4 8 Z" stroke="#c8a96e" strokeWidth="1" fill="rgba(200,169,110,0.05)" />
              <path d="M16 8 L22 12 L22 20 L16 24 L10 20 L10 12 Z" fill="rgba(200,169,110,0.15)" stroke="#c8a96e" strokeWidth="0.5" />
              <circle cx="16" cy="16" r="2" fill="#c8a96e" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.02em", color: "#f0ede8", lineHeight: 1 }}>DragonScale</div>
            <div className="dm" style={{ fontSize: 9, color: "#c8a96e", letterSpacing: "0.15em", textTransform: "uppercase" }}>AI Operations</div>
          </div>
        </div>

        <div className="hide-mobile" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {NAV_LINKS.map(l => <a key={l} href={`#${l.toLowerCase().replace(/\s/g,"-")}`} className="nav-link">{l}</a>)}
          <a href="https://ai-assessment-lake.vercel.app" className="btn-primary" style={{ padding: "10px 24px", fontSize: 13 }}>Free Assessment</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "120px 48px 80px", overflow: "hidden" }}>
        {/* Background elements */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(200,169,110,0.06) 0%, transparent 70%)" }} />
        <div className="scale-pattern" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />

        {/* Dragon silhouette hint */}
        <div style={{ position: "absolute", right: "-5%", top: "10%", width: "55%", height: "80%", opacity: 0.04 }}>
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
            <path d="M200 50 C280 80 350 120 370 200 C390 280 340 350 260 370 C180 390 100 350 70 270 C40 190 80 110 140 80 C160 70 180 60 200 50Z" stroke="#c8a96e" strokeWidth="2" fill="none" />
            <path d="M200 80 C260 100 320 140 330 200 C340 260 300 320 240 340 C180 360 120 330 100 270 C80 210 110 150 160 110 C175 98 188 88 200 80Z" stroke="#c8a96e" strokeWidth="1.5" fill="none" />
            <path d="M200 110 C245 128 295 160 300 210 C305 255 272 298 228 310 C182 323 138 300 125 258 C112 218 136 176 172 148 C182 140 191 124 200 110Z" stroke="#c8a96e" strokeWidth="1" fill="none" />
            {[...Array(8)].map((_, i) => (
              <ellipse key={i} cx={180 + i * 8} cy={180 + i * 5} rx={20 - i * 1.5} ry={12 - i} stroke="#c8a96e" strokeWidth="0.5" fill="none" transform={`rotate(${i * 15} 200 200)`} />
            ))}
          </svg>
        </div>

        <div style={{ maxWidth: 720, position: "relative", zIndex: 1 }}>
          <div className="dm tag-pill" style={{ background: "rgba(200,169,110,0.1)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.3)", marginBottom: 32 }}>
            AI Operations · Built by an Operator
          </div>

          <h1 style={{ fontSize: "clamp(42px, 6vw, 80px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.02em" }}>
            {["Claude", "for", "Small", "Business"].map((w, i) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${i * 0.08}s`, marginRight: "0.25em" }}>{w}</span>
            ))}
            <br />
            <span style={{ color: "#c8a96e", fontStyle: "italic" }}>
              {["shows", "what's", "possible."].map((w, i) => (
                <span key={i} className="hero-word" style={{ animationDelay: `${(i + 4) * 0.08}s`, marginRight: "0.25em" }}>{w}</span>
              ))}
            </span>
            <br />
            {["We", "build", "what's", "specific", "to", "you."].map((w, i) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${(i + 7) * 0.08}s`, marginRight: "0.25em", fontSize: "clamp(28px, 4vw, 52px)", color: "#a09880" }}>{w}</span>
            ))}
          </h1>

          <p className="dm" style={{ fontSize: 18, color: "#a09880", lineHeight: 1.7, marginBottom: 16, maxWidth: 560 }}>
            Anthropic's 15 generic skills are a starting point. We build the custom AI layer that knows your specific business — your data, your processes, your industry, your KPIs.
          </p>

          <p className="dm" style={{ fontSize: 14, color: "#6b6458", lineHeight: 1.6, marginBottom: 40, maxWidth: 500 }}>
            Built by Chris, a former Fortune 500 operations consultant with 10 years in CPG, pharma, and food & bev — who also builds the solutions himself.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <a href="https://ai-assessment-lake.vercel.app" className="btn-primary">
              Start Free Assessment →
            </a>
            <a href="#how-it-works" className="btn-ghost">See How It Works</a>
          </div>

          <div className="dm" style={{ marginTop: 48, padding: "20px 24px", background: "rgba(200,169,110,0.05)", borderLeft: "2px solid #c8a96e", maxWidth: 500 }}>
            <div style={{ fontSize: 12, color: "#6b6458", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Right now, your team is probably...</div>
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="pain-item" style={{ fontSize: 14, color: i === activeStep ? "#f0ede8" : "transparent", position: i === 0 ? "relative" : "absolute", height: i === activeStep ? "auto" : 0, overflow: "hidden", transition: "color 0.5s" }}>
                {i === activeStep && `"${p}"`}
              </div>
            ))}
            <div style={{ fontSize: 14, color: "#c8a96e", marginTop: 8 }}>Sound familiar? Let's fix it.</div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "rgba(200,169,110,0.06)", borderTop: "1px solid rgba(200,169,110,0.15)", borderBottom: "1px solid rgba(200,169,110,0.15)", padding: "32px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#c8a96e", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div className="dm" style={{ fontSize: 12, color: "#6b6458", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "120px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div ref={registerRef("hiw-head")} className={`fade-up ${isVisible("hiw-head") ? "visible" : ""}`} style={{ marginBottom: 80, maxWidth: 600 }}>
            <div className="dm tag-pill" style={{ background: "rgba(200,169,110,0.08)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)", marginBottom: 20 }}>How It Works</div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Assess. Build. <span style={{ color: "#c8a96e", fontStyle: "italic" }}>Run.</span>
            </h2>
            <p className="dm" style={{ fontSize: 16, color: "#6b6458", marginTop: 16, lineHeight: 1.7 }}>
              Three stages designed to get you from "I think we could be more efficient" to a business that runs smarter — without a six-month consulting engagement.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {SOLUTIONS.map((s, i) => (
              <div
                key={i}
                ref={registerRef(`sol-${i}`)}
                className={`card-hover scale-in ${isVisible(`sol-${i}`) ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 0.15}s`, position: "relative", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,169,110,0.12)", padding: "40px 48px", display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}
              >
                <div className="step-number">{s.step}</div>

                <div style={{ flex: "0 0 auto" }}>
                  <div style={{ width: 56, height: 56, background: `${s.accent}15`, border: `1px solid ${s.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                    {s.icon}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="dm tag-pill" style={{ background: `${s.accent}12`, color: s.accent, border: `1px solid ${s.accent}30`, marginBottom: 12 }}>{s.tag}</div>
                  <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{s.name}</h3>
                  <p style={{ fontSize: 16, color: "#c8a96e", fontStyle: "italic", marginBottom: 16 }}>{s.tagline}</p>
                  <p className="dm" style={{ fontSize: 15, color: "#a09880", lineHeight: 1.7, maxWidth: 540 }}>{s.description}</p>
                </div>

                <div style={{ flex: "0 0 auto", alignSelf: "center" }}>
                  <a href={s.href} className="btn-primary" style={{ background: s.accent === "#f97316" ? "#c8a96e" : "transparent", border: s.accent === "#f97316" ? "none" : `1px solid ${s.accent}`, color: s.accent === "#f97316" ? "#0a0a0f" : s.accent, whiteSpace: "nowrap" }}>
                    {s.cta} →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Connector lines */}
          <div className="dm" style={{ display: "flex", justifyContent: "center", gap: 80, marginTop: 48, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", color: "#6b6458", fontSize: 13 }}>
              <div style={{ color: "#c8a96e", fontSize: 20, marginBottom: 4 }}>↓</div>
              Your gaps, clearly mapped
            </div>
            <div style={{ textAlign: "center", color: "#6b6458", fontSize: 13 }}>
              <div style={{ color: "#a855f7", fontSize: 20, marginBottom: 4 }}>↓</div>
              Your biggest win, built fast
            </div>
            <div style={{ textAlign: "center", color: "#6b6458", fontSize: 13 }}>
              <div style={{ color: "#06b6d4", fontSize: 20, marginBottom: 4 }}>∞</div>
              Compounding leverage, ongoing
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "120px 48px", background: "rgba(200,169,110,0.03)", borderTop: "1px solid rgba(200,169,110,0.1)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div ref={registerRef("about-left")} className={`fade-up ${isVisible("about-left") ? "visible" : ""}`} style={{ flex: "0 0 260px" }}>
            <div style={{ width: 200, height: 200, background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: 80, opacity: 0.3 }}>🐉</div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px", background: "rgba(10,10,15,0.8)" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Chris</div>
                <div className="dm" style={{ fontSize: 11, color: "#c8a96e", letterSpacing: "0.08em", textTransform: "uppercase" }}>Founder · DragonScale</div>
              </div>
            </div>
          </div>

          <div ref={registerRef("about-right")} className={`fade-up d1 ${isVisible("about-right") ? "visible" : ""}`} style={{ flex: 1, minWidth: 280 }}>
            <div className="dm tag-pill" style={{ background: "rgba(200,169,110,0.08)", color: "#c8a96e", border: "1px solid rgba(200,169,110,0.2)", marginBottom: 24 }}>About</div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
              Not a typical consultant.<br />
              <span style={{ color: "#c8a96e", fontStyle: "italic" }}>I build the solutions myself.</span>
            </h2>
            <div className="dm" style={{ color: "#a09880", lineHeight: 1.8, fontSize: 15, display: "flex", flexDirection: "column", gap: 16 }}>
              <p>I spent 10 years as an operations consultant working with Fortune 500 companies in CPG, food & beverage, pharma, and life sciences — optimizing supply chains, demand planning, S&OP, procurement, and inventory systems.</p>
              <p>I've seen what breaks at scale. I know what's actually automatable vs. what sounds good in a slide deck. And unlike most AI consultants, I build the actual solutions myself using the latest AI tools.</p>
              <p>DragonScale exists because the same operational leverage that Fortune 500 companies take for granted is now available to businesses a fraction of their size — if you have someone who knows where to apply it.</p>
            </div>
            <div style={{ marginTop: 32, padding: "20px 24px", borderLeft: "2px solid #c8a96e", background: "rgba(200,169,110,0.04)" }}>
              <p style={{ fontSize: 16, fontStyle: "italic", color: "#f0ede8", lineHeight: 1.6 }}>
                "The koi doesn't become a dragon by trying harder. It transforms by reaching the right conditions."
              </p>
              <div className="dm" style={{ fontSize: 12, color: "#6b6458", marginTop: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>The DragonScale Philosophy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="contact" style={{ padding: "120px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(200,169,110,0.07) 0%, transparent 70%)" }} />
        <div className="scale-pattern" style={{ position: "absolute", inset: 0 }} />

        <div ref={registerRef("cta")} className={`fade-up ${isVisible("cta") ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, transparent, #c8a96e)", margin: "0 auto 40px" }} />
          <h2 style={{ fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Ready to find out what<br />
            <span style={{ color: "#c8a96e", fontStyle: "italic" }}>AI can actually do</span><br />
            for your business?
          </h2>
          <p className="dm" style={{ fontSize: 16, color: "#a09880", lineHeight: 1.7, marginBottom: 48, maxWidth: 480, margin: "0 auto 48px" }}>
            The assessment takes 8 minutes. The report is generated by AI and personalized to your industry. It's free, and you'll walk away knowing exactly where your biggest leverage points are.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://ai-assessment-lake.vercel.app" className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
              Start Free Assessment →
            </a>
            <a href="mailto:hello@dragonscale.ai" className="btn-ghost" style={{ fontSize: 16, padding: "16px 40px" }}>
              Book a Call
            </a>
          </div>
          <div className="dm" style={{ marginTop: 24, fontSize: 13, color: "#6b6458" }}>
            Free · 8 minutes · Personalized to your industry · No pitch on the other side
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(200,169,110,0.15)", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="dm" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.02em" }}>DragonScale</div>
          <div className="dm" style={{ fontSize: 12, color: "#6b6458" }}>AI Operations</div>
        </div>
        <div className="dm" style={{ fontSize: 12, color: "#6b6458" }}>
          © 2026 DragonScale · Built by an operator, for operators.
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Assess", "Build", "Brain"].map(l => (
            <a key={l} href="#" className="dm" style={{ fontSize: 13, color: "#6b6458", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#c8a96e"}
              onMouseLeave={e => e.target.style.color = "#6b6458"}>
              DragonScale {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
