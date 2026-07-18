'use client';

import { useState, useEffect } from 'react';
import { listSessions, getSession, getSessionSegments, getSessionSuggestions, updateSessionTitle, updateSessionFollowUpContent } from '@/lib/session';
import type { SessionRow, SessionDetail } from '@/lib/session';
import type { TranscriptSegment, CopilotSuggestion, FollowUpContent } from '@/types';
import { buildFollowUpContent } from '@/lib/followup-content';
import { ClientBrief } from '@/components/copilot/ClientBrief';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function duration(start: string, end: string | null) {
  if (!end) return 'In progress';
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return mins < 1 ? '<1 min' : `${mins} min`;
}

type DetailView = 'summary' | 'transcript' | 'suggestions' | 'brief' | 'followup';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [detailTab, setDetailTab] = useState<DetailView>('summary');
  const [detailLoading, setDetailLoading] = useState(false);
  const [followUpContent, setFollowUpContent] = useState<FollowUpContent | null>(null);
  const [clientName, setClientName] = useState('');
  const [consultantName, setConsultantName] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingDeck, setGeneratingDeck] = useState(false);
  const [exportingDoc, setExportingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [crmCompany, setCrmCompany] = useState('');
  const [crmContact, setCrmContact] = useState('');
  const [crmEmail, setCrmEmail] = useState('');
  const [crmStatus, setCrmStatus] = useState<string>('Discovery');
  const [crmNextAction, setCrmNextAction] = useState('');
  const [pushingCRM, setPushingCRM] = useState(false);
  const [crmPushed, setCrmPushed] = useState(false);
  const [search, setSearch] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    listSessions().then(rows => { setSessions(rows); setLoading(false); });
  }, []);

  const filteredSessions = sessions.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (s.title ?? '').toLowerCase().includes(q) || (s.summary_tldr ?? '').toLowerCase().includes(q);
  });

  const startRename = (s: SessionRow) => {
    setRenamingId(s.id);
    setRenameValue(s.title ?? '');
  };

  const commitRename = async () => {
    if (!renamingId) return;
    const title = renameValue.trim();
    if (title) {
      await updateSessionTitle(renamingId, title);
      setSessions(prev => prev.map(s => (s.id === renamingId ? { ...s, title } : s)));
    }
    setRenamingId(null);
  };

  const selectSession = async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    const [d, segs, suggs] = await Promise.all([
      getSession(id),
      getSessionSegments(id),
      getSessionSuggestions(id),
    ]);
    setDetail(d);
    setSegments(segs);
    setSuggestions(suggs);
    setDetailTab('summary');
    setFollowUpContent(d?.followup_content ?? null);
    setDocError(null);
    setDetailLoading(false);
  };

  // Auto-save the draft as it's edited, so it's there again next time this
  // session's Follow-Up tab is opened (debounced so every keystroke doesn't
  // fire a request).
  useEffect(() => {
    if (!selectedId || !followUpContent) return;
    const t = setTimeout(() => { updateSessionFollowUpContent(selectedId, followUpContent); }, 600);
    return () => clearTimeout(t);
  }, [selectedId, followUpContent]);

  // Snapshot, not live-bound: called only on demand so editing a draft mid-call
  // isn't blown away by the next suggestion/summary update.
  const populateFollowUp = () => {
    if (!detail) return;
    setFollowUpContent(buildFollowUpContent(detail, suggestions));
  };

  const updateChallenge = (i: number, field: 'title' | 'body', value: string) => {
    setFollowUpContent(c => c && { ...c, challenges: c.challenges.map((ch, idx) => (idx === i ? { ...ch, [field]: value } : ch)) });
  };
  const removeChallenge = (i: number) => {
    setFollowUpContent(c => c && { ...c, challenges: c.challenges.filter((_, idx) => idx !== i) });
  };
  const addChallenge = () => {
    setFollowUpContent(c => c && { ...c, challenges: [...c.challenges, { title: '', body: '' }] });
  };

  const updateSolution = (i: number, field: 'headline' | 'body' | 'pricingTier' | 'keyBenefit', value: string) => {
    setFollowUpContent(c => c && { ...c, solutions: c.solutions.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)) });
  };
  const removeSolution = (i: number) => {
    setFollowUpContent(c => c && { ...c, solutions: c.solutions.filter((_, idx) => idx !== i) });
  };
  const addSolution = () => {
    setFollowUpContent(c => c && { ...c, solutions: [...c.solutions, { headline: '', body: '', pricingTier: '', keyBenefit: '' }] });
  };

  const downloadPDF = async (endpoint: string, setBusy: (v: boolean) => void, fallbackName: string) => {
    if (!detail || !followUpContent) return;
    setBusy(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: followUpContent, clientName, consultantName, date: detail.created_at }),
      });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') ?? fallbackName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setBusy(false);
  };

  const generateFollowUp = () => downloadPDF('/api/generate-followup', setGeneratingPDF, 'proposal.pdf');
  const generatePitchDeck = () => downloadPDF('/api/generate-pitchdeck', setGeneratingDeck, 'pitch-deck.pdf');

  const exportToGoogleDoc = async () => {
    if (!detail || !followUpContent) return;
    setExportingDoc(true);
    setDocError(null);
    try {
      const res = await fetch('/api/export-to-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: followUpContent, clientName, consultantName, date: detail.created_at }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create Google Doc');
      window.open(data.url, '_blank');
    } catch (e) {
      setDocError(e instanceof Error ? e.message : 'Failed to create Google Doc');
    }
    setExportingDoc(false);
  };

  const pushSessionToCRM = async () => {
    if (!selectedId || !crmCompany) return;
    setPushingCRM(true);
    try {
      const tier = suggestions.find(s => s.pricingTier)?.pricingTier;
      let score = 0;
      for (const s of suggestions) {
        if (s.type === 'closing') score += 3;
        else if (s.type === 'solution' && s.confidence === 'high') score += 1;
        else if (s.type === 'warning') score -= 2;
      }
      const sentiment = score >= 5 ? 'Hot' : score >= 2 ? 'Warm' : 'Cold';
      const painPoints = (detail?.current_state_map?.processes ?? [])
        .flatMap(p => p.painPoints)
        .slice(0, 5)
        .join('\n');

      await fetch('/api/push-to-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: crmCompany,
          contactName: crmContact,
          contactEmail: crmEmail,
          status: crmStatus,
          tier: tier ?? undefined,
          sentiment,
          summary: detail?.summary_tldr ?? '',
          keyPainPoints: painPoints,
          nextAction: crmNextAction,
          sessionId: selectedId,
        }),
      });
      setCrmPushed(true);
      setShowCRMModal(false);
    } catch {}
    setPushingCRM(false);
  };

  const fieldLabel: React.CSSProperties = { fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60' };
  const fieldInput: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: '#08090f', border: '1px solid #1c2030', color: '#ddd8cc', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', padding: '0.5rem 0.65rem', outline: 'none' };
  const fieldTextarea: React.CSSProperties = { ...fieldInput, fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', lineHeight: 1.5, resize: 'vertical' as const, minHeight: 60 };
  const removeBtn: React.CSSProperties = { fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#5a6b80', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.4rem' };
  const addBtn: React.CSSProperties = { alignSelf: 'flex-start', fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38d4a0', background: 'none', border: '1px dashed #1c2030', padding: '0.4rem 0.75rem', cursor: 'pointer' };

  const tabStyle = (active: boolean) => ({
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.58rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: active ? '#ddd8cc' : '#3a4a60',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${active ? '#38d4a0' : 'transparent'}`,
    padding: '0.4rem 0.65rem',
    cursor: 'pointer',
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#08090f', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Session list ── */}
      <div style={{ width: 320, borderRight: '1px solid #1c2030', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <a href="/copilot" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a4a60', textDecoration: 'none' }}>
            ← Copilot
          </a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#38d4a0' }}>
            Call History
          </span>
        </div>

        <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid #1c2030' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by client or summary…"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.68rem',
              color: '#b8ccdc',
              background: '#0e1018',
              border: '1px solid #1c2030',
              borderRadius: 4,
              padding: '0.45rem 0.6rem',
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', textAlign: 'center' }}>
              Loading…
            </div>
          ) : filteredSessions.length === 0 ? (
            <div style={{ padding: '2rem', color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.7 }}>
              {sessions.length === 0 ? <>No sessions yet.<br />Start recording to save a call.</> : 'No matches.'}
            </div>
          ) : (
            filteredSessions.map(s => (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                onClick={() => selectSession(s.id)}
                onKeyDown={e => { if (e.key === 'Enter') selectSession(s.id); }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: selectedId === s.id ? '#0e1018' : 'none',
                  border: 'none',
                  borderBottom: '1px solid #1c2030',
                  padding: '0.875rem 1.25rem',
                  cursor: 'pointer',
                }}
              >
                {renamingId === s.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onClick={e => e.stopPropagation()}
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setRenamingId(null); }}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      fontSize: '0.82rem',
                      color: '#b8ccdc',
                      background: '#161a24',
                      border: '1px solid #38d4a0',
                      borderRadius: 3,
                      padding: '0.15rem 0.3rem',
                      marginBottom: '0.25rem',
                    }}
                  />
                ) : (
                  <div
                    onDoubleClick={e => { e.stopPropagation(); startRename(s); }}
                    style={{ fontSize: '0.82rem', color: '#b8ccdc', marginBottom: '0.25rem', lineHeight: 1.4 }}
                    title="Double-click to rename"
                  >
                    {s.title ?? 'Untitled'}
                  </div>
                )}
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#3a4a60', marginBottom: '0.25rem' }}>
                  {formatDate(s.created_at)} · {duration(s.created_at, s.ended_at)}
                </div>
                {s.summary_tldr && (
                  <div style={{ fontSize: '0.72rem', color: '#3a4a60', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                    {s.summary_tldr}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Detail pane ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedId ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.08em' }}>
            Select a session to review
          </div>
        ) : detailLoading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <div style={{ width: 16, height: 16, border: '1.5px solid #1c2030', borderTopColor: '#38d4a0', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#3a4a60' }}>Loading session…</span>
          </div>
        ) : (
          <>
            <div style={{ padding: '0 0.5rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>
                <button style={tabStyle(detailTab === 'summary')} onClick={() => setDetailTab('summary')}>Summary</button>
                <button style={tabStyle(detailTab === 'brief')} onClick={() => setDetailTab('brief')}>Client Brief</button>
                <button style={tabStyle(detailTab === 'suggestions')} onClick={() => setDetailTab('suggestions')}>
                  Suggestions {suggestions.length > 0 && `(${suggestions.length})`}
                </button>
                <button style={tabStyle(detailTab === 'transcript')} onClick={() => setDetailTab('transcript')}>
                  Transcript {segments.length > 0 && `(${segments.length})`}
                </button>
                <button style={tabStyle(detailTab === 'followup')} onClick={() => setDetailTab('followup')}>
                  Follow-Up
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginRight: '0.5rem' }}>
                <button
                  onClick={() => setShowCRMModal(true)}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: crmPushed ? '#38d4a0' : '#4a9eff', background: 'none', border: `1px solid ${crmPushed ? '#0a2818' : '#0a1830'}`, padding: '0.25rem 0.65rem', cursor: 'pointer', flexShrink: 0 }}
                >
                  {crmPushed ? '✓ In CRM' : 'Push to CRM'}
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>

              {detailTab === 'summary' && detail && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 640 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3a4a60', marginBottom: '0.25rem' }}>
                      {formatDate(detail.created_at)} · {duration(detail.created_at, detail.ended_at)}
                    </div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0ead8' }}>
                      {detail.title}
                    </div>
                  </div>
                  {detail.summary_tldr && (
                    <div style={{ fontSize: '0.85rem', color: '#8ab0c8', lineHeight: 1.7 }}>
                      {detail.summary_tldr}
                    </div>
                  )}
                  {detail.summary_client_needs && detail.summary_client_needs.length > 0 && (
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#58647a', marginBottom: '0.4rem' }}>Client Needs</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {detail.summary_client_needs.map((n, i) => (
                          <li key={i} style={{ fontSize: '0.8rem', color: '#6a8098', lineHeight: 1.6 }}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {detail.summary_open_questions && detail.summary_open_questions.length > 0 && (
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#58647a', marginBottom: '0.4rem' }}>Open Questions</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {detail.summary_open_questions.map((q, i) => (
                          <li key={i} style={{ fontSize: '0.8rem', color: '#6a8098', lineHeight: 1.6 }}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!detail.summary_tldr && (
                    <div style={{ color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.72rem' }}>
                      No summary recorded for this session.
                    </div>
                  )}
                </div>
              )}

              {detailTab === 'brief' && (
                <ClientBrief map={detail?.current_state_map ?? null} extracting={false} />
              )}

              {detailTab === 'suggestions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 640 }}>
                  {suggestions.length === 0 ? (
                    <div style={{ color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.72rem' }}>
                      No suggestions recorded for this session.
                    </div>
                  ) : suggestions.map(s => (
                    <div key={s.id} style={{ background: '#0e1018', border: '1px solid #1c2030', padding: '0.875rem' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60', marginBottom: '0.3rem' }}>
                        {s.type} · {s.confidence}
                      </div>
                      <div style={{ fontWeight: 600, color: '#ddd8cc', fontSize: '0.87rem', marginBottom: '0.3rem' }}>{s.headline}</div>
                      {s.currentState && <div style={{ fontSize: '0.75rem', color: '#3a4a60', fontStyle: 'italic', marginBottom: '0.3rem' }}>Now: {s.currentState}</div>}
                      {s.proposedSolution && <div style={{ fontSize: '0.8rem', color: '#8ab0c8', lineHeight: 1.6 }}>{s.proposedSolution}</div>}
                      {s.triggeredBy && <div style={{ fontSize: '0.7rem', color: '#2a3040', fontStyle: 'italic', marginTop: '0.3rem' }}>"{s.triggeredBy}"</div>}
                    </div>
                  ))}
                </div>
              )}

              {detailTab === 'transcript' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 640 }}>
                  {segments.length === 0 ? (
                    <div style={{ color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.72rem' }}>
                      No transcript recorded for this session.
                    </div>
                  ) : segments.map((seg, i) => (
                    <div key={seg.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', color: '#2a3040', paddingTop: '0.15rem', flexShrink: 0, minWidth: 28, textAlign: 'right' }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#6a8098', lineHeight: 1.65 }}>{seg.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {detailTab === 'followup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 680 }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={fieldLabel}>Client / Company Name</label>
                      <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Acme Corp" style={fieldInput} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={fieldLabel}>Your Name</label>
                      <input value={consultantName} onChange={e => setConsultantName(e.target.value)} placeholder="Your name" style={fieldInput} />
                    </div>
                  </div>

                  <button
                    onClick={populateFollowUp}
                    style={{ alignSelf: 'flex-start', fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#08090f', background: '#38d4a0', border: 'none', padding: '0.6rem 1rem', cursor: 'pointer' }}
                  >
                    {followUpContent ? 'Re-Populate From Call' : 'Populate From Call'}
                  </button>

                  {!followUpContent ? (
                    <div style={{ color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', lineHeight: 1.6 }}>
                      This is a snapshot, not a live view — click above to pull the current summary and suggestions in as a draft, then edit before exporting. Re-click any time to refresh from the latest call data (this overwrites unsaved edits).
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={fieldLabel}>// Our Understanding</label>
                        <textarea
                          value={followUpContent.understanding}
                          onChange={e => setFollowUpContent(c => c && { ...c, understanding: e.target.value })}
                          style={fieldTextarea}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={fieldLabel}>// The Challenge</label>
                        {followUpContent.challenges.map((c, i) => (
                          <div key={i} style={{ background: '#0e1018', border: '1px solid #1c2030', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input value={c.title} onChange={e => updateChallenge(i, 'title', e.target.value)} placeholder="Area" style={{ ...fieldInput, flex: 1, fontWeight: 600 }} />
                              <button onClick={() => removeChallenge(i)} style={removeBtn} title="Remove">✕</button>
                            </div>
                            <textarea value={c.body} onChange={e => updateChallenge(i, 'body', e.target.value)} placeholder="Description" style={fieldTextarea} />
                          </div>
                        ))}
                        <button onClick={addChallenge} style={addBtn}>+ Add Challenge</button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={fieldLabel}>// The Solution</label>
                        {followUpContent.solutions.map((s, i) => (
                          <div key={i} style={{ background: '#0e1018', border: '1px solid #1c2030', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <input value={s.headline} onChange={e => updateSolution(i, 'headline', e.target.value)} placeholder="Headline" style={{ ...fieldInput, flex: 1, fontWeight: 600 }} />
                              <button onClick={() => removeSolution(i)} style={removeBtn} title="Remove">✕</button>
                            </div>
                            <textarea value={s.body} onChange={e => updateSolution(i, 'body', e.target.value)} placeholder="Description" style={fieldTextarea} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input value={s.pricingTier} onChange={e => updateSolution(i, 'pricingTier', e.target.value)} placeholder="Pricing tier" style={{ ...fieldInput, flex: 1 }} />
                              <input value={s.keyBenefit} onChange={e => updateSolution(i, 'keyBenefit', e.target.value)} placeholder="Key benefit" style={{ ...fieldInput, flex: 1 }} />
                            </div>
                          </div>
                        ))}
                        <button onClick={addSolution} style={addBtn}>+ Add Solution</button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={fieldLabel}>// Investment &amp; Timeline</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input value={followUpContent.tier.label} onChange={e => setFollowUpContent(c => c && { ...c, tier: { ...c.tier, label: e.target.value } })} placeholder="Tier" style={{ ...fieldInput, flex: 1 }} />
                          <input value={followUpContent.tier.setup} onChange={e => setFollowUpContent(c => c && { ...c, tier: { ...c.tier, setup: e.target.value } })} placeholder="Setup" style={{ ...fieldInput, flex: 1 }} />
                          <input value={followUpContent.tier.monthly} onChange={e => setFollowUpContent(c => c && { ...c, tier: { ...c.tier, monthly: e.target.value } })} placeholder="Monthly" style={{ ...fieldInput, flex: 1 }} />
                          <input value={followUpContent.goLive} onChange={e => setFollowUpContent(c => c && { ...c, goLive: e.target.value })} placeholder="Go-live" style={{ ...fieldInput, flex: 1 }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={fieldLabel}>// Next Step</label>
                        <textarea
                          value={followUpContent.nextStep}
                          onChange={e => setFollowUpContent(c => c && { ...c, nextStep: e.target.value })}
                          style={fieldTextarea}
                        />
                      </div>

                      {docError && (
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', color: '#e85858', lineHeight: 1.5 }}>
                          {docError}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          onClick={generateFollowUp}
                          disabled={generatingPDF}
                          style={{ flex: 1, fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: generatingPDF ? '#3a4a60' : '#08090f', background: generatingPDF ? '#1c2030' : '#38d4a0', border: 'none', padding: '0.65rem', cursor: generatingPDF ? 'not-allowed' : 'pointer' }}
                        >
                          {generatingPDF ? 'Generating…' : 'One-Pager PDF'}
                        </button>
                        <button
                          onClick={generatePitchDeck}
                          disabled={generatingDeck}
                          style={{ flex: 1, fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: generatingDeck ? '#3a4a60' : '#08090f', background: generatingDeck ? '#1c2030' : '#38d4a0', border: 'none', padding: '0.65rem', cursor: generatingDeck ? 'not-allowed' : 'pointer' }}
                        >
                          {generatingDeck ? 'Generating…' : 'Pitch Deck (4 slides)'}
                        </button>
                        <button
                          onClick={exportToGoogleDoc}
                          disabled={exportingDoc}
                          style={{ flex: 1, fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: exportingDoc ? '#3a4a60' : '#4a9eff', background: 'none', border: `1px solid ${exportingDoc ? '#1c2030' : '#0a1830'}`, padding: '0.65rem', cursor: exportingDoc ? 'not-allowed' : 'pointer' }}
                        >
                          {exportingDoc ? 'Exporting…' : 'Export to Google Doc'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>

      {/* ── CRM Push Modal ── */}
      {showCRMModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0e1018', border: '1px solid #1c2030', padding: '2rem', width: 440, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0ead8' }}>Add to Pipeline</div>

            {[
              { label: 'Company / Client Name *', value: crmCompany, set: setCrmCompany, placeholder: 'Acme Corp' },
              { label: 'Contact Name', value: crmContact, set: setCrmContact, placeholder: 'Jane Smith' },
              { label: 'Contact Email', value: crmEmail, set: setCrmEmail, placeholder: 'jane@acme.com' },
              { label: 'Next Action', value: crmNextAction, set: setCrmNextAction, placeholder: 'Send scoping call invite' },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60' }}>{label}</label>
                <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                  style={{ background: '#08090f', border: '1px solid #1c2030', color: '#ddd8cc', fontFamily: "'DM Mono', monospace", fontSize: '0.82rem', padding: '0.5rem 0.75rem', outline: 'none' }} />
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60' }}>Status</label>
              <select value={crmStatus} onChange={e => setCrmStatus(e.target.value)}
                style={{ background: '#08090f', border: '1px solid #1c2030', color: '#ddd8cc', fontFamily: "'DM Mono', monospace", fontSize: '0.82rem', padding: '0.5rem 0.75rem', outline: 'none' }}>
                {['Discovery', 'Proposal Sent', 'Negotiating', 'Won', 'Lost', 'Nurture'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={pushSessionToCRM} disabled={pushingCRM || !crmCompany}
                style={{ flex: 1, fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: (pushingCRM || !crmCompany) ? '#3a4a60' : '#08090f', background: (pushingCRM || !crmCompany) ? '#1c2030' : '#4a9eff', border: 'none', padding: '0.65rem', cursor: (pushingCRM || !crmCompany) ? 'not-allowed' : 'pointer' }}>
                {pushingCRM ? 'Pushing…' : 'Add to Airtable CRM'}
              </button>
              <button onClick={() => setShowCRMModal(false)}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60', background: 'none', border: '1px solid #1c2030', padding: '0.65rem 1rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
