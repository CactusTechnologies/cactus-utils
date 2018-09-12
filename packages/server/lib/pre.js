'use strict'

const compression = require('compression')
const express = require('express')
const fs = require('fs')
const ipaddr = require('ipaddr.js')
const fp = require('lodash/fp')
const onHeaders = require('on-headers')
const path = require('path')
const favicon = require('serve-favicon')
const uuid = require('@cactus-technologies/uuid')
const logger = require('@cactus-technologies/logger')
const config = require('config')
const serializers = require('./serializers')
const { getDuration, humanizeStatusCode } = require('./utils')

const reqLogger = logger({ name: 'http', serializers: serializers })

/**
 * Sets response.startTime and duration
 *
 * @type {Function}
 *
 */
exports.requestStart = function requestStart (request, response, next) {
  response.startTime = process.hrtime()

  onHeaders(response, setDuration)

  function setDuration () {
    this.duration = getDuration(this.startTime)
    this.header('X-Response-Time', this.duration)
  }

  next()
}

/**
 * Server ID middleware
 *
 * @type {Function}
 *
 */

exports.serverHeaders = function serverHeaders (request, response, next) {
  const messageHeader = `X-${request.app.get('domain')}-Message`
  const domain = request.app.get('domain')

  response.set({
    [`X-${domain}-Service-uuid`]: request.app.get('service'),
    [`X-${domain}-Service-Instance`]: `worker-${process.pid}`,
    Server: `${request.app.get('name')}/${request.app.get('version')}`
  })

  onHeaders(response, setMessage)

  next()

  function setMessage () {
    if (this.get(messageHeader)) return
    this.set(messageHeader, humanizeStatusCode(this.statusCode || 200))
  }
}

/**
 * Cors Middleware
 *
 * @type {Function}
 * @todo AllowHeaders should read as an array.
 *
 */

exports.crossOrigin = function crossOrigin (request, response, next) {
  const domain = request.app.get('domain')

  response.set({
    'Access-Control-Allow-Headers': request.app.get('allowHeaders'),

    'Access-Control-Expose-Headers': [
      'X-Request-ID',
      'X-Response-Time',
      `X-${domain}-Service-uuid`,
      `X-${domain}-Service-Instance`,
      `X-${domain}-Message`,
      `X-${domain}-Auth-ExpiresIn`,
      `X-${domain}-Auth-Method`
    ].join(', '),

    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': request.get('Origin') || '*'
  })

  response.vary('Origin')

  next()
}

/**
 * Answer to the preFlight OPTIONS request
 *
 * @type {Function}
 */
exports.preFlight = function preFlight (request, response, next) {
  if (request.method === 'OPTIONS') return response.sendStatus(200)
  next()
}

/**
 * Compress the responses
 *
 * @type {Function}
 */
exports.compressResponses = compression()

/**
 * Serves the favicon.ico from memory
 *
 * @type {Function}
 */
exports.serveFavicon = (() => {
  const target = path.resolve(process.cwd(), 'assets', 'favicon.ico')
  if (fs.existsSync(target)) return favicon(target)
  return (req, res, next) => next()
})()

/**
 * Serves the public directory
 *
 * @type {Function}
 */
exports.serveFiles = (() => {
  if (config.has('paths.public')) {
    const publicPath = config.get('paths.public')
    if (fs.existsSync(publicPath)) return express.static(publicPath)
  }
  const syntethic = path.resolve(process.cwd(), 'public')
  if (fs.existsSync(syntethic)) return express.static(syntethic)
  return (req, res, next) => next()
})()

/**
 * Parses the given IP as a IPV4
 *
 * @type {Function}
 */
exports.setRequestIp = function reqIP (request, response, next) {
  let ip = request.ip

  Object.defineProperty(request, 'ip', {
    get: () => ip,
    set: val => (ip = ipaddr.process(val).toString())
  })

  request.ip = ip

  next()
}

/**
 * Sets the reqId property on the request
 *
 * @type {Function}
 */
exports.setRequestId = function setRequestId (request, response, next) {
  request.reqId = request.get('X-Request-ID') || uuid.pokemon()
  response.set('X-Request-ID', request.reqId)
  next()
}

/**
 * Adds an specialized logger to each request and logs to the console when the
 * given request is complete
 * @param     {HttpRequest}       request
 * @param     {HttpResponse}      response
 * @param     {Function}          next
 */

exports.logRequests = function logRequests (request, response, next) {
  const blacklist = ['ELB-HealthChecker']
  const debugHeader = 'X-Cactus-Debug'
  const uaTest = fp.overSome(
    blacklist.map(i => {
      const uaRegex = new RegExp(i, 'gmi')
      return uaRegex.test.bind(uaRegex)
    })
  )

  response.startTime = response.startTime || process.hrtime()
  request.log = reqLogger.child({ req_id: request.reqId })

  if (uaTest(request.get('user-agent'))) return next()

  /* Use the Debug Header */
  if (!fp.isEmpty(request.get(debugHeader))) {
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
      duration: this.duration || getDuration(this.startTime)
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
        duration: this.duration || getDuration(this.startTime)
      },
      error.message
    )
  }
}

/**
 * parses incoming requests with JSON payloads
 *
 * @type {Function}
 */
exports.jsonParser = express.json({
  inflate: true,
  limit: '5MB',
  strict: true,
  type: 'application/json'
})

/**
 * Sets Default Auth parameters in to the request
 *
 * @param     {HttpRequest}       request
 * @param     {HttpResponse}      response
 * @param     {Function}          next
 */

exports.setAuthDefaults = function setAuthDefaults (request, response, next) {
  request.userId = null
  request.isAdmin = false
  request.isAuth = false

  let authMethod

  Object.defineProperty(request, 'authMethod', {
    get: () => authMethod,
    set: val => (authMethod = val)
  })

  Object.defineProperty(request, 'expiresIn', {
    get: () =>
      request.authMethod === 'Application'
        ? Number.MAX_VALUE
        : request.isAuth === true
          ? fp.getOr(0, 'session.cookie.maxAge', request)
          : 0
  })

  request.authMethod = 'None'

  onHeaders(response, setAuthHeaders)

  next()

  function setAuthHeaders () {
    this.header(
      `X-${request.app.get('domain')}-Auth-ExpiresIn`,
      request.expiresIn || 0
    )
    this.header(
      `X-${request.app.get('domain')}-Auth-Method`,
      request.authMethod || 'None'
    )
  }
}
