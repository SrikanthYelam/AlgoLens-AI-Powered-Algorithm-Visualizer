import type { ComponentType } from 'react';
import type { AlgorithmInputFormProps, AlgorithmStateViewProps } from '../types/algorithm';
import { BacktrackingStateView } from '../components/BacktrackingStateView';
import { StringBacktrackingStateView } from '../components/StringBacktrackingStateView';
import { TreeInputForm } from './binaryTreeLevelOrder/TreeInputForm';
import { TreeStateView } from './binaryTreeLevelOrder/TreeStateView';
import { SlidingWindowInputForm } from './slidingWindowMaximum/SlidingWindowInputForm';
import { SlidingWindowStateView } from './slidingWindowMaximum/SlidingWindowStateView';
import { HistogramInputForm } from './largestRectangleInHistogram/HistogramInputForm';
import { HistogramStateView } from './largestRectangleInHistogram/HistogramStateView';
import { IslandsInputForm } from './numberOfIslands/IslandsInputForm';
import { IslandsStateView } from './numberOfIslands/IslandsStateView';
import { PermutationsInputForm } from './permutations/PermutationsInputForm';
import { CombinationsInputForm } from './combinations/CombinationsInputForm';
import { SubsetsInputForm } from './subsets/SubsetsInputForm';
import { NQueensInputForm } from './nQueens/NQueensInputForm';
import { NQueensStateView } from './nQueens/NQueensStateView';
import { LetterCombinationsInputForm } from './letterCombinations/LetterCombinationsInputForm';
import { TaskSchedulerInputForm } from './taskScheduler/TaskSchedulerInputForm';
import { TaskSchedulerStateView } from './taskScheduler/TaskSchedulerStateView';
import { GenerateParenthesesInputForm } from './generateParentheses/GenerateParenthesesInputForm';

export interface RelatedProblem {
  name: string;
  note: string;
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  /** The named technique this problem is an instance of, e.g. "Monotonic Stack". */
  pattern: string;
  /** Progressive hints, from vaguest to most specific. */
  hints: string[];
  relatedProblems: RelatedProblem[];
  InputForm: ComponentType<AlgorithmInputFormProps>;
  StateView: ComponentType<AlgorithmStateViewProps>;
}

/**
 * Every algorithm the frontend knows how to run. Adding another algorithm
 * means adding one entry here plus its InputForm/StateView pair — nothing
 * else in the app needs to change. Permutations, Combinations, and Subsets
 * all share `BacktrackingStateView` since their backend state shape
 * (`path` + `solutions`) is identical.
 */
