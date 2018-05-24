/* Default NODE_ENV to development */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
/* Allways run on strict mode */
process.env.NODE_CONFIG_STRICT_MODE = true

const envPaths = require('env-paths')
const devIp = require('dev-ip')
const os = require('os')
const fp = require('lodash/fp')

const env = process.env

/**
 * Creates a base ENV configuration based on the given Domain
 *
 * @param {Object} pkg package.json
 *
 * @return {Object}
 */

module.exports = function (pkg = {}, domain = 'cactus.is') {
  const config = {}

  config.env = env.NODE_ENV
  config.isDev = env.NODE_ENV === 'development'
  config.host = (env.HOST || env.HOSTNAME || os.hostname()).split('.')[0]

  config.domain = domain
  config.basename = domain.split('.')[0]
  config.name =
    env.APP_NAME ||
    env.name ||
    env.PROCESS_TITLE ||
    pkg.name ||
    env.npm_package_name ||
    'app'

  config.service = config.domain
    .split('.')
    .reverse()
    .concat([fp.toLower(fp.camelCase(this.name))])
    .join('.')

  config.version = pkg.version || '1.0.0'

  config.paths = envPaths(config.basename, { suffix: '' })
  config.ips = devIp() || ['127.0.0.1']

  return config
}
