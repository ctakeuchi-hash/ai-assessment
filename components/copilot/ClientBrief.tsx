'use client';

import { useState } from 'react';
import type { CurrentStateMap, Workflow } from '@/types';
import { generateWorkflow } from '@/lib/anthropic';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';

const MATURITY_STYLES = {
  beginner:   { color: '#e85858', bg: '#1a0808', border: '#4a1818', label: 'Beginner' },
  developing: { color: '#e8a020', bg: '#180e02', border: '#3a2808', label: 'Developing' },
  growing:    { color: '#4a9eff', bg: '#020810', border: '#0a1830', label: 'Growing' },
  advanced:   { color: '#38d4a0', bg: '#021008', border: '#0a2818', label: 'Advanced' },
};

const OPPORTUNITY_DOT: Record<string, string> = {
  high:   '#e85858',
  medium: '#e8a020',
  low:    '#3a4a60',
};

interface ClientBriefProps {
  map: CurrentStateMap | null;
  extracting: boolean;
}

export function ClientBrief({ map, extracting }: ClientBriefProps) {
  const [diagramming, setDiagramming] = useState<number | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!map && !extracting) {
    return (
      <div style={{ padding: '3rem 1.25rem', textAlign: 'center', color: '#2a3040', fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.08em', lineHeight: 1.7 }}>
        Client process map builds as they describe<br />how they operate today.
        <br /><br />
        <span style={{ color: '#1c2030' }}>Triggers after ~15 transcript segments.</span>
      </div>
    );
  }

  if (extracting && !map) {
    return (
      <div style={{ padding: '2rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 16, height: 16, border: '1.5px solid #1c2030', borderTopColor: '#4a9eff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#3a4a60', letterSpacing: '0.08em' }}>
          Mapping client's current state…
        </span>
      </div>
    );
  }

  if (!map) return null;

  const timeAgo = () => {
    const secs = Math.floor((Date.now() - map.updatedAt) / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    return `${mins}m ago`;
  };

  const diagramArea = async (i: number, area: CurrentStateMap['processes'][number]) => {
    setDiagramming(i);
    try {
      const description = `${area.area}: ${area.currentState}${area.painPoints.length ? `. Pain points: ${area.painPoints.join('; ')}` : ''}`;
      const wf = await generateWorkflow(description);
      setWorkflow(wf);
      setSelectedId(null);
    } catch {}
    setDiagramming(null);
  };

  return (
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: '#f0ead8' }}>
          Current State Map
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {extracting && (
            <div style={{ width: 8, height: 8, border: '1px solid #1c2030', borderTopColor: '#4a9eff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          )}
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', color: '#2a3040' }}>
            Updated {timeAgo()}
          </span>
        </div>
      </div>

      {/* Process Areas */}
      {map.processes.length === 0 ? (
        <div style={{ color: '#2a3040', fontSize: '0.8rem', fontFamily: "'DM Mono', monospace' " }}>
          No processes mapped yet — keep the conversation going.
        </div>
      ) : (
        map.processes.map((area, i) => {
          const mStyle = MATURITY_STYLES[area.maturity] ?? MATURITY_STYLES.beginner;
          return (
            <div key={i} style={{ background: '#08090f', border: '1px solid #1c2030', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                {/* Opportunity dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: OPPORTUNITY_DOT[area.opportunitySize], flexShrink: 0 }} title={`${area.opportunitySize} opportunity`} />
                <span style={{ fontWeight: 600, color: '#b8ccdc', fontSize: '0.85rem' }}>
                  {area.area}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: mStyle.color, background: mStyle.bg, border: `1px solid ${mStyle.border}`, padding: '0.15rem 0.45rem' }}>
                  {mStyle.label}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#58647a', lineHeight: 1.6, marginBottom: area.painPoints.length > 0 ? '0.5rem' : 0 }}>
                {area.currentState}
              </div>

              {area.painPoints.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  {area.painPoints.map((pt, pi) => (
                    <li key={pi} style={{ fontSize: '0.75rem', color: '#e85858', lineHeight: 1.5 }}>
                      {pt}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => diagramArea(i, area)}
                disabled={diagramming === i}
                style={{ marginTop: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: diagramming === i ? '#3a4a60' : '#4a9eff', background: 'none', border: '1px solid #1c2030', padding: '0.25rem 0.6rem', cursor: diagramming === i ? 'not-allowed' : 'pointer' }}
              >
                {diagramming === i ? 'Diagramming…' : 'Diagram This →'}
              </button>
            </div>
          );
        })
      )}

      {/* Technology */}
      {map.technologyMentioned.length > 0 && (
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#58647a', marginBottom: '0.4rem' }}>
            Tech Stack Mentioned
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {map.technologyMentioned.map((t, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#4a9eff', background: '#020810', border: '1px solid #0a1830', padding: '0.2rem 0.55rem' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Budget Signals */}
      {map.budgetSignals.length > 0 && (
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#e8a020', marginBottom: '0.35rem' }}>
            Budget Signals
          </div>
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            {map.budgetSignals.map((s, i) => (
              <li key={i} style={{ fontSize: '0.78rem', color: '#8a7040', lineHeight: 1.6 }}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline Signals */}
      {map.timelineSignals.length > 0 && (
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38d4a0', marginBottom: '0.35rem' }}>
            Timeline Signals
          </div>
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            {map.timelineSignals.map((s, i) => (
              <li key={i} style={{ fontSize: '0.78rem', color: '#406858', lineHeight: 1.6 }}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {workflow && (
        <div
          onClick={() => setWorkflow(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(4,5,10,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#08090f', border: '1px solid #1c2030', maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid #1c2030' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: '#f0ead8' }}>
                {workflow.title}
              </span>
              <button
                onClick={() => setWorkflow(null)}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#3a4a60', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ overflow: 'auto', padding: '1rem' }}>
              <WorkflowCanvas workflow={workflow} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
