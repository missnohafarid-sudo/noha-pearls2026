import { defineConfig } from 'vitest/config';

/** `npm run test:stress` sets E2E_STRESS to run the cross-tab loop instead of the walkthrough. */
const stress = Boolean(process.env.E2E_STRESS);

export default defineConfig({
  test: {
    environment: 'node',
    include: [stress ? 'e2e/stress/*.e2e.ts' : 'e2e/*.e2e.ts'],
    globalSetup: ['e2e/globalSetup.ts'],
    fileParallelism: false,
    maxWorkers: 1,
    testTimeout: 60_000,
    hookTimeout: 240_000,
  },
});
