import { $ } from "execa";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

export async function installEslint({ starterFilesPath }) {
  await $`npm i -D eslint @eslint/js typescript typescript-eslint`;
  await copyFile(resolve(starterFilesPath, "eslint.config.mjs"), "eslint.config.mjs");
  await $`npm pkg set scripts.lint=${"eslint ."}`;
  await $`npm pkg set ${"scripts.lint:fix=eslint --fix ."}`;
}
