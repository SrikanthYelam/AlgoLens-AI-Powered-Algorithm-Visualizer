import { Link } from 'react-router-dom';
import { algorithms } from '../algorithms/registry';

export function HomePage() {
  const categories = Array.from(new Set(algorithms.map((algorithm) => algorithm.category)));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">AlgoLens</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Step-by-step algorithm visualizations, explained by AI.
        </p>
      </div>

      {categories.map((category) => (
        <section key={category} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{category}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {algorithms
              .filter((algorithm) => algorithm.category === category)
              .map((algorithm) => (
                <Link
                  key={algorithm.id}
                  to={`/algorithms/${algorithm.id}`}
                  className="flex flex-col rounded-lg border border-gray-200 p-4 transition hover:border-indigo-400 hover:shadow-sm dark:border-gray-700"
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{algorithm.name}</h3>
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
