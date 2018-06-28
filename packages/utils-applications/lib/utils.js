/** @module utils */

'use strict'

exports.promisify = require('util').promisify
exports.format = require('util').format

exports.diff = require('config').util.diffDeep

exports.exists = require('fs').existsSync

exports.readFile = exports.promisify(require('fs').readFile)
exports.saveFile = exports.promisify(require('fs').writeFile)
exports.deleteFile = exports.promisify(require('fs').unlink)

exports.mkd = require('make-dir')
exports.rm = require('del')
exports.exec = require('execa')

exports.forEach = exports.promisify(require('async').forEach)
exports.forEachSeries = exports.promisify(require('async').forEachSeries)

exports.map = exports.promisify(require('async').map)
exports.mapSeries = exports.promisify(require('async').mapSeries)
exports.mapValues = exports.promisify(require('async').mapValues)

exports.wait = function waitForMs (ms = 1000) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

exports.nextTick = function nextTick () {
  return new Promise(resolve => process.nextTick(() => resolve()))
}

exports.getDuration = function getDuration (start) {
  const diff = process.hrtime(start)
  const nanoseconds = diff[0] * 1e9 + diff[1]
  return nanoseconds / 1e6
}

exports.humanizeStatusCode = function humanize (status) {
  const { STATUS_CODES } = require('http')
  const fp = require('lodash/fp')
  return fp.getOr('Unknown', status, STATUS_CODES)
}

exports.encrypt = (decrypted, SECRET_KEY) => {
  if (!SECRET_KEY) throw new Error('SECRET_KEY is required')
  const cipher = require('crypto').createCipher('aes192', SECRET_KEY)
  return cipher.update(decrypted, 'utf8', 'hex') + cipher.final('hex')
}

exports.decrypt = (encrypted, SECRET_KEY) => {
  if (!SECRET_KEY) throw new Error('SECRET_KEY is required')
  const decipher = require('crypto').createDecipher('aes192', SECRET_KEY)
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

exports.say =
  require('os').platform() === 'darwin'
    ? async str => exports.exec(`say "${str}"`)
    : async str => true
