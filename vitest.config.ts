import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      // all tests in tests/dom will run in jsdom
      ["**/*spec.tsx", "happy-dom"],
      // all tests in tests/ with .edge.test.ts will run in edge-runtime
      ["**/*.spec.ts", "node"],
      // ...
    ],
    globals: true,
    setupFiles: "./tests/setup.js",
  },
});
