import pluginReactRefresh from 'eslint-plugin-react-refresh'
import pluginImport from 'eslint-plugin-import'
import { fixupConfigRules } from '@eslint/compat'
import globals from 'globals'
// import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/dist', '**/*.mjs', '**/node_modules/'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      // 'plugin:@typescript-eslint/recommended',
      // 'plugin:@typescript-eslint/stylistic',
      // 'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ),
  ),
  {
    plugins: {
      'react-refresh': pluginReactRefresh,
      import: pluginImport,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      // does this work well for js and jsx files?
      // parser: tsParser,
      // ecmaVersion: 'latest',
      // sourceType: 'module',

      // parserOptions: {
      //   ecmaFeatures: {
      //     jsx: true,
      //   },
      // },
    },

    rules: {
      strict: 0,
      'react/prop-types': 0,
      'react/display-name': 'off',
      'no-console': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 1,

      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],

      'react/react-in-jsx-scope': 'off',

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'import/extensions': [
        'warn',
        'ignorePackages',
        {
          jsx: 'never',
          // ts: 'never',
          // tsx: 'never',
        },
      ],
    },
  },
]
