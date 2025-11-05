import { writeFile } from "node:fs/promises";
import { $ } from "execa";
import humanizeString from "humanize-string";
import titleize from "titleize";
import { npmCommand } from "./npm-or-pnpm.js";

export async function createReadme() {
  const { stdout: quotedProjectName } = await $`${npmCommand} pkg get name`;
  const projectName = quotedProjectName.replace(/"/g, "");

  const humanizedProjectName = humanizeString(projectName);
  const titleizedProjectName = titleize(humanizedProjectName);

  const readmeText = `# ${titleizedProjectName}

**${titleizedProjectName}** is a TypeScript project created with the create-typescript CLI.
`;
  await writeFile("README.md", readmeText);
}
