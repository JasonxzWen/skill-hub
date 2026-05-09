import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const HUB_ROOT = path.resolve(__dirname, '..');

export const AGENT_SKILL_DIRS = Object.freeze({
  codex: '.agents/skills',
  opencode: '.agents/skills',
  'claude-code': '.claude/skills',
});

export function readCapabilityIndex(hubRoot = HUB_ROOT) {
  const indexPath = path.join(hubRoot, 'capabilities', 'index.json');
  return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
}

export function listProfiles(index = readCapabilityIndex()) {
  return Object.entries(index.profiles).map(([id, profile]) => ({ id, ...profile }));
}

export function listComponents(index = readCapabilityIndex()) {
  return Object.entries(index.components).map(([id, component]) => ({ id, ...component }));
}

export function detectRepoSignals(targetDir) {
  const checks = {
    packageJson: 'package.json',
    tsconfig: 'tsconfig.json',
    pyproject: 'pyproject.toml',
    cargo: 'Cargo.toml',
    goMod: 'go.mod',
    codex: '.codex',
    claude: '.claude',
    agents: '.agents',
    opencode: '.opencode',
  };

  return Object.fromEntries(
    Object.entries(checks).map(([key, relativePath]) => [
      key,
      fs.existsSync(path.join(targetDir, relativePath)),
    ]),
  );
}

export function resolveProfile(index, profileName) {
  const profile = index.profiles[profileName];
  if (!profile) {
    throw new Error(`Unknown profile '${profileName}'. Available: ${Object.keys(index.profiles).join(', ')}`);
  }
  return profile;
}

export function resolveAgents(agentNames) {
  const agents = agentNames.length > 0 ? agentNames : ['codex'];
  for (const agent of agents) {
    if (!AGENT_SKILL_DIRS[agent]) {
      throw new Error(`Unsupported agent '${agent}'. Available: ${Object.keys(AGENT_SKILL_DIRS).join(', ')}`);
    }
  }
  return agents;
}

