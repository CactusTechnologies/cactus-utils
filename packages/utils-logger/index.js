const Config = require('config')

Config.util.setModuleDefaults('logs', require('./default-config'))

module.exports = require('./lib')
