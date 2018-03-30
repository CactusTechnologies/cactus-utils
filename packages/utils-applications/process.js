'use strict'

const Config = require('config')
const moment = require('moment-timezone')
const lo = require('lodash')
const asyncExitHook = require('async-exit-hook')
const log = require('@cactus-technologies/lab100-logger')()

Config.util.setModuleDefaults('pmx', {
  http: true,
  errors: false,
  custom_probes: true,
  network: true,
  ports: true
})

/** @type {Object} PMX module */
exports.pmx = require('pmx')

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
        log.fatal({ err: error }, `Undhandled Error: ${error.message}`)
        exports.pmx.notify(error)
        process.nextTick(() => process.exit(1))
      }
    )

    /* Catch unhandledRejections */
    process.prependListener(
      'unhandledRejection',
      function customUnhandledRejectionListener (reason) {
        if (!lo.isError(reason)) reason = new Error(reason)
        throw reason
      }
    )

    /* Add the exit hook message */
    asyncExitHook(function exitMessage () {
      const uptime = moment.duration(process.uptime(), 'seconds').humanize()
      const exitCode = process.exitCode || 0
      const exitMessage = `About to Exit with code ${exitCode} after ${uptime}`
      if (exitCode !== 0) log.fatal(exitMessage)
      else log.warn(exitMessage)
    })

    log.info(`Initializing ${Config.get('appName')} v${Config.get('version')}`)
    // prettier-ignore
    log.info(`Configuring ${Config.get('appName')} for: ${Config.util.getEnv('HOSTNAME')} - ${Config.get('env')}`)

    log.info(`Log level: ${Config.get('logs.level')}`)

    if (Config.get('logs.streams.pretty')) {
      log.info('Logging style: pretty')
    } else {
      log.info('Logging style: bunyan')
    }

    // prettier-ignore
    if (Config.get('logs.streams.cloudWatch')) {
      log.info(`Sending Logs to AWS CloudWatch under: ${Config.get('logs.cloudWatch.logGroupName')} - ${Config.get('logs.cloudWatch.logStreamName')}`)
    }

    resolve()
  })
