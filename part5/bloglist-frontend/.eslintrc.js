module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  plugins: ['import', 'react'],
  extends: ['airbnb'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'jsx-a11y/label-has-associated-control': 'off',
    semi: ['error', 'never'],
  },
}
