'use strict'

/* Load .env first */

require('./dot-env')()

const ms = require('pretty-ms')
const util = require('util')
const config = require('config')

/** @type {Proxy} PMX module */
exports.io = require('@pm2/io')

/** @type {Object} Global Status */
exports.status = require('./lib/status')

/** @type {Function} exitHooks */
exports.exitHook = require('async-exit-hook')

/** @type {Object} slack notifications */
exports.slack = require('./lib/slack-notifier')

/**
 * Appends Listeners for: uncaughtException, unhandledRejection, process.exit
 *   and Logs Basic configuration data.
 *
 * @param  {Boolean} options.pmx:    pm2+ deep metrics
 * @param  {Boolean} options.slack:  Slack notifications
 *
 * @return {Promise}
 */

exports.init = () =>
  new Promise((resolve, reject) => {
    const logger = require('@cactus-technologies/logger')

    /* Add a process log */
    process.log = logger('process')

    /* Catch uncaughtExceptions */
    process.removeAllListeners('uncaughtException')
    exports.exitHook.uncaughtExceptionHandler(error => {
      process.log.fatal({ err: error }, error.message)
      exports.io.notifyError(error)
    })

    /* Enable SlackWeb Hooks */
    if (config.has('slack.url')) {
      exports.slack.init()
      exports.exitHook.uncaughtExceptionHandler((error, done) => {
        exports.slack
          .error(logger.Serializers.err(error), 'UncaughtError')
          .then(() => done())
      })
    }

    /* Catch unhandledRejections */
    process.removeAllListeners('unhandledRejection')
    process.prependListener('unhandledRejection', reason => {
      if (reason instanceof Error) throw reason
      throw new Error(reason || 'unhandledRejection')
    })

    process.log.warn(
      util.format(
        'Initializing Application: %s v%s',
        config.get('name'),
        config.get('version')
      )
    )
    process.log.info(util.format('Environment: %s', config.get('env')))
    process.log.info(util.format('Log level: %s', config.get('logs.level')))
    process.log.trace({ paths: config.get('paths') }, 'Paths')

    resolve()
  })

exports.ready = () => {
  /* Add the exit hook message */
  exports.exitHook(function exitMessage () {
    const config = require('config')
    const exitCode = process.exitCode || 0

    const exitMessage = util.format(
      'About to exit Application %s with code %s after %s',
      config.get('name'),
      exitCode,
      ms(process.uptime() * 1000)
    )

    if (exitCode !== 0) process.log.fatal(exitMessage)
    else process.log.warn(exitMessage)
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
