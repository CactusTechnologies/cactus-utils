/**
 * @module @cactus-technologies/utils
 * @typicalname utils
 */

/**
 * Takes a function following the common error-first callback style, i.e.
 *   taking an (err, value) => ... callback as the last argument, and returns
 *   a version that returns promises.
 *
 * @param {Function} fn - Function to be converted.
 *
 * @return {Promise}
 *
 */

exports.promisify = fn => require('util').promisify(fn)

// ────────────────────────────────  Objects  ──────────────────────────────────

/**
 * Extend an object (and any object it contains) with one or more objects (and
 *   objects contained in them). This does not replace deep objects as other
 *   extend functions do, but dives into them extending individual elements
 *   instead.
 *
 * @param {Object}    mergeInto - The object to merge into. ({} recommended)
 * @param {...Object} mergeFrom - Any number of objects to merge from
 *
 * @return {Object} The altered mergeInto object is returned
 *
 * @category Object Utils
 */

exports.extend = (mergeInto, ...mergeFrom) =>
  require('config').util.extendDeep(mergeInto, ...mergeFrom)

/**
 * Returns an object containing all elements that differ between two objects.
 *
 * @param {Object} objA - The object to compare from
 * @param {Object} objB - The object to compare with
 *
 * @return {Object} A differential object, which if extended onto objA would
 *   result in objB.
 *
 * @category Object Utils
 */

exports.diff = (objA, objB) => require('config').util.diffDeep(objA, objB)

/**
 * This returns a new object with all elements copied from the specified
 *   object. Deep copies are made of objects and arrays so you can do anything
 *   with the returned object without affecting the input object.
 *
 * @param {Object} obj - The original object to copy from
 *
 * @return {Object} A new object with the elements copied from the copyFrom
 *   object
 *
 * @category Object Utils
 */

exports.clone = obj => require('config').util.cloneDeep(obj)

// ──────────────────────────────  File system  ────────────────────────────────

/**
 * Returns true if the path exists, false otherwise.
 *
 * @param {String} path - Location to be tested
 *
 * @return {Boolean}
 *
 * @category File system
 */

exports.exists = path => require('fs').existsSync(path)

/**
 * Make a directory and its parents if needed - Think mkdir -p. Returns a
 *   Promise for the path to the created directory.
 *
 * @param {String} path - Directory to create.
 *
 * @return {Promise}
 *
 * @author sindresorhus@gmail.com
 *
 * @category File system
 */

exports.mkd = path => require('make-dir')(path)

/**
 * Delete files and folders using globs, It also protects you against deleting
 *   the current working directory and above. - Think rm -rf.
 *
 * @param {(String|Array)} patterns      - Path, or globs to be deleted
 * @param {Boolean}        [force=false] - Allow deleting the current working
 *   directory and outside.
 *
 * @see {@link https://github.com/isaacs/minimatch#usage | minimatch} usage
 *   for patterns examples
 *
 * @return {Promise}
 *
 * @author sindresorhus@gmail.com
 *
 * @category File system
 */

exports.rm = (patterns, force = false) =>
  require('del')(patterns, { force: force })

exports.readFile = exports.promisify(require('fs').readFile)
exports.writeFile = exports.promisify(require('fs').writeFile)
exports.deleteFile = exports.promisify(require('fs').unlink)

exports.readJson = require('load-json-file')
exports.writeJson = require('write-json-file')

// ─────────────────────────────  child process  ───────────────────────────────

exports.exec = require('execa')

// ───────────────────────────── Promise Chains  ───────────────────────────────

/**
 * Tap into a promise chain without affecting its value or state
 *
 * @param {Function} input - Async function to be wrapped.
 *
 * @example
 *   Promise.resolve('unicorn')
 *     .then(utils.tap(console.log)) // Logs `unicorn`
 *     .then(value => { // `value` is still `unicorn` })
 *
 * @type {Promise} A Promised thunk that returns a Promise.
 *
 * @category Promise Chains
 */

exports.tap = require('p-tap')

exports.forEach = exports.promisify(require('async').forEach)
exports.forEachSeries = exports.promisify(require('async').forEachSeries)
exports.forEachLimit = exports.promisify(require('async').eachLimit)

exports.map = exports.promisify(require('async').map)
exports.mapSeries = exports.promisify(require('async').mapSeries)
exports.mapLimit = exports.promisify(require('async').mapLimit)
exports.mapValues = exports.promisify(require('async').mapValues)

/**
 * Creates a Promise that returns the result of invoking the given Async
 *   Functions, where each successive invocation is supplied the return value
 *   of the previous. ALA fp.pipe but for async functions.
 *
 * @param {...Function} fn - Any number of Async Functions where each consumes
 *   the return value of the previous one.
 *
 * @return {Promise}
 * @category Promise Chains
 */

exports.pipe = (...fn) =>
  exports.promisify(Reflect.apply(require('async').seq, null, ...fn))

// ───────────────────────  Expose some Async helpers  ─────────────────────────

/**
 * A close relative of retry. This method wraps a task and makes it retryable,
 *   rather than immediately calling it with retries.
 *
 * @param {Function} fn       - Async function to be wrapped.
 * @param {Number}   [opts=5] - The number of attempts to make before giving
 *   up
 *
 * @return {Promise}
 *
 * @category Async helpers
 */

