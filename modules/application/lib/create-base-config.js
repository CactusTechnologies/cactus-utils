'use strict'

const envPaths = require('env-paths')
const devIp = require('dev-ip')
const os = require('os')
const fp = require('lodash/fp')
const path = require('path')
const debug = require('debug')('cactus:app:paths')
const env = process.env

/**
 * Base application config
 *
 * @typedef baseConfig
 *
 * @property {String} name Application's name
 * @property {String} domain Application's domain (Used to group apps)
 * @property {String} basename Domain's base (cactus in cactus.is)
 * @property {String} service process name on POSIX (reverse domain notation ext.domain.name)
 * @property {String} version Application version (semver)
 *
 * @property {?String} env Current NODE_ENV value (can be undefined)
 * @property {Boolean} isDev true if NODE_ENV === development
 * @property {String} host Machine hostname
 * @property {Array} ips Array of machine's known IP addresses
 *
 * @property {Object} paths Common paths
 * @property {String} paths.data Directory for data files.
 * @property {String} paths.config Directory for config files.
 * @property {String} paths.cache Directory for non-essential data files.
 * @property {String} paths.log Directory for log files.
 * @property {String} paths.temp Directory for temporary files.
 * @property {String} paths.public Directory for public files.
 * @property {String} paths.assets Directory for assets files.
 */

module.exports = createBaseConfig

/**
 * Creates a base app configuration
 *
 * @param {object} pkg Application package.json
 * @param {string} pkg.name Application name
 * @param {string} pkg.version Application version
 * @param {string} pkg.domain Application domain
 * @param {string} [domain='cactus.is'] Application domain for backwards comp.
 * @returns {baseConfig}
 */

function createBaseConfig (pkg = {}, baseDomain = 'cactus.is') {
  const { name = false, version = '0.0.1', domain = baseDomain } = pkg

  const config = {}

  config.env = env.NODE_ENV
  config.isDev = env.NODE_ENV === 'development'
  config.host = (env.HOST || env.HOSTNAME || os.hostname()).split('.')[0]

  config.domain = domain.split('.')[0]
  config.extDomain = domain

  config.name =
    env.APP_NAME || env.name || name || env.npm_package_name || 'app'

  config.service = domain
    .split('.')
    .reverse()
    .concat([fp.toLower(fp.camelCase(config.name))])
    .join('.')

  config.version = version

  config.paths = getPaths(config.domain)
  config.ips = devIp() || ['127.0.0.1']

  return config
}

/**
 * Finds the appropriate paths for common locations.
 *
 * @param {string} [basename='cactus'] A basename to avoid collision with native apps
 * @private
 * @returns {object}
 */
function getPaths (basename = 'cactus') {
  return fp.pipe(
    getEnvPaths,
    setPathFromEnv('log', 'logsPath', null),
    setPathFromEnv('public', 'publicPath', './public'),
    setPathFromEnv('assets', 'assetsPath', './assets'),
    setPathFromEnv('root', 'appRoot', process.cwd())
  )(basename)

  function setPathFromEnv (prop, target, defaultPath) {
    let outPath = null
    const domainENV = makeEnvName(target, basename)
    const cactusENV = makeEnvName(target, 'cactus')

    if (domainENV in env) {
      debug('Found %s override on %s', prop, domainENV)
      outPath = fp.get(domainENV)(env)
    } else if (cactusENV in env) {
      debug('Found %s override on %s', prop, cactusENV)
      outPath = fp.get(cactusENV)(env)
    } else {
      outPath = defaultPath
    }

    return function setter (paths) {
      if (fp.isNil(outPath)) return paths
      else return fp.set(prop, path.resolve(process.cwd(), outPath))(paths)
    }

    function makeEnvName (targetPath, base) {
      return fp.toUpper(`${base}_${fp.snakeCase(targetPath)}`)
    }
  }

  function getEnvPaths (basename) {
    return envPaths(basename, { suffix: '' })
  }
}
