import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Basic JS and TS rules
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,

  // Language settings for regular code (without jest!)
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Strict TypeScript rules
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },

  // Ignored files
  {
    ignores: [
      'dist',
      'rollup.config.mjs',
      'eslint.config.mjs',
      'commitlint.config.mjs',
      'prettier.config.mjs',
    ],
  },
);