export function planInstall(options = {}) {
  const hubRoot = options.hubRoot || HUB_ROOT;
  const targetDir = path.resolve(options.targetDir || process.cwd());
  const index = options.index || readCapabilityIndex(hubRoot);
  const profileName = options.profile || index.defaults.profile;
  const profile = resolveProfile(index, profileName);
  const agents = resolveAgents(options.agents || []);
  const components = profile.components.map((id) => {
    const component = index.components[id];
    if (!component) {
      throw new Error(`Profile '${profileName}' references missing component '${id}'`);
    }
    return { id, ...component };
  });

  const items = [];
  for (const component of components) {
    if (component.kind !== 'skill') {
      continue;
    }

    const source = path.join(hubRoot, component.path);
    if (!fs.existsSync(source)) {
      throw new Error(`Component source does not exist: ${component.path}`);
    }

    for (const agent of agents) {
      const dest = path.join(targetDir, AGENT_SKILL_DIRS[agent], path.basename(component.path));
      items.push({
        componentId: component.id,
        componentVersion: component.version,
        agent,
        kind: component.kind,
        source,
        dest,
        exists: fs.existsSync(dest),
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    hubVersion: index.version,
    profileName,
    profile,
    agents,
    targetDir,
    signals: detectRepoSignals(targetDir),
    items,
  };
}

export function copyRecursive(source, dest) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      copyRecursive(path.join(source, entry.name), path.join(dest, entry.name));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
}

export function applyInstall(plan, options = {}) {
  const overwrite = Boolean(options.overwrite);
  const installed = [];
  const skipped = [];

  for (const item of plan.items) {
    if (item.exists && !overwrite) {
      skipped.push({ ...item, reason: 'exists' });
      continue;
    }

    if (item.exists && overwrite) {
      fs.rmSync(item.dest, { recursive: true, force: true });
    }

    copyRecursive(item.source, item.dest);
    installed.push(item);
  }

  const lock = writeLock(plan, { installed, skipped });
  const report = writeHtmlReport(plan, { installed, skipped, lock });

  return { installed, skipped, lock, report };
}

export function writeLock(plan, result) {
  const skillHubDir = path.join(plan.targetDir, '.skill-hub');
  fs.mkdirSync(skillHubDir, { recursive: true });
  const lockPath = path.join(skillHubDir, 'lock.json');
  const lock = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    hubVersion: plan.hubVersion,
    profile: plan.profileName,
    agents: plan.agents,
    components: [...result.installed, ...result.skipped].map((item) => ({
      id: item.componentId,
      version: item.componentVersion,
      agent: item.agent,
      dest: path.relative(plan.targetDir, item.dest).replaceAll(path.sep, '/'),
      status: result.installed.includes(item) ? 'installed' : 'skipped',
    })),
  };

  fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  return { path: lockPath, data: lock };
}

export function readLock(targetDir) {
  const lockPath = path.join(path.resolve(targetDir), '.skill-hub', 'lock.json');
  if (!fs.existsSync(lockPath)) {
    return null;
  }
  return {
    path: lockPath,
    data: JSON.parse(fs.readFileSync(lockPath, 'utf8')),
  };
}

export function getStatus(options = {}) {
  const targetDir = path.resolve(options.targetDir || process.cwd());
  const index = options.index || readCapabilityIndex(options.hubRoot || HUB_ROOT);
  const lock = readLock(targetDir);
  if (!lock) {
    return { targetDir, lock: null, current: [], missing: [], updates: [] };
  }

  const current = [];
  const missing = [];
  const updates = [];

  for (const installed of lock.data.components) {
    const component = index.components[installed.id];
    const dest = path.join(targetDir, installed.dest);
    const row = {
      ...installed,
      exists: fs.existsSync(dest),
      latestVersion: component?.version || null,
    };

    if (!row.exists) {
      missing.push(row);
    } else if (component && component.version !== installed.version) {
      updates.push(row);
    } else {
      current.push(row);
    }
  }

  return { targetDir, lock, current, missing, updates };
}

export function writeStatusReport(status, hubVersion) {
  const reportDir = path.join(status.targetDir, '.skill-hub', 'reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const filePath = path.join(reportDir, `status-${timestampForFile()}.html`);
  fs.writeFileSync(filePath, renderHtml({
    title: 'Skill Hub Status Report',
    summary: status.lock
      ? `${status.current.length} current, ${status.updates.length} updates, ${status.missing.length} missing.`
      : 'No Skill Hub lock file found.',
    rows: [
      ...status.current.map((row) => ({ ...row, state: 'current' })),
      ...status.updates.map((row) => ({ ...row, state: 'update available' })),
      ...status.missing.map((row) => ({ ...row, state: 'missing' })),
    ],
    hubVersion,
  }));
  return filePath;
}

export function writeHtmlReport(plan, result) {
  const reportDir = path.join(plan.targetDir, '.skill-hub', 'reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const filePath = path.join(reportDir, `init-${timestampForFile()}.html`);
  const rows = [
    ...result.installed.map((item) => ({
      id: item.componentId,
      agent: item.agent,
      dest: path.relative(plan.targetDir, item.dest).replaceAll(path.sep, '/'),
      state: 'installed',
    })),
    ...result.skipped.map((item) => ({
      id: item.componentId,
      agent: item.agent,
      dest: path.relative(plan.targetDir, item.dest).replaceAll(path.sep, '/'),
      state: item.reason,
    })),
  ];

  fs.writeFileSync(filePath, renderHtml({
    title: 'Skill Hub Init Report',
    summary: `${result.installed.length} installed, ${result.skipped.length} skipped for profile '${plan.profileName}'.`,
    rows,
    hubVersion: plan.hubVersion,
  }));
  return filePath;
}

function renderHtml({ title, summary, rows, hubVersion }) {
  const escapedRows = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.id)}</td>
      <td>${escapeHtml(row.agent || '')}</td>
      <td>${escapeHtml(row.state)}</td>
      <td><code>${escapeHtml(row.dest || '')}</code></td>
      <td>${escapeHtml(row.version || '')}</td>
      <td>${escapeHtml(row.latestVersion || '')}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; color: #172033; background: #f7f8fb; }
    main { max-width: 1120px; margin: 0 auto; padding: 28px; }
    .summary { background: #ffffff; border-left: 4px solid #2563eb; padding: 16px 18px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #d9deea; text-align: left; vertical-align: top; }
    th { background: #edf1f8; }
    code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.9em; }
    @media (max-width: 720px) { main { padding: 16px; } table { display: block; overflow-x: auto; } }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>Generated ${escapeHtml(new Date().toISOString())}. Hub version ${escapeHtml(hubVersion)}.</p>
    <section class="summary">${escapeHtml(summary)}</section>
    <table>
      <thead><tr><th>Component</th><th>Agent</th><th>Status</th><th>Path</th><th>Installed</th><th>Latest</th></tr></thead>
      <tbody>${escapedRows}</tbody>
    </table>
  </main>
</body>
</html>
`;
}

function timestampForFile() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function parseArgs(argv) {
  const options = { command: argv[0] || 'help', targetDir: null, agents: [], profile: null, dryRun: false, yes: false, overwrite: false, html: false };
  const positional = [];

  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--agent' || arg === '-a') {
      options.agents.push(argv[++index]);
    } else if (arg === '--profile' || arg === '-p') {
      options.profile = argv[++index];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.yes = true;
    } else if (arg === '--overwrite') {
      options.overwrite = true;
    } else if (arg === '--html') {
      options.html = true;
    } else {
      positional.push(arg);
    }
  }

  options.targetDir = positional[0] || process.cwd();
  return options;
}

export async function runCli(argv) {
  const options = parseArgs(argv);
  if (options.command === 'help' || options.command === '--help' || options.command === '-h') {
    printHelp();
    return;
  }

  if (options.command === 'profiles') {
    for (const profile of listProfiles()) {
      console.log(`${profile.id}\t${profile.description}`);
    }
    return;
  }

  if (options.command === 'components') {
    for (const component of listComponents()) {
      console.log(`${component.id}\t${component.kind}\t${component.path}`);
    }
    return;
  }

  if (options.command === 'init') {
    const plan = planInstall(options);
    printPlan(plan);
    if (options.dryRun) {
      return;
    }
    const result = applyInstall(plan, options);
    console.log(`Installed: ${result.installed.length}`);
    console.log(`Skipped: ${result.skipped.length}`);
    console.log(`Lock: ${path.relative(process.cwd(), result.lock.path)}`);
    console.log(`Report: ${path.relative(process.cwd(), result.report)}`);
    return;
  }

  if (options.command === 'status') {
    const index = readCapabilityIndex();
    const status = getStatus({ targetDir: options.targetDir, index });
    if (!status.lock) {
      console.log('No .skill-hub/lock.json found.');
      return;
    }
    console.log(`Current: ${status.current.length}`);
    console.log(`Updates: ${status.updates.length}`);
    console.log(`Missing: ${status.missing.length}`);
    if (options.html) {
      console.log(`Report: ${path.relative(process.cwd(), writeStatusReport(status, index.version))}`);
    }
    return;
  }

  throw new Error(`Unknown command '${options.command}'`);
}

function printPlan(plan) {
  console.log(`Target: ${plan.targetDir}`);
  console.log(`Profile: ${plan.profileName}`);
  console.log(`Agents: ${plan.agents.join(', ')}`);
  for (const item of plan.items) {
    const relDest = path.relative(plan.targetDir, item.dest).replaceAll(path.sep, '/');
    console.log(`- ${item.componentId} -> ${item.agent}:${relDest}${item.exists ? ' (exists)' : ''}`);
  }
}

function printHelp() {
  console.log(`skill-hub

Usage:
  skill-hub init [target] [--profile minimal] [--agent codex] [--dry-run] [--overwrite]
  skill-hub status [target] [--html]
  skill-hub profiles
  skill-hub components

Supported agents: ${Object.keys(AGENT_SKILL_DIRS).join(', ')}
`);
}
