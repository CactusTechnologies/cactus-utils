'use strict'

const Listr = require('listr')
const execa = require('execa')
const fp = require('lodash/fp')

const {
  README_PATH,
  AUTHORS_PATH,
  LICENSE_PATH,
  PKG_PATH,
  TODO_PATH,
  IN_REPO
} = require('../constants')

const utils = require('../utils')

const worker = (FILE_PATH, HASH_PATH) => async (ctx, task) => {
  const oldHash = fp.getOr('', `hash.${HASH_PATH}`)(ctx)
  const newHash = await utils.readFile(FILE_PATH).then(data => utils.hash(data))
  if (oldHash === newHash) task.skip('File Unchanged')
  if (oldHash !== newHash) return execa.stdout('git', ['add', FILE_PATH])
}

module.exports = () =>
  new Listr([
    {
      title: 'Add package.json',
      task: worker(PKG_PATH, 'pkg')
    },
    {
      title: 'Add AUTHORS',
      enabled: () => IN_REPO,
      task: worker(AUTHORS_PATH, 'authors')
    },
    {
      title: 'Add README.md',
      task: worker(README_PATH, 'readme')
    },
    {
      title: 'Add LICENSE',
      task: worker(LICENSE_PATH, 'license')
    },
    {
      title: 'Add TODO.md',
      skip: ctx => ctx.todos === false,
      task: worker(TODO_PATH, 'todos')
    }
  ])
