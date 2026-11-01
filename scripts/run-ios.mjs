import { execFileSync } from 'node:child_process';

const { devices } = JSON.parse(execFileSync('xcrun', ['simctl', 'list', 'devices', 'available', '--json'], { encoding: 'utf8' }));
const iphones = Object.values(devices).flat().filter((device) => device.isAvailable && device.name.startsWith('iPhone'));
const booted = iphones.filter((device) => device.state === 'Booted');
const requested = process.env.IOS_SIMULATOR;
const target = requested
  ? iphones.find((device) => device.udid === requested || device.name === requested)
  : booted.find((device) => device.name === 'iPhone 17') ?? booted[0] ?? iphones.find((device) => device.name === 'iPhone 17') ?? iphones[0];

if (!target) {
  console.error(requested ? `iPhone simulator not found: ${requested}` : 'No available iPhone simulator found.');
  process.exit(1);
}

console.log(`Running on ${target.name} (${target.udid})`);
if (target.state !== 'Booted') {
  execFileSync('xcrun', ['simctl', 'boot', target.udid], { stdio: 'inherit' });
  execFileSync('xcrun', ['simctl', 'bootstatus', target.udid, '-b'], { stdio: 'inherit' });
}
execFileSync('open', ['-a', 'Simulator', '--args', '-CurrentDeviceUDID', target.udid], { stdio: 'inherit' });
// Capacitor's TTY spinner can print a new line for every frame in some terminals.
execFileSync('bunx', ['cap', 'run', 'ios', '--no-sync', '--target', target.udid], {
  stdio: 'inherit',
  env: { ...process.env, CI: '1' },
});
try {
  execFileSync('xcrun', ['simctl', 'terminate', target.udid, 'com.oogachaka.client'], { stdio: 'ignore' });
} catch {
  // The first launch may have already exited.
}
execFileSync('xcrun', ['simctl', 'launch', target.udid, 'com.oogachaka.client'], { stdio: 'inherit' });
