import { readdirSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const sourceRoot = "assets";
const destinationRoot = join(sourceRoot, "runtime");

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (path === destinationRoot) return [];
    return entry.isDirectory() ? walk(path) : path.endsWith(".png") ? [path] : [];
  });
}

function maximumSize(source) {
  const name = relative(sourceRoot, source).replaceAll("\\", "/");
  if (name === "tampa-bay-flat-map-inland-v4.png") return null;
  if (name.startsWith("ingredients/")) return 256;
  if (name.startsWith("grocery-store-buildings/") || name === "restaurant-building.png") return 384;
  if (name.startsWith("store-icons/")) return 128;
  if (name === "ui/play-button.png") return 256;
  if (["ui/recipes.png", "ui/guests.png", "ui/menu.png"].includes(name)) return 192;
  // Large scene sprites and title artwork retain enough resolution for their lettering.
  return 1280;
}

const sources = walk(sourceRoot);
for (const source of sources) {
  const destination = join(destinationRoot, relative(sourceRoot, source));
  const size = maximumSize(source);
  mkdirSync(dirname(destination), { recursive: true });
  if (size === null) {
    copyFileSync(source, destination);
  } else {
    execFileSync("sips", ["-Z", String(size), source, "--out", destination], { stdio: "ignore" });
  }
}
console.log(`Built ${sources.length} runtime images from available source artwork. Existing runtime files for removed sources were preserved.`);
