import { spawnSync } from "node:child_process";

/**
 * Configures the package.json to recognize `pnpm` as the preferred package manager. This
 * will cause `npm` to refuse to run!
 *
 * Do this last. After running this, `pkg` and other commands that `pnpm` passes through
 * to `npm` will no longer work!
 */
export async function addDevEngines() {
	spawnSync("npm", [
		"pkg",
		"set",
		"devEngines.packageManager.name=pnpm",
		"devEngines.packageManager.onFail=ignore",
	]);
}
