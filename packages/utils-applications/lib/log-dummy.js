/**
 * A dummy logger
 * @module App/log-dummy
 */

const fp = require('lodash/fp')
const { format, inspect } = require('util')

const appName =
  process.env.APP_NAME ||
  process.env.name ||
  process.env.PROCESS_TITLE ||
  process.env.npm_package_name ||
  'app'

const prefix = `${appName}:${'process'}`

function logLevel (log, name) {
  return function logger (data, ...props) {
    let att = true
    if (fp.isString(data)) {
      props.unshift(data)
      att = false
    }
    props.unshift(`${name} `)
    const out = format(...props)
    log(out)
    if (att) log(inspect(data))
  }
}

module.exports = {
  fatal: logLevel(console.log.bind(console), prefix),
  error: logLevel(console.log.bind(console), prefix),
  warn: logLevel(console.log.bind(console), prefix),
  info: logLevel(console.error.bind(console), prefix),
  debug: logLevel(console.error.bind(console), prefix),
  trace: logLevel(console.error.bind(console), prefix)
}
