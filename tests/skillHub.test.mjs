import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  applyInstall,
  getStatus,
  planInstall,
  readCapabilityIndex,
} from '../src/skillHub.mjs';

test('plans default install into Codex skill directory', () => {
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-hub-plan-'));
  const plan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });

  assert.equal(plan.profileName, 'minimal');
  assert.ok(plan.items.some((item) => item.componentId === 'skill:html-work-reports'));
  assert.ok(plan.items.every((item) => item.dest.includes(`${path.sep}.agents${path.sep}skills${path.sep}`)));
});

test('installs skills, writes lock, and reports current status', () => {
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-hub-install-'));
  const plan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });
  const result = applyInstall(plan);

  assert.ok(result.installed.length > 0);
  assert.ok(fs.existsSync(path.join(targetDir, '.agents', 'skills', 'html-work-reports', 'SKILL.md')));
  assert.ok(fs.existsSync(path.join(targetDir, '.skill-hub', 'lock.json')));
  assert.ok(fs.existsSync(result.report));

  const status = getStatus({ targetDir, index: readCapabilityIndex() });
  assert.equal(status.missing.length, 0);
  assert.equal(status.updates.length, 0);
  assert.ok(status.current.length > 0);
});

test('skips existing skills unless overwrite is requested', () => {
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-hub-skip-'));
  const firstPlan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });
  applyInstall(firstPlan);

  const secondPlan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });
  const secondResult = applyInstall(secondPlan);

  assert.equal(secondResult.installed.length, 0);
  assert.equal(secondResult.skipped.length, secondPlan.items.length);
});
