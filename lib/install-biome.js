import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { $ } from "execa";
import { npmCommand } from "./npm-or-pnpm.js";
import { updatePackageJson } from "./update-package-json.js";

export async function installBiome({ starterFilesPath }) {
	await $`${npmCommand} i -D -E @biomejs/biome`;
	await copyFile(resolve(starterFilesPath, "biome.json"), "biome.json");

	await updatePackageJson((pkg) => {
		pkg.scripts = {
			...pkg.scripts,
			lint: "biome lint .",
			"lint:fix": "biome lint --write .",
			format: "biome format --write .",
			check: "biome check .",
			"check:fix": "biome check --write .",
		};
	});
}
