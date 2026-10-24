import { useId } from 'react';
import type { VizState } from './viz';

const NODE_R = 18;

// SVG twins of the Cell states: same fill/outline/ink tokens, dashed where the Cell is dashed.
const NODE_CLASSES: Record<VizState, { box: string; text: string; dash?: string }> = {
  plain: { box: 'fill-surface-2 stroke-hairline-strong', text: 'fill-ink' },
  current: { box: 'fill-state-current-bg stroke-state-current-border', text: 'fill-state-current-ink font-semibold' },
  comparing: { box: 'fill-state-comparing-bg stroke-state-comparing-border', text: 'fill-state-comparing-ink', dash: '4 3' },
  range: { box: 'fill-state-range-bg stroke-state-range-border', text: 'fill-state-range-ink' },
  visited: { box: 'fill-state-visited-bg stroke-state-visited-border', text: 'fill-state-visited-ink' },
  found: { box: 'fill-state-found-bg stroke-state-found-border', text: 'fill-state-found-ink' },
  discarded: { box: 'fill-state-discarded-bg stroke-state-discarded-border', text: 'fill-state-discarded-ink', dash: '4 3' },
};

export interface GraphNode {
  id: number | string;
  state?: VizState;
  /** Small text under the node (a distance, an in-degree ...). */
  sub?: string;
}

/** plain = untouched, active = being followed now, dim = already used, discarded = ruled out (dashed). */
export type EdgeState = 'plain' | 'active' | 'dim' | 'discarded';

export interface GraphEdge {
  from: number | string;
  to: number | string;
  label?: string;
  state?: EdgeState;
}

const EDGE_CLASSES: Record<EdgeState, { line: string; head: string; width: number; dash?: string }> = {
  plain: { line: 'stroke-hairline-tertiary', head: 'fill-hairline-tertiary', width: 1.5 },
  active: { line: 'stroke-accent-hover', head: 'fill-accent-hover', width: 2.5 },
  dim: { line: 'stroke-ink-tertiary', head: 'fill-ink-tertiary', width: 1.5 },
  discarded: { line: 'stroke-ink-subtle', head: 'fill-ink-subtle', width: 1.5, dash: '4 3' },
};

interface Point {
  x: number;
  y: number;
}

const toward = (a: Point, b: Point, distance: number): Point => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: a.x + (dx / len) * distance, y: a.y + (dy / len) * distance };
};

/**
 * Nodes on a circle with straight or curved edges. Opposite edges between the same two nodes bow
 * to either side so both stay visible; `directed` adds arrowheads.
 */
