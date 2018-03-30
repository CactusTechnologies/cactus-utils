'use strict'

const Config = require('config')
const moment = require('moment')
const asyncExitHook = require('async-exit-hook')
const logger = require('@cactus-technologies/lab100-logger')

const logInit = logger('init')
const logLogs = logger('logs')
const logProcess = logger('process')

/** @type {BunyanInstance} log shortcut */
exports.log = logger('app')

/** @type {Proxy} PMX module */
exports.pmx = require('./lib/pmxProxy')

/**
 * Appends Listeners for:
 *   - uncaughtException
 *   - unhandledRejection
 *   - process exit
 * Initializes PMX and Logs Basic configuration data.
 *
 * @return {Promise}
 */

exports.init = () =>
  new Promise((resolve, reject) => {
    /* Enable PMX - Keymetrics */
    exports.pmx.init(Config.get('pmx'))
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
      const uptime = moment.duration(process.uptime(), 'seconds').humanize()
      const exitCode = process.exitCode || 0
      // prettier-ignore
      const exitMessage = `${Config.get('appName')} exit with code ${exitCode} after ${uptime}`
      if (exitCode !== 0) logProcess.fatal(exitMessage)
      else logProcess.warn(exitMessage)
    })
    // prettier-ignore
    logInit.info(`Initializing ${Config.get('appName')} v${Config.get('version')}`)
    // prettier-ignore
    logInit.info(`Configuring ${Config.get('appName')} for: ${Config.get('host')} - ${Config.get('env')}`)
    logInit.info(`Application root: ${Config.get('paths.root')}`)
    logLogs.info(`directory: ${Config.get('paths.log')}`)
    logLogs.info(`level: ${Config.get('logs.level')}`)
    // prettier-ignore
    logLogs.info(`style: ${Config.get('logs.streams.pretty') ? 'pretty' : 'bunyan'}`)

    // prettier-ignore
    if (Config.get('logs.streams.cloudWatch')) {
      logLogs.info(`Sending Logs to AWS CloudWatch under: ${Config.get('logs.cloudWatch.logGroupName')} - ${Config.get('logs.cloudWatch.logStreamName')}`)
    }

    resolve()
  })
