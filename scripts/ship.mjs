#!/usr/bin/env node
/*
 * scripts/ship.mjs
 *
 * One-command commit + push. Usage:
 *
 *   npm run ship -- "your commit message"
 *
 * Equivalent to:
 *
 *   git add -A
 *   git commit -m "your commit message"
 *   git push
 *
 * If the commit message is omitted, the script exits with a helpful error
 * rather than committing with a placeholder.
 */
import { execSync } from 'node:child_process';

const message = process.argv.slice(2).join(' ').trim();

if (!message)
{
  console.error('\n  Usage: npm run ship -- "your commit message"\n');
  process.exit(1);
}

function run(command)
{
  execSync(command, { stdio: 'inherit' });
}

try
{
  run('git add -A');

  // Skip the commit step if there's nothing staged — saves a noisy error
  // when the user just wants to push existing commits.
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (status.length > 0)
  {
    run(`git commit -m ${JSON.stringify(message)}`);
  }
  else
  {
    console.log('\n  No staged changes — pushing existing commits.\n');
  }

  run('git push');
}
catch (error)
{
  process.exit(error.status || 1);
}
