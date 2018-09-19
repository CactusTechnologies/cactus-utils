'use strict'

const { HAS_EXAMPLE } = require('../constants')

module.exports = HAS_EXAMPLE ? require('remark-usage') : () => tree => tree
