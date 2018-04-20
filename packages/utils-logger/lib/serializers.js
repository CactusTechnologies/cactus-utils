/**
 * A collection of simple serializers. Heavily insipered by the native Bunyan
 *   Serializers
 *  @module logger/serializers
 */

const fp = require('lodash/fp')
const prettyBytes = require('pretty-bytes')
const querystring = require('querystring')
const ms = require('pretty-ms')
const Utils = require('./utils')

/**
 * Serializes Error Objects
 *
 * @param  {Error} err
 *
 * @return {Object}
 */

exports.err = function errorSerializer (err) {
  if (!err || !err.stack) return err

  return {
    message: err.message,
    name: err.name,
    stack: Utils.getErrorStack(err),
    code: err.code,
    signal: err.signal
  }
}

/**
 * Serializes HTTPRequest Objects
 *
 * @param  {Object} req HTTPRequest
 *
 * @return {Object}
 */

exports.req = function requestSerializer (req) {
  if (!req || !req.connection) return req

  return {
    method: req.method,
    url: Utils.getCleanUrl(req.originalUrl ? req.originalUrl : req.url),
    headers: Utils.redactHeaders(req.headers),
    userId: req.userId || 'nobody',
    httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
    remoteAddress: req.ip ? req.ip : req.connection.remoteAddress,
    remotePort: req.connection.remotePort,
    body: Utils.getBody(req)
  }
}

/**
 * Serializes HTTPResponse Objects
 *
 * @param  {Object} res HTTPResponse
 *
 * @return {Object}
 */
exports.res = function responseSerializer (res) {
  if (!res || !res.statusCode) return res
  return {
    statusCode: res.statusCode,
    header: Utils.redactResponseHeaders(res._header)
  }
}

/**
 * Serializes Request.js Response transactions
 *
 * @param  {Object} resp
 *
 * @return {Object}
 */

exports.response = function responseSerializer (resp) {
  if (!resp || !resp.statusCode) return resp

  const host = fp.get('request.uri.host')(resp)
  const path = fp.get('request.uri.pathname')(resp)
  const method = fp.get('request.method')(resp)

  return {
    url: `${method} - ${host}${path}`,

    success: fp.allPass([
      fp.has('body'),
      fp.pipe([fp.get('statusCode'), fp.isEqual(200)])
    ])(resp),

    status: fp.get('statusCode')(resp),

    query: fp.pipe([
      fp.get('request.uri.query'),
      q => (q ? querystring.parse(q) : undefined)
    ])(resp),

    size: fp.pipe([
      fp.getOr(0, 'headers.content-length'),
      z => parseInt(z),
      n => prettyBytes(n)
    ])(resp),

    duration: fp.pipe([
      fp.getOr(0, 'timingPhases.total'),
      elapsedTime => ms(elapsedTime)
    ])(resp)
  }
}
