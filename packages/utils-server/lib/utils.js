const { STATUS_CODES } = require('http')
const fp = require('lodash/fp')

exports.humanizeStatusCode = input => fp.getOr('Unknown', input, STATUS_CODES)

exports.getDuration = function getDuration (start) {
  const diff = process.hrtime(start)
  const nanoseconds = diff[0] * 1e9 + diff[1]
  return nanoseconds / 1e6
}
