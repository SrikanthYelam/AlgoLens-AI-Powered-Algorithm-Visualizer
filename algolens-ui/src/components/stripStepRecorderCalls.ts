/**
 * The backend's real .cs source includes `StepRecorder.Add(...)` calls — the
 * instrumentation that captures each step for this visualizer. Those calls are noise
 * for someone reading "what does this algorithm actually do", so this strips them out
 * of the *displayed* code and remaps each step's highlighted line range (which refers
 * to line numbers in the original, unstripped file) onto the resulting line numbers.
 *
 * Call sites are found by balanced-paren scanning from `StepRecorder.Add(` to its
 * closing `)`. The scan is string-literal-aware: characters inside a string's literal
 * text (e.g. the lone, unmatched `(` in Generate Parentheses' `"Choose '('; ..."`
 * action text) are never counted as real parens. Characters inside an interpolated
 * string's `{expr}` hole ARE real code again (so `{string.Join(", ", path)}`'s parens
 * and nested string still parse correctly) — a hole simply doesn't affect the outer
 * call's paren depth, since the whole `$"..."` argument is one opaque unit from the
 * outer call's perspective.
 */
type ScanFrame = { kind: 'code' } | { kind: 'string'; interpolated: boolean };

function findStepRecorderCallEnd(lines: string[], startLine: number): number {
  const stack: ScanFrame[] = [{ kind: 'code' }];
  let depth = 0;
  let started = false;

  for (let lineIndex = startLine; lineIndex < lines.length; lineIndex++) {
    const text = lines[lineIndex];
    for (let c = 0; c < text.length; c++) {
      const ch = text[c];
      const top = stack[stack.length - 1];

      if (top.kind === 'code') {
        if (stack.length === 1) {
          if (ch === '(') {
            depth++;
            started = true;
          } else if (ch === ')') {
            depth--;
            if (started && depth === 0) {
              return lineIndex;
            }
          } else if (ch === '"') {
            stack.push({ kind: 'string', interpolated: c > 0 && text[c - 1] === '$' });
          }
        } else if (ch === '"') {
          stack.push({ kind: 'string', interpolated: c > 0 && text[c - 1] === '$' });
        } else if (ch === '}') {
          stack.pop();
        }
      } else {
        if (ch === '\\') {
          c++; // skip the escaped character
        } else if (ch === '"') {
          stack.pop();
        } else if (top.interpolated && ch === '{') {
          if (text[c + 1] === '{') {
            c++; // literal `{{` escape, stays in string text
          } else {
            stack.push({ kind: 'code' }); // enters an interpolation hole
          }
        } else if (top.interpolated && ch === '}' && text[c + 1] === '}') {
          c++; // literal `}}` escape
        }
      }
    }
  }

  return lines.length - 1;
}

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

    const end = findStepRecorderCallEnd(lines, i);
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
