import { Link } from 'react-router-dom';
import { algorithms } from '../algorithms/registry';
import { getCategoryStyle } from '../algorithms/categoryStyles';

export function HomePage() {
  const categories = Array.from(new Set(algorithms.map((algorithm) => algorithm.category)));

  return (
    <div className="mx-auto flex max-w-content flex-col gap-12 px-4 py-12 sm:px-8">
      <div>
        <h1 className="text-headline font-semibold text-ink sm:text-display-md">
          Learn algorithms, one step at a time
        </h1>
        <p className="mt-3 text-body-lg text-ink-muted">
          {algorithms.length} step-by-step visualizations across {categories.length} patterns, each explained by AI.
        </p>
      </div>

      {categories.map((category) => {
        const style = getCategoryStyle(category);

        return (
          <section key={category} className="flex flex-col gap-4">
            <h2 className={`eyebrow flex items-center gap-2 border-b border-hairline pb-3 ${style.text}`}>
              {style.icon}
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {algorithms
                .filter((algorithm) => algorithm.category === category)
                .map((algorithm) => (
                  <Link
                    key={algorithm.id}
                    to={`/algorithms/${algorithm.id}`}
                    className="panel group flex flex-col p-6 transition-colors duration-150 hover:border-hairline-strong hover:bg-surface-2"
                  >
                    <h3 className="text-body-lg font-medium text-ink">{algorithm.name}</h3>
                    <p className="mt-1 line-clamp-3 text-body-sm text-ink-subtle">{algorithm.description}</p>
                    <span className="badge mt-4 w-fit font-mono">{algorithm.pattern}</span>
                  </Link>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
