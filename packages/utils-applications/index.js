'use strict'

/* Load .env first */

require('./dot-env')()

const ms = require('pretty-ms')
const fp = require('lodash/fp')
const util = require('util')
const config = require('config')

/** @type {Proxy} PMX module for backwards compatibility */
exports.pmx = require('./lib/pm2-io-proxy')

/** @type {Proxy} PMX module */
exports.io = require('./lib/pm2-io-proxy')

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
 * @param  {Object}  options.logger: log
 *
 * @return {Promise}
 */

exports.init = ({ pmx = true, slack = false } = {}) =>
  new Promise((resolve, reject) => {
    const logger = require('@cactus-technologies/logger')

    /* Add a process log */
    process.log = logger('process')

    /* Enable pm2.io - Keymetrics */
    if (pmx === true) {
      exports.io.init({
        network: { ports: true }
      })
    }

    /* Catch uncaughExeptions */
    process.removeAllListeners('uncaughtException')
    exports.exitHook.uncaughtExceptionHandler(error => {
      process.log.fatal({ err: error }, error.message)
    })

    /* Enable SlackWeb Hooks */
    if (slack === true && config.has('slack.url')) {
      exports.slack.init()
      exports.exitHook.uncaughtExceptionHandler((error, done) => {
        let err = []
        try {
          err = logger.Serializers.err(error)
        } catch (err) {
          process.log.error(err)
        }
        exports.slack
          .error(error.message, 'process', fp.omit(['stack'], err))
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
    process.log.info(util.format('Enviroment: %s', config.get('env')))
    process.log.info(util.format('Log level: %s', config.get('logs.level')))
    process.log.debug({ paths: config.get('paths') }, 'Paths')

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

  process.log.info(
    util.format(
      'Application %s v%s is ready (+%s)',
      config.get('name'),
      config.get('version'),
      ms(process.uptime() * 1000)
    )
  )

  if ('send' in process) {
    process.send('ready')
  }
}

exports.kill = err => {
  process.log.info('Falied to initialize the App, Commiting suicide.')
  if (err instanceof Error) throw err
  throw new Error('Falied to initialize.')
}
