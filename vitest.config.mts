import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/benchmarks.test.ts',
      '**/e2e/**',
      '**/dist/**',
    ],
  },
});
