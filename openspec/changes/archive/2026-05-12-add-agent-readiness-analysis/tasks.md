## 1. Data Model And CLI Contract

- [x] 1.1 Add an opt-in `--agent-readiness` option to `src/skillHub.ts` under the existing `analyze` command.
- [x] 1.2 Define readiness category, state, severity, evidence, and recommendation types in `src/skillHub.ts`.
- [x] 1.3 Keep existing `AnalysisResult` output backward compatible by adding readiness data only when requested or by emitting a clearly separate readiness report shape.
- [x] 1.4 Add invalid-option tests for readiness analysis in `tests/skillHub.test.ts`.

## 2. Read-Only Readiness Analyzer

- [x] 2.1 Implement deterministic detection for context surfaces such as `AGENTS.md`, `.codex/`, `.agents/`, `.claude/`, and `.opencode/`.
- [x] 2.2 Implement deterministic detection for outcome-like artifacts such as OpenSpec tasks, Ralph PRDs, PR templates, release checklists, and Definition of Done docs.
- [x] 2.3 Implement deterministic detection for verification gates from `package.json` scripts, test directories, CI config, and known validation scripts.
- [x] 2.4 Implement deterministic detection for routing assets such as skill routing docs, agent role configs, OpenSpec changes, and Ralph stories.
- [x] 2.5 Implement automation candidate recommendations without creating schedules, webhooks, PRs, commits, pushes, or external resources.
- [x] 2.6 Implement learning-capture recommendations without writing memory files, target repo files, or `.skill-hub/lock.json`.

## 3. Reporting

- [x] 3.1 Add JSON output for readiness findings with stable category, finding id, state, severity, reason, recommendation, and evidence fields.
- [x] 3.2 Add text output that summarizes the highest-actionability readiness findings without implying a numeric score.
- [x] 3.3 Add HTML output for readiness categories while preserving the no-output side-effect policy for read-only commands.
- [x] 3.4 Sort readiness categories, finding ids, recommendations, and evidence paths deterministically.

## 4. Tests And Fixtures

- [x] 4.1 Add an empty target repo fixture proving readiness analysis succeeds with unknown/not-detected states.
- [x] 4.2 Add a well-instrumented target repo fixture with agent instructions, outcomes, verification gates, routing assets, and learning-capture docs.
- [x] 4.3 Add an overloaded context fixture proving duplicated always-loaded instruction surfaces are reported as context-budget risk.
- [x] 4.4 Add a verification-gap fixture proving routine-style recommendations are gated by missing checks.
- [x] 4.5 Add side-effect tests proving readiness analysis does not create `.skill-hub/`, mutate target files, or change git state.
- [x] 4.6 Add stability tests that normalize timestamps and compare repeated readiness JSON output.

## 5. Documentation

- [x] 5.1 Add `docs/agent-readiness-analysis.md` with the plan summary, safety boundary, report categories, and source references.
- [x] 5.2 Update `README.md` with the agent-readiness planning link and CLI preview example.
- [x] 5.3 Update `docs/capability-map.md` with the `agent-readiness-analysis` capability and command contract.
- [x] 5.4 Update `docs/cli-lifecycle-design.md` with the readiness-analysis design section and source references.
- [x] 5.5 Update `docs/codex-skill-feature-inventory.md` so agent-readiness analysis is listed as a first-class planning capability.

## 6. Verification

- [x] 6.1 Run `openspec status --change add-agent-readiness-analysis`.
- [x] 6.2 Run `openspec validate add-agent-readiness-analysis`.
- [x] 6.3 Run `bun run typecheck`.
- [x] 6.4 Run `bun test ./tests`.
- [x] 6.5 Run `bun run build`.
- [x] 6.6 Run `bun run validate`.
