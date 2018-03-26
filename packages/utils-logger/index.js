'use strict'

/**
 * Creates a customized Bunyan Logger based on my opinionated vision
 * @module logger
 */

/* Dependencies */
const lo = require('lodash')
const bunyan = require('bunyan')
const Config = require('config')
const http = require('http')

Config.util.setModuleDefaults('logs', require('./config'))

/**
 * A singleton holding all loggers
 * @type {Map}
 */
const Loggers = new Map()

const serializers = require('./lib/serializers')
const streams = require('./lib/streams')

/**
 * Default Logger options
 *
 * @type {Object}
 */

const options = {
  serializers: serializers,
  src: Config.get('logs.src') === true,
  streams: []
}

options.streams.push({
  level: bunyan.resolveLevel(Config.get('logs.level')),
  stream: Config.get('logs.streams.pretty')
    ? streams.pretty(process.stdout, Config.get('logs.pretty'))
    : process.stdout
})

if (Config.get('logs.streams.cloudWatch')) {
  options.streams.push({
    type: 'raw',
    level: bunyan.resolveLevel(Config.get('logs.level')),
    stream: streams.cloudWatch(Config.get('logs.cloudWatch'))
  })
}

/**
 * Merge the given options with the default Options and create a bunyan
 *   instance
 *
 * @param  {(String|Object)} opts Logger's Name or Options
 *
 * @return {BunyanInstance}
 */

module.exports = function createLogger (opts = {}) {
  if (lo.isString(opts)) opts = { name: opts }
  if (!opts.name || !lo.isString(opts.name)) opts.name = 'process'

  if (Config.get('logs.prefix')) {
    opts.name = `${Config.get('logs.prefix')}:${opts.name}`
  }

  if (Loggers.has(opts.name)) return Loggers.get(opts.name)

  const instanceOptions = lo.mergeWith({}, options, { ...opts }, customizer)
  const instance = bunyan.createLogger(instanceOptions)

  Loggers.set(opts.name, instance)

  return instance
}

module.exports.Serializers = serializers
module.exports.Loggers = Loggers

/**
 * Returns an Express/Connect Middleware function which adds an specialized
 *   logger to each request and logs when the given request is complete
 *
 * @return {Function}  Middleware Function
 */

module.exports.Middleware = function logRequestsMiddleware () {
  const logger = module.exports('http')
  /**
   * Adds an specialized logger to each request and logs to the console when the
   * given request is complete
   * @param     {HttpRequest}       request
   * @param     {HttpResponse}      response
   * @param     {Function}          next
   */
  return function logRequests (request, response, next) {
    const start = process.hrtime()
    const blacklist = [...Config.get('logs.http.skipUserAgents')]
    const debugHeader = Config.get('logs.http.debugHeader')
    const log = logger.child({ req_id: request.reqId }, true)

    request.log = log
    request.logBody = true

    if (blacklist.includes(request.get('user-agent'))) return next()

    /* Use the Debug Header */
    if (request.get(debugHeader) === 'verbose') request.log.level(20)
    if (request.get(debugHeader) === 'trace') request.log.level(10)

    response.on('finish', onFinish)
    response.on('close', () => request.log.warn('Request Socket Closed'))

    request.log.trace('Request Start')

    next()

    function onFinish () {
      const status = response.statusCode || 200
      const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
      request.log[level](
        {
          req: request,
          res: response,
          duration: getDuration(start),
          body: request.logBody
            ? lo.isEmpty(request.body) ? undefined : request.body
            : undefined
        },
        http.STATUS_CODES[status]
      )
    }
  }
}

// ────────────────────────────────  Private  ──────────────────────────────────

/** Merges arrays by union */
function customizer (objValue, srcValue) {
  if (lo.isArray(objValue)) return lo.union(objValue, srcValue)
}

/** Gets the a HRTIME duration as ms */
function getDuration (start) {
  var diff = process.hrtime(start)
  return diff[0] * 1e3 + diff[1] * 1e-6
}
