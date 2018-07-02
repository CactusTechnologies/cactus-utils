const config = require('config')
const utils = require('./utils')
const fp = require('lodash/fp')

const PRETTY = config.get('logs.pretty')

const stream = config.has('logs.stream')
  ? config.get('logs.stream')
  : process.stdout

if (PRETTY) {
  const defaultOptions = { colorLevel: 2, timeStamps: false }
  const opts = fp.isBoolean(PRETTY)
    ? defaultOptions
    : utils.extend({}, defaultOptions, utils.shallowConf('logs.pretty'))
  module.exports = require('@mechanicalhuman/bunyan-pretty')(stream, opts)
} else {
  module.exports = stream
}
