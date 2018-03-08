const Config = require('config')

const baseconf = {
  level: 'info',
  src: false,

  prefix: 'lab100',

  streams: {
    pretty: false,
    cloudWatch: false
  },

  pretty: {
    strict: false,
    depth: 4,
    maxArrayLength: 100,
    colors: 2,
    timeStamps: false
  },

  cloudWatch: {
    logGroupName: 'lab100-logs',
    // prettier-ignore
    logStreamName: `local-lab100-${process.pid}`
  },

  http: {
    obscureheaders: ['authorization'],
    excludeheaders: [
      'connection',
      'host',
      'pragma',
      'cache-control',
      'accept-encoding',
      'accept-language',
      'x-forwarded-port',
      'x-forwarded-proto',
      'x-xss-protection',
      'x-content-type-options',
      'x-download-options',
      'x-frame-options',
      'x-dns-prefetch-control',
      'x-amzn-trace-id'
    ]
  }
}

Config.util.setModuleDefaults('logs', baseconf)

module.exports = require('./lib')
