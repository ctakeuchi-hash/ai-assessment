"use client";

import { useState } from "react";

/* ── FONTS ── */
const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`;

/* ── STYLES ── */
const CSS = `
${GFONTS}
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#f5f4f0;--surface:#ffffff;--border:#e2ddd6;--border2:#c8c0b4;
  --text:#111827;--muted:#6b7280;--dim:#9ca3af;
  --gold:#b8750e;--gold2:#c8861a;--gold-bg:#fef9f0;--gold-border:#f0d090;
  --blue:#2563eb;--blue-bg:#eff6ff;--blue-border:#bfdbfe;
  --teal:#0d9488;--teal-bg:#f0fdfa;--teal-border:#99f6e4;
  --rose:#dc2626;--rose-bg:#fef2f2;--rose-border:#fecaca;
  --indigo:#7c3aed;--indigo-bg:#f5f3ff;--indigo-border:#ddd6fe;
  --shadow:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.04);
}
body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;font-size:15px;line-height:1.6}
.app{min-height:100vh}
.wrap{max-width:720px;margin:0 auto;padding:0 1.5rem 6rem}

/* NAV */
.nav{padding:1.25rem 0;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);margin-bottom:2.5rem}
.brand{display:flex;align-items:center;gap:.75rem}
.brand-logo{width:32px;height:32px;background:var(--text);border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:.6rem;color:white;letter-spacing:.05em;flex-shrink:0}
.brand-text{font-family:'Outfit',sans-serif;font-size:.85rem;font-weight:600;color:var(--text)}
.brand-ver{font-family:'DM Mono',monospace;font-size:.55rem;color:var(--dim);letter-spacing:.06em;margin-top:.1rem}
.nav-right{font-family:'DM Mono',monospace;font-size:.6rem;color:var(--dim);text-transform:uppercase;letter-spacing:.1em;background:var(--surface);border:1px solid var(--border);padding:.25rem .7rem;border-radius:20px}

/* PROGRESS */
.prog-wrap{margin-bottom:2.5rem}
.prog-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem}
.prog-label{font-size:.78rem;font-weight:500;color:var(--text)}
.prog-pct{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--gold2);font-weight:500}
.prog-track{height:4px;background:var(--border);border-radius:2px;position:relative;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));transition:width .6s ease;border-radius:2px}
.prog-steps{display:flex;justify-content:space-between;margin-top:.6rem}
.prog-dot{font-family:'DM Mono',monospace;font-size:.55rem;color:var(--dim);text-transform:uppercase;letter-spacing:.06em}
.prog-dot.active{color:var(--gold2);font-weight:500}

/* INTRO */
.intro-kicker{display:inline-flex;align-items:center;gap:.5rem;background:var(--gold-bg);border:1px solid var(--gold-border);color:var(--gold2);font-family:'DM Mono',monospace;font-size:.63rem;letter-spacing:.12em;text-transform:uppercase;padding:.3rem .8rem;border-radius:20px;margin-bottom:1.5rem}
.intro-h{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,6vw,3.8rem);line-height:1.06;color:var(--text);margin-bottom:1.25rem}
.intro-h em{font-style:italic;color:var(--gold2)}
.intro-p{font-size:1rem;color:var(--muted);line-height:1.8;max-width:520px;margin-bottom:2.5rem}
.track-pills{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:2.5rem}
.tp{background:var(--surface);border:1px solid var(--border);padding:1.25rem;border-radius:8px;border-top:3px solid;box-shadow:var(--shadow)}
.tp:nth-child(1){border-top-color:var(--gold2)}
.tp:nth-child(2){border-top-color:var(--blue)}
.tp:nth-child(3){border-top-color:var(--teal)}
.tp-icon{font-size:1.4rem;margin-bottom:.5rem}
.tp-name{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text);margin-bottom:.2rem}
.tp-q{font-size:.75rem;color:var(--dim)}

/* FORMS */
.fgroup{margin-bottom:1.25rem}
.flabel{display:block;font-size:.75rem;font-weight:600;color:var(--text);margin-bottom:.4rem;letter-spacing:.01em}
.finput,.fselect{width:100%;background:var(--surface);border:1.5px solid var(--border);color:var(--text);font-family:'Outfit',sans-serif;font-size:.92rem;padding:.75rem 1rem;outline:none;transition:border-color .15s;border-radius:6px;-webkit-appearance:none}
.finput:focus,.fselect:focus{border-color:var(--gold2);box-shadow:0 0 0 3px rgba(200,134,26,.1)}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

