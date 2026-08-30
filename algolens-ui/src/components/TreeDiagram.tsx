const NODE_RADIUS = 18;
const X_SPACING = 56;
const Y_SPACING = 72;
const PADDING = 26;
const LABEL_SPACE = 18;

type NodeRole = 'current' | 'path' | 'muted';

interface TreeDiagramProps {
  /** LeetCode-style level-order array (trailing nulls trimmed), e.g. [3,9,20,null,null,15,7]. */
  tree: (number | null)[];
  /** Per-value visual role: 'current' (indigo), 'path' (amber), 'muted' (faded). Unlisted values render plain. */
  roles?: Record<number, NodeRole>;
  /** Optional small subtitle rendered under a node, keyed by value (e.g. an allowed-range annotation). */
  labels?: Record<number, string>;
}

interface BuiltNode {
  val: number;
  left: BuiltNode | null;
  right: BuiltNode | null;
}

interface Positioned {
  node: BuiltNode;
  x: number;
  y: number;
}

function buildTree(values: (number | null)[]): BuiltNode | null {
  if (values.length === 0 || values[0] === null) {
    return null;
  }

  const root: BuiltNode = { val: values[0], left: null, right: null };
  const queue: BuiltNode[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const current = queue.shift()!;

    if (i < values.length && values[i] !== null) {
      current.left = { val: values[i] as number, left: null, right: null };
      queue.push(current.left);
    }
    i++;

    if (i < values.length && values[i] !== null) {
      current.right = { val: values[i] as number, left: null, right: null };
      queue.push(current.right);
    }
    i++;
  }

  return root;
}

/** In-order position gives x (so a BST's left/right ordering matches left/right on screen); depth gives y. */
function layout(root: BuiltNode | null): Positioned[] {
  const positions: Positioned[] = [];
  let x = 0;

  function visit(node: BuiltNode | null, depth: number) {
    if (!node) {
      return;
    }
    visit(node.left, depth + 1);
    positions.push({ node, x: x++, y: depth });
    visit(node.right, depth + 1);
  }

  visit(root, 0);
  return positions;
}

function roleClasses(role: NodeRole | undefined) {
  switch (role) {
    case 'current':
      return {
        fill: 'fill-indigo-400 dark:fill-indigo-500',
        stroke: 'stroke-indigo-600 dark:stroke-indigo-300',
        text: 'fill-white',
      };
    case 'path':
      return {
        fill: 'fill-amber-200 dark:fill-amber-900',
        stroke: 'stroke-amber-500 dark:stroke-amber-400',
        text: 'fill-amber-900 dark:fill-amber-100',
      };
    case 'muted':
      return {
        fill: 'fill-gray-100 dark:fill-gray-800',
        stroke: 'stroke-gray-300 dark:stroke-gray-700',
        text: 'fill-gray-400 dark:fill-gray-600',
      };
    default:
      return {
        fill: 'fill-gray-50 dark:fill-gray-900',
        stroke: 'stroke-gray-300 dark:stroke-gray-600',
        text: 'fill-gray-700 dark:fill-gray-200',
      };
  }
}

/** Renders a binary tree as an actual node-and-edge diagram (not a flat list) via inline SVG. */
export function TreeDiagram({ tree, roles = {}, labels = {} }: TreeDiagramProps) {
  const root = buildTree(tree);
  const positions = layout(root);

  if (positions.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-500">empty tree</p>;
  }

  const positionByNode = new Map(positions.map((p) => [p.node, p]));
  const maxX = Math.max(...positions.map((p) => p.x));
  const maxY = Math.max(...positions.map((p) => p.y));
  const hasLabels = Object.keys(labels).length > 0;

  const px = (x: number) => PADDING + x * X_SPACING + X_SPACING / 2;
  const py = (y: number) => PADDING + y * Y_SPACING + Y_SPACING / 2;

  const width = (maxX + 1) * X_SPACING + PADDING * 2;
  const height = (maxY + 1) * Y_SPACING + PADDING * 2 + (hasLabels ? LABEL_SPACE : 0);

  const edges: { key: string; x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const { node, x, y } of positions) {
    if (node.left) {
      const c = positionByNode.get(node.left)!;
      edges.push({ key: `${node.val}-${node.left.val}`, x1: px(x), y1: py(y), x2: px(c.x), y2: py(c.y) });
    }
    if (node.right) {
      const c = positionByNode.get(node.right)!;
      edges.push({ key: `${node.val}-${node.right.val}`, x1: px(x), y1: py(y), x2: px(c.x), y2: py(c.y) });
    }
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {edges.map((e) => (
        <line
          key={e.key}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          className="stroke-gray-300 dark:stroke-gray-600"
          strokeWidth={1.5}
        />
      ))}
      {positions.map(({ node, x, y }) => {
        const colors = roleClasses(roles[node.val]);
        const label = labels[node.val];
        return (
          <g key={node.val} className="transition-colors duration-200">
            <circle
              cx={px(x)}
              cy={py(y)}
              r={NODE_RADIUS}
              className={`${colors.fill} ${colors.stroke} transition-colors duration-200`}
              strokeWidth={1.5}
            />
            <text
              x={px(x)}
              y={py(y)}
              textAnchor="middle"
              dominantBaseline="central"
              className={`font-mono text-xs font-medium ${colors.text}`}
            >
              {node.val}
            </text>
            {label && (
              <text
                x={px(x)}
                y={py(y) + NODE_RADIUS + 12}
                textAnchor="middle"
                className="fill-gray-500 dark:fill-gray-400"
                style={{ fontSize: '10px' }}
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
