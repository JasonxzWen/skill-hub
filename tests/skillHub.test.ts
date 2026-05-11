import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from 'bun:test';

import {
  applyInstall,
  getStatus,
  planInstall,
  readCapabilityIndex,
} from '../src/skillHub';

test('plans default install into Codex skill directory', () => {
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-hub-plan-'));
  const plan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });

  expect(plan.profileName).toBe('minimal');
  expect(plan.items.some((item) => item.componentId === 'skill:html-work-reports')).toBe(true);
  expect(plan.items.some((item) => item.componentId === 'skill:grill-me')).toBe(true);
  expect(plan.items.some((item) => item.componentId === 'skill:diagnose')).toBe(true);
  expect(plan.items.some((item) => item.componentId === 'skill:prototype')).toBe(true);
  expect(plan.items.every((item) => item.dest.includes(`${path.sep}.agents${path.sep}skills${path.sep}`))).toBe(true);
});

test('installs skills, writes lock, and reports current status', () => {
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-hub-install-'));
  const plan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });
  const result = applyInstall(plan);

  expect(result.installed.length).toBeGreaterThan(0);
  expect(fs.existsSync(path.join(targetDir, '.agents', 'skills', 'html-work-reports', 'SKILL.md'))).toBe(true);
  expect(fs.existsSync(path.join(targetDir, '.agents', 'skills', 'grill-me', 'SKILL.md'))).toBe(true);
  expect(fs.existsSync(path.join(targetDir, '.agents', 'skills', 'diagnose', 'SKILL.md'))).toBe(true);
  expect(fs.existsSync(path.join(targetDir, '.agents', 'skills', 'prototype', 'SKILL.md'))).toBe(true);
  expect(fs.existsSync(path.join(targetDir, '.skill-hub', 'lock.json'))).toBe(true);
  expect(fs.existsSync(result.report)).toBe(true);

  const status = getStatus({ targetDir, index: readCapabilityIndex() });
  expect(status.missing.length).toBe(0);
  expect(status.updates.length).toBe(0);
  expect(status.current.length).toBeGreaterThan(0);
});

test('skips existing skills unless overwrite is requested', () => {
  const targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-hub-skip-'));
  const firstPlan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });
  applyInstall(firstPlan);

  const secondPlan = planInstall({ targetDir, profile: 'minimal', agents: ['codex'] });
  const secondResult = applyInstall(secondPlan);

  expect(secondResult.installed.length).toBe(0);
  expect(secondResult.skipped.length).toBe(secondPlan.items.length);
});
