/**
 * Creates a customized Pino Logger based on my opinionated vision
 * @module logger
 */

const config = require('config')
const pino = require('pino')
const lo = require('lodash')
const utils = require('./lib/utils')
const serializers = require('./lib/serializers')
const pinoProxy = require('./lib/pino-proxy')

const defaultConfig = {
  level: 'info',
  pretty: false,
  http: {
    obscureHeaders: ['authorization', 'set-cookie'],
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
    skipUserAgents: ['ELB-HealthChecker']
  }
}

const envConfig = utils.getConfigFromEnv()

config.util.extendDeep(defaultConfig, envConfig)
config.util.setModuleDefaults('logs', defaultConfig)

/**
 * Merge the given options with the default Options and returns a Logger
 *
 * @param  {String} opts Logger's Name
 *
 * @return {Object}
 */

module.exports = function createLogger (name) {
  if (!name || !lo.isString(name)) name = utils.getAppName()

  const options = {
    safe: true,
    name: name,
    level: config.get('logs.level'),
    serializers: serializers,
    base: {
      pid: process.pid,
      hostname: utils.getHostName(),
      app: utils.getAppName()
    }
  }

  return pinoProxy(pino(options, require('./lib/stream')))
}

/** @type {Object} Exports Serializers */
module.exports.Serializers = serializers

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
    const blacklist = [...config.get('logs.http.skipUserAgents')]
    const debugHeader = 'X-Cactus-Debug'
    const uaTest = lo.overSome(
      blacklist.map(i => {
        const uaRegex = new RegExp(i, 'gmi')
        return uaRegex.test.bind(uaRegex)
      })
    )

    response.startTime = response.startTime || process.hrtime()
    request.log = logger.child({ req_id: request.reqId })

    if (uaTest(request.get('user-agent'))) return next()

    /* Use the Debug Header */
    if (!lo.isEmpty(request.get(debugHeader))) {
      request.log.level = 'trace'
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
        duration: this.duration || utils.getDuration(this.startTime)
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
          duration: this.duration || utils.getDuration(this.startTime)
        },
        error.message
      )
    }
  }
}
