'use strict'

const execa = require('execa')
const utils = require('../utils')
const { TODO_PATH } = require('../constants')

module.exports = ctx =>
  execa
    .stdout('leasot', [
      '*/**',
      '!**/node_modules/**',
      ...utils.ignore(),
      '-Sx',
      '--reporter',
      'vscode'
    ])
    .then(todos => utils.writeFile(TODO_PATH, todos))
