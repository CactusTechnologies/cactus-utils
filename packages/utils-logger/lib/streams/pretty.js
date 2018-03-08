const Config = require('config')
const bunyanPretty = require('@mechanicalhuman/bunyan-pretty')

module.exports = bunyanPretty(process.stdout, Config.get('logs.pretty'))
