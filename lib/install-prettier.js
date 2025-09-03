import { $ } from "execa";
import { npmCommand } from "./npm-or-pnpm.js";

export async function installPrettier() {
  await $`${npmCommand} i -D prettier`;
  await $`${npmCommand} pkg set ${"scripts.format=prettier --write ."}`;
}
