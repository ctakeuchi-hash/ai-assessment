'use client';

import { useState, useCallback } from 'react';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { WorkflowSidebar } from '@/components/workflow/WorkflowSidebar';
import { generateWorkflow } from '@/lib/anthropic';
import type { Workflow, WorkflowStep } from '@/types';

export default function WorkflowPage() {
  const [description, setDescription] = useState('');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const selectedStep = workflow?.steps.find(s => s.id === selectedId) ?? null;

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) return;
    setGenerating(true);
    setError('');
    setSelectedId(null);
    try {
      const wf = await generateWorkflow(description);
      setWorkflow(wf);
    } catch (e: any) {
      setError(e.message ?? 'Failed to generate workflow');
    } finally {
      setGenerating(false);
    }
  }, [description]);

  return (
    <div
      style={{ display: 'flex', height: '100vh', background: '#08090f', fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Sidebar */}
      <div style={{ width: 320, flexShrink: 0, borderRight: '1px solid #1c2030', overflowY: 'auto' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a4a60', textDecoration: 'none' }}>
            ← Back
          </a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e8a020' }}>
            Workflow Visualizer
          </span>
        </div>
        <WorkflowSidebar
          description={description}
          onDescriptionChange={setDescription}
          onGenerate={handleGenerate}
          generating={generating}
          workflow={workflow}
          selectedStep={selectedStep}
          error={error}
        />
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {workflow ? (
          <>
            <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0ead8' }}>
                {workflow.title}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: '#3a4a60' }}>
                {workflow.steps.length} nodes
              </span>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
              <WorkflowCanvas
                workflow={workflow}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#2a3040' }}>
            <div style={{ fontSize: '3rem' }}>◇</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {generating ? 'Building diagram…' : 'Describe a process to visualize it'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
