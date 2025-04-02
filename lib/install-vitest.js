import { $ } from "execa";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function installVitest({ starterFilesPath }) {
  await $`npm i -D vitest @vitest/ui @vitest/coverage-v8`;
  await copyFile(resolve(starterFilesPath, "vitest.config.ts"), "vitest.config.ts");
  await $`npm pkg set scripts.test=${"vitest run"}`;
  await $`npm pkg set ${"scripts.test:watch=vitest watch --ui"}`;
  await $`npm pkg set ${"scripts.test:coverage=vitest run --coverage"}`;
}
