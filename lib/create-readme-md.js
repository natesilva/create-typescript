import { $ } from "execa";
import { writeFile } from "node:fs/promises";

export async function createReadmeMd() {
  const { stdout: quotedProjectName } = await $`npm pkg get name`;
  const projectName = quotedProjectName.replace(/"/g, "");
  const readmeText = `# ${projectName}

  ${projectName} is a TypeScript project created with the create-typescript CLI.
  `;
  await writeFile("README.md", readmeText);
}
