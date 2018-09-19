'use strict'

const Listr = require('listr')

const {
  README_PATH,
  AUTHORS_PATH,
  PKG_PATH,
  LICENSE_PATH,
  IN_REPO
} = require('./constants')
const utils = require('./utils')

module.exports = () =>
  new Listr([
    {
      title: 'Hashing package.json',
      task: ctx =>
        utils
          .readFile(PKG_PATH)
          .then(data => utils.hash(data))
          .then(hash => (ctx.hash = { ...ctx.hash, pkg: hash }))
    },
    {
      title: 'Hashing AUTHORS',
      enabled: () => IN_REPO,
      task: ctx =>
        utils
          .readFile(AUTHORS_PATH)
          .then(data => utils.hash(data))
          .then(hash => (ctx.hash = { ...ctx.hash, authors: hash }))
    },
    {
      title: 'Hashing README.md',
      task: ctx =>
        utils
          .readFile(README_PATH)
          .then(data => utils.hash(data))
          .then(hash => (ctx.hash = { ...ctx.hash, readme: hash }))
    },
    {
      title: 'Hashing LICENSE',
      task: ctx =>
        utils
          .readFile(LICENSE_PATH)
          .then(data => utils.hash(data))
          .then(hash => (ctx.hash = { ...ctx.hash, license: hash }))
    }
  ])
