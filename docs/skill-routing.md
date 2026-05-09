# Skill Routing And De-Duplication

Date: 2026-05-08

This project intentionally avoids installing every famous skill pack wholesale. Prefer the narrowest skill that matches the user request.

## Current Skill Roots

| Root | Purpose |
|---|---|
| `.codex/skills/` | Anthropic/Claude built-in skills adapted for Codex plus OpenSpec helpers. |
| `.agents/skills/` | Cross-agent skills from Everything Claude Code, Vercel, and other agent-skill ecosystems. |
| `.codex/agents/` | Codex multi-agent role configs from ECC. |

## Priority Rules

| Task | Preferred skill | Secondary skill |
|---|---|---|
| Explore or refine a feature idea | `brainstorming` | `openspec-explore` when the work should become an OpenSpec change |
| Create a Ralph-ready PRD | `ralph-prd` | `product-capability` when implementation interfaces need deeper analysis |
| Convert or run Ralph stories | `ralph-loop` | `verification-loop` before marking a story complete |
| Create an OpenSpec change | `openspec-propose` | `brainstorming` first when intent is unclear |
| Implement an OpenSpec change | `openspec-apply-change` | `verification-loop` before completion |
| React/Next performance | `vercel-react-best-practices` | `frontend-patterns` |
| React component API design | `vercel-composition-patterns` | `frontend-patterns` |
| React view/page transitions | `vercel-react-view-transitions` | `frontend-patterns` |
| Visual frontend creation | `frontend-design` | `frontend-patterns` for implementation details |
| UI/accessibility/UX audit | `web-design-guidelines` | `security-review` only for security-sensitive findings |
| One-off local UI debugging | `webapp-testing` | Browser plugin/Playwright as available |
| Durable E2E test suite | `e2e-testing` | `verification-loop` |
| Self-contained HTML work report, plan, review, status update, research explainer, or lightweight editor | `html-work-reports` | `web-artifacts-builder` when a bundled React/Tailwind app is needed |
| General code quality | `coding-standards` | language/framework-specific skill when present |
| Security review | `security-review` | `verification-loop` |
| Find more skills | `find-skills` | system `skill-installer` for actual installs |
| Evaluate third-party skills | `skill-evaluator` | `find-skills` only when searching for alternatives |

## Removed Duplicate

The project-local `.codex/skills/skill-creator` copy was removed. Codex already provides a current system `skill-creator` skill, and keeping a second project-local copy risks stale instructions and duplicate triggering.

## HTML Work Reports

Use `html-work-reports` when the output should be browsable, visual, interactive, or exportable. It is intentionally narrower than `web-artifacts-builder`: it covers one-file reports, reviews, plans, explainers, dashboards, and lightweight editors, while `web-artifacts-builder` remains the choice for complex bundled React/Tailwind artifacts.

This skill is inspired by [The unreasonable effectiveness of HTML](https://thariqs.github.io/html-effectiveness/) and local evaluation of `html-tools`-style single-file artifacts. Third-party HTML artifact skills were not installed because the repository needed a governance/reporting trigger, not another broad tool-building trigger.

## OpenSpec Routing Decision

OpenSpec remains installed, but should be treated as an explicit formal lifecycle, not the default planning lane. For normal feature work, prefer ECC/local workflow skills:

- `brainstorming` for early exploration.
- `product-capability` for PRD-to-implementation constraints.
- `tdd-workflow` for implementation.
- `verification-loop` before completion.

Use OpenSpec when the user explicitly asks for OpenSpec, a formal change proposal, or an existing `openspec/changes/<name>` workflow. The capability graph exposes this as the `openspec-formal` profile so target repos can opt in deliberately.

## Evaluated But Not Installed

`forrestchang/andrej-karpathy-skills` was evaluated on 2026-05-08. Its `karpathy-guidelines` skill repeats the four project-level principles already present in root `AGENTS.md`: think before coding, simplicity first, surgical changes, and goal-driven execution. Do not install it as a separate skill unless the root guidance is removed or the upstream project adds a materially different workflow.

`michalvavra/agents` `html-tools` was evaluated on 2026-05-09. It is useful as a reference for single-file HTML utilities, but not installed because it overlaps existing HTML artifact skills and does not target work reports. The local `html-work-reports` skill covers the narrower routing gap.

`Cocoon-AI/architecture-diagram-generator` was evaluated on 2026-05-09. Keep it explicit-only as an architecture diagram reference; do not install by default because it is narrow and CDN-dependent.

## Superpowers Decision

Superpowers is not installed right now.

Rationale:

- ECC plus the adapted built-in skills already cover brainstorming, TDD, code review, verification, frontend work, docs, and file formats.
- Installing Superpowers wholesale would add substantial overlap and increase trigger noise.
- The remaining useful Superpowers-style gaps are narrow workflows: git worktree/branch finishing, systematic debugging, and plan execution discipline. Those should be added as small local skills only if they become recurring needs.

Keep Superpowers listed as an optional upstream source in `docs/source-projects.md`, but do not install it by default.

## Explicit-Only Candidates

Do not auto-install these until a user actually needs them:

- Vercel deployment skills: external deployment and token handling.
- React Native skills: mobile-specific context that is not part of the current repository focus.
- Full Superpowers pack: useful but overlapping with ECC and existing workflow skills.
