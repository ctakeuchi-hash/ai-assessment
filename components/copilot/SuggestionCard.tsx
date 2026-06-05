'use client';

import type { CopilotSuggestion } from '@/types';

const TYPE_STYLES: Record<CopilotSuggestion['type'], { bg: string; border: string; label: string; labelColor: string }> = {
  solution:  { bg: '#080818', border: '#4a9eff', label: 'Solution',  labelColor: '#4a9eff' },
  question:  { bg: '#080e18', border: '#38d4a0', label: 'Question',  labelColor: '#38d4a0' },
  workflow:  { bg: '#0a0e08', border: '#90d040', label: 'Workflow',  labelColor: '#90d040' },
  warning:   { bg: '#180e02', border: '#e8a020', label: 'Warning',   labelColor: '#e8a020' },
};

const CONFIDENCE_COLOR: Record<CopilotSuggestion['confidence'], string> = {
  high:   '#38d4a0',
  medium: '#e8a020',
  low:    '#58647a',
};

interface SuggestionCardProps {
  suggestion: CopilotSuggestion;
  onSendToWorkflow?: (headline: string) => void;
}

export function SuggestionCard({ suggestion, onSendToWorkflow }: SuggestionCardProps) {
  const styles = TYPE_STYLES[suggestion.type];

  return (
    <div
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        borderLeft: `3px solid ${styles.border}`,
        padding: '1rem',
        animation: 'slideIn 0.3s ease',
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-2" style={{ gap: '0.5rem' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: styles.labelColor }}>
          {styles.label}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', color: CONFIDENCE_COLOR[suggestion.confidence] }}>
          {suggestion.confidence} confidence
        </span>
      </div>

      <div style={{ fontWeight: 600, color: '#ddd8cc', fontSize: '0.87rem', marginBottom: '0.35rem' }}>
        {suggestion.headline}
      </div>

      <div style={{ fontSize: '0.8rem', color: '#58647a', lineHeight: 1.65, marginBottom: '0.5rem' }}>
        {suggestion.detail}
      </div>

      {suggestion.triggeredBy && (
        <div style={{ fontSize: '0.72rem', color: '#2a3040', fontStyle: 'italic', marginBottom: suggestion.type === 'workflow' ? '0.5rem' : 0 }}>
          "{suggestion.triggeredBy}"
        </div>
      )}

      {suggestion.type === 'workflow' && onSendToWorkflow && (
        <button
          onClick={() => onSendToWorkflow(suggestion.detail || suggestion.headline)}
          style={{
            marginTop: '0.5rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#90d040',
            background: '#0a1402',
            border: '1px solid #1a2808',
            padding: '0.3rem 0.7rem',
            cursor: 'pointer',
          }}
        >
          Send to Workflow →
        </button>
      )}
    </div>
  );
}
