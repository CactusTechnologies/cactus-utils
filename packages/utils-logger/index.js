'use strict'

/**
 * Creates a customized Bunyan Logger based on my opinionated vision
 * @module logger
 */

/* Dependencies */
const lo = require('lodash')
const Config = require('config')
const bunyan = require('bunyan')

Config.util.setModuleDefaults('logs', require('./config'))

const serializers = require('./lib/serializers')
const streams = require('./lib/streams')
const utils = require('./lib/utils')

const LEVEL = bunyan.resolveLevel(Config.get('logs.level'))

/**
 * Default Logger options
 *
 * @type {Object}
 */

const options = {
  serializers: serializers,
  src: Config.get('logs.src') === true,
  appName: Config.has('appId') ? Config.get('appId') : Config.get('appName'),
  streams: [
    {
      name: 'main',
      level: LEVEL,
      stream: process.stdout
    }
  ]
}

if (Config.get('logs.pretty') === true) {
  const prettyOptions = { colorLevel: 2, timeStamps: false }

  options.streams = []

  options.streams.push({
    name: 'main',
    level: LEVEL,
    stream: streams.pretty(process.stdout, prettyOptions)
  })
}

// if (Config.get('logs.cloudWatch') === true) {
//   if (
//     Config.has('cloudWatch') &&
//     Config.has('cloudWatch.accessKeyId') &&
//     Config.has('cloudWatch.secretAccessKey') &&
//     Config.has('cloudWatch.region')
//   ) {
//   }

//   const cloudWatchOptions = Config.get('cloudWatch')

//   options.streams.push({
//      name: 'cloudWatch',
//     type: 'raw',
//     level: bunyan.INFO,
//     stream: streams.cloudWatch(Config.get('logs.cloudWatch'))
//   })
// }

/**
 * Merge the given options with the default Options and returns a Logger
 *
 * @param  {(String|Object)} opts Logger's Name or Options
 *
 * @return {Logger}
 */

module.exports = function createLogger (opts = {}) {
  if (lo.isString(opts)) opts = { name: opts }
  if (!opts.name || !lo.isString(opts.name)) opts.name = 'app'
  const instanceOptions = Object.assign({}, options, opts)
  const instance = bunyan.createLogger(instanceOptions)
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

    response.startTime = response.startTime || process.hrtime()

    request.log = logger.child({ req_id: request.reqId })

    if (blacklist.includes(request.get('user-agent'))) return next()

    /* Use the Debug Header */
    if (!lo.isEmpty(request.get(debugHeader))) {
      request.log.levels('main', bunyan.TRACE)
    }

    response.on('finish', onFinish)
    response.on('close', onClose)

    request.log.trace(`Request Start: ${request.method} ${request.originalUrl}`)

    next()

    function onFinish () {
      this.removeListener('close', onClose)
      this.removeListener('finish', onFinish)
      const status = this.statusCode || 200
      const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
      request.log[level]({
        req: request,
        res: this,
        duration: this.duration || utils.getDuration(this.startTime)
      })
    }

    function onClose () {
      this.removeListener('close', onClose)
      this.removeListener('finish', onFinish)
      this.statusCode = 102
      request.log.warn(
        {
          req: request,
          res: this,
          duration: this.duration || utils.getDuration(this.startTime)
        },
        'Request Closed by peer'
      )
    }
  }
}
