const Config = {}

Config.prefix = false
Config.level = 'info'
Config.src = false

// ────────────────────────────────  Streams  ──────────────────────────────────

Config.streams = {
  pretty: false,
  cloudWatch: false
}

Config.pretty = {
  colors: 2,
  timeStamps: false
}

Config.cloudWatch = {
  logGroupName: 'lab100-logs',
  logStreamName: `${Config.prefix}-${process.pid}`,
  cloudWatchLogsOptions: {}
}

// ───────────────────────────  Bunyan Middleware  ─────────────────────────────

Config.http = {
  obscureHeaders: ['authorization', 'x-lab100-app-secret'],
  excludeHeaders: [
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
  ],
  skipUserAgents: ['ELB-HealthChecker/2.0', 'ELB-HealthChecker/1.0'],
  debugHeader: 'X-Lab100-Debug'
}

module.exports = Config
