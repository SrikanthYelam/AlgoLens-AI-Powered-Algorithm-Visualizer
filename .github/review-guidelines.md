# Review Guidelines

Project-specific rules for the AI reviewer, in addition to its built-in checks. Sent as
`guidelines` on every request `ai-review.yml` makes.

- **CI/CD secret references are not hardcoded secrets.** Syntax like GitHub Actions'
  `${{ secrets.X }}` or `${{ env.X }}` pulls a value from an encrypted secret store at workflow
  run time — it is a reference, not a literal value, and should never be flagged as "hardcoded."
- **This is a deliberately educational algorithm visualizer — intentional simplicity is not a
  bug.** Many entries under `src/AlgoLens.Core/Algorithms/` choose a specific, sometimes
  non-optimal technique *on purpose* to demonstrate it (e.g. an `O(n²)` DP formulation chosen over
  a faster one specifically to show the 2D table shape, or recursion chosen over an iterative
  version to show the call-stack mechanics). These choices are explained in doc comments and in
  `CLAUDE.md` right above the code in question — read that explanation before flagging an
  algorithm's complexity or approach as a performance problem.
- **Respect documented rationale generally.** Beyond algorithm choices, this codebase explains
  other non-obvious decisions in doc comments and `CLAUDE.md` (why a model mutates its input in
  place, why a judge calls a parser twice, why a category reuses another's DTO). If a finding
  would contradict an explanation already given in a comment right above the code, read it first.
- **Prioritize real bugs, security issues, and correctness problems over style.** Don't spend
  findings on things a formatter/linter would already catch, and don't inflate a minor style
  preference to "High" or "Critical" severity.
- **Config, workflow, and generated files deserve lighter scrutiny than application code.** Treat
  issues in `.github/workflows/*.yml` and similar infrastructure as worth flagging only when
  they're genuine correctness/security problems, not stylistic opinions about how CI is structured.
- **One clear finding beats several vague ones.** If the same underlying problem would otherwise
  surface as multiple findings, report it once with the most useful suggested fix, not once per
  symptom.
- **Don't report `Info`-severity findings at all.** They add noise without value — skip anything
  that wouldn't rise to at least `Low` severity, including purely affirming comments like "no
  action needed, this is good practice."
