import { $ } from "execa";
import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { npmCommand } from "./npm-or-pnpm.js";

export async function initializeProject({ starterFilesPath }) {
  if (npmCommand === "pnpm") {
    await $`${npmCommand} init --no-init-package-manager --init-type module`;
  } else {
    await $`${npmCommand} init -y`;
    await $`${npmCommand} pkg set type=module`;
  }
  await $`${npmCommand} pkg delete main`;
  await $`${npmCommand} pkg delete scripts.test`;
  await $`${npmCommand} pkg set license=UNLICENSED`;

  try {
    await $`volta pin node@lts`;
  } catch (error) {
    // this just means that the volta command is not installed
  }

  await copyFile(resolve(starterFilesPath, "gitattributes"), ".gitattributes");
  await copyFile(resolve(starterFilesPath, "gitignore"), ".gitignore");
  await copyFile(resolve(starterFilesPath, "editorconfig"), ".editorconfig");

  await mkdir("src", { recursive: true });
  await copyFile(resolve(starterFilesPath, "main.ts"), "./src/main.ts");
}
