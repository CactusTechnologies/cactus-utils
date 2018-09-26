'use strict'

const fs = require('fs')
const fp = require('lodash/fp')
const revHash = require('rev-hash')
const stringify = require('json-stable-stringify')
const { promisify } = require('util')
const loadJson = require('load-json-file')
const saveJson = require('write-json-file')
const findUp = require('find-up')

const loadFile = promisify(fs.readFile)
const saveFile = promisify(fs.writeFile)
const isStr = fp.isString

const exists = path => fs.existsSync(path)

const readFile = path => (exists(path) ? loadFile(path) : Promise.resolve(''))
const readJson = path => (exists(path) ? loadJson(path) : Promise.resolve({}))

const writeJson = (p, d) => saveJson(p, d, { detectIndent: true })
const writeFile = (p, d) => saveFile(p, d, 'utf8')

const onError = err => {
  throw err
}

const wait = async () => promisify(setTimeout)(1000)

const hash = i => (isStr(i) ? revHash(i) : revHash(stringify(i)))

const unParsePerson = person => {
  if (isStr(person)) return person
  const name = person.name || ''
  const u = person.url || person.web
  const url = u ? ' (' + u + ')' : ''
  const e = person.email || person.mail
  const email = e ? ' <' + e + '>' : ''
  return name + email + url
}

const parsePerson = person => {
  if (!isStr(person)) return person
  const name = person.match(/^([^(<]+)/)
  const url = person.match(/\(([^)]+)\)/)
  const email = person.match(/<([^>]+)>/)
  const obj = {}
  if (name && name[0].trim()) obj.name = name[0].trim()
  if (email) obj.email = email[1]
  if (url) obj.url = url[1]
  return obj
}

/**
 * Transforms a .gitignore to a blob array
 *
 * Inspired by https://github.com/EE/gitignore-to-glob
 */

const ignore = () => {
  const gitignorePath = findUp.sync('.gitignore')
  const defaultIgnores = [
    '!**/node_modules/**',
    '!*/**/*.min.*',
    '!*/**/*.map.*'
  ]
  const fileToBlobs = fp.pipe(
    fs.readFileSync,
    fp.split('\n'),
    fp.reject(fp.anyPass([fp.isEmpty, fp.startsWith('#')])),
    fp.map(
      fp.pipe(
        p => (p[0] === '!' ? ['', p.substring(1)] : ['!', p]),
        pp => {
          const p = pp[1]
          if (p[0] !== '/') {
            return [pp[0], `**/${p}`]
          }
          return [pp[0], p.substring(1)]
        }
      )
    ),
    fp.reduce((result, patternPair) => {
      const pattern = patternPair.join('')
      result.push(pattern)
      result.push(`${pattern}/**`)
      return result
    }, []),
    fp.concat(defaultIgnores),
    fp.compact,
    fp.uniq
  )

  if (!gitignorePath) return defaultIgnores
  return fileToBlobs(gitignorePath)
}

module.exports = {
  wait,
  exists,
  readFile,
  readJson,
  writeJson,
  writeFile,
  onError,
  ignore,
  hash,
  unParsePerson,
  parsePerson
}
