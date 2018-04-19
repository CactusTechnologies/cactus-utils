/* Default NODE_ENV to development */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
/* Allways run on strict mode */
process.env.NODE_CONFIG_STRICT_MODE = true

const envPaths = require('env-paths')
const devIp = require('dev-ip')
const os = require('os')

const env = process.env

/**
 * Creates a base ENV Configuration based on the given Domain
 *
 * @param {Object} pkg package.json
 *
 * @return {Object}
 */

module.exports = function (pkg = {}) {
  const Config = {}

  Config.env = process.env.NODE_ENV
  Config.isDev = process.env.NODE_ENV === 'development'
  Config.host = (env.HOST || env.HOSTNAME || os.hostname()).split('.')[0]

  Config.domain = 'lab100.org'
  Config.basename = 'lab100'
  Config.appName = 'app'
  Config.service = 'org.lab100.app'
  Config.version = pkg.version || '1.0.0'

  Config.paths = envPaths(Config.basename, { suffix: '' })
  Config.ips = devIp() || ['127.0.0.1']

  return Config
}
