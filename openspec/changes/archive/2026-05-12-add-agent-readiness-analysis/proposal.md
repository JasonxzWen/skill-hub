## Why

Skill Hub can already analyze, install, report status, and remove managed capabilities, but its analysis still focuses on installable assets. The next useful step is to evaluate whether a target repository is ready for higher-autonomy agent work: clear context boundaries, success criteria, verification gates, routing rules, and safe automation candidates.

This follows the recent agent-infrastructure direction from Code with Claude 2026 and Reiner Pope's inference lecture: agent systems improve when context is budgeted, success is explicit, work can be decomposed, and expensive model attention is not wasted on static or irrelevant input.

## What Changes

- Add a read-only `agent-readiness-analysis` capability that extends `skill-hub analyze` reports with agent-readiness findings.
- Define report categories for context budget, outcome criteria, verification gates, agent routing, automation candidates, and learning capture.
- Add an `--agent-readiness` analysis option or equivalent report section flag without changing default install behavior.
- Keep recommendations evidence-based and conservative: report "unknown" instead of guessing repo intent.
- Add source references to project docs so the design rationale remains traceable to the talks and official product notes that motivated it.

Non-goals:

- No automatic mutation of target repositories in this change.
- No automatic creation of schedules, webhooks, PRs, commits, pushes, or third-party automations.
- No automatic writing into Codex memory or Claude memory. Learning capture is reviewable guidance only.
- No semantic content matching or LLM-based repo scoring in the first implementation; V1 should stay deterministic and script-friendly.

## Capabilities

### New Capabilities

- `agent-readiness-analysis`: Read-only target-repo assessment for agent autonomy readiness, including context hygiene, outcome definitions, verification gates, routing decomposition, automation candidates, and reviewable learning capture.

### Modified Capabilities

None.

## Impact

- `src/skillHub.ts`: CLI option parsing, analysis data model, read-only readiness analyzer, JSON/text/HTML report rendering.
- `tests/skillHub.test.ts` and fixtures: deterministic coverage for readiness categories, side-effect-free behavior, and stable report ordering.
- `docs/cli-lifecycle-design.md`: design section explaining how readiness analysis extends the lifecycle without mutating targets.
- `docs/capability-map.md`: capability map entry and command contract reference.
- `docs/codex-skill-feature-inventory.md`: inventory entry for agent-readiness analysis as a first-class planning capability.
- `README.md`: docs index and milestone updates.
- `openspec/changes/add-agent-readiness-analysis/`: proposal, design, specs, and task plan.

## Reference Inputs

- Code with Claude 2026 opening keynote: https://www.youtube.com/watch?v=GMIWm5y90xA
- Claude Managed Agents announcement: https://claude.com/blog/new-in-claude-managed-agents
- Anthropic Managed Agents architecture note: https://www.anthropic.com/engineering/managed-agents
- Reiner Pope / Dwarkesh Patel transcript gist: https://gist.github.com/dwarkeshsp/79100f0fdeed69d76241903bb0604dbe
- Reiner Pope video: https://www.youtube.com/watch?v=xmkSf5IS-zw
