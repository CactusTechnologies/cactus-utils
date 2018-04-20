const Config = require('config')
const fp = require('lodash/fp')
const sortKeys = require('sort-object-keys')
const URL = require('url')
const bunyan = require('bunyan')

exports.resolveLevel = bunyan.resolveLevel.bind(bunyan)

exports.getDuration = start => {
  const diff = process.hrtime(start)
  const nanoseconds = diff[0] * 1e9 + diff[1]
  return nanoseconds / 1e6
}

exports.getConfigFromEnv = () => {
  const env = process.env

  let config = {}

  if (testEnv('LAB100_LOGS_LEVEL')) {
    config = fp.set('level', config, fp.get('LAB100_LOGS_LEVEL', env))
  }

  if (testEnv('LAB100_LOGS_PRETTY')) {
    config = fp.set('pretty', config, envAsBool('LAB100_LOGS_PRETTY'))
  }

  if (testEnv('LAB100_LOGS_CLOUDWATCH')) {
    config = fp.set('cloudWatch', config, envAsBool('LAB100_LOGS_PRETTY'))
  }

  return config

  function testEnv (prop) {
    return fp.overEvery([
      fp.has(prop),
      fp.pipe([fp.get(prop), fp.negate(fp.isEmpty)])
    ])(process.env)
  }

  function envAsBool (prop) {
    const val = fp.get(prop, process.env)
    if (!val) return false
    try {
      return Boolean(JSON.parse(val))
    } catch (e) {
      return false
    }
  }
}

exports.getAppName = () => {
  return Config.has('name')
    ? Config.get('name')
    : process.env.APP_NAME ||
        process.env.name ||
        process.env.PROCESS_TITLE ||
        process.env.npm_package_name ||
        'app'
}

/**
 * Gets the Error Stack as a String.
 *
 * @param  {Error} ex Error Object
 *
 * @return {String}
 */

exports.getErrorStack = ex => {
  let ret = ex.stack || ex.toString()
  if (ex.cause && typeof ex.cause === 'function') {
    const cex = ex.cause()
    if (cex) ret += '\nCaused by: ' + exports.getErrorStack(cex)
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

exports.redactHeaders = (headers = {}) => {
  const obscure = [...Config.get('logs.http.obscureHeaders')].map(fp.toLower)
  const exclude = [...Config.get('logs.http.excludeHeaders')].map(fp.toLower)

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

/**
 * Gets the request body
 *
 * @param  {Object} req HTTPRequest
 *
 * @return {Object}
 */

exports.getBody = req => {
  if (!req.body) return undefined
  if (typeof req.body !== 'object') return undefined
  if (req.logBody === false) return undefined
  if (fp.isEmpty(req.logBody)) return undefined
  if (
    (req.headers['Content-Length'] || Config.get('logs.http.maxBody') + 1) >
    Config.get('logs.http.maxBody')
  ) {
    return undefined
  }
  return req.body
}
