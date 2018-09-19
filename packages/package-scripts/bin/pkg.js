#!/usr/bin/env node

require('util').inspect.defaultOptions.maxArrayLength = 10
require('util').inspect.defaultOptions.depth = 5

const cli = require('yargs')
const updateNotifier = require('update-notifier')

const pkg = require('../package.json')

updateNotifier({ pkg }).notify({ shouldNotifyInNpmScript: true })

cli
  .scriptName('pkg-scripts')
  .usage('$0 [command]')
  .option('debug', {
    describe: 'Debug tool',
    default: false,
    global: true
  })
  .command({
    command: '*',
    desc: 'Updates the project files',
    handler: argv => require('../lib/compile')(argv)
  })
  .version()
  .epilog('Copyright (c) 2018 Cactus Technologies LLC.')
  .help()
  .parse()
