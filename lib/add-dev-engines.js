import { updatePackageJson } from "./update-package-json.js";

/**
 * Configures the package.json to recognize `pnpm` as the preferred package manager. This
 * will cause `npm` to refuse to run!
 *
 * Do this last. After running this, `pkg` and other commands that `pnpm` passes through
 * to `npm` will no longer work!
 */
export async function addDevEngines() {
	await updatePackageJson((pkg) => {
		pkg.devEngines = {
			...pkg.devEngines,
			packageManager: {
				...pkg.devEngines?.packageManager,
				name: "pnpm",
				onFail: "ignore",
			},
		};
	});
}
