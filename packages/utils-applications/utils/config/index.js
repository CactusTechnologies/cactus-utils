const envPaths = require('env-paths')
const devIp = require('dev-ip')
const os = require('os')
const pkgDir = require('pkg-dir')
const { deferConfig: defer } = require('config/defer')
const path = require('path')

/**
 * Creates a base ENV Configuration based on the given Domain
 *
 * @param  {String} domain The Application domain (lab100.org)
 * @param {Object} pkg package.json
 *
 * @return {Object}
 */

module.exports = function (
  domain = 'lab100.org',
  rootPath = pkgDir.sync(path.resolve(__dirname, '../../..'))
) {
  const pkg = require(path.resolve(rootPath, 'package.json'))

  const Config = {}

  Config.domain = domain
  Config.basename = Config.domain.split('.')[0]
  // prettier-ignore
  Config.host = (process.env.HOST || process.env.HOSTNAME || os.hostname()).split('.')[0]
  Config.env = process.env.NODE_ENV || 'development'
  Config.isDev = process.env.NODE_ENV === 'development'
  Config.isPm2Dev = path.basename(process.mainModule.filename) === 'pm2-dev'
  Config.appName = Config.domain.split('.')[0]

  Config.version = pkg.version

  Config.service = Config.domain
    .split('.')
    .reverse()
    .join('.')

  Config.instance = defer(appName => `${appName}-worker-${process.pid}`)

  Config.paths = {
    ...envPaths(Config.basename, { suffix: '' }),
    root: rootPath
  }

  Config.watch = ['config/**/**', 'lib/**/**', 'src/**/**']
  Config.ignoreWatch = ['node_modules/**', '*.log']

  Config.ips = devIp()

  return Config
}
