#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import meow from "meow";
import yoctoSpinner from "yocto-spinner";
import { addDevEngines } from "../lib/add-dev-engines.js";
import { createReadme } from "../lib/create-readme.js";
import { enableDecorators } from "../lib/enable-decorators.js";
import { initializeProject } from "../lib/initialize-project.js";
import { installBiome } from "../lib/install-biome.js";
import { installTypeScript } from "../lib/install-type-script.js";
import { installVitest } from "../lib/install-vitest.js";
import { npmCommand, npmOrPnpm } from "../lib/npm-or-pnpm.js";

const cli = meow(
  `
  Usage
    $ create-typescript

  Options
    --help        Show this help message
    --recommended Install recommended dependencies (vitest, biome)
    --vitest      Install vitest and configure it
    --biome       Install biome and configure it
    --decorators  Enable experimental decorator support in TypeScript
    --block-npm   Add devEngines setting to force use of pnpm and block use of npm
                  (default: true if pnpm is being used to create the project)
                  (ignored if pnpm is not being used)
`,
  {
    importMeta: import.meta,
    flags: {
      recommended: {
        type: "boolean",
        default: false,
      },
      vitest: {
        type: "boolean",
        default: false,
      },
      biome: {
        type: "boolean",
        default: false,
      },
      decorators: {
        type: "boolean",
        default: false,
      },
      blockNpm: {
        type: "boolean",
        default: npmCommand === "pnpm",
      },
    },
  },
);

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

if (cli.flags.recommended || cli.flags.vitest) {
  spinner.text = "Installing Vitest…";
  await installVitest(options);
}

if (cli.flags.recommended || cli.flags.biome) {
  spinner.text = "Installing Biome…";
  await installBiome(options);
}

if (cli.flags.decorators) {
  spinner.text = "Enabling experimental decorator support in TypeScript…";
  await enableDecorators(options);
}

if (npmOrPnpm() === "pnpm") {
  spinner.text = "Adding devEngines setting to force use of pnpm…";
  await addDevEngines(options);
}

spinner.success("Project created successfully!");
