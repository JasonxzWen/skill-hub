# Source Projects And Candidates

Date: 2026-05-11

This file tracks source projects that are worth studying or adapting for Codex.

## Primary Sources

| Project | Why it matters | Codex adaptation notes |
|---|---|---|
| [Superpowers](https://github.com/obra/superpowers) | High-signal disciplined engineering workflow: brainstorming, planning, TDD, debugging, review, worktrees, and completion verification. | Optional source only for now. Not installed because ECC plus adapted built-ins already cover most workflow behavior, and installing the full pack would add trigger noise. |
| [Superpowers Codex tool mapping](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/references/codex-tools.md) | Explicit mapping from Claude Code tools to Codex equivalents. | Treat as the first compatibility checklist for any ported skill. |
| [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) | Broad agent harness performance system with agents, skills, rules, hooks, MCP configs, and command shims. | Imported selectively for Codex: `.agents/skills`, `.codex/AGENTS.md`, `.codex/agents`, and adapted `.codex/config.toml`. |
| [Vercel Labs Skills](https://github.com/vercel-labs/skills) | CLI/package manager for the open agent skills ecosystem, with Codex listed as a supported agent. | Installed the bundled `find-skills` skill into `.agents/skills/find-skills` and kept the source checkout under `vendor/` for reference. |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | Vercel-maintained Web, React, Next.js, View Transition, deployment, and React Native skills. | Installed only the low-risk Web/React subset; deployment, token, and React Native skills remain explicit-only candidates. |
| [Ralph](https://github.com/snarktank/ralph) | Autonomous PRD story loop that repeatedly launches a fresh coding agent until every story passes. | Installed as a Codex-specific PowerShell runner plus two focused skills. The upstream Bash runner remains reference-only because it targets Amp and Claude Code. |
| [Karpathy-inspired guidelines](https://github.com/forrestchang/andrej-karpathy-skills) | Four behavioral principles for reducing common LLM coding mistakes: clarify assumptions, keep changes simple, make surgical edits, and verify against goals. | Evaluated and not installed as a standalone skill because the same principles already live in root `AGENTS.md`; adding the skill would duplicate triggers. |
| [Matt Pocock Skills](https://github.com/mattpocock/skills) | Small, composable engineering and productivity skills for alignment, feedback loops, diagnosis, issue workflows, and architecture thinking. | Adapted `grill-me`, `diagnose`, and `prototype`. Other skills are useful references, but many overlap current TDD, verification, planning, and issue-workflow surfaces or have stronger side effects. |
| [OpenAI Codex plugins and skills](https://openai.com/academy/codex-plugins-and-skills/) | Official explanation of Codex plugins and skills. | Use for terminology and product-aligned guidance. |
| [The unreasonable effectiveness of HTML](https://thariqs.github.io/html-effectiveness/) | Practical examples showing how self-contained HTML can outperform Markdown for plans, reviews, diagrams, decks, reports, research, and small editors. | Adapted as local `html-work-reports`; source is referenced, not copied. |

## Imported Sources

| Source | Local path | Version |
|---|---|---|
| `affaan-m/everything-claude-code` | `vendor/everything-claude-code/` (ignored) | `2.0.0-rc.1` at `841beea45cb25ba51f29fa45b7e272938d19b80a` |
| `vercel-labs/skills` | `vendor/vercel-labs-skills/` (ignored) | package `1.5.5` at `eec87fd44fca572d5275a472ea13c31aaceb65d0` |
| `vercel-labs/agent-skills` | `vendor/vercel-labs-agent-skills/` (ignored) | at `b9c8ee0643d87d3c5a953d1e22382ff2ead39229` |
| `snarktank/ralph` | `vendor/snarktank-ralph/` (ignored) | at `6c53cb0b831ebe8739c6a003e22af14902d8b0b5` |
| `forrestchang/andrej-karpathy-skills` | `vendor/forrestchang-andrej-karpathy-skills/` (ignored) | at `2c606141936f1eeef17fa3043a72095b4765b9c2` |
| `mattpocock/skills` | `vendor/mattpocock-skills/` (ignored) | at `9fecab929abb904c68ce3366a1781df31ab22832` |
| ECC Codex skill surface | `.agents/skills/` | Copied from upstream `.agents/skills/` |
| ECC Codex config supplement | `.codex/AGENTS.md`, `.codex/agents/` | Copied from upstream `.codex/` |
| Vercel `find-skills` skill | `.agents/skills/find-skills/` | Copied from upstream `skills/find-skills/` |
| Vercel Web/React skills | `.agents/skills/vercel-react-best-practices/`, `.agents/skills/web-design-guidelines/`, `.agents/skills/vercel-composition-patterns/`, `.agents/skills/vercel-react-view-transitions/` | Copied from upstream `skills/` with Codex metadata added |
| Ralph Codex skills and runner | `.agents/skills/ralph-prd/`, `.agents/skills/ralph-loop/`, `scripts/ralph/` | Adapted from upstream PRD skills and loop prompt under MIT |
| Karpathy-style baseline instructions | `AGENTS.md` | Already present as project-level behavior guidance; no separate skill installed |
| Matt Pocock `grill-me` | `.agents/skills/grill-me/` | Adapted from upstream `skills/productivity/grill-me/` under MIT |
| Matt Pocock `diagnose` | `.agents/skills/diagnose/` | Adapted from upstream `skills/engineering/diagnose/` under MIT |
| Matt Pocock `prototype` | `.agents/skills/prototype/` | Adapted from upstream `skills/engineering/prototype/` under MIT |
| HTML work report guidance | `.agents/skills/html-work-reports/` | Original local skill inspired by Thariq Shihipar's HTML effectiveness article |

## Evaluated Matt Pocock Skills

| Candidate | Version checked | Decision | Rationale |
|---|---|---|---|
| [`grill-me`](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) | `9fecab929abb904c68ce3366a1781df31ab22832` | Adapted and installed | Fills a narrow gap: one-question-at-a-time plan pressure testing with recommended answers. The local version keeps the codebase-first rule and narrows triggers to avoid replacing normal implementation. |
| [`diagnose`](https://github.com/mattpocock/skills/tree/main/skills/engineering/diagnose) | `9fecab929abb904c68ce3366a1781df31ab22832` | Adapted and installed | Adds a concrete runtime-debugging lane: feedback loop first, ranked hypotheses, narrow instrumentation, fix, regression test, and cleanup. Routed away from agent self-debugging and final verification. |
| [`prototype`](https://github.com/mattpocock/skills/tree/main/skills/engineering/prototype) | `9fecab929abb904c68ce3366a1781df31ab22832` | Adapted and installed | Adds a bounded throwaway-prototype workflow for logic/state and UI variant exploration. Routed away from production UI, standalone artifacts, and production implementation. |
| [`grill-with-docs`](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) | `9fecab929abb904c68ce3366a1781df31ab22832` | Explicit-only candidate | Strong idea, but it writes `CONTEXT.md` and ADRs inline and assumes a domain-doc setup flow. Keep for future adaptation after deciding this hub's domain-doc conventions. |
| `improve-codebase-architecture`, `zoom-out` | `9fecab929abb904c68ce3366a1781df31ab22832` | Explicit-only candidates | Potentially useful, but overlap current product-capability and architecture planning surfaces. Install only with a dedicated architecture profile or clearer domain-doc conventions. |
| `tdd`, `to-prd`, `to-issues`, `triage`, `setup-matt-pocock-skills` | `9fecab929abb904c68ce3366a1781df31ab22832` | Do not install by default | Existing `tdd-workflow`, Ralph, OpenSpec, and local issue-routing policies cover the main flows; issue publishing and setup skills would add external-action and trigger noise. |

## Secondary Candidates

| Candidate | Target area |
|---|---|
| `fullstack-dev-skills` | Full-stack engineering skill pack across languages, backend, frontend, infra, security, and testing. |
| `dotnet/skills` | .NET, C#, ASP.NET, MAUI, Blazor, Aspire, EF Core, Native AOT. |
| `expo/skills` | Expo and EAS mobile app workflows. |
| `playwright-skill` and browser QA skills | Browser automation, UI validation, screenshots, critical flows. |
| `frontend-design` and design-system skills | Frontend quality, visual taste, accessibility, reusable design systems. |
| `agent-eval` and eval-harness skills | Repeatable evaluation of agent workflows and task outcomes. |
| `continuous-learning` skills | Extract reusable project patterns from sessions and convert them into skills or instincts. |

## Evaluated HTML Artifact Candidates

| Candidate | Version checked | Decision | Rationale |
|---|---|---|---|
| [`michalvavra/agents` `html-tools`](https://github.com/michalvavra/agents/tree/main/archive/skills/html-tools) | `b7eab78594595ffdb58c9b00eccd1e134d4a69b8` | Adapt ideas, do not install | Useful single-file HTML utility patterns, but it targets converters/tools rather than agent work reports and overlaps with `web-artifacts-builder`. No plugin metadata found at `.codex-plugin/plugin.json` or `.claude-plugin/plugin.json`. |
| [`Cocoon-AI/architecture-diagram-generator`](https://github.com/Cocoon-AI/architecture-diagram-generator) | `9bac8372cb63f969fd2a052e82ddc8de7c6f3f21` | Explicit-only reference | Useful architecture diagram template, but too narrow for default installation and uses external CDN assets. No plugin metadata found at `.claude-plugin/plugin.json`. |

## Import Policy

- Use `skill-evaluator` for every third-party skill evaluation, including rejected candidates.
- Do not copy large third-party skill bodies without checking license and attribution.
- Prefer adaptation notes and small original Codex-native skills over bulk prompt mirroring.
- Record source URL, license, upstream version/date, and local modifications for every imported skill.
- Keep optional high-context packs behind named install profiles.
- Run security review before enabling hooks, MCP servers, shell automation, or credential-handling workflows.
