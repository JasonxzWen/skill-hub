## ADDED Requirements

### Requirement: Report input captures reader intent
The system SHALL support intent metadata that lets generated interaction artifacts optimize for the reader's decision, audience, time budget, and success criteria before choosing visual components.

#### Scenario: Generate report with explicit intent
- **WHEN** artifact input includes audience, primary question, decision, time budget, artifact kind, and success criteria
- **THEN** the generated artifact exposes a concise conclusion-first structure aligned to that intent
- **AND** the report does not add charts, diagrams, code, tabs, filters, or editors unless they reduce effort for that intent

#### Scenario: Generate report without explicit intent
- **WHEN** artifact input omits intent metadata
- **THEN** the generator infers a conservative default intent from template, status, sections, evidence, and verification fields
- **AND** the report remains valid without requiring the caller to provide every intent field

#### Scenario: Validate intent-driven density
- **WHEN** validation runs against a report with a short time budget
- **THEN** validation warns when the first reading area lacks a direct conclusion
- **AND** validation warns when optional modules appear before the summary without evidence that they support the primary question

### Requirement: Claims are traceable to evidence
The system SHALL support key claims that bind conclusions, risks, metrics, trends, assumptions, and recommendations to evidence records and known limitations.

#### Scenario: Render claim with evidence
- **WHEN** artifact input contains a claim with evidence identifiers, confidence, date range, and known limitations
- **THEN** the generated artifact renders the claim with a traceable evidence relationship
- **AND** the evidence record remains reachable from the claim without requiring the reader to search the whole page

#### Scenario: Validate unsupported important claim
- **WHEN** validation detects a key claim marked as conclusion, metric, trend, risk, or recommendation without evidence identifiers
- **THEN** validation reports a warning or failure according to the claim severity
- **AND** the result identifies the affected claim id or text

#### Scenario: Preserve missing evidence honestly
- **WHEN** a claim cannot be supported by available evidence
- **THEN** the report marks the claim as an assumption, open question, or low-confidence inference
- **AND** the report does not present the claim as verified fact

### Requirement: Charts are semantic, bounded, and accessible
The system SHALL provide a constrained chart section contract for common explanatory visuals and SHALL generate accessible alternatives for every chart.

#### Scenario: Generate supported chart
- **WHEN** artifact input contains a chart section of type bar, line, sparkline, bullet, slope, or matrix with valid data and encoding
- **THEN** the generator renders a static report-contained visual
- **AND** the chart includes a title, a textual takeaway, source metadata, and an accessible table fallback

#### Scenario: Reject or degrade unsupported chart
- **WHEN** artifact input requests an unsupported chart type, missing encoding, or malformed data
- **THEN** the generator rejects the input with a clear error or renders a degraded fallback table
- **AND** the report does not emit arbitrary active SVG, script, or canvas code from untrusted input

#### Scenario: Validate chart accessibility
- **WHEN** validation runs against a report with chart sections
- **THEN** it verifies that each chart has a textual takeaway, non-empty alt text or equivalent description, source metadata, and a table fallback
- **AND** it warns when color appears to be the only encoded distinction for status or category

#### Scenario: Chart does not replace precise data
- **WHEN** a chart shows values used for decisions
- **THEN** the underlying values remain available as text or table data
- **AND** the chart does not require hover interaction to reveal the core message

### Requirement: Reports meet accessibility acceptance checks
The system SHALL validate generated artifacts for accessibility-relevant structure and interaction behavior that can be checked deterministically.

#### Scenario: Validate semantic structure
- **WHEN** validation runs against a generated artifact
- **THEN** it checks for a document title, language, main landmark, ordered headings, and navigable section anchors
- **AND** failures identify the missing or inconsistent structure

#### Scenario: Validate keyboard-operable controls
- **WHEN** a report includes filters, tabs, copy buttons, collapsible regions, export controls, or lightweight editor controls
- **THEN** validation verifies that controls are keyboard focusable and have text or accessible labels
- **AND** browser validation exercises representative controls without hiding the primary conclusion or evidence

#### Scenario: Validate focus and motion safety
- **WHEN** validation runs in a browser-capable environment
- **THEN** it verifies that focus-visible styling is detectable for interactive controls
- **AND** it verifies that reduced-motion CSS disables non-essential transitions or transforms

#### Scenario: Validate color is not the only signal
- **WHEN** status, severity, confidence, or category is represented visually
- **THEN** the report also exposes text, icon, shape, pattern, label, or structural grouping for the same meaning
- **AND** validation warns when only color classes appear to convey the distinction

