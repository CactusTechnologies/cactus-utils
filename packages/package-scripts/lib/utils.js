'use strict'

const fs = require('fs')
const fp = require('lodash/fp')
const revHash = require('rev-hash')
const stringify = require('json-stable-stringify')

const { promisify } = require('util')
const loadFile = promisify(fs.readFile)
const saveFile = promisify(fs.writeFile)
const loadJson = require('load-json-file')
const saveJson = require('write-json-file')

const exists = path => fs.existsSync(path)

const readFile = (path, noFail = true) =>
  noFail === false
    ? loadFile(path)
    : exists(path)
      ? loadFile(path)
      : Promise.resolve('')

const readJson = path => (exists(path) ? loadJson(path) : Promise.resolve({}))

const writeJson = (p, d) => saveJson(p, d, { detectIndent: true })
const writeFile = (p, d) => saveFile(p, d, 'utf8')

const onError = err => {
  throw err
}

const hash = input => {
  if (fp.isString(input)) return revHash(fp.kebabCase(input))
  return revHash(stringify(input))
}

const unParsePerson = person => {
  if (typeof person === 'string') return person
  var name = person.name || ''
  var u = person.url || person.web
  var url = u ? ' (' + u + ')' : ''
  var e = person.email || person.mail
  var email = e ? ' <' + e + '>' : ''
  return name + email + url
}

const parsePerson = person => {
  if (typeof person !== 'string') return person
  var name = person.match(/^([^(<]+)/)
  var url = person.match(/\(([^)]+)\)/)
  var email = person.match(/<([^>]+)>/)
  var obj = {}
  if (name && name[0].trim()) obj.name = name[0].trim()
  if (email) obj.email = email[1]
  if (url) obj.url = url[1]
  return obj
}

module.exports = {
  exists,
  readFile,
  readJson,
  writeJson,
  writeFile,
  onError,
  hash,
  unParsePerson,
  parsePerson
}
