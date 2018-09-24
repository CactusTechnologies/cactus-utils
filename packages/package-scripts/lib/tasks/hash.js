'use strict'

const Listr = require('listr')

const {
  README_PATH,
  AUTHORS_PATH,
  PKG_PATH,
  LICENSE_PATH,
  TODO_PATH,
  IN_REPO
} = require('../constants')
const utils = require('../utils')

const worker = (FILE_PATH, HASH_PATH) => async ctx => {
  const hash = await utils.readFile(FILE_PATH).then(data => utils.hash(data))
  ctx.hash = { ...ctx.hash, [HASH_PATH]: hash }
}

module.exports = () =>
  new Listr([
    {
      title: 'Hashing package.json',
      task: worker(PKG_PATH, 'pkg')
    },
    {
      title: 'Hashing AUTHORS',
      enabled: () => IN_REPO,
      task: worker(AUTHORS_PATH, 'authors')
    },
    {
      title: 'Hashing README.md',
      task: worker(README_PATH, 'readme')
    },
    {
      title: 'Hashing LICENSE',
      task: worker(LICENSE_PATH, 'license')
    },
    {
      title: 'Hashing TODO.md',
      skip: ctx => ctx.todos === false,
      task: worker(TODO_PATH, 'todos')
    }
  ])
