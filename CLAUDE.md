# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Principles

### 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Repository status

Backend (`/src`) and frontend (`/algolens-ui`) both implement 17 algorithms (see README.md): Binary Tree Level Order Traversal, Sliding Window Maximum, Largest Rectangle in Histogram, Number of Islands, Permutations, Combinations, Subsets, N-Queens, Letter Combinations of a Phone Number, Task Scheduler, Generate Parentheses, Remove Invalid Parentheses (BFS), Remove Invalid Parentheses (DFS/Backtracking), Longest Common Subsequence, Longest Palindromic Subsequence, Longest Increasing Subsequence, Edit Distance. Remove Invalid Parentheses is the only problem in the app with two entries — separate visualizers comparing two different solution strategies side by side.

**.NET note:** only the .NET 8 SDK is installed in this environment (no .NET 9), so all projects target `net8.0` rather than the `net9.0` originally planned. Bump to `net9.0` across the `.csproj` files if/when the .NET 9 SDK is installed.

**Windows note:** `dotnet run` (and `npm run dev`) spawn a child process; stopping the wrapping shell/background task does **not** reliably kill it. If a later `dotnet build`/`dotnet run` fails with "address already in use" or a file lock on `AlgoLens.Api.exe`, find and kill the stale process first: `Get-Process AlgoLens.Api,node | Stop-Process -Force` (PowerShell).

## Commands

Backend, from the repo root (`AlgoLens.sln`):

```
dotnet build AlgoLens.sln                                    # build everything
dotnet test AlgoLens.sln                                     # run all tests
dotnet test src/AlgoLens.Tests --filter FullyQualifiedName~BinaryTreeLevelOrderTraversalTests.Run_BalancedTree   # single test
dotnet run --project src/AlgoLens.Api                        # run the API on :5119 (Swagger UI in Development, at "/")
```

Frontend, from `/algolens-ui`:

```
npm install
npm run dev      # Vite dev server on :5173
npm run test     # Vitest (vitest run)
npm run build    # tsc -b && vite build — production build, fails on any TS error
```

Run both servers together for the app to actually work end-to-end — the frontend calls the API at `VITE_API_BASE_URL` (`.env.development`, default `http://localhost:5119`), and the API's CORS policy (`Program.cs`) only allows `http://localhost:5173`. If either origin/port changes, update both sides.

The API's AI-explanation feature calls OpenAI via the official `OpenAI` NuGet package, which reads the key from the `OPENAI_API_KEY` environment variable — no key is hardcoded anywhere. Without it set, the `/api/algorithms/...` endpoints still return full step/state data; `explanation` fields are simply `null` (see Resilience below).

## Architecture

