#!/usr/bin/env node
import meow from "meow";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yoctoSpinner from "yocto-spinner";
import { createReadme } from "../lib/create-readme.js";
import { initializeProject } from "../lib/initialize-project.js";
import { installDevDependencies } from "../lib/install-dev-dependencies.js";
import { installEslint } from "../lib/install-eslint.js";
import { installPrettier } from "../lib/install-prettier.js";
import { installVitest } from "../lib/install-vitest.js";

console.log(process.argv);

const basePath = fileURLToPath(import.meta.url);
const starterFilesPath = resolve(basePath, "..", "..", "starter-files");

const cli = meow(
  `
  Usage
    $ create-typescript

  Options
    --help      Show this help message
    --all       Install all recommended dependencies and configure them
    --vitest    Install vitest and configure it
    --eslint    Install eslint and configure it
    --prettier  Install prettier and configure it
`,
  {
    importMeta: import.meta,
    flags: {
      all: {
        type: "boolean",
        default: false,
      },
      vitest: {
        type: "boolean",
        default: false,
      },
      eslint: {
        type: "boolean",
        default: false,
      },
      prettier: {
        type: "boolean",
        default: false,
      },
    },
  },
);

const spinner = yoctoSpinner().start();
const options = { starterFilesPath };

spinner.text = "Initializing TypeScript project…";
await initializeProject(options);

spinner.text = "Creating README.md…";
await createReadme();

spinner.text = "Installing dev dependencies…";
await installDevDependencies(options);

if (cli.flags.all || cli.flags.vitest) {
  spinner.text = "Installing Vitest…";
  await installVitest(options);
}

if (cli.flags.all || cli.flags.eslint) {
  spinner.text = "Installing ESLint…";
  await installEslint(options);
}

if (cli.flags.all || cli.flags.prettier) {
  spinner.text = "Installing Prettier…";
  await installPrettier(options);
}

spinner.success("Project created successfully!");
