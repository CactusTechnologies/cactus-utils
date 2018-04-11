/* eslint camelcase: "off" */

process.env.NODE_CONFIG = JSON.stringify({
  logs: {
    prefix: false,
    level: 'info',
    streams: {
      pretty: true,
      cloudWatch: false
    },
    pretty: {
      colors: require('supports-color').level,
      timeStamps: true
    }
  }
})

const Config = require('config')
const path = require('path')
const fp = require('lodash/fp')
const log = require('@cactus-technologies/lab100-logger')('pm2')

Config.util.setModuleDefaults('pm2', {
  instance_var: 'INSTANCE_ID',
  merge_logs: true,
  min_uptime: 3000,
  restart_delay: 100,
  max_restarts: 10
})

const hiddenKeys = [
  'id',
  'targetInstances',
  '_env',
  '_envProd',
  '_watch',
  'forceDev'
]

const visibleKeys = [
  'name',
  'instances',
  'exec_mode',
  'watch',
  'ignore_watch',
  'max_restarts',
  'error_file',
  'out_file',
  'env',
  'env_production'
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
    const ENTRY = path.basename(process.mainModule.filename)

    /* General */
    this.id = name
    this.script = entryPoint
    this.instances = 1
    this.env = {}

    /* Sensitive defaults */
    this.instance_var = Config.get('pm2.instance_var')
    this.merge_logs = Config.get('pm2.merge_logs')
    this.min_uptime = Config.get('pm2.min_uptime')
    this.restart_delay = Config.get('pm2.restart_delay')

    this._watch = [...Config.get('watch')]
    this.forceDev = ENTRY === 'pm2-dev' || ENTRY === 'pm2-runtime' || false
  }

  get appName () {
    return [Config.get('basename'), fp.camelCase(this.id)]
      .map(v => fp.upperFirst(v))
      .join('-')
  }

  get name () {
    return [Config.get('basename'), fp.kebabCase(this.id)]
      .map(v => fp.toLower(v))
      .join('-')
  }

  get service () {
    return Config.get('domain')
      .split('.')
      .reverse()
      .concat([fp.toLower(fp.camelCase(this.id))])
      .join('.')
  }

  get instances () {
    return this.forceDev ? 1 : this.targetInstances
  }

  set instances (val) {
    this.targetInstances = val
  }

  get exec_mode () {
    return this.instances === 1 ? 'fork' : 'cluster'
  }

  get watch () {
    return this.forceDev ? [this.script, ...this._watch] : false
  }

  set watch (value) {
    this._watch = value
  }

  get ignore_watch () {
    return [...Config.get('ignoreWatch')]
  }

  get max_restarts () {
    return this.forceDev ? 2 : Config.get('pm2.max_restarts')
  }

  get error_file () {
    return this.forceDev
      ? 'NULL'
      : path.resolve(Config.get('paths.log'), `${this.name}.log`)
  }

  get out_file () {
    return this.forceDev
      ? 'NULL'
      : path.resolve(Config.get('paths.log'), `${this.name}.log`)
  }

  get env () {
    const base = {
      NODE_ENV: 'development',
      PROCESS_TITLE: this.service,
      NODE_CONFIG: {
        appName: this.appName,
        service: this.service,
        logs: {
          prefix: fp.kebabCase(this.id),
          streams: { pretty: this.forceDev ? true : undefined }
        }
      }
    }

    return Config.util.extendDeep({}, base, this._env)
  }

  set env (val) {
    this._env = val
  }

  get env_production () {
    const base = { NODE_ENV: 'production' }
    return Config.util.extendDeep({}, base, this._envProd)
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

  toPm2Process () {
    const lean = this.toObject()
    log.info(lean, `Application: ${this.name}`)
    return lean
  }

  static compileApps (apps) {
    return fp.map(app => app.toPm2Process())(apps)
  }
}

// prettier-ignore
fp.forEach(prop => Object.defineProperty(Application.prototype, prop, { enumerable: true }))(visibleKeys)

module.exports = Application