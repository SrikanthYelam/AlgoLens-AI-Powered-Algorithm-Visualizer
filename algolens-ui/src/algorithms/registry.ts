import type { ComponentType } from 'react';
import type { AlgorithmInputFormProps, AlgorithmStateViewProps } from '../types/algorithm';
import { BacktrackingStateView } from '../components/BacktrackingStateView';
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
import { LetterCombinationsStateView } from './letterCombinations/LetterCombinationsStateView';

export interface AlgorithmDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
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
    InputForm: TreeInputForm,
    StateView: TreeStateView,
  },
  {
    id: 'sliding-window-maximum',
    name: 'Sliding Window Maximum',
    description: 'Find the maximum value in every fixed-size window of an array using a monotonic deque.',
    category: 'Arrays & Stacks',
    InputForm: SlidingWindowInputForm,
    StateView: SlidingWindowStateView,
  },
  {
    id: 'largest-rectangle-in-histogram',
    name: 'Largest Rectangle in Histogram',
    description: 'Find the largest rectangular area in a histogram using a monotonic stack.',
    category: 'Arrays & Stacks',
    InputForm: HistogramInputForm,
    StateView: HistogramStateView,
  },
  {
    id: 'number-of-islands',
    name: 'Number of Islands',
    description: 'Count connected land regions in a grid using BFS flood fill.',
    category: 'Trees & Graphs',
    InputForm: IslandsInputForm,
    StateView: IslandsStateView,
  },
  {
    id: 'permutations',
    name: 'Permutations',
    description: 'Generate every ordering of a set of distinct numbers using backtracking.',
    category: 'Backtracking',
    InputForm: PermutationsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'combinations',
    name: 'Combinations',
    description: 'Choose every k-sized group from 1..n using backtracking.',
    category: 'Backtracking',
    InputForm: CombinationsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'subsets',
    name: 'Subsets',
    description: 'Generate the power set of a list of numbers using backtracking.',
    category: 'Backtracking',
    InputForm: SubsetsInputForm,
    StateView: BacktrackingStateView,
  },
  {
    id: 'n-queens',
    name: 'N-Queens',
    description: 'Place N non-attacking queens on an N×N board using backtracking with constraint checking.',
    category: 'Backtracking',
    InputForm: NQueensInputForm,
    StateView: NQueensStateView,
  },
  {
    id: 'letter-combinations-of-a-phone-number',
    name: 'Letter Combinations of a Phone Number',
    description: 'Generate every letter combination a digit string could represent on a phone keypad, using backtracking.',
    category: 'Backtracking',
    InputForm: LetterCombinationsInputForm,
    StateView: LetterCombinationsStateView,
  },
];

export function getAlgorithm(id: string): AlgorithmDefinition | undefined {
  return algorithms.find((algorithm) => algorithm.id === id);
}
