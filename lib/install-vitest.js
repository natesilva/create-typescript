import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { $ } from "execa";
import { npmCommand } from "./npm-or-pnpm.js";

export async function installVitest({ starterFilesPath }) {
  await $`${npmCommand} i -D vitest @vitest/ui @vitest/coverage-v8`;
  await copyFile(resolve(starterFilesPath, "vitest.config.ts"), "vitest.config.ts");
  await $`${npmCommand} pkg set scripts.test=${"vitest run"}`;
  await $`${npmCommand} pkg set ${"scripts.test:watch=vitest watch --ui"}`;
  await $`${npmCommand} pkg set ${"scripts.test:coverage=vitest run --coverage"}`;
}
