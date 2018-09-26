'use strict'

/* Load .env first */

require('./dot-env')()

const ms = require('pretty-ms')
const util = require('util')
const config = require('config')
const io = require('@pm2/io')
const exitHook = require('async-exit-hook')
const logger = require('@cactus-technologies/logger')

/** @type {io} PMX module */
exports.io = io

exports.status = require('./lib/status')

exports.exitHook = exitHook

exports.slack = require('./lib/slack-notifier')

/**
 * Appends Listeners for: uncaughtException, unhandledRejection, process.exit
 *   and Logs Basic configuration data.
 *
 *
 * @return {Promise}
 */

exports.init = () =>
  new Promise((resolve, reject) => {
    /* Add a process log */
    process.log = logger('process')

    /* Catch uncaughtExceptions */
    process.removeAllListeners('uncaughtException')
    exports.exitHook.uncaughtExceptionHandler(error => {
      process.log.fatal({ err: error }, error.message)
      exports.io.notifyError(error)
    })

    /* Enable SlackWeb Hooks */
    exports.exitHook.uncaughtExceptionHandler((error, done) => {
      exports.slack.error(logger.Serializers.err(error)).then(() => done())
    })

    /* Catch unhandledRejections */
    process.removeAllListeners('unhandledRejection')
    process.prependListener('unhandledRejection', reason => {
      if (reason instanceof Error) throw reason
      throw new Error(reason || 'unhandledRejection')
    })

    process.log.warn(
      'Initializing Application: %s v%s',
      config.get('name'),
      config.get('version')
    )
    process.log.info(util.format('Environment: %s', config.get('env')))
    process.log.info(util.format('Log level: %s', config.get('logs.level')))

    resolve()
  })

exports.ready = () => {
  /* Add the exit hook message */
  exports.exitHook(function exitMessage () {
    const config = require('config')
    const exitCode = process.exitCode || 0
    const uptime = process.uptime()
    const exitMessage = util.format(
      'About to exit Application %s with code %s after %s',
      config.get('name'),
      exitCode,
      ms(process.uptime() * 1000)
    )

    if (exitCode !== 0) process.log.fatal(exitMessage)
    else process.log.warn({ uptime }, exitMessage)
  })

  const initMsg = util.format(
    'Application %s v%s is ready (+%s)',
    config.get('name'),
    config.get('version'),
    ms(process.uptime() * 1000)
  )

  process.log.info(initMsg)

  if ('send' in process) {
    process.send('ready')
  }
}

exports.kill = err => {
  process.log.info('Failed to initialize the App, Commiting suicide.')
  if (err instanceof Error) throw err
  throw new Error('Failed to initialize.')
}
