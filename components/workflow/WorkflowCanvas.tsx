'use client';

import type { Workflow, WorkflowStep } from '@/types';
import { computeLayout } from '@/lib/workflow';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowArrow } from './WorkflowArrow';

interface WorkflowCanvasProps {
  workflow: Workflow;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function WorkflowCanvas({ workflow, selectedId, onSelect }: WorkflowCanvasProps) {
  const layout = computeLayout(workflow.steps);
  const { positions, totalWidth, totalHeight } = layout;

  return (
    <div className="overflow-auto w-full h-full">
      <svg
        width={Math.max(totalWidth, 600)}
        height={Math.max(totalHeight, 300)}
        style={{ display: 'block' }}
        onClick={() => onSelect(null)}
      >
        {/* Arrows first (behind nodes) */}
        {workflow.steps.map(step =>
          step.connections.map((connId, ci) => (
            <WorkflowArrow
              key={`${step.id}-${connId}`}
              from={step}
              toId={connId}
              connIndex={ci}
              positions={positions}
            />
          ))
        )}

        {/* Nodes */}
        {workflow.steps.map(step => {
          const pos = positions[step.id];
          if (!pos) return null;
          return (
            <WorkflowNode
              key={step.id}
              step={step}
              x={pos.x}
              y={pos.y}
              selected={selectedId === step.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(step.id);
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
