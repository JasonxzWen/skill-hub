# Changelog

## 0.1.4 - 2026-05-15

- Move project-local skills from `.agents/skills` to Codex-native `.codex/skills`.
- Route managed skill installs to each selected agent host directory: `.codex/skills`, `.opencode/skills`, or `.claude/skills`.

## 0.1.3 - 2026-05-15

- Skip system `skill-creator` quick validation in CI when the host-only validator is unavailable.

## 0.1.2 - 2026-05-15

- Make release validation run the skill validator through Windows PowerShell or PowerShell Core.

## 0.1.0 - Initial npm release

- Package `skill-hub` as a Node-compatible CLI.
- Support target-repo `analyze`, `install`, `status`, `update`, `migrate-lock`, and `remove` lifecycle commands.
- Include curated Codex/OpenCode/Claude Code skill profiles, harness templates, and release validation.
