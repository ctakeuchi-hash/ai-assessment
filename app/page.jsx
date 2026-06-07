"use client";

import { useState } from "react";

/* ── FONTS ── */
const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`;

/* ── STYLES ── */
const CSS = `
${GFONTS}
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#08090f;--surface:#0e1018;--border:#1c2030;--border2:#242838;
  --text:#ddd8cc;--muted:#58647a;--dim:#2a3040;
  --gold:#e8a020;--gold2:#f5c040;--blue:#4a9eff;--teal:#38d4a0;--rose:#e85858;
}
body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;font-size:15px;line-height:1.6}
.app{min-height:100vh;position:relative;overflow:hidden}
.noise{position:fixed;inset:0;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
.glow{position:fixed;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(232,160,32,.06) 0%,transparent 65%);top:-200px;right:-200px;pointer-events:none;z-index:0}
.wrap{max-width:700px;margin:0 auto;padding:2rem 1.5rem 6rem;position:relative;z-index:1}

/* NAV */
.nav{padding:2rem 0 2.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);margin-bottom:3rem}
.brand{font-family:'DM Mono',monospace;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);opacity:.7}
.nav-right{font-family:'DM Mono',monospace;font-size:.6rem;color:var(--dim);text-transform:uppercase;letter-spacing:.1em}

/* PROGRESS */
.prog-wrap{margin-bottom:3rem}
.prog-track{height:1px;background:var(--border);position:relative}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));transition:width .6s ease;position:absolute;top:0;left:0}
.prog-dots{display:flex;justify-content:space-between;margin-top:.5rem}
.prog-dot{font-family:'DM Mono',monospace;font-size:.55rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em}
.prog-dot.active{color:var(--gold)}

/* INTRO */
.intro-kicker{font-family:'DM Mono',monospace;font-size:.63rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:1.25rem}
.intro-h{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,6vw,4rem);line-height:1.08;color:#f0ead8;margin-bottom:1.25rem}
.intro-h em{font-style:italic;color:var(--gold)}
.intro-p{font-size:.95rem;color:var(--muted);line-height:1.8;max-width:520px;margin-bottom:2.5rem}
.track-pills{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:3rem}
.tp{background:var(--surface);border:1px solid var(--border);padding:1.25rem;border-top:2px solid}
.tp:nth-child(1){border-top-color:var(--gold)}
.tp:nth-child(2){border-top-color:var(--blue)}
.tp:nth-child(3){border-top-color:var(--teal)}
.tp-icon{font-size:1.3rem;margin-bottom:.4rem}
.tp-name{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#90a0b0;margin-bottom:.2rem}
.tp-q{font-family:'DM Mono',monospace;font-size:.6rem;color:var(--dim)}

/* BIZ INFO */
.fgroup{margin-bottom:1.5rem}
.flabel{display:block;font-family:'DM Mono',monospace;font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:.5rem}
.finput,.fselect{width:100%;background:var(--surface);border:1px solid var(--border);color:var(--text);font-family:'Outfit',sans-serif;font-size:.92rem;padding:.8rem 1rem;outline:none;transition:border-color .2s;-webkit-appearance:none}
.finput:focus,.fselect:focus{border-color:var(--gold)}
.fselect option{background:var(--surface)}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}

