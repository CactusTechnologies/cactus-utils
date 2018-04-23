'use strict'

const helmet = require('helmet')

exports.dnsPrefetchControl = helmet.dnsPrefetchControl()
exports.frameguard = helmet.frameguard()
exports.ieNoOpen = helmet.ieNoOpen()
exports.noSniff = helmet.noSniff()
exports.xssFilter = helmet.xssFilter()
exports.referrerPolicy = helmet.referrerPolicy({ policy: 'same-origin' })
