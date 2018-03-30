/**
 * A collection of simple serializers. Heavily insipered by the native Bunyan
 *   Serializers
 *  @module logger/serializers
 */

const Config = require('config')
const fp = require('lodash/fp')
const moment = require('moment')
const prettyBytes = require('pretty-bytes')
const querystring = require('querystring')

const obscure = [...Config.get('logs.http.obscureHeaders')].map(fp.toLower)
const exclude = [...Config.get('logs.http.excludeHeaders')].map(fp.toLower)

/**
 * Serializes Error Objects
 *
 * @param  {Error} err
 *
 * @return {Object}
 */

exports.err = function errorSerializer (err) {
  if (!err || !err.stack) return err
  var obj = {
    message: err.message,
    name: err.name,
    stack: getFullErrorStack(err),
    code: err.code,
    signal: err.signal
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
    method: req.method,
    url: req.originalUrl ? req.originalUrl : req.url,
    headers: getHeaders(req.headers, obscure, exclude),
    userId: req.userId || 'nobody',
    httpVersion: `HTTP/${req.httpVersionMajor}.${req.httpVersionMinor}`,
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
    headers: getHeaders(res._headers, obscure, exclude)
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
      fp.getOr(0, 'elapsedTime'),
      elapsedTime => moment.duration(elapsedTime).asSeconds(),
      seconds => `${seconds} s`
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

function getFullErrorStack (ex) {
  let ret = ex.stack || ex.toString()
  if (ex.cause && typeof ex.cause === 'function') {
    const cex = ex.cause()
    if (cex) ret += '\nCaused by: ' + getFullErrorStack(cex)
  }
  return ret
}

/**
 * Returns a redacted version of the headers
 *
 * @param  {Object} headers - Headers Object
 * @param  {Array}  obscure - Headers to redact
 * @param  {Array}  exclude - Headers to exclude
 *
 * @return {Object}
 */

function getHeaders (headers = {}, obscure = [], exclude = []) {
  return Object.keys(headers).reduce((acc, current) => {
    const test = fp.toLower(current)
    if (exclude.includes(test)) return acc
    if (obscure.includes(test)) return fp.set(current, '[redacted]', acc)
    return fp.set(current, fp.get(current, headers), acc)
  }, {})
}
