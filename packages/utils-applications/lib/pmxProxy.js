/**
 * A proxy for PMX
 * @module App/pmx
 */
const Config = require('config')
const log = require('@cactus-technologies/lab100-logger')('pmx')
const pmx = require('pmx')

Config.util.setModuleDefaults('pmx', {
  http: true,
  errors: false,
  custom_probes: true,
  network: true,
  ports: true
})

const isDev = !!Config.isDev

const emitHandler = {
  apply: function (target, thisArgument, argumentsList) {
    argumentsList[0] = isDev ? `dev:${argumentsList[0]}` : argumentsList[0]
    argumentsList[1] = argumentsList[1] || undefined
    log.trace({ payload: argumentsList[1] }, argumentsList[0])
    return Reflect.apply(...arguments)
  }
}

const PmxProxyHandler = {
  get: function (obj, prop, receiver) {
    if (prop === 'emit') return new Proxy(obj[prop].bind(obj), emitHandler)
    return Reflect.get(...arguments)
  }
}

module.exports = new Proxy(pmx, PmxProxyHandler)
