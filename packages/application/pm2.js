/* eslint camelcase: "off" */

/* Load .env first */
require('./dot-env')()

const config = require('config')
const path = require('path')
const fp = require('lodash/fp')
const util = require('util')
const { assert } = require('@cactus-technologies/utils')

const keys = [
  'script',
  'name',
  'cwd',
  'args',
  'interpreter',
  'node_args',
  'out_file',
  'error_file',
  'env',
  'env_production',
  'max_memory_restart',
  'restart_delay',
  'wait_ready',
  'instances',
  'kill_timeout',
  'listen_timeout',
  'cron_restart',
  'merge_logs',
  'autorestart',
  'watch',
  'ignore_watch',
  'watch_options',
  'min_uptime',
  'max_restarts',
  'exec_mode',
  'deep_monitoring',
  'increment_var',
  'instance_var',
  'kill_retry_time',
  'io'
]

/**
 * Creates a new Application Definition
 *
 * @param  {String} name       App Name
 * @param  {String} entryPoint App entry point
 *
 * @class
 *
 * @classdesc PM2 Application help.
 */

class Application {
  constructor (name, entryPoint) {
    /* General */
    this.id = name
    this.script = entryPoint
    this.instances = 1
    this.env = {}

    /* Sensitive defaults */
    this.instance_var = 'INSTANCE_ID'
    this.merge_logs = true
    this.min_uptime = 3000
    this.listen_timeout = 6000
    this.kill_timeout = 3000
    this.restart_delay = 100

    this.wait_ready = false
    this.deep_monitoring = false

    this.post_update = ['npm install']

    this._ignore_watch = []
    this._watch = []

    this.watch = ['config/**/**', 'lib/**/**', 'src/**/**']
    this.ignore_watch = ['node_modules/**', '*.log']

    this.targetInstances = 1
    this.max_restarts = 100

    this.development = Application.isDev()
    this.runtime = Application.isRuntime()
    this.io = {
      conf: { catchExceptions: false, metrics: { network: { ports: true } } }
    }
  }

  get name () {
    return [config.get('basename'), fp.kebabCase(this.id)]
      .map(fp.toLower)
      .join('-')
  }

  get service () {
    return config
      .get('domain')
      .split('.')
      .reverse()
      .concat([fp.toLower(fp.camelCase(this.id))])
      .join('.')
  }

  get instances () {
    return this.development ? 1 : this.targetInstances
  }

  set instances (val) {
    this.targetInstances = val
  }

  get exec_mode () {
    return this.instances === 1 ? 'fork' : 'cluster'
  }

  get watch () {
    return this.development
      ? [...new Set([this.script, ...this._watch])]
      : false
  }

  set watch (val) {
    val = fp.isArray(val) ? val : [val]
    this._watch = [val]
  }

  get ignore_watch () {
    return [...new Set(this._ignore_watch)]
  }

  set ignore_watch (val) {
    val = fp.isArray(val) ? val : [val]

    this._ignore_watch = [...this._ignore_watch, ...val]
  }

  get max_restarts () {
    return this.development ? 1 : this._max_restarts
  }

  set max_restarts (val) {
    this._max_restarts = val
  }

  get error_file () {
    return this.development || this.runtime
      ? '/dev/null'
      : path.resolve(config.get('paths.log'), `${this.name}.log`)
  }

  get out_file () {
    return this.development || this.runtime
      ? '/dev/null'
      : path.resolve(config.get('paths.log'), `${this.name}.log`)
  }

  get env () {
    const base = {
      NODE_ENV: 'development',
      APP_NAME: this.id,
      DEBUG_HIDE_DATE: this.development ? true : undefined,
      DEBUG_COLORS: this.development ? true : undefined,
      PRETTY_TERM_COLORS: this.development ? true : undefined,
      CACTUS_LOGS_PRETTY: this.development ? true : undefined,
      PROCESS_TITLE: this.service
    }

    return config.util.extendDeep({}, base, this._env)
  }

  set env (val) {
    this._env = val
  }

  get env_production () {
    const base = { NODE_ENV: 'production' }
    return config.util.extendDeep({}, base, this._envProd)
  }

  set env_production (val) {
    this._envProd = val
  }

  toJSON () {
    return fp.pipe(
      fp.map(key => [key, fp.getOr(null, key)(this)]),
      fp.filter(([key, val]) => assert.notNil(val)),
      fp.fromPairs
    )(keys)
  }

  [util.inspect.custom] (depth, options) {
    return this.toJSON()
  }

  * [Symbol.iterator] () {
    const it = this.toJSON()
    for (const key of Object.keys(it)) {
      yield [key, it[key]]
    }
  }

  static isDev () {
    return path.basename(process.mainModule.filename) === 'pm2-dev'
  }

  static isRuntime () {
    return path.basename(process.mainModule.filename) === 'pm2-runtime'
  }
}

module.exports = Application
