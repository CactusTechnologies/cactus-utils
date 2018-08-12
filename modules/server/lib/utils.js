const { STATUS_CODES } = require('http')
const URL = require('url')
const fp = require('lodash/fp')

exports.humanizeStatusCode = input => fp.getOr('Unknown', input, STATUS_CODES)

exports.getDuration = function getDuration (start) {
  const diff = process.hrtime(start)
  const nanoseconds = diff[0] * 1e9 + diff[1]
  return nanoseconds / 1e6
}

exports.asHeader = fp.pipe([fp.camelCase, fp.capitalize])

/**
 * Returns a redacted version of the headers
 *
 * @param  {Object} headers - Headers Object
 * @param  {Array}  obscure - Headers to redact
 * @param  {Array}  exclude - Headers to exclude
 *
 * @return {Object}
 */

exports.redactHeaders = (headers = {}) => {
  const obscure = ['authorization', 'set-cookie'].map(fp.toLower)
  const exclude = [
    'x-amzn-trace-id',
    'x-content-type-options',
    'x-dns-prefetch-control',
    'x-download-options',
    'x-forwarded-port',
    'x-forwarded-proto',
    'x-frame-options',
    'x-xss-protection'
  ].map(fp.toLower)

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

exports.redactResponseHeaders = headers => {
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

exports.getCleanUrl = url => {
  const parsed = URL.parse(url)
  return parsed.pathname || url
}
