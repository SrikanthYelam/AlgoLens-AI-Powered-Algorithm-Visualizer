import { describe, expect, it } from 'vitest';
import { examples } from './examples';
import { algorithms } from './registry';

describe('algorithm examples', () => {
  it('has at least one example for every registered algorithm', () => {
    const missing = algorithms.filter((a) => (examples[a.id] ?? []).length === 0).map((a) => a.id);

    expect(missing).toEqual([]);
  });

  it('has no examples for an id that is not registered', () => {
    const registered = new Set(algorithms.map((a) => a.id));
    const orphaned = Object.keys(examples).filter((id) => !registered.has(id));

    expect(orphaned).toEqual([]);
  });

  it('gives each algorithm uniquely labelled examples', () => {
    for (const [id, list] of Object.entries(examples)) {
      const labels = list.map((e) => e.label);
      expect(new Set(labels).size, `duplicate example label in ${id}`).toBe(labels.length);
    }
  });
});
