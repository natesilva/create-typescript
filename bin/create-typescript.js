#!/usr/bin/env node
import { $ } from "execa";
import meow from "meow";
import { writeFile } from "node:fs/promises";
import yoctoSpinner from "yocto-spinner";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const cli = meow(
  `
  Usage
    $ create-typescript

  Options
    --help      Show this help message
    --vitest    Install vitest and configure it
    --eslint    Install eslint and configure it
`,
  {
    importMeta: import.meta,
    flags: {
      vitest: {
        type: "boolean",
        default: false,
      },
      eslint: {
        type: "boolean",
        default: false,
      },
    },
  },
);

const spinner = yoctoSpinner({ text: "Initializing TypeScript project..." }).start();

await $`npm init -y`;
await $`npm pkg set type=module`;
await $`npm pkg delete main`;

let nodeMajorVersion = undefined;

try {
  spinner.text = "Pinning Node.js version...";
  await $`volta pin node@lts`;
  // get the version number that was pinned
  const { stdout: voltaOutput } = await $`volta list --current node --format plain`;
  const match = voltaOutput.match(/runtime node@(\d+)\.\d+\.\d+\s+\(current @/);
  nodeMajorVersion = match ? parseInt(match[1], 10) : undefined;
  spinner.text = `Pinned Node.js version ${nodeMajorVersion}`;
} catch (error) {
  // this just means that the volta command is not installed
}

const devDependencies = [
  "typescript",
  "tsx",
  "@tsconfig/node-lts",
  `@types/node${nodeMajorVersion ? `@${nodeMajorVersion}` : ""}`,
];

spinner.text = "Installing dev dependencies...";
await $`npm i -D ${devDependencies}`;

spinner.text = "Initializing TypeScript project...";
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

if (cli.flags.vitest) {
  spinner.text = "Installing Vitest...";
  await $`npm i -D vitest @vitest/ui @vitest/coverage-v8`;
  await $`npm pkg set scripts.test=${"vitest run"}`;
  await $`npm pkg set ${"scripts.test:watch=vitest watch --ui"}`;
  await $`npm pkg set ${"scripts.test:coverage=vitest run --coverage"}`;
}

if (cli.flags.eslint) {
  spinner.text = "Installing ESLint...";
  await $`npm i -D eslint @eslint/js typescript typescript-eslint`;

  await pipeline(
    createReadStream("../starter-files/eslint.config.mjs"),
    createWriteStream("eslint.config.mjs"),
  );

  await $`npm pkg set scripts.lint=${"eslint ."}`;
  await $`npm pkg set ${"scripts.lint:fix=eslint --fix ."}`;
}

spinner.success("Project created successfully!");
