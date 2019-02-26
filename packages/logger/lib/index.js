/*!
 * Copyright 2019 Cactus Technologies, LLC. All rights reserved.
 */

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y'

const path = require('path')
const config = require('config')
const fp = require('lodash/fp')
const pino = require('pino')
const yn = require('yn')
// ─────────────────────────────────  Init  ────────────────────────────────────

/* Load the default configuration */
const configDir = path.resolve(__dirname, '..', 'config')
const defaultConfig = config.util.loadFileConfigs(configDir)

config.util.setModuleDefaults('logs', coerceConfig(defaultConfig))

// ───────────────────────────────  Constants  ─────────────────────────────────

/* Once the default config is loaded we can safely create the constants */

const serializers = require('./serializers')

/** @type {String} */
const APP_NAME = config.has('name')
  ? config.get('name')
  : process.env.APP_NAME ||
    process.env.name ||
    process.env.PROCESS_TITLE ||
    process.env.npm_package_name ||
    'app'

/** @type {String} */
const HOSTNAME = (config.has('host')
  ? config.get('host')
  : process.env.HOST || process.env.HOSTNAME || require('os').hostname()
).split('.')[0]

const pretty = config.get('logs.pretty')
  ? {
    prettyPrint: { stamps: false },
    prettifier: require('@mechanicalhuman/bunyan-pretty')
  }
  : {}

const DEFAULTS = {
  safe: true, // avoid error caused by circular references in the object tree
  messageKey: 'msg', // Bunyan and Pretty look for this key as the msg key
  level: config.get('logs.level'),
  serializers: serializers,

  base: {
    pid: process.pid,
    hostname: HOSTNAME,
    app: APP_NAME
  },

  ...pretty
}

const BLACKLISTED_FIELDS = [
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

const WHITELISTED_FIELDS = ['level', 'serializers', 'base', 'redact']

// ────────────────────────────────  exports  ──────────────────────────────────

/**
 * Merge the given options with the default Options and returns a Logger
 *
 * @param  {string|pino.LoggerOptions} [opts] Logger's Name or Options
 * @param  {pino.DestinationStream=} stream Print Stream
 *
 */

module.exports = function createLogger (opts, stream = pino.destination(1)) {
  const options = coerceOptions(opts)
  const instance = pino(options, stream)
  return wrapPinoInstance(instance)
}

module.exports.Serializers = serializers
module.exports.destination = pino.destination
module.exports.final = pino.final

// ──────────────────────────────  Pino Proxy  ─────────────────────────────────

/** @return {pino.Logger} Pino base logging instance */
function wrapPinoInstance (instance) {
  return new Proxy(instance, { get: getHandler })
}

function wrapChildInstance (target, thisArgument, argumentsList) {
  const children = Reflect.apply(target, thisArgument, argumentsList)
  return wrapPinoInstance(children)
}

function getBindProp (obj, prop) {
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

function getHandler (obj, prop) {
  switch (prop) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
      return new Proxy(getBindProp(obj, prop), { apply: applyLogProp })
    case 'child':
      return new Proxy(getBindProp(obj, prop), { apply: wrapChildInstance })
    default:
      return Reflect.get(obj, prop)
  }
}

// ─────────────────────────────────  Utils  ───────────────────────────────────

function coerceOptions (opts) {
  return fp.pipe(
    () => (fp.isEmpty(opts) ? {} : opts),
    opts => (fp.isString(opts) ? { name: opts } : opts),
    opts => fp.set('name', fp.getOr(APP_NAME, 'name', opts), opts),
    opts => fp.set('base', extrasToBase(opts), opts),
    fp.pick(WHITELISTED_FIELDS),
    opts => Object.assign({}, DEFAULTS, opts)
  )()

  function extrasToBase (opts) {
    const current = fp.getOr({}, 'base', opts)
    const extras = fp.omit(BLACKLISTED_FIELDS, opts)
    return Object.assign({}, current, extras)
  }
}

function coerceConfig (config = {}) {
  const accepted = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
  if (fp.isString(config.level)) config.level = fp.toLower(config.level.trim())
  return {
    ...config,
    pretty: yn(config.pretty, { default: false }),
    level: accepted.includes(config.level) ? config.level : 'info'
  }
}
