const importLazy = require('import-lazy')(require)
const bunyanPretty = importLazy('@mechanicalhuman/bunyan-pretty')
const bunyanCloudwatch = importLazy('bunyan-cloudwatch')

exports.pretty = (stream, opt) => bunyanPretty(stream, opt)
exports.cloudWatch = opt => bunyanCloudwatch(opt)
