import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const port = process.env.LIVE_PORT ?? '3100';
const host = process.env.LIVE_HOST ?? 'localhost';
const url = `http://${host}:${port}`;
try {
  await fetch(url);
  console.error(`${url} is already in use. Set LIVE_PORT to an available port.`);
  process.exit(1);
} catch (error) {
  if (error instanceof Error && error.message.includes('already in use')) throw error;
}

const server = spawn('bun', ['run', 'dev', '--', '--port', port], { stdio: 'inherit' });
let serverExited = false;
server.on('exit', () => {
  serverExited = true;
});
let app;
function cleanup() {
  app?.kill('SIGINT');
  server.kill('SIGTERM');
}
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

try {
  let ready = false;
  for (let attempt = 0; attempt < 60 && !serverExited; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await delay(1000);
  }
  if (!ready) throw new Error(`Development server did not start at ${url}`);
  app = spawn('node', ['scripts/run-ios.mjs', '--live'], {
    stdio: 'inherit',
    env: { ...process.env, LIVE_HOST: host, LIVE_PORT: port },
  });
  const code = await new Promise((resolve) => app.on('exit', resolve));
  process.exitCode = code ?? 0;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  cleanup();
}