exports.makeRetryable = (fn, opts = 5) =>
  exports.promisify(require('async').retryable(opts, fn))

/**
 * Attempts to get a successful response from task no more than times times
 *   before returning an error. If the task is successful, the Promise will
 *   return the result of the successful task. If all attempts fail, the
 *   Promise will Throw
 *
 * @param {Function} fn       - Async function or Callback Style taks
 * @param {Number}   [opts=5] - The number of attempts to make before giving
 *   up
 *
 * @return {Promise}
 *
 * @category Async helpers
 */

exports.retry = (fn, opts = 5) =>
  exports.promisify(require('async').retry)(opts, fn)

/**
 * Calls the asynchronous function in series, indefinitely. If the function
 *   throws the execution will stop.
 *
 * @param {Function} fn - an async function to call repeatedly
 *
 * @return {Promise}
 *
 * @category Async helpers
 */

exports.forever = fn => exports.promisify(require('async').forever)(fn)

// ────────────────────────────  Promised Timers  ──────────────────────────────

/**
 * Will resolve the promise after the given miliseconds.
 *
 * @param {Number} [ms=1000] - Miliseconds to wait
 *
 * @return {Promise}
 *
 * @category Promised Timers
 */

exports.wait = function waitForMs (ms = 1000) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

/**
 * Promisified version of process.nextTick
 *
 * @return {Promise}
 *
 * @category Promised Timers
 */

exports.nextTick = () =>
  new Promise(resolve => process.nextTick(() => resolve()))

// ───────────────────────────  Common Functions  ──────────────────────────────

/**
 * Gets the duration in milliseconds from the given start time.
 *
 * @param {Object} start - A result of process.hrtime()
 *
 * @return {Number}
 *
 * @category Humanizers
 */

exports.getDuration = function getDuration (start) {
  const diff = process.hrtime(start)
  const nanoseconds = diff[0] * 1e9 + diff[1]
  return nanoseconds / 1e6
}

/**
 * Humanizes the given status code
 *
 * @param {Number} status
 *
 * @return {String}
 *
 * @category Humanizers
 */

exports.humanizeStatusCode = status => {
  const { STATUS_CODES } = require('http')
  const fp = require('lodash/fp')
  return fp.getOr('Unknown', String(status), STATUS_CODES)
}

/**
 * Returns the path part of the given url
 *
 * @param {String} url
 *
 * @return {String}
 *
 * @category Humanizers
 */

exports.cleanUrl = url => {
  const parsed = URL.parse(url)
  return parsed.pathname || url
}

// ────────────────────────────────  Crypto  ───────────────────────────────────

/**
 * Encrypts the given String using the aes192 algorithm.
 *
 * @param  {String} decrypted
 * @param {String} encryptionKey
 *
 * @return {String}
 *
 * @category Crypto
 */

exports.encrypt = (decrypted, encryptionKey) => {
  if (!encryptionKey) throw new Error('encryptionKey is required')
  const cipher = require('crypto').createCipher('aes192', encryptionKey)
  return cipher.update(decrypted, 'utf8', 'hex') + cipher.final('hex')
}

/**
 * Decrypts the given String using the aes192 algorithm.
 *
 * @param {String} encrypted
 * @param {String} decryptionKey
 *
 * @return {String}
 *
 * @category Crypto
 */

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
 *
 * @category Crypto
 */

exports.hash = input => {
  const revHash = require('rev-hash')
  const fp = require('lodash/fp')
  if (fp.isString(input)) return revHash(fp.kebabCase(input))
  return revHash(require('json-stable-stringify')(input))
}

// ──────────────────────────────  Deprecated  ─────────────────────────────────

/**
 *
 *
 * @deprecated since version 1.0.3
 *
 * @function
 *
 * @see {@link https://nodejs.org/api/util.html#util_util_format_format_args | util.format} from the native Node Docs.
 *
 * @category File system
 */

exports.format = require('util').deprecate(
  require('util').format,
  'Format is deprecated and will be removed in the next minor version, please use "require(util).format"'
)

/**
 *
 *
 * @deprecated since version 1.0.3
 *
 * @function
 *
 * @see {@link utils.writeFile}
 *
 * @category File system
 */

exports.saveFile = require('util').deprecate(
  exports.writeFile,
  '"utils.saveFile" is deprecated and will be removed in the next minor version, please use "utils.writeFile" as it aligns with the internal node methods.'
)

/**
 *
 *
 * @deprecated since version 1.0.3
 *
 * @function
 *
 * @see {@link utils.writeJson}
 *
 * @category File system
 */

exports.saveJson = require('util').deprecate(
  exports.writeJson,
  '"utils.saveJson" is deprecated and will be removed in the next minor version, please use "utils.writeJson" as it aligns with the internal node methods.'
)

// ──────────────────────────────────  lol  ────────────────────────────────────

/**
 * Uses the sepakers to anounce the given string. MacOs only
 *
 * @param {String} str - What to say
 *
 * @return {Boolean}
 */

exports.say = async str =>
  require('os').platform() === 'darwin' ? exports.exec(`say "${str}"`) : true
