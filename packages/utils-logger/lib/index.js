'use strict'

/**
 * Creates a customized Bunyan Logger based on my opinionated vision
 * @module logger
 */

/* Dependencies */
const Config = require('config')
const lo = require('lodash')
const bunyan = require('bunyan')
const serializers = require('./serializers')

// ───────────────────────────────  Configure  ─────────────────────────────────

const options = {
  serializers: {
    err: serializers.err
  },

  src: Boolean(Config.get('logs.src')),

  streams: []
}

// ──────────────────────────────  Add Streams  ────────────────────────────────

if (Config.get('logs.streams.pretty')) {
  options.streams.push({
    level: parseLevel(Config.get('logs.level')),
    stream: require('./streams/pretty')
  })
} else {
  options.streams.push({
    level: parseLevel(Config.get('logs.level')),
    stream: process.stdout
  })
}

if (Config.get('logs.streams.cloudWatch')) {
  options.streams.push({
    type: 'raw',
    level: parseLevel(Config.get('logs.level')),
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
function createLogger (opt = 'process') {
  if (lo.isString(opt)) opt = { name: opt }
  if (!opt.name) opt.name = 'process'
  opt.name = `${Config.get('logs.prefix')}:${opt.name}`
  return bunyan.createLogger(Object.assign({}, options, opt))
}

// ────────────────────────────────  Exports  ──────────────────────────────────

module.exports = createLogger
module.exports.Serializers = serializers

// ────────────────────────────────  Private  ──────────────────────────────────

/** Parses the level to a bunyan lvl */
function parseLevel (level = 30) {
  try {
    return bunyan.resolveLevel(level)
  } catch (e) {
    return 30
  }
}
