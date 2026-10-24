import type { ReactNode } from 'react';
import { Empty, STATE_CLASSES } from './viz';

const FRAME = 'rounded-md border px-3 py-1.5 font-mono text-code transition-colors duration-200';

export interface StackItem {
  /** Identity across steps; the longest common prefix of ids is what survived, the rest was popped/pushed. */
  id: string | number;
  node: ReactNode;
}

/**
 * A vertical stack, top first. Diffing `items` against `prevItems` (the previous step's stack)
 * shows what just happened: frames above the common prefix of ids are new (they drop in with a
 * "pushed" tag), and previous frames above it were popped (they linger above the top, struck
 * through and tagged "popped"). A single step may do both.
 */
export function StackView({ items, prevItems, empty = 'empty' }: { items: StackItem[]; prevItems?: StackItem[]; empty?: string }) {
  const prev = prevItems ?? items;
  let common = 0;
  while (common < items.length && common < prev.length && items[common].id === prev[common].id) common++;
  const popped = prev.slice(common).reverse();

  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      {popped.map((item) => (
        <div key={`popped-${item.id}`} className={`${FRAME} flex items-center justify-between gap-3 ${STATE_CLASSES.discarded}`}>
          <span>{item.node}</span>
          <span className="text-caption no-underline">✕ popped</span>
        </div>
      ))}
      {items.length === 0 && popped.length === 0 && <Empty>{empty}</Empty>}
      {items
        .map((item, i) => ({ item, i }))
        .reverse()
        .map(({ item, i }) => {
          const isTop = i === items.length - 1;
          const isNew = i >= common;
          return (
            <div
              key={item.id}
              className={`${FRAME} flex items-center justify-between gap-3 ${isNew ? 'item-enter' : ''} ${
                isTop ? STATE_CLASSES.current : STATE_CLASSES.range
              }`}
            >
              <span>{item.node}</span>
              <span className="text-caption opacity-80">{isNew ? '↓ pushed' : isTop ? '← top' : ''}</span>
            </div>
          );
        })}
      <div aria-hidden="true" className="h-1 rounded-xs bg-hairline-strong" />
    </div>
  );
}

export interface DequeItem {
  /** Identity across steps (e.g. the array index a deque entry refers to). */
  id: string | number;
  node: ReactNode;
}

/** Builds deque items from plain values; the n-th equal value gets id `value#n` so duplicates stay distinguishable. */
export function dequeItemsOf(values: number[], render: (value: number) => ReactNode): DequeItem[] {
  const seen = new Map<number, number>();
  return values.map((value) => {
    const n = seen.get(value) ?? 0;
    seen.set(value, n + 1);
    return { id: `${value}#${n}`, node: render(value) };
  });
}

/**
 * A horizontal deque with FRONT and BACK ends. Entries that vanished since the previous step are
 * shown struck-through where they left (before the survivors = popped from the front, after =
 * popped from the back), and a newly added entry drops in at the back.
 */
export function DequeView({ items, prevItems }: { items: DequeItem[]; prevItems?: DequeItem[] }) {
  const prev = prevItems ?? items;
  const alive = new Set(items.map((item) => item.id));
  const before = new Set(prev.map((item) => item.id));
  const firstSurvivor = prev.findIndex((item) => alive.has(item.id));
  const gone = prev.map((item, i) => ({ item, i })).filter(({ item }) => !alive.has(item.id));
  const frontGone = firstSurvivor === -1 ? [] : gone.filter(({ i }) => i < firstSurvivor);
  const backGone = firstSurvivor === -1 ? gone : gone.filter(({ i }) => i > firstSurvivor);

  const ghost = (item: DequeItem, side: string) => (
    <div key={`gone-${item.id}`} className="flex flex-col items-center gap-0.5 opacity-70 line-through" title={`popped from the ${side}`}>
      {item.node}
      <span className="text-caption no-underline">✕ {side}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap items-start gap-1.5">
      <span className="self-center font-mono text-caption text-ink-subtle">FRONT ▸</span>
      {frontGone.map(({ item }) => ghost(item, 'front'))}
      {items.length === 0 && frontGone.length === 0 && backGone.length === 0 && <Empty>empty</Empty>}
      {items.map((item) => (
        <div key={item.id} className={before.has(item.id) ? '' : 'item-enter'}>
          {item.node}
        </div>
      ))}
      {backGone.map(({ item }) => ghost(item, 'back'))}
      <span className="self-center font-mono text-caption text-ink-subtle">◂ BACK</span>
    </div>
  );
}

export interface HashRow {
  key: ReactNode;
  /** What the key points at, e.g. "node v=3". */
  target: ReactNode;
  state?: 'plain' | 'current' | 'discarded';
}

/** A hash map drawn as a two-column table: key → the node it points at. */
export function HashTable({
  rows,
  empty = 'empty',
  keyHeader = 'key',
  valueHeader = '→ node',
}: {
  rows: HashRow[];
  empty?: string;
  keyHeader?: string;
  valueHeader?: string;
}) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;
  return (
    <div className="inline-grid grid-cols-[auto_auto] overflow-hidden rounded-md border border-hairline-strong font-mono text-code">
      <span className="border-b border-hairline-strong bg-surface-2 px-3 py-1 text-caption text-ink-subtle">{keyHeader}</span>
      <span className="border-b border-hairline-strong bg-surface-2 px-3 py-1 text-caption text-ink-subtle">{valueHeader}</span>
      {rows.map((row, i) => {
        const look =
          row.state === 'current'
            ? STATE_CLASSES.current
            : row.state === 'discarded'
              ? `${STATE_CLASSES.discarded} border-0`
              : 'bg-surface-1 text-ink';
        return (
          <span key={i} className="contents">
            <span className={`px-3 py-1 ${look}`}>{row.key}</span>
            <span className={`px-3 py-1 ${look}`}>{row.target}</span>
          </span>
        );
      })}
    </div>
  );
}

/** A sentinel end of a linked list (HEAD / TAIL). */
function Sentinel({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-dashed border-hairline-strong px-2 py-1 font-mono text-caption text-ink-subtle">
      {label}
    </span>
  );
}

const LINK = (
  <span aria-hidden="true" className="font-mono text-ink-subtle">
    ⇄
  </span>
);

/**
 * A doubly linked list between HEAD and TAIL sentinels. `ghost` is a node that was just removed
 * from the tail end (an eviction), shown struck-through next to TAIL.
 */
export function LinkedListRow({ items, ghost, headLabel = 'HEAD', tailLabel = 'TAIL' }: { items: ReactNode[]; ghost?: ReactNode; headLabel?: string; tailLabel?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Sentinel label={headLabel} />
      {items.map((node, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {LINK}
          {node}
        </span>
      ))}
      {ghost && (
        <span className="flex items-center gap-1.5 opacity-70" title="evicted">
          {LINK}
          <span className="flex flex-col items-center gap-0.5 line-through">{ghost}</span>
          <span className="text-caption text-ink-subtle">✕ evicted</span>
        </span>
      )}
      {LINK}
      <Sentinel label={tailLabel} />
    </div>
  );
}
