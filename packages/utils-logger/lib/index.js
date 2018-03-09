'use strict'

/**
 * Creates a customized Bunyan Logger based on my opinionated vision
 * @module logger
 */

/* Dependencies */
const Config = require('config').get('logs')
const lo = require('lodash')
const bunyan = require('bunyan')
const serializers = require('./serializers')

/**
 * A singleton holding all loggers
 * @type {Map}
 */
const Loggers = new Map()

// ───────────────────────────────  Configure  ─────────────────────────────────

const LEVEL = bunyan.resolveLevel(Config.get('level'))
const SRC = Config.get('src') === true

const options = {
  serializers: { err: serializers.err },
  src: SRC,
  streams: []
}

// ──────────────────────────────  Add Streams  ────────────────────────────────

if (Config.get('logs.streams.pretty')) {
  options.streams.push({
    level: LEVEL,
    stream: require('./streams/pretty')
  })
} else {
  options.streams.push({
    level: LEVEL,
    stream: process.stdout
  })
}

if (Config.get('logs.streams.cloudWatch')) {
  options.streams.push({
    type: 'raw',
    level: LEVEL,
    stream: require('./streams/cloud-watch')
  })
}

// ────────────────────────────────  Methods  ──────────────────────────────────

/**
 * Merge the given options with the default Options and create a bunyan
 * instance
 * @param  {String} name Logger Name
 * @return {BunyanInstance}
 */
function createLogger (opts = {}) {
  if (lo.isString(opts)) opts = { name: opts }
  if (!opts.name) opts.name = 'process'
  if (!lo.isString(opts.name)) opts.name = 'process'

  if (Loggers.has(opts.name)) return Loggers.get(opts.name)

  const instanceOptions = lo.mergeWith({}, options, { ...opts }, customizer)
  const instance = bunyan.createLogger(instanceOptions)

  Loggers.set(options.name, instance)

  return instance
}

// ────────────────────────────────  Exports  ──────────────────────────────────

module.exports = createLogger
module.exports.Serializers = serializers
module.exports.Loggers = Loggers
// ────────────────────────────────  Private  ──────────────────────────────────

function customizer (objValue, srcValue) {
  if (lo.isArray(objValue)) return lo.union(objValue, srcValue)
}
