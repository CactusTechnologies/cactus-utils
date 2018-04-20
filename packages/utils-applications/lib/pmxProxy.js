/**
 * A proxy for PMX
 * @module App/pmx
 */
const Config = require('config')
const pmx = require('pmx')

const isDev = !!Config.isDev

const emitHandler = {
  apply: function (target, thisArgument, argumentsList) {
    argumentsList[0] = isDev ? `dev:${argumentsList[0]}` : argumentsList[0]
    argumentsList[1] = argumentsList[1] || undefined
    return Reflect.apply(...arguments)
  }
}

const PmxProxyHandler = {
  get: function (obj, prop, receiver) {
    if (prop === 'emit') return new Proxy(obj[prop].bind(obj), emitHandler)
    if (prop === 'init') {
      return async function init (
        init = {
          http: true,
          errors: false,
          custom_probes: true,
          network: true,
          ports: true,
          alert_enabled: true
        }
      ) {
        obj[prop](init)
        return true
      }
    }
    return Reflect.get(...arguments)
  }
}

module.exports = new Proxy(pmx, PmxProxyHandler)
