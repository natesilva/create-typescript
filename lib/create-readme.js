import { readFile, writeFile } from "node:fs/promises";
import humanizeString from "humanize-string";
import titleize from "titleize";

export async function createReadme() {
	const { name: projectName } = JSON.parse(
		await readFile("package.json", "utf8"),
	);

	const humanizedProjectName = humanizeString(projectName);
	const titleizedProjectName = titleize(humanizedProjectName);

	const readmeText = `# ${titleizedProjectName}

**${titleizedProjectName}** is a TypeScript project created with the create-typescript CLI.
`;
	await writeFile("README.md", readmeText);
}
