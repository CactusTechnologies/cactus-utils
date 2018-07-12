const config = require('config')

const stream = config.get('logs.stream')

if (config.get('logs.pretty')) {
  const opts = config.has('pretty')
    ? {}
    : {
      colorLevel: 2,
      timeStamps: false
    }
  module.exports = require('@mechanicalhuman/bunyan-pretty')(stream, opts)
} else {
  module.exports = stream
}
