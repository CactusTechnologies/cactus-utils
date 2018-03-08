const Config = require('config').get('logs')
const bunyanCloudwatch = require('bunyan-cloudwatch')

if (!Config.has('cloudWatch.cloudWatchLogsOptions')) {
  throw new Error('You need to provide the cloudWatchLogsOptions (AWS Config)')
}

module.exports = bunyanCloudwatch(Config.get('cloudWatch'))
