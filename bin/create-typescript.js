#!/usr/bin/env node
import meow from "meow";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yoctoSpinner from "yocto-spinner";
import { createReadme } from "../lib/create-readme.js";
import { initializeProject } from "../lib/initialize-project.js";
import { installEslint } from "../lib/install-eslint.js";
import { installPrettier } from "../lib/install-prettier.js";
import { installTypeScript } from "../lib/install-type-script.js";
import { installVitest } from "../lib/install-vitest.js";

const cli = meow(
  `
  Usage
    $ create-typescript [options]

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
    allowUnknownFlags: true,
    inferType: true,
  }
);

// Process npm init arguments
// When used as `npm init typescript-app --all`,
// npm passes `--all` as a positional argument, not a flag
// We need to check for these and convert them to flags
if (cli.input.length > 0) {
  for (const arg of cli.input) {
    if (arg.startsWith("--")) {
      // Convert positional args that look like flags to actual flags
      const flagName = arg.slice(2); // Remove the '--'
      if (flagName in cli.flags) {
        cli.flags[flagName] = true;
      }
    }
  }
}

const spinner = yoctoSpinner().start();

const basePath = fileURLToPath(import.meta.url);
const starterFilesPath = resolve(basePath, "..", "..", "starter-files");
const options = { starterFilesPath };

spinner.text = "Initializing project…";
await initializeProject(options);

spinner.text = "Creating README.md…";
await createReadme(options);

spinner.text = "Installing TypeScript dev dependencies…";
await installTypeScript(options);

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
