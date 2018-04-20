'use strict'

/* Load .env first */
require('./lib/dot-env')()

const Config = require('config')
const asyncExitHook = require('async-exit-hook')
const ms = require('pretty-ms')
const { format } = require('util')
const fp = require('lodash/fp')

const logDummy = {
  fatal: console.error.bind(console),
  error: console.error.bind(console),
  warn: console.error.bind(console),
  info: console.log.bind(console),
  debug: console.log.bind(console),
  trace: console.log.bind(console)
}

/** @type {Proxy} PMX module */
exports.pmx = require('./lib/pmxProxy')

/**
 * Appends Listeners for: uncaughtException, unhandledRejection, process.exit
 *   and Logs Basic configuration data.
 *
 * @param  {Boolean} options.pmx:    keymetrics
 * @param  {Object}  options.logger: log
 *
 * @return {Promise}
 */

exports.init = ({ pmx: keymetrics = true, logger: log = logDummy } = {}) =>
  new Promise((resolve, reject) => {
    /* Enable PMX - Keymetrics */

    if (keymetrics === true) {
      exports.pmx.init()
    } else if (fp.isPlainObject(keymetrics)) {
      exports.pmx.init(keymetrics)
    }

    process.log = log

    /* Catch uncaughExeptions */
    process.prependListener('uncaughtException', error => {
      process.log.fatal({ err: error }, `Undhandled Error: ${error.message}`)
      exports.pmx.notify(error)
      process.nextTick(() => process.exit(1))
    })

    /* Catch unhandledRejections */
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
        Config.get('version'),
        fp.upperCase(Config.get('env'))
      )
    )

    resolve()
  })

exports.ready = () => {
  process.log.info(
    'Application %s v%s is ready (%s)',
    getName(),
    Config.get('version'),
    getUptime()
  )
  process.send('ready')
}

function getName () {
  return fp.upperFirst(fp.camelCase(Config.get('name')))
}

function getUptime () {
  return ms(process.uptime() * 1000)
}
