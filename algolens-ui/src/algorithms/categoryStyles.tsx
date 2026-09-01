import type { ReactNode } from 'react';

interface CategoryStyle {
  icon: ReactNode;
  /** Icon/accent text color. */
  text: string;
  /** Light background tint, for badges and section washes. */
  bg: string;
  /** Border/left-accent color. */
  border: string;
  /** Top-border-only accent color (pairs with a plain gray `border` on the other sides). */
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

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Trees & Graphs': {
    icon: <TreeIcon />,
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-500 dark:border-indigo-400',
    borderTop: 'border-t-indigo-500 dark:border-t-indigo-400',
  },
  'Arrays & Stacks': {
    icon: <StackIcon />,
    text: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-500 dark:border-sky-400',
    borderTop: 'border-t-sky-500 dark:border-t-sky-400',
  },
  Backtracking: {
    icon: <BacktrackIcon />,
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-500 dark:border-violet-400',
    borderTop: 'border-t-violet-500 dark:border-t-violet-400',
  },
  'Heaps & Greedy': {
    icon: <GreedyIcon />,
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-500 dark:border-amber-400',
    borderTop: 'border-t-amber-500 dark:border-t-amber-400',
  },
  'Dynamic Programming': {
    icon: <DpIcon />,
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-500 dark:border-emerald-400',
    borderTop: 'border-t-emerald-500 dark:border-t-emerald-400',
  },
};

const DEFAULT_STYLE: CategoryStyle = {
  icon: null,
  text: 'text-gray-600 dark:text-gray-400',
  bg: 'bg-gray-50 dark:bg-gray-800/40',
  border: 'border-gray-400 dark:border-gray-600',
  borderTop: 'border-t-gray-400 dark:border-t-gray-600',
};

/** Per-category accent color + icon, used on the home page and each algorithm's own header badge. */
export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}
