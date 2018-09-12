/**
 * A collection of simple serializers. Heavily insipered by the native Bunyan
 *   Serializers
 *  @module logger/serializers
 */

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
  const parsed = require('url').parse(url)
  return parsed.pathname || url
}
