import { copyFile, readFile, rm, writeFile } from 'node:fs/promises';

import CleanCSS from 'clean-css';
import builtins from 'builtin-modules';
import { context } from 'esbuild';
import { existsSync } from 'node:fs';
import { exit } from 'node:process';
import { join } from 'node:path';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const outdir = 'dist';

const external = [
  'obsidian',
  'electron',
  '@codemirror/autocomplete',
  '@codemirror/collab',
  '@codemirror/commands',
  '@codemirror/language',
  '@codemirror/lint',
  '@codemirror/search',
  '@codemirror/state',
  '@codemirror/view',
  '@lezer/common',
  '@lezer/highlight',
  '@lezer/lr',
  ...builtins,
];

if (existsSync(outdir)) {
  await rm(outdir, { recursive: true, force: true });
}

const stylesCopyPlugin = () => ({
  name: 'styles-copy-plugin',
  setup(build) {
    build.onEnd(async () => {
      const css = await readFile('src/styles.css', 'utf8');
      const minified = new CleanCSS().minify(css).styles;

      await writeFile(join(outdir, 'styles.css'), minified);
    });
  },
});

const manifestCopyPlugin = () => ({
  name: 'manifest-copy-plugin',
  setup(build) {
    build.onEnd(async () => {
      await copyFile('manifest.json', join(outdir, 'manifest.json'));
    });
  },
});

const ctx = await context({
  entryPoints: ['src/main.ts'],
  outfile: `${outdir}/main.js`,
  bundle: true,
  minify: isProduction,
  format: 'cjs',
  external,
  plugins: [stylesCopyPlugin(), manifestCopyPlugin()],
});

if (isDevelopment) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  exit(0);
}
