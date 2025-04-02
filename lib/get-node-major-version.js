import { $ } from "execa";

export async function getNodeMajorVersion() {
  try {
    // get the version number that was pinned
    const { stdout: voltaOutput } = await $`volta list --current node --format plain`;
    const match = voltaOutput.match(/runtime node@(\d+)\.\d+\.\d+\s+\(current @/);
    const nodeMajorVersion = match ? parseInt(match[1], 10) : undefined;
    return nodeMajorVersion;
  } catch (error) {
    // this just means that the volta command is not installed
  }
}
