'use strict'
/* eslint camelcase: "off" */

const Config = require('config')
const path = require('path')
const fp = require('lodash/fp')

Config.util.setModuleDefaults('pm2', {
  instance_var: 'INSTANCE_ID',
  merge_logs: true,
  min_uptime: 3000,
  restart_delay: 100,
  max_restarts: 10
})

const OMITKEYS = [
  'id',
  'targetInstances',
  '_env',
  '_envProd',
  '_watch',
  'forceDev'
]

const DASH_CHAR = '-'
const MAX_LINE = 79
const ENTRY = path.basename(process.mainModule.filename)

const pad = fp.padCharsEnd(DASH_CHAR, MAX_LINE)

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

  printConfig () {
    console.log(pad(`--- ${this.name} `))
    console.log('')
    console.log(this.toObject())
    console.log('')
  }

  toObject () {
    return fp.omit(OMITKEYS, fp.cloneDeep(fp.assignIn(this, {})))
  }

  static compileApps (apps) {
    fp.forEach(app => app.printConfig())(apps)
    return fp.map(app => app.toObject())(apps)
  }
}

setEnumerable('name')
setEnumerable('instances')
setEnumerable('exec_mode')
setEnumerable('watch')
setEnumerable('ignore_watch')
setEnumerable('max_restarts')
setEnumerable('error_file')
setEnumerable('out_file')
setEnumerable('env')
setEnumerable('env_production')

module.exports = Application

function setEnumerable (prop) {
  Object.defineProperty(Application.prototype, prop, { enumerable: true })
}
