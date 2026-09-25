// TOPIC: Child processes
//
// `child_process` lets Node run other programs (shell commands, scripts,
// other executables) and communicate with them. Useful for shelling out to
// tools Node doesn't have a native API for (git, ffmpeg, etc).

import { execFile, execFileSync, spawn } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// execFileSync: blocks until the command finishes, returns its stdout.
// (execFile, not exec — avoids spawning a shell, which sidesteps shell-injection risk.)
export function getNodeVersionSync(): string {
  return execFileSync(process.execPath, ['--version']).toString().trim();
}

// execFile + promisify: async version of the same idea.
export async function getNodeVersionAsync(): Promise<string> {
  const { stdout } = await execFileAsync(process.execPath, ['--version']);
  return stdout.trim();
}

// spawn: for long-running processes or when you need to stream stdout/stderr
// incrementally instead of waiting for the whole thing to finish.
export function runNodeEval(script: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['-e', script]);
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(output.trim());
      else reject(new Error(`child process exited with code ${code}`));
    });
  });
}

if (require.main === module) {
  console.log('Node version (sync):', getNodeVersionSync());
  getNodeVersionAsync().then((v) => console.log('Node version (async):', v));
  runNodeEval('console.log(1 + 1)').then((out) => console.log('spawn result:', out));
}
