#!/usr/bin/env node

const cli = require('yargs')
const updateNotifier = require('update-notifier')

const pkg = require('../package.json')
const utils = require('../lib/utils')
const { PKG_PATH, ERR_PKG } = require('../lib/constants')

updateNotifier({ pkg }).notify({ shouldNotifyInNpmScript: true })

cli
  .scriptName('pkg-scripts')
  .usage('$0 [command]')
  .option('debug', {
    describe: 'Debug tool',
    default: false,
    global: true,
    hidden: true
  })
  .command(require('./compile'))
  .command(require('./todos'))
  .demandCommand(1, 'Please provide a command.')
  .version()
  .epilog('Copyright (c) 2018 Cactus Technologies LLC.')
  .middleware([exitSignals, handleRejections, checkForPkg])
  .help()
  .parse()

function checkForPkg () {
  if (!utils.exists(PKG_PATH)) throw new Error(ERR_PKG)
}

function handleRejections (argv) {
  process.removeAllListeners('unhandledRejection')
  process.prependListener('unhandledRejection', reason => {
    if (argv.debug) console.error(reason) // eslint-disable-line
  })
}

function exitSignals () {
  process.on('SIGINT', cleanupAndExit)
  process.on('SIGQUIT', cleanupAndExit)
  process.on('SIGTERM', cleanupAndExit)
  process.on('SIGHUP', cleanupAndExit)
  process.on('SIGBREAK', cleanupAndExit)
  function cleanupAndExit (signal) {
    process.nextTick(() => process.exit(1))
  }
}
