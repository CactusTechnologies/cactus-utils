'use strict'

const fp = require('lodash/fp')
const heading = require('mdast-util-heading-range')

const { INSTALL, PKG, HAS_REPO, REPO_SSH, REPO_BASE } = require('../constants')

const IS_GLOBAL = fp.getOr(false, 'preferGlobal')(PKG)
const IS_DEV = fp.getOr(false, 'preferDev')(PKG)
const IS_PRIVATE = fp.getOr(false, 'private')(PKG)

module.exports = () => tree =>
  IS_PRIVATE && !HAS_REPO ? tree : heading(tree, INSTALL, mutator)

function mutator (start, nodes, end) {
  return [
    start,
    {
      type: 'code',
      lang: 'sh',
      value: getInstallInstructions()
    },
    end
  ]
}

function getInstallInstructions () {
  if (IS_GLOBAL) return `npm install ${PKG.name} --global`
  if (IS_DEV) return `npm install ${PKG.name} --save-dev`
  if (IS_PRIVATE) {
    return `git clone ${REPO_SSH} ${REPO_BASE}
cd ${REPO_BASE}
npm install`
  }
  return `npm install ${PKG.name}`
}
