const Config = require('config')
const bunyan = require('bunyan')
const streams = require('./streams')

/**
 * Default Logger options
 *
 * @type {Object}
 */

const options = {
  serializers: require('./serializers'),
  src: Config.get('logs.src') === true,
  appName: Config.has('appId')
    ? Config.get('appId')
    : Config.has('appName')
      ? Config.get('appName')
      : undefined,
  streams: [
    {
      name: 'main',
      level: bunyan.resolveLevel(Config.get('logs.level')),
      stream: process.stdout
    }
  ]
}

if (Config.get('logs.pretty') === true) {
  const prettyOptions = { colorLevel: 2, timeStamps: false }

  options.streams = []

  options.streams.push({
    name: 'main',
    level: bunyan.resolveLevel(Config.get('logs.level')),
    stream: streams.pretty(process.stdout, prettyOptions)
  })
}

// if (Config.get('logs.cloudWatch') === true) {
//   if (
//     Config.has('cloudWatch') &&
//     Config.has('cloudWatch.accessKeyId') &&
//     Config.has('cloudWatch.secretAccessKey') &&
//     Config.has('cloudWatch.region')
//   ) {
//   }

//   const cloudWatchOptions = Config.get('cloudWatch')

//   options.streams.push({
//      name: 'cloudWatch',
//     type: 'raw',
//     level: bunyan.INFO,
//     stream: streams.cloudWatch(Config.get('logs.cloudWatch'))
//   })
// }

module.exports = options
