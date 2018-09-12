'use strict'

const helmet = require('helmet')

exports.dnsPreFetchControl = helmet.dnsPrefetchControl()
exports.frameGuard = helmet.frameguard()
exports.ieNoOpen = helmet.ieNoOpen()
exports.noSniff = helmet.noSniff()
exports.xssFilter = helmet.xssFilter()
exports.referrerPolicy = helmet.referrerPolicy({ policy: 'same-origin' })
