import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import parser from '@typescript-eslint/parser'

export default [
  {
    languageOptions: { parser },
    plugins: {
      typescript: typescriptPlugin,
      react: reactPlugin,
      reactHooks: reactHooksPlugin,
    },
  },
]
