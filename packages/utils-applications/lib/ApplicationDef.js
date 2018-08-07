/* eslint camelcase: "off" */

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

const appIDs = new Set()

/* Load the default configuration */
require('config').util.setModuleDefaults('pm2', {
  restartDelay: 100,
  killTimeout: 3000,
  listenTimeout: 6000,
  autorestart: true,
  watch: ['config/**/**', 'lib/**/**'],
  ignoreWatch: ['node_modules/**', '*.log'],
  watchOptions: {},
  waitReady: false,
  minUptime: 100,
  maxRestarts: 10,
  deepMonitoring: false,
  instanceVar: 'INSTANCE_ID',
  killRetryTime: 100,
  catchExceptions: false,
  metrics: { network: { ports: true } }
})

/**
 * Creates a new Application Definition
 *
 * @param  {String} name       App Name
 * @param  {String} entryPoint App entry point
 *
 * @class
 *
 * @classdesc PM2 Application definition.
 */

class ApplicationDef {
  constructor(name, script, args = [], env = {}) {
    if (!assert.isString(name)) throw new Error('Parameter "name" is required.')
    if (!assert.isString(script)) {
      throw new Error('Parameter "script" is required.')
    }

    if (assert.isObject(args) && assert.isEmpty(env)) {
      env = args
      args = []
    }

    if (!assert.isArray(args)) {
      throw new Error('Parameter "args" should be an array.')
    }

    if (appIDs.has(name)) throw new Error('Appication "name" should be unique.')
    else appIDs.add(name)

    /* Extras */
    this.id = name
    this.development = ApplicationDef.isDev()
    this.forceWatch = this.development
    this.config = require('./config') // delay the config module loading

    /* ecosystem */
    this.script = script
    this.args = args
    this.env = env
    this.env_production = { NODE_ENV: 'production' }
    this.restart_delay = this.config.get('pm2.restartDelay')
    this.wait_ready =
      this.development === false && this.config.get('pm2.waitReady') === true
    this.instances = 1
    this.kill_timeout = this.config.get('pm2.killTimeout')
    this.listen_timeout = this.config.get('pm2.listenTimeout')
    this.merge_logs = true
    this.vizion = true
    this.autorestart = this.config.get('pm2.autorestart')
    this.watch = this.config.get('pm2.watch')
    this.ignore_watch = this.config.get('pm2.ignoreWatch')
    this.watch_options = this.config.get('pm2.watchOptions')
    this.min_uptime = this.config.get('pm2.minUptime')
    this.max_restarts = this.config.get('pm2.maxRestarts')
    this.deep_monitoring = this.config.get('pm2.deepMonitoring')
    this.instance_var = this.config.get('pm2.instanceVar')
    this.kill_retry_time = this.config.get('pm2.killRetryTime')
    this.io = {
      conf: {
        catchExceptions: this.config.get('pm2.catchExceptions'),
        metrics: this.config.util.toObject(this.config.get('pm2.metrics'))
      }
    }
  }

  get name() {
    return [this.config.get('domain'), fp.kebabCase(this.id)]
      .map(v => fp.toLower(v))
      .join('-')
  }

  get service() {
    return this.config
      .get('extDomain')
      .split('.')
      .reverse()
      .concat([fp.toLower(fp.camelCase(this.id))])
      .join('.')
  }

  get instances() {
    return this.development ? 1 : this.targetInstances
  }

  set instances(val) {
    this.targetInstances = val
  }

  get exec_mode() {
    return this.instances === 1 ? 'fork' : 'cluster'
  }

  get watch() {
    return this.development || this.forceWatch
      ? fp.endsWith('js', this.script)
        ? [...new Set([this.script, ...this._watch])]
        : [...new Set([...this._watch])]
      : false
  }

  set watch(val) {
    val = assert.isArray(val) ? val : [val]
    this._watch = this._watch || []
    this._watch = [...this._watch, ...val]
  }

  get ignore_watch() {
    return [...new Set(this._ignore_watch)]
  }

  set ignore_watch(val) {
    val = assert.isArray(val) ? val : [val]
    this._ignore_watch = this._ignore_watch || ['node_modules/**', '*.log']
    this._ignore_watch = [...this._ignore_watch, ...val]
  }

  get max_restarts() {
    return this.development ? 1 : this._max_restarts
  }

  set max_restarts(val) {
    this._max_restarts = val
  }

  get error_file() {
    return this.development
      ? '/dev/null'
      : path.resolve(this.config.get('paths.log'), `${this.name}.log`)
  }

  get out_file() {
    return this.development
      ? '/dev/null'
      : path.resolve(this.config.get('paths.log'), `${this.name}.log`)
  }

  get env() {
    const base = {
      NODE_ENV: 'development',
      APP_NAME: this.id,
      PROCESS_TITLE: this.service,
      DEBUG_HIDE_DATE: this.development ? true : undefined,
      DEBUG_COLORS: this.development ? true : undefined,
      CACTUS_LOGS_PRETTY: this.development ? true : undefined,
      PRETTY_TERM_COLORS: this.development ? true : undefined
    }

    return this.config.util.extendDeep({}, base, this._env)
  }

  set env(val) {
    this._env = val
  }

  toJSON() {
    return fp.pipe(
      fp.map(key => [key, fp.getOr(null, key)(this)]),
      fp.filter(([key, val]) => assert.notNil(val)),
      fp.fromPairs
    )(keys)
  }

  [util.inspect.custom](depth, options) {
    return this.toJSON()
  }

  *[Symbol.iterator]() {
    const it = this.toJSON()
    for (const key of Object.keys(it)) {
      yield [key, it[key]]
    }
  }

  static isDev() {
    return path.basename(process.mainModule.filename) === 'pm2-dev'
  }
}

module.exports = ApplicationDef
