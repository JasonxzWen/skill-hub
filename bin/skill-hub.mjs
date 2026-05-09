#!/usr/bin/env node

import { runCli } from '../src/skillHub.mjs';

runCli(process.argv.slice(2)).catch((error) => {
  console.error(`skill-hub: ${error.message}`);
  process.exitCode = 1;
});
