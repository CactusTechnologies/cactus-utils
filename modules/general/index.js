/**
 * @module @cactus-technologies/utils
 * @example
 * const utils = require('@cactus-technologies/utils')
 * @typicalname utils
 */

const fp = require('lodash/fp')

// TODO: Propper attributions

/**
 * Takes a function following the common error-first callback style, i.e.
 *   taking an `(err, value) => ... callback` as the last argument, and
 *   returns a version that returns promises.
 *
 * @param {Function} fn - Function to be converted.
 *
 * @return {Promise}
 *
 * @function
 */

exports.promisify = require('util').promisify

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
 * @return {Object} A differential object, which if extended onto objA would result in objB.
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
 * @return {Object} A new object with the elements copied from the copyFrom object
 *
 * @category Object Utils
 */

exports.clone = obj => require('config').util.cloneDeep(obj)

/**
 * Returns a copy of an object with all keys sorted.
 *
 * @param {Object}            obj       - The Object to sort.
 * @param {(Array|Function)} [sortWith] - An `Array` containing ordered keys or a `Function` (same signature as in `Array.prototype.sort()`).
 *
 * @return {Object}
 *
 * @category Object Utils
 * @function
 * @author keithamus
 * @requires sort-object-keys
 */

exports.sortKeys = require('sort-object-keys')

// ──────────────────────────────  File system  ────────────────────────────────

// TODO: Detect and use the native promisified versions

/**
 * Make a directory and its parents if needed - Think` mkdir -p`.
 *
 *
 * @param {String} path - Directory to create.
 *
 * @return {Promise} Promise for the path to the created directory.
 *
 * @author sindresorhus@gmail.com
 * @category File system
 * @function
 */

exports.mkd = require('make-dir')

/**
 * Delete files and folders using globs, It also protects you against deleting
 *   the current working directory and above. - Think `rm -rf`.
 *
 * @param {(String|Array)} patterns              - Path, or globs to be deleted
 * @param {Object}         [options]             - Options
 * @param {Object}         [options.force=false] - Allow deleting outside the cwd
 *
 * @return {Promise}
 *
 * @see {@link https://github.com/isaacs/minimatch#usage minimatch} usage for patterns examples
 * @category File system
 */

exports.rm = require('del')

/**
 * Asynchronously reads data to from a file
 *
 * Just a promisified version of fs.readFile
 *
 * @param {String}          filePath  - Where to save the data
 * @param {Object}          [options]
 *
 * @return {Promise}
 *
 * @category File system
 * @async
 * @function
 */

exports.readFile = exports.promisify(require('fs').readFile)

/**
 * Athomically writes data to a file, replacing the file if it already
 *   exists. Creates directories for you as needed.
 *
 *   Sync Version is also available under: `utils.writeFile.sync`
 *
 * @param {String}          filePath - Where to save the data
 * @param {(String|Buffer)} data     - Data to be saved
 * @param {Object}          [opts]
 *
 * @return {Promise}
 *
 * @example
 *   // Promise mode.
 *   utils.writeFile('path/to/foo.jpg', imageData)
 *     .then(() => console.log('done'))
 *
 * @example
 *   // async/await mode.
 *   (async () => {
 *   utils.writeFile('path/to/foo.jpg', imageData)
 *     console.log('done')
 *   })
 *
 * @example
 *   // Sync mode. (THIS BLOCKS THE EVENT LOOP)
 *   utils.writeFile.sync('path/to/foo.jpg', imageData)
 *   console.log('done')
 *
 * @category File system
 * @async
 * @function
 */

exports.writeFile = async function writeFile (filePath, data, opts = {}) {
  if (!filePath) throw new TypeError('"filePath" is required.')
  if (!data) throw new TypeError('"data" is required.')
  await exports.mkd(require('path').dirname(filePath))
  await exports.promisify(require('write-file-atomic'))(filePath, data, opts)
}

