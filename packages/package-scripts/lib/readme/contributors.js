'use strict'

const fp = require('lodash/fp')
const heading = require('mdast-util-heading-range')
const { HEADING_CONTRIBUTORS, PKG } = require('../constants')

module.exports = () => transformer

function transformer (tree) {
  const { contributors } = PKG
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

  function mapContributors (item) {
    return {
      type: 'listItem',
      children: [
        {
          type: 'link',
          url: item.email ? `mailto:${item.email}` : item.url,
          children: [{ type: 'text', value: item.name }]
        }
      ]
    }
  }
}
