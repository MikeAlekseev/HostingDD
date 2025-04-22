import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
    {
        ignores: ['.idea', 'node_modules', 'public', 'dist', 'src-server/generated/prisma'],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            import: importPlugin,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-unnecessary-type-constraint': 'off',
            '@typescript-eslint/triple-slash-reference': 'off',
            'no-prototype-builtins': 'off',
            'semi': ['error', 'never'],
            'indent': ['error', 4, { "SwitchCase": 1 }],
            'complexity': ['error', { 'max': 20 }],
            'curly': ['error', 'all'],
            '@typescript-eslint/no-unused-vars': ['error', {
                args: 'after-used',
                argsIgnorePattern: '^(next)$',
                caughtErrors: 'all',
                ignoreRestSiblings: true,
            }],
            'no-restricted-exports': ['error', {
                'restrictDefaultExports': {
                    'direct': true,
                    'defaultFrom': true,
                    'named': true,
                    'namedFrom': true,
                    'namespaceFrom': true,
                }
            }],
            // 'import/order': ['error', {
            //     'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            //     'pathGroups': [
            //         {
            //             group: 'parent',
            //             position: 'before',
            //         },
            //         {
            //             pattern: '@/**',
            //             group: 'parent',
            //             position: 'before',
            //         },
            //     ],
            //     'newlines-between': 'always',
            //     "warnOnUnassignedImports": true
            // }],
            'import/newline-after-import': ['error', { 'count': 1, }],
            'import/no-default-export': 'error',
            // Дефолтного экспорта быть не должно
            'import/prefer-default-export': 'off',
            'linebreak-style': ['off'],
            'max-len': ['error', {
                'code': 120,
                'ignoreComments': true,
                // При объявлении функций - деклатация типа может быть очень длинной, а линтер очень плохо работает с переносами внутри дженериков
                'ignorePattern': '^ *(declare|import|export|const)',
                'ignoreRegExpLiterals': true,
                'ignoreStrings': true,
                'ignoreTemplateLiterals': true,
                'ignoreTrailingComments': true,
                'ignoreUrls': true,
            }],
            'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 4 }],
            // Выключаем, чтоб можно было использовать await в циклах
            'no-await-in-loop': ['off'],
            'no-console': ['warn', { 'allow': ['warn', 'error'] }],
            'no-continue': ['off'],
            'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
            'no-multiple-empty-lines': ['error', { 'max': 1 }],
            // Разрешает переприсваивать значение аргументам функций
            'no-param-reassign': ['error', {
                'ignorePropertyModificationsFor': ['out', 'req', 'res', 'reply'],
                'ignorePropertyModificationsForRegex': ['^_'],
                'props': true,
            }],
            // Легализация ++/-- в циклах
            'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
            'no-restricted-syntax': ['off'],
            // Разрешает в дочерних скоупах создавать переменные с теми же именами
            'no-shadow': ['off'],
            'no-use-before-define': ['off'],
            'object-curly-newline': ['error', {
                'ExportDeclaration': { 'consistent': true },
                'ImportDeclaration': { 'consistent': true },
                'ObjectExpression': { 'consistent': true },
                'ObjectPattern': { 'consistent': true },
            }],
            // Отступы внутри объектов и массивов
            'object-curly-spacing': ['error', 'always'],
            // Перенос строки в логических операторах
            'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
            // Пустая стока перед return
            //    'newline-before-return': 'error',
            // Пустая стока после блока объявления переменных переменными
            //    'newline-after-var': ['error', 'always'],
            'padding-line-between-statements': [
                'error',
                // Вставлять пробел после блока переменных
                { 'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*' },
                { 'blankLine': 'any', 'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var'] },
                // Вставлять пробел перед return
                { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
                // Вставлять пробел перед break
                { 'blankLine': 'always', 'prev': '*', 'next': 'break' },
            ],
            // Везде одиночные кавычкии
            'quotes': ['error', 'single'],
            'yoda': ['off'],
        },
        'settings': {
            'import/parsers': {
                'eslint-import-resolver-typescript': ['.ts', 'tsx'],
            },
            'import/resolver': {
                'typescript': true
            },
        },
    },
    {
        files: ['**/*.ts'],
        rules: {
            'rules-of-hooks': 'off',
            'react-hooks/rules-of-hooks': 'off',
        }
    },
)
