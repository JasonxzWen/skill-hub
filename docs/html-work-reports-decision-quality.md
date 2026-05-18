# HTML Work Reports Decision Quality Plan

Date: 2026-05-18

This document records the planning contract for the OpenSpec change `advance-html-work-reports-decision-quality`.

## Status

Implemented in the OpenSpec change `advance-html-work-reports-decision-quality`.

The active OpenSpec artifacts live under:

- `openspec/changes/advance-html-work-reports-decision-quality/proposal.md`
- `openspec/changes/advance-html-work-reports-decision-quality/design.md`
- `openspec/changes/advance-html-work-reports-decision-quality/specs/html-work-report-generation/spec.md`
- `openspec/changes/advance-html-work-reports-decision-quality/tasks.md`

## Implementation Result

The implemented contract keeps existing minimal report inputs compatible while adding optional decision-quality fields:

- `intent` for audience, primary question, decision, time budget, artifact kind, and success criteria.
- `claims[]` for key conclusions, risks, metrics, trends, recommendations, and assumptions.
- richer `evidence[]` records with ids, source metadata, command/file anchors, dates, known limits, and trust level.
- `chart` sections for bounded static `bar`, `line`, `sparkline`, `bullet`, `slope`, and `matrix` visuals.
- runtime dependency audit metadata with pinned versions and integrity exemptions where SRI is not maintained.
- decision-brief quality warnings for weak BLUF, more than three top-level claims, and missing next action or CTA.
- advisory rich-content opportunity warnings so flow/routing prose can move to Mermaid and central file-line evidence can move to code or diff sections only when that lowers reading cost.
- warning policy: validator warnings are prompts for judgment, not required fixes; keep and explain a noisy warning instead of adding gratuitous rich rendering.
- validator checks for intent, claim/evidence links, chart accessibility, runtime auditability, unsafe sinks, focus visibility, reduced motion, chart containment, decision-brief structure, and rich-content opportunity signals.

New fixture inputs live under `.codex/skills/html-work-reports/assets/fixtures/`:

- `concise-handoff-report.json`
- `decision-quality-report.json`
- `chart-accessibility-stress-report.json`
- `trigger-scope-retro-report.json`
- `decision-brief-self-check-report.json`

Generated fixture reports live under `reports/`:

- `html-work-reports-concise-handoff.html`
- `html-work-reports-decision-quality.html`
- `html-work-reports-chart-accessibility-stress.html`
- `html-work-reports-trigger-scope-retro.html`
- `html-work-reports-decision-brief-self-check.html`

## Product Principle

`html-work-reports` should not optimize for visual richness by default. It should optimize for the reader's next decision.

The generator should answer these questions before selecting components:

1. Who is reading this?
2. What one question must the report answer first?
3. What decision or action should the reader be able to take?
4. What evidence makes the conclusion trustworthy?
5. What risk, assumption, or missing data could change the decision?
6. Is there a natural rich-rendering shape, such as a flow diagram, source-linked snippet, diff, or Markdown structure, that would reduce reading effort?
7. Can the first sentence, top three supports, fact/inference/assumption boundary, and next action stand on their own?
8. Would fixing a validator warning lower decision cost, or is it better to leave the advisory warning and explain why?

## Planned Contract

### Intent-first input

Report input should support optional intent metadata:

- audience
- primary question
- decision
- time budget
- artifact kind
- success criteria

These fields guide density, template selection, section order, and whether rich components are justified.

### Traceable claims

Key conclusions, metrics, trends, risks, assumptions, and recommendations should be represented as claims with evidence links. Unsupported claims should be marked as assumptions, open questions, or low-confidence inferences.

### Advisory warnings

Validator warnings are decision aids, not a checklist to clear. A warning should lead to content changes only when the fix makes the report shorter, clearer, or more trustworthy for the decision at hand.

This keeps rich rendering from becoming performative:

- Mermaid is used for flow, routing, call-path, architecture, or trigger sequences that are faster to scan than prose.
- Code and diff blocks are used when file-and-line evidence is central to trust.
- Charts are used when the data shape changes the decision.
- No report should add Mermaid, code, diff, chart, claims, or controls just to silence an advisory warning.

### Bounded charts

The skill should add a constrained chart section before considering any broader visualization runtime. The first supported chart types should be:

- bar
- line
- sparkline
- bullet
- slope
- matrix

Every chart needs a title, textual takeaway, data, source metadata, alt text or equivalent description, and a table fallback.

### Accessibility and static understanding

The report must keep its main conclusion understandable without hover, click, animation, or network-only enhancement.

Validation should cover:

