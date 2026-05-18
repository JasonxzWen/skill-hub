---
name: html-work-reports
description: Load when completed implementation, OpenSpec, validation, or review work has a complete conclusion needing a concise Chinese-first self-contained HTML report, plan, status dashboard, research explainer, architecture walkthrough, or lightweight export editor; skip permission pauses, simple chat answers, production UI, slide decks, and bundled web apps.
---

# HTML Work Reports

Turn completed work into one portable Chinese `.html` when HTML makes the handoff shorter, clearer, or easier to scan than chat.

## Decision Rule

Use when a completed non-trivial task needs findings, tradeoffs, metrics, next actions, or a report/review/plan/status/explainer/dashboard/editor that would otherwise become a Markdown wall.

Default to this skill after substantial completed implementation, OpenSpec apply/archive, release-prep, validation-heavy review, or multi-file repo work when the handoff includes changed files and verification results. The user does not need to say "HTML" for that completed-work handoff.

## Trigger Examples

Use this skill for requests like:

- "Turn the completed implementation summary into a visual HTML report with file evidence."
- "Finish an OpenSpec apply change and generate an HTML acceptance report with tasks, changed files, fixture reports, and validation gates."
- "Create an interactive PR review report with severity filters and highlighted snippets."
- "Explain this module call path as a self-contained page with a rendered diagram."
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

Write one single static `.html` under `reports/` as UTF-8 Chinese. Link the file and verification.

Start with BLUF: one-sentence conclusion plus reader intent. Add claims, evidence, charts, or controls only when they reduce reading effort. Keep summaries one line, cells phrase-like, bullets one judgment/action.

Use inlineable HTML/CSS and vanilla JS only; runtime-cdn may reference pinned Mermaid, Markdown, sanitizer, and code-highlighting libraries, but never React, Tailwind, Vite, a build step, or bundled app runtime.

For code-changing work, include code only when prose cannot carry the point. If used, include a source file link label with line number, decisive snippet, highlighted lines, and `diff` only when before/after matters.

For complex sequence, architecture, call-path, or data-flow changes, render Mermaid only when the diagram is faster than text. Keep source fallback as hidden machine-verifiable data.

## Generator First Workflow

Prefer the internal generator:

1. Write a UTF-8 JSON input following `references/report-input-schema.json`; include optional `intent`, `claims`, richer `evidence`, and bounded `chart` sections only when useful.
2. Run `scripts/create-report.mjs --input <input.json> --out-dir reports --slug <name> --json`.
3. Run `scripts/validate-html-report.mjs reports/<name>.html --json --require-browser` for runtime-cdn reports.
4. Hand off the report link and the verification result.

Use hand-written HTML only for custom visual exceptions.

## Template Assets

Start from the closest template when it fits: `implementation-handoff`, `conclusion-dashboard`, `review-findings`, `research-explainer`, or `decision-matrix`.

Use `assets/components/report-ui.css` and `assets/components/report-ui.js` for cards, filters, tabs, copy buttons, hover focus, and dim/blur behavior.

## Visual And Rich Content Rules

- Use SCQA/PREP only to shape content, but the first visible sentence still gives the answer.
- Keep support to Top 3, mark 事实 / 推断 / 假设, and end with CTA or next action when a decision remains.
- Treat validator warning 是 advisory: fix it only when the change lowers decision cost; otherwise keep it and explain why.
- Keep important claims traceable to evidence. Unsupported conclusions become assumptions, open questions, or low-confidence inferences.
- Use `chart` only for bounded static bar, line, sparkline, bullet, slope, or matrix visuals with takeaway, source, alt text, and table fallback.
- Prefer `data-table` sections for structured, segmented, point-by-point, status, comparison, or checklist-like data.
- Render Markdown, Mermaid, and code through pinned runtime-cdn libraries by default; preserve machine-readable state, but do not show effect tags such as `Markdown rendered`, `code highlighted`, or `Source fallback`.
- 当内容天然是流程、路由、调用链、命令、配置、代码或补丁证据时，优先用 Mermaid、Markdown、code 或 diff；不要压扁成泛化卡片/表格。
- Code reports need source link, line number, copied snippet, highlighted line or diff, but reports do not need code by default.
- Escape/sanitize mixed-trust and untrusted content; code and paths stay inert.
- Use grouped navigation that follows the report's argument, not the component inventory.

## Failure Lessons

- 必须使用 UTF-8 中文输入和输出；连续问号乱码通常来自 shell/codepage，把输入写成 UTF-8 JSON 文件。
- 不要外显 Source fallback、Code source 或 rich render status；它们只做隐藏 fallback 和校验状态。
- Mermaid、浏览器、validator 诊断必须脱敏：本地绝对路径、`file:///`、token、原始 HTML/script 都不能进报告。
- 代码行保持紧凑，不要在逐行 `<span>` 之间插入换行文本节点。
- 不要硬加图表、代码、证据、Mermaid 或效果标签；组件必须服务内容。

## Verification

Before handing off, run `scripts/validate-html-report.mjs`. For runtime-cdn reports, prefer `--require-browser` so rendering, overflow, Mermaid, code tokens, focus, and controls are checked.

For patterns, schema, template selection, rich-content handling, and validation, read `references/html-report-patterns.md`.
