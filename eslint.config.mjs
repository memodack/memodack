import eslint from '@eslint/js';
import globals from 'globals';
import pluginJest from 'eslint-plugin-jest';
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

  // Separate block for tests
  {
    files: ['**/*.test.ts'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      // Jest rules
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',

      // Special handling of unbound methods
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error',
    },
  },

  // Ignored files
  {
    ignores: [
      'dist',
      'eslint.config.mjs',
      'commitlint.config.mjs',
      'prettier.config.mjs',
      'jest.config.mjs',
      'esbuild.config.mjs',
    ],
  },
);
