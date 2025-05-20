import { Linter } from 'eslint';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

const config: Linter.Config = {
  plugins: {
    typescriptEslintPlugin,  // Explicit import of @typescript-eslint/eslint-plugin
    importPlugin,             // Explicit import of eslint-plugin-import
  }, // Uses the plugin for TypeScript and import rules
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn', // Warns when `any` is used
    '@typescript-eslint/no-unused-vars': 'warn', // Warns on unused variables
    'import/no-unresolved': 'error', // Ensures imports can be resolved
    'import/order': ['error', { 'newlines-between': 'always' }], // Enforces import ordering
  },
  settings: {
    'import/resolver': {
      typescript: {}, // Allows for resolving modules in TypeScript
    },
  },
};

export default config;