### Requirement: Runtime dependencies are supply-chain auditable
The system SHALL make runtime-cdn dependencies explicit, pinned, and auditable, and SHOULD use browser-supported integrity metadata when practical.

#### Scenario: Runtime dependency declares integrity
- **WHEN** a generated runtime-cdn report loads external script or stylesheet dependencies
- **THEN** the dependency manifest records name, version, URL, purpose, and expected integrity metadata when available
- **AND** generated tags include `integrity` and `crossorigin="anonymous"` when the dependency source supports Subresource Integrity

#### Scenario: Validate missing runtime integrity
- **WHEN** validation runs against a runtime-cdn report
- **THEN** it checks runtime dependency declarations for pinned versions and integrity metadata or an explicit documented exemption
- **AND** it reports dependencies that cannot be audited

#### Scenario: Pre-rendered mode remains available for high-trust handoff
- **WHEN** artifact input explicitly selects pre-rendered mode for offline, archival, or restricted-network use
- **THEN** the report does not require CDN scripts for primary rich content
- **AND** the report still includes source fallback, evidence, accessibility, and safety metadata where applicable

### Requirement: Report rendering follows a trust model
The system SHALL distinguish trusted generated content, mixed-trust content, and untrusted content so each value is encoded, sanitized, or rejected in the correct output context.

#### Scenario: Render mixed-trust Markdown
- **WHEN** a Markdown section is marked mixed-trust or untrusted
- **THEN** generated HTML is sanitized before insertion
- **AND** unsafe HTML, event handlers, script tags, and unsupported URL protocols are removed or neutralized

#### Scenario: Render untrusted labels and attributes
- **WHEN** untrusted or mixed-trust values appear in labels, titles, file paths, data attributes, links, chart data, or diagnostics
- **THEN** the generator uses context-appropriate escaping or validation for the target sink
- **AND** the report does not insert the value into script, style, event handler, or unsafe URL contexts

#### Scenario: Validate unsafe sinks
- **WHEN** validation scans generated artifact HTML and runtime components
- **THEN** it reports raw scripts, inline event handlers, unsupported protocols, unsafe `innerHTML` assignments, or unsanitized mixed-trust insertion paths unless explicitly allowed by trusted constants
- **AND** diagnostics remain sanitized before they are written to HTML or JSON output

### Requirement: Explorable report elements preserve static understanding
The system SHALL allow lightweight explorable explanation elements only when the report remains understandable without interaction.

#### Scenario: Generate scenario table
- **WHEN** artifact input contains assumptions or scenarios for a decision or research explainer
- **THEN** the generated artifact presents the default scenario and conclusion as static text
- **AND** any interactive controls update supporting details without hiding the default takeaway

#### Scenario: Export reader decisions
- **WHEN** a report includes editor-like controls for triage, prompt tuning, feature flags, or decision options
- **THEN** it provides a copyable or exportable text representation of the current state
- **AND** the export does not include hidden runtime dependency data unless explicitly requested

#### Scenario: Validate interaction-independent conclusion
- **WHEN** validation runs against a report with explorable or editor controls
- **THEN** it verifies that the page contains a static conclusion, default assumptions, and next action before interaction
- **AND** it fails or warns when the report requires interaction to discover the main answer

### Requirement: AI acceptance is fixture-driven
The system SHALL provide deterministic fixtures and validation commands that let an AI agent implement and accept the change without relying only on visual judgment.

#### Scenario: Fixture set covers decision quality
- **WHEN** implementation adds fixtures for this change
- **THEN** fixtures cover a concise handoff, a decision report with claims and evidence, and a chart/accessibility stress report
- **AND** each fixture is generated through the normal `create-interaction.mjs` path

#### Scenario: Acceptance validates generated artifacts
- **WHEN** AI acceptance runs after implementation
- **THEN** it generates the relevant fixture reports
- **AND** it runs `validate-interaction.mjs` against them with browser-required checks where runtime-cdn behavior is part of the acceptance target

#### Scenario: Acceptance reviews scope boundaries
- **WHEN** AI acceptance reviews the implementation diff
- **THEN** it confirms that the change stays inside `effective-interact` assets, tests, docs, and OpenSpec artifacts unless tasks explicitly authorize more
- **AND** it confirms that `effective-interact` did not broaden into production UI, slide deck, or bundled app generation
