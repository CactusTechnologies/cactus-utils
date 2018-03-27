'use strict'
/* eslint camelcase: "off" */

const Config = require('config')
const path = require('path')
const camelCase = require('lodash/camelCase')
const kebabCase = require('lodash/kebabCase')
const toLower = require('lodash/toLower')
const upperFirst = require('lodash/upperFirst')

Config.util.setModuleDefaults('pm2', {
  instance_var: 'INSTANCE_ID',
  merge_logs: true,
  min_uptime: 3000,
  restart_delay: 100,
  max_restarts: 10
})

const IS_PM2_DEV = path.basename(process.mainModule.filename) === 'pm2-dev'

/**
 * Creates a new Application Definition
 *
 * @param  {String} name       App Name
 * @param  {String} entryPoint App entry point
 * @param  {Object} env        Env to run the app
 * @param  {Number} instances  How many instances
 *
 * @class
 *
 * @classdesc PM2 Application help.
 */

class Application {
  constructor (name, entryPoint, env = {}, instances = 1) {
    /* General */
    this.id = name
    this.script = entryPoint
    this.instances = instances
    this.env = env

    /* Sensitive defaults */
    this.instance_var = Config.get('pm2.instance_var')
    this.merge_logs = Config.get('pm2.merge_logs')
    this.min_uptime = Config.get('pm2.min_uptime')
    this.restart_delay = Config.get('pm2.restart_delay')
  }

  get appName () {
    return [Config.get('basename'), camelCase(this.id)]
      .map(v => upperFirst(v))
      .join('-')
  }

  get name () {
    return [Config.get('basename'), kebabCase(this.id)]
      .map(v => toLower(v))
      .join('-')
  }

  get service () {
    return Config.get('domain')
      .split('.')
      .reverse()
      .concat([toLower(camelCase(this.id))])
      .join('.')
  }

  get instances () {
    return IS_PM2_DEV ? 1 : this.targetInstances
  }

  set instances (val) {
    this.targetInstances = val
  }

  get exec_mode () {
    return this.instances === 1 ? 'fork' : 'cluster'
  }

  get watch () {
    return IS_PM2_DEV ? [this.script, ...Config.get('watch')] : false
  }

  get ignore_watch () {
    return [...Config.get('ignoreWatch')]
  }

  get max_restarts () {
    return IS_PM2_DEV ? 2 : Config.get('max_restarts')
  }

  get error_file () {
    return IS_PM2_DEV
      ? 'NULL'
      : path.resolve(Config.get('paths.log'), `${this.name}.log`)
  }

  get out_file () {
    return IS_PM2_DEV
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
          prefix: kebabCase(this.id),
          streams: { pretty: IS_PM2_DEV ? true : undefined }
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
}

module.exports = Application
