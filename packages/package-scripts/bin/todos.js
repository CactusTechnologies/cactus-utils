'use strict'

const execa = require('execa')
const utils = require('../lib/utils')

exports.command = 'todos'
exports.describe = 'Finds TODOs on the project'
exports.aliases = ['todo']

exports.handler = argv =>
  execa('leasot', [
    '*/**',
    '!**/node_modules/**',
    ...utils.ignore(),
    '-Sx'
  ]).stdout.pipe(process.stdout)
