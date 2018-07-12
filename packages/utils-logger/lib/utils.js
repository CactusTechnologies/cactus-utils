const config = require('config')
const URL = require('url')

exports.extend = config.util.extendDeep

exports.getDuration = start => {
  const diff = process.hrtime(start)
  const nanoseconds = diff[0] * 1e9 + diff[1]
  return nanoseconds / 1e6
}

exports.getAppName = () => {
  return config.has('name')
    ? config.get('name')
    : process.env.APP_NAME ||
        process.env.name ||
        process.env.PROCESS_TITLE ||
        process.env.npm_package_name ||
        'app'
}

exports.getHostName = () =>
  (config.has('host')
    ? config.get('host')
    : process.env.HOST || process.env.HOSTNAME || require('os').hostname()
  ).split('.')[0]

/**
 * Gets the Error Stack as a String.
 *
 * @param  {Error} ex Error Object
 *
 * @return {String}
 */

exports.getErrorStack = ex => {
  let ret = ex.stack || ex.toString()
  if (ex.cause && typeof ex.cause === 'function') {
    const cex = ex.cause()
    if (cex) ret += '\nCaused by: ' + exports.getErrorStack(cex)
  }
  return ret
}

/**
 * Returns the pathname part of the given url
 *
 * @param  {String} url
 *
 * @return {String}
 */

exports.getCleanUrl = url => {
  const parsed = URL.parse(url)
  return parsed.pathname || url
}
