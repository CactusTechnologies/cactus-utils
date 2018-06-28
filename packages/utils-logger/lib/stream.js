const config = require('config')
const prettyOptions = { colorLevel: 2, timeStamps: false }
const stream = config.get('logs.stream')

module.exports = config.get('logs.pretty')
  ? require('@mechanicalhuman/bunyan-pretty')(stream, prettyOptions)
  : stream
