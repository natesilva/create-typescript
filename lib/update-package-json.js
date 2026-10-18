import { readFile, writeFile } from "node:fs/promises";

export async function updatePackageJson(update) {
	const pkg = JSON.parse(await readFile("package.json", "utf8"));
	update(pkg);
	await writeFile("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
}
