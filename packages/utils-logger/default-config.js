const Config = {}

Config.prefix = 'lab100'
Config.level = 'info'
Config.src = false

// ────────────────────────────────  Streams  ──────────────────────────────────

Config.streams = {
  pretty: false,
  cloudWatch: false
}

Config.pretty = {
  strict: false,
  depth: 4,
  maxArrayLength: 100,
  colors: 2,
  timeStamps: false
}

Config.cloudWatch = {
  logGroupName: 'lab100-logs',
  logStreamName: `local-lab100-${process.pid}`
}

// ───────────────────────────  Bunyan Middleware  ─────────────────────────────

Config.http = {
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

module.exports = Config
