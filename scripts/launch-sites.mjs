import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const npm = platform() === 'win32' ? 'npm.cmd' : 'npm';
const useShell = platform() === 'win32';
const children = [];

function run(args) {
  const child = spawn(npm, args, {
    stdio: 'inherit',
    shell: useShell,
  });
  children.push(child);
  return child;
}

function stopChildren() {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
}

const staticBuild = run(['run', 'build:static']);

staticBuild.on('exit', (code, signal) => {
  if (code !== 0 || signal) {
    stopChildren();
    process.exitCode = code ?? 1;
    return;
  }

  run(['run', 'preview:static']);
  run(['run', 'dev:dynamic']);
});

process.on('SIGINT', () => {
  stopChildren();
  process.exit(130);
});

process.on('SIGTERM', () => {
  stopChildren();
  process.exit(143);
});
