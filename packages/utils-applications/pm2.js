/* eslint camelcase: "off" */

const config = require('config')
const path = require('path')
const fp = require('lodash/fp')

const hiddenKeys = [
  '_env',
  '_envProd',
  '_ignore_watch',
  '_watch',
  'development',
  'id',
  'targetInstances'
]

const visibleKeys = [
  'env',
  'env_production',
  'error_file',
  'exec_mode',
  'ignore_watch',
  'instances',
  'max_restarts',
  'name',
  'out_file',
  'post_update',
  'watch'
]

const FORCE_DEV =
  'FORCE_PM2_DEV' in process.env
    ? process.env.FORCE_PM2_DEV.length === 0 ||
      parseInt(process.env.FORCE_PM2_DEV, 10) !== 0
    : false

const pm2Binary = path.basename(process.mainModule.filename)
const dev = pm2Binary === 'pm2-dev' || FORCE_DEV

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
    this.listen_timeout = 8000
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
    this.development = dev
  }

  get name () {
    return [config.get('basename'), fp.kebabCase(this.id)]
      .map(v => fp.toLower(v))
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
    return this.development ? 1 : 100
  }

  get error_file () {
    return this.development
      ? 'NULL'
      : path.resolve(config.get('paths.log'), `${this.name}.log`)
  }

  get out_file () {
    return this.development
      ? 'NULL'
      : path.resolve(config.get('paths.log'), `${this.name}.log`)
  }

  get env () {
    const base = {
      NODE_ENV: 'development',
      APP_NAME: this.id,
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

  toObject () {
    return fp.omit(hiddenKeys, fp.cloneDeep(fp.assignIn(this, {})))
  }

  toJSON () {
    return this.toObject()
  }

  static compileApps (apps) {
    return fp.map(app => app.toObject())(apps)
  }
}

fp.forEach(prop =>
  Object.defineProperty(Application.prototype, prop, { enumerable: true })
)(visibleKeys)

module.exports = Application
