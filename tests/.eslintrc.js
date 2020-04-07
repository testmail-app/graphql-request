module.exports = {
  root: true, // don't use .eslintrc.js from parent directories
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6
  },
  plugins: ['mocha'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // js
    'array-bracket-spacing': ['warn'],
    'comma-dangle': ['error'],
    'indent': ['error', 2],
    'semi': ['error', 'always'],
    'prefer-const': 'error',
    // typescript
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // mocha
    'mocha/handle-done-callback': 'warn',
    'mocha/max-top-level-suites': ['warn', { limit: 1 }],
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/no-identical-title': 'warn',
    'mocha/no-mocha-arrows': 'error',
    'mocha/no-nested-tests': 'error',
    'mocha/no-pending-tests': 'warn',
    'mocha/no-return-and-callback': 'error',
    'mocha/no-sibling-hooks': 'error',
    'mocha/no-skipped-tests': 'warn',
    'mocha/no-top-level-hooks': 'error'
  }
};
