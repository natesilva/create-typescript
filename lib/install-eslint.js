import { $ } from "execa";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { npmCommand } from "./npm-or-pnpm.js";

export async function installEslint({ starterFilesPath }) {
  await $`${npmCommand} i -D eslint @eslint/js typescript typescript-eslint`;
  await copyFile(resolve(starterFilesPath, "eslint.config.mjs"), "eslint.config.mjs");
  await $`${npmCommand} pkg set scripts.lint=${"eslint ."}`;
  await $`${npmCommand} pkg set ${"scripts.lint:fix=eslint --fix ."}`;
}