/* SECTION HEADERS */
.sec-kicker{display:inline-flex;align-items:center;gap:.4rem;font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;margin-bottom:.5rem;padding:.25rem .65rem;border-radius:12px}
.k-gold{background:var(--gold-bg);color:var(--gold2);border:1px solid var(--gold-border)}
.k-blue{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.k-teal{background:var(--teal-bg);color:var(--teal);border:1px solid var(--teal-border)}
.k-rose{background:var(--rose-bg);color:var(--rose);border:1px solid var(--rose-border)}
.k-ind{background:var(--indigo-bg);color:var(--indigo);border:1px solid var(--indigo-border)}
.sec-title{font-family:'Cormorant Garamond',serif;font-size:1.9rem;color:var(--text);margin-bottom:.35rem;line-height:1.12}
.sec-desc{font-size:.88rem;color:var(--muted);margin-bottom:1.75rem;line-height:1.7}

/* QUESTIONS */
.qblock{margin-bottom:2rem;padding:1.5rem;background:var(--surface);border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow)}
.qnum{font-family:'DM Mono',monospace;font-size:.6rem;color:var(--dim);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.5rem}
.qtext{font-size:1rem;font-weight:600;color:var(--text);margin-bottom:1rem;line-height:1.45}
.opts{display:flex;flex-direction:column;gap:.5rem}
.opt{display:flex;align-items:flex-start;gap:.875rem;background:var(--bg);border:1.5px solid var(--border);color:var(--muted);font-family:'Outfit',sans-serif;font-size:.88rem;padding:.875rem 1rem;cursor:pointer;text-align:left;transition:all .15s;line-height:1.5;border-radius:6px;width:100%}
.opt:hover{border-color:var(--border2);color:var(--text);background:var(--surface)}
.opt.sel-gold{border-color:var(--gold2);color:var(--text);background:var(--gold-bg)}
.opt.sel-blue{border-color:var(--blue);color:var(--text);background:var(--blue-bg)}
.opt.sel-teal{border-color:var(--teal);color:var(--text);background:var(--teal-bg)}
.opt.sel-ind{border-color:var(--indigo);color:var(--text);background:var(--indigo-bg)}
.opt-radio{width:18px;height:18px;border-radius:50%;border:2px solid var(--dim);flex-shrink:0;margin-top:.1rem;display:flex;align-items:center;justify-content:center;transition:all .15s}
.opt.sel-gold .opt-radio{border-color:var(--gold2);background:var(--gold2)}
.opt.sel-blue .opt-radio{border-color:var(--blue);background:var(--blue)}
.opt.sel-teal .opt-radio{border-color:var(--teal);background:var(--teal)}
.opt.sel-ind .opt-radio{border-color:var(--indigo);background:var(--indigo)}
.opt-radio-dot{width:7px;height:7px;border-radius:50%;background:white;opacity:0;transition:opacity .15s}
.opt.sel-gold .opt-radio-dot,.opt.sel-blue .opt-radio-dot,.opt.sel-teal .opt-radio-dot,.opt.sel-ind .opt-radio-dot{opacity:1}

/* NAV ROW */
.nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:1.75rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.btn-back{display:inline-flex;align-items:center;gap:.4rem;background:transparent;color:var(--muted);font-family:'Outfit',sans-serif;font-size:.85rem;padding:.65rem 1rem;border:1.5px solid var(--border);cursor:pointer;transition:all .15s;border-radius:6px}
.btn-back:hover{color:var(--text);border-color:var(--border2);background:var(--surface)}
.btn-next{display:inline-flex;align-items:center;gap:.5rem;background:var(--text);color:white;font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:600;padding:.85rem 1.75rem;border:none;cursor:pointer;transition:all .15s;border-radius:6px;letter-spacing:.01em}
.btn-next:hover{background:#374151;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.15)}
.btn-next:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}

