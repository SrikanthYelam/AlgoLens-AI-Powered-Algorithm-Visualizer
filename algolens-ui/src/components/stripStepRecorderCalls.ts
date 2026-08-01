/**
 * The backend's real .cs source includes `StepRecorder.Add(...)` calls — the
 * instrumentation that captures each step for this visualizer. Those calls are noise
 * for someone reading "what does this algorithm actually do", so this strips them out
 * of the *displayed* code and remaps each step's highlighted line range (which refers
 * to line numbers in the original, unstripped file) onto the resulting line numbers.
 *
 * Call sites are found by balanced-paren scanning from `StepRecorder.Add(` to its
 * closing `)`, which is safe here because the source is our own generated algorithm
 * code with no unbalanced parens hiding inside string literals.
 */
export function stripStepRecorderCalls(source: string): {
  displaySource: string;
  mapLine: (originalLine: number) => number;
} {
  const lines = source.split('\n');
  const keep = new Array<boolean>(lines.length + 1).fill(true); // 1-indexed

  for (let i = 0; i < lines.length; i++) {
    if (!/StepRecorder\.Add\(/.test(lines[i])) {
      continue;
    }

    let depth = 0;
    let started = false;
    let end = i;
    for (; end < lines.length; end++) {
      for (const ch of lines[end]) {
        if (ch === '(') {
          depth++;
          started = true;
        } else if (ch === ')') {
          depth--;
        }
      }
      if (started && depth === 0) {
        break;
      }
    }

    for (let k = i; k <= end; k++) {
      keep[k + 1] = false;
    }
    i = end;
  }

  const displayLines: string[] = [];
  const originalToDisplay = new Array<number>(lines.length + 1).fill(0);
  for (let ln = 1; ln <= lines.length; ln++) {
    if (keep[ln]) {
      displayLines.push(lines[ln - 1]);
      originalToDisplay[ln] = displayLines.length;
    }
  }

  let lastKnown = 1;
  for (let ln = 1; ln <= lines.length; ln++) {
    if (originalToDisplay[ln] > 0) {
      lastKnown = originalToDisplay[ln];
    } else {
      originalToDisplay[ln] = lastKnown;
    }
  }

  return {
    displaySource: displayLines.join('\n'),
    mapLine: (originalLine: number) => originalToDisplay[originalLine] ?? lastKnown,
  };
}
