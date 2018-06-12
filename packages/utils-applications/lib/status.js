'use strict'

const pmx = require('./pmx-proxy')
const fp = require('lodash/fp')

const { metric } = pmx.probe()

const metrics = new Map()
const statuses = new Map()
const isValid = fp.allPass([
  fp.negate(fp.isNil),
  fp.negate(fp.isEmpty),
  fp.isString
])

const status = {}

module.exports = status

module.exports.addMetric = function addMetric (name, defaultValue = true) {
  if (!isValid(name)) throw new TypeError('name is required')
  statuses.set(name, defaultValue)

  metrics.set(
    name,
    metric({
      name: `cactus:${name}`,
      value: () => status[name]
    })
  )

  Object.defineProperty(status, name, {
    get () {
      return statuses.get(name)
    },
    set (newValue) {
      statuses.set(name, newValue)
    },
    enumerable: true,
    configurable: false
  })
}
