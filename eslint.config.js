import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  js.configs.recommended,
  {
    plugins: {
      'sort-keys-fix': sortKeysFix,
      'unused-imports': unusedImports,
    },
    rules: {
      'sort-keys': ['error', 'asc', { natural: true }],
      'sort-keys-fix/sort-keys-fix': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  prettier,
]
