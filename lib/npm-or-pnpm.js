/**
 * Returns the package manager that was used to run this script.
 *
 * Only understands npm and pnpm; throws an error if the package manager is
 * unrecognized.
 */
export function npmOrPnpm() {
  const uaVersion = process.env.npm_config_user_agent?.split(" ")?.[0];
  const uaName = uaVersion?.split("/")?.[0];
  if (uaName === "npm") return "npm";
  if (uaName === "pnpm") return "pnpm";
  throw new Error(`Unrecognized package manager: ${uaName}`);
}

export const npmCommand = npmOrPnpm();
