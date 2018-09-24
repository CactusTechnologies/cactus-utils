'use strict'

const fp = require('lodash/fp')
const { AUTHORS_PATH } = require('../constants')
const utils = require('../utils')

const authors = fp.pipe(
  fp.get('contributors'),
  fp.map(utils.unParsePerson),
  fp.join('\n')
)

module.exports = ctx => utils.writeFile(AUTHORS_PATH, authors(ctx))
