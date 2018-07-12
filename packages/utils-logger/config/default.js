const raw = require('config/raw').raw

module.exports = {
  level: 'info',
  pretty: false,
  stream: raw(process.stdout)
}
