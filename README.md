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

### AI Explanations

Each step gets a plain-English explanation from OpenAI, such as:

> "-1 and -3 were removed from the deque because 5 is larger and will remain relevant for future windows."

## Technical Stack

### Backend

* ASP.NET Core Web API (.NET 8; minimal APIs, no controllers)
* xUnit + FluentAssertions
* Official `OpenAI` NuGet package for the OpenAI integration

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

## Long-Term Vision

Evolve AlgoLens into an AI-powered interview preparation platform that can:

* Visualize algorithms
* Explain solutions
* Analyze user-submitted code
* Generate hints and walkthroughs
* Act as an interactive algorithm tutor

## Pending Enhancements

* CI/CD pipeline (GitHub Actions) — not yet set up
* Deployment/hosting for both the API and the frontend
* .NET 9 upgrade once the SDK is available in the dev environment (currently targeting .NET 8)
* Additional algorithms beyond the current 11
* Visual/UX polish and richer step animations
* The user-submitted-code analysis and interactive-tutor features from the long-term vision above

## Why This Project

Unlike typical CRUD portfolio projects, AlgoLens showcases engineering judgment, algorithm expertise, AI-assisted development workflows, and modern cloud-native software practices in a single repository.
