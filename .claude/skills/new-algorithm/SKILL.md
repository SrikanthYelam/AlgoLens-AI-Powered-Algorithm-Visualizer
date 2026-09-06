---
name: new-algorithm
description: Scaffold a new LeetCode-style algorithm end-to-end in AlgoLens — the Core model/algorithm, the API endpoint + judge wiring, a backend test, and the frontend registry entry + InputForm/StateView — following the project's established conventions. Use whenever the user asks to add a new algorithm/problem/visualizer to AlgoLens.
---

# Add a new algorithm to AlgoLens

AlgoLens has added ~26 algorithms this way already; every one follows the exact same shape. Don't
improvise a new structure — find the closest existing algorithm (same category, same DP/backtracking/
greedy/two-pointer shape) and mirror its files. Read `CLAUDE.md` first: its `AlgoLens.Core` and
`algolens-ui` sections describe every existing algorithm's implementation in enough detail to tell
you which one to copy from.

## 0. Before writing anything

- Confirm the exact problem (LeetCode number + name if given) and work out the algorithmic approach
  yourself first — state your intended approach in a sentence before coding, per this repo's "Think
  Before Coding" principle.
- Pick a `category` (`Trees & Graphs`, `Arrays & Stacks`, `Backtracking`, `Heaps & Greedy`, `Dynamic
  Programming`, or a new one) and find 1–2 existing algorithms in that category to use as a template.
- Decide the `*State` shape. Reuse before creating:
  - Choose/undo backtracking over `int` values → reuse `BacktrackingState` (Core) /
    `BacktrackingStateView` (frontend).
  - Choose/undo backtracking over `string` values → reuse `StringBacktrackingState` /
    `StringBacktrackingStateView`.
  - Tree-shaped state → render through `components/TreeDiagram.tsx` rather than a new diagram.
  - Otherwise, a dedicated `<Name>State` record + `<Name>StateView` component is normal — most
    algorithms have their own.

## 1. Backend — `AlgoLens.Core`

1. `src/AlgoLens.Core/Models/<Name>Models.cs` (or `<Name>State.cs` if there's no separate input
   record needed): an `<Name>Input` record if the algorithm takes more than one primitive, plus the
   `<Name>State` record — every field the frontend needs to render one step.
