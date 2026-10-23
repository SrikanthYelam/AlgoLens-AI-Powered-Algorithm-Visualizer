import { Link } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="h-nav border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-full max-w-content items-center px-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-card-title font-semibold tracking-tight text-ink transition-colors hover:text-accent-hover"
        >
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-xs bg-accent" />
          AlgoLens
        </Link>
      </div>
    </header>
  );
}
