import { execFileSync, spawn } from 'node:child_process';

const APP_ID = 'com.oogachaka.client';
const liveReload = process.argv.includes('--live');
const host = process.env.LIVE_HOST ?? 'localhost';
const port = process.env.LIVE_PORT ?? '3000';

if (liveReload) {
  try {
    await fetch(`http://${host}:${port}`);
  } catch {
    console.error(`Dev server is not reachable at http://${host}:${port}. Run \`bun dev\` first.`);
    process.exit(1);
  }
}

const { devices } = JSON.parse(
  execFileSync('xcrun', ['simctl', 'list', 'devices', 'available', '--json'], { encoding: 'utf8' }),
);
const iphones = Object.values(devices)
  .flat()
  .filter((device) => device.isAvailable && device.name.startsWith('iPhone'));
const booted = iphones.filter((device) => device.state === 'Booted');
const requested = process.env.IOS_SIMULATOR;
const target = requested
  ? iphones.find((device) => device.udid === requested || device.name === requested)
  : (booted.find((device) => device.name === 'iPhone 17') ??
    booted[0] ??
    iphones.find((device) => device.name === 'iPhone 17') ??
    iphones[0]);

if (!target) {
  console.error(
    requested ? `iPhone simulator not found: ${requested}` : 'No available iPhone simulator found.',
  );
  process.exit(1);
}

console.log(
  `Running on ${target.name} (${target.udid})${liveReload ? ` with live reload: http://${host}:${port}` : ''}`,
);
if (target.state !== 'Booted') {
  execFileSync('xcrun', ['simctl', 'boot', target.udid], { stdio: 'inherit' });
  execFileSync('xcrun', ['simctl', 'bootstatus', target.udid, '-b'], { stdio: 'inherit' });
}
execFileSync('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', target.udid], {
  stdio: 'inherit',
});

// The first launch may exit right away, so relaunch once the app is installed.
const relaunch = () => {
  try {
    execFileSync('xcrun', ['simctl', 'terminate', target.udid, APP_ID], { stdio: 'ignore' });
  } catch {
    // The first launch may have already exited.
  }
  execFileSync('xcrun', ['simctl', 'launch', target.udid, APP_ID], { stdio: 'inherit' });
};

const capArgs = ['cap', 'run', 'ios', '--no-sync', '--target', target.udid];
// Capacitor's TTY spinner can print a new line for every frame in some terminals.
const capEnv = { ...process.env, CI: '1' };

if (!liveReload) {
  execFileSync('bunx', capArgs, { stdio: 'inherit', env: capEnv });
  relaunch();
} else {
  // In live reload mode `cap run` stays alive until Ctrl+C, then reverts the native config itself.
  const child = spawn('bunx', [...capArgs, '--live-reload', '--host', host, '--port', port], {
    stdio: ['inherit', 'pipe', 'inherit'],
    env: capEnv,
  });
  let relaunched = false;
  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
    if (!relaunched && chunk.toString().includes('live reload')) {
      relaunched = true;
      relaunch();
    }
  });
  // Let the child handle SIGINT so it can restore capacitor.config.json before exiting.
  process.on('SIGINT', () => {});
  child.on('exit', (code) => process.exit(code ?? 0));
}
