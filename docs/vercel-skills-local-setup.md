# Vercel Skills Local Setup

Date: 2026-05-07

This project has local checkouts of Vercel Labs' `skills` CLI and selected `agent-skills` installed for Codex.

## Source Snapshot

- Upstream: https://github.com/vercel-labs/skills
- Local checkout: `vendor/vercel-labs-skills/`
- Commit: `eec87fd44fca572d5275a472ea13c31aaceb65d0`
- Package version: `1.5.5`
- License: MIT, see upstream `package.json` and `ThirdPartyNoticeText.txt`
- Agent skills upstream: https://github.com/vercel-labs/agent-skills
- Agent skills checkout: `vendor/vercel-labs-agent-skills/`
- Agent skills commit: `b9c8ee0643d87d3c5a953d1e22382ff2ead39229`
- Agent skills license: MIT per upstream README

The local checkouts are ignored by Git so this repository does not vendor the full third-party source trees.

## Installed Project Files

| Path | Purpose |
|---|---|
| `.agents/skills/find-skills/SKILL.md` | Vercel's skill for discovering and installing skills from the open skills ecosystem. |
| `.agents/skills/find-skills/agents/openai.yaml` | Codex UI metadata added locally. |
| `.agents/skills/vercel-react-best-practices/` | Vercel React and Next.js performance guidance. |
| `.agents/skills/web-design-guidelines/` | Vercel Web Interface Guidelines audit skill, adapted to Codex web/browser tooling. |
| `.agents/skills/vercel-composition-patterns/` | React component composition and API design patterns. |
| `.agents/skills/vercel-react-view-transitions/` | React View Transition API and Next.js transition guidance. |

## Notes

- Vercel's CLI documents Codex project-level installs at `.agents/skills/`.
- The upstream repo is the `skills` package manager CLI; it currently bundles one skill, `find-skills`.
- `deploy-to-vercel`, `vercel-cli-with-tokens`, and `react-native-skills` were intentionally not installed by default.
- To use the CLI directly, run commands like `npx skills find <query>` or `npx skills add <owner/repo> -a codex`.
- In restricted environments, `npx skills ...` may require network approval.
