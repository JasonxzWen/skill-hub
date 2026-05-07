# Claude Built-In Skills Codex Adaptation

Date: 2026-05-06

The Claude Code built-in skills copied into `.codex/skills/` have been adapted for Codex project-local use.

## Adapted Surface

- Location: `.codex/skills/`
- Count: 20 skills
- Added per skill: `agents/openai.yaml`
- Validated with: `skill-creator/scripts/quick_validate.py`

## Mechanical Changes

- Added a short Codex adaptation note near the top of every `SKILL.md`.
- Replaced Claude-only tool names with Codex equivalents:
  - `AskUserQuestion tool` -> ask the user directly in conversation
  - `TodoWrite tool` -> `update_plan`
  - `Task tool` -> `spawn_agent` when multi-agent support is available
  - `Read` / `Edit` tool references -> Codex native file read/edit tools
  - `Skill tool` -> Codex skill invocation
- Replaced `Claude Code`, `claude.ai`, and Reader-Claude phrasing with Codex/local artifact equivalents.
- Removed the unsupported `compatibility` frontmatter field from OpenSpec skills.
- Rewrote adapted text files as UTF-8 without BOM so frontmatter validation works on Windows.

## Validation

```powershell
$failed=@()
Get-ChildItem -Directory .codex\skills | ForEach-Object {
  python C:\Users\Admin\.codex\skills\.system\skill-creator\scripts\quick_validate.py $_.FullName | Out-Null
  if ($LASTEXITCODE -ne 0) { $failed += $_.Name }
}
if ($failed.Count -eq 0) { "all skill frontmatter valid" } else { $failed -join ", " }
```

```powershell
python -c "import yaml, pathlib; [yaml.safe_load(p.read_text(encoding='utf-8')) for p in pathlib.Path('.codex/skills').rglob('openai.yaml')]; print('openai yaml ok')"
```

## Notes

- The skills still retain their original bundled resources, templates, scripts, and license files.
- Some domain references may still mention Anthropic or Claude models when the content is explicitly about Anthropic APIs or example model identifiers.
- The duplicate project-local `skill-creator` copy was removed; use Codex's system `skill-creator` instead.
- If upstream skills are refreshed, rerun the adaptation and validation steps before committing.
