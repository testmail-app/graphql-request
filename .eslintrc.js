module.exports = {
  root: true, // don't use .eslintrc.js from parent directories
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6
  },
  plugins: [ '@typescript-eslint' ],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'array-bracket-spacing': ['warn'],
    'comma-dangle': ['error'],
    'indent': ['error', 2],
    'semi': ['error', 'always'],
    'prefer-const': 'error',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};