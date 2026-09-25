// TOPIC: process & environment variables
//
// `process` is a global object giving info/control over the current Node
// process (env vars, argv, exit codes, platform, etc). Config like secrets or
// per-environment settings is conventionally passed via environment variables
// rather than hardcoded, and loaded here from a .env file via dotenv.

import * as dotenv from 'dotenv';

dotenv.config(); // loads variables from a .env file (if present) into process.env

export function getConfig() {
  return {
    port: Number(process.env.PORT ?? 3000),
    apiKey: process.env.API_KEY ?? '(not set — see .env.example)',
    nodeEnv: process.env.NODE_ENV ?? 'development',
    platform: process.platform, // e.g. 'win32', 'linux', 'darwin'
    nodeVersion: process.version, // e.g. 'v20.11.1'
  };
}

if (require.main === module) {
  console.log('Resolved config:', getConfig());
  console.log('Command-line args (argv):', process.argv.slice(2));
}
