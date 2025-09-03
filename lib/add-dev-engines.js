import { $ } from "execa";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { npmCommand } from "./npm-or-pnpm.js";

/**
 * Configures the package.json to recognize `pnpm` as the preferred package manager. This
 * will cause `npm` to refuse to run!
 *
 * Do this last. After running this, `pkg` and other commands that `pnpm` passes through
 * to `npm` will no longer work!
 */
export async function addDevEngines() {
  await $`${npmCommand} pkg set devEngines.packageManager.name=${"pnpm"}`;
}
