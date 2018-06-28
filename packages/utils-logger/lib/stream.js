const config = require('config')
const prettyOptions = { colorLevel: 2, timeStamps: false }
const pretty = require('@mechanicalhuman/bunyan-pretty')

const stream = config.has('logs.stream')
  ? config.get('logs.stream')
  : process.stdout

module.exports = config.get('logs.pretty')
  ? pretty(stream, prettyOptions)
  : stream
