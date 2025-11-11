import { existsSync, watchFile } from "node:fs";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { exit } from "node:process";
import builtins from "builtin-modules";
import CleanCSS from "clean-css";
import { context } from "esbuild";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const outdirPath = "dist";
const stylesCssFilePath = "src/styles.css";

if (existsSync(outdirPath)) {
  await rm(outdirPath, { recursive: true, force: true });
}

await mkdir(outdirPath);

const stylesCopy = async () => {
  const css = await readFile(stylesCssFilePath, "utf8");
  const minified = new CleanCSS().minify(css).styles;

  await writeFile(join(outdirPath, "styles.css"), minified);
};

watchFile(stylesCssFilePath, { interval: 300 }, async () => {
  await stylesCopy();
});

const stylesCopyPlugin = () => ({
  name: "styles-copy-plugin",
  setup(build) {
    build.onEnd(async () => {
      await stylesCopy();
    });
  },
});

const manifestCopyPlugin = () => ({
  name: "manifest-copy-plugin",
  setup(build) {
    build.onEnd(async () => {
      await copyFile("manifest.json", join(outdirPath, "manifest.json"));
    });
  },
});

const external = [
  "obsidian",
  "electron",
  "@codemirror/autocomplete",
  "@codemirror/collab",
  "@codemirror/commands",
  "@codemirror/language",
  "@codemirror/lint",
  "@codemirror/search",
  "@codemirror/state",
  "@codemirror/view",
  "@lezer/common",
  "@lezer/highlight",
  "@lezer/lr",
  ...builtins,
];

const ctx = await context({
  entryPoints: ["src/main.ts"],
  outfile: `${outdirPath}/main.js`,
  bundle: true,
  minify: isProduction,
  format: "cjs",
  external,
  plugins: [stylesCopyPlugin(), manifestCopyPlugin()],
});

if (isDevelopment) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  exit(0);
}
