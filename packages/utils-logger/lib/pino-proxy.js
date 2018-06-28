/**
 * A proxy for Pino Loggers
 * @module logger/proxy
 */

function log (target, thisArgument, argumentsList) {
  argumentsList[0] =
    argumentsList[0] instanceof Error
      ? { err: argumentsList[0] }
      : argumentsList[0]
  return Reflect.apply(...arguments)
}

function child (target, thisArgument, argumentsList) {
  const children = Reflect.apply(...arguments)
  return new Proxy(children, { get: getHandler })
}

function getHandler (obj, prop, receiver) {
  if (prop === 'fatal') return new Proxy(obj[prop].bind(obj), { apply: log })
  if (prop === 'error') return new Proxy(obj[prop].bind(obj), { apply: log })
  if (prop === 'warn') return new Proxy(obj[prop].bind(obj), { apply: log })
  if (prop === 'info') return new Proxy(obj[prop].bind(obj), { apply: log })
  if (prop === 'debug') return new Proxy(obj[prop].bind(obj), { apply: log })
  if (prop === 'trace') return new Proxy(obj[prop].bind(obj), { apply: log })
  if (prop === 'child') {
    return new Proxy(obj[prop].bind(obj), { apply: child })
  }
  return Reflect.get(...arguments)
}

module.exports = instance => new Proxy(instance, { get: getHandler })
