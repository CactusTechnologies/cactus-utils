const config = require('config')
const lo = require('lodash')

const stream = getStream()
const usePretty = config.get('logs.pretty')
const prettyOpts = { colorLevel: 2, timeStamps: false }

module.exports = usePretty
  ? require('@mechanicalhuman/bunyan-pretty')(stream, prettyOpts)
  : stream

function getStream () {
  const stream = config.get('logs.stream')
  if (lo.has(stream, 'resolve') && lo.isFunction(stream.resolve)) {
    return stream.resolve()
  } else {
    return stream
  }
}