export function GraphDiagram({ nodes, edges, directed = false }: { nodes: GraphNode[]; edges: GraphEdge[]; directed?: boolean }) {
  const markerId = useId();
  const n = nodes.length;
  if (n === 0) return null;

  const radius = n === 1 ? 0 : Math.max(80, n * 18);
  const size = radius * 2 + 130;
  const center = size / 2;
  const at = new Map<number | string, Point>(
    nodes.map((node, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return [node.id, { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) }];
    }),
  );
  const pairs = new Set(edges.map((e) => `${e.from}>${e.to}`));
  const outward = (p: Point): Point => {
    const dx = p.x - center;
    const dy = p.y - center;
    const len = Math.hypot(dx, dy);
    return len < 1 ? { x: 0, y: 1 } : { x: dx / len, y: dy / len };
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-auto w-full" style={{ maxWidth: size * 1.15 }} role="img">
      <defs>
        {(Object.keys(EDGE_CLASSES) as EdgeState[]).map((state) => (
          <marker
            key={state}
            id={`${markerId}-${state}`}
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" className={EDGE_CLASSES[state].head} />
          </marker>
        ))}
      </defs>

      {edges.map((edge, i) => {
        const p1 = at.get(edge.from);
        const p2 = at.get(edge.to);
        if (!p1 || !p2 || edge.from === edge.to) return null;
        const style = EDGE_CLASSES[edge.state ?? 'plain'];
        // Bow an edge when its reverse also exists, to opposite sides by direction.
        const curved = directed && pairs.has(`${edge.to}>${edge.from}`);
        const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const len = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
        const bow = curved ? (String(edge.from) < String(edge.to) ? 1 : -1) * 26 : 0;
        const ctrl = { x: mid.x - ((p2.y - p1.y) / len) * bow, y: mid.y + ((p2.x - p1.x) / len) * bow };
        const aim = curved ? ctrl : p2;
        const start = toward(p1, aim, NODE_R);
        const end = toward(p2, curved ? ctrl : p1, NODE_R + (directed ? 2 : 0));
        const labelAt = curved
          ? { x: 0.25 * start.x + 0.5 * ctrl.x + 0.25 * end.x, y: 0.25 * start.y + 0.5 * ctrl.y + 0.25 * end.y }
          : mid;

        return (
          <g key={i}>
            <path
              d={curved ? `M${start.x},${start.y} Q${ctrl.x},${ctrl.y} ${end.x},${end.y}` : `M${start.x},${start.y} L${end.x},${end.y}`}
              fill="none"
              strokeWidth={style.width}
              strokeDasharray={style.dash}
              className={`${style.line} transition-colors duration-200`}
              markerEnd={directed ? `url(#${markerId}-${edge.state ?? 'plain'})` : undefined}
            />
            {edge.label && (
              <text
                x={labelAt.x}
                y={labelAt.y}
                textAnchor="middle"
                dominantBaseline="central"
                strokeWidth={4}
                style={{ paintOrder: 'stroke' }}
                className="stroke-canvas fill-ink-muted font-mono text-caption"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {nodes.map((node) => {
        const p = at.get(node.id)!;
        const look = NODE_CLASSES[node.state ?? 'plain'];
        return (
          <g key={node.id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={NODE_R}
              strokeWidth={1.5}
              strokeDasharray={look.dash}
              className={`${look.box} transition-colors duration-200`}
            />
            <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className={`font-mono text-code ${look.text}`}>
              {node.id}
            </text>
            {node.sub && (
              // Pushed away from the circle's centre so it never sits on the edges, which all run inward.
              <text
                x={p.x + outward(p).x * (NODE_R + 14)}
                y={p.y + outward(p).y * (NODE_R + 14)}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-ink-muted font-mono text-caption"
              >
                {node.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const TREE_X = 44;
const TREE_Y = 58;
const TREE_R = 15;

export interface LayoutNode {
  id: string;
  /** null for a root. */
  parent: string | null;
  label: string;
  state?: VizState;
  /** Double ring plus a tag above the node (union-find roots). */
  tag?: string;
}

/**
 * A general (n-ary) tree or forest: leaves are spread left to right, each parent sits centred over
 * its children. `fit` scales it to the available width; otherwise it keeps its natural size and
 * scrolls sideways, which suits trees that keep growing (a recursion tree).
 */
export function TreeLayoutDiagram({ nodes, fit = true }: { nodes: LayoutNode[]; fit?: boolean }) {
  const children = new Map<string, LayoutNode[]>();
  const roots: LayoutNode[] = [];
  for (const node of nodes) {
    if (node.parent === null) roots.push(node);
    else children.set(node.parent, [...(children.get(node.parent) ?? []), node]);
  }

  const pos = new Map<string, Point>();
  let nextX = 0;
  let maxDepth = 0;
  const place = (node: LayoutNode, depth: number): number => {
    maxDepth = Math.max(maxDepth, depth);
    const kids = children.get(node.id) ?? [];
    const x = kids.length === 0 ? nextX++ : kids.map((k) => place(k, depth + 1)).reduce((a, b) => a + b, 0) / kids.length;
    pos.set(node.id, { x, y: depth });
    return x;
  };
  for (const root of roots) {
    place(root, 0);
    nextX += 0.6; // a little air between separate trees
  }

  const px = (x: number) => 30 + x * TREE_X;
  const py = (y: number) => 40 + y * TREE_Y;
  const width = px(Math.max(nextX - 0.6, 0)) + 30;
  const height = py(maxDepth) + 30;

  const svg = (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={fit ? 'h-auto w-full' : 'max-w-none shrink-0'}
      style={fit ? { maxWidth: width * 1.3 } : { width, height }}
      role="img"
    >
      {nodes
        .filter((n) => n.parent !== null && pos.has(n.id) && pos.has(n.parent))
        .map((n) => {
          const a = pos.get(n.id)!;
          const b = pos.get(n.parent!)!;
          return <line key={n.id} x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)} strokeWidth={1.5} className="stroke-hairline-tertiary" />;
        })}
      {nodes
        .filter((n) => pos.has(n.id))
        .map((n) => {
          const p = pos.get(n.id)!;
          const look = NODE_CLASSES[n.state ?? 'plain'];
          return (
            <g key={n.id}>
              {n.tag && <circle cx={px(p.x)} cy={py(p.y)} r={TREE_R + 4} fill="none" strokeWidth={1} className="stroke-ink-subtle" />}
              <circle cx={px(p.x)} cy={py(p.y)} r={TREE_R} strokeWidth={1.5} strokeDasharray={look.dash} className={`${look.box} transition-colors duration-200`} />
              <text x={px(p.x)} y={py(p.y)} textAnchor="middle" dominantBaseline="central" className={`font-mono text-code ${look.text}`}>
                {n.label}
              </text>
              {n.tag && (
                <text x={px(p.x)} y={py(p.y) - TREE_R - 10} textAnchor="middle" className="fill-ink-subtle font-mono text-caption">
                  {n.tag}
                </text>
              )}
            </g>
          );
        })}
    </svg>
  );
  return fit ? svg : <div className="overflow-x-auto">{svg}</div>;
}

/**
 * A union-find parent array drawn as the forest it encodes: each root has a double ring and a
 * "root" tag, children hang beneath their parent. Unions and path compression are visible as
 * trees merging and flattening.
 */
export function ForestDiagram({ parent, skipZero = false, states = {} }: { parent: number[]; skipZero?: boolean; states?: Record<number, VizState> }) {
  const nodes: LayoutNode[] = parent
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => !(skipZero && i === 0))
    .map(({ p, i }) => ({
      id: String(i),
      parent: p === i ? null : String(p),
      label: String(i),
      state: states[i],
      tag: p === i ? 'root' : undefined,
    }));
  return <TreeLayoutDiagram nodes={nodes} />;
}
