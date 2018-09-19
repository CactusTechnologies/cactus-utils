'use strict'

const heading = require('mdast-util-heading-range')
const { HEADING_CLOG, CLOG_PATH } = require('../constants')
const utils = require('../utils')

const changeLog = {
  type: 'paragraph',
  children: [
    {
      type: 'text',
      value: 'Find the CHANGELOG '
    },
    {
      type: 'link',
      url: 'CHANGELOG.md',
      children: [{ type: 'text', value: 'here' }]
    },
    {
      type: 'text',
      value: ', generated using Conventional Commits.'
    }
  ]
}

module.exports = () => tree => {
  if (!utils.exists(CLOG_PATH)) return tree
  heading(tree, HEADING_CLOG, (start, nodes, end) => [start, changeLog, end])
}
