'use client';

import type { MeetingSummary as Summary } from '@/lib/anthropic';

interface MeetingSummaryProps {
  summary: Summary | null;
  summarizing: boolean;
  segmentCount: number;
}

export function MeetingSummary({ summary, summarizing, segmentCount }: MeetingSummaryProps) {
  if (segmentCount === 0 && !summarizing) {
    return (
      <div style={{ padding: '3rem 1.25rem', textAlign: 'center', color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.08em' }}>
        Summary will appear after a few minutes of conversation
      </div>
    );
  }

  if (summarizing && !summary) {
    return (
      <div style={{ padding: '2rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 16, height: 16, border: '1.5px solid #1c2030', borderTopColor: '#38d4a0', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#3a4a60', letterSpacing: '0.08em' }}>
          Generating summary…
        </span>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* TL;DR */}
      <div style={{ background: '#08090f', border: '1px solid #1c2030', borderLeft: '3px solid #38d4a0', padding: '0.875rem 1rem' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38d4a0', marginBottom: '0.35rem' }}>
          TL;DR
        </div>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#ddd8cc', lineHeight: 1.65 }}>
          {summary.tldr}
        </p>
      </div>

      {/* Topics */}
      {summary.topics?.length > 0 && (
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#58647a', marginBottom: '0.75rem' }}>
            Topics Covered
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {summary.topics.map((topic, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b8ccdc', marginBottom: '0.3rem' }}>
                  {topic.heading}
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {topic.bullets.map((b, bi) => (
                    <li key={bi} style={{ fontSize: '0.8rem', color: '#58647a', lineHeight: 1.55 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Needs */}
      {summary.clientNeeds?.length > 0 && (
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4a9eff', marginBottom: '0.5rem' }}>
            Client Needs
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {summary.clientNeeds.map((n, i) => (
              <li key={i} style={{ fontSize: '0.8rem', color: '#58647a', lineHeight: 1.55 }}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Open Questions */}
      {summary.openQuestions?.length > 0 && (
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#e8a020', marginBottom: '0.5rem' }}>
            Open Questions
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {summary.openQuestions.map((q, i) => (
              <li key={i} style={{ fontSize: '0.8rem', color: '#58647a', lineHeight: 1.55 }}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {summarizing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #1c2030' }}>
          <div style={{ width: 10, height: 10, border: '1px solid #1c2030', borderTopColor: '#38d4a0', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: '#2a3040' }}>Updating…</span>
        </div>
      )}
    </div>
  );
}
