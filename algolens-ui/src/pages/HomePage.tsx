import { Link } from 'react-router-dom';
import { algorithms } from '../algorithms/registry';
import { getCategoryStyle } from '../algorithms/categoryStyles';

export function HomePage() {
  const categories = Array.from(new Set(algorithms.map((algorithm) => algorithm.category)));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:px-8">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          Learn algorithms, one step at a time
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {algorithms.length} step-by-step visualizations across {categories.length} patterns, each explained by AI.
        </p>
      </div>

      {categories.map((category) => {
        const style = getCategoryStyle(category);

        return (
          <section key={category} className="flex flex-col gap-3">
            <h2
              className={`flex items-center gap-2 border-l-4 pl-3 text-xs font-semibold uppercase tracking-wide ${style.border} ${style.text}`}
            >
              {style.icon}
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {algorithms
                .filter((algorithm) => algorithm.category === category)
                .map((algorithm) => (
                  <Link
                    key={algorithm.id}
                    to={`/algorithms/${algorithm.id}`}
                    className="group flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <h3 className="font-heading font-semibold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                      {algorithm.name}
                    </h3>
                    <p className="mt-1 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                      {algorithm.description}
                    </p>
                    <span
                      className={`mt-3 w-fit rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ${style.bg} ${style.text}`}
                    >
                      {algorithm.pattern}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