exports.writeFile.sync = function writeFileSync (filePath, data, opts = {}) {
  if (!filePath) throw new TypeError('"filePath" is required.')
  if (!data) throw new TypeError('"data" is required.')
  exports.mkd.sync(require('path').dirname(filePath))
  require('write-file-atomic').sync(filePath, data, opts)
}

/**
 * Asynchronous unlink(2). The Promise is resolved with no arguments upon success.
 *
 * Just a promisified version of fs.unlink
 *
 * @param {String} filePath - the file to delete
 *
 * @return {Promise}
 *
 * @category File system
 * @async
 * @function
 */

exports.deleteFile = exports.promisify(require('fs').unlink)

/**
 * Read and parse a JSON file. Strips UTF-8 BOM, uses graceful-fs, and throws
 *   more helpful JSON errors.
 *
 *   Sync Version is also available under: `utils.readJson.sync`
 *
 * @param {String} filePath
 *
 * @return {Promise} Returns a promise for the parsed JSON.
 *
 * @category File system
 * @async
 * @function
 */

exports.readJson = require('load-json-file')

/**
 * Stringify and write JSON to a file atomically, Creates directories for you
 *   as needed.
 *
 *   Sync Version is also available under: `utils.writeJson.sync`
 *
 * @param {String}          filepath                     - Where to save the data
 * @param {Object}          data                         - Data to be saved
 * @param {Object}          [options]
 * @param {(String|Number)} [options.indent='\t']        - Indentation as a `string` or `number` of spaces. Pass in `null` for no formatting.
 * @param {Boolean}         [options.detectIndent=false] - Detect indentation automatically if the file exists.
 * @param {Boolean}         [options.sortKeys=false]     - Sort the keys recursively.
 * @param {Function}        [options.replace]            - Passed into `JSON.stringify`.
 *
 * @return {Promise}
 *
 * @example
 *   // Promise mode.
 *   utils.writeJson('foo.json', {foo: true})
 *     .then(() => console.log('done'))
 *
 * @example
 *   // async/await mode.
 *   (async () => {
 *     await utils.writeJson('foo.json', {foo: true})
 *     console.log('done')
 *   })
 *
 * @example
 *   // Sync mode. (THIS BLOCKS THE EVENT LOOP)
 *   utils.writeJson.sync('foo.json', {foo: true})
 *   console.log('done')
 *
 * @category File system
 * @async
 * @function
 */

exports.writeJson = require('write-json-file')

// ─────────────────────────────  child process  ───────────────────────────────

/**
 * A better child_process:
 *   - Promise interface.
 *   - Strips EOF from the output so you don't have to `stdout.trim()`.
 *   - Supports shebang binaries cross-platform.
 *   - Higher max buffer. 10 MB instead of 200 KB.
 *   - Executes locally installed binaries by name. (from `node_modules`)
 *   - Cleans up spawned processes when the parent process dies.
 *
 * @param {String}            command
 * @param {(Array|String)}    [args=[]]                           - Either an Array of arguments or a String with the arguments.
 * @param {Object}            [options]
 * @param {String}            [options.cwd=process.cwd()]      - Current working directory of the child process.
 * @param {Object}            [options.env=process.env]        - Environment key-value pairs. Extends automatically from `process.env`
 * @param {Boolean}           [options.extendEnv=true]         - Set to false if you don't want to extend the environment variables when providing the env property.
 * @param {String}            [options.argv0]                  - Explicitly set the value of `argv[0]`
 * @param {(String|String[])} [options.stdio=pipe]             - Child's stdio configuration.
 * @param {Boolean}           [options.detached=false]         - Prepare child to run independently of its parent process.
 * @param {Boolean}           [options.shell=false]            - If `true`, runs command inside of a shell. Uses `/bin/sh` on `UNIX` and `cmd.exe` on `Windows`.
 * @param {Boolean}           [options.preferLocal=true]       - Prefer locally installed binaries when looking for a binary to execute. If you `npm install foo`, you can then `utils.exec('foo')`.
 * @param {String}            [options.localDir=process.cwd()] - Preferred path to find locally installed binaries in (use with `preferLocal`).
 * @param {String}            [options.input]                  - Write some input to the `stdin` of your binary.
 * @param {Boolean}           [options.reject=true]            - Setting this to `false` resolves the promise with the error instead of rejecting it.
 * @param {Boolean}           [options.cleanup=true]           - Keep track of the spawned process and `kill` it when the parent process exits.
 * @param {Boolean}           [options.timeout=0]              - If timeout is greater than `0`, the parent will send the signal identified by the `killSignal` property (the default is `SIGTERM`) if the child runs longer than timeout milliseconds.
 * @param {String}            [options.killSignal=SIGTERM]     - Signal value to be used when the spawned process will be killed.
 *
 * @return {Promise} Returns a child_process instance, which is enhanced to
 *   also be a Promise for a result Object with stdout and stderr properties.
 *
 * @example
 *   (async () => {
 *     const result = await utils.exec('omxplayer', '~/color-factory/assets/videoFile')
 *   })();
 *
 * @example
 *   (async () => {
 *   const outputPath = '~/color-factory/assets/videoFile'
 *   try {
 *     await utils.exec('ffmpeg', ['-i', inputPath, '-vf', `crop=${crop}:${crop}:${startX}:${startY}`, outputPath])
 *     return outputPath
 *   } catch (err) {
 *     log.error(err)
 *     throw err
 *   }
 *   })();
 *
 * @category Child Process
 * @async
 * @function
 * @see {@link https://github.com/sindresorhus/execa#readme execa} for details
 */

