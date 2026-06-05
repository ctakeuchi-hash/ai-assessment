'use client';

import { useState } from 'react';
import type { Workflow, WorkflowStep } from '@/types';

interface WorkflowSidebarProps {
  description: string;
  onDescriptionChange: (v: string) => void;
  onGenerate: () => void;
  generating: boolean;
  workflow: Workflow | null;
  selectedStep: WorkflowStep | null;
  error: string;
}

const PLACEHOLDER = `Describe any business process in plain English. For example:

"When a new lead submits the contact form, send a confirmation email, then check if they're a high-value prospect. If yes, assign to senior rep and schedule a call. If no, add to nurture sequence."`;

export function WorkflowSidebar({
  description,
  onDescriptionChange,
  onGenerate,
  generating,
  workflow,
  selectedStep,
  error,
}: WorkflowSidebarProps) {
  const TYPE_COLORS: Record<string, string> = {
    trigger: '#38d4a0',
    process: '#4a9eff',
    decision: '#e8a020',
    output: '#a060f0',
    integration: '#e85858',
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4" style={{ background: '#0e1018' }}>
      <div>
        <label
          className="block mb-1"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#58647a' }}
        >
          Process Description
        </label>
        <textarea
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={8}
          className="w-full resize-none outline-none"
          style={{
            background: '#08090f',
            border: '1px solid #1c2030',
            color: '#ddd8cc',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.88rem',
            lineHeight: 1.6,
            padding: '0.75rem',
          }}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={generating || !description.trim()}
        style={{
          background: generating || !description.trim() ? '#1c2030' : '#e8a020',
          color: generating || !description.trim() ? '#3a4a60' : '#08090f',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          fontSize: '0.88rem',
          padding: '0.75rem 1.25rem',
          border: 'none',
          cursor: generating || !description.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {generating ? 'Generating…' : 'Visualize Workflow →'}
      </button>

      {error && (
        <div style={{ background: '#1a0808', border: '1px solid #4a1818', color: '#f08080', fontSize: '0.78rem', padding: '0.65rem' }}>
          {error}
        </div>
      )}

      {selectedStep && (
        <div style={{ background: '#08090f', border: '1px solid #1c2030', padding: '1rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[selectedStep.type] ?? '#4a9eff' }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: TYPE_COLORS[selectedStep.type] ?? '#4a9eff' }}>
              {selectedStep.type}
            </span>
          </div>
          <div style={{ fontWeight: 600, color: '#ddd8cc', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
            {selectedStep.label}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#58647a', lineHeight: 1.6 }}>
            {selectedStep.description}
          </div>
          {selectedStep.connections.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#3a4a60', fontFamily: "'DM Mono', monospace" }}>
              → {selectedStep.connections.join(', ')}
            </div>
          )}
        </div>
      )}

      {workflow && !selectedStep && (
        <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: '#3a4a60', fontFamily: "'DM Mono', monospace" }}>
          {workflow.steps.length} steps · click a node for details
        </div>
      )}
    </div>
  );
}
