import { defineConfig } from 'vitest/config';

/** `npm run test:server`: the real local server, started and stopped by the test itself. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['e2e/server.integration.ts', 'e2e/csp.integration.ts', 'e2e/joinByCode.integration.ts', 'e2e/firstRun.integration.ts'],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 240_000,
  },
});
