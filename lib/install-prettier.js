import { $ } from "execa";

export async function installPrettier() {
  await $`npm i -D prettier`;
  await $`npm pkg set ${"scripts.format=prettier --write ."}`;
}
