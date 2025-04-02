import { $ } from "execa";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getNodeMajorVersion } from "./get-node-major-version.js";

export async function installTypeScript({ starterFilesPath }) {
  const nodeMajorVersion = await getNodeMajorVersion();

  const devDependencies = [
    "typescript",
    "tsx",
    "@tsconfig/node-lts",
    `@types/node${nodeMajorVersion ? `@${nodeMajorVersion}` : ""}`,
  ];

  await $`npm i -D ${devDependencies}`;

  await $`npm pkg set ${"scripts.start=tsx ./src/main.ts"}`;
  await $`npm pkg set ${"scripts.build=tsc"}`;

  await copyFile(resolve(starterFilesPath, "tsconfig.json"), "tsconfig.json");
}
