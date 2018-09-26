'use strict'

const execa = require('execa')
const utils = require('../lib/utils')
const { CLOG_PATH } = require('../lib/constants')

const opts = ['--no-verify', '--commit-all']

if (utils.exists(CLOG_PATH) === false) opts.unshift('--first-release')

exports.command = 'version'
exports.describe = 'Automatic versioning and CHANGELOG generation'
exports.aliases = ['release']

exports.builder = argv =>
  argv
    .option('dryRun', {
      default: false,
      describe: 'See the commands that running standard-version would run',
      type: 'boolean'
    })
    .option('postBump', {
      default: 'package-scripts compile',
      describe: 'Post version bump hook',
      type: 'string'
    })

exports.handler = argv => {
  if (argv.dryRun === true) opts.push('--dry-run')
  if (argv.color === true) opts.push('--color')
  opts.push(`--scripts.postbump=${argv.postBump}`)
  return execa('standard-version', opts).stdout.pipe(process.stdout)
}
