const bunyanPretty = require('@mechanicalhuman/bunyan-pretty')
const bunyanCloudwatch = require('bunyan-cloudwatch')

exports.pretty = (stream, opt) => bunyanPretty(stream, opt)
exports.cloudWatch = opt => bunyanCloudwatch(opt)
