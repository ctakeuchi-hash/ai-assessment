'use client';

import type { WorkflowStep } from '@/types';
import { NODE_WIDTH, NODE_HEIGHT } from '@/lib/workflow';

const TYPE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  trigger:     { fill: '#0d1f0d', stroke: '#38d4a0', text: '#38d4a0' },
  process:     { fill: '#0a1020', stroke: '#4a9eff', text: '#4a9eff' },
  decision:    { fill: '#1a0e02', stroke: '#e8a020', text: '#e8a020' },
  output:      { fill: '#0e0818', stroke: '#a060f0', text: '#a060f0' },
  integration: { fill: '#1a0a0a', stroke: '#e85858', text: '#e85858' },
};

const TYPE_LABELS: Record<string, string> = {
  trigger: 'TRIGGER',
  process: 'PROCESS',
  decision: 'DECISION',
  output: 'OUTPUT',
  integration: 'INTEGRATION',
};

interface WorkflowNodeProps {
  step: WorkflowStep;
  x: number;
  y: number;
  selected: boolean;
  onClick: (e: React.MouseEvent<SVGGElement>) => void;
}

export function WorkflowNode({ step, x, y, selected, onClick }: WorkflowNodeProps) {
  const colors = TYPE_COLORS[step.type] ?? TYPE_COLORS.process;
  const isDecision = step.type === 'decision';

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {isDecision ? (
        // Diamond shape for decisions
        <polygon
          points={`${NODE_WIDTH / 2},0 ${NODE_WIDTH},${NODE_HEIGHT / 2} ${NODE_WIDTH / 2},${NODE_HEIGHT} 0,${NODE_HEIGHT / 2}`}
          fill={colors.fill}
          stroke={selected ? '#ffffff' : colors.stroke}
          strokeWidth={selected ? 2 : 1.5}
        />
      ) : (
        <rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx={4}
          fill={colors.fill}
          stroke={selected ? '#ffffff' : colors.stroke}
          strokeWidth={selected ? 2 : 1.5}
        />
      )}

      {/* Type badge */}
      <text
        x={NODE_WIDTH / 2}
        y={isDecision ? NODE_HEIGHT / 2 - 8 : 14}
        textAnchor="middle"
        fill={colors.text}
        fontSize={8}
        fontFamily="'DM Mono', monospace"
        letterSpacing="0.1em"
        opacity={0.8}
      >
        {TYPE_LABELS[step.type]}
      </text>

      {/* Label */}
      <text
        x={NODE_WIDTH / 2}
        y={isDecision ? NODE_HEIGHT / 2 + 7 : 32}
        textAnchor="middle"
        fill="#ddd8cc"
        fontSize={11}
        fontFamily="'Outfit', sans-serif"
        fontWeight={500}
      >
        {step.label.length > 20 ? step.label.slice(0, 18) + '…' : step.label}
      </text>
    </g>
  );
}
