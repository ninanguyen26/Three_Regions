import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { execFileSync } from "node:child_process";

const sourceRoot = "assets/ingredients";
const destinationRoot = "assets/runtime/ingredients";
function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : path.endsWith(".png") ? [path] : [];
  });
}
const sources = walk(sourceRoot);
for (const source of sources) {
  const destination = join(destinationRoot, relative(sourceRoot, source));
  mkdirSync(dirname(destination), { recursive: true });
  execFileSync("sips", ["-Z", "256", source, "--out", destination], { stdio: "ignore" });
}
console.log(`Built ${sources.length} ingredient thumbnails at 256px; originals preserved.`);
