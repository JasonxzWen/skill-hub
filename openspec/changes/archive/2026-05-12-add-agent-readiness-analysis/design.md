## Context

Skill Hub's first lifecycle change makes the CLI usable as a released tool: target repos can be analyzed, installed into, inspected, updated in dry-run mode, and safely removed. That lifecycle answers "what can Skill Hub install?" but not yet "is this repo ready for agentic work?"

The new readiness layer should extend analysis, not installation. It translates the recent agent-system lessons into deterministic target-repo findings:

- context is a scarce budget, so repo instructions, tool schemas, and skill routing need hygiene;
- agents need explicit outcomes, not vague "make it work" instructions;
- higher autonomy shifts the bottleneck to verification, review, coordination, and safety boundaries;
- multi-agent and routine-style workflows are useful only when work can be decomposed and checked.

Reference inputs:

- Code with Claude 2026 opening keynote: https://www.youtube.com/watch?v=GMIWm5y90xA
- Claude Managed Agents announcement: https://claude.com/blog/new-in-claude-managed-agents
- Anthropic Managed Agents architecture note: https://www.anthropic.com/engineering/managed-agents
- Reiner Pope / Dwarkesh Patel transcript gist: https://gist.github.com/dwarkeshsp/79100f0fdeed69d76241903bb0604dbe
- Reiner Pope video: https://www.youtube.com/watch?v=xmkSf5IS-zw

## Goals / Non-Goals

**Goals:**

- Add a read-only agent-readiness report that can run as part of `skill-hub analyze`.
- Keep findings deterministic, explainable, and script-friendly.
- Produce practical recommendations for context hygiene, outcome files, verification gates, agent routing, automation candidates, and reviewable learning capture.
- Make the readiness output useful before any Skill Hub assets are installed.
- Preserve the existing lock-backed lifecycle boundary for future mutating changes.

**Non-Goals:**

- Do not install outcome templates, hooks, schedules, routines, or skills in this change.
- Do not infer semantic quality through an LLM judge.
- Do not write to Codex memory, Claude memory, `.skill-hub/lock.json`, or target repo files during analysis.
- Do not create external automations, webhooks, pull requests, commits, pushes, or GitHub resources.
- Do not replace the existing capability recommendation report.

## Decisions

### Decision 1: Extend `analyze` Instead Of Adding A New Top-Level Verb

Agent readiness is another read-only view of the same target repo. The first implementation should add `skill-hub analyze <target> --agent-readiness --json|--html` or an equivalent opt-in report section, rather than adding a separate `readiness` command.

Alternative considered: add `skill-hub readiness <target>`. That would be clearer at the command line, but it creates a second analysis lifecycle before the existing one is fully mature. Keeping it under `analyze` makes report composition and side-effect guarantees easier.

### Decision 2: Use Category Findings, Not A Single Score

The report should expose category findings instead of a readiness percentage. V1 categories:

- `context_budget`: instruction volume, duplicated agent roots, oversized always-loaded docs, too many default tools or MCP-like surfaces when detectable.
- `outcomes`: presence of success criteria, Definition of Done files, OpenSpec/Ralph tasks, PR templates, or project-specific acceptance checklists.
- `verification`: test, lint, typecheck, build, validation, browser, and release gates discoverable from package scripts, docs, and known project files.
- `agent_routing`: evidence that work can be decomposed into narrow skills, subagents, routines, or owner-specific flows.
- `automation_candidates`: read-only suggestions for recurring checks, CI diagnostics, doc freshness, and review workflows.
- `learning_capture`: reviewable places where lessons can be written, such as docs, changelogs, skill gotchas, or memory-note proposals.

Alternative considered: compute a numeric score. A score would look polished, but it would encourage false precision and hide evidence. Category findings are easier to test and harder to overinterpret.

### Decision 3: Keep V1 Detection Path-Based And Script-Based

Readiness analysis should inspect files and structured metadata that are already cheap to check: `AGENTS.md`, `.codex/`, `.agents/`, `.claude/`, `.opencode/`, `package.json`, lock files, OpenSpec changes, test directories, docs, CI config, and known validation scripts.

Alternative considered: parse arbitrary Markdown deeply or use an LLM to grade repo quality. That may be useful later, but V1 should remain deterministic and reproducible in CI.

### Decision 4: Recommendations Are Reviewable Plans

Automation and learning recommendations must be output as candidate plans, not executed actions. For example, the report can suggest "nightly skill quality inventory routine" or "CI failure diagnosis routine", but it must not create a schedule, webhook, or memory write.

Alternative considered: generate ready-to-run automation configs. That belongs in a later change after the report categories prove useful and after safety boundaries are clear.

### Decision 5: Keep Output Additive

Existing `AnalysisResult` consumers should not break. The readiness report can be a nested optional object such as `agentReadiness`, or a separate JSON shape selected by `--agent-readiness`. Field names should be stable, sorted, and explicit.

Alternative considered: merge readiness findings into existing capability findings. That would blur "installable component recommendation" with "operational readiness advice." The two concepts should stay separate.

## Risks / Trade-offs

- False certainty from shallow detection -> Use `unknown` and `not-detected` states, cite evidence paths, and avoid scoring.
- Report noise -> Keep categories small and sort by severity/actionability. Avoid recommending every possible routine.
- Scope creep into automation -> Keep V1 read-only and document automation as candidates only.
- Duplicate existing capability recommendations -> Keep installable Skill Hub component findings separate from readiness findings.
- Stale external product references -> Use source links only as rationale; do not hard-code volatile Claude product details into CLI behavior.
- Repo-specific conventions may be missed -> Allow "custom evidence" in later changes, but keep V1 deterministic.

## Migration Plan

1. Add OpenSpec artifacts and docs references only.
2. Implement the analyzer behind an opt-in flag.
3. Add fixtures for empty repos, well-instrumented repos, overloaded instruction repos, and repos with verification gaps.
4. Update JSON/text/HTML reports.
5. Run `bun run typecheck`, `bun test ./tests`, `bun run build`, and `bun run validate`.

Rollback is simple because V1 is read-only and opt-in: remove the flag/report section and leave the existing lifecycle unchanged.

## Open Questions

- Should `--agent-readiness` emit only readiness data, or include the ordinary capability analysis plus a nested readiness section?
- Should outcome templates be introduced in a later `install --profile` change or stay as generated guidance only?
- Which documentation path should own reviewable learning capture: `docs/`, `.skill-hub/`, Codex memory notes, or skill gotchas?
