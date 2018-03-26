const bunyanCloudwatch = require('bunyan-cloudwatch')
const bunyanPretty = require('@mechanicalhuman/bunyan-pretty')

exports.pretty = (stream = process.stdout, opt) => bunyanPretty(stream, opt)
exports.cloudWatch = opt => bunyanCloudwatch(opt)
