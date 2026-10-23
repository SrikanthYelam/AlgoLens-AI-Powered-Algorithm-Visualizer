import type { ReactNode } from 'react';

/**
 * Shared visual primitives for the StateViews. Every state is a bg/border/ink triple from the
 * `state-*` tokens in index.css and carries a non-color cue as well, so no state depends on
 * color alone:
 *   current    solid lavender fill + bold
 *   comparing  dashed lavender border
 *   range      faint tint (inside a window / range)
 *   visited    dimmed surface, already processed
 *   found      green border + ✓ badge (part of the result)
 *   discarded  dashed border + strike-through (ruled out)
 */
export type VizState = 'plain' | 'current' | 'comparing' | 'range' | 'visited' | 'found' | 'discarded';

const STATE_CLASSES: Record<VizState, string> = {
  plain: 'border-hairline-strong bg-surface-2 text-ink',
  current: 'border-state-current-border bg-state-current-bg text-state-current-ink font-semibold',
  comparing: 'border-dashed border-state-comparing-border bg-state-comparing-bg text-state-comparing-ink',
  range: 'border-state-range-border bg-state-range-bg text-state-range-ink',
  visited: 'border-state-visited-border bg-state-visited-bg text-state-visited-ink',
  found: 'border-state-found-border bg-state-found-bg text-state-found-ink',
  discarded: 'border-dashed border-state-discarded-border bg-state-discarded-bg text-state-discarded-ink line-through',
};

export const STATE_LABELS: Record<Exclude<VizState, 'plain'>, string> = {
  current: 'current',
  comparing: 'comparing',
  range: 'in range',
  visited: 'visited',
  found: 'result',
  discarded: 'discarded',
};

interface CellProps {
  value: ReactNode;
  state?: VizState;
  /** md = 36px (default), sm = 32px (dense tables and grids). */
  size?: 'md' | 'sm';
  /** Small index label under the cell (array index, dp[k] ...). */
  index?: ReactNode;
  /** Pointer name(s) shown under the index, e.g. "read/write". */
  pointer?: string | null;
  /** Extra emphasis ring, used for a second role on top of `state` (e.g. "the run just read"). */
  ring?: boolean;
  /** Wider minimum width (64px) for labels like "3:$120". */
  wide?: boolean;
  /** Header cell of a table: no box, muted text. */
  header?: boolean;
  /** Cell outside the region an algorithm ever computes: faded out. */
  unused?: boolean;
  title?: string;
}

/** One boxed value. The only place a cell's box, radius, mono type and state styling are defined. */
export function Cell({ value, state = 'plain', size = 'md', index, pointer, ring, wide, header, unused, title }: CellProps) {
  const dims = size === 'sm' ? 'h-8 min-w-8 text-caption' : wide ? 'h-9 min-w-16 text-code' : 'h-9 min-w-9 text-code';
  const look = header
    ? 'border-transparent bg-transparent text-ink-subtle'
    : unused
      ? 'border-hairline bg-transparent text-ink-tertiary'
      : STATE_CLASSES[state];

  const box = (
    <span
      title={title}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-md border px-2 font-mono transition-colors duration-200 ${dims} ${look} ${
        ring ? 'ring-2 ring-accent-hover ring-offset-1 ring-offset-canvas' : ''
      }`}
    >
      {value}
      {state === 'found' && !header && !unused && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-pill bg-success text-micro font-semibold text-on-accent"
        >
          ✓
        </span>
      )}
    </span>
  );

  if (index === undefined && pointer === undefined) {
    return box;
  }
  return (
    <div className="flex flex-col items-center gap-0.5">
      {box}
      {index !== undefined && <span className="font-mono text-caption text-ink-subtle">{index}</span>}
      {pointer !== undefined && (
        <span className="h-4 font-mono text-caption font-medium text-accent-hover">{pointer ?? ''}</span>
      )}
    </div>
  );
}

/** A titled block of a StateView: small heading, then its content. */
export function VizSection({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-body-sm font-medium text-ink-muted">{title}</h3>
      {children}
    </div>
  );
}

/** Wrapping row of cells. */
export function CellRow({ children, gap = 'md' }: { children: ReactNode; gap?: 'sm' | 'md' }) {
  return <div className={`flex flex-wrap ${gap === 'sm' ? 'gap-1' : 'gap-1.5'}`}>{children}</div>;
}

/** Placeholder for an empty collection ("empty", "none yet"). */
export function Empty({ children }: { children: ReactNode }) {
  return <span className="text-body-sm text-ink-subtle">{children}</span>;
}

/** Outer wrapper every StateView returns. */
export function VizStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 text-body-sm text-ink">{children}</div>;
}

/** Inline legend chip: a state's own styling plus its name, so a legend never relies on color. */
export function Legend({ state, children }: { state: Exclude<VizState, 'plain'>; children?: ReactNode }) {
  return (
    <span className={`inline-block rounded-xs border px-1.5 text-caption ${STATE_CLASSES[state]}`}>
      {children ?? STATE_LABELS[state]}
    </span>
  );
}

export interface DpTableCell {
  value: string;
  state?: VizState;
  /** Outside the region the algorithm ever computes (e.g. the lower triangle). */
  unused?: boolean;
}

/** A 2D DP table: column headers across the top, row headers down the side, one Cell per entry. */
export function DpTable({
  colHeaders,
  rowHeaders,
  rows,
}: {
  colHeaders: string[];
  rowHeaders: string[];
  rows: DpTableCell[][];
}) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-1">
          <Cell value="" size="sm" header />
          {colHeaders.map((header, c) => (
            <Cell key={c} value={header} size="sm" header />
          ))}
        </div>
        {rows.map((row, r) => (
          <div key={r} className="flex gap-1">
            <Cell value={rowHeaders[r]} size="sm" header />
            {row.map((cell, c) => (
              <Cell key={c} value={cell.value} state={cell.state} unused={cell.unused} size="sm" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Cells joined by arrows (a path, a stack, an itinerary). */
export function Chain({ children }: { children: ReactNode[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {children.map((child, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-ink-subtle">
              →
            </span>
          )}
          {child}
        </span>
      ))}
    </div>
  );
}

/** One-line outcome: ✓ (success) or ✕ (failure) plus the message, so the verdict never rests on color. */
export function Verdict({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <p className="font-medium text-ink">
      <span aria-hidden="true" className={ok ? 'text-success' : undefined}>
        {ok ? '✓' : '✕'}{' '}
      </span>
      {children}
    </p>
  );
}

/** A cache entry: key on top, value underneath. Shared by the LRU and LFU cache views. */
export function EntryCell({ entryKey, value, state = 'plain' }: { entryKey: ReactNode; value: ReactNode; state?: VizState }) {
  return (
    <div
      className={`flex h-12 min-w-14 flex-col items-center justify-center rounded-md border px-2 font-mono text-code transition-colors duration-200 ${STATE_CLASSES[state]}`}
    >
      <span>{entryKey}</span>
      <span className="text-caption opacity-80">v={value}</span>
    </div>
  );
}
