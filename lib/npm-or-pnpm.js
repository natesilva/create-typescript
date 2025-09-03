/**
 * Returns the package manager that was used to run this script.
 *
 * Only understands npm and pnpm; returns undefined if the package manager is
 * unrecognized.
 */
export function npmOrPnpm() {
  const packageManager = process.env.npm_config_user_agent?.split(" ")?.split("/")?.[0];
  if (packageManager === "npm") return "npm";
  if (packageManager === "pnpm") return "pnpm";
  return undefined;
}

export const npmCommand = npmOrPnpm();
