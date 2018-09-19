'use strict'

const path = require('path')
const fs = require('fs')
const fp = require('lodash/fp')
const execa = require('execa')
const utils = require('./utils')

exports.HEADING_CONTRIBUTORS = 'Maintainers'
exports.HEADING_INSTALL = 'Installation'
exports.HEADING_USAGE = 'Usage'
exports.HEADING_CLOG = 'Changelog'
exports.HEADING_TODOS = 'TODOs'
exports.HEADING_DOCS = 'API'

try {
  execa.sync('git', ['rev-parse', '--is-inside-work-tree'])
  exports.IN_REPO = true
} catch (err) {
  exports.IN_REPO = false
}

exports.CWD = process.cwd()
exports.README_PATH = path.resolve(process.cwd(), 'README.md')
exports.README_TP_PATH = path.resolve(process.cwd(), 'lib/readme/template.txt')
exports.AUTHORS_PATH = path.resolve(process.cwd(), 'AUTHORS')
exports.PKG_PATH = path.resolve(process.cwd(), 'package.json')
exports.TODO_PATH = path.resolve(process.cwd(), 'TODO.md')
exports.LICENSE_PATH = path.resolve(process.cwd(), 'LICENSE')
exports.CLOG_PATH = path.resolve(process.cwd(), 'CHANGELOG.md')

exports.AUTHOR = 'Cactus Technologies LLC <hi@cactus.is> (http://www.cactus.is)'

exports.HAS_PKG = utils.exists(exports.PKG_PATH)
exports.ERR_PKG =
  "No package.json found. Make sure you're in the correct project."
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
