// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,
  { ignores: ['dist', 'coverage'] },
  { languageOptions: { globals: globals.node, ecmaVersion: 'latest', sourceType: 'module' } },
  {
    rules: {
      // Best Practices
      'no-unused-vars': 'warn',
      'no-console': 'off',

      // Stylistic Issues
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'semi': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
      'no-undef': 'off'
    }
  }
]
