export interface AlgorithmExample {
  /** Short chip label — say what makes the example interesting, not just its values. */
  label: string;
  /** The exact request body the algorithm's `InputForm` would submit. */
  input: unknown;
}

/**
 * One-click example inputs per algorithm, keyed by registry `id`. Each entry is a typical case
 * plus at least one that exercises something different (an edge case, a failure path, a worst
 * case). Bodies must match the request shape each algorithm's `InputForm` submits;
 * `examples.test.ts` fails if a registry entry has no examples here.
 */
export const examples: Record<string, AlgorithmExample[]> = {
  'binary-tree-level-order-traversal': [
    { label: 'Balanced tree', input: { values: [3, 9, 20, null, null, 15, 7] } },
    { label: 'Right-skewed chain', input: { values: [1, null, 2, null, 3] } },
  ],
  'sliding-window-maximum': [
    { label: 'Classic (k = 3)', input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], windowSize: 3 } },
    { label: 'Decreasing — nothing evicted', input: { nums: [9, 8, 7, 6, 5], windowSize: 2 } },
    { label: 'Window of 1', input: { nums: [4, 2, 7], windowSize: 1 } },
  ],
  'longest-continuous-subarray-abs-diff-limit': [
    { label: 'Classic (limit 5)', input: { nums: [10, 1, 2, 4, 7, 2], limit: 5 } },
    { label: 'Limit 0 — equal runs only', input: { nums: [4, 2, 2, 2, 4, 4, 2, 2], limit: 0 } },
  ],
  'largest-rectangle-in-histogram': [
    { label: 'Classic', input: { heights: [2, 1, 5, 6, 2, 3] } },
    { label: 'Ascending staircase', input: { heights: [1, 2, 3, 4, 5] } },
  ],
  'string-compression': [
    { label: '"aabbccc"', input: { chars: 'aabbccc' } },
    { label: 'Run of 12 — multi-digit count', input: { chars: 'abbbbbbbbbbbb' } },
    { label: 'No repeats — nothing shrinks', input: { chars: 'abc' } },
    { label: 'Single character', input: { chars: 'a' } },
  ],
  'number-of-islands': [
    {
      label: 'Three islands',
      input: {
        grid: [
          [1, 1, 0, 0, 0],
          [1, 1, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 1, 1],
        ],
      },
    },
    {
      label: 'All water',
      input: {
        grid: [
          [0, 0],
          [0, 0],
        ],
      },
    },
  ],
  'course-schedule-kahn': [
    { label: 'Linear chain', input: { numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2]] } },
    { label: 'Diamond', input: { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] } },
    { label: 'Cycle — impossible', input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] } },
  ],
  'course-schedule-dfs': [
    { label: 'Linear chain', input: { numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2]] } },
    { label: 'Diamond', input: { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] } },
    { label: 'Cycle — impossible', input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] } },
  ],
  permutations: [
    { label: '[1, 2, 3]', input: { nums: [1, 2, 3] } },
    { label: 'Single element', input: { nums: [1] } },
  ],
  combinations: [
    { label: 'n = 4, k = 2', input: { n: 4, k: 2 } },
    { label: 'k = n — one combination', input: { n: 3, k: 3 } },
  ],
  subsets: [
    { label: '[1, 2, 3]', input: { nums: [1, 2, 3] } },
    { label: 'Two elements', input: { nums: [1, 2] } },
  ],
  'n-queens': [
    { label: '4×4 — two solutions', input: { boardSize: 4 } },
    { label: '3×3 — no solution', input: { boardSize: 3 } },
  ],
  'letter-combinations-of-a-phone-number': [
    { label: '"23"', input: { digits: '23' } },
    { label: 'Single digit "7" (four letters)', input: { digits: '7' } },
  ],
  'task-scheduler': [
    { label: 'AAABBB, cooldown 2', input: { tasks: 'AAABBB', n: 2 } },
    { label: 'Lots of idling', input: { tasks: 'AAAAAABCDEFG', n: 2 } },
    { label: 'No cooldown', input: { tasks: 'AABBCC', n: 0 } },
  ],
  'generate-parentheses': [
    { label: 'n = 3', input: { n: 3 } },
    { label: 'n = 1', input: { n: 1 } },
  ],
  'remove-invalid-parentheses-bfs': [
    { label: '"()())()"', input: { s: '()())()' } },
    { label: '")(" — remove everything', input: { s: ')(' } },
    { label: 'Already valid', input: { s: '(a)b' } },
  ],
  'remove-invalid-parentheses-dfs': [
    { label: '"()())()"', input: { s: '()())()' } },
    { label: '")(" — remove everything', input: { s: ')(' } },
    { label: 'Already valid', input: { s: '(a)b' } },
  ],
  'longest-common-subsequence': [
    { label: '"abcde" vs "ace"', input: { text1: 'abcde', text2: 'ace' } },
    { label: 'Nothing in common', input: { text1: 'abc', text2: 'def' } },
  ],
  'longest-palindromic-subsequence': [
    { label: '"bbbab"', input: { s: 'bbbab' } },
    { label: '"cbbd"', input: { s: 'cbbd' } },
  ],
  'longest-increasing-subsequence': [
    { label: 'Classic', input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] } },
    { label: 'All equal — length 1', input: { nums: [7, 7, 7, 7] } },
  ],
  'edit-distance': [
    { label: '"horse" → "ros"', input: { word1: 'horse', word2: 'ros' } },
    { label: '"kitten" → "sitting"', input: { word1: 'kitten', word2: 'sitting' } },
    { label: 'Empty source — all inserts', input: { word1: '', word2: 'abc' } },
  ],
  'longest-palindromic-substring': [
    { label: '"babad"', input: { s: 'babad' } },
    { label: '"cbbd" — even length', input: { s: 'cbbd' } },
  ],
  'unique-binary-search-trees': [
    { label: 'n = 3', input: { n: 3 } },
    { label: 'n = 5', input: { n: 5 } },
  ],
  'meeting-rooms-ii': [
    { label: 'Overlaps — 2 rooms', input: { intervals: [[0, 30], [5, 10], [15, 20]] } },
    { label: 'No overlap — 1 room', input: { intervals: [[7, 10], [2, 4]] } },
  ],
  'validate-binary-search-tree': [
    { label: 'Valid BST', input: { values: [2, 1, 3] } },
    { label: 'Invalid — deep violation', input: { values: [5, 1, 4, null, null, 3, 6] } },
  ],
  'kth-smallest-in-bst': [
    { label: 'k = 1', input: { values: [3, 1, 4, null, 2], k: 1 } },
    { label: 'k = 3', input: { values: [5, 3, 6, 2, 4, null, null, 1], k: 3 } },
  ],
  'lowest-common-ancestor': [
    { label: 'Split at the root (5 & 1)', input: { values: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 } },
    { label: 'One is the ancestor (5 & 4)', input: { values: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 4 } },
  ],
  'construct-binary-tree': [
    { label: 'Classic', input: { preorder: [3, 9, 20, 15, 7], inorder: [9, 3, 15, 20, 7] } },
    { label: 'Left-skewed', input: { preorder: [1, 2, 3], inorder: [3, 2, 1] } },
  ],
  'recover-binary-search-tree': [
    { label: 'Adjacent swap (1 ↔ 3)', input: { values: [1, 3, null, null, 2] } },
    { label: 'Non-adjacent swap (3 ↔ 2)', input: { values: [3, 1, 4, null, null, 2] } },
  ],
  'find-duplicate-subtrees': [
    { label: 'Two duplicate shapes', input: { values: [1, 2, 3, 4, null, 2, 4, null, null, 4] } },
    { label: 'Single leaf duplicate', input: { values: [2, 1, 1] } },
  ],
  'delete-node-in-a-bst': [
    { label: 'Delete a two-child node (3)', input: { values: [5, 3, 6, 2, 4, null, 7], key: 3 } },
    { label: 'Key not in tree — no-op', input: { values: [5, 3, 6, 2, 4, null, 7], key: 0 } },
  ],
  'flatten-binary-tree-recursive': [
    { label: 'Classic', input: { values: [1, 2, 5, 3, 4, null, 6] } },
    { label: 'Left-only chain', input: { values: [1, 2, null, 3] } },
  ],
  'flatten-binary-tree-iterative': [
    { label: 'Classic', input: { values: [1, 2, 5, 3, 4, null, 6] } },
    { label: 'Left-only chain', input: { values: [1, 2, null, 3] } },
  ],
  'sorted-list-to-bst': [
    { label: 'Five nodes', input: { values: [-10, -3, 0, 5, 9] } },
    { label: 'Two nodes', input: { values: [1, 3] } },
  ],
  'number-of-provinces': [
    { label: 'Two provinces', input: { isConnected: [[1, 1, 0], [1, 1, 0], [0, 0, 1]] } },
    { label: 'Everyone isolated', input: { isConnected: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] } },
  ],
  'redundant-connection': [
    { label: 'Triangle', input: { edges: [[1, 2], [1, 3], [2, 3]] } },
    { label: 'Cycle found late', input: { edges: [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]] } },
  ],
  'accounts-merge': [
    {
      label: 'Shared email merges accounts',
      input: {
        accounts: [
          ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
          ['John', 'johnsmith@mail.com', 'john00@mail.com'],
          ['Mary', 'mary@mail.com'],
          ['John', 'johnnybravo@mail.com'],
        ],
      },
    },
    {
      label: 'Same name, no shared email',
      input: {
        accounts: [
          ['Alex', 'alex1@mail.com'],
          ['Alex', 'alex2@mail.com'],
        ],
      },
    },
  ],
  'number-of-islands-ii': [
    { label: 'Islands appear', input: { rows: 3, cols: 3, positions: [[0, 0], [0, 1], [1, 2], [2, 1]] } },
    { label: 'Bridge merges two islands', input: { rows: 3, cols: 3, positions: [[0, 0], [0, 1], [1, 2], [1, 1]] } },
    { label: 'Repeated position', input: { rows: 1, cols: 2, positions: [[0, 0], [0, 0], [0, 1]] } },
  ],
};

export function getExamples(id: string): AlgorithmExample[] {
  return examples[id] ?? [];
}
