import eslintReact from '@eslint-react/eslint-plugin'
import eslintJs from '@eslint/js'
import prettier from 'eslint-config-prettier'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      'sort-keys-fix': sortKeysFix,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { allowSameFolder: true, prefix: '@', rootDir: 'src' },
      ],
      'sort-keys': ['error', 'asc', { natural: true }],
      'sort-keys-fix/sort-keys-fix': 'error',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  prettier,
]
