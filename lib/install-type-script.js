import { $ } from "execa";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getNodeMajorVersion } from "./get-node-major-version.js";

export async function installTypeScript({ starterFilesPath }) {
  await $`npm pkg set ${"exports=./dist/main.js"}`;

  const nodeMajorVersion = await getNodeMajorVersion();
  const devDependencies = [
    "del-cli",
    "typescript",
    "tsx",
    "@tsconfig/node-lts",
    "@tsconfig/node-ts",
    `@types/node${nodeMajorVersion ? `@${nodeMajorVersion}` : ""}`,
  ];

  await $`npm i -D ${devDependencies}`;

  await $`npm pkg set ${"scripts.start=tsx ./src/main.ts"}`;
  await $`npm pkg set ${"scripts.clean=del-cli dist"}`;
  await $`npm pkg set ${"scripts.build=tsc"}`;

  await copyFile(resolve(starterFilesPath, "tsconfig.json"), "tsconfig.json");
}
