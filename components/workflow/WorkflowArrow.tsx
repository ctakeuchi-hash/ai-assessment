'use client';

import type { WorkflowStep } from '@/types';
import type { NodePosition } from '@/lib/workflow';
import { NODE_WIDTH, NODE_HEIGHT } from '@/lib/workflow';

interface WorkflowArrowProps {
  from: WorkflowStep;
  toId: string;
  connIndex: number;
  positions: Record<string, NodePosition>;
}

export function WorkflowArrow({ from, toId, connIndex, positions }: WorkflowArrowProps) {
  const fromPos = positions[from.id];
  const toPos = positions[toId];

  if (!fromPos || !toPos) return null;

  const isDecision = from.type === 'decision';
  const label = isDecision ? (connIndex === 0 ? 'Yes' : 'No') : undefined;

  const x1 = fromPos.x + NODE_WIDTH;
  const y1 = fromPos.y + NODE_HEIGHT / 2;
  const x2 = toPos.x;
  const y2 = toPos.y + NODE_HEIGHT / 2;

  // Bezier control points
  const cx1 = x1 + (x2 - x1) * 0.5;
  const cy1 = y1;
  const cx2 = x1 + (x2 - x1) * 0.5;
  const cy2 = y2;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g>
      <defs>
        <marker
          id={`arrow-${from.id}-${toId}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill="#3a4a60" />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
        fill="none"
        stroke="#3a4a60"
        strokeWidth={1.5}
        strokeDasharray="5,3"
        markerEnd={`url(#arrow-${from.id}-${toId})`}
      />
      {label && (
        <text
          x={midX}
          y={midY - 6}
          textAnchor="middle"
          fill={connIndex === 0 ? '#38d4a0' : '#e85858'}
          fontSize={9}
          fontFamily="'DM Mono', monospace"
        >
          {label}
        </text>
      )}
    </g>
  );
}
