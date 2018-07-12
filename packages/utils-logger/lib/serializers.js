/**
 * A collection of simple serializers. Heavily insipered by the native Bunyan
 *   Serializers
 *  @module logger/serializers
 */

const fp = require('lodash/fp')
const prettyBytes = require('pretty-bytes')
const querystring = require('querystring')
const ms = require('pretty-ms')
const utils = require('./utils')

/**
 * Serializes Error Objects
 *
 * @param  {Error} err
 *
 * @return {Object}
 */

exports.err = function errorSerializer (err) {
  if (!err || !err.stack) return err
  const obj = {
    message: err.message,
    name: err.name,
    stack: utils.getErrorStack(err)
  }

  for (var key in err) {
    if (obj[key] === undefined) {
      obj[key] = err[key]
    }
  }

  return obj
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
    id: req.reqId || undefined,
    method: req.method,
    url: utils.getCleanUrl(req.originalUrl ? req.originalUrl : req.url),
    headers: req.headers,
    userId: req.userId || 'nobody',
    httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
    remoteAddress: req.ip ? req.ip : req.connection.remoteAddress,
    remotePort: req.connection.remotePort
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
    header: res._header
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
