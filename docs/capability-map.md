# Capability Map

Date: 2026-05-09

This document is the human-readable index for `capabilities/index.json`. The JSON file is the installable source of truth for `skill-hub init`.

## Profiles

| Profile | Purpose | Default use |
|---|---|---|
| `minimal` | Low-noise daily engineering profile with HTML work reports, quality, TDD, verification, security, current docs, and self-debugging. | Default for new target repos. |
| `web` | Frontend design, browser validation, HTML artifacts, slides, and UI audits. | Add when a repo regularly ships web UI. |
| `openspec-formal` | Formal OpenSpec change proposal, apply, and archive lifecycle. | Explicit only; use when the user asks for OpenSpec or formal change artifacts. |
| `ralph` | Ralph PRD and loop helpers. | Explicit only; use when the user wants Ralph-style repeated execution. |

## Routing Principles

- Prefer the narrowest matching skill.
- Prefer ECC daily workflow skills for ordinary development.
- Use `html-work-reports` for non-trivial plans, reviews, research, status reports, and explainers where a self-contained HTML artifact is more useful than Markdown.
- Use `web-artifacts-builder` only when the HTML artifact needs a bundled React/Tailwind/shadcn app.
- Use `frontend-slides` for decks.
- Keep OpenSpec as an explicit formal lifecycle, not the default planning lane.

## OpenSpec vs ECC

| OpenSpec capability | ECC/local overlap | Decision |
|---|---|---|
| Explore mode | `brainstorming`, `product-capability` | Keep, but route only when a formal OpenSpec change may be created. |
| Proposal generation | `product-capability`, `ralph-prd` | Keep for OpenSpec artifacts; ECC remains default for normal implementation planning. |
| Apply change | `tdd-workflow`, `verification-loop` | Keep for existing OpenSpec changes; do not use as the default feature-work lane. |
| Archive change | No strong overlap | Keep as OpenSpec-specific lifecycle command. |

The main observed risk is not that OpenSpec is useless. It is that OpenSpec skills live under `.codex/skills/`, while the cross-agent install convention used by Vercel `skills` and this CLI installs skills into `.agents/skills/` for Codex/OpenCode-compatible hosts. The new capability graph lets `skill-hub init --profile openspec-formal` copy those skills into the target agent skill directory when they are actually wanted.

## Installer Contract

`skill-hub init` reads `capabilities/index.json`, resolves a profile, copies selected skill directories to the requested agent skill roots, writes `.skill-hub/lock.json`, and creates an HTML install report under `.skill-hub/reports/`.

Future component kinds can add hooks, rules, MCP config snippets, and harness-specific config files without changing the profile model.
