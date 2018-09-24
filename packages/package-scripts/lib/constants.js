'use strict'

const path = require('path')
const fs = require('fs')
const fp = require('lodash/fp')
const execa = require('execa')

exports.HEADING_CONTRIBUTORS = 'Maintainers'
exports.HEADING_INSTALL = 'Installation'
exports.HEADING_USAGE = 'Usage'
exports.HEADING_CLOG = 'Changelog'
exports.HEADING_TODOS = 'TODOs'
exports.HEADING_DOCS = 'API'

exports.IN_REPO = isInRepo()

exports.README_PATH = findFile('README.md')
exports.AUTHORS_PATH = findFile('AUTHORS')
exports.PKG_PATH = findFile('package.json')
exports.TODO_PATH = findFile('TODO.md')
exports.LICENSE_PATH = findFile('LICENSE')
exports.CLOG_PATH = findFile('CHANGELOG.md')

exports.README_TP_PATH = path.resolve(__dirname, './fixtures', 'readme.txt')

exports.AUTHOR = 'Cactus Technologies LLC <hi@cactus.is> (http://www.cactus.is)'

exports.ERR_PKG = 'No package.json found.'
exports.ERR_GIT = 'No git remote configuration found.'

exports.GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN || false

exports.HAS_EXAMPLE = fp.pipe(
  fp.constant([
    'docs/example.js',
    'doc/example.js',
    'examples/index.js',
    'example/index.js',
    'example.js'
  ]),
  fp.map(v => path.resolve(process.cwd(), v)),
  fp.some(fs.existsSync)
)()

// ────────────────────────────────  private  ──────────────────────────────────

function isInRepo () {
  try {
    execa.sync('git', ['rev-parse', '--is-inside-work-tree'])
    return true
  } catch (err) {
    return false
  }
}

/**
 * Creates an absolute path to the target file.
 * It takes the cwd as the root.
 *
 * @param {string} filename - name for the file
 * @returns {string} Path to the file.
 */
function findFile (filename) {
  return path.resolve(process.cwd(), filename)
}
