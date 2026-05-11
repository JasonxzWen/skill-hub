import fs from 'node:fs';
import { expect, test } from 'bun:test';

const agents = fs.readFileSync('AGENTS.md', 'utf8');
const routing = fs.readFileSync('docs/skill-routing.md', 'utf8');
const capabilityMap = fs.readFileSync('docs/capability-map.md', 'utf8');

test('stable routing entry resolves diagnose overlap', () => {
  expect(agents).toContain('Plan/design pressure testing: use `grill-me`');
  expect(agents).toContain('Runtime bugs/performance regressions: use `diagnose`');
  expect(agents).toContain('agent-introspection-debugging');
  expect(routing).toContain('Diagnose runtime bug, failing command, flaky behavior, or performance regression');
  expect(capabilityMap).toContain('`diagnose` owns unknown runtime bugs and performance regressions');
});

test('stable routing entry resolves prototype overlap', () => {
  expect(agents).toContain('Throwaway design exploration: use `prototype`');
  expect(agents).toContain('`frontend-design` for production UI');
  expect(routing).toContain('Build throwaway prototype to answer one design question');
  expect(capabilityMap).toContain('`prototype` owns disposable learning artifacts only');
});
