'use strict'

const path = require('path')
const fs = require('fs')

const PACKAGE = path.resolve(__dirname, '..', 'package.json')
const AUTHORS = path.resolve(__dirname, '..', 'AUTHORS')

if (!fs.existsSync(AUTHORS)) {
  console.log('No AUTHORS file found')
  process.exit()
}

if (!fs.existsSync(PACKAGE)) {
  console.log('No package.json file found')
  process.exit()
}

const pkg = require(PACKAGE)

pkg.contributors = fs
  .readFileSync(AUTHORS, 'utf8')
  .split(/\r?\n/g)
  .map(function (line) {
    return line.replace(/^\s*#.*$/, '').trim()
  })
  .filter(function (line) {
    return line
  })

fs.writeFileSync(PACKAGE, JSON.stringify(pkg, null, 2))
