import { useEffect, useMemo, useRef, useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { stripStepRecorderCalls } from './stripStepRecorderCalls';

SyntaxHighlighter.registerLanguage('csharp', csharp);

interface CodePanelProps {
  source: string;
  highlightStart: number;
  highlightEnd: number;
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
      backgroundColor: isHighlighted ? highlightColor : undefined,
    },
  };
}

/** Displays an algorithm's C# source with the current step's line(s) highlighted. */
export function CodePanel({ source, highlightStart, highlightEnd }: CodePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { displaySource, mapLine } = useMemo(() => stripStepRecorderCalls(source), [source]);
  const displayStart = mapLine(highlightStart);
  const displayEnd = mapLine(highlightEnd);

  useEffect(() => {
    // Both the light and dark instances render in the DOM (only one is visually shown, via
    // Tailwind's `dark:` media-query classes), so scroll whichever one matches the OS theme.
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const id = isDark ? 'code-panel-highlight-dark' : 'code-panel-highlight-light';
    containerRef.current?.querySelector(`#${id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
      </div>

      <div
        ref={containerRef}
        className="max-h-[32rem] overflow-auto rounded-md border border-gray-200 text-sm dark:border-gray-700"
      >
        {inner}
      </div>

      {isFullscreen && (
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
