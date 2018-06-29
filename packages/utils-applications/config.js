const envPaths = require('env-paths')
const devIp = require('dev-ip')
const os = require('os')
const fp = require('lodash/fp')
const path = require('path')
const env = process.env

/**
 * Creates a base ENV configuration based on the given Domain
 *
 * @param {Object} pkg package.json
 *
 * @return {Object}
 */

module.exports = function (
  { name = false, version = '0.0.1' } = {},
  domain = 'cactus.is'
) {
  const config = {}

  config.env = env.NODE_ENV
  config.isDev = env.NODE_ENV === 'development'
  config.host = (env.HOST || env.HOSTNAME || os.hostname()).split('.')[0]

  config.domain = domain
  config.basename = domain.split('.')[0]

  config.name =
    env.APP_NAME || env.name || name || env.npm_package_name || 'app'

  config.service = config.domain
    .split('.')
    .reverse()
    .concat([fp.toLower(fp.camelCase(config.name))])
    .join('.')

  config.version = version

  config.paths = addPublicPath(envPaths(config.basename, { suffix: '' }))
  config.ips = devIp() || ['127.0.0.1']

  return config
}

function addPublicPath (config) {
  const publicFolder = path.resolve(process.cwd(), 'public')
  return fp.set('paths.public', publicFolder, config)
}
