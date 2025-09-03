import { $ } from "execa";
import { npmOrPnpm } from "./npm-or-pnpm";

/**
 * Execute a command using either npm or pnpm.
 *
 * @param {string} command - The command to execute.
 * @param {string} options.packageManager - The package manager to use. Default: use the
 *   package manager that was used to start this process, or "npm" if not known.
 * @param {string[]} options.arguments - Array of arguments to pass to the command.
 */
export async function npmExec(
  command,
  { packageManager = npmOrPnpm(), arguments: args = [] } = {},
) {
  if (packageManager === "pnpm") {
    await $`pnpm ${command} ${args}`;
  } else {
    await $`npm ${command} ${args}`;
  }
}
