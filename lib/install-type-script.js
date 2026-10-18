import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { $ } from "execa";
import { getNodeMajorVersion } from "./get-node-major-version.js";
import { npmCommand } from "./npm-or-pnpm.js";
import { updatePackageJson } from "./update-package-json.js";

export async function installTypeScript({ starterFilesPath }) {
	await updatePackageJson((pkg) => {
		pkg.exports = "./dist/main.js";
	});

	const nodeMajorVersion = await getNodeMajorVersion();
	const devDependencies = [
		"del-cli",
		"typescript",
		"@tsconfig/node-lts",
		"@tsconfig/node-ts",
		`@types/node${nodeMajorVersion ? `@${nodeMajorVersion}` : ""}`,
	];

	await $`${npmCommand} i -D ${devDependencies}`;

	await updatePackageJson((pkg) => {
		pkg.scripts = {
			...pkg.scripts,
			start: "node ./src/main.ts",
			clean: "del-cli dist",
			build: "tsc",
		};
	});

	await copyFile(resolve(starterFilesPath, "tsconfig.json"), "tsconfig.json");
}
