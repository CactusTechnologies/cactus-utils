/**
 * Creates a customized Pino Logger based on my opinionated vision
 * @module logger
 */

const config = require('config')
const pino = require('pino')
const lo = require('lodash')
const path = require('path')

const utils = require('./lib/utils')
const serializers = require('./lib/serializers')
const pinoProxy = require('./lib/pino-proxy')

const conf = config.util.loadFileConfigs(path.resolve(__dirname, 'config'))
config.util.setModuleDefaults('logs', conf)

/**
 * Merge the given options with the default Options and returns a Logger
 *
 * @param  {String|Object} opts Logger's Name
 *
 * @return {Object}
 */

module.exports = function createLogger (opts = {}) {
  const fileds = ['safe', 'level', 'serializers', 'base']
  if (lo.isString(opts)) opts = { name: opts }
  if (!opts.name || !lo.isString(opts.name)) opts.name = utils.getAppName()

  lo.set(opts, 'base', utils.extend(opts.base || {}, lo.omit(opts, fileds)))

  const options = utils.extend(
    {
      safe: true,
      level: config.get('logs.level'),
      serializers: serializers,
      base: {
        pid: process.pid,
        hostname: utils.getHostName(),
        app: utils.getAppName()
      }
    },
    lo.pick(opts, fileds)
  )

  return pinoProxy(pino(options, require('./lib/stream')))
}

/** @type {Object} Exports Serializers */
module.exports.Serializers = serializers
