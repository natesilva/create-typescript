import { readFile, writeFile } from "node:fs/promises";

export async function enableDecorators() {
  const fileContents = await readFile("tsconfig.json");
  const tsConfig = JSON.parse(fileContents);

  tsConfig.compilerOptions.emitDecoratorMetadata = true;
  tsConfig.compilerOptions.experimentalDecorators = true;

  await writeFile("tsconfig.json", JSON.stringify(tsConfig, null, 2));
}
