const bunyanPretty = require('@mechanicalhuman/bunyan-pretty')
const prettyOptions = { colorLevel: 2, timeStamps: false }

module.exports = (stream = process.stdout, opts = {}) =>
  bunyanPretty(stream, { ...prettyOptions, ...opts })
