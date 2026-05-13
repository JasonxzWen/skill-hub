import { expect, test } from 'bun:test';
import fs from 'node:fs';

test('package manifest keeps release validation and source traceability explicit', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')) as {
    files: string[];
    scripts: Record<string, string>;
  };

  expect(packageJson.scripts['validate:release']).toContain('bun run validate');
  expect(packageJson.scripts['validate:release']).toContain('bun run build');
  expect(packageJson.scripts['validate:release']).toContain('node bin/skill-hub.mjs --help');
  expect(packageJson.scripts['validate:release']).toContain('npm pack --dry-run');
  expect(packageJson.files).toContain('openspec/');
});
