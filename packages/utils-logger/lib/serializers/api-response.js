const lo = require('lodash')
const prettyBytes = require('pretty-bytes')
const querystring = require('querystring')
const moment = require('moment')

function responseSerializer (response) {
  if (!response || !response.statusCode) return response

  const status = lo.get(response, 'statusCode')
  const hasBody = lo.has(response, 'body')
  const host = lo.get(response, 'request.uri.host')
  const path = lo.get(response, 'request.uri.pathname')
  const method = lo.get(response, 'request.method')
  const query = querystring.parse(lo.get(response, 'request.uri.query'))

  return {
    url: `${method} - ${host}${path}`,
    success: status === 200 && hasBody,
    status: status,
    query: query || undefined,
    size: prettyBytes(parseInt(lo.get(response, 'headers.content-length', 0))),
    duration: `${moment
      .duration(lo.get(response, 'elapsedTime'))
      .asSeconds()} s`
  }
}

module.exports = responseSerializer
