import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function AppHeader() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link
          to="/"
          className="font-heading text-lg font-bold tracking-tight text-gray-900 transition-colors hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400"
        >
          AlgoLens
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
