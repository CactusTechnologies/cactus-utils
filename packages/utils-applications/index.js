'use strict'

/* Load .env first */
require('./dot-env')()

const ms = require('pretty-ms')
const utils = require('@cactus-technologies/utils')
const config = require('config')

/** @type {Proxy} PMX module */
exports.pmx = require('./lib/pmx-proxy')

/** @type {Object} Global Status */
exports.status = require('./lib/status')

/** @type {Function} exitHooks */
exports.exitHook = require('async-exit-hook')

/**
 * Appends Listeners for: uncaughtException, unhandledRejection, process.exit
 *   and Logs Basic configuration data.
 *
 * @param  {Boolean} options.pmx:    keymetrics
 * @param  {Object}  options.logger: log
 *
 * @return {Promise}
 */

exports.init = ({ pmx = false } = {}) =>
  new Promise((resolve, reject) => {
    /* Load .env first */

    /* Add a process log */
    process.log = require('@cactus-technologies/logger')('process')

    /* Enable PMX - Keymetrics */

    if (pmx === true) {
      exports.pmx.init({
        errors: false,
        network: true,
        ports: true
      })
    }

    /* Catch uncaughExeptions */
    process.removeAllListeners('uncaughtException')
    process.prependListener('uncaughtException', error => {
      process.log.fatal({ err: error }, `Undhandled Error: ${error.message}`)
      exports.pmx.notify(error)
      process.nextTick(() => process.kill(process.pid, 'SIGKILL'))
    })

    /* Catch unhandledRejections */
    process.removeAllListeners('unhandledRejection')
    process.prependListener('unhandledRejection', reason => {
      if (reason instanceof Error) throw reason
      throw new Error(reason || 'unhandledRejection')
    })

    process.log.warn(
      utils.format(
        'Initializing Application: %s v%s',
        config.get('name'),
        config.get('version')
      )
    )
    process.log.info(utils.format('Enviroment: %s', config.get('env')))
    process.log.info(utils.format('Log level: %s', config.get('logs.level')))

    resolve()
  })

exports.ready = () => {
  /* Add the exit hook message */
  exports.exitHook(function exitMessage () {
    const config = require('config')
    const exitCode = process.exitCode || 0

    const exitMessage = utils.format(
      'About to exit Application %s with code %s after %s',
      config.get('name'),
      exitCode,
      ms(process.uptime() * 1000)
    )

    if (exitCode !== 0) process.log.fatal(exitMessage)
    else process.log.warn(exitMessage)
  })

  process.log.info(
    utils.format(
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
