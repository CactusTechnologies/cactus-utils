'use strict'

const execa = require('execa')
const utils = require('../lib/utils')

const opts = ['*/**', ...utils.ignore(), '-Sx']

exports.command = 'todos'
exports.describe = 'Finds TODOs on the project'
exports.aliases = ['todo']

exports.handler = argv => {
  if (argv.color === true) opts.push('--color')
  execa('leasot', opts).stdout.pipe(process.stdout)
}
