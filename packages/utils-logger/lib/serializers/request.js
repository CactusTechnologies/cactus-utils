'use strict'

const Config = require('config')
const lo = require('lodash')

/**
 * Shamefully taken from https://github.com/tellnes/bunyan-middleware
 */

const { obscureHeaders, excludeHeaders } = Config.get('logs.http')

function requestSerializer (req) {
  if (!req || !req.connection) return req

  return {
    method: req.method,
    url: lo.get(req, 'originalUrl', req.url),
    headers: getHeaders(req),
    userId: getUser(req),
    httpVersion: getHttpVersion(req),
    remoteAddress: lo.get(req, 'ip', req.connection.remoteAddress),
    remotePort: req.connection.remotePort
  }
}

module.exports = requestSerializer

function getUser (req) {
  return req.userId || 'nobody'
}

function getHttpVersion (req) {
  return `HTTP/${req.httpVersionMajor}.${req.httpVersionMinor}`
}

function getHeaders (req) {
  if (req.headers && (obscureHeaders || excludeHeaders)) {
    return Object.keys(req.headers).reduce(function (memo, name) {
      if (excludeHeaders && excludeHeaders.includes(name)) {
        return memo
      }

      if (obscureHeaders && obscureHeaders.includes(name)) {
        memo[name] = '[Redacted]'
        return memo
      }

      memo[name] = req.headers[name]
      return memo
    }, {})
  }

  return req.headers
}
