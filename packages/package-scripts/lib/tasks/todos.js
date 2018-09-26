'use strict'

const execa = require('execa')
const utils = require('../utils')
const { TODO_PATH } = require('../constants')

const opts = ['*/**', ...utils.ignore(), '-Sx', '--reporter', 'vscode']

module.exports = ctx =>
  execa.stdout('leasot', opts).then(todos => utils.writeFile(TODO_PATH, todos))
