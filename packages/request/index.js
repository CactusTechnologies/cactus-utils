'use strict'

const Bottleneck = require('bottleneck')
const fp = require('lodash/fp')
const request = require('request')

const errors = require('@cactus-technologies/errors')
const logger = require('@cactus-technologies/logger')
const utils = require('@cactus-technologies/utils')

const normalize = utils.normalize
const assert = utils.assert
const ApiTimeOutError = errors.ApiTimeOutError
const ApiError = errors.ApiError
const ApiFailError = errors.ApiFailError
const EmptyArgumentError = errors.EmptyArgumentError

module.exports = function makeAPI (name, test, options) {
  /* deconstruct the options fort convenience */
  let { defaults: { baseUrl, ...defaults } = {}, limits = {} } = options || {}

  if (!assert.isString(name)) throw new EmptyArgumentError('name')
  if (!assert.isString(baseUrl)) throw new EmptyArgumentError('baseUrl')

  test = assert.isFunction(test) ? test : genericTest

  defaults = {
    ...defaults,
    method: 'GET',
    json: true,
    time: true,
    baseUrl: baseUrl
  }

  const apiRequest = utils.promisify(request.defaults(defaults))
  const apiLimiter = new Bottleneck(limits)

  const log = logger({
    name: fp.camelCase(name),
    serializers: { response: require('./lib/serializer') }
  })

  const apiName = fp.camelCase(name)

  log.trace({ defaults: defaults, limits: limits }, `${apiName} Configuration`)
  log.info('%s API Endpoint: %s', apiName, baseUrl)
  apiLimiter.on('error', error => log.error(error))

  return apiLimiter.wrap(ApiCall)

  async function ApiCall (req, reqTest) {
    reqTest = fp.isFunction(reqTest) ? reqTest : test

    log.debug('%s called on route: %s', apiName, req.uri || req.url || req)

    let resp = null

    try {
      resp = await apiRequest(req)
    } catch (err) {
      if (err.code === 'ETIMEDOUT') {
        throw new ApiTimeOutError(err, '%s Timedout', apiName)
      }
      throw new ApiError(err, '%s response: %s', apiName, err.message)
    }

    if (!resp) throw new ApiFailError('Empty Response')

    resp.statusCode = normalize.statusCode(resp.statusCode)
    resp.status = utils.humanizeStatusCode(resp.statusCode)
    resp.body = resp.body || {}

    if (!reqTest(resp)) {
      log.error({ response: resp }, resp.status)
      throw new ApiFailError(
        '%s response: %s [%s]',
        apiName,
        resp.status,
        resp.statusCode
      )
    }

    const msg = `${apiName} response: ${resp.status} [${resp.statusCode}]`
    log.trace({ response: resp, body: resp.body }, msg)

    return resp.body
  }
}

// ─────────────────────────────────  utils  ───────────────────────────────────

function genericTest (response, apiName, log) {
  return response.statusCode >= 200 && response.statusCode < 400
}
