'use strict'

const path = require('path')
const fs = require('fs')
const gitParser = require('git-url-parse')
const fp = require('lodash/fp')

exports.HEADING_CONTRIBUTORS = 'Maintainers'
exports.HEADING_INSTALL = 'Installation'
exports.HEADING_USAGE = 'Usage'

exports.README_PATH = path.resolve(process.cwd(), 'README.md')
exports.PKG_PATH = path.resolve(process.cwd(), 'package.json')
exports.PKG = require(exports.PKG_PATH)
exports.HAS_REPO = fp.has('repository.url', exports.PKG)

const repoData = exports.HAS_REPO
  ? fp.pipe(
    fp.constant(exports.PKG),
    fp.get('repository.url'),
    gitParser
  )()
  : false

exports.REPO_BASE = exports.HAS_REPO ? repoData.name : false
exports.REPO_SSH = exports.HAS_REPO ? repoData.toString('ssh') : false
exports.REPO_HTTP = exports.HAS_REPO ? repoData.toString('https') : false
exports.REPO_IS_GITHUB = exports.HAS_REPO && repoData.source === 'github.com'
exports.REPO_GITHUB_BASE = exports.REPO_IS_GITHUB ? repoData.full_name : false

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
