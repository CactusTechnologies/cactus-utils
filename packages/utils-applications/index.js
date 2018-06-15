'use strict'

const config = require('config')
const fp = require('lodash/fp')
const ms = require('pretty-ms')
const makeDir = require('make-dir')
const { format } = require('util')

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

exports.init = ({ pmx = true, logger = require('./lib/log-dummy') } = {}) =>
  new Promise((resolve, reject) => {
    /* Add a process log */
    process.log = logger

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
      process.nextTick(() => process.exit(1))
    })

    /* Catch unhandledRejections */
    process.removeAllListeners('unhandledRejection')
    process.prependListener('unhandledRejection', reason => {
      if (fp.isEmpty(reason)) reason = 'unhandledRejection'
      if (reason instanceof Error !== true) reason = new Error(reason)
      throw reason
    })

    process.log.warn(
      format(
        'Initializing Application: %s v%s',
        config.get('name'),
        config.get('version')
      )
    )
    process.log.info(format('Enviroment: %s', config.get('env')))
    process.log.info(format('Log level: %s', config.get('logs.level')))

    fp.map(path => makeDir.sync(path))(config.get('paths') || [])

    resolve()
  })

exports.ready = () => {
  /* Add the exit hook message */
  exports.exitHook(function exitMessage () {
    const exitCode = process.exitCode || 0

    const exitMessage = format(
      'About to exit Application %s with code %s after %s',
      config.get('name'),
      exitCode,
      ms(process.uptime() * 1000)
    )

    if (exitCode !== 0) process.log.fatal(exitMessage)
    else process.log.warn(exitMessage)
  })

  process.log.info(
    format(
      'Application %s v%s is ready (+%s)',
      config.get('name'),
      config.get('version'),
      ms(process.uptime() * 1000)
    )
  )
  process.send('ready')
}
