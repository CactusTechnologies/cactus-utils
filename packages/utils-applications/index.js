'use strict'

/* Load .env first */
require('./lib/dot-env')()

const importLazy = require('import-lazy')(require)

const Config = require('config')
const asyncExitHook = require('async-exit-hook')
const ms = require('pretty-ms')

const logger = importLazy('@cactus-technologies/lab100-logger')

/** @type {Proxy} PMX module */
exports.pmx = require('./lib/pmxProxy')

/**
 * Appends Listeners for: uncaughtException, unhandledRejection, process.exit
 *   and Logs Basic configuration data.
 *
 * @param  {Boolean} [keymetrics=true] Initializes PMX
 *
 * @return {Promise}
 */

exports.init = (keymetrics = true) =>
  new Promise((resolve, reject) => {
    /* Enable PMX - Keymetrics */
    if (keymetrics) {
      exports.pmx.init(Config.get('pmx'))
    }

    /* Catch uncaughExeptions */
    process.prependListener(
      'uncaughtException',
      function customUncaughtExceptionListener (error) {
        logger('process').fatal(
          { err: error },
          `Undhandled Error: ${error.message}`
        )
        exports.pmx.notify(error)
        process.nextTick(() => process.exit(1))
      }
    )

    /* Catch unhandledRejections */
    process.prependListener(
      'unhandledRejection',
      function customUnhandledRejectionListener (reason) {
        if (reason instanceof Error !== true) reason = new Error(reason)
        throw reason
      }
    )

    /* Add the exit hook message */
    asyncExitHook(function exitMessage () {
      const uptime = ms(process.uptime() * 1000)
      const exitCode = process.exitCode || 0
      // prettier-ignore
      const exitMessage = `${Config.get('appName')} exit with code ${exitCode} after ${uptime}`
      if (exitCode !== 0) logger('process').fatal(exitMessage)
      else logger('process').warn(exitMessage)
    })

    logger('app').warn(
      `Initializing ${Config.get('appName')} v${Config.get(
        'version'
      )} in ${Config.get('env')} mode.`
    )

    process.send('ready')
    resolve()
  })
