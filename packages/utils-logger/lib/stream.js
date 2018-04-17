const Config = require('config')

module.exports =
  Config.get('logs.pretty') === true
    ? require('@mechanicalhuman/bunyan-pretty')(process.stdout, {
      colorLevel: 2,
      timeStamps: false
    })
    : process.stdout
