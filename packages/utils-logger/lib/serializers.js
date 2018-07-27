/**
 * A collection of simple serializers. Heavily insipered by the native Bunyan
 *   Serializers
 *  @module logger/serializers
 */

const fp = require('lodash/fp')
const prettyBytes = require('pretty-bytes')
const querystring = require('querystring')
const ms = require('pretty-ms')
const URL = require('url')
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
    code: err.code,
    stack: getErrorStack(err)
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
    url: getCleanUrl(req.originalUrl ? req.originalUrl : req.url),
    headers: req.headers,
    httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
    remoteAddress: req.ip ? req.ip : req.connection.remoteAddress,
    remotePort: req.connection.remotePort,
    userId: req.userId || 'nobody'
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

// ────────────────────────────────  Private  ──────────────────────────────────

/**
 * Gets the Error Stack as a String.
 *
 * @param  {Error} ex Error Object
 *
 * @return {String}
 */

function getErrorStack (ex) {
  let ret = ex.stack || ex.toString()
  if (ex.cause && typeof ex.cause === 'function') {
    const cex = ex.cause()
    if (cex) ret += '\nCaused by: ' + getErrorStack(cex)
  }
  return ret
}

/**
 * Returns the pathname part of the given url
 *
 * @param  {String} url
 *
 * @return {String}
 */

function getCleanUrl (url) {
  const parsed = URL.parse(url)
  return parsed.pathname || url
}