/* INDUSTRY BADGE */
.ind-badge{display:inline-flex;align-items:center;gap:.5rem;background:var(--indigo-bg);border:1px solid var(--indigo-border);padding:.35rem .9rem;margin-bottom:1.25rem;border-radius:20px}
.ind-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--indigo);flex-shrink:0}
.ind-badge-txt{font-family:'DM Mono',monospace;font-size:.62rem;color:var(--indigo);text-transform:uppercase;letter-spacing:.1em}

/* EMAIL CAPTURE */
.email-capture{background:var(--surface);border:1px solid var(--border);padding:1.75rem;margin-bottom:2rem;border-radius:8px;box-shadow:var(--shadow)}
.email-capture-title{font-size:1rem;font-weight:600;color:var(--text);margin-bottom:.3rem}
.email-capture-desc{font-size:.83rem;color:var(--muted);margin-bottom:1.25rem;line-height:1.65}
.email-row{display:flex;gap:.75rem;align-items:flex-start}
.email-row .finput{flex:1}
.btn-email{display:inline-flex;align-items:center;gap:.4rem;background:var(--text);color:white;font-family:'Outfit',sans-serif;font-size:.85rem;font-weight:500;padding:.76rem 1.4rem;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;border:none;border-radius:6px}
.btn-email:hover{background:#374151}
.btn-email:disabled{opacity:.4;cursor:not-allowed}
.email-sent{display:flex;align-items:center;gap:.5rem;font-size:.85rem;color:var(--teal);font-weight:500;padding:.5rem 0}
.err{background:var(--rose-bg);border:1px solid var(--rose-border);color:var(--rose);font-size:.8rem;padding:.65rem .9rem;margin-top:.75rem;border-radius:5px}

/* LOADING */
.loading{text-align:center;padding:5rem 0}
.spin{width:40px;height:40px;border:2px solid var(--border);border-top-color:var(--gold2);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 2rem}
@keyframes spin{to{transform:rotate(360deg)}}
.load-title{font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--text);margin-bottom:.4rem}
.load-sub{font-size:.85rem;color:var(--muted);margin-bottom:1.75rem}
.load-steps{list-style:none;display:inline-block;text-align:left}
.load-steps li{font-size:.82rem;color:var(--dim);padding:.3rem 0;transition:color .3s;display:flex;align-items:center;gap:.5rem}
.load-steps li.ls-active{color:var(--text);font-weight:500}
.load-steps li.ls-done{color:var(--teal)}

