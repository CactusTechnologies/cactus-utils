const Config = require('config')
const { getAppName, resolveLevel } = require('./utils')
/**
 * Default Logger options
 *
 * @type {Object}
 */

const Options = {}

Options.src = Config.get('logs.src') === true
Options.serializers = require('./serializers')
Options.app = getAppName()

Options.streams = [
  {
    name: 'main',
    level: resolveLevel(Config.get('logs.level')),
    stream: process.stdout
  }
]

if (Config.get('logs.pretty') === true) {
  const pretty = require('./streams/pretty')

  Options.streams = [
    {
      name: 'main',
      level: resolveLevel(Config.get('logs.level')),
      stream: pretty(process.stdout)
    }
  ]
}

if (Config.get('logs.cloudWatch') === true) {
  const cloudWatch = require('./streams/cloud-watch')
  Options.streams.push({
    name: 'cloudWatch',
    type: 'raw',
    level: 30,
    stream: cloudWatch()
  })
}

module.exports = Options
