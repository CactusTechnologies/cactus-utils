'use strict'

/* Load .env first */
require('./lib/dot-env')()

const asyncExitHook = require('async-exit-hook')
const config = require('config')
const fp = require('lodash/fp')
const ms = require('pretty-ms')
const makeDir = require('make-dir')
const { format } = require('util')

/** @type {Proxy} PMX module */
exports.pmx = require('./lib/pmx-proxy')

/** @type {Object} Global Status */
exports.status = require('./lib/status')

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
      exports.pmx.init()
    } else if (fp.isPlainObject(pmx)) {
      exports.pmx.init(pmx)
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
      if (reason instanceof Error !== true) reason = new Error(reason)
      throw reason
    })

    /* Add the exit hook message */
    asyncExitHook(function exitMessage () {
      const exitCode = process.exitCode || 0

      const exitMessage = format(
        'Application %s exit with code %s after %s',
        getName(),
        exitCode,
        getUptime()
      )

      if (exitCode !== 0) process.log.fatal(exitMessage)
      else process.log.warn(exitMessage)
    })

    process.log.warn(
      format(
        'Initializing Application: %s v%s in %s mode',
        getName(),
        config.version,
        process.env.NODE_ENV
      )
    )

    process.log.info(format('Log level: %s', config.logs.level || 'trace'))

    fp.map(path => makeDir.sync(path))(config.paths || [])

    resolve()
  })

exports.ready = () => {
  process.log.info(
    format(
      'Application %s v%s is ready (+%s)',
      getName(),
      config.version,
      getUptime()
    )
  )
  process.send('ready')
}

// ─────────────────────────────────  Utils  ───────────────────────────────────

function getName () {
  return fp.upperFirst(fp.camelCase(config.name))
}

function getUptime () {
  return ms(process.uptime() * 1000)
}
