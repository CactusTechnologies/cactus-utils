'use strict'

const fp = require('lodash/fp')

const isBlockQuote = fp.propEq('type', 'blockquote')
const isImage = fp.propEq('type', 'image')
const isBadge = fp.allPass([
  isImage,
  fp.pipe(
    fp.getOr('none', 'url'),
    fp.startsWith('https://img.shields.io')
  )
])

const isBanner = fp.allPass([
  isImage,
  fp.negate(
    fp.pipe(
      fp.getOr('none', 'url'),
      fp.startsWith('https://img.shields.io')
    )
  )
])

const isBreak = fp.propEq('type', 'thematicBreak')
const isHeading = fp.propEq('type', 'heading')
const isH1 = fp.allPass([isHeading, fp.propEq('depth', 1)])
const isH2 = fp.allPass([isHeading, fp.propEq('depth', 2)])

const headIsH2 = fp.pipe([fp.head, isH2])

const isModule = fp.pipe(
  fp.getOr(false, 'private'),
  fp.isEqual(false)
)

const isPublic = fp.pipe(
  fp.getOr('private', 'publishConfig.access'),
  fp.isEqual('public')
)

module.exports = ({ pkg }) => tree => {
  const heading = {
    type: 'heading',
    depth: 1,
    children: [{ type: 'text', value: pkg.name }]
  }

  const description = {
    type: 'blockquote',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: pkg.description }]
      }
    ]
  }

  const badges = {
    type: 'paragraph',
    children: [makeBadge('version', pkg.version)]
  }

  if (isModule(pkg)) {
    const publicStatus = isPublic(pkg) ? 'public' : 'private'
    badges.children.push({ type: 'text', value: '\n' })
    badges.children.push(makeBadge('npm', publicStatus, isPublic(pkg)))
  }

  const nodes = fp.pipe(
    getCurrentHeader,
    fp.reject(fp.anyPass([isH1, isBreak, isBlockQuote, isBadge])),
    fp.groupBy(isImage),
    head => ({
      images: fp.getOr([], 'true')(head),
      extras: fp.getOr([], 'false')(head)
    }),
    head => ({
      banner: fp.find(isBanner)(head.images) || false,
      extras: head.extras
    }),
    head => [
      heading,
      head.banner,
      badges,
      description,
      ...head.extras,
      { type: 'thematicBreak' }
    ],
    fp.reject(fp.isEmpty),
    fp.compact,
    fp.uniq
  )(tree)

  tree.children = [...nodes, ...tree.children]
}

// ────────────────────────────────  private  ──────────────────────────────────

function getCurrentHeader (tree) {
  const heading = []
  while (headIsH2(tree.children) === false && tree.children.length > 0) {
    heading.push(tree.children.shift())
  }
  return heading
}

function makeBadge (name, value, ok = true) {
  const color = fp.isString(ok) === true ? ok : ok === true ? 'green' : 'red'

  return {
    type: 'image',
    alt: name,
    url: `https://img.shields.io/badge/${name}-${value}-${color}.svg`
  }
}
