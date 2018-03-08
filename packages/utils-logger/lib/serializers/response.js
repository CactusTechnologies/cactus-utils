'use strict'

const Config = require('config').get('logs.http')
const obscureHeaders = processHeaderNames(Config.obscureHeaders)
const excludeHeaders = processHeaderNames(Config.excludeHeaders)

// const debug = require('debug')('mech:logger:serializers')
function responseSerializer (res) {
  if (!res || !res.statusCode) return res
  return {
    statusCode: res.statusCode,
    headers: getHeaders(res)
  }
}

module.exports = responseSerializer

function getHeaders (res) {
  const rawHeaders = res._headers

  if (rawHeaders && (obscureHeaders || excludeHeaders)) {
    return Object.keys(rawHeaders).reduce(function (memo, name) {
      if (excludeHeaders && excludeHeaders.includes(name)) {
        return memo
      }

      if (obscureHeaders && obscureHeaders.includes(name)) {
        memo[name] = null
        return memo
      }

      memo[name] = rawHeaders[name]
      return memo
    }, {})
  }

  return rawHeaders
}

function processHeaderNames (property) {
  if (property && property.length) {
    return property.map(function (name) {
      return name.toLowerCase()
    })
  } else {
    return false
  }
}
