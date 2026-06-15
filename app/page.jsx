"use client";

const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`;

const CSS = `
${GFONTS}
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#08090f;--surface:#0e1018;--border:#1c2030;--border2:#242838;
  --text:#ddd8cc;--muted:#58647a;--dim:#2a3040;
  --gold:#e8a020;--gold2:#f5c040;--blue:#4a9eff;--teal:#38d4a0;--rose:#e85858;
}
body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;font-size:15px;line-height:1.6}
.app{min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column}
.noise{position:fixed;inset:0;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
.glow{position:fixed;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(232,160,32,.07) 0%,transparent 65%);top:-250px;right:-250px;pointer-events:none;z-index:0}
.glow2{position:fixed;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(74,158,255,.04) 0%,transparent 65%);bottom:-200px;left:-200px;pointer-events:none;z-index:0}
.wrap{max-width:720px;margin:0 auto;padding:2.5rem 1.5rem 6rem;position:relative;z-index:1;flex:1}

/* NAV */
.nav{padding:1.75rem 0 2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);margin-bottom:5rem}
.brand{font-family:'DM Mono',monospace;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.brand-sub{font-size:.58rem;color:var(--muted);letter-spacing:.08em;text-transform:none;margin-top:.15rem}
.nav-link{font-family:'DM Mono',monospace;font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;text-decoration:none;transition:color .2s}
.nav-link:hover{color:var(--text)}

/* HERO */
.kicker{font-family:'DM Mono',monospace;font-size:.63rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem;display:flex;align-items:center;gap:.75rem}
.kicker-line{flex:1;height:1px;background:linear-gradient(90deg,var(--border),transparent);max-width:60px}
.hero-h{font-family:'Cormorant Garamond',serif;font-size:clamp(2.8rem,7vw,4.8rem);line-height:1.05;color:#f0ead8;margin-bottom:1.5rem;letter-spacing:-.01em}
.hero-h em{font-style:italic;color:var(--gold)}
.hero-p{font-size:1rem;color:var(--muted);line-height:1.85;max-width:520px;margin-bottom:3rem}

/* TRACKS */
.tracks{display:grid;grid-template-columns:repeat(3,1fr);gap:.875rem;margin-bottom:3.5rem}
.track{background:var(--surface);border:1px solid var(--border);padding:1.5rem 1.25rem;border-top:2px solid;position:relative;overflow:hidden}
.track::after{content:'';position:absolute;inset:0;opacity:0;background:linear-gradient(135deg,rgba(255,255,255,.02),transparent);transition:opacity .2s}
.track:hover::after{opacity:1}
.track:nth-child(1){border-top-color:var(--gold)}
.track:nth-child(2){border-top-color:var(--blue)}
.track:nth-child(3){border-top-color:var(--teal)}
.track-icon{font-size:1.5rem;margin-bottom:.6rem}
.track-name{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#90a0b0;margin-bottom:.35rem}
.track-desc{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--dim);line-height:1.5}

/* CTAS */
.cta-row{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:5rem}
.btn-primary{display:inline-flex;align-items:center;gap:.5rem;background:var(--gold);color:#08090f;font-family:'Outfit',sans-serif;font-size:.92rem;font-weight:600;padding:1rem 2rem;border:none;cursor:pointer;transition:all .2s;text-decoration:none;letter-spacing:.01em}
.btn-primary:hover{background:var(--gold2);transform:translateY(-1px)}
.btn-secondary{display:inline-flex;align-items:center;gap:.4rem;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif;font-size:.86rem;padding:1rem 1.5rem;border:1px solid var(--border);cursor:pointer;transition:all .2s;text-decoration:none}
.btn-secondary:hover{color:var(--text);border-color:var(--border2)}
.cta-note{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-top:.75rem;width:100%}

/* DIVIDER */
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin-bottom:4rem}

/* WHAT YOU GET */
.section-label{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:2rem}
.deliverables{display:grid;grid-template-columns:1fr 1fr;gap:.875rem;margin-bottom:5rem}
.del{background:var(--surface);border:1px solid var(--border);border-left:2px solid var(--border2);padding:1.25rem 1.4rem}
.del:nth-child(1){border-left-color:var(--gold)}
.del:nth-child(2){border-left-color:var(--blue)}
.del:nth-child(3){border-left-color:var(--teal)}
.del:nth-child(4){border-left-color:#a060f0}
.del-title{font-size:.85rem;font-weight:600;color:#b8ccdc;margin-bottom:.3rem}
.del-desc{font-size:.78rem;color:var(--muted);line-height:1.55}

/* FOOTER */
.footer{border-top:1px solid var(--border);padding:2rem 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.875rem}
.footer-txt{font-family:'DM Mono',monospace;font-size:.55rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em}
.footer-link{font-family:'DM Mono',monospace;font-size:.55rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;text-decoration:none;transition:color .2s}
.footer-link:hover{color:var(--text)}

@media(max-width:580px){
  .tracks,.deliverables{grid-template-columns:1fr}
  .nav{margin-bottom:3.5rem}
  .hero-h{font-size:2.6rem}
  .cta-row{flex-direction:column;align-items:flex-start}
  .btn-primary,.btn-secondary{width:100%;justify-content:center}
}
`;

export default function Home() {
  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="noise"/><div className="glow"/><div className="glow2"/>
        <div className="wrap">

          {/* NAV */}
          <div className="nav">
            <div className="brand">
              <div>DragonScale</div>
              <div className="brand-sub">Business Intelligence</div>
            </div>
            <a href="https://calendly.com/ctakeuchi" target="_blank" rel="noopener noreferrer" className="nav-link">Book a Call</a>
          </div>

          {/* HERO */}
          <div className="kicker">
            <span>Free · 8 Minutes · Personalized</span>
            <div className="kicker-line"/>
          </div>
          <h1 className="hero-h">How efficient<br/>is your <em>business,</em><br/>really?</h1>
          <p className="hero-p">Answer questions across three tracks plus an industry-specific deep dive. Get a personalized report with your gaps, blind spots, quick wins, and a 90-day roadmap.</p>

          {/* TRACKS */}
          <div className="tracks">
            <div className="track">
              <div className="track-icon">⚡</div>
              <div className="track-name">Readiness</div>
              <div className="track-desc">5 questions</div>
            </div>
            <div className="track">
              <div className="track-icon">⚙️</div>
              <div className="track-name">Operations</div>
              <div className="track-desc">5 questions</div>
            </div>
            <div className="track">
              <div className="track-icon">📈</div>
              <div className="track-name">Growth & Sales</div>
              <div className="track-desc">5 questions</div>
            </div>
          </div>

          {/* CTAS */}
          <div className="cta-row">
            <a href="/assessment" className="btn-primary">Take the Free Assessment →</a>
            <a href="https://calendly.com/ctakeuchi" target="_blank" rel="noopener noreferrer" className="btn-secondary">Book a Strategy Call</a>
            <div className="cta-note">No signup required · Results emailed instantly</div>
          </div>

          <div className="divider"/>

          {/* WHAT YOU GET */}
          <div className="section-label">What you'll receive</div>
          <div className="deliverables">
            <div className="del">
              <div className="del-title">Overall Score & Maturity Level</div>
              <div className="del-desc">See exactly where you stand across Readiness, Operations, and Growth — scored and benchmarked.</div>
            </div>
            <div className="del">
              <div className="del-title">Your Blind Spots</div>
              <div className="del-desc">The gaps you're not thinking about — specific to your industry and the answers you gave.</div>
            </div>
            <div className="del">
              <div className="del-title">Quick Wins</div>
              <div className="del-desc">Four high-leverage moves ranked by effort and ROI, matched to your current situation.</div>
            </div>
            <div className="del">
              <div className="del-title">90-Day Roadmap</div>
              <div className="del-desc">A sequenced action plan — phased by effort and impact — so you know exactly what to do first.</div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="footer">
            <div className="footer-txt">DragonScale · Business Intelligence</div>
            <a href="/assessment" className="footer-link">Start Assessment →</a>
          </div>

        </div>
      </div>
    </>
  );
}
