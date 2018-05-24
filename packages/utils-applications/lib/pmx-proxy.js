/**
 * A proxy for PMX
 * @module App/pmx
 */

const pmx = require('pmx')
const fp = require('lodash/fp')

const isDev = process.env.NODE_ENV === 'development'

const emitHandler = {
  apply: function emit (target, thisArgument, argumentsList) {
    argumentsList[0] = argumentsList[0]
    argumentsList[1] = argumentsList[1] || undefined

    if (isDev) {
      process.log.info(
        {
          event: argumentsList[0],
          payload: argumentsList[1]
        },
        'PMX Event'
      )
      return
    }

    process.log.debug(
      {
        event: argumentsList[0],
        payload: argumentsList[1]
      },
      'Emited event to keymetrics'
    )

    return Reflect.apply(...arguments)
  }
}

const initHandler = {
  apply: function init (target, thisArgument, argumentsList) {
    argumentsList[0] = fp.isPlainObject(argumentsList[0])
      ? {
        http: true,
        errors: false,
        custom_probes: true,
        network: true,
        ports: true,
        alert_enabled: true,
        ...argumentsList[0]
      }
      : {
        http: true,
        errors: false,
        custom_probes: true,
        network: true,
        ports: true,
        alert_enabled: true
      }

    process.log.trace({ pmx: argumentsList[0] }, 'PMX Configuration')
    return Reflect.apply(...arguments)
  }
}

const PmxProxyHandler = {
  get: function (obj, prop, receiver) {
    if (prop === 'emit') return new Proxy(obj[prop].bind(obj), emitHandler)
    if (prop === 'init') return new Proxy(obj[prop].bind(obj), initHandler)
    return Reflect.get(...arguments)
  }
}

module.exports = new Proxy(pmx, PmxProxyHandler)
