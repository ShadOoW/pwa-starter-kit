module.exports = {
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
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
