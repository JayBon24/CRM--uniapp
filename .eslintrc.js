import process from 'node:process'

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Vue 相关
    'vue/multi-word-component-names': 'error', // 组件名必须多单词
    'vue/component-definition-name-casing': ['error', 'PascalCase'], // 组件定义名大驼峰
    'vue/component-name-in-template-casing': ['error', 'PascalCase'], // 组件模板名大驼峰
    'vue/prop-name-casing': ['error', 'camelCase'], // prop 驼峰
    'vue/require-default-prop': 'off', // 允许props无默认值
    'vue/require-prop-types': 'error',
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/no-unused-components': 'error',
    'vue/order-in-components': 'error',
    'vue/this-in-template': ['error', 'never'],
    'vue/no-mutating-props': 'error',
    'vue/no-v-html': 'off', // 允许v-html
    'vue/require-explicit-emits': 'error', // emits必须声明

    // TypeScript 相关
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        prefix: ['T'],
      },
    ],

    // 注释相关
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    'spaced-comment': ['error', 'always', { markers: ['@'] }], // 注释前有空格，@开头的注释允许

    // 通用规则
    // 允许使用所有console相关方法（log, warn, error等）
    'no-console': 'off',
    // 只在生产环境警告debugger的使用
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-var': 'error', // 禁止使用var
    'prefer-const': 'error', // 优先使用const
    'no-duplicate-imports': 'error', // 禁止重复导入
    'no-unused-vars': 'off', // 交由ts处理
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
        printWidth: 100,
        tabWidth: 2,
      },
    ],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['*.vue'],
      rules: {
        // Vue 文件中允许顶层函数表达式（setup语法糖）
        'no-inner-declarations': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue'],
      },
    },
  },
}
