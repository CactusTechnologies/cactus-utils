'use strict'

/**
 * Creates a customized Bunyan Logger based on my opinionated vision
 * @module logger
 */

const Config = require('config')
const bunyan = require('bunyan')
const lo = require('lodash')
const Utils = require('./lib/utils')

const DefaultConfig = {}

DefaultConfig.level = 'info'
DefaultConfig.src = false

DefaultConfig.pretty = false
DefaultConfig.cloudWatch = false

DefaultConfig.http = {
  obscureHeaders: ['authorization', 'x-lab100-app-secret', 'set-cookie'],
  excludeHeaders: [
    'x-amzn-trace-id',
    'x-content-type-options',
    'x-dns-prefetch-control',
    'x-download-options',
    'x-forwarded-port',
    'x-forwarded-proto',
    'x-frame-options',
    'x-xss-protection'
  ],
  skipUserAgents: ['ELB-HealthChecker'],
  debugHeader: 'X-Lab100-Debug',
  maxBody: 500
}

const envConfig = Utils.getConfigFromEnv()

Config.util.extendDeep(DefaultConfig, envConfig)
Config.util.setModuleDefaults('logs', DefaultConfig)

/**
 * Merge the given options with the default Options and returns a Logger
 *
 * @param  {(String|Object)} opts Logger's Name or Options
 *
 * @return {Logger}
 */

module.exports = function createLogger (opts = {}) {
  const DefaultOptions = require('./lib/options')

  if (lo.isString(opts)) opts = { name: opts }
  if (!opts.name || !lo.isString(opts.name)) opts.name = DefaultOptions.app

  const options = {
    serializers: DefaultOptions.serializers,
    src: DefaultOptions.src,
    app: DefaultOptions.app,
    streams: DefaultOptions.streams
  }

  const instance = bunyan.createLogger({ ...options, ...opts })
  return instance
}

/** @type {Object} Exports Serializers */
module.exports.Serializers = require('./lib/serializers')

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
    const blacklist = [...Config.get('logs.http.skipUserAgents')]
    const debugHeader = Config.get('logs.http.debugHeader')
    const uaTest = lo.overSome(
      blacklist.map(i => {
        const uaRegex = new RegExp(i, 'gmi')
        return uaRegex.test.bind(uaRegex)
      })
    )

    response.startTime = response.startTime || process.hrtime()
    request.log = logger.child({ req_id: request.reqId }, true)

    if (uaTest(request.get('user-agent'))) return next()

    /* Use the Debug Header */
    if (!lo.isEmpty(request.get(debugHeader))) {
      request.log.levels('main', bunyan.TRACE)
    }

    response.on('finish', onFinish)
    response.on('error', onError)

    request.log.trace(`Request Start: ${request.method} ${request.originalUrl}`)

    next()

    function onFinish () {
      this.removeListener('error', onError)
      this.removeListener('finish', onFinish)
      const status = this.statusCode || 200
      const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
      request.log[level]({
        req: request,
        res: this,
        duration: this.duration || Utils.getDuration(this.startTime)
      })
    }

    function onError (error) {
      this.removeListener('error', onError)
      this.removeListener('finish', onFinish)
      this.statusCode = 500
      request.log.warn(
        {
          req: request,
          res: this,
          duration: this.duration || Utils.getDuration(this.startTime)
        },
        error.message
      )
    }
  }
}
