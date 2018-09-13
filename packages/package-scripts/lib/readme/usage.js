'use strict'

const heading = require('mdast-util-heading-range')
const { HEADING_USAGE, HAS_EXAMPLE } = require('../constants')

module.exports = HAS_EXAMPLE
  ? require('remark-usage')
  : () => tree => {
    heading(tree, HEADING_USAGE, mutator)
    function mutator (start, nodes, end) {
      return [
        start,
        ...nodes,
        // {
        //   type: 'paragraph',
        //   children: [
        //     {
        //       type: 'text',
        //       value: 'Cannot find a valid `example.js` in the project'
        //     }
        //   ]
        // },
        end
      ]
    }
  }
