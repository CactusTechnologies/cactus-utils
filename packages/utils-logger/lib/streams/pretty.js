const Config = require('config').get('logs')
const bunyanPretty = require('@mechanicalhuman/bunyan-pretty')

module.exports = bunyanPretty(process.stdout, Config.get('pretty'))
