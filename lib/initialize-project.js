import { $ } from "execa";
import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

export async function initializeProject({ starterFilesPath }) {
  await $`npm init -y`;
  await $`npm pkg set type=module`;
  await $`npm pkg delete main`;
  await $`npm pkg delete scripts.test`;
  await $`npm pkg set license=UNLICENSED`;

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
