import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { $ } from "execa";
import { npmCommand } from "./npm-or-pnpm.js";
import { updatePackageJson } from "./update-package-json.js";

export async function installVitest({ starterFilesPath }) {
	await $`${npmCommand} i -D vitest @vitest/ui @vitest/coverage-v8`;
	await copyFile(
		resolve(starterFilesPath, "vitest.config.ts"),
		"vitest.config.ts",
	);

	await updatePackageJson(
		(pkg) =>
			(pkg.scripts = {
				...pkg.scripts,
				"test:watch": "vitest watch --ui",
				"test:coverage": "vitest run --coverage",
			}),
	);
}