export const algorithms: AlgorithmDefinition[] = [
  {
    id: 'binary-tree-level-order-traversal',
    name: 'Binary Tree Level Order Traversal',
    description: 'Breadth-first traversal of a binary tree, visiting nodes level by level.',
    category: 'Trees & Graphs',
    pattern: 'Breadth-First Search (BFS) with a Queue',
    hints: [
      'Process the tree level by level, not depth by depth — a queue naturally gives you that order.',
      "Capture the queue's size at the start of each level before dequeuing anything; that's how many nodes belong to the current level.",
      "Enqueue each node's non-null children as you dequeue it, and they'll automatically form next level's batch.",
    ],
    relatedProblems: [
      { name: 'Binary Tree Zigzag Level Order Traversal', note: 'Same level-by-level BFS, alternating direction each row.' },
      { name: 'Binary Tree Right Side View', note: 'Same traversal, but only keep the last node seen at each level.' },
      { name: 'Average of Levels in Binary Tree', note: 'Same level batching, aggregate instead of collect.' },
      { name: 'Minimum Depth of Binary Tree', note: 'BFS terminates early at the first leaf — same queue mechanics.' },
    ],
    InputForm: TreeInputForm,
    StateView: TreeStateView,
  },
  {
    id: 'sliding-window-maximum',
    name: 'Sliding Window Maximum',
    description: 'Find the maximum value in every fixed-size window of an array using a monotonic deque.',
    category: 'Arrays & Stacks',
    pattern: 'Sliding Window + Monotonic Deque',
    hints: [
      'A brute-force scan of every window is O(n·k) — think about what information from the previous window you can reuse.',
      'Keep a deque of indices whose values are in decreasing order; the max is always at the front.',
      'Before pushing index i, pop from the back any indices whose values are ≤ nums[i] — they can never be the max again.',
      "Pop from the front any index that's fallen outside the window (index ≤ i − windowSize).",
    ],
    relatedProblems: [
      { name: 'Sliding Window Median', note: 'Same fixed-window mechanics with a different aggregate structure (two heaps).' },
      { name: 'Shortest Subarray with Sum at Least K', note: 'Also uses a monotonic deque, but over prefix sums.' },
      { name: 'Daily Temperatures', note: 'Sibling monotonic-structure problem — a stack instead of a deque.' },
      { name: 'Min Stack', note: 'Same idea of maintaining running extremes in O(1) amortized.' },
    ],
    InputForm: SlidingWindowInputForm,
    StateView: SlidingWindowStateView,
  },
  {
    id: 'largest-rectangle-in-histogram',
    name: 'Largest Rectangle in Histogram',
    description: 'Find the largest rectangular area in a histogram using a monotonic stack.',
    category: 'Arrays & Stacks',
    pattern: 'Monotonic Stack',
    hints: [
      'For each bar, you want to know how far it can extend left and right before hitting a shorter bar.',
      'Keep a stack of bar indices with increasing height; when the next bar is shorter, that\'s your signal to start popping.',
      "When you pop a bar, the current index is its right boundary and the new stack top is its left boundary.",
      'Append a sentinel bar of height 0 at the end so every remaining bar in the stack gets popped and resolved.',
    ],
    relatedProblems: [
      { name: 'Maximal Rectangle', note: 'Runs this exact algorithm once per row of a binary matrix.' },
      { name: 'Trapping Rain Water', note: "Same 'what's around me' stack reasoning, different quantity to compute." },
      { name: 'Next Greater Element I', note: 'The monotonic stack pattern in its simplest form.' },
      { name: 'Daily Temperatures', note: 'Another direct application of a monotonic stack.' },
    ],
    InputForm: HistogramInputForm,
    StateView: HistogramStateView,
  },
  {
    id: 'number-of-islands',
    name: 'Number of Islands',
    description: 'Count connected land regions in a grid using BFS flood fill.',
    category: 'Trees & Graphs',
    pattern: 'Grid Traversal (BFS/DFS Flood Fill)',
    hints: [
      "Scan every cell; whenever you find unvisited land, that's the start of a brand-new island.",
      'From that cell, flood-fill outward (BFS or DFS) to every connected land cell, marking each visited as you go.',
      'Marking cells visited as soon as you enqueue them (not when you dequeue them) avoids adding the same cell twice.',
      'Only the 4 orthogonal neighbors count — no diagonals.',
    ],
    relatedProblems: [
      { name: 'Max Area of Island', note: 'Same flood fill, track size instead of just counting components.' },
      { name: 'Surrounded Regions', note: 'Flood fill from the border inward instead of scanning for unvisited land.' },
      { name: 'Number of Provinces', note: 'Same connected-components idea over an adjacency matrix instead of a grid.' },
      { name: 'Pacific Atlantic Water Flow', note: 'Two flood fills from opposite borders, then intersect.' },
    ],
    InputForm: IslandsInputForm,
    StateView: IslandsStateView,
  },
  {
    id: 'permutations',
    name: 'Permutations',
    description: 'Generate every ordering of a set of distinct numbers using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking (Choose / Explore / Unchoose)',
    hints: [
      "At each position, try every number that hasn't been used yet.",
      'A `used[]` array is cheaper than scanning the current path to check availability.',
      "Base case: once the path's length equals the input length, you've built a complete permutation — record a copy of it.",
      'After the recursive call returns, undo your choice (remove from path, mark unused) before trying the next candidate.',
    ],
    relatedProblems: [
      { name: 'Permutations II', note: 'Same backtracking, plus a rule for skipping duplicate values.' },
      { name: 'Next Permutation', note: 'Solves a related question — the next ordering — without backtracking at all.' },
      { name: 'Combinations', note: "Same choose/unchoose shape, but order doesn't matter and no reuse." },
      { name: 'Letter Combinations of a Phone Number', note: 'Same recursion shape over a different alphabet per position.' },
    ],
    InputForm: PermutationsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'combinations',
    name: 'Combinations',
    description: 'Choose every k-sized group from 1..n using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking with a Start Index',
    hints: [
      "Unlike permutations, order doesn't matter — so only ever consider candidates ≥ the last one you picked.",
      'Pass a `start` index into the recursion and loop from there to n, which naturally prevents duplicates and reuse.',
      "Base case: once the path reaches size k, record the combination and return.",
      'Undo the last choice after the recursive call returns — same choose/explore/unchoose shape as Permutations.',
    ],
    relatedProblems: [
      { name: 'Combination Sum', note: 'Same start-index backtracking, but the stopping condition is a target sum, not a fixed size.' },
      { name: 'Combination Sum II', note: 'Adds duplicate-skipping on top of the same shape.' },
      { name: 'Subsets', note: 'Nearly identical — records every node visited, not just size-k ones.' },
      { name: 'Permutations', note: "Same backtracking, but order matters and there's no start index." },
    ],
    InputForm: CombinationsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'subsets',
    name: 'Subsets',
    description: 'Generate the power set of a list of numbers using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking / Power Set Enumeration',
    hints: [
      "There's no fixed stopping size — every node in the recursion tree, including the very first empty path, is a valid subset.",
      'Record the current path immediately on entering the function, before the loop that extends it.',
      'Use a `start` index (like Combinations) so each element is only ever added after the ones before it — that avoids duplicate subsets.',
    ],
    relatedProblems: [
      { name: 'Subsets II', note: 'Same shape, plus duplicate-skipping for repeated input values.' },
      { name: 'Combinations', note: 'Same start-index backtracking, but only leaves of a fixed size count.' },
      { name: 'Combination Sum', note: 'Same tree shape, filtered by a target sum instead of collected wholesale.' },
      { name: 'Permutations', note: "Same backtracking family, but order matters and there's no start index." },
    ],
    InputForm: SubsetsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'n-queens',
    name: 'N-Queens',
    description: 'Place N non-attacking queens on an N×N board using backtracking with constraint checking.',
    category: 'Backtracking',
    pattern: 'Backtracking with Constraint Checking',
    hints: [
      'Place one queen per row — that alone guarantees no two queens ever share a row.',
      'Before placing a queen at (row, col), check it against every queen already placed: same column, or equal row/column distance for a diagonal hit.',
      "Base case: once you've placed a queen in every row, you've found a complete solution — record the column arrangement.",
      'Backtrack by removing the last-placed queen and trying the next column in that row.',
    ],
    relatedProblems: [
      { name: 'N-Queens II', note: 'Identical search — just count solutions instead of recording them.' },
      { name: 'Sudoku Solver', note: 'Same backtracking-with-constraints shape over a 9×9 grid.' },
      { name: 'Valid Sudoku', note: 'The constraint-checking logic on its own, without the search.' },
      { name: 'Combinations', note: 'A simpler backtracking search to warm up on the same choose/unchoose mechanics.' },
    ],
    InputForm: NQueensInputForm,
    StateView: NQueensStateView,
  },
  {
    id: 'letter-combinations-of-a-phone-number',
    name: 'Letter Combinations of a Phone Number',
    description: 'Generate every letter combination a digit string could represent on a phone keypad, using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking / Cartesian Product',
    hints: [
      "Each digit maps to a fixed set of letters — you're really building the Cartesian product of those sets, one digit at a time.",
      'Recurse on the digit index: at each level, try every letter for the current digit before moving to the next digit.',
      'Base case: once the index reaches the end of the digit string, the current path is one full combination.',
      'Remove the last letter you appended before trying the next one — same choose/explore/unchoose shape as the other backtracking algorithms.',
    ],
    relatedProblems: [
      { name: 'Permutations', note: 'Same backtracking recursion, over a fixed alphabet instead of one that varies per position.' },
      { name: 'Generate Parentheses', note: 'Same recursion shape, constrained by balance rules instead of an alphabet.' },
      { name: 'Combinations', note: 'Simpler warm-up on the same choose/explore/unchoose mechanics.' },
      { name: 'Restore IP Addresses', note: 'Same per-position choice recursion, constrained by valid octet rules.' },
    ],
    InputForm: LetterCombinationsInputForm,
    StateView: StringBacktrackingStateView,
  },
  {
    id: 'task-scheduler',
    name: 'Task Scheduler',
    description: 'Find the minimum CPU time to run every task, given a per-task cooldown, using a greedy tick-by-tick simulation.',
    category: 'Heaps & Greedy',
    pattern: 'Greedy Simulation (Max-Heap by Remaining Count)',
    hints: [
      "At each CPU tick, run the ready task (not on cooldown) with the highest remaining count — that's the greedy choice that spreads out the most frequent task as early as possible.",
      'A max-heap keyed by remaining count is the efficient way to always find that task, though a linear scan works fine for small inputs.',
      "After running a task, it can't run again until n ticks have passed — track a per-task \"available at\" tick.",
      "If nothing is ready, the CPU sits idle for that tick — idle slots still count toward the total time.",
    ],
    relatedProblems: [
      { name: 'Reorganize String', note: 'Same greedy "place the most frequent item, respecting a gap" idea, over string characters.' },
      { name: 'Rearrange String k Distance Apart', note: 'Generalizes the same cooldown-gap greedy to arbitrary strings.' },
      { name: 'Top K Frequent Elements', note: 'Same frequency-counting + max-heap building block, without the cooldown.' },
      { name: 'Meeting Rooms II', note: 'Different problem, same family: greedy scheduling driven by a heap.' },
    ],
    InputForm: TaskSchedulerInputForm,
    StateView: TaskSchedulerStateView,
  },
  {
    id: 'generate-parentheses',
    name: 'Generate Parentheses',
    description: 'Generate every well-formed combination of n pairs of parentheses using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking with a Balance Constraint',
    hints: [
      "At each position you have up to two choices: add '(' or add ')' — the trick is knowing when each is legal.",
      "You can always add '(' as long as you haven't used all n of them yet.",
      "You can only add ')' if it wouldn't outnumber the '(' placed so far — otherwise the string can never become well-formed.",
      "Base case: once the path reaches length 2n, both counts are automatically balanced — record it as a complete combination.",
    ],
    relatedProblems: [
      { name: 'Valid Parentheses', note: 'The balance-checking rule this problem builds on, without any generation.' },
      { name: 'Letter Combinations of a Phone Number', note: 'Same choose/explore/unchoose recursion shape, over a different alphabet.' },
      { name: 'Combinations', note: 'Same backtracking family, without the open/close balance constraint.' },
      { name: 'Remove Invalid Parentheses', note: 'Same balance idea, run in reverse: repair a string instead of building one.' },
    ],
    InputForm: GenerateParenthesesInputForm,
    StateView: StringBacktrackingStateView,
  },
];

export function getAlgorithm(id: string): AlgorithmDefinition | undefined {
  return algorithms.find((algorithm) => algorithm.id === id);
}
