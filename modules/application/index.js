'use strict'

/* Load .env first */
require('./lib/dot-env')()

exports.baseConfig = require('./lib/create-base-config')
exports.App = require('./lib/Application')
exports.ApplicationDef = require('./lib/ApplicationDef')
