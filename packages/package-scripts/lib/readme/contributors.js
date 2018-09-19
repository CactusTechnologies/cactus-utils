'use strict'

const fp = require('lodash/fp')
const heading = require('mdast-util-heading-range')
const { HEADING_CONTRIBUTORS } = require('../constants')

module.exports = ({ contributors }) => tree => {
  if (fp.isEmpty(contributors)) return tree
  heading(tree, HEADING_CONTRIBUTORS, mutator)
  function mutator (start, nodes, end) {
    return [
      start,
      {
        type: 'list',
        ordered: false,
        children: fp.map(mapContributors)(contributors)
      },
      end
    ]
  }
}

function mapContributors (item) {
  return {
    type: 'listItem',
    children: [
      {
        type: 'link',
        url: item.url ? item.url : `mailto:${item.email}`,
        children: [{ type: 'text', value: item.name }]
      }
    ]
  }
}
