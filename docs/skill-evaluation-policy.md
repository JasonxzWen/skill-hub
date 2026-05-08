# Skill Evaluation Policy

Date: 2026-05-08

Every third-party skill request must be evaluated before installation. The repository should remain a curated capability set, not a dump of every useful prompt pack.

## Decision Types

| Decision | Meaning |
|---|---|
| Install | Add the skill because it fills a real capability gap and has clean trigger boundaries. |
| Adapt | Add a Codex-specific version because upstream assumes another harness. |
| Reject | Do not install because it duplicates existing guidance, lacks license clarity, or adds trigger noise. |
| Explicit-only | Keep as a documented candidate, but require a direct user request before installing or running it. |

## Required Checks

For every candidate:

1. Read upstream README, skill bodies, plugin metadata, and license.
2. Record source URL, local vendor path, upstream commit or version, and license/status.
3. Compare against `.agents/skills/`, `.codex/skills/`, `AGENTS.md`, and `docs/skill-routing.md`.
4. Decide whether it adds a distinct capability or only repeats existing behavior.
5. Update documentation immediately.
6. Run `scripts/validate-skills.ps1 -SkipExternal`.

## Required Files To Keep Current

- `docs/source-projects.md`
- `docs/skill-routing.md`
- `README.md`
- `docs/codex-skill-feature-inventory.md`, when counts or capability surface change
- `.gitignore`, when vendor or runtime files are added

## Default Bias

Prefer rejection or explicit-only status for broad behavioral guideline packs. Prefer installation for concrete, bounded workflows with scripts, assets, or references that improve execution quality.