exports.exec = (command, args = [], options = {}) => {
  if (fp.isString(args)) {
    args = fp.pipe(
      fp.split(/(['"``])((?:\\\1|.)+?)\1|([^\s"'``]+)/),
      fp.map(fp.trim),
      fp.compact,
      fp.reject(t => fp.includes(t, ["'", '"', '`']))
    )(args)
  }
  return require('execa')(command, args, options)
}

// ───────────────────────────── Promise Chains  ───────────────────────────────

/**
 * Tap into a promise chain without affecting its value or state
 *
 * @param {Function} input - Async function to be wrapped.
 *
 * @return {Promise} An observer `corutine`.
 *
 * @example
 *   Promise.resolve('unicorn')
 *     .then(utils.tap(console.log)) // Logs `unicorn`
 *     .then(value => { // `value` is still `unicorn` })
 *
 * @category Promise Chains
 */

exports.tap = require('p-tap')

/**
 * Array.forEach in parallel
 *
 * @param {Array|Object} coll     - A collection to iterate over.
 * @param {Function}     iteratee - An async function to apply to each item in coll
 *
 * @return {Promise}
 *
 * @function
 * @category Promise Chains
 */

exports.forEach = exports.promisify(require('async').forEach)

/**
 * Array.forEach in series
 *
 * @param {Array|Object} coll     - A collection to iterate over.
 * @param {Function}     iteratee - An async function to apply to each item in coll
 *
 * @return {Promise}
 *
 * @function
 * @category Promise Chains
 */

exports.forEachSeries = exports.promisify(require('async').forEachSeries)

/**
 * Array.forEach in parallel with a concurrency limit
 *
 * @param {Array|Object} coll     - A collection to iterate over.
 * @param {Number}       limit    - The maximum number of async operations at a time.
 * @param {Function}     iteratee - An async function to apply to each item in coll
 *
 * @return {Promise}
 *
 * @function
 * @category Promise Chains
 */

exports.forEachLimit = exports.promisify(require('async').eachLimit)

/**
 * Array.map in parallel
 *
 * @param {Array|Object} coll     - A collection to iterate over.
 * @param {Function}     iteratee - An async function to apply to each item in coll
 *
 * @return {Promise}
 *
 * @function
 * @category Promise Chains
 */

exports.map = exports.promisify(require('async').map)

/**
 * Array.map in series
 *
 * @param {Array|Object} coll     - A collection to iterate over.
 * @param {Function}     iteratee - An async function to apply to each item in coll
 *
 * @return {Promise}
 *
 * @function
 * @category Promise Chains
 */

