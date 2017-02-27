module.exports = {
  root: true,
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    mocha: true,
    phantomjs: true
  },
  rules: {
    strict: 'off',
    'no-param-reassign': 'off',
    'prefer-const': 'warn',
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
    'guard-for-in': 'off',
    'max-len': 'off',
    'keyword-spacing': [2, { overrides: {
      if: { after: false },
      for: { after: false },
      while: { after: false }
    } }],
    'no-cond-assign': 'off',
    'no-await-in-loop': 'off',
    'no-underscore-dangle': [2, {
      allow: ['_executor', '_context', '_task', '_done', '_success', '_fail', '_defferal', '_after', '_params', '_timer', '_tasks', '_queue']
    }]
  }
};
