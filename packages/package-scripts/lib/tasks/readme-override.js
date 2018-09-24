'use strict'

const { README_PATH, README_TP_PATH } = require('../constants')
const utils = require('../utils')

module.exports = () =>
  utils
    .readFile(README_TP_PATH)
    .then(data => utils.writeFile(README_PATH, data))
