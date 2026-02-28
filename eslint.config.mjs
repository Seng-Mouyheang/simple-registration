import globals from 'globals';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // JS files
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
    plugins: { prettier },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'es5',
        },
      ],
    },
  },
  // JSON files
  { files: ['**/*.json'], plugins: { json }, language: 'json/json' },
  // Markdown files
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
  },
  // CSS files
  { files: ['**/*.css'], plugins: { css }, language: 'css/css' },
]);
