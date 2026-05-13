---
name: html-work-reports
description: Load when a non-trivial task has a complete conclusion needing a self-contained HTML report, review, plan, status dashboard, research explainer, architecture walkthrough, or lightweight export editor; do not load for permission pauses, simple chat answers, production UI, slide decks, or bundled web apps.
---

# HTML Work Reports

## Overview

Turn completed agent work into one portable `.html` file when the handoff needs visual scanning, rendered rich content, evidence, or export controls. This is for the conclusion boundary, not permission pauses.

## Decision Rule

Use this skill when:

- A non-trivial task has a complete conclusion with findings, tradeoffs, file/code evidence, diagrams, metrics, timelines, or next actions.
- The user asks for a report, review, plan, status update, research explainer, architecture walkthrough, dashboard, or lightweight editor.
- The answer would otherwise become a long Markdown wall, raw Mermaid block, raw table, or unrendered code dump.

Skip this skill for:

- permission pauses before publishing, pushing, spending money, installing, changing credentials, or mutating third-party resources
- short answers, one-command summaries, tiny fixes, or ordinary chat
- implementation/debugging while work is still in progress
- product UI, websites, apps, decks, or bundled React/Tailwind artifacts

## Trigger Examples

Use this skill for requests like:

- "Turn the completed implementation summary into a visual HTML report with file evidence."
- "Create an interactive PR review report with severity filters and highlighted snippets."
- "Explain this module call path as a self-contained page with a rendered diagram."
- "Build an incident timeline page with impact, logs, and follow-up status."
- "Convert the research result into a skimmable HTML explainer with citations."
- "Make a small prompt/config editor that exports JSON or Markdown."

Do not use this skill for:

- approval gates such as "ask before pushing" or "confirm before installing"
- code implementation, bug fixes, or test runs while work is still in progress
- short answers, simple explanations, or ordinary chat summaries
- product UI or website work; use `frontend-design`
- complex bundled React/Tailwind artifacts; use `web-artifacts-builder`
- slide decks; use `frontend-slides`

## Output Contract

Every artifact should be one self-contained `.html` file under `reports/` unless the repo has a better convention. Pair it with a short chat handoff that links the file and names verification performed.

Build with visual blocks, tables, timelines, diagrams, cards, code panels, and chips instead of long paragraphs. Keep keyboard access, narrow width readability, and `prefers-reduced-motion`.

## Generator First Workflow

Prefer the internal generator:

1. Write a JSON input that follows `references/report-input-schema.json`.
2. Run `scripts/create-report.mjs --input <input.json> --out-dir reports --slug <name> --json`.
3. Run `scripts/validate-html-report.mjs reports/<name>.html --json`.
4. Hand off the report link and the verification result.

Use hand-written HTML only for custom visual exceptions. Reuse `assets/components/` and run the validator.

## Template Assets

Start from the closest template when it fits:

- `assets/templates/implementation-handoff.html`: changed areas, evidence, verification gates, risks, and next actions.
- `assets/templates/conclusion-dashboard.html`: completed task handoffs, release readiness, implementation summaries, verification reports.
- `assets/templates/review-findings.html`: code review, PR review, risk triage, finding-by-severity reports.
- `assets/templates/research-explainer.html`: research synthesis, architecture walkthroughs, module understanding, concept explainers.
- `assets/templates/decision-matrix.html`: option comparison, recommendation, risks, and confirmation questions.

Use `assets/components/report-ui.css` and `assets/components/report-ui.js` for cards, chips, filters, tabs, copy buttons, hover focus, and dim/blur behavior. Use `rich-render-runtime.*` only for explicit runtime Markdown/Mermaid/code rendering with pinned libraries and source fallbacks.

## Visual And Rich Content Rules

- Put the conclusion first: decision, status, top risks, next action.
- Prefer bullets, callouts, tables, diagrams, timelines, and annotated snippets.
- Render Markdown to semantic HTML, Mermaid to inline SVG or pinned runtime with fallback, and code to highlighted snippets.
- Escape/sanitize mixed-trust content. Code and paths stay inert unless a safe local reference is explicit.
- Use sticky nav, jump links, filters, tabs, details, copy buttons, hover highlights, selected states, and dim/blur focus.
- Include file paths, commands, dates, sources, assumptions, and verification status.

## Verification

Before handing off:

Run `scripts/validate-html-report.mjs` when possible. Otherwise inspect enough to confirm non-empty output, narrow viewport sanity, rendered Markdown/Mermaid/code, working controls, and linked evidence.

## Related Skills

- Use `web-artifacts-builder` when the artifact needs a bundled React/Tailwind/shadcn implementation.
- Use `frontend-slides` for a viewport-safe presentation deck.
- Use `frontend-design` for polished product UI, websites, or applications.
- Use `webapp-testing` or browser tooling when the HTML must be visually verified in a real browser.

For detailed patterns, schema, template selection, rich-content handling, validation, and source inspiration, read `references/html-report-patterns.md`.
