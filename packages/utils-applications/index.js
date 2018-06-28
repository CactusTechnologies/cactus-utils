'use strict'

/* Load .env first */
require('./lib/dot-env')()

const config = require('config')
const ms = require('pretty-ms')

exports.utils = require('./lib/utils')

/** @type {Proxy} PMX module */
exports.pmx = require('./lib/pmx-proxy')

/** @type {Object} Global Status */
exports.status = require('./lib/status')

/** @type {Function} exitHooks */
exports.exitHook = require('async-exit-hook')

/** @type {Function} ensureDirs */
exports.ensureDirectories = async () =>
  exports.utils.forEach(config.get('paths') || [], async path =>
    exports.utils.mkd(path)
  )

/**
 * Appends Listeners for: uncaughtException, unhandledRejection, process.exit
 *   and Logs Basic configuration data.
 *
 * @param  {Boolean} options.pmx:    keymetrics
 * @param  {Object}  options.logger: log
 *
 * @return {Promise}
 */

exports.init = ({ pmx = true } = {}) =>
  new Promise((resolve, reject) => {
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
      exports.utils.format(
        'Initializing Application: %s v%s',
        config.get('name'),
        config.get('version')
      )
    )
    process.log.info(exports.utils.format('Enviroment: %s', config.get('env')))
    process.log.info(
      exports.utils.format('Log level: %s', config.get('logs.level'))
    )

    resolve()
  })

exports.ready = () => {
  /* Add the exit hook message */
  exports.exitHook(function exitMessage () {
    const exitCode = process.exitCode || 0

    const exitMessage = exports.utils.format(
      'About to exit Application %s with code %s after %s',
      config.get('name'),
      exitCode,
      ms(process.uptime() * 1000)
    )

    if (exitCode !== 0) process.log.fatal(exitMessage)
    else process.log.warn(exitMessage)
  })

  process.log.info(
    exports.utils.format(
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
