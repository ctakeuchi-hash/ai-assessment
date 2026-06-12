"use client";

import { useState, useEffect } from "react";

const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`;

const CSS = `
${GFONTS}
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#08090f;--surface:#0e1018;--border:#1c2030;--border2:#242838;
  --text:#ddd8cc;--muted:#58647a;--dim:#2a3040;
  --gold:#e8a020;--gold2:#f5c040;--blue:#4a9eff;--teal:#38d4a0;--rose:#e85858;--ind:#a060f0;
}
body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;font-size:15px;line-height:1.6}
.noise{position:fixed;inset:0;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
.glow{position:fixed;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(232,160,32,.06) 0%,transparent 65%);top:-200px;right:-200px;pointer-events:none;z-index:0}

.gate{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;padding:2rem}
.gate-card{background:var(--surface);border:1px solid var(--border);padding:2.5rem;width:100%;max-width:380px}
.gate-kicker{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
.gate-title{font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#f0ead8;margin-bottom:1.5rem}
.gate-input{width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:'Outfit',sans-serif;font-size:.92rem;padding:.8rem 1rem;outline:none;margin-bottom:1rem;transition:border-color .2s}
.gate-input:focus{border-color:var(--gold)}
.gate-btn{width:100%;background:var(--gold);color:#08090f;font-family:'Outfit',sans-serif;font-size:.88rem;font-weight:600;padding:.85rem;border:none;cursor:pointer;letter-spacing:.02em;transition:background .2s}
.gate-btn:hover{background:var(--gold2)}
.gate-btn:disabled{opacity:.4;cursor:not-allowed}
.gate-err{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--rose);margin-top:.75rem;text-align:center}

.wrap{max-width:1000px;margin:0 auto;padding:2rem 1.5rem 6rem;position:relative;z-index:1}

.nav{padding:1.5rem 0 2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);margin-bottom:2rem}
.brand{font-family:'DM Mono',monospace;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.brand-sub{font-size:.58rem;color:var(--muted);letter-spacing:.06em;text-transform:none;margin-top:.15rem}
.sign-out{background:transparent;border:none;cursor:pointer;color:var(--dim);font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;padding:.4rem .6rem;transition:color .2s}
.sign-out:hover{color:var(--muted)}

.leads-hdr{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:1.5rem}
.leads-title{font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:#f0ead8}
.leads-count{font-family:'DM Mono',monospace;font-size:.62rem;color:var(--muted);margin-top:.25rem}
.refresh-btn{background:transparent;border:1px solid var(--border);color:var(--muted);font-family:'DM Mono',monospace;font-size:.58rem;padding:.5rem .8rem;cursor:pointer;text-transform:uppercase;letter-spacing:.08em;transition:all .2s}
.refresh-btn:hover{border-color:var(--border2);color:var(--text)}

.table{width:100%;border-collapse:collapse}
.table th{font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);padding:.65rem 1rem;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
.table td{padding:.9rem 1rem;border-bottom:1px solid var(--border);font-size:.88rem;color:var(--text);vertical-align:middle}
.table tbody tr{cursor:pointer;transition:background .1s}
.table tbody tr:hover td{background:#0d1020}
.score-badge{font-family:'DM Mono',monospace;font-size:.68rem;padding:.25rem .6rem;border:1px solid}
.score-low{color:#b07010;border-color:#3a2008;background:#100800}
.score-mid{color:#2870c0;border-color:#082038;background:#000810}
.score-high{color:#20a070;border-color:#083028;background:#001008}
.date-cell{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--muted)}
.empty{text-align:center;padding:3rem 1rem;color:var(--muted);font-size:.9rem}

.back-btn{display:inline-flex;align-items:center;gap:.4rem;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif;font-size:.82rem;padding:.65rem .9rem;border:1px solid var(--border);cursor:pointer;transition:all .2s;margin-bottom:2rem}
.back-btn:hover{color:var(--text);border-color:var(--border2)}

.prospect-hdr{background:var(--surface);border:1px solid var(--border);border-top:2px solid var(--gold);padding:1.5rem;margin-bottom:1.5rem}
.prospect-co{font-family:'Cormorant Garamond',serif;font-size:1.9rem;color:#f0ead8;margin-bottom:.3rem}
.prospect-meta{font-family:'DM Mono',monospace;font-size:.63rem;color:var(--muted);margin-bottom:1.2rem;line-height:1.8}
.score-row{display:flex;gap:2rem;flex-wrap:wrap}
.score-item{text-align:center}
.score-num{font-family:'DM Mono',monospace;font-size:1.25rem;line-height:1}
.score-lbl{font-family:'DM Mono',monospace;font-size:.55rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-top:.3rem}

.gen-btn{display:inline-flex;align-items:center;gap:.6rem;background:var(--gold);color:#08090f;font-family:'Outfit',sans-serif;font-size:.88rem;font-weight:600;padding:.85rem 1.75rem;border:none;cursor:pointer;transition:all .2s;letter-spacing:.02em}
.gen-btn:hover{background:var(--gold2);transform:translateY(-1px)}
.gen-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}
.loading-msg{font-family:'DM Mono',monospace;font-size:.68rem;color:var(--muted);margin-top:.9rem;letter-spacing:.05em}
.res-err{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--rose);margin-top:.75rem}

.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(8,9,15,.3);border-top-color:#08090f;border-radius:50%;animation:spin .6s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}

.research-wrap{display:flex;flex-direction:column;gap:1rem;margin-top:1.75rem}
.res-section{background:var(--surface);border:1px solid var(--border);padding:1.25rem 1.5rem}
.res-kicker{font-family:'DM Mono',monospace;font-size:.6rem;text-transform:uppercase;letter-spacing:.15em;margin-bottom:.8rem}
.res-text{font-size:.88rem;color:#a0b0c0;line-height:1.75}
.res-item{padding:.65rem 1rem;margin-bottom:.5rem;border-left:2px solid var(--border);background:#030508}
.res-item:last-child{margin-bottom:0}
.res-item-name{font-family:'DM Mono',monospace;font-size:.72rem;font-weight:500;color:#d0c8bc;margin-bottom:.3rem}
.res-item-notes{font-size:.83rem;color:#7a8898;line-height:1.55}
.starter-item{display:flex;align-items:flex-start;gap:.7rem;padding:.65rem 1rem;background:#030508;border:1px solid var(--border);margin-bottom:.45rem;font-size:.85rem;color:#b8c8d8;line-height:1.55}
.starter-num{font-family:'DM Mono',monospace;font-size:.65rem;color:var(--ind);min-width:18px;flex-shrink:0;margin-top:.15rem}
.watch-item{padding:.65rem 1rem;background:#030508;border-left:2px solid var(--rose);margin-bottom:.45rem;font-size:.85rem;color:#c0a8a8;line-height:1.55}
.fallback-links{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:.6rem}
.fallback-link{font-family:'DM Mono',monospace;font-size:.63rem;color:var(--blue);text-decoration:none;padding:.3rem .65rem;border:1px solid #0a2040;background:#000810;transition:all .2s}
.fallback-link:hover{border-color:var(--blue)}
`;

export default function PrepPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [researching, setResearching] = useState(false);
  const [research, setResearch] = useState(null);
  const [resErr, setResErr] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("adminPw");
    if (saved) loadLeads(saved);
  }, []);

  async function loadLeads(password) {
    setLeadsLoading(true);
    setAuthErr("");
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { "x-admin-password": password }
      });
      if (res.status === 401) {
        sessionStorage.removeItem("adminPw");
        setAuthed(false);
        setAuthErr("Incorrect password.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load leads");
      const data = await res.json();
      sessionStorage.setItem("adminPw", password);
      setAuthed(true);
      setLeads(data.records || []);
    } catch (e) {
      setAuthErr("Something went wrong. Try again.");
    } finally {
      setLeadsLoading(false);
      setAuthLoading(false);
    }
  }

  async function handleLogin() {
    if (!pw) return;
    setAuthLoading(true);
    await loadLeads(pw);
  }

  async function generateResearch(lead) {
    const fields = lead.fields;
    setResearching(true);
    setResearch(null);
    setResErr("");
    try {
      const res = await fetch("/api/admin/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": sessionStorage.getItem("adminPw") || ""
        },
        body: JSON.stringify({
          company: fields["Company Name"] || "",
          industry: fields["Industry"] || "",
          size: fields["Company Size"] || "",
          role: fields["Role"] || "",
          scores: {
            ai: fields["AI Readiness Score"] ?? 0,
            ops: fields["Operations Score"] ?? 0,
            growth: fields["Growth Score"] ?? 0,
            overall: fields["Overall Score"] ?? 0
          },
          report: fields["Assessment Report"] || ""
        })
      });
      if (res.status === 401) {
        sessionStorage.removeItem("adminPw");
        setAuthed(false);
        return;
      }
      if (!res.ok) throw new Error("Research generation failed");
      const data = await res.json();
      setResearch(data.research);
    } catch (e) {
      setResErr("Failed to generate research. Please try again.");
    } finally {
      setResearching(false);
    }
  }

  function scoreBadgeClass(overall) {
    if (overall >= 22) return "score-badge score-high";
    if (overall >= 12) return "score-badge score-mid";
    return "score-badge score-low";
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function signOut() {
    sessionStorage.removeItem("adminPw");
    setAuthed(false);
    setLeads([]);
    setSelected(null);
    setResearch(null);
  }

  if (!authed) {
    return (
      <>
        <style>{CSS}</style>
        <div className="noise" /><div className="glow" />
        <div className="gate">
          <div className="gate-card">
            <div className="gate-kicker">Hash Digital</div>
            <div className="gate-title">Pre-Call Research</div>
            <input
              type="password"
              className="gate-input"
              placeholder="Admin password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoFocus
            />
            <button className="gate-btn" onClick={handleLogin} disabled={authLoading || !pw}>
              {authLoading ? "Checking..." : "Enter →"}
            </button>
            {authErr && <div className="gate-err">{authErr}</div>}
          </div>
        </div>
      </>
    );
  }

  if (selected) {
    const f = selected.fields;
    const aiS = f["AI Readiness Score"] ?? 0;
    const opsS = f["Operations Score"] ?? 0;
    const grS = f["Growth Score"] ?? 0;
    const overall = f["Overall Score"] ?? 0;

    return (
      <>
        <style>{CSS}</style>
        <div className="noise" /><div className="glow" />
        <div className="wrap">
          <div className="nav">
            <div className="brand">
              <div>Pre-Call Research</div>
              <div className="brand-sub">Hash Digital · Internal</div>
            </div>
            <button className="sign-out" onClick={signOut}>Sign out</button>
          </div>

          <button className="back-btn" onClick={() => { setSelected(null); setResearch(null); setResErr(""); }}>
            ← All Leads
          </button>

          <div className="prospect-hdr">
            <div className="prospect-co">{f["Company Name"] || "Unknown Company"}</div>
            <div className="prospect-meta">
              {[f["Industry"], f["Company Size"], f["Role"]].filter(Boolean).join("  ·  ")}
              {f["Email"] ? `  ·  ${f["Email"]}` : ""}
              {f["Submitted At"] ? `  ·  ${fmtDate(f["Submitted At"])}` : ""}
            </div>
            <div className="score-row">
              <div className="score-item">
                <div className="score-num" style={{color:"var(--gold)"}}>{aiS}<span style={{fontSize:".6rem",color:"var(--muted)"}}>/12</span></div>
                <div className="score-lbl">AI Readiness</div>
              </div>
              <div className="score-item">
                <div className="score-num" style={{color:"var(--blue)"}}>{opsS}<span style={{fontSize:".6rem",color:"var(--muted)"}}>/12</span></div>
                <div className="score-lbl">Operations</div>
              </div>
              <div className="score-item">
                <div className="score-num" style={{color:"var(--teal)"}}>{grS}<span style={{fontSize:".6rem",color:"var(--muted)"}}>/12</span></div>
                <div className="score-lbl">Growth</div>
              </div>
              <div className="score-item">
                <div className="score-num" style={{color:"var(--gold2)"}}>{overall}<span style={{fontSize:".6rem",color:"var(--muted)"}}>/36</span></div>
                <div className="score-lbl">Overall</div>
              </div>
            </div>
          </div>

          <button className="gen-btn" onClick={() => generateResearch(selected)} disabled={researching}>
            {researching ? <><span className="spinner" /> Researching...</> : "Generate Research Brief"}
          </button>
          {researching && <div className="loading-msg">Analyzing company, competitors, and automation opportunities...</div>}
          {resErr && <div className="res-err">{resErr}</div>}

          {research && (
            <div className="research-wrap">

              <div className="res-section" style={{borderTopWidth:"2px",borderTopColor:"var(--gold)"}}>
                <div className="res-kicker" style={{color:"var(--gold)"}}>Company Profile</div>
                <div className="res-text">{research.companyProfile}</div>
              </div>

              <div className="res-section" style={{borderTopWidth:"2px",borderTopColor:"var(--ind)"}}>
                <div className="res-kicker" style={{color:"var(--ind)"}}>Survey Insights</div>
                <div className="res-text">{research.surveyInsights}</div>
              </div>

              {f["Assessment Report"] && (
                <div className="res-section">
                  <div className="res-kicker" style={{color:"var(--muted)"}}>Assessment Summary</div>
                  <div className="res-text">{f["Assessment Report"]}</div>
                </div>
              )}

              <div className="res-section">
                <div className="res-kicker" style={{color:"var(--blue)"}}>Competitor Landscape</div>
                {(research.competitors || []).map((c, i) => (
                  <div key={i} className="res-item" style={{borderLeftColor:"var(--blue)"}}>
                    <div className="res-item-name">{c.name}</div>
                    <div className="res-item-notes">{c.notes}</div>
                  </div>
                ))}
              </div>

              <div className="res-section">
                <div className="res-kicker" style={{color:"var(--teal)"}}>Industry Trends</div>
                {(research.industryTrends || []).map((t, i) => (
                  <div key={i} className="res-item" style={{borderLeftColor:"var(--teal)"}}>
                    <div className="res-item-name">{t.trend}</div>
                    <div className="res-item-notes">{t.relevance}</div>
                  </div>
                ))}
              </div>

              <div className="res-section">
                <div className="res-kicker" style={{color:"var(--gold)"}}>Automation Opportunities</div>
                {(research.automationOpportunities || []).map((o, i) => (
                  <div key={i} className="res-item" style={{borderLeftColor:"var(--gold)"}}>
                    <div className="res-item-name">{o.area}</div>
                    <div className="res-item-notes">{o.description}</div>
                  </div>
                ))}
              </div>

              {(research.reviewSummary || research.fallbackLinks) && (
                <div className="res-section">
                  <div className="res-kicker" style={{color:"var(--muted)"}}>
                    {research.reviewSummary ? "Customer Review Sentiment" : "Review Search Links"}
                  </div>
                  {research.reviewSummary && <div className="res-text">{research.reviewSummary}</div>}
                  {research.reviewLinks?.map((r, i) => (
                    <div key={i} style={{marginTop:".5rem"}}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{fontFamily:"DM Mono,monospace",fontSize:".65rem",color:"var(--blue)",textDecoration:"none"}}>
                        {r.title} ↗
                      </a>
                    </div>
                  ))}
                  {research.fallbackLinks && (
                    <>
                      <div style={{fontSize:".82rem",color:"var(--muted)",marginBottom:".5rem"}}>No live review data — search manually:</div>
                      <div className="fallback-links">
                        {research.fallbackLinks.map((l, i) => (
                          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="fallback-link">{l.label} ↗</a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="res-section">
                <div className="res-kicker" style={{color:"var(--ind)"}}>Conversation Starters</div>
                {(research.conversationStarters || []).map((s, i) => (
                  <div key={i} className="starter-item">
                    <span className="starter-num">{i + 1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <div className="res-section">
                <div className="res-kicker" style={{color:"var(--rose)"}}>Watch For</div>
                {(research.watchFor || []).map((w, i) => (
                  <div key={i} className="watch-item">{w}</div>
                ))}
              </div>

            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="noise" /><div className="glow" />
      <div className="wrap">
        <div className="nav">
          <div className="brand">
            <div>Pre-Call Research</div>
            <div className="brand-sub">Hash Digital · Internal</div>
          </div>
          <button className="sign-out" onClick={signOut}>Sign out</button>
        </div>

        <div className="leads-hdr">
          <div>
            <div className="leads-title">Leads</div>
            <div className="leads-count">{leads.length} record{leads.length !== 1 ? "s" : ""}</div>
          </div>
          <button className="refresh-btn" onClick={() => loadLeads(sessionStorage.getItem("adminPw") || "")} disabled={leadsLoading}>
            {leadsLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="empty">No leads yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Size</th>
                <th>Role</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const lf = lead.fields;
                const overall = lf["Overall Score"] ?? 0;
                return (
                  <tr key={lead.id} onClick={() => { setSelected(lead); setResearch(null); setResErr(""); }}>
                    <td style={{fontWeight:500,color:"#f0ead8"}}>{lf["Company Name"] || "—"}</td>
                    <td style={{color:"var(--muted)",fontSize:".83rem"}}>{lf["Industry"] || "—"}</td>
                    <td style={{color:"var(--muted)",fontSize:".83rem"}}>{lf["Company Size"] || "—"}</td>
                    <td style={{color:"var(--muted)",fontSize:".83rem"}}>{lf["Role"] || "—"}</td>
                    <td><span className={scoreBadgeClass(overall)}>{overall}/36</span></td>
                    <td className="date-cell">{fmtDate(lf["Submitted At"])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
