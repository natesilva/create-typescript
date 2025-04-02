#!/usr/bin/env node
import { $ } from "execa";
import { writeFile } from "node:fs/promises";

await $`npm init -y`;
await $`npm pkg set type=module`;
await $`npm pkg delete main`;

let nodeMajorVersion = undefined;

try {
  await $`volta pin node@lts`;
  // get the version number that was pinned
  const { stdout: voltaOutput } = await $`volta list --current node --format plain`;
  const match = voltaOutput.match(/runtime node@(\d+)\.\d+\.\d+\s+\(current @/);
  nodeMajorVersion = match ? parseInt(match[1], 10) : undefined;
} catch (error) {
  // this just means that the volta command is not installed
}

const devDependencies = [
  "typescript",
  "tsx",
  "@tsconfig/node-lts",
  `@types/node${nodeMajorVersion ? `@${nodeMajorVersion}` : ""}`,
];

await $`npm i -D ${devDependencies}`;

const tsconfig = {
  extends: "@tsconfig/node-lts/tsconfig.json",
  compilerOptions: {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    rootDir: ".",
    outDir: "dist",
    sourceMap: true,
  },
  exclude: ["node_modules", "cdk.out", "dist"],
};

await writeFile("tsconfig.json", JSON.stringify(tsconfig, null, 2) + "\n");

await $`mkdir src`;
await writeFile("./src/main.ts", "console.log('Hello, world!');\n");

await $`npm pkg set ${"scripts.start=tsx ./src/main.ts"}`;
await $`npm pkg set ${"scripts.build=tsc"}`;
await $`npm pkg delete scripts.test`;
