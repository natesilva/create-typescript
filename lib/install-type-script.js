import { $ } from "execa";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getNodeMajorVersion } from "./get-node-major-version.js";
import { npmCommand } from "./npm-or-pnpm.js";

export async function installTypeScript({ starterFilesPath }) {
  await $`${npmCommand} pkg set ${"exports=./dist/main.js"}`;

  const nodeMajorVersion = await getNodeMajorVersion();
  const devDependencies = [
    "del-cli",
    "typescript",
    "tsx",
    "@tsconfig/node-lts",
    "@tsconfig/node-ts",
    `@types/node${nodeMajorVersion ? `@${nodeMajorVersion}` : ""}`,
  ];

  await $`${npmCommand} i -D ${devDependencies}`;

  await $`${npmCommand} pkg set ${"scripts.start=tsx ./src/main.ts"}`;
  await $`${npmCommand} pkg set ${"scripts.clean=del-cli dist"}`;
  await $`${npmCommand} pkg set ${"scripts.build=tsc"}`;

  await copyFile(resolve(starterFilesPath, "tsconfig.json"), "tsconfig.json");
}
