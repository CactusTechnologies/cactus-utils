'use strict'

const Config = require('config')
const pmx = require('pmx')
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

exports.init = () =>
  new Promise((resolve, reject) => {
    /* Enable PMX - Keymetrics */
    pmx.init(Config.get('pmx'))
    /* Catch uncaughExeptions */
    process.prependListener(
      'uncaughtException',
      function customUncaughtExceptionListener (error) {
        log.fatal({ err: error }, `Undhandled Error: ${error.message}`)
        pmx.notify(error)
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

    resolve()
  })

exports.printInfo = (extras = {}) =>
  new Promise((resolve, reject) => {
    /* Log the configuration */
    log.info(
      {
        env: Config.get('env'),
        instance: Config.get('instance'),
        logs: Config.get('logs.level'),
        ...extras
      },
      `Initializing ${Config.get('appName')} v${Config.get('version')}`
    )

    resolve()
  })

exports.notify = data => pmx.notify(data)

exports.emit = Config.get('isDev')
  ? lo.stubTrue
  : (id, data) => pmx.emit(id, data || undefined)
