import { spawn } from 'node:child_process';

function runCommand(command, name) {
  const child = spawn(command, {
    shell: true,
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error(`[dev:local] failed to start ${name}`);
    console.error(error);
  });

  return child;
}

function resolveDevCommand() {
  const userAgent = (process.env.npm_config_user_agent ?? '').toLowerCase();

  if (userAgent.includes('pnpm/')) {
    return 'pnpm run dev:web';
  }

  if (userAgent.includes('yarn/')) {
    return 'yarn dev:web';
  }

  if (userAgent.includes('bun/')) {
    return 'bun run dev:web';
  }

  return 'npm run dev:web';
}

const captchaServer = runCommand('node scripts/captchaVerifyServer.mjs', 'captcha server');
const viteDev = runCommand(resolveDevCommand(), 'vite dev server');

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (!captchaServer.killed) {
    captchaServer.kill('SIGTERM');
  }

  if (!viteDev.killed) {
    viteDev.kill('SIGTERM');
  }

  setTimeout(() => {
    process.exit(code);
  }, 200);
}

captchaServer.on('exit', (code) => {
  if (shuttingDown) {
    return;
  }

  if (code !== 0) {
    console.error(`[dev:local] captcha server exited with code ${code ?? 'unknown'}`);
    shutdown(code ?? 1);
  }
});

viteDev.on('exit', (code) => {
  if (shuttingDown) {
    return;
  }

  if (code !== 0) {
    console.error(`[dev:local] vite exited with code ${code ?? 'unknown'}`);
    shutdown(code ?? 1);
    return;
  }

  shutdown(0);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
