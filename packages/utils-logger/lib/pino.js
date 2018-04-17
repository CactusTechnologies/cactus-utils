/**
 * A proxy for Pino
 * @module logger/proxy
 */

const pino = require('pino')

const logHandler = {
  apply: function (target, thisArgument, argumentsList) {
    if (argumentsList[0] instanceof Error) {
      argumentsList[0] = { err: argumentsList[0] }
      if (!argumentsList[1]) argumentsList[1] = argumentsList[0].message
    }

    if (!argumentsList[0]) {
      argumentsList[0] = 'No message'
    }

    return Reflect.apply(...arguments)
  }
}

const childHandler = {
  apply: function (target, thisArgument, argumentsList) {
    const children = Reflect.apply(...arguments)
    return new Proxy(children, PinoProxyHandler)
  }
}

const PinoProxyHandler = {
  get: function (obj, prop, receiver) {
    if (prop === 'fatal') return new Proxy(obj[prop].bind(obj), logHandler)
    if (prop === 'error') return new Proxy(obj[prop].bind(obj), logHandler)
    if (prop === 'warn') return new Proxy(obj[prop].bind(obj), logHandler)
    if (prop === 'info') return new Proxy(obj[prop].bind(obj), logHandler)
    if (prop === 'debug') return new Proxy(obj[prop].bind(obj), logHandler)
    if (prop === 'trace') return new Proxy(obj[prop].bind(obj), logHandler)

    if (prop === 'child') return new Proxy(obj[prop].bind(obj), childHandler)

    return Reflect.get(...arguments)
  }
}

module.exports = (options, stream) => {
  const instance = pino(options, stream)
  return new Proxy(instance, PinoProxyHandler)
}
