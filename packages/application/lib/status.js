'use strict'

const fp = require('lodash/fp')
const io = require('@pm2/io')

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
  if (name === 'addMetric') throw new TypeError('"addMetric" is reserved.')

  if (metrics.has(name)) {
    process.log.warn(`The metric ${name} is already registered.`)
    return
  }

  statuses.set(name, defaultValue)

  metrics.set(
    name,
    io.metric({
      type: 'metric',
      name: name,
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
