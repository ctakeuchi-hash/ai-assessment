'use client';

import { useState, useEffect } from 'react';
import { listSessions, getSession, getSessionSegments, getSessionSuggestions } from '@/lib/session';
import type { SessionRow, SessionDetail } from '@/lib/session';
import type { TranscriptSegment, CopilotSuggestion } from '@/types';
import { ClientBrief } from '@/components/copilot/ClientBrief';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function duration(start: string, end: string | null) {
  if (!end) return 'In progress';
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return mins < 1 ? '<1 min' : `${mins} min`;
}

type DetailView = 'summary' | 'transcript' | 'suggestions' | 'brief';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [detailTab, setDetailTab] = useState<DetailView>('summary');
  const [detailLoading, setDetailLoading] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [consultantName, setConsultantName] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [crmCompany, setCrmCompany] = useState('');
  const [crmContact, setCrmContact] = useState('');
  const [crmEmail, setCrmEmail] = useState('');
  const [crmStatus, setCrmStatus] = useState<string>('Discovery');
  const [crmNextAction, setCrmNextAction] = useState('');
  const [pushingCRM, setPushingCRM] = useState(false);
  const [crmPushed, setCrmPushed] = useState(false);

  useEffect(() => {
    listSessions().then(rows => { setSessions(rows); setLoading(false); });
  }, []);

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
    setDetailLoading(false);
  };

  const generateFollowUp = async () => {
    if (!selectedId) return;
    setGeneratingPDF(true);
    try {
      const res = await fetch('/api/generate-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedId, clientName, consultantName }),
      });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') ?? 'proposal.pdf';
      a.click();
      URL.revokeObjectURL(url);
      setShowFollowUpModal(false);
    } catch {}
    setGeneratingPDF(false);
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

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', textAlign: 'center' }}>
              Loading…
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: '2rem', color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.7 }}>
              No sessions yet.<br />Start recording to save a call.
            </div>
          ) : (
            sessions.map(s => (
              <button
                key={s.id}
                onClick={() => selectSession(s.id)}
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
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#3a4a60', marginBottom: '0.25rem' }}>
                  {formatDate(s.created_at)} · {duration(s.created_at, s.ended_at)}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#b8ccdc', marginBottom: '0.25rem', lineHeight: 1.4 }}>
                  {s.title ?? 'Untitled'}
                </div>
                {s.summary_tldr && (
                  <div style={{ fontSize: '0.72rem', color: '#3a4a60', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                    {s.summary_tldr}
                  </div>
                )}
              </button>
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
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginRight: '0.5rem' }}>
                <button
                  onClick={() => setShowCRMModal(true)}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: crmPushed ? '#38d4a0' : '#4a9eff', background: 'none', border: `1px solid ${crmPushed ? '#0a2818' : '#0a1830'}`, padding: '0.25rem 0.65rem', cursor: 'pointer', flexShrink: 0 }}
                >
                  {crmPushed ? '✓ In CRM' : 'Push to CRM'}
                </button>
                <button
                  onClick={() => setShowFollowUpModal(true)}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38d4a0', background: 'none', border: '1px solid #0a2818', padding: '0.25rem 0.65rem', cursor: 'pointer', flexShrink: 0 }}
                >
                  Generate Follow-Up PDF
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

            </div>
          </>
        )}
      </div>

      {/* ── Follow-Up PDF Modal ── */}
      {showFollowUpModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#0e1018', border: '1px solid #1c2030', padding: '2rem', width: 400, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0ead8' }}>Generate Follow-Up PDF</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60' }}>Client / Company Name</label>
              <input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Acme Corp"
                style={{ background: '#08090f', border: '1px solid #1c2030', color: '#ddd8cc', fontFamily: "'DM Mono', monospace", fontSize: '0.82rem', padding: '0.5rem 0.75rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60' }}>Your Name</label>
              <input
                value={consultantName}
                onChange={e => setConsultantName(e.target.value)}
                placeholder="Your name"
                style={{ background: '#08090f', border: '1px solid #1c2030', color: '#ddd8cc', fontFamily: "'DM Mono', monospace", fontSize: '0.82rem', padding: '0.5rem 0.75rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={generateFollowUp}
                disabled={generatingPDF}
                style={{ flex: 1, fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: generatingPDF ? '#3a4a60' : '#08090f', background: generatingPDF ? '#1c2030' : '#38d4a0', border: 'none', padding: '0.65rem', cursor: generatingPDF ? 'not-allowed' : 'pointer' }}
              >
                {generatingPDF ? 'Generating…' : 'Download PDF'}
              </button>
              <button
                onClick={() => setShowFollowUpModal(false)}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a4a60', background: 'none', border: '1px solid #1c2030', padding: '0.65rem 1rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
