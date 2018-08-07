const config = require('config')
const fp = require('lodash/fp')
const URL = require('url')

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
    url: getCleanUrl(req.originalUrl ? req.originalUrl : req.url),
    headers: redactHeaders(req.headers),
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
    header: redactResponseHeaders(res._header)
  }
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

function redactHeaders (headers = {}) {
  const obscure = [...config.get('logs.http.obscureHeaders')].map(fp.toLower)
  const exclude = [...config.get('logs.http.excludeHeaders')].map(fp.toLower)

  headers = sortKeys(headers)

  return Object.keys(headers).reduce((acc, current) => {
    const test = fp.toLower(current)
    if (exclude.includes(test)) return acc
    if (obscure.includes(test)) return fp.set(current, '[redacted]', acc)
    return fp.set(current, fp.get(current, headers), acc)
  }, {})
}

/**
 * Returns a redacted version of the response headers
 *
 * @param  {Object} headers - Headers Object
 * @param  {Array}  obscure - Headers to redact
 * @param  {Array}  exclude - Headers to exclude
 *
 * @return {Object}
 */

function redactResponseHeaders (headers) {
  if (!headers) return ''

  const rows = asRows(headers)
  const head = extractHead(rows)

  return fp.pipe([
    headers => fp.reduce(accumulator, {})(headers),
    parsed => exports.redactHeaders(parsed),
    redacted => fp.toPairs(redacted),
    pairs => fp.map(fp.join(': '))(pairs),
    rows => restoreHead(rows),
    rows => fp.join('\n')(rows)
  ])(rows)

  function accumulator (acc, current) {
    const index = current.indexOf(':')
    const key = fp.trim(current.slice(0, index))
    const value = fp.trim(current.slice(index + 1))
    const cvalue = fp.get(key)(acc)
    if (fp.has(key)(acc) === false) return fp.set(key, value, acc)
    if (fp.isArray(cvalue)) return fp.set(key, [...cvalue, value], acc)
    return fp.set(key, [cvalue, value], acc)
  }

  function restoreHead (rows) {
    if (head) rows.unshift(head)
    return rows
  }

  function extractHead (rows) {
    const regex = new RegExp('^HTTP')
    if (regex.test(rows[0])) return rows.shift()
    return false
  }

  function asRows (headers) {
    return fp.trim(headers).split('\n')
  }
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
