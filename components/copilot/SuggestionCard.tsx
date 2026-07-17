'use client';

import { useState } from 'react';
import type { CopilotSuggestion } from '@/types';

const TYPE_STYLES: Record<string, { bg: string; border: string; label: string; labelColor: string }> = {
  solution:  { bg: '#080818', border: '#4a9eff', label: 'Solution',  labelColor: '#4a9eff' },
  question:  { bg: '#080e18', border: '#38d4a0', label: 'Question',  labelColor: '#38d4a0' },
  workflow:  { bg: '#0a0e08', border: '#90d040', label: 'Workflow',  labelColor: '#90d040' },
  warning:   { bg: '#180e02', border: '#e8a020', label: 'Warning',   labelColor: '#e8a020' },
  closing:   { bg: '#021208', border: '#38d4a0', label: 'Say This →', labelColor: '#38d4a0' },
};

const CONFIDENCE_COLOR: Record<string, string> = {
  high:   '#38d4a0',
  medium: '#e8a020',
  low:    '#58647a',
};

interface SuggestionCardProps {
  suggestion: CopilotSuggestion;
  onSendToWorkflow?: (headline: string) => void;
}

export function SuggestionCard({ suggestion, onSendToWorkflow }: SuggestionCardProps) {
  const styles = TYPE_STYLES[suggestion.type] ?? TYPE_STYLES.solution;
  const isClosing = suggestion.type === 'closing';
  const hasDetail = !!(
    suggestion.detail || suggestion.currentState || suggestion.proposedSolution ||
    suggestion.pricingTier || suggestion.keyBenefit || suggestion.triggeredBy ||
    suggestion.likelyObjection || suggestion.objectionResponse
  );
  // Closing suggestions are already a short script — show them open. Everything else starts collapsed.
  const [expanded, setExpanded] = useState(isClosing);

  return (
    <div
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        borderLeft: `3px solid ${styles.border}`,
        padding: '1rem',
        animation: 'slideIn 0.3s ease',
        cursor: hasDetail && !isClosing ? 'pointer' : 'default',
      }}
      onClick={() => hasDetail && !isClosing && setExpanded(e => !e)}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: styles.labelColor }}>
          {styles.label}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', color: CONFIDENCE_COLOR[suggestion.confidence] ?? '#58647a' }}>
            {suggestion.confidence} confidence
          </span>
          {hasDetail && !isClosing && (
            <span style={{ fontSize: '0.6rem', color: '#3a4a60' }}>{expanded ? '▾' : '▸'}</span>
          )}
        </span>
      </div>

      {/* Headline */}
      <div style={{ fontWeight: 600, color: isClosing ? '#38d4a0' : '#ddd8cc', fontSize: isClosing ? '0.95rem' : '0.87rem', lineHeight: 1.4, marginBottom: expanded ? '0.4rem' : 0 }}>
        {suggestion.headline}
      </div>

      {/* Objection teaser — visible even collapsed so reps know a script is one click away */}
      {!expanded && (suggestion.likelyObjection || suggestion.objectionResponse) && (
        <div style={{ fontSize: '0.68rem', color: '#e85858', marginTop: '0.4rem' }}>
          ▸ Objection script ready
        </div>
      )}

      {expanded && (
        <>
          {/* Current State */}
          {suggestion.currentState && (
            <div style={{ fontSize: '0.78rem', color: '#3a4a60', fontStyle: 'italic', marginBottom: '0.4rem', lineHeight: 1.55 }}>
              Now: {suggestion.currentState}
            </div>
          )}

          {/* Proposed Solution */}
          {suggestion.proposedSolution && (
            <div style={{ fontSize: '0.82rem', color: '#8ab0c8', lineHeight: 1.6, marginBottom: '0.5rem', borderLeft: '2px solid #1c2030', paddingLeft: '0.6rem' }}>
              {suggestion.proposedSolution}
            </div>
          )}

          {/* Detail */}
          {suggestion.detail && !isClosing && (
            <div style={{ fontSize: '0.8rem', color: '#58647a', lineHeight: 1.65, marginBottom: '0.5rem' }}>
              {suggestion.detail}
            </div>
          )}

          {/* Closing detail gets more prominent treatment */}
          {suggestion.detail && isClosing && (
            <div style={{ fontSize: '0.87rem', color: '#b8d8c0', lineHeight: 1.7, marginBottom: '0.5rem', background: '#021a08', border: '1px solid #0a2818', padding: '0.65rem 0.875rem' }}>
              "{suggestion.detail}"
            </div>
          )}

          {/* Pricing + Benefit chips */}
          {(suggestion.pricingTier || suggestion.keyBenefit) && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {suggestion.pricingTier && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#e8a020', background: '#140e02', border: '1px solid #3a2808', padding: '0.2rem 0.6rem' }}>
                  {suggestion.pricingTier}
                </span>
              )}
              {suggestion.keyBenefit && (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#38d4a0', background: '#021008', border: '1px solid #0a2818', padding: '0.2rem 0.6rem' }}>
                  {suggestion.keyBenefit}
                </span>
              )}
            </div>
          )}

          {/* Triggered by */}
          {suggestion.triggeredBy && (
            <div style={{ fontSize: '0.72rem', color: '#2a3040', fontStyle: 'italic', marginBottom: '0.4rem' }}>
              "{suggestion.triggeredBy}"
            </div>
          )}

          {/* Objection script */}
          {(suggestion.likelyObjection || suggestion.objectionResponse) && (
            <div style={{ background: '#0e0202', border: '1px solid #2a0808', padding: '0.75rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: '#e85858', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Objection Script
              </div>
              {suggestion.likelyObjection && (
                <div style={{ fontSize: '0.75rem', color: '#e85858', fontStyle: 'italic', marginBottom: '0.4rem' }}>
                  "{suggestion.likelyObjection}"
                </div>
              )}
              {suggestion.objectionResponse && (
                <div style={{ fontSize: '0.78rem', color: '#a07878', lineHeight: 1.65 }}>
                  {suggestion.objectionResponse}
                </div>
              )}
            </div>
          )}

          {/* Send to Workflow */}
          {suggestion.type === 'workflow' && onSendToWorkflow && (
            <button
              onClick={(e) => { e.stopPropagation(); onSendToWorkflow(suggestion.proposedSolution || suggestion.detail || suggestion.headline); }}
              style={{ marginTop: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#90d040', background: '#0a1402', border: '1px solid #1a2808', padding: '0.3rem 0.7rem', cursor: 'pointer' }}
            >
              Send to Workflow →
            </button>
          )}
        </>
      )}
    </div>
  );
}
