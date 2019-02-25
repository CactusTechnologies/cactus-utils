/*!
 * Copyright 2019 Cactus Technologies, LLC. All rights reserved.
 */

const { URL } = require('url')

/**
 * Serializes Error Objects
 *
 * @type {import("pino").SerializerFn}
 * @param  {any} err
 */

function errorSerializer (err) {
  if (!err || !err.stack) return err
  const obj = {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: getErrorStack(err)
  }
  return obj
}

exports.err = errorSerializer

/**
 * Serializes HTTPRequest Objects
 *
 * @type {import("pino").SerializerFn}
 * @param  {any} req HTTPRequest
 */

exports.req = function requestSerializer (req) {
  if (!req || !req.connection) return req

  return {
    id: req.reqId || undefined,
    userId: req.userId || 'nobody',
    method: req.method,
    url: getCleanUrl(req.originalUrl ? req.originalUrl : req.url),
    headers: req.headers,
    httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
    remoteAddress: req.ip ? req.ip : req.connection.remoteAddress,
    remotePort: req.connection.remotePort
  }
}

/**
 * Serializes HTTPResponse Objects
 *
 * @type {import("pino").SerializerFn}
 * @param  {any} res HTTPResponse
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
 * @param  {any} ex Error Object
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
  try {
    const parsed = new URL(url)
    return parsed.pathname || url
  } catch (err) {
    return url
  }
}
