/** Deep structural equality (order-sensitive) between two JSON-serializable values. */
export function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Deep structural equality, but arrays are compared as sets: each array (at every nesting
 * level) is sorted by its own canonical JSON string before comparing. Objects and primitives
 * are left as-is. This is what lets e.g. Permutations' `solutions` compare equal when the
 * user's search visits the same permutations in a different order.
 */
export function deepEqualIgnoringOrder(a: unknown, b: unknown): boolean {
  return JSON.stringify(canonicalize(a)) === JSON.stringify(canonicalize(b));
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map(canonicalize)
      .sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
  }
  return value;
}
