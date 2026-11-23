import { cloudflare } from '@cloudflare/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/** The walkthrough tests the page alone, so it sets this to leave the server out of its build and preview. */
export const SITE_ONLY_VARIABLE = 'NOHA_SITE_ONLY';

/**
 * The admin sign-in of the hub on this computer only: development values, already public in this repository. They are given to
 * the Worker by `vite` when it serves (`npm run dev`) and by the local-server test on its command line. A build never carries
 * them, so a deploy has none and its hub refuses every sign-in until the real secrets are set.
 */
export const LOCAL_ADMIN_SECRETS = { ADMIN_PASSWORD: 'teach-2468', ADMIN_TOTP_SECRET: 'JBSWY3DPEHPK3PXP' } as const;

/** Given to the hub the same way, so that a hub on this computer starts with a sample school; a school's hub has no such variable and starts with none. */
export const LOCAL_SAMPLE_SCHOOL = { SAMPLE_SCHOOL: '1' } as const;

const serverPlugins = (serving: boolean) => [cloudflare(serving ? { config: { vars: { ...LOCAL_ADMIN_SECRETS, ...LOCAL_SAMPLE_SCHOOL } } } : {})];

// `base: './'` plus hash routing lets the same build run from any GitHub Pages path.
export default defineConfig(({ command }) => ({
  base: './',
  // The page reads `NOHA_SITE_ONLY` (see src/app/config.ts); no other variable with this prefix is shown to it.
  envPrefix: ['VITE_', SITE_ONLY_VARIABLE],
  plugins: [react(), ...(process.env[SITE_ONLY_VARIABLE] === '1' || process.env.VITEST ? [] : serverPlugins(command === 'serve'))],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
