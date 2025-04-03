import { $ } from "execa";
import humanizeString from "humanize-string";
import { writeFile } from "node:fs/promises";
import titleize from "titleize";

export async function createReadme() {
  const { stdout: quotedProjectName } = await $`npm pkg get name`;
  const projectName = quotedProjectName.replace(/"/g, "");

  const humanizedProjectName = humanizeString(projectName);
  const titleizedProjectName = titleize(humanizedProjectName);

  const readmeText = `# ${titleizedProjectName}

**${titleizedProjectName}** is a TypeScript project created with the create-typescript CLI.
`;
  await writeFile("README.md", readmeText);
}
