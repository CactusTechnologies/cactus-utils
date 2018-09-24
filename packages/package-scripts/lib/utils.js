'use strict'

const fs = require('fs')
const fp = require('lodash/fp')
const path = require('path')
const revHash = require('rev-hash')
const stringify = require('json-stable-stringify')
const { promisify } = require('util')
const loadJson = require('load-json-file')
const saveJson = require('write-json-file')

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
 * gitignore-to-glob
 * https://github.com/EE/gitignore-to-glob
 *
 * Author Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

const ignore = () => {
  const gitignorePath = path.resolve(process.cwd(), '.gitignore')
  if (!exists(gitignorePath)) return []
  return (
    fs
      .readFileSync(gitignorePath, { encoding: 'utf8' })
      .split('\n')

      // Filter out empty lines and comments.
      .filter(pattern => !!pattern && pattern[0] !== '#')

      // '!' in .gitignore and glob mean opposite things so we need to swap it.
      // Return pairt [ignoreFlag, pattern], we'll concatenate it later.
      .map(
        pattern =>
          pattern[0] === '!' ? ['', pattern.substring(1)] : ['!', pattern]
      )

    // Filter out hidden files/directories (i.e. starting with a dot).
    // .filter(patternPair => {
    //   const pattern = patternPair[1]
    //   return pattern.indexOf('/.') === -1 && pattern.indexOf('.') !== 0
    // })

    // There may be a lot of files outside of directories from `dirsToCheck`, don't ignore
    // them wasting time.
    // .filter(patternPair => {
    //   const pattern = patternPair[1]
    //   return pattern[0] !== '/'
    // })

      // Patterns not starting with '/' are in fact "starting" with '**/'. Since that would
      // catch a lot of files, restrict it to directories we check.
      // Patterns starting with '/' are relative to the project directory and glob would
      // treat them as relative to the OS root directory so strip the slash then.
      .map(patternPair => {
        const pattern = patternPair[1]
        if (pattern[0] !== '/') {
          return [patternPair[0], `**/${pattern}`]
        }
        return [patternPair[0], pattern.substring(1)]
      })

      // We don't know whether a pattern points to a directory or a file and we need files.
      // Therefore, include both `pattern` and `pattern/**` for every pattern in the array.
      .reduce((result, patternPair) => {
        const pattern = patternPair.join('')
        result.push(pattern)
        result.push(`${pattern}/**`)
        return result
      }, [])
  )
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
