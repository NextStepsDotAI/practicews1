// jest.config.ts — configuration for the Jest test runner.
// Written in TypeScript (instead of .json) purely so we can leave comments here.
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // lets Jest run .ts test files directly, using tsconfig.json for type info
  testEnvironment: 'node', // we're testing backend/Node code, not browser DOM code
  testMatch: ['**/src/**/*.test.ts'], // every topic folder keeps its test next to its source file
  verbose: true, // print each test name as it runs — useful while learning
  clearMocks: true, // automatically reset jest.fn() mocks between tests to avoid state leaking
};

export default config;
