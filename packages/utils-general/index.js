/** @module utils */

'use strict'

// ─────────────────────────────  Dependencies  ────────────────────────────────

exports.promisify = require('util').promisify
exports.format = require('util').format

// ────────────────────────────────  Objects  ──────────────────────────────────

exports.extend = require('config').util.extendDeep
exports.diff = require('config').util.diffDeep
exports.clone = require('config').util.cloneDeep

// ──────────────────────────────  File system  ────────────────────────────────

exports.exists = require('fs').existsSync
exports.mkd = require('make-dir')
exports.rm = require('del')

exports.readFile = exports.promisify(require('fs').readFile)
exports.saveFile = exports.promisify(require('fs').writeFile)
exports.deleteFile = exports.promisify(require('fs').unlink)

exports.readJson = require('load-json-file')
exports.saveJson = require('write-json-file')

// ─────────────────────────────  child process  ───────────────────────────────

exports.exec = require('execa')

// ─────────────────────────────  PromiseChains  ───────────────────────────────

exports.tap = require('p-tap')

exports.forEach = exports.promisify(require('async').forEach)
exports.forEachSeries = exports.promisify(require('async').forEachSeries)
exports.forEachLimit = exports.promisify(require('async').eachLimit)

exports.map = exports.promisify(require('async').map)
exports.mapSeries = exports.promisify(require('async').mapSeries)
exports.mapLimit = exports.promisify(require('async').mapLimit)
exports.mapValues = exports.promisify(require('async').mapValues)

exports.pipe = function pipe () {
  return exports.promisify(Reflect.apply(require('async').seq, null, arguments))
}

// ───────────────────────  Expose some Async helpers  ─────────────────────────

exports.makeRetryable = (fn, opts = 3) =>
  exports.promisify(require('async').retryable(opts, fn))

exports.retry = exports.promisify(require('async').retry)
exports.forever = exports.promisify(require('async').forever)

// ────────────────────────────  Promised Timers  ──────────────────────────────

exports.wait = function waitForMs (ms = 1000) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

exports.nextTick = function nextTick () {
  return new Promise(resolve => process.nextTick(() => resolve()))
}

// ───────────────────────────  Common Functions  ──────────────────────────────

exports.getDuration = function getDuration (start) {
  const diff = process.hrtime(start)
  const nanoseconds = diff[0] * 1e9 + diff[1]
  return nanoseconds / 1e6
}

exports.humanizeStatusCode = function humanize (status) {
  const { STATUS_CODES } = require('http')
  const fp = require('lodash/fp')
  return fp.getOr('Unknown', status, STATUS_CODES)
}

// ────────────────────────────────  Crypto  ───────────────────────────────────

exports.encrypt = (decrypted, encryptionKey) => {
  if (!encryptionKey) throw new Error('encryptionKey is required')
  const cipher = require('crypto').createCipher('aes192', encryptionKey)
  return cipher.update(decrypted, 'utf8', 'hex') + cipher.final('hex')
}

exports.decrypt = (encrypted, decryptionKey) => {
  if (!decryptionKey) throw new Error('decryptionKey is required')
  const decipher = require('crypto').createDecipher('aes192', decryptionKey)
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

/**
 * Creates a hash for file revving.
 *
 * @param {(String|Object)} input - The object to be hashed
 *
 * @return {String} an MD5 hash truncated to 10 characters
 */

exports.hash = input => {
  const revHash = require('rev-hash')
  const fp = require('lodash/fp')
  if (fp.isString(input)) return revHash(fp.kebabCase(input))
  return revHash(require('json-stable-stringify')(input))
}

// ──────────────────────────────────  lol  ────────────────────────────────────

exports.say =
  require('os').platform() === 'darwin'
    ? async str => exports.exec(`say "${str}"`)
    : async str => true
