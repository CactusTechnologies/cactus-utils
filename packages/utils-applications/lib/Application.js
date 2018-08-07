'use strict'

/* Create a single unique symbol for the app */
const APP_KEY = Symbol.for('@cactus-technologies/node-application')
const APP_EXISTS = Object.getOwnPropertySymbols(global).indexOf(APP_KEY) > -1

const io = require('@pm2/io')
const fp = require('lodash/fp')
const ms = require('pretty-ms')
const utils = require('@cactus-technologies/utils')

const debug = require('debug')('cactus:app')
debug.status = require('debug')('cactus:app:status')
debug.paths = require('debug')('cactus:app:paths')

class CactusApplication {
  constructor() {
    this.metric = io.metric.bind(io)
    this.action = io.action.bind(io)
    this.onExit = require('async-exit-hook')
    this.hasInit = false
  }

  get config() {
    return require('./config')
  }

  get uuid() {
    return [this.domain, fp.kebabCase(this.name)]
      .map(v => fp.toLower(v))
      .join('-')
  }

  get name() {
    return this.config.get('name')
  }

  get domain() {
    return this.config.get('domain')
  }

  get service() {
    return this.config.get('service')
  }

  get version() {
    return this.config.get('version')
  }

  get env() {
    return this.config.get('env')
  }

  get isDev() {
    return this.config.get('isDev')
  }

  get host() {
    return this.config.get('host')
  }

  get uptime() {
    return ms(process.uptime() * 1000)
  }

  addMetric(name, defaultValue = true) {
    if (!utils.assert.isString(name)) throw new TypeError('name is required')

    if (metrics.has(name)) {
      process.log.warn(`The metric ${name} is already registered.`)
      return
    }

    debug.status('Creating status: %s with value [ %o ]', name, defaultValue)

    statuses.set(name, defaultValue)

    metrics.set(
      name,
      this.metric({
        type: 'metric',
        name: `cactus:${name}`,
        value: () => this.status[name]
      })
    )

    Object.defineProperty(this.status, name, {
      get() {
        return statuses.get(name)
      },
      set(newValue) {
        const oldValue = statuses.get(name)
        debug.status(
          'Changing status %s to %o from %o',
          name,
          newValue,
          oldValue
        )
        statuses.set(name, newValue)
        return statuses.get(name)
      },
      enumerable: true,
      configurable: false
    })
  }

  async init(...modules) {
    /* Ensures the config gets loaded now */
    debug('Process name: %s', this.service)

    /* Create loggers */
    this.log = require('@cactus-technologies/logger')()
    process.log = require('@cactus-technologies/logger')('process')

    if (this.hasInit) this.log.error('Application has initialized already')
    if (this.hasInit) return
    /* Handle Exeptions */

    // log to stdout
    this.onExit.uncaughtExceptionHandler(error => process.log.fatal(error))

    debug('pmx notifications: %o', this.usePmx)
    debug('slack notifications: %o', this.useSlack)
    this.onExit.uncaughtExceptionHandler((error, done) => {
      this.notifyError(error, 'uncaughtException', done)
    })

    /* Catch unhandledRejections */
    process.removeAllListeners('unhandledRejection')
    process.prependListener('unhandledRejection', reason => {
      if (reason instanceof Error) throw reason
      throw new Error(reason || 'unhandledRejection')
    })

    process.log.warn('Starting Application: %s v%s', this.uuid, this.version)
    process.log.info('Enviroment: %s', this.env)
    process.log.info('Log level: %s', this.config.get('logs.level'))

    fp.pipe(
      fp.get('config.paths'),
      fp.toPairs,
      fp.forEach(([p, s]) => debug.paths('%s: %o', p, s))
    )(this)

    return true
  }

  async ready() {
    /* Add the exit hook message */
    this.onExit(() => {
      const code = process.exitCode || 0
      const log = code !== 0 ? process.log.fatal : process.log.warn
      log('Exiting App: %s with code %s after %s', this.uuid, code, this.uptime)
    })

    process.log.info('Application %s is ready (+%s)', this.uuid, this.uptime)

    if ('send' in process) process.send('ready')
  }

  async kill(err) {
    process.log.info('Falied to initialize the App, Commiting suicide.')
    if (err instanceof Error) throw err
    throw new Error('Falied to initialize.')
  }
}

// ───────────────────────────────  SINGLETON  ─────────────────────────────────

module.exports = utils.singleton(
  CactusApplication,
  '@cactus-technologies/node-application',
  true
)
