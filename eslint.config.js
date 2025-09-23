// ESLint configuration for the root of the monorepo
// This mainly serves as a fallback and ignores workspace-specific files

import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'packages/*/eslint.config.*', // Let each package handle its own ESLint config
    ],
  },
  {
    files: ['*.js', '*.mjs', '*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
];