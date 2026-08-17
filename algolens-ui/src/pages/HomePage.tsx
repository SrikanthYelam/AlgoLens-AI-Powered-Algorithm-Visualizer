import { Link } from 'react-router-dom';
import { algorithms } from '../algorithms/registry';

export function HomePage() {
  const categories = Array.from(new Set(algorithms.map((algorithm) => algorithm.category)));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          AlgoLens
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Step-by-step algorithm visualizations, explained by AI.
        </p>
      </div>

      {categories.map((category) => (
        <section key={category} className="flex flex-col gap-3">
          <h2 className="border-l-4 border-indigo-500 pl-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-indigo-400 dark:text-gray-400">
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
                  <h3 className="font-medium text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
                    {algorithm.name}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                    {algorithm.description}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
