import { useEffect, useMemo, useRef, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { stripStepRecorderCalls } from './stripStepRecorderCalls';
import { TrySolutionPanel } from './TrySolutionPanel';

SyntaxHighlighter.registerLanguage('csharp', csharp);

interface CodePanelProps {
  source: string;
  highlightStart: number;
  highlightEnd: number;
  /** When set (with judgeSignature), a "Try your own solution" button swaps this panel into an editor. */
  algorithmId?: string;
  judgeSignature?: string;
  /** The input the canonical algorithm was last run with, passed through to the judge on run. */
  input?: unknown;
}

const HIGHLIGHT_ID = 'code-panel-highlight';

// The one third-party palette left: oneDark's token colors. Its comment gray is below AA on the
// dark surface, so comments (and their aliases) are lifted to the ink-subtle token.
const mutedComment = { ...oneDark.comment, color: 'var(--color-ink-subtle)' };
const CODE_THEME = { ...oneDark, comment: mutedComment, prolog: mutedComment, doctype: mutedComment, cdata: mutedComment };

// The current step's lines get a lavender wash plus a solid left bar, so the highlight reads
// without relying on the tint alone.
function lineProps(lineNumber: number, highlightStart: number, highlightEnd: number) {
  const isHighlighted = lineNumber >= highlightStart && lineNumber <= highlightEnd;
  return {
    id: isHighlighted ? HIGHLIGHT_ID : undefined,
    style: {
      display: 'block',
      backgroundColor: isHighlighted ? 'color-mix(in srgb, var(--color-accent) 28%, transparent)' : 'transparent',
      boxShadow: isHighlighted ? 'inset 2px 0 0 var(--color-accent-hover)' : undefined,
      transition: 'background-color 200ms ease',
    },
  };
}

/** Displays an algorithm's C# source with the current step's line(s) highlighted. */
export function CodePanel({ source, highlightStart, highlightEnd, algorithmId, judgeSignature, input }: CodePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState<'source' | 'try'>('source');
  // Off by default: auto-scrolling this panel's own container to follow the highlighted line,
  // even though it never touches window scroll, still reads as "the page moving" while stepping
  // through — opt-in for anyone who wants the code to track the current line automatically.
  const [followLine, setFollowLine] = useState(false);
  // Mirrors the API, where /submit is only mapped in Development or with ENABLE_SUBMIT=true.
  const submitEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_SUBMIT === 'true';
  const canTryOwnSolution = submitEnabled && algorithmId !== undefined && judgeSignature !== undefined;

  // Switching algorithms keeps this component mounted (same position in the tree across route
  // param changes), so drop back to the source view rather than leaving a stale editor showing.
  useEffect(() => {
    setMode('source');
  }, [algorithmId]);

  const { displaySource, mapLine } = useMemo(() => stripStepRecorderCalls(source), [source]);
  const displayStart = mapLine(highlightStart);
  const displayEnd = mapLine(highlightEnd);

  useEffect(() => {
    if (!followLine) {
      return;
    }
    const container = containerRef.current;
    const target = container?.querySelector(`#${HIGHLIGHT_ID}`);
    if (!container || !target) {
      return;
    }
    // Deliberately not element.scrollIntoView(): it walks every scrollable ancestor, including
    // the page itself, so it would yank the whole page down on each step. Scrolling only this
    // container's scrollTop keeps the jump contained to the code panel.
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const margin = 24; // keep the highlighted line a bit clear of the container edge
    const above = targetRect.top - containerRect.top;
    const below = targetRect.bottom - containerRect.bottom;
    let offset = 0;
    if (above < margin) {
      offset = above - margin;
    } else if (below > -margin) {
      offset = below + margin;
    }
    if (offset === 0) {
      return; // already visible — don't scroll at all
    }
    container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
  }, [displayStart, displayEnd, followLine]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(displaySource);
    } catch (e) {
      // ignore
    }
  }

  const inner = (
    <div className="bg-surface-1">
      <SyntaxHighlighter
        language="csharp"
        style={CODE_THEME}
        showLineNumbers
        wrapLines
        lineProps={(n) => lineProps(n, displayStart, displayEnd)}
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {displaySource}
      </SyntaxHighlighter>
    </div>
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-end gap-2">
        {mode === 'source' ? (
          <>
            <button
              type="button"
              onClick={() => setFollowLine((f) => !f)}
              aria-pressed={followLine}
              className={`btn btn-sm ${followLine ? 'border-accent bg-surface-2 text-ink hover:bg-surface-3' : 'btn-secondary'}`}
            >
              Follow current line
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="btn btn-secondary btn-sm"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="btn btn-secondary btn-sm"
            >
              Fullscreen
            </button>
            {canTryOwnSolution && (
              <button
                type="button"
                onClick={() => setMode('try')}
                className="btn btn-primary btn-sm"
              >
                Try your own solution
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setMode('source')}
            className="btn btn-secondary btn-sm"
          >
            ← View source
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="max-h-128 overflow-auto rounded-lg border border-hairline bg-surface-1 text-code"
      >
        {mode === 'source' ? (
          inner
        ) : (
          <TrySolutionPanel algorithmId={algorithmId!} judgeSignature={judgeSignature!} input={input ?? null} />
        )}
      </div>

      {isFullscreen && mode === 'source' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-canvas">
          <div className="flex items-center justify-between border-b border-hairline p-3">
            <div className="text-body-sm font-medium text-ink">Source</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="btn btn-secondary btn-sm"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-4 overflow-auto">{inner}</div>
        </div>
      )}
    </div>
  );
}
