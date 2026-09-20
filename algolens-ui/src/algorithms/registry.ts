import type { ComponentType } from 'react';
import type { AlgorithmInputFormProps, AlgorithmStateViewProps } from '../types/algorithm';
import { BacktrackingStateView } from '../components/BacktrackingStateView';
import { StringBacktrackingStateView } from '../components/StringBacktrackingStateView';
import { TreeInputForm } from './binaryTreeLevelOrder/TreeInputForm';
import { TreeStateView } from './binaryTreeLevelOrder/TreeStateView';
import { SlidingWindowInputForm } from './slidingWindowMaximum/SlidingWindowInputForm';
import { SlidingWindowStateView } from './slidingWindowMaximum/SlidingWindowStateView';
import { LongestSubarrayAbsDiffLimitInputForm } from './longestSubarrayAbsDiffLimit/LongestSubarrayAbsDiffLimitInputForm';
import { LongestSubarrayAbsDiffLimitStateView } from './longestSubarrayAbsDiffLimit/LongestSubarrayAbsDiffLimitStateView';
import { HistogramInputForm } from './largestRectangleInHistogram/HistogramInputForm';
import { HistogramStateView } from './largestRectangleInHistogram/HistogramStateView';
import { IslandsInputForm } from './numberOfIslands/IslandsInputForm';
import { IslandsStateView } from './numberOfIslands/IslandsStateView';
import { CourseScheduleInputForm } from './courseSchedule/CourseScheduleInputForm';
import { CourseScheduleKahnStateView } from './courseSchedule/CourseScheduleKahnStateView';
import { CourseScheduleDfsStateView } from './courseSchedule/CourseScheduleDfsStateView';
import { PermutationsInputForm } from './permutations/PermutationsInputForm';
import { CombinationsInputForm } from './combinations/CombinationsInputForm';
import { SubsetsInputForm } from './subsets/SubsetsInputForm';
import { NQueensInputForm } from './nQueens/NQueensInputForm';
import { NQueensStateView } from './nQueens/NQueensStateView';
import { LetterCombinationsInputForm } from './letterCombinations/LetterCombinationsInputForm';
import { TaskSchedulerInputForm } from './taskScheduler/TaskSchedulerInputForm';
import { TaskSchedulerStateView } from './taskScheduler/TaskSchedulerStateView';
import { GenerateParenthesesInputForm } from './generateParentheses/GenerateParenthesesInputForm';
import { RemoveInvalidParenthesesInputForm } from './removeInvalidParentheses/RemoveInvalidParenthesesInputForm';
import { RemoveInvalidParenthesesBfsStateView } from './removeInvalidParentheses/RemoveInvalidParenthesesBfsStateView';
import { RemoveInvalidParenthesesDfsStateView } from './removeInvalidParentheses/RemoveInvalidParenthesesDfsStateView';
import { LongestCommonSubsequenceInputForm } from './longestCommonSubsequence/LongestCommonSubsequenceInputForm';
import { LongestCommonSubsequenceStateView } from './longestCommonSubsequence/LongestCommonSubsequenceStateView';
import { LongestPalindromicSubsequenceInputForm } from './longestPalindromicSubsequence/LongestPalindromicSubsequenceInputForm';
import { LongestPalindromicSubsequenceStateView } from './longestPalindromicSubsequence/LongestPalindromicSubsequenceStateView';
import { LongestIncreasingSubsequenceInputForm } from './longestIncreasingSubsequence/LongestIncreasingSubsequenceInputForm';
import { LongestIncreasingSubsequenceStateView } from './longestIncreasingSubsequence/LongestIncreasingSubsequenceStateView';
import { EditDistanceInputForm } from './editDistance/EditDistanceInputForm';
import { EditDistanceStateView } from './editDistance/EditDistanceStateView';
import { LongestPalindromicSubstringInputForm } from './longestPalindromicSubstring/LongestPalindromicSubstringInputForm';
import { LongestPalindromicSubstringStateView } from './longestPalindromicSubstring/LongestPalindromicSubstringStateView';
import { UniqueBinarySearchTreesInputForm } from './uniqueBinarySearchTrees/UniqueBinarySearchTreesInputForm';
import { UniqueBinarySearchTreesStateView } from './uniqueBinarySearchTrees/UniqueBinarySearchTreesStateView';
import { MeetingRoomsInputForm } from './meetingRoomsII/MeetingRoomsInputForm';
import { MeetingRoomsStateView } from './meetingRoomsII/MeetingRoomsStateView';
import { ValidateBstStateView } from './validateBst/ValidateBstStateView';
import { KthSmallestInputForm } from './kthSmallestInBst/KthSmallestInputForm';
import { KthSmallestStateView } from './kthSmallestInBst/KthSmallestStateView';
import { LowestCommonAncestorInputForm } from './lowestCommonAncestor/LowestCommonAncestorInputForm';
import { LowestCommonAncestorStateView } from './lowestCommonAncestor/LowestCommonAncestorStateView';
import { ConstructBinaryTreeInputForm } from './constructBinaryTree/ConstructBinaryTreeInputForm';
import { ConstructBinaryTreeStateView } from './constructBinaryTree/ConstructBinaryTreeStateView';
import { RecoverBstStateView } from './recoverBst/RecoverBstStateView';
import { FindDuplicateSubtreesStateView } from './findDuplicateSubtrees/FindDuplicateSubtreesStateView';
import { DeleteNodeInBstInputForm } from './deleteNodeInBst/DeleteNodeInBstInputForm';
import { DeleteNodeInBstStateView } from './deleteNodeInBst/DeleteNodeInBstStateView';
import { FlattenBinaryTreeRecursiveStateView } from './flattenBinaryTree/FlattenBinaryTreeRecursiveStateView';
import { FlattenBinaryTreeIterativeStateView } from './flattenBinaryTree/FlattenBinaryTreeIterativeStateView';
import { NumberOfProvincesInputForm } from './numberOfProvinces/NumberOfProvincesInputForm';
import { NumberOfProvincesStateView } from './numberOfProvinces/NumberOfProvincesStateView';
import { RedundantConnectionInputForm } from './redundantConnection/RedundantConnectionInputForm';
import { RedundantConnectionStateView } from './redundantConnection/RedundantConnectionStateView';
import { AccountsMergeInputForm } from './accountsMerge/AccountsMergeInputForm';
import { AccountsMergeStateView } from './accountsMerge/AccountsMergeStateView';
import { NumberOfIslandsIIInputForm } from './numberOfIslandsII/NumberOfIslandsIIInputForm';
import { NumberOfIslandsIIStateView } from './numberOfIslandsII/NumberOfIslandsIIStateView';
import { SortedListToBstInputForm } from './sortedListToBst/SortedListToBstInputForm';
import { SortedListToBstStateView } from './sortedListToBst/SortedListToBstStateView';

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
  /** Big-O time complexity, e.g. "O(n log n)". */
  timeComplexity: string;
  /** Big-O space complexity, e.g. "O(n)". */
  spaceComplexity: string;
  /** 2-3 sentence explanation of where the time/space bounds come from. */
  complexityNotes: string;
  /** Progressive hints, from vaguest to most specific. */
  hints: string[];
  relatedProblems: RelatedProblem[];
  /** The exact C# method signature "Try Your Own Solution" expects the user to implement. */
  judgeSignature: string;
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
    category: 'Trees',
    pattern: 'Breadth-First Search (BFS) with a Queue',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Every node is enqueued and dequeued exactly once, so the traversal touches each node a constant number of times. The queue holds at most one full level at a time, which is O(n) in the worst case (a wide tree).',
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
    judgeSignature: 'public static IList<IList<int>> Solve(TreeNode? root)',
    InputForm: TreeInputForm,
    StateView: TreeStateView,
  },
  {
    id: 'sliding-window-maximum',
    name: 'Sliding Window Maximum',
    description: 'Find the maximum value in every fixed-size window of an array using a monotonic deque.',
    category: 'Arrays & Stacks',
    pattern: 'Sliding Window + Monotonic Deque',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    complexityNotes: 'Each index enters and leaves the deque at most once, so despite the nested-looking loops the total work is linear, not quadratic. The deque never holds more than `windowSize` (k) indices at a time.',
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
    judgeSignature: 'public static int[] Solve(int[] nums, int k)',
    InputForm: SlidingWindowInputForm,
    StateView: SlidingWindowStateView,
  },
  {
    id: 'longest-continuous-subarray-abs-diff-limit',
    name: 'Longest Continuous Subarray With Absolute Diff Less Than Or Equal To Limit',
    description: 'Find the longest subarray whose max and min differ by at most a given limit, using a sliding window guarded by two monotonic deques.',
    category: 'Arrays & Stacks',
    pattern: 'Sliding Window + Two Monotonic Deques',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Each index enters and leaves each deque at most once, and the left pointer only ever advances, so the total work across the whole scan is linear despite the nested-looking shrink loop.',
    hints: [
      "The window is valid exactly when its max minus its min is ≤ limit — you need running max and min as the window slides, not just a sum or count.",
      'Maintain two monotonic deques of indices: one decreasing (front is the max) and one increasing (front is the min), the same trick Sliding Window Maximum uses for just one extreme.',
      'Before pushing index right, pop from each deque\'s back any indices whose values can no longer be that extreme.',
      "While the window's max minus min exceeds limit, advance left, popping either deque's front if it points at the index leaving the window.",
    ],
    relatedProblems: [
      { name: 'Sliding Window Maximum', note: 'Same monotonic-deque trick, but tracking only the max over a fixed-size window.' },
      { name: 'Subarrays with K Different Integers', note: 'Same two-pointer shrink-while-invalid shape, different validity condition.' },
      { name: 'Longest Substring Without Repeating Characters', note: 'Same sliding-window skeleton over a different constraint (no duplicates).' },
    ],
    judgeSignature: 'public static int Solve(int[] nums, int limit)',
    InputForm: LongestSubarrayAbsDiffLimitInputForm,
    StateView: LongestSubarrayAbsDiffLimitStateView,
  },
  {
    id: 'largest-rectangle-in-histogram',
    name: 'Largest Rectangle in Histogram',
    description: 'Find the largest rectangular area in a histogram using a monotonic stack.',
    category: 'Arrays & Stacks',
    pattern: 'Monotonic Stack',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Each bar is pushed and popped from the stack at most once, so the two nested-looking loops still do only O(n) total work between them. The stack can hold all n indices in the worst case, when heights are strictly increasing.',
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
    judgeSignature: 'public static int Solve(int[] heights)',
    InputForm: HistogramInputForm,
    StateView: HistogramStateView,
  },
  {
    id: 'number-of-islands',
    name: 'Number of Islands',
    description: 'Count connected land regions in a grid using BFS flood fill.',
    category: 'Graphs',
    pattern: 'Grid Traversal (BFS/DFS Flood Fill)',
    timeComplexity: 'O(rows · cols)',
    spaceComplexity: 'O(rows · cols)',
    complexityNotes: 'The visited marking guarantees every cell is processed a constant number of times across the whole scan-plus-flood-fill. The BFS queue and visited grid can both grow to the size of the entire grid, for one giant island.',
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
    judgeSignature: 'public static int Solve(int[][] grid)',
    InputForm: IslandsInputForm,
    StateView: IslandsStateView,
  },
  {
    id: 'course-schedule-kahn',
    name: "Course Schedule (Kahn's Algorithm)",
    description: 'Determine whether all courses can be finished, via BFS topological sort over the prerequisite graph.',
    category: 'Graphs',
    pattern: "Kahn's Algorithm (BFS Topological Sort)",
    timeComplexity: 'O(courses + prerequisites)',
    spaceComplexity: 'O(courses + prerequisites)',
    complexityNotes: 'Building the adjacency list and in-degree array is linear in the number of edges; the BFS itself visits every course and every edge exactly once. The adjacency list, in-degree array, and queue are all sized to the graph.',
    hints: [
      "A course can be taken once every one of its prerequisites has been taken — track that as an \"in-degree\" (unmet prerequisite count) per course.",
      'Any course with in-degree 0 has nothing blocking it — seed a queue with all of them.',
      "Dequeuing a course \"takes\" it: decrement the in-degree of everything that depends on it, and enqueue any course that just dropped to 0.",
      "If the resulting order includes every course, the schedule works. If it doesn't, the courses left out are stuck in a cycle — none of them ever reaches in-degree 0.",
    ],
    relatedProblems: [
      { name: 'Course Schedule II', note: 'Same Kahn\'s-algorithm BFS, but return the order itself instead of just whether it exists.' },
      { name: 'Course Schedule (DFS Cycle Detection)', note: 'Same problem, solved by detecting a back edge during DFS instead of counting in-degrees.' },
      { name: 'Alien Dictionary', note: 'Same topological-sort shape, built from letter-ordering constraints instead of prerequisites.' },
      { name: 'Redundant Connection', note: 'Another graph problem where a cycle is exactly what makes the input unsolvable/invalid.' },
    ],
    judgeSignature: 'public static bool Solve(int numCourses, int[][] prerequisites)',
    InputForm: CourseScheduleInputForm,
    StateView: CourseScheduleKahnStateView,
  },
  {
    id: 'course-schedule-dfs',
    name: 'Course Schedule (DFS Cycle Detection)',
    description: 'Determine whether all courses can be finished, by DFS-ing the prerequisite graph and watching for a back edge.',
    category: 'Graphs',
    pattern: 'DFS Cycle Detection (Three-Color/Recursion-Stack)',
    timeComplexity: 'O(courses + prerequisites)',
    spaceComplexity: 'O(courses + prerequisites)',
    complexityNotes: 'Every course is colored exactly once from unvisited to visited (with a visiting stop in between), and every edge is inspected exactly once across the whole DFS, so both the adjacency list build and the traversal itself are linear in the graph size. The color array, recursion path, and call stack are all bounded by the number of courses.',
    hints: [
      'Color every course unvisited, visiting, or visited — visiting means it\'s an ancestor of the course currently being explored, still on the call stack.',
      'DFS from every unvisited course, marking it visiting on entry and visited only once every course it depends on has been fully explored.',
      "If a DFS call reaches a course that's already visiting, that's a back edge into the current recursion path — exactly a cycle.",
      "A course colored visited is safe to skip entirely — its own subtree was already proven cycle-free the first time it was explored.",
    ],
    relatedProblems: [
      { name: 'Course Schedule (Kahn\'s Algorithm)', note: 'Same problem, solved by counting in-degrees level by level instead of DFS-ing with colors.' },
      { name: 'Detect Cycle in a Directed Graph', note: 'This algorithm\'s general form, stripped of the "courses" framing.' },
      { name: 'Clone Graph', note: 'Same visited-set-guards-against-revisiting DFS shape, over an undirected graph.' },
      { name: 'Number of Provinces', note: 'Another connected-components-style graph traversal, via Union-Find instead of DFS coloring.' },
    ],
    judgeSignature: 'public static bool Solve(int numCourses, int[][] prerequisites)',
    InputForm: CourseScheduleInputForm,
    StateView: CourseScheduleDfsStateView,
  },
  {
    id: 'permutations',
    name: 'Permutations',
    description: 'Generate every ordering of a set of distinct numbers using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking (Choose / Explore / Unchoose)',
    timeComplexity: 'O(n · n!)',
    spaceComplexity: 'O(n)',
    complexityNotes: "There are n! permutations, and building/copying each one into the results costs O(n), giving O(n · n!) overall. Extra space beyond the output is just the recursion depth and the `used[]`/path arrays, O(n).",
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
    judgeSignature: 'public static IList<IList<int>> Solve(int[] nums)',
    InputForm: PermutationsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'combinations',
    name: 'Combinations',
    description: 'Choose every k-sized group from 1..n using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking with a Start Index',
    timeComplexity: 'O(k · C(n, k))',
    spaceComplexity: 'O(k)',
    complexityNotes: 'There are C(n, k) combinations of length k, so producing all of them costs O(k · C(n, k)). Recursion depth and the path array are O(k).',
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
    judgeSignature: 'public static IList<IList<int>> Solve(int n, int k)',
    InputForm: CombinationsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'subsets',
    name: 'Subsets',
    description: 'Generate the power set of a list of numbers using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking / Power Set Enumeration',
    timeComplexity: 'O(n · 2ⁿ)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'There are 2ⁿ subsets, and copying each one into the results can cost up to O(n), giving O(n · 2ⁿ) overall. Recursion depth and the path array are O(n).',
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
    judgeSignature: 'public static IList<IList<int>> Solve(int[] nums)',
    InputForm: SubsetsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'n-queens',
    name: 'N-Queens',
    description: 'Place N non-attacking queens on an N×N board using backtracking with constraint checking.',
    category: 'Backtracking',
    pattern: 'Backtracking with Constraint Checking',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Row-by-row placement with column/diagonal pruning explores far fewer boards than the naive nⁿ, bounded by O(n!) in the standard analysis. The board is stored as one column per row, so extra space is O(n).',
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
    judgeSignature: 'public static int Solve(int n) // return the number of distinct solutions',
    InputForm: NQueensInputForm,
    StateView: NQueensStateView,
  },
  {
    id: 'letter-combinations-of-a-phone-number',
    name: 'Letter Combinations of a Phone Number',
    description: 'Generate every letter combination a digit string could represent on a phone keypad, using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking / Cartesian Product',
    timeComplexity: 'O(4ⁿ · n)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Each digit maps to up to 4 letters, so there are up to 4ⁿ combinations of length n, each costing O(n) to build. Recursion depth and the path buffer are O(n).',
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
    judgeSignature: 'public static IList<string> Solve(string digits)',
    InputForm: LetterCombinationsInputForm,
    StateView: StringBacktrackingStateView,
  },
  {
    id: 'task-scheduler',
    name: 'Task Scheduler',
    description: 'Find the minimum CPU time to run every task, given a per-task cooldown, using a greedy tick-by-tick simulation.',
    category: 'Heaps & Greedy',
    pattern: 'Greedy Simulation (Max-Heap by Remaining Count)',
    timeComplexity: 'O(T · k)',
    spaceComplexity: 'O(k)',
    complexityNotes: 'T is the total number of CPU ticks in the schedule and k is the number of distinct task types; each tick scans the task counts to make its greedy choice. Only per-task counts and cooldown timestamps need to be stored, so extra space is O(k).',
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
    judgeSignature: 'public static int Solve(char[] tasks, int n)',
    InputForm: TaskSchedulerInputForm,
    StateView: TaskSchedulerStateView,
  },
  {
    id: 'generate-parentheses',
    name: 'Generate Parentheses',
    description: 'Generate every well-formed combination of n pairs of parentheses using backtracking.',
    category: 'Backtracking',
    pattern: 'Backtracking with a Balance Constraint',
    timeComplexity: 'O(4ⁿ / √n)',
    spaceComplexity: 'O(n)',
    complexityNotes: "The pruning (never building an invalid prefix) means the search visits exactly the valid combinations, whose count is the nth Catalan number — asymptotically O(4ⁿ / √n). Extra space beyond the output is just the recursion depth, O(n).",
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
    judgeSignature: 'public static IList<string> Solve(int n)',
    InputForm: GenerateParenthesesInputForm,
    StateView: StringBacktrackingStateView,
  },
  {
    id: 'remove-invalid-parentheses-bfs',
    name: 'Remove Invalid Parentheses (BFS)',
    description: 'Remove the minimum number of parentheses to make a string valid, exploring one fewer character at a time, level by level, using BFS.',
    category: 'Backtracking',
    pattern: 'Breadth-First Search over Strings',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(2ⁿ)',
    complexityNotes: 'Each level can roughly double the number of candidate strings (removing any one of up to n parens), so in the worst case BFS explores an exponential number of strings before hitting a valid level. The visited set and current level both grow with that same count.',
    hints: [
      "A brute-force check of every possible removal combination is expensive — BFS removes one character at a time, level by level, so the very first level with any valid string is guaranteed to use the minimum number of removals.",
      "At each level, check every candidate for validity before removing anything else — if any are valid, that's your answer; stop right there without going deeper.",
      "Only ever remove '(' or ')' characters — letters are never touched — and skip any string you've already generated (a visited set) to avoid redundant work.",
      "A string is valid the same way you'd check \"Valid Parentheses\": track a running balance, never let it go negative, and end at exactly zero.",
    ],
    relatedProblems: [
      { name: 'Valid Parentheses', note: 'The validity check this search leans on at every level.' },
      { name: 'Binary Tree Level Order Traversal', note: 'Same level-by-level BFS mechanics, over strings instead of a tree.' },
      { name: 'Remove Invalid Parentheses (DFS/Backtracking)', note: 'Same problem, solved by computing the removal budget up front instead of searching level by level.' },
      { name: 'Word Ladder', note: 'Another shortest-transformation search that BFS solves level by level.' },
    ],
    judgeSignature: 'public static IList<string> Solve(string s)',
    InputForm: RemoveInvalidParenthesesInputForm,
    StateView: RemoveInvalidParenthesesBfsStateView,
  },
  {
    id: 'remove-invalid-parentheses-dfs',
    name: 'Remove Invalid Parentheses (DFS/Backtracking)',
    description: 'Remove the minimum number of parentheses to make a string valid, backtracking against a removal budget computed up front.',
    category: 'Backtracking',
    pattern: 'Backtracking with a Precomputed Budget',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Each parenthesis offers up to two branches (remove or keep), so the search tree is exponential in the worst case, though the removal-budget pruning cuts it down significantly in practice. Only the recursion stack and one shared path buffer need extra space, O(n).',
    hints: [
      "First figure out exactly how many '(' and ')' must be removed — one linear scan gives you that number directly, with no search needed.",
      'Once you know the exact budget, backtrack index by index: for a parenthesis, try both removing it (spending budget) and keeping it.',
      "Only keep a ')' if there are more '(' than ')' already kept so far — otherwise that branch can never become valid, so it's not worth exploring.",
      'A leaf only counts as a result if both budgets hit exactly zero — that guarantees every recorded result uses the minimum number of removals.',
    ],
    relatedProblems: [
      { name: 'Valid Parentheses', note: 'The same prefix-balance rule used to prune "keep" branches early.' },
      { name: 'Generate Parentheses', note: 'Same backtracking shape, generating combinations instead of repairing one.' },
      { name: 'Remove Invalid Parentheses (BFS)', note: 'Same problem, solved by exploring level by level instead of budgeting up front.' },
      { name: 'Combination Sum', note: 'Same "search against a shrinking budget" backtracking idea.' },
    ],
    judgeSignature: 'public static IList<string> Solve(string s)',
    InputForm: RemoveInvalidParenthesesInputForm,
    StateView: RemoveInvalidParenthesesDfsStateView,
  },
  {
    id: 'longest-common-subsequence',
    name: 'Longest Common Subsequence',
    description: 'Find the length (and an actual instance) of the longest subsequence common to two strings, using 2D dynamic programming.',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming — 2D Table (Two Sequences)',
    timeComplexity: 'O(m · n)',
    spaceComplexity: 'O(m · n)',
    complexityNotes: "Every cell of the (m+1)×(n+1) table is computed once in O(1), so filling it costs O(m · n). The traceback that recovers the actual subsequence afterward is only O(m + n), so it doesn't change the overall bound.",
    hints: [
      'Define dp[i][j] as the length of the LCS between the first i characters of text1 and the first j characters of text2.',
      'If the characters at positions i-1 and j-1 match, they can both be part of the subsequence — extend the LCS found without either of them: dp[i][j] = dp[i-1][j-1] + 1.',
      "If they don't match, the LCS can't use both characters at once — take whichever choice is better: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      "To recover the actual subsequence (not just its length), trace back through the table from the bottom-right corner, following whichever transition produced each cell's value.",
    ],
    relatedProblems: [
      { name: 'Edit Distance', note: 'Same 2D table shape, with insert/delete/replace transitions instead of match/skip.' },
      { name: 'Shortest Common Supersequence', note: 'Builds directly on the LCS table to merge two strings.' },
      { name: 'Longest Palindromic Subsequence', note: 'Equivalent to the LCS of a string and its own reverse.' },
      { name: 'Delete Operation for Two Strings', note: 'The number of deletions needed is directly derived from the LCS length.' },
    ],
    judgeSignature: 'public static int Solve(string text1, string text2)',
    InputForm: LongestCommonSubsequenceInputForm,
    StateView: LongestCommonSubsequenceStateView,
  },
  {
    id: 'longest-palindromic-subsequence',
    name: 'Longest Palindromic Subsequence',
    description: 'Find the length of the longest subsequence of a string that reads the same forwards and backwards, using interval dynamic programming.',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming — Interval DP (2D Table by Length)',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n²)',
    complexityNotes: 'There are O(n²) substrings s[i..j], and each cell is computed once in O(1) from shorter, already-known intervals, giving O(n²) time and the same for the table itself.',
    hints: [
      "A single character is always a palindrome of length 1 — that's your base case.",
      'Think in terms of substrings s[i..j]: if the two ends match, they can bracket whatever palindrome is inside them: dp[i][j] = dp[i+1][j-1] + 2.',
      "If the ends don't match, the best palindrome in s[i..j] is the better of dropping one end or the other: dp[i][j] = max(dp[i+1][j], dp[i][j-1]).",
      'Fill the table by increasing substring length, since dp[i][j] always depends on strictly shorter, more-inside substrings being already known.',
    ],
    relatedProblems: [
      { name: 'Longest Palindromic Substring', note: 'The contiguous version of the same idea — no subsequence gaps allowed.' },
      { name: 'Palindrome Partitioning', note: 'Same palindrome-structure insight, applied to splitting a string.' },
      { name: 'Longest Common Subsequence', note: 'LPS of s is exactly the LCS of s and its reverse.' },
      { name: 'Valid Palindrome', note: 'The basic two-pointer check this whole family of problems builds on.' },
    ],
    judgeSignature: 'public static int Solve(string s)',
    InputForm: LongestPalindromicSubsequenceInputForm,
    StateView: LongestPalindromicSubsequenceStateView,
  },
  {
    id: 'longest-increasing-subsequence',
    name: 'Longest Increasing Subsequence',
    description: 'Find the length of the longest strictly increasing subsequence of an array, using 2D dynamic programming.',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming — 2D Table (Index + Previous Index)',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n²)',
    complexityNotes: "There are (n+1)×(n+1) (index, previous-index) states, and each is computed once in O(1), giving O(n²) total work. The table itself holds all of those states, so space is also O(n²) — more than the O(n) a 1D dp[] array would need, but this formulation generalizes directly to other 'choose subject to a constraint from what you picked before' problems, which the flat dp[] version doesn't as cleanly.",
    hints: [
      'Define dp[i][j] as the length of the best increasing subsequence achievable from index i onward, given the previously included element sits at index j-1 (j = 0 means nothing picked yet).',
      "At index i you have two choices: skip nums[i] (dp[i+1][j]), or — only if it's allowed to follow the previous pick — take it and continue with dp[i+1][i+1], since nums[i] becomes the new 'previous'.",
      'nums[i] is allowed to extend the subsequence exactly when there is no previous pick yet (j == 0) or nums[i] is greater than the previous pick, nums[j-1].',
      'Fill the table bottom-up over i from n down to 0, since row i depends on the already-known row i+1. The answer is dp[0][0]: the best subsequence over the whole array with nothing picked yet.',
    ],
    relatedProblems: [
      { name: 'Longest Common Subsequence', note: 'A different route to the same answer: LIS of nums equals the LCS of nums and its sorted, de-duplicated version.' },
      { name: 'Number of Longest Increasing Subsequence', note: 'Same index/previous-index state space, paired with a count tracking how many ways reach each length.' },
      { name: 'Russian Doll Envelopes', note: 'The same chain-building idea, extended to two dimensions.' },
      { name: 'Maximum Length of Pair Chain', note: 'Same DP shape over pairs ordered by a different rule.' },
    ],
    judgeSignature: 'public static int Solve(int[] nums)',
    InputForm: LongestIncreasingSubsequenceInputForm,
    StateView: LongestIncreasingSubsequenceStateView,
  },
  {
    id: 'edit-distance',
    name: 'Edit Distance',
    description: 'Find the minimum number of insert/delete/replace operations to turn one word into another, using 2D dynamic programming.',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming — 2D Table (Two Sequences)',
    timeComplexity: 'O(m · n)',
    spaceComplexity: 'O(m · n)',
    complexityNotes: 'Every cell of the (m+1)×(n+1) table is computed once in O(1) — either inherited from the diagonal on a match, or 1 + the cheapest of three neighbors on a mismatch — so filling it costs O(m · n). The whole table is kept, so space is O(m · n) too.',
    hints: [
      'Define dp[i][j] as the minimum number of operations to turn the first i characters of word1 into the first j characters of word2.',
      'Turning a prefix of word1 into an empty word2 only takes deletions, and turning an empty word1 into a prefix of word2 only takes insertions — that gives you dp[i][0] = i and dp[0][j] = j as base cases.',
      "If the characters at positions i-1 and j-1 already match, no operation is needed there: dp[i][j] = dp[i-1][j-1].",
      "Otherwise you must spend one operation — replace, delete, or insert — plus whichever of the three neighboring subproblems is cheapest: dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]).",
    ],
    relatedProblems: [
      { name: 'Longest Common Subsequence', note: 'Same 2D two-string table shape, with match/skip transitions instead of match/replace/delete/insert.' },
      { name: 'One Edit Distance', note: 'The yes/no version of this same question, answerable without a full table.' },
      { name: 'Delete Operation for Two Strings', note: 'Edit Distance restricted to only the delete operation — derivable directly from the LCS length.' },
      { name: 'Longest Palindromic Subsequence', note: 'A different 2D table shape (interval DP) over a single string instead of two.' },
    ],
    judgeSignature: 'public static int Solve(string word1, string word2)',
    InputForm: EditDistanceInputForm,
    StateView: EditDistanceStateView,
  },
  {
    id: 'longest-palindromic-substring',
    name: 'Longest Palindromic Substring',
    description: 'Find the longest contiguous substring of a string that reads the same forwards and backwards, using interval dynamic programming.',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming — Interval DP (2D Table by Length)',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n²)',
    complexityNotes: 'There are O(n²) substrings s[i..j], and each cell is computed once in O(1) from a strictly shorter, already-known interval, giving O(n²) time and the same for the table itself.',
    hints: [
      "A single character is always a palindrome — that's your base case.",
      "A two-character span s[i..i+1] is a palindrome exactly when the two characters match — there's no shorter interval to check yet, so handle this length separately.",
      'For longer spans, s[i..j] is a palindrome exactly when its two ends match and the interval inside them, s[i+1..j-1], is also a palindrome.',
      'Fill the table by increasing substring length, and keep track of the longest palindrome found so far as you go — the answer is already known the moment the fill finishes.',
    ],
    relatedProblems: [
      { name: 'Longest Palindromic Subsequence', note: 'The non-contiguous version of the same idea — gaps are allowed, so it reduces to a length instead of an exact span.' },
      { name: 'Palindrome Partitioning', note: 'Reuses the same is-palindrome table to split a string into palindromic pieces.' },
      { name: 'Valid Palindrome', note: 'The basic two-pointer check this whole family of problems builds on.' },
      { name: 'Longest Common Subsequence', note: 'A different 2D table shape over two strings instead of intervals of one.' },
    ],
    judgeSignature: 'public static string Solve(string s)',
    InputForm: LongestPalindromicSubstringInputForm,
    StateView: LongestPalindromicSubstringStateView,
  },
  {
    id: 'unique-binary-search-trees',
    name: 'Unique Binary Search Trees',
    description: 'Count how many structurally unique binary search trees can be built from n distinct keys, using 1D dynamic programming over Catalan numbers.',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming — 1D Table (Catalan Numbers)',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Computing dp[i] means trying each of i possible roots, so the total work summed over all i from 1 to n is O(n²). Only a single 1D array of size n+1 is kept, unlike the 2D tables most other DP problems here use.',
    hints: [
      'Pick any value as the root of the BST — every node smaller than it must end up in the left subtree, and every node larger in the right, regardless of which value you picked.',
      "That means the number of trees for a root only depends on how many nodes are to its left and right, not on the specific values — so dp[k] (unique trees over k nodes) is well-defined independent of which k values they are.",
      'For a tree of i nodes with root j, the left and right subtrees are built independently, so their tree-shape counts multiply: dp[j-1] * dp[i-j].',
      'Sum that product over every possible root j from 1 to i to get dp[i]. dp[0] = 1 (the empty tree) is the base case.',
    ],
    relatedProblems: [
      { name: 'Unique Binary Search Trees II', note: 'Same recurrence, but actually construct and return every tree instead of just counting them.' },
      { name: 'Catalan Number', note: 'dp[n] here is exactly the nth Catalan number — the same count shows up for balanced parentheses and polygon triangulations.' },
      { name: 'Generate Parentheses', note: 'Counts (if you counted its outputs) the same Catalan sequence, reached via backtracking instead of DP.' },
    ],
    judgeSignature: 'public static int Solve(int n)',
    InputForm: UniqueBinarySearchTreesInputForm,
    StateView: UniqueBinarySearchTreesStateView,
  },
  {
    id: 'meeting-rooms-ii',
    name: 'Meeting Rooms II',
    description: 'Find the minimum number of conference rooms required to hold every meeting, using a greedy min-heap of end times.',
    category: 'Heaps & Greedy',
    pattern: 'Greedy + Min-Heap (Sweep by Start Time)',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Sorting the n meetings costs O(n log n). Each meeting does at most one heap pop and one heap push, each O(log n), for O(n log n) total. The heap holds at most n end times at once, so space is O(n).',
    hints: [
      'Sort the meetings by start time first — you need to consider them in the order they begin.',
      'Keep a min-heap of the end times of rooms currently in use, so the earliest-ending room is always on top.',
      "Before assigning a new room to a meeting, check whether the earliest-ending room has already freed up (its end time is <= this meeting's start) — if so, reuse it instead of adding a new room.",
      "The answer isn't the final heap size — it's the largest the heap ever grows to during the whole sweep.",
    ],
    relatedProblems: [
      { name: 'Meeting Rooms', note: 'The yes/no version of this same question — can one person attend every meeting — answerable without a heap.' },
      { name: 'Task Scheduler', note: 'Different problem, same family: greedy scheduling driven by a heap.' },
      { name: 'Merge Intervals', note: 'Same sort-by-start-time foundation, merging overlaps instead of counting concurrency.' },
      { name: 'Car Pooling', note: 'The same "concurrent capacity over time" idea, applied to a passenger count instead of a room count.' },
    ],
    judgeSignature: 'public static int Solve(int[][] intervals)',
    InputForm: MeetingRoomsInputForm,
    StateView: MeetingRoomsStateView,
  },
  {
    id: 'validate-binary-search-tree',
    name: 'Validate Binary Search Tree',
    description: "Check whether a binary tree satisfies the BST property, using bounds-passing DFS.",
    category: 'Trees',
    pattern: 'Recursive DFS with Bounds Propagation',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    complexityNotes: 'Every node is visited at most once, giving O(n) time. The extra space is just the recursion stack, bounded by the tree\'s height h (O(log n) for a balanced tree, O(n) for a completely skewed one).',
    hints: [
      "Checking only a node's immediate children isn't enough — a node deep in the left subtree could still violate the value of a grandparent far above it.",
      'Pass down an allowed (lower, upper) range as you recurse; a node must fall strictly inside it.',
      "A left child inherits its parent's lower bound but gets the parent's own value as its new upper bound — the mirror image for a right child.",
      'Use a wide type (like long) for the bounds, or a tree containing int.MinValue/int.MaxValue could break a naive comparison.',
    ],
    relatedProblems: [
      { name: 'Kth Smallest Element in a BST', note: 'Same BST structure, a different technique: inorder traversal instead of bounds-checking.' },
      { name: 'Recover Binary Search Tree', note: 'Same "is this a valid BST" question, but fixing two swapped values instead of just detecting them.' },
      { name: 'Binary Tree Level Order Traversal', note: 'Same tree, breadth-first instead of the depth-first bounds check here.' },
      { name: 'Lowest Common Ancestor of a Binary Search Tree', note: 'The BST-specific shortcut version of the general tree LCA also in this app.' },
    ],
    judgeSignature: 'public static bool Solve(TreeNode? root)',
    InputForm: TreeInputForm,
    StateView: ValidateBstStateView,
  },
  {
    id: 'kth-smallest-in-bst',
    name: 'Kth Smallest Element in a BST',
    description: 'Find the kth smallest value in a binary search tree, using an iterative inorder traversal.',
    category: 'Trees',
    pattern: 'Iterative Inorder Traversal (Stack)',
    timeComplexity: 'O(h + k)',
    spaceComplexity: 'O(h)',
    complexityNotes: "Descending to the leftmost node costs O(h); after that, each of the k pops does O(1) amortized work (plus at most another O(h) descent into a right subtree), so the walk stops after O(h + k) total work rather than visiting the whole tree. The explicit stack holds at most one root-to-leaf path's worth of nodes, O(h).",
    hints: [
      "An inorder traversal of a BST (left, node, right) visits every node in ascending sorted order — nothing needs to be sorted separately.",
      'Simulate the recursion yourself with an explicit stack: push every left descendant first, then pop, "visit", and move to the popped node\'s right subtree.',
      "Keep a running count of how many nodes have been visited; the answer is whichever node makes that count reach k.",
      "Stop as soon as it's found — there's no need to keep traversing the rest of the tree.",
    ],
    relatedProblems: [
      { name: 'Validate Binary Search Tree', note: 'Same BST, a different technique: bounds-checking instead of traversal.' },
      { name: 'Binary Search Tree Iterator', note: 'Packages this exact same stack-based inorder walk into a reusable next()/hasNext() object.' },
      { name: 'Lowest Common Ancestor of a Binary Search Tree', note: 'Another BST-property-driven shortcut, this time for ancestor search instead of ranking.' },
      { name: 'Two Sum IV - Input is a BST', note: 'Same inorder-gives-sorted-order idea, applied to a two-pointer search.' },
    ],
    judgeSignature: 'public static int Solve(TreeNode? root, int k)',
    InputForm: KthSmallestInputForm,
    StateView: KthSmallestStateView,
  },
  {
    id: 'lowest-common-ancestor',
    name: 'Lowest Common Ancestor of a Binary Tree',
    description: 'Find the lowest node that has two given nodes as descendants, using recursive post-order search.',
    category: 'Trees',
    pattern: 'Recursive Post-Order Search',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    complexityNotes: "Every node is visited at most once in the worst case, giving O(n) time. The recursion depth — and therefore the extra space used — is bounded by the tree's height h.",
    hints: [
      "This is the general binary tree version — there's no left-vs-right value comparison to rely on the way a BST would allow.",
      'Recurse to the bottom first: a call should return the target it found in its own subtree (p, q, or null), not decide anything about ancestry itself.',
      "A node is the answer exactly when its left and right calls report back two different non-null targets — that's the point where p and q's paths split.",
      "If only one side reports something, just pass that result further up unchanged — the real answer might still be higher in the tree.",
    ],
    relatedProblems: [
      { name: 'Lowest Common Ancestor of a Binary Search Tree', note: 'The easier version: BST ordering tells you which way to go without searching both subtrees.' },
      { name: 'Validate Binary Search Tree', note: 'Same tree, a different bounds-vs-search technique.' },
      { name: 'Binary Tree Maximum Path Sum', note: 'Same "gather information from both children before deciding at this node" recursion shape.' },
      { name: 'Diameter of Binary Tree', note: 'Another post-order recursion where the answer can be decided at any node, not just the root.' },
    ],
    judgeSignature: 'public static TreeNode? Solve(TreeNode? root, TreeNode? p, TreeNode? q)',
    InputForm: LowestCommonAncestorInputForm,
    StateView: LowestCommonAncestorStateView,
  },
  {
    id: 'construct-binary-tree',
    name: 'Construct Binary Tree from Preorder and Inorder Traversal',
    description: 'Rebuild a binary tree from its preorder and inorder traversal arrays, using recursive divide-and-conquer.',
    category: 'Trees',
    pattern: 'Recursive Divide-and-Conquer',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityNotes: "Each node is created exactly once, and a precomputed value→index dictionary makes finding a root's split point in the inorder array O(1) instead of an O(n) scan — without it the whole algorithm would degrade to O(n²). Extra space is that dictionary plus the recursion stack, both O(n).",
    hints: [
      "preorder always lists a subtree's root before either of its children — the next unused preorder value is always the root of whatever is currently being built.",
      "Find that root's value in the inorder array: everything to its left is the entire left subtree, everything to its right is the entire right subtree.",
      'Precompute a value→index lookup for the inorder array first, so finding that split point is O(1) instead of scanning — otherwise the whole algorithm degrades to O(n²).',
      'Build the left subtree before the right one, using the shrinking inorder range each recursive call operates on.',
    ],
    relatedProblems: [
      { name: 'Construct Binary Tree from Inorder and Postorder Traversal', note: 'Same divide-and-conquer idea, reading the root from the end of postorder instead of the start of preorder.' },
      { name: 'Binary Tree Level Order Traversal', note: 'The reverse direction in spirit: this rebuilds a tree from traversals, that one produces a traversal from a tree.' },
      { name: 'Validate Binary Search Tree', note: "A different tree-shape problem worth comparing this one's construction logic against." },
      { name: 'Serialize and Deserialize Binary Tree', note: 'Another "rebuild a tree from a flat representation" problem, solved differently.' },
    ],
    judgeSignature: 'public static TreeNode? Solve(int[] preorder, int[] inorder)',
    InputForm: ConstructBinaryTreeInputForm,
    StateView: ConstructBinaryTreeStateView,
  },
  {
    id: 'recover-binary-search-tree',
    name: 'Recover Binary Search Tree',
    description: 'Fix a BST where exactly two nodes were swapped by mistake, using inorder traversal to find the two misplaced values.',
    category: 'Trees',
    pattern: 'Recursive Inorder Traversal (Swap Detection)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    complexityNotes: "Every node is visited exactly once, giving O(n) time. The extra space is just the recursion stack, bounded by the tree's height h.",
    hints: [
      "A valid BST's inorder sequence is strictly increasing — two swapped values break that in one or two places.",
      'Track the previously visited node as you walk the tree in sorted order; whenever it turns out larger than the current node, that\'s a violation.',
      "The first violation's earlier node is always the first misplaced value; whichever node ends the *most recent* violation is always the second — for adjacent swaps that's the same single violation.",
      "Once both are identified, just swap their values — the tree's shape never needs to change.",
    ],
    relatedProblems: [
      { name: 'Validate Binary Search Tree', note: 'Same "is this a valid BST" question, but only detecting the problem instead of fixing it.' },
      { name: 'Kth Smallest Element in a BST', note: 'Same inorder-traversal technique, used for ranking instead of violation detection.' },
      { name: 'Lowest Common Ancestor of a Binary Search Tree', note: 'Another BST-property-driven shortcut in this app.' },
      { name: 'Binary Tree Level Order Traversal', note: 'Same tree, a completely different (breadth-first) traversal order.' },
    ],
    judgeSignature: 'public static void Solve(TreeNode? root)',
    InputForm: TreeInputForm,
    StateView: RecoverBstStateView,
  },
  {
    id: 'find-duplicate-subtrees',
    name: 'Find Duplicate Subtrees',
    description: 'Find every subtree shape that appears more than once in a binary tree, using post-order serialization and a hash map.',
    category: 'Trees',
    pattern: 'Post-Order Serialization + Hash Map',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(n²)',
    complexityNotes: "Each of the n nodes builds a serialization string by concatenating its children's, so a node at depth d can produce a string of length O(n) in the worst (skewed-tree) case — summed over all nodes that's O(n²) time and space for the map. A rolling-hash or tree-isomorphism-numbering approach can bring this down to O(n), but the direct string approach is the standard, most-readable solution.",
    hints: [
      "Two subtrees are duplicates exactly when they have identical structure and values — you need a way to turn a whole subtree into a single comparable value.",
      'Serialize each subtree recursively as "val,leftSerialization,rightSerialization", using a sentinel like "#" for null children — this is just a preorder traversal with null markers, which uniquely determines a tree shape.',
      'Build serializations bottom-up (post-order), so a node can use its already-computed children serializations instead of re-deriving them.',
      'Track how many times each serialization has been seen in a hash map; record a node as a duplicate only the moment its count reaches exactly 2, so each duplicate shape is reported once, not once per repeat.',
    ],
    relatedProblems: [
      { name: 'Serialize and Deserialize Binary Tree', note: "Uses the exact same preorder-with-null-markers encoding, just to rebuild the tree instead of hashing it." },
      { name: 'Same Tree', note: 'The two-tree special case of the same "identical structure and values" comparison this problem generalizes to many subtrees at once.' },
      { name: 'Subtree of Another Tree', note: 'Same subtree-matching idea, checking one specific shape against every subtree instead of finding all repeated shapes.' },
    ],
    judgeSignature: 'public static IList<TreeNode> Solve(TreeNode? root)',
    InputForm: TreeInputForm,
    StateView: FindDuplicateSubtreesStateView,
  },
  {
    id: 'delete-node-in-a-bst',
    name: 'Delete Node in a BST',
    description: 'Delete a node from a binary search tree by key, using recursive search-and-splice with the inorder successor for the two-children case.',
    category: 'Trees',
    pattern: 'Recursive BST Search + Successor Splice',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(h)',
    complexityNotes: "The search for the target is a standard BST walk, O(h) where h is the tree's height. Finding the inorder successor only ever walks further down the already-found node's right subtree, still bounded by O(h). The recursion stack is also O(h).",
    hints: [
      'This is a BST, so finding the node to delete is just a normal search: go left or right by comparing the key against each node, same as a lookup.',
      "A leaf or a node with only one child is easy to remove — just splice it out by returning its (possibly null) child up to the parent.",
      "A node with two children can't just be unlinked without breaking the tree. Instead, find a value that can safely take its place — the inorder successor (smallest value in the right subtree) works, since everything in the left subtree is still smaller than it and everything else in the right subtree is still larger.",
      "Copy the successor's value into the node being deleted, then recursively delete the successor (by its own value) from the right subtree — it has at most one child, so that second deletion is always the easy case.",
    ],
    relatedProblems: [
      { name: 'Insert into a Binary Search Tree', note: 'The mirror-image operation — same recursive BST-navigation shape, building instead of removing.' },
      { name: 'Validate Binary Search Tree', note: 'Same BST-property reasoning, checking the invariant this problem has to preserve after deleting.' },
      { name: 'Kth Smallest Element in a BST', note: "Same 'smallest value in a subtree' idea this problem uses to find the inorder successor, applied to the whole tree instead of one subtree." },
    ],
    judgeSignature: 'public static TreeNode? Solve(TreeNode? root, int key)',
    InputForm: DeleteNodeInBstInputForm,
    StateView: DeleteNodeInBstStateView,
  },
  {
    id: 'flatten-binary-tree-recursive',
    name: 'Flatten Binary Tree to Linked List (Recursive)',
    description: "Flatten a binary tree into a right-only linked list in preorder order, using a recursive preorder traversal that links nodes as it visits them.",
    category: 'Trees',
    pattern: 'Recursive Preorder Traversal with In-Place Linking',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    complexityNotes: "Every node is visited exactly once, giving O(n) time. The only extra space is the recursion stack, bounded by the tree's height h.",
    hints: [
      "The final shape is exactly a preorder traversal — every node's left pointer becomes null and its right pointer becomes 'whatever comes next in preorder'.",
      "Before you touch a node's children pointers, save the original left and right children — you're about to overwrite them, but you still need to recurse into the real subtrees.",
      "Keep track of the previously-visited node. When you visit a new node, point the previous node's right at this one (and clear its left) — that's the link.",
      "Recurse into the saved left child first, then the saved right child, to keep the traversal in true preorder order.",
    ],
    relatedProblems: [
      { name: 'Flatten Binary Tree to Linked List (Iterative)', note: 'Same result, same traversal order, but using O(1) space via in-place threading instead of the recursion call stack.' },
      { name: 'Binary Tree Preorder Traversal', note: 'The traversal order this problem is built directly on top of.' },
      { name: 'Convert Sorted List to Binary Search Tree', note: 'The inverse direction — building a tree from a list instead of collapsing one into a list.' },
    ],
    judgeSignature: 'public static void Solve(TreeNode? root)',
    InputForm: TreeInputForm,
    StateView: FlattenBinaryTreeRecursiveStateView,
  },
  {
    id: 'flatten-binary-tree-iterative',
    name: 'Flatten Binary Tree to Linked List (Iterative)',
    description: "Flatten a binary tree into a right-only linked list in preorder order, in-place and with no extra memory, by threading each node's right subtree onto its left subtree's rightmost node.",
    category: 'Trees',
    pattern: 'O(1)-Space Threading (No Recursion, No Stack)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    complexityNotes: "No recursion and no explicit stack — curr just walks forward through the tree, so this uses only a constant handful of pointers. Finding each node's left subtree's rightmost node looks like it could add up to O(n²) in the worst case, but once a subtree is threaded into the chain it's never searched again, so the total cost of every 'find rightmost' walk across the whole run is bounded by the number of edges in the tree — O(n) overall, not O(n²).",
    hints: [
      "Think about the final shape: a right-only chain in preorder order. If curr has no left child, it's already exactly where it needs to be in that chain — just move on.",
      "If curr does have a left child, that whole left subtree needs to slide over to become curr's new right subtree — but curr's *original* right subtree can't just be dropped.",
      "Find the rightmost node of curr's left subtree (walk right pointers until one is null) — that node has no right child yet, which is exactly the free slot curr's original right subtree needs.",
      'Attach the old right subtree there first, then move the left subtree into curr.Right and clear curr.Left — in that order, nothing is ever lost, and no extra memory beyond a couple of pointers is needed.',
    ],
    relatedProblems: [
      { name: 'Flatten Binary Tree to Linked List (Recursive)', note: 'Same result, same traversal order, but via recursion (and its call stack) instead of O(1) space.' },
      { name: 'Morris Inorder Traversal', note: 'The classic O(1)-space tree traversal this same "thread onto the rightmost node" trick is best known from.' },
      { name: 'Binary Tree Preorder Traversal', note: 'The traversal order this problem is built directly on top of.' },
    ],
    judgeSignature: 'public static void Solve(TreeNode? root)',
    InputForm: TreeInputForm,
    StateView: FlattenBinaryTreeIterativeStateView,
  },
  {
    id: 'sorted-list-to-bst',
    name: 'Convert Sorted List to Binary Search Tree',
    description: 'Convert a sorted singly linked list into a height-balanced BST, using the slow/fast pointer technique to find each segment\'s middle.',
    category: 'Trees',
    pattern: 'Slow/Fast Pointers + Recursive Divide-and-Conquer',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    complexityNotes: "Finding a segment's middle with slow/fast pointers costs time proportional to that segment's length, and this happens once per node created across O(log n) levels of recursion, giving O(n log n) total. Only the recursion stack needs extra space, O(log n) for a balanced tree — the list itself is split in place, not copied.",
    hints: [
      "A height-balanced BST needs its middle element as the root, but a singly linked list has no random access to jump straight to it.",
      'Walk two pointers from the start of the segment: slow moves one node at a time, fast moves two. When fast falls off the end, slow is sitting exactly on the middle.',
      "Keep a trailing pointer one step behind slow, so you can sever its `next` link right there — that splits the list into an independent left segment and right segment with no copying.",
      "Recurse on the left segment for the left subtree and the right segment (starting just past the middle) for the right subtree.",
    ],
    relatedProblems: [
      { name: 'Convert Sorted Array to Binary Search Tree', note: 'The same idea with O(1) random access instead of a linked list, so no slow/fast pointer walk is needed.' },
      { name: 'Construct Binary Tree from Preorder and Inorder Traversal', note: 'Another "rebuild a balanced-ish tree from a linear representation" problem, solved with index ranges instead.' },
      { name: 'Linked List Cycle', note: 'The same slow/fast pointer technique, used to detect a cycle instead of finding a middle.' },
      { name: 'Middle of the Linked List', note: 'The slow/fast pointer middle-finding trick on its own, without the tree-building on top.' },
    ],
    judgeSignature: 'public static TreeNode? Solve(ListNode? head)',
    InputForm: SortedListToBstInputForm,
    StateView: SortedListToBstStateView,
  },
  {
    id: 'number-of-provinces',
    name: 'Number of Provinces',
    description: 'Count the number of connected groups of cities from an adjacency matrix, using Union-Find.',
    category: 'Union-Find',
    pattern: 'Union-Find (Disjoint Set Union)',
    timeComplexity: 'O(n² · α(n))',
    spaceComplexity: 'O(n)',
    complexityNotes: "Every pair of cities is checked once, giving O(n²) pair checks. Each Find/Union is nearly O(1) amortized (α is the inverse Ackermann function, effectively constant) thanks to path compression, so the O(n²) matrix scan dominates. Only the parent array is extra space, O(n).",
    hints: [
      'Start with every city as its own province — a parent array where parent[i] = i.',
      "When two cities are directly connected, union their provinces: find each one's root, and if they differ, point one root at the other.",
      "Path compression (making every visited node point straight at the root during Find) keeps the structure flat, so it doesn't matter what order the connections come in.",
      "Track the province count as a running total that decrements by one on every successful union, rather than counting distinct roots at the end.",
    ],
    relatedProblems: [
      { name: 'Redundant Connection', note: 'Same Union-Find mechanics, used to detect the one edge that creates a cycle instead of counting groups.' },
      { name: 'Accounts Merge', note: 'Same disjoint-set idea over email strings instead of plain city indices.' },
      { name: 'Number of Islands', note: 'A different (BFS flood-fill) way to count connected components, here over a grid instead of a matrix.' },
    ],
    judgeSignature: 'public static int Solve(int[][] isConnected)',
    InputForm: NumberOfProvincesInputForm,
    StateView: NumberOfProvincesStateView,
  },
  {
    id: 'redundant-connection',
    name: 'Redundant Connection',
    description: 'Find the one edge that turns a tree into a graph with a cycle, using Union-Find to spot the first edge whose endpoints are already connected.',
    category: 'Union-Find',
    pattern: 'Union-Find (Disjoint Set Union)',
    timeComplexity: 'O(n · α(n))',
    spaceComplexity: 'O(n)',
    complexityNotes: 'Each of the n edges triggers one Find/Union pair, each nearly O(1) amortized thanks to path compression — so the whole pass is effectively linear in the number of edges.',
    hints: [
      "A tree with n nodes always has exactly n-1 edges — this input has n edges, so exactly one is extra and creates a cycle.",
      'Process edges in the given order, unioning each edge\'s two endpoints as you go.',
      "Before unioning, check whether the two endpoints are already in the same set — if they are, this edge connects two nodes that were already reachable from each other, which is exactly what creates a cycle.",
      "The problem guarantees only one such edge exists, and asks for the one that appears last in the input — so the very first edge you find already-connected endpoints on is the answer; stop there.",
    ],
    relatedProblems: [
      { name: 'Number of Provinces', note: 'Same Union-Find mechanics, used to count groups instead of detecting a cycle.' },
      { name: 'Redundant Connection II', note: 'The directed-graph version of this same problem, where a node can also have two parents.' },
      { name: 'Graph Valid Tree', note: 'Checks the same "no cycle, fully connected" property this problem\'s input almost satisfies.' },
    ],
    judgeSignature: 'public static int[] Solve(int[][] edges)',
    InputForm: RedundantConnectionInputForm,
    StateView: RedundantConnectionStateView,
  },
  {
    id: 'accounts-merge',
    name: 'Accounts Merge',
    description: 'Merge accounts that share an email address into one, using Union-Find over email strings instead of plain array indices.',
    category: 'Union-Find',
    pattern: 'Union-Find over Strings',
    timeComplexity: 'O(n log n · α(n))',
    spaceComplexity: 'O(n)',
    complexityNotes: "Every email is unioned at most once per account it appears in, each Find/Union nearly O(1) amortized. Sorting each merged group's emails for the final output is what actually dominates, O(n log n) overall. The parent map and name lookup are O(n) space.",
    hints: [
      "Two accounts belong to the same person exactly when they share at least one email — names alone can't be trusted, since two different people can share a name.",
      'Union-Find works over any hashable key, not just array indices — use each email string itself as the set element, with a Dictionary<string, string> playing the role of the usual int[] parent array.',
      "Within one account, union every email with that account's first email — that's enough to eventually merge every email in the account into one set.",
      "Once every account has been processed, group all emails by their root, and attach the name from any account that used that root — the emails within each group need to be sorted for the expected output format.",
    ],
    relatedProblems: [
      { name: 'Number of Provinces', note: 'The same Union-Find idea over plain integer indices instead of strings.' },
      { name: 'Redundant Connection', note: 'Another Union-Find problem, here detecting a cycle instead of merging groups.' },
      { name: 'Friend Circles', note: "Another name for Number of Provinces — same underlying 'count the groups' problem." },
    ],
    judgeSignature: 'public static IList<IList<string>> Solve(IList<IList<string>> accounts)',
    InputForm: AccountsMergeInputForm,
    StateView: AccountsMergeStateView,
  },
  {
    id: 'number-of-islands-ii',
    name: 'Number of Islands II',
    description: 'Add land to an all-water grid one cell at a time and report the island count after every addition, using Union-Find to merge islands as they touch.',
    category: 'Union-Find',
    pattern: 'Union-Find (Dynamic Connectivity)',
    timeComplexity: 'O(k · α(m·n))',
    spaceComplexity: 'O(m · n)',
    complexityNotes: 'Each of the k added positions does at most four Find/Union pairs (one per neighbor), each nearly O(1) amortized thanks to path compression, so the whole run is effectively linear in the number of positions. The flat parent array over the m × n grid is the only extra space.',
    hints: [
      'Re-counting islands with a full flood fill after every addition would cost O(m·n) per position — there has to be a way to update the count incrementally instead.',
      'Keep a flat parent array over the grid cells (index = row * n + col), with -1 meaning "still water" and parent[i] = i meaning "land, and the root of its own island".',
      'Adding land at a new cell starts a brand-new island, so the count goes up by one — unless that cell is already land, in which case nothing changes.',
      "Then union the new cell with each of its four neighbors that is already land: every union that joins two previously-separate islands decrements the count by one, and a neighbor already in the same island changes nothing.",
    ],
    relatedProblems: [
      { name: 'Number of Islands', note: 'The static version of this problem — count the islands of a fixed grid in one pass, usually with a flood fill instead of Union-Find.' },
      { name: 'Number of Provinces', note: 'The same Union-Find count-the-groups idea over an adjacency matrix instead of a growing grid.' },
      { name: 'Redundant Connection', note: 'Another Union-Find problem, using a failed union to detect a cycle instead of tracking a running component count.' },
    ],
    judgeSignature: 'public static IList<int> Solve(int m, int n, int[][] positions)',
    InputForm: NumberOfIslandsIIInputForm,
    StateView: NumberOfIslandsIIStateView,
  },
];

export function getAlgorithm(id: string): AlgorithmDefinition | undefined {
  return algorithms.find((algorithm) => algorithm.id === id);
}
