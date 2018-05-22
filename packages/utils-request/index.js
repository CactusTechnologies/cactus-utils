'use strict'

const { STATUS_CODES } = require('http')
const Bottleneck = require('bottleneck')
const fp = require('lodash/fp')
const request = require('request')
const util = require('util')
const errors = require('@cactus-technologies/errors')
const logger = require('@cactus-technologies/logger')

const EmptyArgumentError = errors.EmptyArgumentError
const CactusError = errors.CactusError

class ApiError extends CactusError {
  constructor (cause, ...props) {
    if (props.length === 0) props.unshift('Request Error')
    super({ cause: cause, constructorOpt: ApiError }, ...props)
    this.name = 'NotAuthorizedError'
    this.code = 'ENOTAUTH'
    this.status = 500
  }
}

class ApiTimeOutError extends CactusError {
  constructor (cause, ...props) {
    if (props.length === 0) props.unshift('Request TimedOut')
    super({ cause: cause, constructorOpt: ApiTimeOutError }, ...props)
    this.name = 'NotAuthorizedError'
    this.code = 'ENOTAUTH'
    this.status = 500
  }
}

class ApiFailError extends CactusError {
  constructor (...props) {
    if (props.length === 0) props.unshift('Bad Response')
    super({ constructorOpt: ApiFailError }, ...props)
    this.name = 'NotAuthorizedError'
    this.code = 'ENOTAUTH'
    this.status = 500
  }
}

module.exports = function makeAPI (name, test, options) {
  /* deconstruct the options fort convinience */
  let { defaults: { baseUrl, ...defaults } = {}, limits = {} } = options || {}

  if (!fp.isString(name)) throw new EmptyArgumentError('name')
  if (!fp.isString(baseUrl)) throw new EmptyArgumentError('baseUrl')

  test = fp.isFunction(test) ? test : genericTest

  defaults = {
    ...defaults,
    method: 'GET',
    json: true,
    time: true,
    baseUrl: baseUrl
  }
  const apiRequest = util.promisify(request.defaults(defaults))
  const apiLimiter = new Bottleneck(limits)

  const log = logger(fp.camelCase(name))
  const apiName = `${fp.camelCase(name)} API`
  const logOnce = fp.once(log.info.bind(log))

  log.trace({ defaults: defaults, limits: limits }, `${apiName} Configuration`)

  apiLimiter.on('error', error => log.error(error))

  return apiLimiter.wrap(ApiCall)

  async function ApiCall (req, reqTest) {
    reqTest = fp.isFunction(reqTest) ? reqTest : test
    logOnce('%s Endpoint: %s', apiName, baseUrl)

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

    resp.statusCode = resp.statusCode || 500
    resp.status = fp.getOr('Unknown', resp.statusCode, STATUS_CODES)
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
