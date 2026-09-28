import { $ } from "execa";

export async function getNodeMajorVersion() {
  try {
    // get the version number that was pinned
    const { stdout: miseOutput } = await $`mise current node`;
    const match = miseOutput.match(/^(\d+)\.\d+\.\d+/);
    const nodeMajorVersion = match ? parseInt(match[1], 10) : undefined;
    return nodeMajorVersion;
  } catch (_error) {
    // this just means that the mise command is not installed
  }

  // fallback to node --version
  const { stdout } = await $`node --version`;
  const match = stdout.match(/v(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  // otherwise, okay to return undefined
  return undefined;
}
