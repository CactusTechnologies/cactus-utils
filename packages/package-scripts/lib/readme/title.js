'use strict'

const fp = require('lodash/fp')
const inspect = require('unist-util-inspect')
const { PKG } = require('../constants')

const isBlockQuote = fp.propEq('type', 'blockquote')
const isImage = fp.propEq('type', 'image')
const isBadge = fp.allPass([
  isImage,
  fp.pipe(
    fp.getOr('none', 'url'),
    fp.startsWith('https://img.shields.io')
  )
])

const isBreak = fp.propEq('type', 'thematicBreak')
const isBanner = fp.negate(isBadge)
const isHeading = fp.propEq('type', 'heading')
const isH1 = fp.allPass([isHeading, fp.propEq('depth', 1)])
const isH2 = fp.allPass([isHeading, fp.propEq('depth', 2)])

const headIsH1 = fp.pipe([fp.head, isH1])
const headIsH2 = fp.pipe([fp.head, isH2])
const headIsBanner = fp.pipe([fp.head, isBanner])
const headIsBlockQuote = fp.pipe([fp.head, isBlockQuote])
const headIsBreak = fp.pipe([fp.head, isBreak])
/**
 * @type {Array<Object>}
 */
const heading = [
  {
    type: 'heading',
    depth: 1,
    children: [{ type: 'text', value: PKG.name }]
  }
]

const description = {
  type: 'blockquote',
  children: [
    {
      type: 'paragraph',
      children: [{ type: 'text', value: PKG.description }]
    }
  ]
}

// const badges = [
//   {
//     type: 'image',
//     https://img.shields.io/badge/version-1.0.0-green.svg
//   }
// ]

module.exports = () => transformer

function transformer (tree) {
  const nodes = getCurrentHeader(tree)
  // if (headIsBanner(nodes)) heading.push(nodes.shift())

  tree.children = [
    ...heading,
    description,
    // ...nodes,
    { type: 'thematicBreak' },
    ...tree.children
  ]

  console.log(inspect(tree))
}

// ────────────────────────────────  private  ──────────────────────────────────

function getCurrentHeader (tree) {
  const heading = []
  while (headIsH2(tree.children) === false) {
    if (headIsH1(tree.children)) return tree.children.shift()
    if (headIsBlockQuote(tree.children)) return tree.children.shift()
    if (headIsBreak(tree.children)) return tree.children.shift()
    heading.push(tree.children.shift())
  }
  return heading
}

function getHero (nodes) {
  if (headIsBanner(nodes)) heading.push(nodes.shift())
  return nodes
}

function addDescription (nodes) {
  const desc = heading.push(desc)
  return nodes
}

function filterBlock (nodes) {
  if (headIsBanner(nodes)) heading.push(nodes.shift())
}

function setTitle (tree) {
  if (hasTitle(tree)) tree.children.shift()
  tree.children.unshift(title)
}
function setDescription (nodes) {
  if (hasDescription(nodes)) nodes.shift()
  nodes.unshift(description)
}
