'use strict'

const compression = require('compression')
const express = require('express')
const ipaddr = require('ipaddr.js')
const fp = require('lodash/fp')
const onHeaders = require('on-headers')
const path = require('path')
const fs = require('fs')
const favicon = require('serve-favicon')

const uuid = require('@cactus-technologies/uuid')
const logger = require('@cactus-technologies/logger')

const { getDuration, humanizeStatusCode } = require('./utils')

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
  const mesageHeader = `X-${request.app.get('domain')}-Message`
  const domain = request.app.get('domain')

  response.set({
    [`X-${domain}-Service-uuid`]: request.app.get('service'),
    [`X-${domain}-Service-Instance`]: `worker-${process.pid}`,
    Server: `${request.app.get('name')}/${request.app.get('version')}`
  })

  onHeaders(response, setMessage)

  next()

  function setMessage () {
    if (this.get(mesageHeader)) return
    this.set(mesageHeader, humanizeStatusCode(this.statusCode || 200))
  }
}

/**
 * Cors Middleware
 *
 * @type {Function}
 * @todo AllowHeaders should be read as an array.
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
 * Answer to the Prefligth OPTIONS request
 *
 * @type {Function}
 */
exports.preFligth = function preFligth (request, response, next) {
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
  const faviTarget = path.resolve(process.cwd(), 'assets', 'favicon.ico')
  if (fs.existsSync(faviTarget)) return favicon(faviTarget)
  return (req, res, next) => next()
})()

/**
 * Serves the public directory
 *
 * @type {Function}
 */
exports.serveFiles = ((publicDir = 'path') => {
  const publicTarget = path.resolve(process.cwd(), publicDir)
  if (fs.existsSync(publicTarget)) return express.static(publicTarget)
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

  request.ip = request.ip

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
 * @todo Port the middleware from the logger module
 */
exports.logRequests = logger.Middleware()

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