/* ─── RESULTS ─── */
/* Header */
.r-meta{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem}
.r-meta-label{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.r-chips{display:flex;gap:.4rem;flex-wrap:wrap}
.r-chip{font-size:.72rem;color:var(--muted);background:var(--surface);border:1px solid var(--border);padding:.2rem .6rem;border-radius:20px}

/* HERO CARD */
.r-hero{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:2rem 2.25rem;margin-bottom:1.25rem;box-shadow:var(--shadow-md)}
.r-hero-top{display:grid;grid-template-columns:auto 1fr;gap:2rem;align-items:center;margin-bottom:1.5rem}
.r-hero-score-wrap{text-align:center}
.r-hero-score{font-family:'Cormorant Garamond',serif;font-size:5rem;color:var(--gold2);line-height:1}
.r-hero-denom{font-size:.78rem;color:var(--dim);font-family:'DM Mono',monospace;margin-bottom:.5rem}
.r-hero-summary{font-size:.95rem;color:var(--text);line-height:1.8}
.r-hero-summary strong{color:var(--gold2);font-weight:600}
.mat{display:inline-block;font-family:'DM Mono',monospace;font-size:.62rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:.3rem .85rem;border-radius:20px;margin-top:.4rem}
.mat-b{background:var(--gold-bg);color:var(--gold2);border:1px solid var(--gold-border)}
.mat-d{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.mat-g{background:var(--teal-bg);color:var(--teal);border:1px solid var(--teal-border)}
.mat-a{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}

/* TRACK SCORES */
.track-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:1.5rem}
.tc{background:var(--surface);border:1px solid var(--border);border-top:3px solid;padding:1.25rem;border-radius:8px;box-shadow:var(--shadow)}
.tc1{border-top-color:var(--gold2)}.tc2{border-top-color:var(--blue)}.tc3{border-top-color:var(--teal)}
.tc-name{font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem}
.tc-num{font-family:'Cormorant Garamond',serif;font-size:2.2rem;line-height:1;margin-bottom:.2rem}
.tc1 .tc-num{color:var(--gold2)}.tc2 .tc-num{color:var(--blue)}.tc3 .tc-num{color:var(--teal)}
.tc-mat{font-size:.65rem;font-weight:500;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem}
.tc1 .tc-mat{color:var(--gold2)}.tc2 .tc-mat{color:var(--blue)}.tc3 .tc-mat{color:var(--teal)}
.bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.bar-f{height:100%;transition:width 1.2s ease;border-radius:2px}
.tc1 .bar-f{background:var(--gold2)}.tc2 .bar-f{background:var(--blue)}.tc3 .bar-f{background:var(--teal)}

/* EXEC TOP ACTIONS */
.exec-actions{background:var(--surface);border:1px solid var(--border);border-left:4px solid var(--gold2);border-radius:8px;padding:1.5rem 1.75rem;margin-bottom:1.25rem;box-shadow:var(--shadow)}
.exec-actions-label{font-family:'DM Mono',monospace;font-size:.6rem;text-transform:uppercase;letter-spacing:.14em;color:var(--gold2);margin-bottom:.75rem}
.exec-actions-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:var(--text);margin-bottom:1rem}
.exec-action{display:flex;align-items:flex-start;gap:.875rem;padding:.75rem 0;border-bottom:1px solid var(--border)}
.exec-action:last-child{border-bottom:none;padding-bottom:0}
.exec-action-num{width:24px;height:24px;border-radius:50%;background:var(--gold2);color:white;font-size:.7rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:.15rem}
.exec-action-name{font-size:.9rem;font-weight:600;color:var(--text);margin-bottom:.2rem}
.exec-action-desc{font-size:.8rem;color:var(--muted);line-height:1.55}
.exec-action-pills{display:flex;gap:.4rem;margin-top:.4rem}
.pill{font-family:'DM Mono',monospace;font-size:.58rem;padding:.18rem .55rem;border-radius:10px;text-transform:uppercase;letter-spacing:.07em}
.pill-effort-low{background:var(--teal-bg);color:var(--teal);border:1px solid var(--teal-border)}
.pill-effort-med{background:var(--gold-bg);color:var(--gold2);border:1px solid var(--gold-border)}
.pill-effort-high{background:var(--rose-bg);color:var(--rose);border:1px solid var(--rose-border)}
.pill-impact{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}

