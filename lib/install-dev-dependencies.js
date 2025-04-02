import { $ } from "execa";
import { getNodeMajorVersion } from "./get-node-major-version.js";

export async function installDevDependencies({ spinner }) {
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
}
