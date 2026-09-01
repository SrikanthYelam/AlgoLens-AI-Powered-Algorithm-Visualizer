import { useEffect, useMemo, useRef, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

function lineProps(
  lineNumber: number,
  highlightStart: number,
  highlightEnd: number,
  highlightColor: string,
  highlightId: string,
) {
  const isHighlighted = lineNumber >= highlightStart && lineNumber <= highlightEnd;
  return {
    id: isHighlighted ? highlightId : undefined,
    style: {
      display: 'block',
      backgroundColor: isHighlighted ? highlightColor : 'transparent',
      transition: 'background-color 200ms ease',
    },
  };
}

/** Displays an algorithm's C# source with the current step's line(s) highlighted. */
export function CodePanel({ source, highlightStart, highlightEnd, algorithmId, judgeSignature, input }: CodePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState<'source' | 'try'>('source');
  const canTryOwnSolution = algorithmId !== undefined && judgeSignature !== undefined;

  // Switching algorithms keeps this component mounted (same position in the tree across route
  // param changes), so drop back to the source view rather than leaving a stale editor showing.
  useEffect(() => {
    setMode('source');
  }, [algorithmId]);

  const { displaySource, mapLine } = useMemo(() => stripStepRecorderCalls(source), [source]);
  const displayStart = mapLine(highlightStart);
  const displayEnd = mapLine(highlightEnd);

  useEffect(() => {
    // Both the light and dark instances render in the DOM (only one is visually shown, via the
    // `dark` class on <html>), so scroll whichever one is actually visible.
    const isDark = document.documentElement.classList.contains('dark');
    const id = isDark ? 'code-panel-highlight-dark' : 'code-panel-highlight-light';
    const container = containerRef.current;
    const target = container?.querySelector(`#${id}`);
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
  }, [displayStart, displayEnd]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(displaySource);
    } catch (e) {
      // ignore
    }
  }

  const lightHighlight = 'rgba(99, 102, 241, 0.18)';
  const darkHighlight = 'rgba(99, 102, 241, 0.6)'; // stronger contrast in dark mode

  const inner = (
    <div>
      <div className="bg-white dark:hidden">
        <SyntaxHighlighter
          language="csharp"
          style={oneLight}
          showLineNumbers
          wrapLines
          lineProps={(n) => lineProps(n, displayStart, displayEnd, lightHighlight, 'code-panel-highlight-light')}
          customStyle={{ margin: 0, background: 'transparent' }}
        >
          {displaySource}
        </SyntaxHighlighter>
      </div>
      <div className="hidden dark:block dark:bg-gray-900">
        <SyntaxHighlighter
          language="csharp"
          style={oneDark}
          showLineNumbers
          wrapLines
          lineProps={(n) => lineProps(n, displayStart, displayEnd, darkHighlight, 'code-panel-highlight-dark')}
          customStyle={{ margin: 0, background: 'transparent' }}
        >
          {displaySource}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-2">
        {mode === 'source' ? (
          <>
            <button
              type="button"
              onClick={copyToClipboard}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white dark:bg-gray-800"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white dark:bg-gray-800"
            >
              Fullscreen
            </button>
            {canTryOwnSolution && (
              <button
                type="button"
                onClick={() => setMode('try')}
                className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Try your own solution
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setMode('source')}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white dark:bg-gray-800"
          >
            ← View source
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 text-sm dark:border-gray-700"
      >
        {mode === 'source' ? (
          inner
        ) : (
          <TrySolutionPanel algorithmId={algorithmId!} judgeSignature={judgeSignature!} input={input ?? null} />
        )}
      </div>

      {isFullscreen && mode === 'source' && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
          <div className="p-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="text-sm font-medium">Source</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white dark:bg-gray-800"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm bg-white dark:bg-gray-800"
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
