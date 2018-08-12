const utils = require('./utils')

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
    url: utils.getCleanUrl(req.originalUrl ? req.originalUrl : req.url),
    headers: utils.redactHeaders(req.headers),
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
    header: utils.redactResponseHeaders(res._header)
  }
}
