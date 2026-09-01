import { useTheme, type Theme } from '../hooks/useTheme';

const ORDER: Theme[] = ['system', 'light', 'dark'];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

const ICONS: Record<Theme, () => React.JSX.Element> = {
  system: SystemIcon,
  light: SunIcon,
  dark: MoonIcon,
};

/** Cycles System → Light → Dark on click; System follows the OS setting live. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = ICONS[theme];

  function cycle() {
    setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      <Icon />
      <span className="capitalize">{theme}</span>
    </button>
  );
}