/* SECTION */
.sec-kicker{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;margin-bottom:.4rem}
.k-gold{color:var(--gold)}.k-blue{color:var(--blue)}.k-teal{color:var(--teal)}.k-rose{color:var(--rose)}.k-ind{color:#a060f0}
.sec-title{font-family:'Cormorant Garamond',serif;font-size:1.75rem;color:#f0ead8;margin-bottom:.4rem;line-height:1.15}
.sec-desc{font-size:.85rem;color:var(--muted);margin-bottom:2rem;line-height:1.65}

/* QUESTIONS */
.qblock{margin-bottom:2.25rem}
.qnum{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--dim);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.4rem}
.qtext{font-size:.95rem;font-weight:500;color:#b8ccdc;margin-bottom:.9rem;line-height:1.5}
.opts{display:flex;flex-direction:column;gap:.4rem}
.opt{display:flex;align-items:flex-start;gap:.875rem;background:var(--surface);border:1px solid var(--border);color:var(--muted);font-family:'Outfit',sans-serif;font-size:.83rem;padding:.8rem 1.1rem;cursor:pointer;text-align:left;transition:all .15s;line-height:1.45}
.opt:hover{border-color:var(--border2);color:#b0c0d0;background:#101420}
.opt.sel-gold{border-color:var(--gold);color:#f0ead8;background:#120e02}
.opt.sel-blue{border-color:var(--blue);color:#f0ead8;background:#02080e}
.opt.sel-teal{border-color:var(--teal);color:#f0ead8;background:#021208}
.opt.sel-ind{border-color:#a060f0;color:#f0ead8;background:#08020e}
.opt-radio{width:7px;height:7px;border-radius:50%;border:1.5px solid var(--dim);flex-shrink:0;margin-top:.3rem;transition:all .15s}
.opt.sel-gold .opt-radio{border-color:var(--gold);background:var(--gold)}
.opt.sel-blue .opt-radio{border-color:var(--blue);background:var(--blue)}
.opt.sel-teal .opt-radio{border-color:var(--teal);background:var(--teal)}
.opt.sel-ind .opt-radio{border-color:#a060f0;background:#a060f0}

/* NAV ROW */
.nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.btn-back{display:inline-flex;align-items:center;gap:.4rem;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif;font-size:.82rem;padding:.65rem .9rem;border:1px solid var(--border);cursor:pointer;transition:all .2s}
.btn-back:hover{color:var(--text);border-color:var(--border2)}
.btn-next{display:inline-flex;align-items:center;gap:.5rem;background:var(--gold);color:#08090f;font-family:'Outfit',sans-serif;font-size:.88rem;font-weight:600;padding:.85rem 1.75rem;border:none;cursor:pointer;transition:all .2s;letter-spacing:.02em}
.btn-next:hover{background:var(--gold2);transform:translateY(-1px)}
.btn-next:disabled{opacity:.35;cursor:not-allowed;transform:none}

/* INDUSTRY BADGE */
.ind-badge{display:inline-flex;align-items:center;gap:.5rem;background:#0e0818;border:1px solid #2a1a48;padding:.4rem 1rem;margin-bottom:1.5rem}
.ind-badge-dot{width:6px;height:6px;border-radius:50%;background:#a060f0}
.ind-badge-txt{font-family:'DM Mono',monospace;font-size:.62rem;color:#8050c0;text-transform:uppercase;letter-spacing:.1em}

/* EMAIL CAPTURE (inline on results) */
.email-capture{background:linear-gradient(135deg,#0a0c18,#0e0a04);border:1px solid #2a2010;padding:2rem;margin-bottom:2.5rem}
.email-capture-title{font-family:'Cormorant Garamond',serif;font-size:1.35rem;color:#f0ead8;margin-bottom:.35rem}
.email-capture-desc{font-size:.82rem;color:var(--muted);margin-bottom:1.25rem;line-height:1.65}
.email-row{display:flex;gap:.75rem;align-items:flex-start}
.email-row .finput{flex:1}
.btn-email{display:inline-flex;align-items:center;gap:.4rem;background:transparent;border:1px solid var(--gold);color:var(--gold);font-family:'Outfit',sans-serif;font-size:.85rem;font-weight:500;padding:.82rem 1.4rem;cursor:pointer;transition:all .2s;white-space:nowrap;flex-shrink:0}
.btn-email:hover{background:#140e02}
.btn-email:disabled{opacity:.4;cursor:not-allowed}
.email-sent{font-family:'DM Mono',monospace;font-size:.68rem;color:var(--teal);text-transform:uppercase;letter-spacing:.1em;padding:.5rem 0}
.err{background:#1a0808;border:1px solid #4a1818;color:#f08080;font-size:.78rem;padding:.65rem .9rem;margin-top:.75rem}

/* LOADING */
.loading{text-align:center;padding:5rem 0}
.spin{width:44px;height:44px;border:1.5px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 2rem}
@keyframes spin{to{transform:rotate(360deg)}}
.load-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:#f0ead8;margin-bottom:.5rem}
.load-sub{font-size:.83rem;color:var(--muted);margin-bottom:1.5rem}
.load-steps{list-style:none}
.load-steps li{font-family:'DM Mono',monospace;font-size:.63rem;color:var(--dim);letter-spacing:.08em;padding:.25rem 0;transition:color .3s}
.load-steps li.ls-active{color:var(--gold)}
.load-steps li.ls-done{color:var(--muted)}

/* ─── RESULTS ─── */
.r-header{margin-bottom:2.5rem}
.r-kicker{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:.4rem}
.r-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,4vw,2.6rem);color:#f0ead8;line-height:1.1;margin-bottom:.75rem}
.r-chips{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:2rem}
.r-chip{font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.07em;color:var(--dim);background:var(--surface);border:1px solid var(--border);padding:.22rem .65rem}

/* SCORE */
.score-block{background:var(--surface);border:1px solid var(--border);padding:2rem 2.5rem;margin-bottom:1.5rem;display:grid;grid-template-columns:120px 1fr;gap:2.5rem;align-items:center}
.big-n{font-family:'Cormorant Garamond',serif;font-size:5.5rem;color:var(--gold);line-height:1}
.big-sub{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-top:.15rem}
.mat{display:inline-block;font-family:'DM Mono',monospace;font-size:.62rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:.28rem .85rem;margin-top:.6rem}
.mat-b{background:#140e02;color:var(--gold);border:1px solid #3a2808}
.mat-d{background:#020810;color:var(--blue);border:1px solid #0a1830}
.mat-g{background:#021008;color:var(--teal);border:1px solid #0a2818}
.mat-a{background:#081002;color:#90d040;border:1px solid #182808}
.r-summary{font-size:.88rem;color:#6a8098;line-height:1.8}
.r-summary strong{color:#a8c0d0}

.track-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.875rem;margin-bottom:2.5rem}
.tc{background:var(--surface);border:1px solid var(--border);border-top:2px solid;padding:1.25rem}
.tc1{border-top-color:var(--gold)}.tc2{border-top-color:var(--blue)}.tc3{border-top-color:var(--teal)}
.tc-name{font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem}
.tc-num{font-family:'Cormorant Garamond',serif;font-size:2rem;line-height:1;margin-bottom:.25rem}
.tc1 .tc-num{color:var(--gold)}.tc2 .tc-num{color:var(--blue)}.tc3 .tc-num{color:var(--teal)}
.tc-mat{font-family:'DM Mono',monospace;font-size:.56rem;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.6rem}
.tc1 .tc-mat{color:#a07010}.tc2 .tc-mat{color:#2870c0}.tc3 .tc-mat{color:#20a070}
.bar{height:2px;background:var(--border);overflow:hidden}
.bar-f{height:100%;transition:width 1.2s ease}
.tc1 .bar-f{background:var(--gold)}.tc2 .bar-f{background:var(--blue)}.tc3 .bar-f{background:var(--teal)}

/* RESULT SECTIONS */
.rsec{margin-bottom:2.5rem}
.rsec-hdr{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:.6rem;border-bottom:1px solid var(--border);margin-bottom:1.25rem}
.rsec-title{font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:#e0d8c8}
.rsec-sub{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em}

/* BLIND SPOTS */
.blind-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.875rem}
.blind-card{background:#0c0814;border:1px solid #201030;border-left:2px solid #8040d0;padding:1.25rem}
.blind-icon{font-size:1.25rem;margin-bottom:.4rem}
.blind-name{font-size:.8rem;font-weight:600;color:#c0a0e8;margin-bottom:.3rem}
.blind-desc{font-size:.78rem;color:#5a4868;line-height:1.55}

/* QUICK WINS */
.qw{display:flex;flex-direction:column;gap:.75rem}
.qw-card{background:var(--surface);border:1px solid var(--border);padding:1.4rem;display:grid;grid-template-columns:1fr auto;gap:1.25rem;align-items:start}
.qw-badge{font-family:'DM Mono',monospace;font-size:.56rem;text-transform:uppercase;letter-spacing:.1em;padding:.18rem .55rem;margin-bottom:.4rem;display:inline-block}
.bg-green{background:#021008;color:var(--teal);border:1px solid #0a2818}
.bg-gold{background:#140e02;color:var(--gold);border:1px solid #3a2808}
.bg-blue{background:#020810;color:var(--blue);border:1px solid #0a1830}
.bg-rose{background:#0e0202;color:var(--rose);border:1px solid #2a0808}
.qw-title{font-size:.87rem;font-weight:600;color:#b8ccdc;margin-bottom:.3rem}
.qw-desc{font-size:.8rem;color:var(--muted);line-height:1.6}
.qw-effort{display:flex;flex-direction:column;gap:.35rem;text-align:right;flex-shrink:0}
.ef-label{font-family:'DM Mono',monospace;font-size:.52rem;color:var(--dim);text-transform:uppercase;letter-spacing:.07em}
.ef-val{font-family:'DM Mono',monospace;font-size:.72rem}
.ef-low{color:var(--teal)}.ef-med{color:var(--gold)}.ef-high{color:var(--rose)}

/* RECS */
.rec{background:var(--surface);border:1px solid var(--border);border-left:2px solid;padding:1.3rem 1.4rem;margin-bottom:.75rem}
.r-gold{border-left-color:var(--gold)}.r-blue{border-left-color:var(--blue)}.r-teal{border-left-color:var(--teal)}
.rec-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:.875rem;margin-bottom:.35rem}
.rec-title{font-size:.87rem;font-weight:600;color:#b8ccdc;flex:1}
.rec-tag{font-family:'DM Mono',monospace;font-size:.55rem;text-transform:uppercase;letter-spacing:.08em;padding:.16rem .5rem;flex-shrink:0}
.r-gold .rec-tag{background:#140e02;color:#a07010}
.r-blue .rec-tag{background:#020810;color:#2870c0}
.r-teal .rec-tag{background:#021008;color:#20a070}
.rec-body{font-size:.81rem;color:var(--muted);line-height:1.65}
.rec-body strong{color:#7a9ab0}

/* ROADMAP */
.roadmap{border:1px solid var(--border);overflow:hidden}
.rm-ph{border-bottom:1px solid var(--border)}
.rm-ph:last-child{border-bottom:none}
.rm-ph-hdr{background:var(--surface);padding:.7rem 1.1rem;display:flex;align-items:center;gap:.875rem;cursor:pointer;user-select:none}
.rm-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.d1{background:var(--teal)}.d2{background:var(--gold)}.d3{background:var(--blue)}.d4{background:#a060f0}
.rm-ph-name{font-family:'DM Mono',monospace;font-size:.63rem;text-transform:uppercase;letter-spacing:.1em;color:#5a6878;flex:1}
.rm-ph-time{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--dim)}
.rm-chev{color:var(--dim);font-size:.65rem;transition:transform .2s}
.rm-chev.open{transform:rotate(180deg)}
.rm-cols-hdr{background:#0a0c14;padding:.45rem 1.1rem;display:grid;grid-template-columns:1fr 80px 80px 70px;gap:.875rem;border-top:1px solid var(--border)}
.rm-col-h{font-family:'DM Mono',monospace;font-size:.54rem;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);text-align:center}
.rm-col-h:first-child{text-align:left}
.rm-row{padding:.85rem 1.1rem;border-top:1px solid var(--border);display:grid;grid-template-columns:1fr 80px 80px 70px;gap:.875rem;align-items:center}
.rm-row:hover{background:#0c0f18}
.rm-item-name{font-size:.82rem;color:#8a9eb8}
.rm-item-sub{font-size:.72rem;color:var(--dim);margin-top:.15rem}
.rm-col{text-align:center}
.rm-val{font-family:'DM Mono',monospace;font-size:.7rem}
.effort-low{color:var(--teal)}.effort-med{color:var(--gold)}.effort-high{color:var(--rose)}

/* CTA */
.cta{background:linear-gradient(135deg,#0e0a04,#0a0e18);border:1px solid #302010;padding:2.5rem;text-align:center;margin-top:2.5rem}
.cta-title{font-family:'Cormorant Garamond',serif;font-size:1.7rem;color:#f0ead8;margin-bottom:.5rem}
.cta-desc{font-size:.85rem;color:var(--muted);margin-bottom:1.75rem;line-height:1.7;max-width:440px;margin-left:auto;margin-right:auto}
.cta-btns{display:flex;gap:.875rem;justify-content:center;flex-wrap:wrap}
.btn-p{display:inline-flex;align-items:center;gap:.4rem;background:var(--gold);color:#08090f;font-family:'Outfit',sans-serif;font-size:.88rem;font-weight:600;padding:.9rem 1.75rem;border:none;cursor:pointer;transition:all .2s}
.btn-p:hover{background:var(--gold2);transform:translateY(-1px)}
.btn-s{display:inline-flex;align-items:center;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif;font-size:.82rem;padding:.9rem 1.4rem;border:1px solid var(--border);cursor:pointer;transition:all .2s}
.btn-s:hover{color:var(--text);border-color:var(--border2)}

.r-footer{margin-top:3rem;padding-top:1.25rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:.875rem}
.r-footer-txt{font-family:'DM Mono',monospace;font-size:.56rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em}

@media(max-width:580px){
  .track-pills,.track-row,.fgrid,.blind-grid{grid-template-columns:1fr}
  .score-block{grid-template-columns:1fr;gap:1.25rem}
  .qw-card{grid-template-columns:1fr}
  .rm-cols-hdr,.rm-row{grid-template-columns:1fr 80px 80px}
  .rm-cols-hdr>:last-child,.rm-row>:last-child{display:none}
  .cta-btns{flex-direction:column}
}
`;

/* ── CONSTANTS ── */
const INDUSTRIES = [
  "Restaurant / Food Service",
  "Real Estate",
  "CPG / Food & Beverage",
  "Retail / Boutique",
  "Professional Services",
  "Healthcare / Medical",
  "E-Commerce",
  "Manufacturing",
  "Other"
];
const SIZES = ["1–5 employees","6–20 employees","21–50 employees","51–200 employees","200+"];
const ROLES = ["Owner / Founder","CEO / President","Operations Manager","Marketing / Sales","Other"];

/* ── CORE TRACKS ── */
const CORE = [
  {
    id:"ai", name:"Readiness", icon:"⚡",
    kicker:"k-gold", sel:"sel-gold",
    desc:"How ready is your business to adopt and benefit from automation?",
    questions:[
      { text:"How does your team handle repetitive tasks like data entry, reporting, and follow-ups?",
        opts:["Everything is done manually, every time","We have some templates but still do most by hand","Tools automate parts of it","Most repetitive work runs automatically"] },
      { text:"What best describes your current technology stack?",
        opts:["Basic email and a spreadsheet","Email, spreadsheets, and a couple of apps","CRM, project tools, and some integrations","A connected stack with data flowing between systems"] },
      { text:"How comfortable is your team with adopting new technology?",
        opts:["Very resistant to change","Open to it if it's simple","Generally embraces new tools","Actively seeking better technology"] },
      { text:"Do you have access to your business data in a usable format?",
        opts:["Scattered across emails and notebooks","Some spreadsheets but it's messy","Most data captured but hard to act on","Clean data we can actually analyze"] },
      { text:"Have you explored intelligent automation tools in your business?",
        opts:["Never tried anything","Aware of them but haven't used them","Tried a few things personally","Actively using automation in the business"] }
    ]
  },
  {
    id:"ops", name:"Operations", icon:"⚙️",
    kicker:"k-blue", sel:"sel-blue",
    desc:"Where is your business losing time, money, and momentum?",
    questions:[
      { text:"How much time per week does your team spend on manual reporting, data entry, or admin work?",
        opts:["10+ hours — it dominates our time","5–10 hours — painful but manageable","1–5 hours — mostly under control","Less than 1 hour — highly automated"] },
      { text:"How do you handle customer communications and follow-ups?",
        opts:["Manually, every single time","Templates but we send them manually","Some sequences run automatically","Mostly automated with occasional manual input"] },
      { text:"How do you manage scheduling, appointments, orders, or service delivery?",
        opts:["Phone calls, paper, or memory","Basic spreadsheet or shared calendar","Simple software that helps","Integrated system that updates automatically"] },
      { text:"How often do things fall through the cracks operationally?",
        opts:["Constantly — we miss things regularly","Weekly — something always slips","Occasionally — about once a month","Rarely — we have solid systems"] },
      { text:"How do you track business performance and generate reports?",
        opts:["We don't track it systematically","Manual spreadsheets updated periodically","Some dashboards, not real-time","Live dashboards with automatic reporting"] }
    ]
  },
  {
    id:"growth", name:"Growth & Sales", icon:"📈",
    kicker:"k-teal", sel:"sel-teal",
    desc:"How effectively are you finding, converting, and keeping customers?",
    questions:[
      { text:"How do you currently find and attract new customers?",
        opts:["Almost entirely word of mouth","Some online presence but no real strategy","Active marketing across a couple of channels","Multi-channel strategy with measurable results"] },
      { text:"What happens to leads or inquiries that don't convert immediately?",
        opts:["Nothing — if they don't buy now they're gone","We follow up occasionally if we remember","Some follow-up but it's inconsistent","Automated sequences that keep us top of mind"] },
      { text:"How do you retain existing customers and generate repeat business?",
        opts:["No real system — they come back if they want","Occasional outreach when we think of it","Some loyalty or referral efforts","Systematic program with measurable results"] },
      { text:"Can you measure how much it costs to acquire a customer vs. what they spend over time?",
        opts:["No idea — we don't track this","Rough estimate but not formally measured","We track some of it","Fully measured with clear metrics"] },
      { text:"How do you collect and use customer feedback and reviews?",
        opts:["We don't ask for feedback or reviews","Occasionally ask but don't do much with it","Collect feedback and sometimes act on it","Actively manage reviews and use feedback systematically"] }
    ]
  }
];

/* ── INDUSTRY DEEP DIVES ── */
const DEEP = {
  "Restaurant / Food Service": {
    label:"Restaurant Operations",
    questions:[
      { text:"How do you handle reservation confirmations and no-show prevention?",
        opts:["No system — no-shows just happen","We call to confirm manually","Basic automated reminder system","Fully automated confirmation with waitlist backfill"] },
      { text:"How do you respond to reviews on Google, Yelp, and similar platforms?",
        opts:["We rarely or never respond","Occasionally when we notice them","Owner responds personally when possible","Systematic process with templated responses"] },
      { text:"How do you promote daily specials, new menu items, and events?",
        opts:["Word of mouth and table tents only","Occasional social post when we remember","Regular social posts, some planned ahead","Automated multi-channel content system"] },
      { text:"How do you build repeat visits from existing customers?",
        opts:["No system — they come back if they want","Paper loyalty punch card","Digital loyalty program","Automated re-engagement campaigns"] },
      { text:"How do you handle catering inquiries and private event bookings?",
        opts:["Phone or walk-in only","Email inquiries, no standard process","Online form with manual follow-up","Automated intake, pricing, and booking system"] }
    ]
  },
  "Real Estate": {
    label:"Real Estate Operations",
    questions:[
      { text:"How many leads in your database haven't been contacted in 90+ days?",
        opts:["Most of them — it's a graveyard","Quite a few I keep meaning to contact","A handful — mostly cleaned up","Very few — we're systematic about follow-up"] },
      { text:"How do you currently create listing descriptions and marketing copy?",
        opts:["Write them from scratch every time","Use a template I edit manually","Have a process with some automation","Mostly automated with personal review"] },
      { text:"How do you follow up with open house attendees?",
        opts:["Personal call to everyone who attended","Email sent to attendees eventually","Some automated follow-up sequence","Full automated multi-touch sequence"] },
      { text:"How do you prepare market reports and comparable analyses for clients?",
        opts:["Manually pull all data each time","Use MLS templates I customize","Partially automated reporting","Mostly automated with data pulling"] },
      { text:"How do you systematically ask past clients for referrals?",
        opts:["We don't have a system for this","Mention it occasionally when it comes up","Annual check-in that includes referral ask","Systematic referral program with tracking"] }
    ]
  },
  "CPG / Food & Beverage": {
    label:"CPG / F&B Operations",
    questions:[
      { text:"How do you communicate with distributors and retail buyers?",
        opts:["Calls and emails, all manual","Some templates but sent manually","CRM-managed with some tracking","Automated touch sequences with reporting"] },
      { text:"How do you handle demand forecasting and production planning?",
        opts:["Gut feel and experience","Basic spreadsheet updated manually","Formal planning process","Data-driven forecasting with alerts"] },
      { text:"How do you manage customer reorders and wholesale replenishment?",
        opts:["Customers call or email each time","Basic reminder system","Some automation around reorder cycles","Fully automated reorder triggers and confirmations"] },
      { text:"How do you collect and act on retail sales velocity data?",
        opts:["No real visibility into sell-through","Periodic distributor reports we review","Regular data review process","Real-time dashboard with automated alerts"] },
      { text:"How do you manage trade promotions and retailer programs?",
        opts:["Tracked manually, often disorganized","Basic spreadsheet tracking","Software that helps manage it","Integrated planning and reporting system"] }
    ]
  },
  "Retail / Boutique": {
    label:"Retail Operations",
    questions:[
      { text:"How do you manage inventory and alert staff to low stock?",
        opts:["Manual counts and gut feel","Periodic checks, often reactive","POS system with some alerts","Automated reorder triggers and alerts"] },
      { text:"How do you communicate promotions and new arrivals to customers?",
        opts:["In-store signage only","Occasional email or social post","Regular planned communications","Automated multi-channel campaigns"] },
      { text:"How do you build customer loyalty and encourage repeat visits?",
        opts:["No program — hope they come back","Paper punch card or verbal discount","Digital loyalty program","Automated engagement and win-back sequences"] },
      { text:"How do you handle product returns, exchanges, and customer complaints?",
        opts:["Case by case, no standard process","Basic policy but no formal tracking","Standard process with some documentation","Tracked system with follow-up workflow"] },
      { text:"How do you manage supplier orders and seasonal buying?",
        opts:["Ad-hoc calls and emails","Basic process, mostly manual","Somewhat systematic approach","Automated ordering and supplier communication"] }
    ]
  },
  "Professional Services": {
    label:"Professional Services Ops",
    questions:[
      { text:"How do you handle new client intake and onboarding?",
        opts:["Phone and email back-and-forth","Basic form with manual follow-up","Standardized process with documentation","Automated intake and onboarding workflow"] },
      { text:"How do you keep clients updated on project progress?",
        opts:["They ask us for updates","Occasional update when we think of it","Regular structured check-ins","Automated reporting and status updates"] },
      { text:"How do you generate proposals and engagement documents?",
        opts:["Write each one from scratch","Templates I edit manually","Template library with some automation","Mostly automated with personal review"] },
      { text:"How do you track billable time and generate invoices?",
        opts:["Manual timesheets and invoices","Basic time tracking software","Automated time capture","Fully integrated billing system"] },
      { text:"How do you systematically generate referrals from satisfied clients?",
        opts:["We don't have a process","Mention it occasionally","End-of-project referral ask","Systematic referral and testimonial program"] }
    ]
  },
  "Healthcare / Medical": {
    label:"Healthcare Operations",
    questions:[
      { text:"How do you handle appointment reminders and reduce no-shows?",
        opts:["Manual reminder calls","Basic automated text or email","Multi-channel reminders","Full automated system with waitlist management"] },
      { text:"How do you follow up with patients after appointments?",
        opts:["No follow-up process","Occasional check-in call","Standard follow-up workflow","Automated care journey with touchpoints"] },
      { text:"How do you manage patient intake forms and paperwork?",
        opts:["Paper forms filled in office","PDF forms emailed beforehand","Digital forms with manual entry","Fully integrated digital intake"] },
      { text:"How do you communicate new services or health programs to patients?",
        opts:["No outreach beyond appointments","Occasional newsletter","Regular planned communications","Segmented automated campaigns"] },
      { text:"How do you collect and respond to patient reviews and feedback?",
        opts:["We don't manage this","Occasionally check and respond","Monitor and respond regularly","Systematic reputation management program"] }
    ]
  },
  "E-Commerce": {
    label:"E-Commerce Operations",
    questions:[
      { text:"How do you handle abandoned carts and browse abandonment?",
        opts:["No follow-up system","Occasional manual outreach","Basic automated reminder","Multi-step automated recovery sequence"] },
      { text:"How do you manage product descriptions and listing content?",
        opts:["Write each one manually","Use templates I edit","Partially automated with review","Fully automated content generation"] },
      { text:"How do you handle customer service inquiries and returns?",
        opts:["All manual, case by case","Basic email templates","Help desk with some automation","Mostly automated with human escalation"] },
      { text:"How do you encourage repeat purchases and reduce churn?",
        opts:["No system beyond order confirmation","Occasional promotional email","Regular retention campaigns","Automated lifecycle sequences"] },
      { text:"How do you manage supplier relationships and inventory replenishment?",
        opts:["Manual monitoring and orders","Spreadsheet with periodic reviews","Software with some automation","Automated forecasting and ordering"] }
    ]
  },
  "Manufacturing": {
    label:"Manufacturing Operations",
    questions:[
      { text:"How do you manage production scheduling and capacity planning?",
        opts:["Gut feel and experience","Manual spreadsheet planning","ERP or scheduling software","Automated scheduling with constraint management"] },
      { text:"How do you communicate with customers about order status and delivery?",
        opts:["Phone calls when they ask","Email updates sent manually","Some automated order notifications","Real-time automated status communications"] },
      { text:"How do you handle quality issues and customer complaints?",
        opts:["Case by case, no formal process","Basic tracking spreadsheet","Formal process with documentation","Integrated quality management system"] },
      { text:"How do you manage supplier relationships and purchase orders?",
        opts:["All manual calls and emails","Email templates with manual process","ERP-managed with some tracking","Automated procurement workflows"] },
      { text:"How do you track on-time delivery and production KPIs?",
        opts:["We don't track this formally","Manual spreadsheet updated periodically","Some dashboards in our system","Real-time dashboard with automated alerts"] }
    ]
  },
  "Other": {
    label:"Business Operations",
    questions:[
      { text:"How do you handle new customer or client onboarding?",
        opts:["Ad-hoc, no standard process","Basic process but mostly manual","Standardized with some automation","Fully automated onboarding workflow"] },
      { text:"How do you manage ongoing customer communication?",
        opts:["Reactive only — respond when contacted","Occasional outreach when we think of it","Regular planned communications","Automated communication sequences"] },
      { text:"How do you track and report on business performance?",
        opts:["We don't track formally","Manual reports created periodically","Some dashboards and reporting","Real-time automated reporting"] },
      { text:"How do you handle invoicing, payments, and financial admin?",
        opts:["All manual, time-consuming","Basic accounting software","Mostly automated billing","Fully integrated financial workflows"] },
      { text:"How do you manage your online reputation and reviews?",
        opts:["We don't monitor or respond","Check occasionally and respond sometimes","Regular monitoring and responses","Systematic reputation management"] }
    ]
  }
};

/* ── INDUSTRY CONTEXT for Claude prompt ── */
const IND_CONTEXT = {
  "Restaurant / Food Service": `Focus on: reservation and no-show management, review response automation, content for specials and events, loyalty and repeat visit programs, catering inquiry automation. Key pain points: inconsistent review responses, manual reservation confirmations, no content system for daily specials, untapped loyalty revenue. Industry-specific blind spots to identify: automated waitlist management, digital menu update syndication, automated upsell messaging for regulars.`,
  "Real Estate": `Focus on: dead lead reactivation from CRM, listing copy automation, open house follow-up sequences, market report generation, systematic referral programs. Key pain points: hundreds of dead leads sitting untouched, manual listing copy creation, inconsistent open house follow-up. Blind spots: automated anniversary and life-event outreach to past clients, instant response system for new inquiries, market alert system for dormant buyers.`,
  "CPG / Food & Beverage": `Focus on: distributor communication automation, demand forecasting assistance, reorder trigger systems, retail velocity reporting, trade promotion management. Key pain points: manual retailer communication, reactive inventory management, slow response to sell-through data. Blind spots: automated new buyer outreach based on geography, promotional performance reporting, shelf audit automation.`,
  "Retail / Boutique": `Focus on: inventory alerting, promotional content automation, loyalty program automation, supplier communication. Key pain points: no content engine for new arrivals, manual inventory management, no loyalty system. Blind spots: automated personal shopper outreach based on purchase history, seasonal buying automation, virtual try-on or styling content.`,
  "Professional Services": `Focus on: client intake automation, proposal generation, automated project updates, invoice automation, referral program. Key pain points: manual proposal writing, no systematic referral ask, inconsistent client updates. Blind spots: automated thought leadership content to stay top of mind, contract renewal alerts, client health scoring.`,
  "Healthcare / Medical": `Focus on: appointment reminder sequences, no-show reduction, patient follow-up, intake automation, reputation management. Key pain points: no-shows costing significant revenue, manual intake paperwork, no systematic review management. Blind spots: automated wellness check-in sequences, patient reactivation for those overdue for visits, care gap outreach.`,
  "E-Commerce": `Focus on: cart abandonment recovery, product content automation, customer service automation, lifecycle marketing, inventory management. Key pain points: abandoned revenue from cart abandonment, manual product descriptions, no retention sequences. Blind spots: browse abandonment sequences, post-purchase upsell automation, predictive reorder triggers.`,
  "Manufacturing": `Focus on: production communication, order status automation, quality issue tracking, supplier management, KPI reporting. Key pain points: manual customer status updates, reactive quality management, spreadsheet-based planning. Blind spots: automated capacity utilization alerts, customer delivery prediction, supplier performance scoring.`,
  "Other": `Focus on: the specific operational pain points revealed in their answers. Identify the highest-friction manual processes and target those first. Prioritize customer communication, reporting, and follow-up automation.`
};

const MATURITY = (s, max) => {
  const p = s/max;
  if(p < .33) return {label:"Beginner", cls:"mat-b"};
  if(p < .56) return {label:"Developing", cls:"mat-d"};
  if(p < .78) return {label:"Growing", cls:"mat-g"};
  return {label:"Advanced", cls:"mat-a"};
};

const STEPS = ["Your Business","Readiness","Operations","Growth","Industry Deep Dive","Your Report"];

export default function App() {
  const [step, setStep] = useState("intro");
  const [biz, setBiz] = useState({company:"",industry:"",size:"",role:""});
  const [ans, setAns] = useState({ai:{},ops:{},growth:{},deep:{}});
  const [track, setTrack] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [err, setErr] = useState("");
  const [openPh, setOpenPh] = useState({0:true,1:false,2:false,3:false});
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailErr, setEmailErr] = useState("");

  const tracks = ["ai","ops","growth"];
  const curTrack = CORE[track];
  const curKey = tracks[track];
  const deepData = DEEP[biz.industry] || DEEP["Other"];

  const score = id => Object.values(ans[id]).reduce((s,v)=>s+v,0);
  const allDone = id => {
    const len = id === "deep" ? 5 : CORE.find(t=>t.id===id).questions.length;
    return Object.keys(ans[id]).length === len && Object.values(ans[id]).every(v=>v !== undefined);
  };

  const setA = (id, i, v) => setAns(p=>({...p,[id]:{...p[id],[i]:v}}));

  const prog = () => {
    const map = {intro:0,bizinfo:10,track:15+(track/3)*50,deep:85,loading:100,results:100};
    return map[step] ?? 0;
  };

  const generate = async () => {
    setLoading(true); setStep("loading"); setErr("");
    const aiS=score("ai"), opsS=score("ops"), grS=score("growth"), dpS=score("deep");
    const total = aiS+opsS+grS;
    const aiM=MATURITY(aiS,12), opsM=MATURITY(opsS,12), grM=MATURITY(grS,12);

    const loadSeq = ["Reviewing your answers","Analyzing industry patterns","Identifying blind spots","Building your roadmap"];
    for(let i=0;i<loadSeq.length;i++){
      setLoadStep(i);
      await new Promise(r=>setTimeout(r,900));
    }

    const indCtx = IND_CONTEXT[biz.industry] || IND_CONTEXT["Other"];
    const deepQs = deepData.questions.map((q,i)=>`Q: ${q.text}\nA: ${q.opts[ans.deep[i]??0]}`).join("\n");
    const coreQs = CORE.map(t=>t.questions.map((q,i)=>`Q: ${q.text}\nA: ${q.opts[ans[t.id][i]??0]}`).join("\n")).join("\n");

    const prompt = `You are a senior business operations consultant generating a personalized assessment report. Your language must be outcome-focused and professional. CRITICAL RULES: Never mention specific software products, platforms, tools, or vendor names. Never use the words "AI", "artificial intelligence", "machine learning", or any variation. Instead use terms like: "intelligent automation", "automated workflow", "smart notification system", "automated messaging", "digital assistant", "automated content system", "virtual intake system", "automated scheduling", "intelligent routing system". Focus entirely on business outcomes: time saved, revenue recovered, customers retained, hours reclaimed.

Business: ${biz.company||"the business"} | Industry: ${biz.industry} | Size: ${biz.size} | Role: ${biz.role}

SCORES (each out of 12):
- Operational Readiness: ${aiS}/12 (${aiM.label})
- Operations Efficiency: ${opsS}/12 (${opsM.label})  
- Growth & Sales: ${grS}/12 (${grM.label})
- Industry Deep Dive: ${dpS}/20 (${MATURITY(dpS,20).label})
- Overall: ${total}/36

CORE ASSESSMENT ANSWERS:
${coreQs}

INDUSTRY-SPECIFIC ANSWERS (${biz.industry}):
${deepQs}

INDUSTRY CONTEXT FOR RECOMMENDATIONS:
${indCtx}

Generate a comprehensive, highly personalized report. Reference their specific answers directly. Make every recommendation feel like it was written by someone who has worked inside their exact type of business.

CRITICAL: Respond ONLY with valid JSON matching this exact structure:

{
  "summary": "3 sentences. Acknowledge their strongest area, name their biggest operational gap based on their answers, and frame the opportunity ahead. Reference their industry specifically.",
  "blindSpots": [
    {"icon": "emoji", "title": "Short title (no AI/tool names)", "desc": "2 sentences explaining what they're missing and why it matters for their specific industry. Outcome-focused."},
    {"icon": "emoji", "title": "Short title", "desc": "2 sentences."},
    {"icon": "emoji", "title": "Short title", "desc": "2 sentences."}
  ],
  "quickWins": [
    {"badge": "bg-green", "badgeLabel": "Lowest Effort", "title": "Outcome-focused title", "desc": "2 sentences. Specific to their industry and answers. Reference what they said. No tool names.", "effort": "Low", "effortCls": "ef-low", "impact": "High"},
    {"badge": "bg-gold", "badgeLabel": "Highest ROI", "title": "Outcome-focused title", "desc": "2 sentences specific to their situation.", "effort": "Low", "effortCls": "ef-low", "impact": "Very High"},
    {"badge": "bg-blue", "badgeLabel": "Brand Builder", "title": "Outcome-focused title", "desc": "2 sentences.", "effort": "Medium", "effortCls": "ef-med", "impact": "High"},
    {"badge": "bg-rose", "badgeLabel": "Operations Win", "title": "Outcome-focused title", "desc": "2 sentences.", "effort": "Medium", "effortCls": "ef-med", "impact": "High"}
  ],
  "recommendations": [
    {"cls": "r-gold", "tag": "Readiness", "title": "Specific recommendation title", "body": "2-3 sentences directly referencing their answers. No tool names. Outcome-focused."},
    {"cls": "r-gold", "tag": "Readiness", "title": "Specific recommendation title", "body": "2-3 sentences."},
    {"cls": "r-blue", "tag": "Operations", "title": "Specific recommendation title", "body": "2-3 sentences directly referencing their specific operational answers."},
    {"cls": "r-blue", "tag": "Operations", "title": "Specific recommendation title", "body": "2-3 sentences."},
    {"cls": "r-teal", "tag": "Growth", "title": "Specific recommendation title", "body": "2-3 sentences directly referencing their growth and industry answers."},
    {"cls": "r-teal", "tag": "Growth", "title": "Specific recommendation title", "body": "2-3 sentences."}
  ],
  "roadmap": [
    {
      "phase": "Phase 1 — Quick Wins",
      "timeline": "Week 1–2",
      "dotCls": "d1",
      "items": [
        {"name": "Automation name (no tool names)", "sub": "What it does in plain English", "effort": "Low", "effortCls": "effort-low", "impact": "High", "timeline": "Week 1"},
        {"name": "Automation name", "sub": "What it does", "effort": "Low", "effortCls": "effort-low", "impact": "High", "timeline": "Week 1–2"},
        {"name": "Automation name", "sub": "What it does", "effort": "Low", "effortCls": "effort-low", "impact": "Medium", "timeline": "Week 2"}
      ]
    },
    {
      "phase": "Phase 2 — Core Systems",
      "timeline": "Week 3–4",
      "dotCls": "d2",
      "items": [
        {"name": "System name", "sub": "What it does", "effort": "Medium", "effortCls": "effort-med", "impact": "Very High", "timeline": "Week 3"},
        {"name": "System name", "sub": "What it does", "effort": "Medium", "effortCls": "effort-med", "impact": "High", "timeline": "Week 3–4"},
        {"name": "System name", "sub": "What it does", "effort": "Medium", "effortCls": "effort-med", "impact": "High", "timeline": "Week 4"}
      ]
    },
    {
      "phase": "Phase 3 — Growth Engine",
      "timeline": "Month 2",
      "dotCls": "d3",
      "items": [
        {"name": "System name", "sub": "What it does", "effort": "Medium", "effortCls": "effort-med", "impact": "Very High", "timeline": "Month 2"},
        {"name": "System name", "sub": "What it does", "effort": "High", "effortCls": "effort-high", "impact": "Very High", "timeline": "Month 2"},
        {"name": "System name", "sub": "What it does", "effort": "High", "effortCls": "effort-high", "impact": "High", "timeline": "Month 2"}
      ]
    },
    {
      "phase": "Phase 4 — Connected Operations",
      "timeline": "Month 3",
      "dotCls": "d4",
      "items": [
        {"name": "System name", "sub": "What it does", "effort": "High", "effortCls": "effort-high", "impact": "Transformative", "timeline": "Month 3"},
        {"name": "System name", "sub": "What it does", "effort": "High", "effortCls": "effort-high", "impact": "High", "timeline": "Month 3"}
      ]
    }
  ]
}`;

    try {
      const res = await fetch("/api/assess",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt})
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      const clean = txt.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResults({aiS,opsS,grS,total,aiM,opsM,grM,...parsed});
      setStep("results");
    } catch(e) {
      setErr("Something went wrong generating your report. Please try again.");
      setStep("deep");
    } finally { setLoading(false); }
  };

  const sendReport = async () => {
    if (!emailInput) return;
    setEmailSending(true); setEmailErr("");
    try {
      const res = await fetch("/api/send-report",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:emailInput, biz:{...biz,email:emailInput}, results})
      });
      if (!res.ok) throw new Error("failed");
      setEmailSent(true);
    } catch(e) {
      setEmailErr("Couldn't send the email. Please try again.");
    } finally { setEmailSending(false); }
  };

  const stepIdx = {intro:0,bizinfo:1,track:2+track,deep:5}[step]??6;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="noise"/><div className="glow"/>
        <div className="wrap">

          {/* NAV */}
          <div className="nav">
            <div className="brand">Business Assessment</div>
            {step!=="intro"&&step!=="results"&&step!=="loading"&&(
              <div className="nav-right">
                {step==="bizinfo"?"Your Business":
                 step==="track"?`${curTrack.name} · Track ${track+1}/3`:
                 step==="deep"?`${deepData.label}`:""}
              </div>
            )}
          </div>

          {/* PROGRESS */}
          {step!=="intro"&&(
            <div className="prog-wrap">
              <div className="prog-track"><div className="prog-fill" style={{width:`${prog()}%`}}/></div>
              <div className="prog-dots">
                {STEPS.map((s,i)=>(
                  <div key={i} className={`prog-dot ${i<=stepIdx?"active":""}`}>{s}</div>
                ))}
              </div>
            </div>
          )}

          {/* ── INTRO ── */}
          {step==="intro"&&(
            <div>
              <div className="intro-kicker">Free · 8 Minutes · Personalized</div>
              <h1 className="intro-h">How efficient<br/>is your <em>business,</em><br/>really?</h1>
              <p className="intro-p">Answer questions across three tracks plus an industry-specific deep dive. Get a personalized report with your gaps, blind spots, quick wins, and a 90-day roadmap.</p>
              <div className="track-pills">
                {CORE.map((t,i)=>(
                  <div key={i} className="tp">
                    <div className="tp-icon">{t.icon}</div>
                    <div className="tp-name">{t.name}</div>
                    <div className="tp-q">5 questions</div>
                  </div>
                ))}
              </div>
              <button className="btn-next" onClick={()=>setStep("bizinfo")}>Begin Assessment →</button>
            </div>
          )}

          {/* ── BIZ INFO ── */}
          {step==="bizinfo"&&(
            <div>
              <div className="sec-kicker k-gold">Step 1 of 6</div>
              <h2 className="sec-title">About your business</h2>
              <p className="sec-desc">Your industry shapes the questions and recommendations you'll receive.</p>
              <div className="fgroup">
                <label className="flabel">Company Name</label>
                <input className="finput" placeholder="Acme Co." value={biz.company} onChange={e=>setBiz(p=>({...p,company:e.target.value}))}/>
              </div>
              <div className="fgrid">
                <div className="fgroup">
                  <label className="flabel">Industry</label>
                  <select className="fselect" value={biz.industry} onChange={e=>setBiz(p=>({...p,industry:e.target.value}))}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="fgroup">
                  <label className="flabel">Company Size</label>
                  <select className="fselect" value={biz.size} onChange={e=>setBiz(p=>({...p,size:e.target.value}))}>
                    <option value="">Select size</option>
                    {SIZES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="fgroup">
                <label className="flabel">Your Role</label>
                <select className="fselect" value={biz.role} onChange={e=>setBiz(p=>({...p,role:e.target.value}))}>
                  <option value="">Select role</option>
                  {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="nav-row">
                <button className="btn-back" onClick={()=>setStep("intro")}>← Back</button>
                <button className="btn-next" disabled={!biz.industry||!biz.size||!biz.role} onClick={()=>setStep("track")}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── CORE TRACKS ── */}
          {step==="track"&&(
            <div>
              <div className={`sec-kicker ${curTrack.kicker}`}>Track {track+1} of 3 · {curTrack.name}</div>
              <h2 className="sec-title">{curTrack.name}</h2>
              <p className="sec-desc">{curTrack.desc}</p>
              {curTrack.questions.map((q,qi)=>(
                <div key={qi} className="qblock">
                  <div className="qnum">Question {qi+1}</div>
                  <div className="qtext">{q.text}</div>
                  <div className="opts">
                    {q.opts.map((o,oi)=>(
                      <button key={oi} className={`opt ${ans[curKey][qi]===oi?curTrack.sel:""}`} onClick={()=>setA(curKey,qi,oi)}>
                        <span className="opt-radio"/>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="nav-row">
                <button className="btn-back" onClick={()=>track===0?setStep("bizinfo"):setTrack(t=>t-1)}>← Back</button>
                <button className="btn-next" disabled={!allDone(curKey)} onClick={()=>track<2?setTrack(t=>t+1):setStep("deep")}>
                  {track<2?"Next Track →":"Industry Questions →"}
                </button>
              </div>
            </div>
          )}

          {/* ── INDUSTRY DEEP DIVE ── */}
          {step==="deep"&&(
            <div>
              <div className="sec-kicker k-ind">Industry Deep Dive</div>
              <div className="ind-badge">
                <div className="ind-badge-dot"/>
                <div className="ind-badge-txt">{biz.industry}</div>
              </div>
              <h2 className="sec-title">{deepData.label}</h2>
              <p className="sec-desc">These questions are specific to your industry and shape your personalized recommendations.</p>
              {deepData.questions.map((q,qi)=>(
                <div key={qi} className="qblock">
                  <div className="qnum">Question {qi+1}</div>
                  <div className="qtext">{q.text}</div>
                  <div className="opts">
                    {q.opts.map((o,oi)=>(
                      <button key={oi} className={`opt ${ans.deep[qi]===oi?"sel-ind":""}`} onClick={()=>setA("deep",qi,oi)}>
                        <span className="opt-radio"/>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="nav-row">
                <button className="btn-back" onClick={()=>{setTrack(2);setStep("track")}}>← Back</button>
                <button className="btn-next" disabled={!allDone("deep")||loading} onClick={generate}>Get My Report →</button>
              </div>
            </div>
          )}

          {/* ── LOADING ── */}
          {step==="loading"&&(
            <div className="loading">
              <div className="spin"/>
              <div className="load-title">Analyzing your business…</div>
              <p className="load-sub">Personalizing your report for {biz.industry}.</p>
              <ul className="load-steps">
                {["Reviewing your answers","Analyzing industry patterns","Identifying your blind spots","Building your 90-day roadmap"].map((s,i)=>(
                  <li key={i} className={loadStep>i?"ls-done":loadStep===i?"ls-active":""}>
                    {loadStep>i?"✓ ":loadStep===i?"→ ":"  "}{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── RESULTS ── */}
          {step==="results"&&results&&(()=>{
            const togPh=i=>setOpenPh(p=>({...p,[i]:!p[i]}));
            return (
              <div>
                <div className="r-header">
                  <div className="r-kicker">Operations Report · {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
                  <div className="r-title">{biz.company||"Your Business"}</div>
                  <div className="r-chips">
                    <span className="r-chip">{biz.industry}</span>
                    <span className="r-chip">{biz.size}</span>
                    <span className="r-chip">{biz.role}</span>
                  </div>
                </div>

                {/* OVERALL */}
                <div className="score-block">
                  <div>
                    <div className="big-n">{results.total}</div>
                    <div className="big-sub">out of 36</div>
                    <div className={`mat ${MATURITY(results.total,36).cls}`}>{MATURITY(results.total,36).label}</div>
                  </div>
                  <p className="r-summary" dangerouslySetInnerHTML={{__html:results.summary?.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}}/>
                </div>

                {/* TRACK SCORES */}
                <div className="track-row">
                  {[
                    {cls:"tc1",name:"Readiness",s:results.aiS,m:results.aiM},
                    {cls:"tc2",name:"Operations",s:results.opsS,m:results.opsM},
                    {cls:"tc3",name:"Growth & Sales",s:results.grS,m:results.grM},
                  ].map((t,i)=>(
                    <div key={i} className={`tc ${t.cls}`}>
                      <div className="tc-name">{t.name}</div>
                      <div className="tc-num">{t.s}<span style={{fontSize:"1rem",color:"var(--dim)"}}>/12</span></div>
                      <div className="tc-mat">{t.m.label}</div>
                      <div className="bar"><div className="bar-f" style={{width:`${(t.s/12)*100}%`}}/></div>
                    </div>
                  ))}
                </div>

                {/* BLIND SPOTS */}
                <div className="rsec">
                  <div className="rsec-hdr">
                    <div className="rsec-title">Your Blind Spots</div>
                    <div className="rsec-sub">What you're not thinking about — but should be</div>
                  </div>
                  <div className="blind-grid">
                    {results.blindSpots?.map((b,i)=>(
                      <div key={i} className="blind-card">
                        <div className="blind-icon">{b.icon}</div>
                        <div className="blind-name">{b.title}</div>
                        <div className="blind-desc">{b.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QUICK WINS */}
                <div className="rsec">
                  <div className="rsec-hdr">
                    <div className="rsec-title">Quick Wins</div>
                    <div className="rsec-sub">High value · Matched to your situation</div>
                  </div>
                  <div className="qw">
                    {results.quickWins?.map((q,i)=>(
                      <div key={i} className="qw-card">
                        <div>
                          <span className={`qw-badge ${q.badge}`}>{q.badgeLabel}</span>
                          <div className="qw-title">{q.title}</div>
                          <div className="qw-desc">{q.desc}</div>
                        </div>
                        <div className="qw-effort">
                          <div><div className="ef-label">Effort</div><div className={`ef-val ${q.effortCls}`}>{q.effort}</div></div>
                          <div><div className="ef-label">Impact</div><div className="ef-val" style={{color:"var(--teal)"}}>{q.impact}</div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RECS */}
                <div className="rsec">
                  <div className="rsec-hdr">
                    <div className="rsec-title">Personalized Recommendations</div>
                    <div className="rsec-sub">Based on your specific answers</div>
                  </div>
                  {results.recommendations?.map((r,i)=>(
                    <div key={i} className={`rec ${r.cls}`}>
                      <div className="rec-hdr">
                        <div className="rec-title">{r.title}</div>
                        <span className="rec-tag">{r.tag}</span>
                      </div>
                      <div className="rec-body" dangerouslySetInnerHTML={{__html:r.body?.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}}/>
                    </div>
                  ))}
                </div>

                {/* ROADMAP */}
                <div className="rsec">
                  <div className="rsec-hdr">
                    <div className="rsec-title">90-Day Roadmap</div>
                    <div className="rsec-sub">Sequenced by effort and impact</div>
                  </div>
                  <div className="roadmap">
                    {results.roadmap?.map((ph,pi)=>(
                      <div key={pi} className="rm-ph">
                        <div className="rm-ph-hdr" onClick={()=>togPh(pi)}>
                          <div className={`rm-dot ${ph.dotCls}`}/>
                          <div className="rm-ph-name">{ph.phase}</div>
                          <div className="rm-ph-time">{ph.timeline}</div>
                          <div className={`rm-chev ${openPh[pi]?"open":""}`}>▼</div>
                        </div>
                        {openPh[pi]&&(
                          <>
                            <div className="rm-cols-hdr">
                              <div className="rm-col-h">What Gets Built</div>
                              <div className="rm-col-h">Effort</div>
                              <div className="rm-col-h">Impact</div>
                              <div className="rm-col-h">When</div>
                            </div>
                            {ph.items?.map((item,ii)=>(
                              <div key={ii} className="rm-row" style={{background:ii%2===0?"#090c14":"#080b12"}}>
                                <div>
                                  <div className="rm-item-name">{item.name}</div>
                                  <div className="rm-item-sub">{item.sub}</div>
                                </div>
                                <div className="rm-col"><div className={`rm-val ${item.effortCls}`}>{item.effort}</div></div>
                                <div className="rm-col"><div className="rm-val" style={{color:"var(--teal)"}}>{item.impact}</div></div>
                                <div className="rm-col"><div className="rm-val" style={{color:"var(--dim)"}}>{item.timeline}</div></div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* EMAIL CAPTURE */}
                <div className="email-capture">
                  {emailSent ? (
                    <>
                      <div className="email-capture-title">Report sent ✓</div>
                      <p className="email-sent">Check your inbox — your full report is on its way to {emailInput}</p>
                    </>
                  ) : (
                    <>
                      <div className="email-capture-title">Get a copy of this report</div>
                      <p className="email-capture-desc">We'll email you the full report with your scores, blind spots, quick wins, and recommendations so you have it for reference.</p>
                      <div className="email-row">
                        <input className="finput" type="email" placeholder="you@company.com" value={emailInput} onChange={e=>setEmailInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReport()}/>
                        <button className="btn-email" disabled={!emailInput||emailSending} onClick={sendReport}>{emailSending?"Sending…":"Email My Report →"}</button>
                      </div>
                      {emailErr&&<div className="err">{emailErr}</div>}
                    </>
                  )}
                </div>

                {/* CTA */}
                <div className="cta">
                  <div className="cta-title">Let's build this together</div>
                  <p className="cta-desc">Book a free 20-minute strategy call to review your top recommendations and identify the one change that will have the biggest impact on your business this month.</p>
                  <div className="cta-btns">
                    <button className="btn-p">Book Free Strategy Call →</button>
                    <button className="btn-s" onClick={()=>{setStep("intro");setAns({ai:{},ops:{},growth:{},deep:{}});setTrack(0);setResults(null);setBiz({company:"",industry:"",size:"",role:""});setOpenPh({0:true,1:false,2:false,3:false});setEmailInput("");setEmailSent(false);setEmailErr("");}}>Start Over</button>
                  </div>
                </div>

                <div className="r-footer">
                  <div className="r-footer-txt">Business Operations Report · Confidential</div>
                  <div className="r-footer-txt">{biz.company||"Your Business"} · {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </>
  );
}