2. `src/AlgoLens.Core/Algorithms/<Name>.cs`: implement `IAlgorithmVisualizer<TInput>`.
   - `Id` is the kebab-case route slug, e.g. `"longest-continuous-subarray-abs-diff-limit"`.
   - Record every meaningful state change via `StepRecorder.Add(steps, ref stepNumber, action, state,
     highlights, spanLines: N)` — never construct `AlgorithmStep` directly.
   - **`spanLines` math**: `StepRecorder.Add` uses `[CallerLineNumber]`, which resolves to the line
     where the call *starts* (the `StepRecorder.Add(` line), not where it ends. The highlighted range
     becomes `[callerLine - spanLines, callerLine - 1]`. So: find the line where your `StepRecorder.Add(`
     call begins, find the first line of the loop/block body you want highlighted, and set
     `spanLines = (callStartLine - bodyStartLine)`. Get this right — it drives the frontend's
     `CodePanel` line highlighting. Verify by reading the file back with line numbers after writing it.
   - Handle empty/degenerate input with a single explanatory step (see `SlidingWindowMaximum`'s or
     `LongestSubarrayAbsDiffLimit`'s empty-array branch) rather than throwing.
   - Watch for BCL name collisions from implicit usings (e.g. `TaskScheduler` — see
     `TaskSchedulerAlgorithm`'s doc comment for why it isn't just `TaskScheduler`).
3. `src/AlgoLens.Core/AlgoLens.Core.csproj` needs no change — `Algorithms/*.cs` is already a glob
   `EmbeddedResource`, which is what powers the `/source` endpoint.

## 2. Backend — `AlgoLens.Api`

4. `src/AlgoLens.Api/Contracts/<Name>Request.cs`: a plain request DTO matching the JSON body shape.
5. `src/AlgoLens.Api/Endpoints/AlgorithmEndpoints.cs`: add one call inside `MapAlgorithmEndpoints`:
   ```csharp
   MapAlgorithm<TAlgorithm, TRequest, TInput>(
       app,
       "/api/algorithms/<kebab-case-id>",
       request => /* TRequest -> TInput */,
       judge: new JudgeConfig<TInput>(
           input => new Dictionary<string, object?> { ["paramName"] = /* ... */ },
           "Solve(/* cast args matching judgeSignature exactly */)",
           steps => /* read the canonical answer off the last step's concrete *State */));
   ```
   - `InvocationExpression`'s cast types must match the frontend `judgeSignature` cast-for-cast.
   - `ExtractExpectedAnswer` must match what the frontend's `deepEqual`/`deepEqualIgnoringOrder`
     comparer expects (an array for order-insensitive problems, a raw value otherwise).
   - If the algorithm mutates its input in place (like `RecoverBst`), remember `MapAlgorithm`'s
     `/submit` handler already calls `toAlgorithmInput` twice (once for the canonical run, once for
     `BuildArgs`) specifically so a mutating canonical run can't corrupt the judge's input — don't
     "simplify" that by sharing one parsed input between them.
   - Also add the new route's `kebab-case-id` to the big `Routes:` string documented in `CLAUDE.md`
     (see step 6).
6. `src/AlgoLens.Api/Program.cs`: add `builder.Services.AddScoped<TAlgorithm>();` next to the others.

## 3. Backend test

7. `src/AlgoLens.Tests/<Name>Tests.cs`: xUnit + FluentAssertions, one file, asserting the *final*
   step's state against a known-correct canonical LeetCode example, plus edge cases (empty input, and
   whatever degenerate case is relevant — e.g. N-Queens' no-solution board sizes). Don't guess expected
   values — work them out from the actual problem statement/examples, and if a test fails on a
   secondary assertion (like a specific `BestStart` index), double check by hand which answer is
   actually correct before "fixing" the algorithm — the test may be the one that's wrong.

## 4. Frontend

8. `algolens-ui/src/algorithms/<camelCaseName>/<Name>InputForm.tsx`: parses text/number input into
   the request body shape, client-side validated, pre-filled with a sensible default example (mirror
   an existing `InputForm` in the same category for the exact validation/error-message style).
9. `algolens-ui/src/algorithms/<camelCaseName>/<Name>StateView.tsx` (skip if reusing a shared view):
   a component matching `AlgorithmStateViewProps`, with a local interface documented as "Mirrors
   AlgoLens.Core.Models.<Name>State (camelCase JSON)".
10. `algolens-ui/src/algorithms/registry.ts`: import the new `InputForm`/`StateView`, then add one
    `AlgorithmDefinition` entry — `id` (matches the backend route), `name`, `description`, `category`,
    `pattern`, `timeComplexity`, `spaceComplexity`, `complexityNotes`, `hints` (vaguest → most
    specific), `relatedProblems` (name + one-line connection to related LeetCode problems),
    `judgeSignature` (the real LeetCode method signature, cast-for-cast matching the backend's
    `InvocationExpression`). Place it near other algorithms in the same category.

## 5. Verify — don't skip this

Run in order, fixing forward on any failure before moving to the next:

1. **Windows only**: kill stale dev-server processes first — `dotnet build`/`dotnet run` fail with
   `MSB3027`/`MSB3021` file-lock errors if a previous `AlgoLens.Api` process is still running:
   ```
   Get-Process AlgoLens.Api,node -ErrorAction SilentlyContinue | Stop-Process -Force -Confirm:$false
   ```
2. `dotnet build AlgoLens.sln` — must succeed with 0 errors.
3. `dotnet test AlgoLens.sln` — new test file passes AND the full suite still passes (no regressions).
4. From `algolens-ui/`: `npm run build` (fails on any TS error) and `npm run test`.
5. Start both servers (kill-stale step above first, then `dotnet run --project src/AlgoLens.Api` and
   `npm run dev` from `algolens-ui/`, both backgrounded) and confirm with curl:
   - `POST /api/algorithms/<id>` with example input → the final step's state matches the expected
     canonical answer.
   - `POST /api/algorithms/<id>/submit` with a correct hand-written C# solution (matching
     `judgeSignature`) → `compileSucceeded: true`, `ranSuccessfully: true`, `yourAnswer` equals
     `expectedAnswer`.
6. Optional but recommended for anything with a nontrivial `StateView`: a quick Playwright screenshot
   of the algorithm's page (home page card renders, run produces steps, state view doesn't error)
   in both light and dark.
7. Stop both dev servers when done.

## 6. Documentation

Both `CLAUDE.md` and `README.md` are kept in sync with every algorithm added — do the same here:

- **`CLAUDE.md`**:
  - Bump the algorithm count and add the name to the list in "Repository status".
  - Add the new `kebab-case-id` into the `Routes:` bullet's list.
  - Add one bullet under the `AlgoLens.Core` algorithm list, in the same dense style as its
    neighbors, describing the approach and calling out anything genuinely novel about this instance
    (a new state-fill order, a reused vs. new model, a tie-breaking quirk) rather than restating
    generic algorithm mechanics already obvious from the code.
- **`README.md`**: add one line to "Algorithms currently implemented", and fix any other "current N
  algorithms" mention that's now stale (e.g. under Pending Enhancements).

Only commit if the user explicitly asks — finishing this skill means the code, tests, and docs are
done and verified, not that it's been committed or pushed.
