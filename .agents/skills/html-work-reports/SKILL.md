---
name: html-work-reports
description: Create self-contained HTML work artifacts for reports, plans, reviews, research explainers, status updates, incident timelines, comparisons, diagrams, dashboards, and lightweight editors. Use when a Markdown answer would flatten spatial, visual, interactive, or exportable information; do not use for tiny answers where plain text is enough.
---

# HTML Work Reports

## Overview

Turn agent work products into one portable `.html` file when the user needs to inspect, compare, navigate, present, or edit the result. The goal is a local artifact that opens directly in a browser and makes the work easier to use than a long Markdown document.

## Decision Rule

Prefer HTML when the output benefits from at least one of these:

- side-by-side alternatives or tradeoffs
- tables that need filtering, sorting, or scanning
- timelines, dependency maps, module maps, diagrams, or call flows
- code review annotations, severity tags, or jump links
- collapsible explainers, tabs, glossaries, or progressive disclosure
- status reports, incident reports, or recurring updates
- small task-specific editors that export Markdown, JSON, diffs, or checklists

Keep Markdown or chat when the answer is short, linear, or mainly conversational.

## Artifact Types

Use the narrowest artifact that fits:

- **Planning**: milestones, risk table, architecture sketch, task checklist.
- **Code review**: annotated diff, changed-file tour, findings by severity, reviewer focus areas.
- **Understanding**: module map, request path, dependency graph, entry points.
- **Design**: token swatches, component contact sheet, variant/state matrix.
- **Prototype**: single interaction, animation sandbox, click-through flow.
- **Research**: TL;DR box, tabs for examples, collapsible sections, glossary.
- **Report**: status summary, timeline, small chart, follow-up checklist.
- **Editor**: focused interface for triage, feature flags, prompts, ordering, or config changes.

## Build Rules

1. Produce one self-contained `.html` file with inline CSS and JS.
2. Default to no network dependencies. If a CDN library is materially useful, pin the version and explain why.
3. Use semantic HTML, accessible controls, readable contrast, and keyboard-friendly interactions.
4. Put an executive summary or TL;DR at the top.
5. Preserve evidence: include source paths, commands, dates, and assumptions where relevant.
6. Add copy/export controls when the user needs to feed the result back into an agent or commit it.
7. Keep styling purposeful and restrained for engineering reports. Avoid decorative excess.
8. Save generated work artifacts under `reports/` unless the user or repo already has a better convention.

## Minimum Structure

Every report artifact should include:

- title and generated timestamp
- short summary
- navigation for major sections
- the main visual or interactive workspace
- evidence and assumptions
- next actions or export output

For editor artifacts, include an explicit export area or button. The exported text should be directly usable as Markdown, JSON, a patch summary, or a task list.

## Verification

Before handing off:

- Open or inspect the file enough to confirm it is not blank.
- Check that text does not overlap and the layout works at a narrow viewport.
- Verify interactive controls that affect the output.
- If the artifact summarizes code or research, ensure linked evidence is present.

## Related Skills

- Use `web-artifacts-builder` when the artifact needs a bundled React/Tailwind/shadcn implementation.
- Use `frontend-slides` for a viewport-safe presentation deck.
- Use `frontend-design` for polished product UI, websites, or applications.
- Use `webapp-testing` or browser tooling when the HTML must be visually verified in a real browser.

For detailed patterns and source inspiration, read `references/html-report-patterns.md` only when designing a non-trivial artifact.
