'use strict'

const fp = require('lodash/fp')
const heading = require('mdast-util-heading-range')

const { HEADING_INSTALL } = require('../constants')

const IS_GLOBAL = fp.getOr(false, 'preferGlobal')
const IS_DEV = fp.getOr(false, 'preferDev')
const IS_PRIVATE = fp.getOr(false, 'private')
const HAS_REPO = fp.has('repository.url')

module.exports = ({ pkg, repoData }) => tree => {
  return IS_PRIVATE(pkg) && !HAS_REPO(pkg)
    ? tree
    : heading(tree, HEADING_INSTALL, mutator)

  function mutator (start, nodes, end) {
    return [start, { type: 'code', lang: 'sh', value: install() }, end]
  }

  function install () {
    if (IS_GLOBAL(pkg)) return `npm install ${pkg.name} --global`
    if (IS_DEV(pkg)) return `npm install ${pkg.name} --save-dev`
    if (IS_PRIVATE(pkg)) {
      return `git clone ${repoData.toString('ssh')} ${repoData.name}
  cd ${repoData.name}
  npm install`
    }
    return `npm install ${pkg.name}`
  }
}
