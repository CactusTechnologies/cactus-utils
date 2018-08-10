/**
 * Creates a customized Pino Logger based on my opinionated vision
 * @module logger
 */

const path = require('path')
const config = require('config')
const fp = require('lodash/fp')
const pino = require('pino')

// TODO: SUPPRESS_NO_CONFIG_WARNING

// ─────────────────────────────────  Init  ────────────────────────────────────

/* Load the default configuration */
const configDir = path.resolve(__dirname, 'config')
const defaultConfig = config.util.loadFileConfigs(configDir)
config.util.setModuleDefaults('logs', defaultConfig)

// ───────────────────────────────  Constants  ─────────────────────────────────

/* Once the default config is loaded we can safely create the constants */

const SERIALIZERS = require('./lib/serializers')

const APP_NAME = config.has('name')
  ? config.get('name')
  : process.env.APP_NAME ||
    process.env.name ||
    process.env.PROCESS_TITLE ||
    process.env.npm_package_name ||
    'app'

/** @type {String} Hostname */
const HOSTNAME = (config.has('host')
  ? config.get('host')
  : process.env.HOST || process.env.HOSTNAME || require('os').hostname()
).split('.')[0]

// TODO: Investigate how to pass the stream via the config files.
/** @type {WriteStream} WriteStream or a Pretty wrapped one based on the conf.logs.stream value */
const STREAM = (function getStream () {
  switch (config.get('logs.stream')) {
    case 'err':
    case 'stderr':
    case 'error':
    case '2':
      return prettyOr(process.stderr)
    case 'out':
    case 'stdout':
    case '1':
      return prettyOr(process.stdout)
    default:
      console.log('Bad logs.stream config, defaulting to process.stdout')
      return prettyOr(process.stdout)
  }

  function prettyOr (stream) {
    return config.get('logs.pretty')
      ? require('@mechanicalhuman/bunyan-pretty')(stream, { timeStamps: false })
      : stream
  }
})()

/** @type {Object} Base logger options */
const DEFAULTS = {
  safe: true, // avoid error caused by circular references in the object tree
  messageKey: 'msg', // Bunyan and Pretty look for this key as the msg key
  prettyPrint: false, // Ensure pino's own pretty log doesnt get triggered
  level: config.get('logs.level'),
  serializers: SERIALIZERS,
  base: {
    pid: process.pid,
    hostname: HOSTNAME,
    app: APP_NAME
  }
}

const BLACKLISTED_FILEDS = [
  'safe',
  'serializers',
  'timestamp',
  'slowtime',
  'extreme',
  'level',
  'levelVal',
  'messageKey',
  'prettyPrint',
  'onTerminated',
  'enabled',
  'browser',
  'base',
  'crlf'
]

const WHITELISTED_FILEDS = ['level', 'serializers', 'base']

// ────────────────────────────────  exports  ──────────────────────────────────

/**
 * Merge the given options with the default Options and returns a Logger
 *
 * @param  {String|Object} opts Logger's Name
 * @param  {WritableStream} [stream=process.stdout] Print Stream
 *
 * @return {Object} Pino base logging instance
 */

module.exports = function createLogger (opts, stream = STREAM) {
  return fp.pipe(
    coerceOptions,
    createWrapedInstance(stream)
  )(opts)
}

/** @type {Object} Exports Serializers */
module.exports.Serializers = SERIALIZERS

// ──────────────────────────────  Pino Proxy  ─────────────────────────────────

function createWrapedInstance (stream) {
  return options => {
    const instance = pino(options, stream)
    return wrapPinoInstance(instance)
  }
}

function wrapPinoInstance (instance) {
  return new Proxy(instance, { get: getHandler })
}

function wrapChildInstance (target, thisArgument, argumentsList) {
  const children = Reflect.apply(...arguments)
  return wrapPinoInstance(children)
}

function getBindedProp (obj, prop) {
  return obj[prop].bind(obj)
}

function applyLogProp (target, thisArgument, argumentsList) {
  if (fp.isEmpty(argumentsList)) {
    argumentsList = [makeError()]
  }

  let [obj, msg, ...tokens] = argumentsList

  if (fp.isNull(obj)) obj = makeError('Null')
  if (fp.isNaN(obj)) obj = makeError('NaN')
  if (fp.isUndefined(obj)) obj = makeError('Undefined')

  if (fp.isNumber(obj)) obj = String(obj)

  if (fp.isString(obj) && fp.isEmpty(obj)) obj = makeError('Empty String')
  if (fp.isArray(obj) && fp.isEmpty(obj)) obj = makeError('Empty Array')
  if (fp.isPlainObject(obj) && fp.isEmpty(obj)) obj = makeError('Empty Object')

  if (fp.isError(obj)) {
    msg = fp.isNil(msg) ? obj.message : msg
    obj = { err: obj }
  }

  if (fp.isNil(msg)) {
    return Reflect.apply(target, thisArgument, [obj, ...tokens])
  }

  return Reflect.apply(target, thisArgument, [obj, msg, ...tokens])

  function makeError (reason = 'Nothing to log.') {
    const err = new RangeError(reason)
    Error.captureStackTrace(err, applyLogProp)
    return err
  }
}

function getHandler (obj, prop, receiver) {
  switch (prop) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
      return new Proxy(getBindedProp(obj, prop), { apply: applyLogProp })
    case 'child':
      return new Proxy(getBindedProp(obj, prop), { apply: wrapChildInstance })
    default:
      return Reflect.get(...arguments)
  }
}

// ─────────────────────────────────  Utils  ───────────────────────────────────

function coerceOptions (opts) {
  return fp.pipe(
    opts => (fp.isEmpty(opts) ? {} : opts),
    opts => (fp.isString(opts) ? { name: opts } : opts),
    opts => fp.set('name', fp.getOr(APP_NAME, 'name', opts), opts),
    opts => fp.set('base', extrasToBase(opts), opts),
    opts => fp.pick(WHITELISTED_FILEDS, opts),
    opts => extend(DEFAULTS, opts)
  )(opts)

  function extrasToBase (opts) {
    const current = fp.getOr({}, 'base', opts)
    const extras = fp.omit(BLACKLISTED_FILEDS, opts)
    return extend(current, extras)
  }
}

function extend () {
  return config.util.extendDeep({}, ...arguments)
}
