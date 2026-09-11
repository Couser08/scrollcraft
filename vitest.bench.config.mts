import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/benchmarks.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    testTimeout: 30_000,
  },
});
