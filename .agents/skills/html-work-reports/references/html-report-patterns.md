# HTML Work Report Patterns

## Source Inspiration

The main pattern comes from "The unreasonable effectiveness of HTML" by Thariq Shihipar: replace skimmable walls of Markdown with self-contained HTML artifacts that can show comparisons, diagrams, timelines, reports, decks, and task-specific editors directly in a browser.

Related third-party skills were evaluated as references:

- `michalvavra/agents/archive/skills/html-tools`: strong single-file utility guidance, but focused on converters and developer tools rather than work reports.
- `Cocoon-AI/architecture-diagram-generator`: useful architecture diagram conventions, but too narrow and visually opinionated for the default reporting layer.
- Anthropic `web-artifacts-builder`: already present in this repo for complex bundled artifacts.

## Artifact Selection

| Work type | HTML pattern | Useful controls |
|---|---|---|
| Planning | timeline + risk matrix + dependency sketch | filter by owner, copy checklist |
| Code review | annotated diff + file tour + severity index | jump links, collapse low-risk notes |
| Code understanding | module boxes + arrows + entry point list | highlight hot path |
| Design system | swatches + type scale + component contact sheet | copy token, state tabs |
| Prototype | isolated interaction or animation | sliders, toggles, reset |
| Research | TL;DR + tabs + glossary + citations | search, expand all |
| Status report | summary cards + chart + timeline | filter by status |
| Incident report | minute-by-minute timeline + logs + follow-ups | severity tags, owner filters |
| Custom editor | board/form/table for a specific decision | export Markdown/JSON/diff |

## Layout Skeleton

Use this structure unless the task clearly needs something else:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Report title</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.5; }
    main { max-width: 1120px; margin: 0 auto; padding: 24px; }
    nav a { margin-right: 12px; }
    section { margin-block: 28px; }
    .summary { border-left: 4px solid #2563eb; padding-left: 16px; }
    @media (max-width: 720px) { main { padding: 16px; } }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Report title</h1>
      <p>Generated YYYY-MM-DD. Scope and assumptions.</p>
    </header>
    <aside class="summary">Top finding or decision.</aside>
    <nav aria-label="Report sections"></nav>
    <section id="main-workspace"></section>
    <section id="evidence"></section>
    <section id="next-actions"></section>
  </main>
</body>
</html>
```

## Interaction Rules

- Keep JavaScript small and local to the artifact.
- Make controls obvious: buttons for commands, checkboxes/toggles for binary state, select inputs for modes, text input for search.
- Never hide the source data so thoroughly that the artifact cannot be audited.
- For export buttons, produce plain text in a visible `<textarea>` as a fallback to clipboard APIs.
- Avoid storing secrets. If a tool genuinely needs a token, keep it in user-controlled localStorage and never embed it in source.

## Visual Rules

- Engineering reports should be dense but calm.
- Use color to encode severity, status, ownership, or grouping.
- Avoid decorative backgrounds that make evidence harder to read.
- Use responsive grids and allow tables to scroll horizontally on small screens.
- Prefer inline SVG for diagrams that need precise labels or arrows.
