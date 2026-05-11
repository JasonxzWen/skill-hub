import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const skillPath = '.agents/skills/html-work-reports/SKILL.md';
const skill = fs.readFileSync(skillPath, 'utf8');

function frontmatterValue(name) {
  const match = skill.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return match?.[1] || '';
}

test('html-work-reports has a narrow trigger description', () => {
  const description = frontmatterValue('description');

  assert.match(description, /non-trivial planning/);
  assert.match(description, /code review/);
  assert.match(description, /architecture walkthroughs/);
  assert.match(description, /copy\/export controls/);
  assert.match(description, /avoid simple answers and normal code edits/);
  assert.doesNotMatch(description, /dashboards/);
});

test('html-work-reports documents positive and negative trigger examples', () => {
  assert.match(skill, /## Trigger Examples/);
  assert.match(skill, /交互式 review 总结/);
  assert.match(skill, /模块调用链/);
  assert.match(skill, /Do not use this skill for:/);
  assert.match(skill, /direct code implementation or bug fixes/);
  assert.match(skill, /slide decks; use `frontend-slides`/);
});

test('html-work-reports keeps detailed patterns in references', () => {
  assert.match(skill, /references\/html-report-patterns\.md/);
  assert.ok(skill.length < 6000, 'SKILL.md should stay concise enough for progressive disclosure');
});
