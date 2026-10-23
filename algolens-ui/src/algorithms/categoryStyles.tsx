import type { ReactNode } from 'react';

interface CategoryStyle {
  icon: ReactNode;
  /** Icon/label text color. */
  text: string;
  /** Badge background. */
  bg: string;
  /** Border color. */
  border: string;
  /** Top-border-only color (pairs with a plain `border` on the other sides). */
  borderTop: string;
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-4 w-4',
};

function TreeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M12 7.5v4M12 11.5L5 16.5M12 11.5l7 5" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="4" rx="1" />
      <rect x="4" y="10" width="16" height="4" rx="1" />
      <rect x="4" y="16" width="10" height="4" rx="1" />
    </svg>
  );
}

function BacktrackIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M8.2 7.2L15.8 10.8M8.2 16.8L15.8 13.2" />
    </svg>
  );
}

function GreedyIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 20V14M10 20V9M16 20V4M4 20h16" />
    </svg>
  );
}

function DpIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}

function UnionFindIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </svg>
  );
}

function TwoPointersIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 18h18" />
      <path d="M7 4v8M4.5 9.5L7 12l2.5-2.5" />
      <path d="M17 4v8M14.5 9.5L17 12l2.5-2.5" />
    </svg>
  );
}

function CacheIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="7" width="13" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M7.2 6h9.6M5 8.5v7M19 8.5v7M7.2 18h9.6M7 7.8l10 8.4M17 7.8L7 16.2" />
    </svg>
  );
}

/** DESIGN.md allows a single chromatic accent, so categories are told apart by icon and name, not color. */
const NEUTRAL_STYLE = {
  text: 'text-ink-subtle',
  bg: 'bg-surface-2',
  border: 'border-hairline-strong',
  borderTop: 'border-t-hairline-strong',
};

const CATEGORY_ICONS: Record<string, ReactNode> = {
  Trees: <TreeIcon />,
  Graphs: <GraphIcon />,
  'Arrays & Stacks': <StackIcon />,
  Backtracking: <BacktrackIcon />,
  'Heaps & Greedy': <GreedyIcon />,
  'Dynamic Programming': <DpIcon />,
  'Union-Find': <UnionFindIcon />,
  'Two Pointers': <TwoPointersIcon />,
  Design: <CacheIcon />,
};

/** Per-category icon + neutral token classes, used on the home page and each algorithm's own header badge. */
export function getCategoryStyle(category: string): CategoryStyle {
  return { icon: CATEGORY_ICONS[category] ?? null, ...NEUTRAL_STYLE };
}