- document title and `lang`
- semantic headings and landmarks
- keyboard-operable controls
- visible focus
- reduced-motion CSS
- chart text alternatives and table fallback
- non-color-only status encoding
- no body-level overflow or major overlap across representative viewports

### Runtime and trust boundaries

Runtime CDN remains allowed for Codex-visible reports, but dependencies should be pinned and auditable. Where practical, generated tags should include SRI metadata.

Report content should distinguish:

- trusted generated content
- mixed-trust content
- untrusted content

The generator should escape, sanitize, or reject values according to their output context.

## Implementation Phases

1. Baseline and scope check.
2. Schema and fixtures.
3. Generator behavior.
4. Accessibility, security, and runtime audit.
5. Validator and AI acceptance.
6. Skill and project docs.
7. Final validation and focused review.

The implementation checklist is the source of truth in `openspec/changes/advance-html-work-reports-decision-quality/tasks.md`.

## Acceptance Summary

This implementation should be accepted only when:

- existing minimal report inputs still work;
- new intent, claim, evidence, and chart inputs generate valid reports;
- generated charts include textual takeaways and table fallbacks;
- mixed-trust content stays inert;
- runtime dependencies are pinned and auditable;
- validator output identifies actionable failures;
- validator warnings catch weak BLUF, too many top-level claims, and missing next action or CTA;
- validator warnings identify missed Mermaid/code/diff opportunities without forcing noise into concise reports;
- validator warnings are labeled advisory and may be kept when a richer rendering would not lower decision cost;
- browser-required validation passes for runtime-cdn fixture reports when browser support is available;
- `bun run validate` passes;
- the diff remains scoped to `html-work-reports` and related tests/docs.

## Validation Commands

Focused fixture generation:

```powershell
bun .codex/skills/html-work-reports/scripts/create-report.mjs --input .codex/skills/html-work-reports/assets/fixtures/concise-handoff-report.json --out-dir reports --slug html-work-reports-concise-handoff --json
bun .codex/skills/html-work-reports/scripts/create-report.mjs --input .codex/skills/html-work-reports/assets/fixtures/decision-quality-report.json --out-dir reports --slug html-work-reports-decision-quality --json
bun .codex/skills/html-work-reports/scripts/create-report.mjs --input .codex/skills/html-work-reports/assets/fixtures/chart-accessibility-stress-report.json --out-dir reports --slug html-work-reports-chart-accessibility-stress --json
bun .codex/skills/html-work-reports/scripts/create-report.mjs --input .codex/skills/html-work-reports/assets/fixtures/trigger-scope-retro-report.json --out-dir reports --slug html-work-reports-trigger-scope-retro --json
bun .codex/skills/html-work-reports/scripts/create-report.mjs --input .codex/skills/html-work-reports/assets/fixtures/decision-brief-self-check-report.json --out-dir reports --slug html-work-reports-decision-brief-self-check --json
```

Focused fixture validation:

```powershell
bun .codex/skills/html-work-reports/scripts/validate-html-report.mjs reports/html-work-reports-concise-handoff.html --json --skip-browser
bun .codex/skills/html-work-reports/scripts/validate-html-report.mjs reports/html-work-reports-decision-quality.html --json --skip-browser
bun .codex/skills/html-work-reports/scripts/validate-html-report.mjs reports/html-work-reports-chart-accessibility-stress.html --json --require-browser
bun .codex/skills/html-work-reports/scripts/validate-html-report.mjs reports/html-work-reports-trigger-scope-retro.html --json --require-browser
bun .codex/skills/html-work-reports/scripts/validate-html-report.mjs reports/html-work-reports-decision-brief-self-check.html --json --require-browser
```

Final gates:

```powershell
openspec validate advance-html-work-reports-decision-quality
bun test ./tests/htmlWorkReportsSkill.test.ts
scripts/validate-skills.ps1 -SkipExternal
bun run validate
git diff --check
```

## Source Notes

This plan is informed by:

- Thariq Shihipar's HTML effectiveness examples: `https://thariqs.github.io/html-effectiveness/`
- W3C WAI accessibility principles: `https://www.w3.org/WAI/fundamentals/accessibility-principles/`
- USWDS data visualization guidance: `https://designsystem.digital.gov/components/data-visualizations/`
- Nielsen Norman Group dashboard cognition guidance: `https://www.nngroup.com/articles/dashboards-preattentive/`
- MDN Subresource Integrity guidance: `https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity`
- OWASP XSS Prevention Cheat Sheet: `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html`
- JSON Schema overview: `https://json-schema.org/overview/what-is-jsonschema`
- Bret Victor's explorable explanations essay: `https://worrydream.com/ExplorableExplanations/`
