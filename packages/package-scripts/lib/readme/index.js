'use strict'

require('util').inspect.defaultOptions.maxArrayLength = 10
require('util').inspect.defaultOptions.depth = 5

const fs = require('fs')
const path = require('path')

const { promisify } = require('util')

const remark = require('remark')

const license = require('remark-license')
const toc = require('remark-toc')
const title = require('./title')
const install = require('./install')
const contributors = require('./contributors')
const normalize = require('./normalize')
const usage = require('./usage')

const { README_PATH, HAS_REPO, REPO_HTTP } = require('../constants')

const readme = remark()
const compile = promisify(readme.process.bind(readme))
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

readme.use(title)
readme.use(install)
readme.use(usage)
readme.use(contributors)
readme.use(license)
readme.use(toc)
readme.use(normalize)

if (HAS_REPO) readme.use(require('remark-github'), { repository: REPO_HTTP })

readFile(README_PATH)
  .catch(() => readFile(path.resolve(__dirname, 'template.txt')))
  .then(readme => compile(readme))
  .then(data => writeFile(README_PATH, data))
  .catch(onError)

function onError (err) {
  throw err
}
