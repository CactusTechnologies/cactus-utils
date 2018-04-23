'use strict'

const compression = require('compression')
const express = require('express')
const favicon = require('serve-favicon')
const fp = require('lodash/fp')
const ipaddr = require('ipaddr.js')
const onHeaders = require('on-headers')
const path = require('path')

const UUID = require('@cactus-technologies/lab100-uuid')
const logger = require('@cactus-technologies/lab100-logger')

const { getDuration, humanizeStatusCode } = require('./utils')

/**
 * Sets response.startTime and duration
 *
 * @type {Middleware Function}
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
 * @type {Middleware Function}
 *
 */

exports.serverHeaders = function serverHeaders (request, response, next) {
  response.set({
    'X-Lab100-Service-UUID': request.app.get('service'),
    'X-Lab100-Service-Instance': `lab100-worker-${process.pid}`,
    Server: `${request.app.get('name')}/${request.app.get('version')}`
  })

  onHeaders(response, setMessage)

  next()

  function setMessage () {
    if (this.get('X-Lab100-Message')) return
    this.set('X-Lab100-Message', humanizeStatusCode(this.statusCode || 200))
  }
}

/**
 * Cors Middleware
 *
 * @type {Middleware Function}
 *
 */

exports.crossOrigin = function crossOrigin (request, response, next) {
  // prettier-ignore
  response.set({
    'Access-Control-Allow-Headers': 'Content-Type, X-Lab100-APP-UUID, X-Lab100-APP-Secret, X-Lab100-Debug',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': request.get('origin') || '*'
  })

  response.vary('Origin')

  next()
}

/**
 * Answer to the Prefligth OPTIONS request
 *
 * @type {Middleware Function}
 */
exports.preFligth = function preFligth (request, response, next) {
  if (request.method === 'OPTIONS') return response.sendStatus(200)
  next()
}

/**
 * Compress the responses
 *
 * @type {Middleware Function}
 */
exports.compressResponses = compression()

/**
 * Serves the favicon.ico from memory
 *
 * @type {Middleware Function}
 */
exports.serveFavicon = favicon(path.resolve(__dirname, 'assets', 'favicon.ico'))

/**
 * Parses the given IP as a IPV4
 *
 * @type {Middleware Function}
 */
exports.setRequestIp = function reqIP (request, response, next) {
  let ip = request.ip

  Object.defineProperty(request, 'ip', {
    get: () => ip,
    set: val => (ip = ipaddr.process(val).toString())
  })

  request.ip = request.ip

  next()
}

/**
 * Sets the reqId property on the request
 *
 * @type {Middleware Function}
 */
exports.setRequestId = function setRequestId (request, response, next) {
  request.reqId = request.get('X-Request-ID') || UUID.pokemon()
  response.set('X-Request-ID', request.reqId)
  next()
}

/**
 * Adds an specialized logger to each request and logs to the console when the
 *   given request is complete
 *
 * @type {Middleware Function}
 */
exports.logRequests = logger.Middleware()

/**
 * parses incoming requests with JSON payloads
 *
 * @type {Middleware Function}
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
    this.header('X-Lab100-Auth-ExpiresIn', request.expiresIn || 0)
    this.header('X-Lab100-Auth-Method', request.authMethod || 'None')
  }
}
