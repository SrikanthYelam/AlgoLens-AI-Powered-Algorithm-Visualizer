# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

Backend (`/src`) and frontend (`/algolens-ui`) both implement 9 algorithms (see README.md): Binary Tree Level Order Traversal, Sliding Window Maximum, Largest Rectangle in Histogram, Number of Islands, Permutations, Combinations, Subsets, N-Queens, Letter Combinations of a Phone Number.

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

The API's AI-explanation feature calls Claude via the official `Anthropic` NuGet package, which reads the key from the `ANTHROPIC_API_KEY` environment variable — no key is hardcoded anywhere. Without it set, the `/api/algorithms/...` endpoints still return full step/state data; `explanation` fields are simply `null` (see Resilience below).

## Architecture

* **`AlgoLens.Core`** (class library, no I/O, no AI dependency) — pure algorithm implementations. The central abstraction is the step-capture model in `Models/AlgorithmStep.cs`:
  - `AlgorithmStep(StepNumber, Action, State, Highlights)` — `Action` is a short mechanical description of what happened; `State` is an algorithm-specific snapshot; `Highlights` names the elements touched that step (semantics vary per algorithm — see below).
  - `IAlgorithmVisualizer<TInput>` (`Id` + `Run(TInput) -> IReadOnlyList<AlgorithmStep>`) is the contract every algorithm implements. All 9 follow the same shape — a dedicated `*State` record in `Models/` plus one class in `Algorithms/`:
    - `BinaryTreeLevelOrderTraversal` (`TreeTraversalState`) — one step per node dequeue. `Highlights` = touched node **values**.
    - `SlidingWindowMaximum` (`SlidingWindowInput`/`SlidingWindowState`) — one step per array index, using a `LinkedList<int>` of indices as an O(1)-both-ends deque. `Highlights` = touched **values**.
    - `LargestRectangleInHistogram` (`HistogramState`) — one step per index from `0` to `n` inclusive (a sentinel height-`0` bar at `i == n` flushes the stack, which also handles empty input with no special-case code). `Highlights` = touched bar **indices**, not values.
    - `NumberOfIslands` (`IslandsState`) — row-major scan + BFS flood fill (`Queue<(int,int)>`), one step per newly-found island plus one per BFS cell visited. `Highlights` = `["row,col"]`.
    - `Permutations`/`Combinations`/`Subsets` (all share `BacktrackingState(Path, Solutions)`) — classic choose → recurse → undo backtracking, capturing one step on each choose, one on each undo, and one whenever a full solution is recorded. `Combinations` additionally takes `CombinationsInput(N, K)`. `Subsets` records **every** node visited as a solution, not just size-`k` leaves — that's the only difference in shape from the other two.
    - `NQueens` (`NQueensState`) — row-by-row column placement with an `IsSafe` check (column + both diagonals); its board-shaped state doesn't fit `BacktrackingState`, so it gets its own model, same reasoning as `IslandsState` not reusing the tree's.
    - `LetterCombinationsOfPhoneNumber` (`LetterCombinationsState(Path, Solutions)`) — same choose/undo backtracking shape as the trio above, but over a `string` path/`IReadOnlyList<string>` solutions instead of ints (phone-keypad digit→letters), so it doesn't reuse `BacktrackingState` either. Invalid digits (not `2`-`9`) and empty input both return a single explanatory step rather than throwing.
  - `Models/TreeNode.cs` has `FromLevelOrderArray(int?[])` to build a tree from the LeetCode-style array format used in API requests.
  - New algorithm checklist: `*Input`/`*State` record(s) in `Models/` (reuse `BacktrackingState` if it's a choose/undo backtracking algorithm producing int-list solutions), an `IAlgorithmVisualizer<TInput>` class in `Algorithms/`, a request DTO in `AlgoLens.Api/Contracts/`, one `MapAlgorithm<...>(...)` call in `AlgorithmEndpoints.cs`, one `AddScoped<...>()` in `Program.cs`, a test file in `AlgoLens.Tests/`, and on the frontend one registry entry + `InputForm` (+ `StateView`, unless it can reuse `BacktrackingStateView`).

* **`AlgoLens.Api`** (ASP.NET Core, minimal APIs — no controllers) — thin HTTP layer over Core:
  - `Endpoints/AlgorithmEndpoints.cs` has one **generic** `MapAlgorithm<TAlgorithm, TRequest, TInput>(app, route, toAlgorithmInput)` helper (parse → `algorithm.Run(...)` → `IStepExplanationService.ExplainStepsAsync(...)` → zip into `StepDto`s → `Results.Ok`), called once per algorithm/route. Don't hand-roll this logic again for a new algorithm, just add another `MapAlgorithm<...>(...)` call.
  - `Services/ClaudeStepExplanationService.cs` is the only place that talks to Claude. It sends the whole step sequence in **one** request per API call (not one call per step) and uses **structured output** (`OutputConfig.Format = JsonOutputFormat` with a `{ explanations: string[] }` schema) rather than tool-use forcing, so the response is guaranteed-parseable. Model is `claude-opus-5` (skill default — change only if a different model is explicitly requested). `MaxTokens = 4096`.
  - **Resilience boundary:** `ClaudeStepExplanationService` catches all failures (missing API key, network, parse errors) and degrades to a `null`-per-step explanation list rather than failing the request — this is a deliberate design choice, not an oversight, so the algorithm/visualization half of the API works without any AI configuration.
  - Routes: `POST /api/algorithms/{binary-tree-level-order-traversal,sliding-window-maximum,largest-rectangle-in-histogram,number-of-islands,permutations,combinations,subsets,n-queens,letter-combinations-of-a-phone-number}`.

* **`AlgoLens.Tests`** (xUnit + FluentAssertions) tests `AlgoLens.Core` directly — no HTTP, no AI — one file per algorithm, each asserting the *final* step's state against a known-correct canonical example plus edge cases (empty input; for N-Queens, the classic no-solution board sizes 2 and 3).

* **`algolens-ui`** (React + TypeScript + Vite, Tailwind CSS v4 via `@tailwindcss/vite`) — mirrors the backend's per-algorithm extensibility pattern on the frontend:
  - `types/algorithm.ts` mirrors the API's camelCase JSON DTOs (`Step`, `AlgorithmRunResponse`) plus the two prop shapes every per-algorithm component must implement (`AlgorithmInputFormProps`, `AlgorithmStateViewProps`).
  - `algorithms/registry.ts` is the single extensibility point: an `AlgorithmDefinition[]` of `{ id, name, description, category, InputForm, StateView }`, one entry per backend algorithm. Each has its own `algorithms/<name>/` folder with an `InputForm` (parses user text/number/textarea input into the algorithm's JSON body shape, client-side validated). Adding another algorithm means adding one more folder + registry entry — nothing else changes. `category` (e.g. `"Backtracking"`) drives the grouping on the home page; there's no separate category registry, it's just a string field on each entry.
  - `components/StepPlayer.tsx` is the **generic, reused-as-is** player: owns current-step index + play/pause/prev/next/slider, renders `step.action` and `step.explanation` (with a fallback when `null`), and calls a `renderState(step)` render-prop for the algorithm-specific visualization. Hasn't needed to change across all 9 algorithms.
  - `components/BacktrackingStateView.tsx` is a second shared, reused-as-is view (alongside `StepPlayer`): since Permutations/Combinations/Subsets all produce the identical `{ path, solutions }` (int-based) state shape, they use this one component directly as their `StateView` instead of each defining their own. N-Queens' board-shaped state doesn't fit, so it has its own `NQueensStateView`; Letter Combinations' state is also `{ path, solutions }` but of `string`s rather than `number`s, so it has its own `LetterCombinationsStateView` too rather than a type-incompatible reuse of `BacktrackingStateView`.
  - `pages/AlgorithmPage.tsx` wires a registry entry's `InputForm` → `api/client.ts`'s `runAlgorithm(id, body)` → `StepPlayer` with that entry's `StateView`. `pages/HomePage.tsx` groups `algorithms` by `category` (group order = first-appearance order in the registry array) and renders each group as a responsive card grid (1 col on mobile up to 4 on wide screens).
  - `components/StepPlayer.test.tsx` (Vitest + React Testing Library) is the one test in place, covering step navigation and the null-explanation fallback.

CI/CD (GitHub Actions) has not been set up yet.
