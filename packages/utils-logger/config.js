const Config = {}

Config.level = 'info'
Config.src = false

Config.pretty = false
Config.cloudWatch = false

Config.http = {
  obscureHeaders: ['authorization', 'x-lab100-app-secret'],
  excludeHeaders: [
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
