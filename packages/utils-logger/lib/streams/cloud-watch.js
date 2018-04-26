if (!require('config').has('cloudWatch')) {
  throw new Error('Cloudwatch config not found')
}

const bunyanCloudwatch = require('bunyan-cloudwatch')
const os = require('os')
const Config = require('config')
const assert = require('assert')
const kebabCase = require('lodash/fp/kebabCase')
const utils = require('../utils')

assert.ok(Config.cloudWatch.accessKeyId, 'AWS accessKeyId is missing')
assert.ok(Config.cloudWatch.secretAccessKey, 'AWS secretAccessKey is missing')
assert.ok(Config.cloudWatch.region, 'AWS region is missing')

const cloudWatchOptions = {
  logGroupName: 'application-logs',
  logStreamName: kebabCase(
    [
      utils.getAppName(),
      Config.has('version') ? Config.get('version') : '0.0.0',
      (process.env.HOST || process.env.HOSTNAME || os.hostname()).split('.')[0],
      process.pid
    ].join('-')
  ),
  cloudWatchLogsOptions: Config.get('cloudWatch')
}

module.exports = (opts = {}) =>
  bunyanCloudwatch({ ...cloudWatchOptions, ...opts })
