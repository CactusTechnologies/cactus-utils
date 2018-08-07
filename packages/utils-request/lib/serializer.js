const fp = require('lodash/fp')
const prettyBytes = require('pretty-bytes')
const querystring = require('querystring')
const ms = require('pretty-ms')

/**
 * Serializes Request.js Response transactions
 *
 * @param  {Object} resp
 *
 * @return {Object}
 */

module.exports = function responseSerializer (resp) {
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
