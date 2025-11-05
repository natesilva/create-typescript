import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { $ } from "execa";
import { npmCommand } from "./npm-or-pnpm.js";

export async function installBiome({ starterFilesPath }) {
  await $`${npmCommand} i -D -E @biomejs/biome`;
  await copyFile(resolve(starterFilesPath, "biome.json"), "biome.json");

  await $`${npmCommand} pkg set scripts.lint=${"biome lint ."}`;
  await $`${npmCommand} pkg set ${"scripts.lint:fix=biome lint --write ."}`;
  await $`${npmCommand} pkg set ${"scripts.format=biome format --write ."}`;
  await $`${npmCommand} pkg set ${"scripts.check=biome check ."}`;
  await $`${npmCommand} pkg set ${"scripts.check:fix=biome check --write ."}`;
}