exports.mapSeries = exports.promisify(require('async').mapSeries)

/**
 * Array.map in parallel with a concurrency limit
 *
 * @param {Array|Object} coll     - A collection to iterate over.
 * @param {Number}       limit    - The maximum number of async operations at a time.
 * @param {Function}     iteratee - An async function to apply to each item in coll
 *
 * @return {Promise}
 *
 * @function
 *
 * @category Promise Chains
 */

exports.mapLimit = exports.promisify(require('async').mapLimit)

/**
 * Relative of `utils.map`, designed for use with `objects`. Produces a new
 *   Object by mapping each `value` of `obj` through the `iteratee function`.
 *
 * @param {Object}   obj      - A collection to iterate over.
 * @param {Function} iteratee - An Async function to apply to each `value` in `obj`. The iteratee should return the transformed value as its result. Invoked with `(value, key, callback)`.
 *
 * @return {Promise}
 *
 * @function
 * @category Promise Chains
 */

exports.mapValues = exports.promisify(require('async').mapValues)

/**
 * Creates a Promise that returns the result of invoking the given Async
 *   Functions, where each successive invocation is supplied the return value
 *   of the previous. ALA fp.pipe but for async functions.
 *
 * @param {...Function} fn - Any number of Async Functions where each consumes the return value of the previous one.
 *
 * @return {Promise}
 *
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
 * @param {Number}   [opts=5] - The number of attempts to make before giving up
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
 * @param {Number}   [opts=5] - The number of attempts to make before giving up
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
 * @function
 */

exports.forever = exports.promisify(require('async').forever)

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
  const parsed = require('url').parse(url)
  return parsed.pathname || url
}

// ────────────────────────────────  Crypto  ───────────────────────────────────

/**
 * Encrypts the given String using the aes192 algorithm.
 *
 * @param {String} decrypted
 * @param {String} encryptionKey
 *
 * @return {String}
 *
 * @category Crypto
 */

exports.encrypt = (decrypted, encryptionKey) => {
  if (!encryptionKey) throw new Error('encryptionKey is required')
  // TODO: Use cripto.createCipheriv
  // eslint-disable-next-line node/no-deprecated-api
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
  // TODO: Use cripto.createDecipheriv
  // eslint-disable-next-line node/no-deprecated-api
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
  if (fp.isString(input)) return revHash(fp.kebabCase(input))
  return revHash(require('json-stable-stringify')(input))
}

// ──────────────────────────────  Validation  ─────────────────────────────────

exports.assert = require('./lib/assert')

// ───────────────────────────────  Normalize  ─────────────────────────────────

exports.normalize = require('./lib/normalize')

// ──────────────────────────────  Deprecated  ─────────────────────────────────

/**
 * @deprecated since version 1.0.4
 * @function
 * @see {@link utils.validate.exists}
 */

exports.exists = require('util').deprecate(
  require('fs').existsSync,
  'Moved to utils.validate.exists'
)

/**
 * @deprecated since version 1.0.3
 * @function
 * @see {@link https://nodejs.org/api/util.html#util_util_format_format_args util.format} from the native Node Docs.
 */

exports.format = require('util').deprecate(
  require('util').format,
  'Format is deprecated and will be removed in the next minor version, please use "require(util).format"'
)

/**
 * @deprecated since version 1.0.3
 * @function
 * @see {@link utils.writeFile}
 * @category File system
 */

exports.saveFile = require('util').deprecate(
  exports.writeFile,
  '"utils.saveFile" is deprecated and will be removed in the next minor version, please use "utils.writeFile" as it aligns with the internal node methods.'
)

/**
 * @deprecated since version 1.0.3
 * @function
 * @see {@link utils.writeJson}
 * @category File system
 */

exports.saveJson = require('util').deprecate(
  exports.writeJson,
  '"utils.saveJson" is deprecated and will be removed in the next minor version, please use "utils.writeJson" as it aligns with the internal node methods.'
)
