'use strict'

/**
 * Creates a customized Bunyan Logger based on my opinionated vision
 * @module logger
 */

/* Dependencies */
const lo = require('lodash')
const Config = require('config')
const http = require('http')

Config.util.setModuleDefaults('logs', require('./config'))

const serializers = require('./lib/serializers')
const stream = require('./lib/stream')
const pino = require('./lib/pino')

/**
 * Default Logger options
 *
 * @type {Object}
 */

const options = {
  serializers: serializers,
  src: Config.get('logs.src') === true,
  level: Config.get('logs.level')
}

/**
 * Merge the given options with the default Options and returns a Logger
 *
 * @param  {(String|Object)} opts Logger's Name or Options
 *
 * @return {Logger}
 */

module.exports = function createLogger (opts = {}) {
  if (lo.isString(opts)) opts = { name: opts }
  if (!opts.name || !lo.isString(opts.name)) opts.name = 'process'

  if (Config.get('logs.prefix')) {
    opts.name = `${Config.get('logs.prefix')}:${opts.name}`
  }

  const instance = pino(Object.assign({}, options, opts), stream)

  return instance
}

module.exports.Serializers = serializers

/**
 * Returns an Express/Connect Middleware function which adds an specialized
 *   logger to each request and logs when the given request is complete
 *
 * @return {Function}  Middleware Function
 */

module.exports.Middleware = function logRequestsMiddleware () {
  const logger = module.exports('http')
  const startTime = Symbol('startTime')
  /**
   * Adds an specialized logger to each request and logs to the console when the
   * given request is complete
   * @param     {HttpRequest}       request
   * @param     {HttpResponse}      response
   * @param     {Function}          next
   */
  return function logRequests (request, response, next) {
    const blacklist = [...Config.get('logs.http.skipUserAgents')]
    const debugHeader = Config.get('logs.http.debugHeader')

    response[startTime] = response[startTime] || Date.now()

    request.log = logger.child({ req_id: request.reqId })

    if (blacklist.includes(request.get('user-agent'))) return next()

    /* Use the Debug Header */
    if (!lo.isEmpty(request.get(debugHeader))) request.log.level = 'trace'

    response.on('finish', onFinish)
    response.on('close', onClose)

    request.log.trace(`Request Start: ${request.method} ${request.originalUrl}`)

    next()

    function onFinish () {
      const status = response.statusCode || 200
      const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
      request.log[level](
        {
          req: request,
          res: response,
          duration: Date.now() - response[startTime]
        },
        http.STATUS_CODES[status]
      )
    }

    function onClose () {
      request.log.warn(
        `Socket Closed: ${request.method} ${request.originalUrl}`
      )
    }
  }
}
