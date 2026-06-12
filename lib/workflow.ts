import type { WorkflowStep } from '@/types';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 56;
const COL_SPACING = 220;
const ROW_SPACING = 90;

export interface NodePosition {
  x: number;
  y: number;
}

export interface WorkflowLayout {
  positions: Record<string, NodePosition>;
  totalWidth: number;
  totalHeight: number;
}

export function computeLayout(steps: WorkflowStep[]): WorkflowLayout {
  if (steps.length === 0) {
    return { positions: {}, totalWidth: 0, totalHeight: 0 };
  }

  const stepMap = new Map(steps.map(s => [s.id, s]));
  const columns: Map<string, number> = new Map();

  // BFS from step "1" to assign column indices
  const queue: string[] = ['1'];
  columns.set('1', 0);
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const step = stepMap.get(id);
    if (!step) continue;

    const col = columns.get(id) ?? 0;
    for (const connId of step.connections) {
      if (!columns.has(connId) || columns.get(connId)! < col + 1) {
        columns.set(connId, col + 1);
      }
      queue.push(connId);
    }
  }

  // Assign any unvisited steps (disconnected) to sequential columns
  let maxCol = Math.max(...Array.from(columns.values()), 0);
  for (const step of steps) {
    if (!columns.has(step.id)) {
      columns.set(step.id, ++maxCol);
    }
  }

  // Group steps by column
  const byColumn: Map<number, string[]> = new Map();
  for (const [id, col] of columns) {
    if (!byColumn.has(col)) byColumn.set(col, []);
    byColumn.get(col)!.push(id);
  }

  const totalCols = Math.max(...Array.from(byColumn.keys())) + 1;
  const maxRows = Math.max(...Array.from(byColumn.values()).map(ids => ids.length));

  const positions: Record<string, NodePosition> = {};

  for (const [col, ids] of byColumn) {
    const colHeight = ids.length * NODE_HEIGHT + (ids.length - 1) * (ROW_SPACING - NODE_HEIGHT);
    const totalHeight = maxRows * NODE_HEIGHT + (maxRows - 1) * (ROW_SPACING - NODE_HEIGHT);
    const startY = (totalHeight - colHeight) / 2;

    ids.forEach((id, rowIndex) => {
      positions[id] = {
        x: col * COL_SPACING + 40,
        y: startY + rowIndex * ROW_SPACING + 40,
      };
    });
  }

  const totalWidth = totalCols * COL_SPACING + NODE_WIDTH + 80;
  const totalHeight = maxRows * ROW_SPACING + NODE_HEIGHT + 80;

  return { positions, totalWidth, totalHeight };
}

export { NODE_WIDTH, NODE_HEIGHT };
