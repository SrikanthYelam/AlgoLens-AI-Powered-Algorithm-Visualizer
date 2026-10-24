import type { Step } from '../types/algorithm';
import { TreeLayoutDiagram, type LayoutNode } from './graphs';
import type { VizState } from './viz';

const SEP = '\u0001';

const asPath = (value: number[] | string): string[] => Array.from(value, String);

/**
 * The recursion tree of a backtracking run, grown from every path seen up to the current step:
 * one node per choice. The node being worked on is solid, the choices leading to it are tinted,
 * completed solutions are green and branches already backtracked out of are dimmed.
 */
export function RecursionTree({ history }: { history: Step[] }) {
  const states = history.map((h) => h.state as { path: number[] | string; solutions: (number[] | string)[] });
  const latest = states[states.length - 1];
  const current = asPath(latest.path);
  const solutions = new Set(latest.solutions.map((s) => asPath(s).join(SEP)));
  const onPath = new Set(current.map((_, i) => current.slice(0, i + 1).join(SEP)).concat(['']));
  const currentKey = current.join(SEP);

  const nodes = new Map<string, LayoutNode>();
  nodes.set('', { id: '', parent: null, label: '∅' });
  for (const { path } of states) {
    const elements = asPath(path);
    elements.forEach((element, i) => {
      const key = elements.slice(0, i + 1).join(SEP);
      if (!nodes.has(key)) {
        nodes.set(key, { id: key, parent: elements.slice(0, i).join(SEP), label: element.toUpperCase() });
      }
    });
  }

  const stateOf = (key: string): VizState =>
    key === currentKey ? 'current' : onPath.has(key) ? 'range' : solutions.has(key) ? 'found' : 'visited';

  return <TreeLayoutDiagram fit={false} nodes={[...nodes.values()].map((node) => ({ ...node, state: stateOf(node.id) }))} />;
}