* **`AlgoLens.Core`** (class library, no I/O, no AI dependency) — pure algorithm implementations. The central abstraction is the step-capture model in `Models/AlgorithmStep.cs`:
  - `AlgorithmStep(StepNumber, Action, State, Highlights)` — `Action` is a short mechanical description of what happened; `State` is an algorithm-specific snapshot; `Highlights` names the elements touched that step (semantics vary per algorithm — see below).
  - `IAlgorithmVisualizer<TInput>` (`Id` + `Run(TInput) -> IReadOnlyList<AlgorithmStep>`) is the contract every algorithm implements. All 17 follow the same shape — a dedicated `*State` record in `Models/` plus one class in `Algorithms/`:
    - `BinaryTreeLevelOrderTraversal` (`TreeTraversalState`) — one step per node dequeue. `Highlights` = touched node **values**.
    - `SlidingWindowMaximum` (`SlidingWindowInput`/`SlidingWindowState`) — one step per array index, using a `LinkedList<int>` of indices as an O(1)-both-ends deque. `Highlights` = touched **values**.
    - `LargestRectangleInHistogram` (`HistogramState`) — one step per index from `0` to `n` inclusive (a sentinel height-`0` bar at `i == n` flushes the stack, which also handles empty input with no special-case code). `Highlights` = touched bar **indices**, not values.
    - `NumberOfIslands` (`IslandsState`) — row-major scan + BFS flood fill (`Queue<(int,int)>`), one step per newly-found island plus one per BFS cell visited. `Highlights` = `["row,col"]`.
    - `Permutations`/`Combinations`/`Subsets` (all share `BacktrackingState(Path, Solutions)`) — classic choose → recurse → undo backtracking, capturing one step on each choose, one on each undo, and one whenever a full solution is recorded. `Combinations` additionally takes `CombinationsInput(N, K)`. `Subsets` records **every** node visited as a solution, not just size-`k` leaves — that's the only difference in shape from the other two.
    - `NQueens` (`NQueensState`) — row-by-row column placement with an `IsSafe` check (column + both diagonals); its board-shaped state doesn't fit `BacktrackingState`, so it gets its own model, same reasoning as `IslandsState` not reusing the tree's.
    - `LetterCombinationsOfPhoneNumber` and `GenerateParentheses` (both share `StringBacktrackingState(Path, Solutions)`) — same choose/undo backtracking shape as the int-based trio above, but over a `string` path/`IReadOnlyList<string>` solutions, so they don't reuse `BacktrackingState`. `LetterCombinationsOfPhoneNumber` recurses over the phone-keypad digit→letters mapping (invalid digits, i.e. not `2`-`9`, and empty input both return a single explanatory step rather than throwing); `GenerateParentheses` recurses on an open/close count pair, choosing `(` while `open < n` and `)` while `close < open`.
    - `TaskSchedulerAlgorithm` (`TaskSchedulerState`) — greedy tick-by-tick simulation, not backtracking: at each CPU time unit it runs the ready (not-on-cooldown) task with the highest remaining count, ties broken alphabetically, idling if nothing's ready. One step per tick. Class is named `TaskSchedulerAlgorithm`, not `TaskScheduler`, to avoid colliding with the BCL's `System.Threading.Tasks.TaskScheduler` — both `AlgoLens.Core` and `AlgoLens.Api` implicitly global-`using System.Threading.Tasks` (`ImplicitUsings`), so a bare `TaskScheduler` class name is ambiguous at every call site.
    - `RemoveInvalidParenthesesBfs` (`RemoveInvalidParenthesesBfsState`) and `RemoveInvalidParenthesesDfs` (`RemoveInvalidParenthesesDfsState`) — two independent visualizers for the same problem. The BFS one removes one character at a time level-by-level (`Frontier`/`Level`), stopping at the first level with any valid string — that's what guarantees a minimal answer. The DFS one first computes the exact number of `(`/`)` that must be removed in a single linear pass (`CountRemovals`), then backtracks index-by-index trying both "remove" and "keep" (pruning a `)` keep unless it wouldn't yet unbalance the prefix), only accepting leaves that spend the whole budget exactly.
    - `LongestCommonSubsequence` (`LongestCommonSubsequenceInput`/`LongestCommonSubsequenceState`) — bottom-up 2D DP over two strings, one step per table cell filled, then a traceback phase (from the bottom-right corner back to a `0` boundary) that recovers the actual subsequence, not just its length; `State.Subsequence` is empty during the fill phase and grows during traceback.
    - `LongestPalindromicSubsequence` (`LongestPalindromicSubsequenceState`) — interval DP over a single string: `dp[i][j]` is the LPS length within `s[i..j]`, filled by increasing substring length since each cell depends on the strictly-shorter interval `dp[i+1][j-1]`. Only the upper triangle (`row <= col`) is ever written; lower-triangle cells stay at their C# default of `0`, which the length-2 base case relies on instead of special-casing it.
    - `LongestIncreasingSubsequence` (`LongestIncreasingSubsequenceState`) — `O(n²)` 2D DP over `(index, previousIndex)` state rather than the more common flat 1D `dp[i]` formulation: `Table[i][j]` is the LIS length achievable from `nums[i..]` given the previously included element sits at index `j - 1` (`j == 0` means nothing picked yet). At each `i`, skip (`Table[i+1][j]`) or, only when `j == 0 || nums[i] > nums[j-1]`, take and extend with `Table[i+1][i+1]` (the new previous index becomes `i`). Filled bottom-up over `i` from `n` down to `0` since row `i` depends on row `i+1`; row `n` is the implicit all-zero boundary, never explicitly stepped through (same trick `LongestPalindromicSubsequence` uses for its unset lower triangle). Only the triangular region `j <= i` is ever computed. The answer is `Table[0][0]`, not a max over anything, since column `0` already represents "no previous constraint yet." Deliberately not the `O(n log n)` patience-sorting variant, nor the simpler flat 1D `dp[i]` version, since the point of this entry is demonstrating the 2D index+previous-index DP shape.
    - `EditDistance` (`EditDistanceInput`/`EditDistanceState`) — bottom-up 2D DP over two strings, same table shape as `LongestCommonSubsequence` but with a different recurrence: `dp[i][j]` is the minimum insert/delete/replace operations to turn `word1[..i]` into `word2[..j]`. Unlike LCS's zero boundaries, row `0` and column `0` here are `i` and `j` respectively (all-deletions / all-insertions), so they're filled by two explicit base-case loops before the main fill rather than left to C#'s default zero-initialization. On a character match the cell just inherits the diagonal predecessor; otherwise it's `1 + min(diagonal, above, left)` (replace, delete, insert). No special-case branch for empty input — an empty `word1` or `word2` just means one of the two base-case loops does all the work, the same "let the general case absorb the edge case" trick `LargestRectangleInHistogram` uses.
  - `Models/TreeNode.cs` has `FromLevelOrderArray(int?[])` to build a tree from the LeetCode-style array format used in API requests.
  - Every `steps.Add(new AlgorithmStep(...))` call site goes through `Algorithms/StepRecorder.cs`'s `StepRecorder.Add(steps, ref stepNumber, action, state, highlights, spanLines)` instead of constructing `AlgorithmStep` directly. It uses `[CallerLineNumber]` to auto-derive the two extra fields on `AlgorithmStep` — `SourceLineStart`/`SourceLineEnd` — as the `spanLines` source lines immediately above the call; this is what drives the frontend's `CodePanel` line-highlighting and stays correct even as unrelated lines shift elsewhere in the file (no hand-maintained line-number table). `AlgorithmSource.Get(Type)` reads an algorithm's own `.cs` file back out as text from an embedded resource (`Algorithms/*.cs` is `EmbeddedResource` in `AlgoLens.Core.csproj`, in addition to being compiled) for that same panel to display.
  - New algorithm checklist: `*Input`/`*State` record(s) in `Models/` (reuse `BacktrackingState` for choose/undo backtracking producing int-list solutions, or `StringBacktrackingState` for string-list solutions), an `IAlgorithmVisualizer<TInput>` class in `Algorithms/` recording steps via `StepRecorder.Add(...)` (watch for BCL name collisions from implicit usings, as with `TaskSchedulerAlgorithm` above), a request DTO in `AlgoLens.Api/Contracts/`, one `MapAlgorithm<...>(...)` call in `AlgorithmEndpoints.cs` (this also wires up that algorithm's `GET .../source` route for free) with a `judge: new JudgeConfig<TInput>(...)` argument (wires up `POST .../submit` for the "Try Your Own Solution" feature — see below), one `AddScoped<...>()` in `Program.cs`, a test file in `AlgoLens.Tests/`, and on the frontend one registry entry (with `pattern`/`hints`/`relatedProblems`/`judgeSignature` — shown below the animation) + `InputForm` (+ `StateView`, unless it can reuse `BacktrackingStateView`/`StringBacktrackingStateView`).

* **`AlgoLens.Api`** (ASP.NET Core, minimal APIs — no controllers) — thin HTTP layer over Core:
  - `Endpoints/AlgorithmEndpoints.cs` has one **generic** `MapAlgorithm<TAlgorithm, TRequest, TInput>(app, route, toAlgorithmInput, judge)` helper (parse → `algorithm.Run(...)` → `IStepExplanationService.ExplainStepsAsync(...)` → zip into `StepDto`s → `Results.Ok`), called once per algorithm/route. Don't hand-roll this logic again for a new algorithm, just add another `MapAlgorithm<...>(...)` call.
  - `Services/OpenAiStepExplanationService.cs` is the only place that talks to OpenAI. It sends the whole step sequence in **one** request per API call (not one call per step) and uses **structured output** (`ChatCompletionOptions.ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(...)`, strict, with a `{ explanations: string[] }` schema) rather than tool-use forcing, so the response is guaranteed-parseable. Model is `gpt-4o-mini` (a deliberate cost/latency choice for this low-complexity generation task — change the `OpenAiModel` constant in `Program.cs` if a different model is wanted). `MaxOutputTokenCount = 4096`.
  - **Resilience boundary:** `OpenAiStepExplanationService` catches all failures (missing/invalid API key, network, parse errors) and degrades to a `null`-per-step explanation list rather than failing the request — this is a deliberate design choice, not an oversight, so the algorithm/visualization half of the API works without any AI configuration. `Program.cs` registers the `ChatClient` with a placeholder key (`"missing-openai-api-key"`) when `OPENAI_API_KEY` isn't set, rather than throwing at startup, so this resilience holds even with zero configuration — the resulting auth failure surfaces at request time, inside the same try/catch.
  - `Services/UserSolutionJudge.cs` (`IUserSolutionJudge`/`RoslynUserSolutionJudge`) powers "Try Your Own Solution": compiles + runs user-submitted C# in-process via Roslyn scripting (`Microsoft.CodeAnalysis.CSharp.Scripting`), appending a generated call (e.g. `Solve((int[])Args["nums"])`) to the user's pasted code, with the real input values injected via a generic `Args` dictionary (one `JudgeGlobals` type for every algorithm, instead of a bespoke globals class each). The `timeout` is enforced by racing the run against `Task.Delay` — **not a sandbox**: no process isolation, and a synchronous infinite loop keeps a thread-pool thread busy in the background even after the HTTP caller gets a prompt timeout response (see the class doc comment and README's Pending Enhancements). Each `MapAlgorithm<...>(...)` call's `JudgeConfig<TInput>` supplies `BuildArgs` (input → `Args` dict), `InvocationExpression` (must match the registry's `judgeSignature` cast-for-cast), and `ExtractExpectedAnswer` (reads the canonical answer off the last step's concrete `*State`, e.g. `BacktrackingState.Solutions` or `LongestIncreasingSubsequenceState.Table[0][0]`) — the frontend does the actual answer comparison (exact + order-insensitive), so this stays comparison-logic-free.
  - Routes: `POST /api/algorithms/{binary-tree-level-order-traversal,sliding-window-maximum,largest-rectangle-in-histogram,number-of-islands,permutations,combinations,subsets,n-queens,letter-combinations-of-a-phone-number,task-scheduler,generate-parentheses,remove-invalid-parentheses-bfs,remove-invalid-parentheses-dfs,longest-common-subsequence,longest-palindromic-subsequence,longest-increasing-subsequence,edit-distance}`, plus a `GET .../source` sibling of each (raw `.cs` text, for the frontend's `CodePanel`), plus a `POST .../submit` sibling of each (runs a user-submitted solution via `IUserSolutionJudge`, for the code panel's "Try Your Own Solution" editor), plus `POST /api/algorithms/{algorithmId}/explain` (regenerate a single step's AI explanation on demand).

* **`AlgoLens.Tests`** (xUnit + FluentAssertions) tests `AlgoLens.Core` directly — no HTTP, no AI — one file per algorithm, each asserting the *final* step's state against a known-correct canonical example plus edge cases (empty input; for N-Queens, the classic no-solution board sizes 2 and 3). It also references `AlgoLens.Api` (the only exception to "no HTTP layer in tests") solely to exercise `RoslynUserSolutionJudge` directly — no HTTP — covering a correct solution, a compile error, a thrown exception, and an infinite-loop timeout (passing a short `TimeSpan` explicitly so that last one stays fast).

* **`algolens-ui`** (React + TypeScript + Vite, Tailwind CSS v4 via `@tailwindcss/vite`) — mirrors the backend's per-algorithm extensibility pattern on the frontend:
  - `types/algorithm.ts` mirrors the API's camelCase JSON DTOs (`Step`, `AlgorithmRunResponse`) plus the two prop shapes every per-algorithm component must implement (`AlgorithmInputFormProps`, `AlgorithmStateViewProps`).
  - `algorithms/registry.ts` is the single extensibility point: an `AlgorithmDefinition[]` of `{ id, name, description, category, pattern, hints, relatedProblems, judgeSignature, InputForm, StateView }`, one entry per backend algorithm. Each has its own `algorithms/<name>/` folder with an `InputForm` (parses user text/number/textarea input into the algorithm's JSON body shape, client-side validated). Adding another algorithm means adding one more folder + registry entry — nothing else changes. `category` (e.g. `"Backtracking"`) drives the grouping on the home page; there's no separate category registry, it's just a string field on each entry. `pattern`/`hints`/`relatedProblems` feed `AlgorithmInfoPanel` (below).
  - `components/StepPlayer.tsx` is the **generic, reused-as-is** player: owns current-step index + play/pause/prev/next/slider, renders `step.action` and `step.explanation` (with a fallback when `null`), and calls a `renderState(step)` render-prop for the algorithm-specific visualization plus an optional `renderCode(step)` render-prop (rendered as a second column, top-aligned with the controls) for `CodePanel`.
  - `components/BacktrackingStateView.tsx` and `components/StringBacktrackingStateView.tsx` are shared, reused-as-is views (alongside `StepPlayer`): since Permutations/Combinations/Subsets all produce the identical `{ path, solutions }` (int-based) state shape, they use `BacktrackingStateView` directly as their `StateView` instead of each defining their own; Letter Combinations of a Phone Number and Generate Parentheses do the same via `StringBacktrackingStateView` for the `string`-based equivalent. N-Queens' board-shaped state and Task Scheduler's timeline/cooldown state don't fit either shape, so they get their own `NQueensStateView`/`TaskSchedulerStateView`; same for the two Remove Invalid Parentheses variants (`RemoveInvalidParenthesesBfsStateView`/`RemoveInvalidParenthesesDfsStateView`), which do however share one `RemoveInvalidParenthesesInputForm` between their two registry entries — nothing stops two entries from pointing at the same `InputForm`/`StateView` component when the shapes genuinely match, same principle as the shared state views, just applied across two entries instead of within one. The four DP algorithms' 2D-table state shapes (LCS, LPS, LIS, and now Edit Distance too) don't fit any existing view either, so they each get their own `LongestCommonSubsequenceStateView`/`LongestPalindromicSubsequenceStateView`/`LongestIncreasingSubsequenceStateView`/`EditDistanceStateView`, rendering the `table` as a grid of cells with the current cell highlighted — the same `flex`-grid-of-`<span>`s pattern `IslandsStateView`/`NQueensStateView` already established for grid-shaped state. `LongestIncreasingSubsequenceStateView` follows `LongestPalindromicSubsequenceStateView`'s triangular-table convention (an `unused` prop grays out cells outside the valid region) rather than `LongestCommonSubsequenceStateView`'s fully-populated rectangle, since only `j <= i` cells are ever computed; `EditDistanceStateView` uses the fully-populated-rectangle convention instead (like LCS), since every cell of its table is a valid, computed state.
  - `components/CodePanel.tsx` shows the algorithm's real C# source (fetched once per algorithm via `api/client.ts`'s `getAlgorithmSource(id)`, syntax-highlighted with `react-syntax-highlighter`) with the current step's line range highlighted and auto-scrolled into view. `stripStepRecorderCalls.ts` strips the `StepRecorder.Add(...)` instrumentation calls out of the displayed text (balanced-paren scanning) and remaps the API's `sourceLineStart`/`sourceLineEnd` (which reference the original, unstripped file) onto the resulting line numbers, so what's shown reads as plain algorithm code.
  - `components/AlgorithmInfoPanel.tsx` renders a registry entry's `pattern` (badge), `hints` (revealed one at a time via a "Show next hint" button, so they don't spoil), and `relatedProblems` (name + one-line connection) below the animation.
  - `pages/AlgorithmPage.tsx` wires a registry entry's `InputForm` → `api/client.ts`'s `runAlgorithm(id, body)` → `StepPlayer` (with that entry's `StateView` and a `CodePanel`-backed `renderCode`, the latter also given `algorithmId`/`judgeSignature`/the last-run `input`) → `AlgorithmInfoPanel`. `pages/HomePage.tsx` groups `algorithms` by `category` (group order = first-appearance order in the registry array) and renders each group as a responsive card grid (1 col on mobile up to 4 on wide screens).
  - `components/CodePanel.tsx` owns a `mode: 'source' | 'try'` toggle: a "Try your own solution" button in its header (shown whenever `algorithmId`/`judgeSignature` are passed in) swaps the read-only highlighted source for `components/TrySolutionPanel.tsx` rendered in the same bordered box, and "← View source" swaps back — so trying your own code replaces the shown source rather than living in a separate section of the page. `TrySolutionPanel` itself is just the editor content (no outer card/heading of its own, since `CodePanel` supplies that chrome): a code `<textarea>` pre-filled from the registry's `judgeSignature`, a "Run My Code" button (disabled until the user has run the canonical algorithm at least once this page-visit, so it can reuse that same input via `api/client.ts`'s `submitSolution(id, input, code)`), and a result view (compile errors / runtime error / side-by-side "your output" vs "expected output" JSON with match badges). `utils/compareAnswers.ts`'s `deepEqual`/`deepEqualIgnoringOrder` are the one generic comparer reused for every algorithm — order-independent problems like Permutations compare their `solutions` arrays by canonical-sorted JSON rather than needing 17 bespoke comparisons.
  - `components/StepPlayer.test.tsx` (Vitest + React Testing Library) is the one test file in place, covering step navigation, the null-explanation fallback, and the two-column layout when `renderCode` is supplied.

CI/CD (GitHub Actions) has not been set up yet.
