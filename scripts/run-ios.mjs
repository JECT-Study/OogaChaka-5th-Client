import { execFileSync } from 'node:child_process';

const { devices } = JSON.parse(execFileSync('xcrun', ['simctl', 'list', 'devices', 'booted', '--json'], { encoding: 'utf8' }));
const booted = Object.values(devices).flat().filter((device) => device.state === 'Booted' && device.name.startsWith('iPhone'));
const requested = process.env.IOS_SIMULATOR;
const target = requested
  ? booted.find((device) => device.udid === requested || device.name === requested)
  : booted.find((device) => device.name === 'iPhone 17') ?? booted[0];

if (!target) {
  console.error(requested ? `Booted iPhone simulator not found: ${requested}` : 'Boot an iPhone simulator before running bun run ios.');
  process.exit(1);
}

console.log(`Running on ${target.name} (${target.udid})`);
execFileSync('bunx', ['cap', 'run', 'ios', '--no-sync', '--target', target.udid], { stdio: 'inherit' });
