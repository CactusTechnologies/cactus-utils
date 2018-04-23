'use strict'

/**
 * Express HTTP server
 *
 * @module lab100-server
 */
const Config = require('config')
const logger = require('@cactus-technologies/lab100-logger')
const Errors = require('@cactus-technologies/lab100-errors')
const http = require('http')
const express = require('express')
const pmx = require('pmx')

const Pre = require('./lib/pre')
const Security = require('./lib/security')

class Lab100Server {
  constructor (
    conf = {
      name: 'generic-server',
      version: '1.0.0',
      service: 'org.lab100'
    }
  ) {
    this.log = logger('server')
    this.server = http.createServer()
    this.app = express()

    this.app.set('json spaces', 4)
    this.app.set('json escape', true)
    this.app.set('trust proxy', true)
    this.app.set('x-powered-by', false)

    this.app.set('name', conf.name)
    this.app.set('version', conf.version)
    this.app.set('service', conf.service)

    this.app.use(Pre.requestStart)
    this.app.use(Pre.serverHeaders)
    this.app.use(Pre.setRequestIp)
    this.app.use(Pre.setRequestId)
    this.app.use(Pre.compressResponses)
    this.app.use(Security.dnsPrefetchControl)
    this.app.use(Security.frameguard)
    this.app.use(Security.ieNoOpen)
    this.app.use(Security.noSniff)
    this.app.use(Security.xssFilter)
    this.app.use(Security.referrerPolicy)
    this.app.use(Pre.crossOrigin)
    this.app.use(Pre.preFligth)
    this.app.use(Pre.serveFavicon)
    this.app.use(Pre.jsonParser)

    this.app.use(Pre.logRequests)

    this.server.on('request', this.app)
    this.server.on('error', onError)
  }

  /**
   * Binds the server to the given Port
   *
   * @param  {Number} port
   *
   * @return {Promisse}
   */

  listen (port = 8080) {
    return new Promise((resolve, reject) => {
      port = port || Config.get('server.port')
      this.server.listen(port, error => {
        if (error) reject(error)
        this.log.info(`Listening on port: ${port}`)
        resolve()
      })
    })
  }

  /**
   * Logs the error
   *
   * @param     {Error}             error
   * @param     {HttpRequest}       request
   * @param     {HttpResponse}      response
   * @param     {Function}          next
   */

  static logErrors (error, request, response, next) {
    request.log.trace('Handler: logErrors')

    if (error instanceof Errors.Lab100Error === false) {
      error = new Errors.InternalServerError(error, error.message)
    }

    if (error.status >= 500) {
      request.log.error(error)
    } else {
      if (request.app.get('env') === 'production') {
        request.log.error(error.message)
      } else {
        request.log.error(error)
      }
    }

    next(error)
  }

  /**
   * Sends the error to keymetrics and calls next
   *
   * @param     {Error}             error
   * @param     {HttpRequest}       request
   * @param     {HttpResponse}      response
   * @param     {Function}          next
   */
  static notifyErrors (error, request, response, next) {
    request.log.trace('Handler: notifyErrors')
    if (error.status >= 500) {
      error.url = request.originalUrl
      error.component = request.url
      error.action = request.method
      error.params = request.body
      error.session = request.session
      pmx.notify(error)
    }
    next(error)
  }

  /**
   * Answers the request with an empty response
   *
   * @param     {HttpRequest}       request
   * @param     {HttpResponse}      response
   */
  static emptyResponse (request, response) {
    request.log.trace('Handler: Empty response')
    response.sendStatus(200)
  }

  /**
   * Calls next with a NOT IMPLEMENTED Error
   *
   * @param     {HttpRequest}       request
   * @param     {HttpResponse}      response
   * @param     {Function}          next
   */
  static notImplementedResponse (request, response, next) {
    request.log.trace('Handler: notImplemented')
    next(new Errors.NotImplementedError(request.originalUrl))
  }

  /**
   * Calls next with a NOT FOUND Error
   *
   * @param     {HttpRequest}       request
   * @param     {HttpResponse}      response
   * @param     {Function}          next
   */

  static notFoundResponse (request, response, next) {
    request.log.trace('Handler: notFound')
    return next(new Errors.NotFoundError(request.originalUrl))
  }
}

module.exports = Lab100Server

// ────────────────────────────────  Private  ──────────────────────────────────

function onError (error) {
  throw new Errors.InternalServerError(error)
}
