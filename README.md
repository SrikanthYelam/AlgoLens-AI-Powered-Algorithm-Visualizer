# AlgoLens – AI-Powered LeetCode Visualizer

## What This Project Does

AlgoLens is a full-stack web application that visualizes classic LeetCode-style algorithms step-by-step and uses OpenAI to generate a plain-English explanation for what's happening at each step.

**Backend** (ASP.NET Core Web API, .NET 8): each algorithm is a pure function (`IAlgorithmVisualizer<TInput>`) that captures its own execution as an ordered sequence of steps — an `AlgorithmStep` carries a short mechanical action description, an algorithm-specific state snapshot (e.g. a queue, a stack, a grid, a backtracking path), and the elements touched that step. A single generic endpoint-mapping helper wires each algorithm to its own route. A shared `IStepExplanationService` sends the whole step sequence to OpenAI once per request — using structured JSON output so the response reliably parses into one explanation per step — and degrades gracefully (returns `null` explanations rather than failing the request) if no API key is configured.

**Frontend** (React + TypeScript + Vite, Tailwind CSS): a generic `StepPlayer` component (play/pause/prev/next/step-slider) drives through the steps returned by the API, rendering each algorithm's own visualization via a small per-algorithm `StateView` component. Every algorithm plugs into one central registry — adding a new one means adding one registry entry plus an `InputForm`/`StateView` pair, with no changes to the player, routing, or API client.

### Algorithms currently implemented

* Binary Tree Level Order Traversal (BFS)
* Sliding Window Maximum (monotonic deque)
* Largest Rectangle in Histogram (monotonic stack)
* Number of Islands (BFS flood fill over a grid)
* Permutations (backtracking)
* Combinations (backtracking)
* Subsets (backtracking)
* N-Queens (backtracking with constraint checking)
* Letter Combinations of a Phone Number (backtracking)
* Task Scheduler (greedy tick-by-tick simulation)
* Generate Parentheses (backtracking)
* Remove Invalid Parentheses (BFS) — minimal-removal search, level by level
* Remove Invalid Parentheses (DFS/Backtracking) — same problem, solved with a precomputed removal budget
* Longest Common Subsequence (2D dynamic programming, with traceback to recover the actual subsequence)
* Longest Palindromic Subsequence (interval dynamic programming)
* Longest Increasing Subsequence (2D dynamic programming over index + previous-index)
* Edit Distance (2D dynamic programming over two sequences)
* Longest Palindromic Substring (interval dynamic programming)
* Meeting Rooms II (greedy min-heap sweep)
* Validate Binary Search Tree (recursive DFS with bounds propagation)
* Kth Smallest Element in a BST (iterative inorder traversal)
* Lowest Common Ancestor of a Binary Tree (recursive post-order search)
* Construct Binary Tree from Preorder and Inorder Traversal (recursive divide-and-conquer)
* Recover Binary Search Tree (inorder traversal with swap detection)

### AI Explanations

Each step gets a plain-English explanation from OpenAI, such as:

> "-1 and -3 were removed from the deque because 5 is larger and will remain relevant for future windows."

### Try Your Own Solution

The code panel next to each algorithm's animation has a "Try your own solution" button that swaps the read-only source view for an editor: paste a C# implementation of the documented `Solve(...)` method (matching that problem's real LeetCode signature), run it against the same input you just ran above, and compare your output to the canonical answer — with an "exact match" and a "matches ignoring order" indicator, since problems like Permutations don't care what order their solutions come back in. The code runs server-side via in-process Roslyn scripting (`Microsoft.CodeAnalysis.CSharp.Scripting`) with a soft timeout, no external services involved.

**This is not sandboxed** — see Pending Enhancements below before relying on it for anything beyond local, trusted use.

## Technical Stack

### Backend

* ASP.NET Core Web API (.NET 8; minimal APIs, no controllers)
* xUnit + FluentAssertions
* Official `OpenAI` NuGet package for the OpenAI integration
* `Microsoft.CodeAnalysis.CSharp.Scripting` (Roslyn) for running user-submitted solutions in "Try Your Own Solution"

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS v4
* React Router
* Vitest + React Testing Library

## Repository Structure

```
/src
  AlgoLens.Api      — HTTP layer: endpoints, request/response contracts, the OpenAI explanation service
  AlgoLens.Core     — algorithm implementations + step-capture models (no I/O, no AI dependency)
  AlgoLens.Tests    — xUnit tests against AlgoLens.Core

/algolens-ui        — React + TypeScript + Vite frontend
```

## Development Notes

> To ease local development when Vite picks a non-default dev port (e.g., 5174), the API accepts a comma-separated list of allowed dev frontend origins via the DEV_FRONTEND_ORIGINS environment variable. By default this is set to http://localhost:5173. Example:
>
> DEV_FRONTEND_ORIGINS=http://localhost:5173,http://localhost:5174
>
> This avoids CORS failures when the frontend auto-selects another free port.

## Long-Term Vision

Evolve AlgoLens into an AI-powered interview preparation platform that can:

* Visualize algorithms
* Explain solutions
* Analyze user-submitted code
* Generate hints and walkthroughs
* Act as an interactive algorithm tutor

## Pending Enhancements

* Real sandboxing for user-submitted code in "Try Your Own Solution" (currently in-process Roslyn scripting with a soft timeout — a tight infinite loop still consumes a thread until process restart, and there's no process/container isolation or resource limits — not safe beyond local, trusted use; needs a separate killable process or a container with CPU/memory limits before any public deployment)
* CI/CD pipeline (GitHub Actions) — not yet set up
* Deployment/hosting for both the API and the frontend
* .NET 9 upgrade once the SDK is available in the dev environment (currently targeting .NET 8)
* Additional algorithms beyond the current 24
* Visual/UX polish and richer step animations
* The user-submitted-code analysis and interactive-tutor features from the long-term vision above

## Why This Project

Unlike typical CRUD portfolio projects, AlgoLens showcases engineering judgment, algorithm expertise, AI-assisted development workflows, and modern cloud-native software practices in a single repository.
