import { describe, expect, it } from 'vitest';
import { deepEqual, deepEqualIgnoringOrder } from './compareAnswers';

describe('deepEqual', () => {
  it('matches identical values', () => {
    expect(deepEqual({ a: [1, 2, 3] }, { a: [1, 2, 3] })).toBe(true);
  });

  it('does not match reordered arrays', () => {
    expect(deepEqual([1, 2, 3], [3, 2, 1])).toBe(false);
  });
});

describe('deepEqualIgnoringOrder', () => {
  it('matches a flat array regardless of order', () => {
    expect(deepEqualIgnoringOrder([1, 2, 3], [3, 1, 2])).toBe(true);
  });

  it('matches nested arrays-of-arrays regardless of outer order (Permutations-shaped)', () => {
    const a = [
      [1, 2],
      [2, 1],
    ];
    const b = [
      [2, 1],
      [1, 2],
    ];
    expect(deepEqualIgnoringOrder(a, b)).toBe(true);
  });

  it('still catches a genuine mismatch', () => {
    expect(deepEqualIgnoringOrder([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('leaves scalar values compared normally', () => {
    expect(deepEqualIgnoringOrder(4, 4)).toBe(true);
    expect(deepEqualIgnoringOrder(4, 5)).toBe(false);
  });
});