/* COLLAPSIBLE SECTIONS */
.rsec{background:var(--surface);border:1px solid var(--border);border-radius:8px;margin-bottom:.75rem;overflow:hidden;box-shadow:var(--shadow)}
.rsec-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.4rem;cursor:pointer;user-select:none;transition:background .15s}
.rsec-hdr:hover{background:#fafaf8}
.rsec-hdr-left{display:flex;align-items:center;gap:.75rem}
.rsec-icon{font-size:1.1rem}
.rsec-title{font-size:.95rem;font-weight:600;color:var(--text)}
.rsec-count{font-family:'DM Mono',monospace;font-size:.6rem;color:var(--dim);background:var(--bg);border:1px solid var(--border);padding:.15rem .5rem;border-radius:10px}
.rsec-chev{font-size:.7rem;color:var(--dim);transition:transform .2s}
.rsec-chev.open{transform:rotate(180deg)}
.rsec-body{padding:0 1.4rem 1.4rem;border-top:1px solid var(--border)}

/* BLIND SPOTS */
.blind-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.75rem;padding-top:1.1rem}
.blind-card{background:var(--indigo-bg);border:1px solid var(--indigo-border);border-left:3px solid var(--indigo);padding:1.25rem;border-radius:6px}
.blind-icon{font-size:1.3rem;margin-bottom:.5rem}
.blind-name{font-size:.85rem;font-weight:600;color:var(--indigo);margin-bottom:.35rem}
.blind-desc{font-size:.8rem;color:#4c1d95;line-height:1.6;opacity:.8}

/* QUICK WINS */
.qw{display:flex;flex-direction:column;gap:.6rem;padding-top:1.1rem}
.qw-card{background:var(--bg);border:1px solid var(--border);padding:1.25rem 1.4rem;display:grid;grid-template-columns:1fr auto;gap:1.25rem;align-items:start;border-radius:6px}
.qw-badge{font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;padding:.2rem .6rem;border-radius:10px;margin-bottom:.4rem;display:inline-block;font-weight:600}
.bg-green{background:var(--teal-bg);color:var(--teal);border:1px solid var(--teal-border)}
.bg-gold{background:var(--gold-bg);color:var(--gold2);border:1px solid var(--gold-border)}
.bg-blue{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.bg-rose{background:var(--rose-bg);color:var(--rose);border:1px solid var(--rose-border)}
.qw-title{font-size:.9rem;font-weight:600;color:var(--text);margin-bottom:.3rem}
.qw-desc{font-size:.82rem;color:var(--muted);line-height:1.6}
.qw-effort{display:flex;flex-direction:column;gap:.5rem;text-align:right;flex-shrink:0;min-width:70px}
.ef-label{font-family:'DM Mono',monospace;font-size:.55rem;color:var(--dim);text-transform:uppercase;letter-spacing:.07em}
.ef-val{font-size:.78rem;font-weight:600}
.ef-low{color:var(--teal)}.ef-med{color:var(--gold2)}.ef-high{color:var(--rose)}

/* RECS */
.recs-list{display:flex;flex-direction:column;gap:.6rem;padding-top:1.1rem}
.rec{background:var(--bg);border:1px solid var(--border);border-left:3px solid;padding:1.2rem 1.4rem;border-radius:6px}
.r-gold{border-left-color:var(--gold2)}.r-blue{border-left-color:var(--blue)}.r-teal{border-left-color:var(--teal)}
.rec-hdr{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;margin-bottom:.35rem}
.rec-title{font-size:.9rem;font-weight:600;color:var(--text);flex:1}
.rec-tag{font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;padding:.18rem .55rem;border-radius:10px;flex-shrink:0;font-weight:500}
.r-gold .rec-tag{background:var(--gold-bg);color:var(--gold2);border:1px solid var(--gold-border)}
.r-blue .rec-tag{background:var(--blue-bg);color:var(--blue);border:1px solid var(--blue-border)}
.r-teal .rec-tag{background:var(--teal-bg);color:var(--teal);border:1px solid var(--teal-border)}
.rec-body{font-size:.83rem;color:var(--muted);line-height:1.65}
.rec-body strong{color:var(--text);font-weight:600}

/* ROADMAP */
.roadmap{padding-top:1.1rem}
.rm-ph{border:1px solid var(--border);border-radius:6px;margin-bottom:.5rem;overflow:hidden}
.rm-ph-hdr{background:var(--bg);padding:.8rem 1.1rem;display:flex;align-items:center;gap:.75rem;cursor:pointer;user-select:none;transition:background .15s}
.rm-ph-hdr:hover{background:var(--surface)}
.rm-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.d1{background:var(--teal)}.d2{background:var(--gold2)}.d3{background:var(--blue)}.d4{background:var(--indigo)}
.rm-ph-name{font-size:.82rem;font-weight:600;color:var(--text);flex:1}
.rm-ph-time{font-family:'DM Mono',monospace;font-size:.6rem;color:var(--dim);background:var(--surface);border:1px solid var(--border);padding:.15rem .55rem;border-radius:10px}
.rm-chev{color:var(--dim);font-size:.65rem;transition:transform .2s}
.rm-chev.open{transform:rotate(180deg)}
.rm-cols-hdr{background:var(--bg);padding:.45rem 1.1rem;display:grid;grid-template-columns:1fr 80px 80px 70px;gap:.75rem;border-top:1px solid var(--border)}
.rm-col-h{font-family:'DM Mono',monospace;font-size:.55rem;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);text-align:center}
.rm-col-h:first-child{text-align:left}
.rm-row{padding:.85rem 1.1rem;border-top:1px solid var(--border);display:grid;grid-template-columns:1fr 80px 80px 70px;gap:.75rem;align-items:center}
.rm-row:hover{background:#fafaf8}
.rm-item-name{font-size:.85rem;font-weight:500;color:var(--text)}
.rm-item-sub{font-size:.73rem;color:var(--muted);margin-top:.12rem}
.rm-col{text-align:center}
.rm-val{font-size:.75rem;font-weight:600}
.effort-low{color:var(--teal)}.effort-med{color:var(--gold2)}.effort-high{color:var(--rose)}

/* CTA */
.cta{background:var(--text);border-radius:10px;padding:2.5rem;text-align:center;margin-top:2rem}
.cta-title{font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:white;margin-bottom:.5rem}
.cta-desc{font-size:.88rem;color:rgba(255,255,255,.6);margin-bottom:1.75rem;line-height:1.7;max-width:440px;margin-left:auto;margin-right:auto}
.cta-btns{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
.btn-p{display:inline-flex;align-items:center;gap:.4rem;background:var(--gold2);color:white;font-family:'Outfit',sans-serif;font-size:.9rem;font-weight:600;padding:.9rem 1.75rem;border:none;cursor:pointer;transition:all .15s;border-radius:6px}
.btn-p:hover{background:var(--gold);transform:translateY(-1px)}
.btn-s{display:inline-flex;align-items:center;background:transparent;color:rgba(255,255,255,.6);font-family:'Outfit',sans-serif;font-size:.85rem;padding:.9rem 1.4rem;border:1.5px solid rgba(255,255,255,.2);cursor:pointer;transition:all .15s;border-radius:6px}
.btn-s:hover{color:white;border-color:rgba(255,255,255,.4)}

.r-footer{margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:.75rem}
.r-footer-txt{font-family:'DM Mono',monospace;font-size:.58rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em}

@media(max-width:580px){
  .track-pills,.track-row,.fgrid,.blind-grid{grid-template-columns:1fr}
  .r-hero-top{grid-template-columns:1fr;gap:1rem;text-align:center}
  .r-hero-score-wrap{display:flex;flex-direction:column;align-items:center}
  .qw-card{grid-template-columns:1fr}
  .rm-cols-hdr,.rm-row{grid-template-columns:1fr 70px 70px}
  .rm-cols-hdr>:last-child,.rm-row>:last-child{display:none}
  .cta-btns{flex-direction:column}
  .exec-action-pills{flex-wrap:wrap}
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
  const [openSec, setOpenSec] = useState({blind:false,wins:false,recs:false,roadmap:false});
  const togSec = k => setOpenSec(p=>({...p,[k]:!p[k]}));
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
    setLoading(true); setStep("loading"); setErr(""); setLoadStep(0);
    const aiS=score("ai"), opsS=score("ops"), grS=score("growth"), dpS=score("deep");
    const total = aiS+opsS+grS;
    const aiM=MATURITY(aiS,12), opsM=MATURITY(opsS,12), grM=MATURITY(grS,12);

    // Animate loading steps in parallel with API call
    let animIdx = 0;
    const animInterval = setInterval(()=>{
      animIdx = Math.min(animIdx+1, 3);
      setLoadStep(animIdx);
    }, 1800);

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
      if (!res.ok || data.error) throw new Error(data.error || "API error");
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      // Extract JSON: find first { to last }
      const start = txt.indexOf("{");
      const end = txt.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("No JSON in response");
      const parsed = JSON.parse(txt.slice(start, end+1));
      setResults({aiS,opsS,grS,total,aiM,opsM,grM,...parsed});
      setStep("results");
    } catch(e) {
      setErr("Something went wrong. Please try again.");
    } finally {
      clearInterval(animInterval);
      setLoading(false);
    }
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
        <div className="wrap">

          {/* NAV */}
          <div className="nav">
            <div className="brand">
              <div className="brand-logo">BA</div>
              <div>
                <div className="brand-text">Business Assessment</div>
                <div className="brand-ver">v1.3</div>
              </div>
            </div>
            {step!=="intro"&&step!=="results"&&step!=="loading"&&(
              <div className="nav-right">
                {step==="bizinfo"?"Your Business":
                 step==="track"?`${curTrack.name} · ${track+1}/3`:
                 step==="deep"?`${deepData.label}`:""}
              </div>
            )}
          </div>

          {/* PROGRESS */}
          {step!=="intro"&&step!=="results"&&(
            <div className="prog-wrap">
              <div className="prog-header">
                <div className="prog-label">{
                  step==="bizinfo"?"Your Business":
                  step==="track"?`${curTrack.name} — Track ${track+1} of 3`:
                  step==="deep"?"Industry Deep Dive":
                  step==="loading"?"Generating Your Report":""}
                </div>
                <div className="prog-pct">{Math.round(prog())}%</div>
              </div>
              <div className="prog-track"><div className="prog-fill" style={{width:`${prog()}%`}}/></div>
              <div className="prog-steps">
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
                        <span className="opt-radio"><span className="opt-radio-dot"/></span>
                        <span>{o}</span>
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
                        <span className="opt-radio"><span className="opt-radio-dot"/></span>
                        <span>{o}</span>
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
              {err ? (
                <>
                  <div className="load-title" style={{color:"var(--rose)"}}>Something went wrong</div>
                  <p className="load-sub" style={{marginBottom:"1.5rem"}}>{err}</p>
                  <button className="btn-next" onClick={()=>{setErr("");setStep("deep");}}>← Try Again</button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

          {/* ── RESULTS ── */}
          {step==="results"&&results&&(
            <div>
              {/* META ROW */}
              <div className="r-meta">
                <div className="r-meta-label">Operations Report · {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
                <div className="r-chips">
                  <span className="r-chip">{biz.industry}</span>
                  <span className="r-chip">{biz.size}</span>
                  <span className="r-chip">{biz.role}</span>
                </div>
              </div>

              {/* HERO CARD */}
              <div className="r-hero">
                <div className="r-hero-top">
                  <div className="r-hero-score-wrap">
                    <div className="r-hero-score">{results.total}</div>
                    <div className="r-hero-denom">out of 36</div>
                    <div className={`mat ${MATURITY(results.total,36).cls}`}>{MATURITY(results.total,36).label}</div>
                  </div>
                  <p className="r-hero-summary" dangerouslySetInnerHTML={{__html:results.summary?.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}}/>
                </div>

                {/* TRACK SCORES inside hero */}
                <div className="track-row" style={{marginBottom:0}}>
                  {[
                    {cls:"tc1",name:"Readiness",s:results.aiS,m:results.aiM},
                    {cls:"tc2",name:"Operations",s:results.opsS,m:results.opsM},
                    {cls:"tc3",name:"Growth & Sales",s:results.grS,m:results.grM},
                  ].map((t,i)=>(
                    <div key={i} className={`tc ${t.cls}`}>
                      <div className="tc-name">{t.name}</div>
                      <div className="tc-num">{t.s}<span style={{fontSize:".9rem",color:"var(--dim)",fontFamily:"'Outfit',sans-serif",fontWeight:400}}>/12</span></div>
                      <div className="tc-mat">{t.m.label}</div>
                      <div className="bar"><div className="bar-f" style={{width:`${(t.s/12)*100}%`}}/></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP 3 ACTIONS — executive summary */}
              <div className="exec-actions">
                <div className="exec-actions-label">Executive Summary</div>
                <div className="exec-actions-title">Top 3 actions for this month</div>
                {results.quickWins?.slice(0,3).map((q,i)=>(
                  <div key={i} className="exec-action">
                    <div className="exec-action-num">{i+1}</div>
                    <div style={{flex:1}}>
                      <div className="exec-action-name">{q.title}</div>
                      <div className="exec-action-desc">{q.desc}</div>
                      <div className="exec-action-pills">
                        <span className={`pill ${q.effortCls==="ef-low"?"pill-effort-low":q.effortCls==="ef-med"?"pill-effort-med":"pill-effort-high"}`}>Effort: {q.effort}</span>
                        <span className="pill pill-impact">Impact: {q.impact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* EMAIL CAPTURE */}
              <div className="email-capture">
                {emailSent ? (
                  <div className="email-sent">✓ Report sent — check your inbox at {emailInput}</div>
                ) : (
                  <>
                    <div className="email-capture-title">Get a copy of this report</div>
                    <p className="email-capture-desc">We'll email you the full report — scores, blind spots, recommendations, and 90-day roadmap.</p>
                    <div className="email-row">
                      <input className="finput" type="email" placeholder="you@company.com" value={emailInput} onChange={e=>setEmailInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReport()}/>
                      <button className="btn-email" disabled={!emailInput||emailSending} onClick={sendReport}>{emailSending?"Sending…":"Email My Report →"}</button>
                    </div>
                    {emailErr&&<div className="err">{emailErr}</div>}
                  </>
                )}
              </div>

              {/* COLLAPSIBLE: BLIND SPOTS */}
              <div className="rsec">
                <div className="rsec-hdr" onClick={()=>togSec("blind")}>
                  <div className="rsec-hdr-left">
                    <span className="rsec-icon">🔍</span>
                    <span className="rsec-title">Your Blind Spots</span>
                    <span className="rsec-count">{results.blindSpots?.length||3}</span>
                  </div>
                  <span className={`rsec-chev ${openSec.blind?"open":""}`}>▼</span>
                </div>
                {openSec.blind&&(
                  <div className="rsec-body">
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
                )}
              </div>

              {/* COLLAPSIBLE: ALL QUICK WINS */}
              <div className="rsec">
                <div className="rsec-hdr" onClick={()=>togSec("wins")}>
                  <div className="rsec-hdr-left">
                    <span className="rsec-icon">⚡</span>
                    <span className="rsec-title">All Quick Wins</span>
                    <span className="rsec-count">{results.quickWins?.length||4}</span>
                  </div>
                  <span className={`rsec-chev ${openSec.wins?"open":""}`}>▼</span>
                </div>
                {openSec.wins&&(
                  <div className="rsec-body">
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
                )}
              </div>

              {/* COLLAPSIBLE: RECOMMENDATIONS */}
              <div className="rsec">
                <div className="rsec-hdr" onClick={()=>togSec("recs")}>
                  <div className="rsec-hdr-left">
                    <span className="rsec-icon">🎯</span>
                    <span className="rsec-title">Personalized Recommendations</span>
                    <span className="rsec-count">{results.recommendations?.length||6}</span>
                  </div>
                  <span className={`rsec-chev ${openSec.recs?"open":""}`}>▼</span>
                </div>
                {openSec.recs&&(
                  <div className="rsec-body">
                    <div className="recs-list">
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
                  </div>
                )}
              </div>

              {/* COLLAPSIBLE: ROADMAP */}
              <div className="rsec">
                <div className="rsec-hdr" onClick={()=>togSec("roadmap")}>
                  <div className="rsec-hdr-left">
                    <span className="rsec-icon">🗓</span>
                    <span className="rsec-title">90-Day Roadmap</span>
                    <span className="rsec-count">4 phases</span>
                  </div>
                  <span className={`rsec-chev ${openSec.roadmap?"open":""}`}>▼</span>
                </div>
                {openSec.roadmap&&(
                  <div className="rsec-body">
                    <div className="roadmap">
                      {results.roadmap?.map((ph,pi)=>(
                        <div key={pi} className="rm-ph">
                          <div className="rm-ph-hdr" onClick={()=>setOpenPh(p=>({...p,[pi]:!p[pi]}))}>
                            <div className={`rm-dot ${ph.dotCls}`}/>
                            <div className="rm-ph-name">{ph.phase}</div>
                            <span className="rm-ph-time">{ph.timeline}</span>
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
                                <div key={ii} className="rm-row">
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
                )}
              </div>

              {/* CTA */}
              <div className="cta">
                <div className="cta-title">Let's build this together</div>
                <p className="cta-desc">Book a free 20-minute strategy call to review your top recommendations and identify the one change that will have the biggest impact on your business this month.</p>
                <div className="cta-btns">
                  <button className="btn-p">Book Free Strategy Call →</button>
                  <button className="btn-s" onClick={()=>{setStep("intro");setAns({ai:{},ops:{},growth:{},deep:{}});setTrack(0);setResults(null);setBiz({company:"",industry:"",size:"",role:""});setOpenPh({0:true,1:false,2:false,3:false});setOpenSec({blind:false,wins:false,recs:false,roadmap:false});setEmailInput("");setEmailSent(false);setEmailErr("");}}>Start Over</button>
                </div>
              </div>

              <div className="r-footer">
                <div className="r-footer-txt">Business Operations Report · Confidential</div>
                <div className="r-footer-txt">{biz.company||"Your Business"} · {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
