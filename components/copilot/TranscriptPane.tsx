'use client';

import { useEffect, useRef } from 'react';
import type { TranscriptSegment } from '@/types';

interface TranscriptPaneProps {
  segments: TranscriptSegment[];
  onReset: () => void;
}

export function TranscriptPane({ segments, onReset }: TranscriptPaneProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [segments]);

  return (
    <div className="flex flex-col h-full" style={{ background: '#08090f', border: '1px solid #1c2030' }}>
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid #1c2030' }}
      >
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#58647a' }}>
          Live Transcript
        </span>
        <button
          onClick={onReset}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: '#3a4a60', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'none', border: '1px solid #1c2030', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
        {segments.length === 0 ? (
          <div style={{ color: '#2a3040', fontSize: '0.85rem', fontFamily: "'DM Mono', monospace", textAlign: 'center', marginTop: '2rem' }}>
            Transcript will appear here…
          </div>
        ) : (
          segments.map(seg => (
            <div key={seg.id} className="flex gap-3 items-start">
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#2a3040', flexShrink: 0, paddingTop: '0.2rem' }}>
                {new Date(seg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <p style={{ fontSize: '0.88rem', color: '#8a9eb8', lineHeight: 1.6, margin: 0 }}>
                {seg.text}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
