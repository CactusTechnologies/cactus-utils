'use strict'

const fp = require('lodash/fp')
const debug = require('debug')('cactus:app:conf')
const config = require('config')

const defaultBase = require('./create-base-config')()

const configBase = fp.pick(Object.keys(defaultBase), config)
const merged = config.util.extendDeep({}, defaultBase, configBase)
const diff = config.util.diffDeep(configBase, merged)

const IS_VALID_CONFIG = fp.isEmpty(diff)

if (!IS_VALID_CONFIG) debug('Extending config with: %O', diff)
if (!IS_VALID_CONFIG) config.util.extendDeep(config, diff)

module.exports = config
