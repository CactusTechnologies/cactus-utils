'use strict'

const Config = require('config')

Config.util.setModuleDefaults('pmx', {
  http: true,
  errors: false,
  custom_probes: true,
  network: true,
  ports: true,
  alert_enabled: true
})

const asyncExitHook = require('async-exit-hook')
const logger = require('@cactus-technologies/lab100-logger')
const prettyMs = require('pretty-ms')
const logInit = logger('init')
const logProcess = logger('process')

/** @type {BunyanInstance} log shortcut */
exports.log = logger('app')

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
        logProcess.fatal({ err: error }, `Undhandled Error: ${error.message}`)
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
      const uptime = prettyMs(process.uptime() * 1000)
      const exitCode = process.exitCode || 0
      // prettier-ignore
      const exitMessage = `${Config.get('appName')} exit with code ${exitCode} after ${uptime}`
      if (exitCode !== 0) logProcess.fatal(exitMessage)
      else logProcess.warn(exitMessage)
    })

    logInit.info(
      {
        host: Config.get('host'),
        env: Config.get('env'),
        logs: {
          directory: Config.get('paths.log'),
          level: Config.get('logs.level'),
          style: Config.get('logs.pretty') ? 'pretty' : 'json'
        }
      },
      `Initializing ${Config.get('appName')} v${Config.get('version')}`
    )
    process.send('ready')
    resolve()
  })
