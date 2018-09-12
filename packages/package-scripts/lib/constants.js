'use strict'

const path = require('path')
const fs = require('fs')
const gitParser = require('git-url-parse')
const fp = require('lodash/fp')

exports.CONTRIBUTORS = 'Maintainers'
exports.INSTALL = 'Installation'
exports.USAGE = 'Usage'

exports.README_PATH = path.resolve(process.cwd(), 'README.md')
exports.PKG_PATH = path.resolve(process.cwd(), 'package.json')
exports.PKG = require(exports.PKG_PATH)
exports.HAS_REPO = fp.has('repository.url', exports.PKG)

exports.REPO_SSH = exports.HAS_REPO
  ? fp.pipe(
    fp.constant(exports.PKG),
    fp.get('repository.url'),
    gitParser,
    fp.invokeArgs('toString', ['ssh'])
  )()
  : false

exports.REPO_BASE = exports.HAS_REPO
  ? fp.pipe(
    fp.constant(exports.PKG),
    fp.get('repository.url'),
    gitParser,
    fp.get('name')
  )()
  : false

exports.REPO_HTTP = exports.HAS_REPO
  ? fp.pipe(
    fp.constant(exports.PKG),
    fp.get('repository.url'),
    gitParser,
    fp.invokeArgs('toString', ['https'])
  )()
  : false

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
