'use strict'

const debug = require('debug')('cactus:app:status')

const { assert } = require('@cactus-technologies/utils')

const metrics = new Map()
const statuses = new Map()

module.exports = app => {
  app.status = {}
  app.addMetric = addMetric.bind(app)
}

function addMetric(name, defaultValue = true) {
  if (!assert.isString(name)) throw new TypeError('name is required')

  if (metrics.has(name)) {
    process.log.warn(`The metric ${name} is already registered.`)
    return
  }

  debug('Creating status: %s with value [ %o ]', name, defaultValue)

  statuses.set(name, defaultValue)

  metrics.set(
    name,
    this.metric({
      type: 'metric',
      name: `cactus:${name}`,
      value: () => this.status[name]
    })
  )

  Object.defineProperty(this.status, name, {
    get() {
      return statuses.get(name)
    },
    set(newValue) {
      const oldValue = statuses.get(name)
      debug('Changing status %s to %o from %o', name, newValue, oldValue)
      statuses.set(name, newValue)
      return statuses.get(name)
    },
    enumerable: true,
    configurable: false
  })
}
