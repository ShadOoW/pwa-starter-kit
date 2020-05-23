module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  rules: {
    'react/no-unknown-property': ['error', { ignore: ['class'] }],
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    react: {
      createClass: 'createElement',
      pragma: 'h',
      version: 'detect',
    },
  },
};
