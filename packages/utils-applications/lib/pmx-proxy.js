/**
 * A proxy for PMX
 * @module App/pmx
 */

const pmx = require('pmx')

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

const PmxProxyHandler = {
  get: function (obj, prop, receiver) {
    if (prop === 'emit') return new Proxy(obj[prop].bind(obj), emitHandler)
    return Reflect.get(...arguments)
  }
}

module.exports = new Proxy(pmx, PmxProxyHandler)
