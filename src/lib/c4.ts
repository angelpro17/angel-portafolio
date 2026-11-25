import type { C4Edge, C4Kind, C4NodeDef, C4View } from '@/data/c4';

/** Pure layout for C4 diagrams: grid positions + texts in, SVG geometry out. */
export const W = 1200;

export interface NodeText {
  n: string;
  d: string;
}
export interface PlacedNode {
  id: string;
  kind: C4Kind;
  focus: boolean;
  order: number;
  x: number;
  y: number;
  w: number;
  h: number;
  nameLines: string[];
  techLines: string[];
  descLines: string[];
}
export interface PlacedEdge {
  key: string;
  d: string;
  step: number | null;
  primaryIndex: number | null;
  both: boolean;
  label: { x: number; anchor: 'middle' | 'start'; lines: Array<{ text: string; y: number }> };
  badge: { x: number; y: number } | null;
}
export interface C4Layout {
  height: number;
  primaryCount: number;
  nodes: PlacedNode[];
  edges: PlacedEdge[];
}

/** Greedy word wrap. */
export function wrapText(text: string, max: number, maxLines = 3): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

interface Options {
  compact: boolean;
}

export function layoutC4(
  view: C4View,
  defs: Record<string, C4NodeDef>,
  texts: Record<string, NodeText>,
  { compact }: Options,
): C4Layout {
  const cellW = W / view.cols;
  const w = Math.min(compact ? 250 : 218, cellW * 0.74);
  const nameMax = compact ? 14 : 19;
  const techMax = 34;
  const descMax = 27;

  const ids = Object.keys(view.place);
  const prepared = ids.map((id, order) => {
    const def = defs[id];
    const text = texts[id] ?? { n: id, d: '' };
    return {
      id,
      order,
      def,
      nameLines: wrapText(text.n, nameMax, 2),
      techLines: compact || !def.tech ? [] : wrapText(`[${def.tech}]`, techMax, 2),
      descLines: compact ? [] : wrapText(text.d, descMax, 2),
    };
  });

  // One height for every node of the diagram, so the grid looks even.
  const h = compact
    ? 30 + 30 * Math.max(...prepared.map((p) => p.nameLines.length))
    : Math.max(
        ...prepared.map((p) => 22 + p.nameLines.length * 18 + p.techLines.length * 14 + p.descLines.length * 14.5 + 18),
      );
  const cellH = compact ? Math.max(130, h + 56) : Math.max(176, h + 76);

  const nodes: PlacedNode[] = prepared.map((p) => {
    const [c, r] = view.place[p.id];
    return {
      id: p.id,
      kind: p.def.kind,
      focus: Boolean(p.def.focus),
      order: p.order,
      x: cellW * (c + 0.5),
      y: cellH * (r + 0.5),
      w,
      h,
      nameLines: p.nameLines,
      techLines: p.techLines,
      descLines: p.descLines,
    };
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));

  let primaryIndex = 0;
  const edges: PlacedEdge[] = view.edges.map((edge: C4Edge) => {
    const a = byId.get(edge.from)!;
    const b = byId.get(edge.to)!;
    const pts = route(a, b, edge.bend ?? 0.5);
    const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    const step = edge.primary ? ++primaryIndex : null;
    return {
      key: `${edge.from}>${edge.to}`,
      d,
      step,
      primaryIndex: step ? step - 1 : null,
      both: Boolean(edge.both),
      ...annotate(pts, edge.tech ?? '', Boolean(step)),
    };
  });

  return { height: cellH * view.rows, primaryCount: primaryIndex, nodes, edges };
}

type Pt = [number, number];

function route(a: PlacedNode, b: PlacedNode, bend: number): Pt[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const sx = a.x + Math.sign(dx) * (a.w / 2);
    const tx = b.x - Math.sign(dx) * (b.w / 2);
    if (Math.abs(dy) < 1) return [[sx, a.y], [tx, b.y]];
    const mx = sx + (tx - sx) * bend;
    return [[sx, a.y], [mx, a.y], [mx, b.y], [tx, b.y]];
  }
  const sy = a.y + Math.sign(dy) * (a.h / 2);
  const ty = b.y - Math.sign(dy) * (b.h / 2);
  if (Math.abs(dx) < 1) return [[a.x, sy], [b.x, ty]];
  const my = sy + (ty - sy) * bend;
  return [[a.x, sy], [a.x, my], [b.x, my], [b.x, ty]];
}

function segments(pts: Pt[]): Array<{ a: Pt; b: Pt; len: number; horizontal: boolean }> {
  return pts.slice(1).map((b, i) => {
    const a = pts[i];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return { a, b, len, horizontal: Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]) };
  });
}

/**
 * Label and step badge sit on the longest segment.
 * Horizontal: badge above the line, text below (or split above/below when there is no badge).
 * Vertical: badge left of the line, text to its right. Long labels wrap to fit the gap between nodes.
 */
function annotate(
  pts: Pt[],
  tech: string,
  primary: boolean,
): Pick<PlacedEdge, 'label' | 'badge'> {
  const seg = segments(pts).sort((p, q) => q.len - p.len)[0];
  const mx = (seg.a[0] + seg.b[0]) / 2;
  const my = (seg.a[1] + seg.b[1]) / 2;

  if (seg.horizontal) {
    const capacity = Math.max(8, Math.floor((seg.len - 14) / 6.4));
    const lines = tech ? wrapText(tech, capacity, 2) : [];
    const ys = primary
      ? lines.map((_, i) => my + 18 + i * 13)
      : lines.length === 1
        ? [my - 8]
        : lines.map((_, i) => (i === 0 ? my - 8 : my + 17));
    return {
      label: { x: mx, anchor: 'middle', lines: lines.map((text, i) => ({ text, y: ys[i] })) },
      badge: primary ? { x: mx, y: my - 15 } : null,
    };
  }
  const lines = tech ? wrapText(tech, 22, 2) : [];
  return {
    label: { x: mx + (primary ? 12 : 10), anchor: 'start', lines: lines.map((text, i) => ({ text, y: my + 4 + i * 13 })) },
    badge: primary ? { x: mx - 14, y: my } : null,
  };
}
