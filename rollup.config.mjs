import CleanCSS from 'clean-css';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  input: './src/main.ts',
  output: {
    format: 'cjs',
    file: './dist/main.js',
  },
  external: ['obsidian'],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    copy({
      targets: [
        {
          src: './src/styles.css',
          dest: './dist',
          transform: (contents) => new CleanCSS().minify(contents).styles,
        },
        {
          src: './manifest.json',
          dest: './dist',
        },
      ],
    }),
    terser(),
  ],
});
