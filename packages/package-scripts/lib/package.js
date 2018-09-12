'use strict'

const path = require('path')
const { promisify } = require('util')
const fp = require('lodash/fp')
const writeJson = require('write-json-file')
const gitUrlParse = require('git-url-parse')

const PKG_PATH = path.resolve(process.cwd(), 'package.json')
const readPackage = promisify(require('read-package-json'))

cleanPackage()
  // @ts-ignore
  .then(() => readPackage(PKG_PATH))
  .then(fp.omit(['_id', 'readmeFilename', 'readme']))
  .then(fp.update('repository.url', repoAsSSH))
  .then(require('sort-package-json'))
  // @ts-ignore
  .then(pkg => writeJson(PKG_PATH, pkg, { detectIndent: true }))

function repoAsSSH (url) {
  if (!url) return undefined
  return gitUrlParse(url).toString('ssh')
}

async function cleanPackage () {
  const clean = fp.pipe(
    require,
    fp.omit(['contributors'])
  )

  return writeJson(PKG_PATH, clean(PKG_PATH), { detectIndent: true })
}
