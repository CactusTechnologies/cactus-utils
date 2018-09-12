'use strict'

const heading = require('mdast-util-heading-range')
const { USAGE, HAS_EXAMPLE } = require('../constants')

module.exports = HAS_EXAMPLE
  ? require('remark-usage')
  : () => tree => {
    heading(tree, USAGE, mutator)
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
